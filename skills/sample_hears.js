/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

var wordfilter = require('wordfilter');
var _ = require("underscore");
var dataChannel;

const { WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.slackToken;

const web = new WebClient(token);

module.exports = function(controller) {

    /* Collect some very simple runtime stats for use in the uptime/debug command */
    var stats = {
        triggers: 0,
        convos: 0,
    }
    

    controller.on('heard_trigger', function() {
        stats.triggers++;
    });

    controller.on('conversationStarted', function() {
        stats.convos++;
    });


    controller.hears(['^uptime','^debug'], 'direct_message,direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {
            if (!err) {
                convo.setVar('uptime', formatUptime(process.uptime()));
                convo.setVar('convos', stats.convos);
                convo.setVar('triggers', stats.triggers);

                convo.say('My main process has been online for {{vars.uptime}}. Since booting, I have heard {{vars.triggers}} triggers, and conducted {{vars.convos}} conversations.');
                convo.activate();
            }
        });

    });
  
  controller.hears('^storage (.*)','direct_message',function(bot,message) {
    var theBot = bot;
    
    if (message.channel == dataChannel) {
      console.log("we are in the special listening channel " + dataChannel);
    } else {
      console.log("we are not in the special channel " + dataChannel);
    }

    console.log("message: " + JSON.stringify(message));
    var storageType = message.match[1];

    controller.storage[storageType].all(function(err,storage) {

      console.log("storage: " + JSON.stringify(storage));

      theBot.reply(message, JSON.stringify(storage));

      if (err) {
        throw new Error(err);
      }

    });
  });
  
  controller.hears('start','direct_message,ambient',function(bot,message) {
    var currentChannel;
    var user = message.user;
    
    web.channels.join('labyrinthPuzzle').then((res) => {
      console.log("created labyrinth channel: " + JSON.stringify(res.channel));
      var newChannel = res.channel["id"];
      dataChannel = newChannel;
      
      web.users.list().then((res) => {
        console.log(res.members.length);
        // `res` contains information about the channels
        for (var i = 0; i < res.members.length; i++) {
          console.log(res.members[i]);
          // check if user is bot before adding
          // TODO check if user is already in channel
          if (!res.members[i].is_bot || res.members[i].name != "slackbot" ) {
            var member = res.members[i]["id"];
             web.channels.invite(newChannel, member).then((res) => {
               console.log(res + " joined the labyrinth");

             }).catch((err) => { console.log(err) });
          }
          
        }
      }).catch((err) => { console.log(err) });
    }).catch((err) => { console.log(err) });
  });
  
  controller.hears('map','direct_message,direct_mention,ambient',function(bot,message) {

    // console.log("message: " + JSON.stringify(message));
    var team = message.team ? message.team : message.team_id;
    var mapLink = "/" + team + "/map";
    console.log(mapLink, "is the map link for this team" );
    
    bot.reply(message, {
      'text': 'Follow this link for the team map',
      'attachments': [
          {
            "title": "Team Map",
            "title_link": "https://languid-car.glitch.me" + mapLink,
          }
       ]
    });
    
  }); // End hears "map"
  
  controller.hears( ['labyrinth'], 'direct_message,ambient', function( bot, message ) {

    console.log( "message: " + JSON.stringify( message ) );

    controller.studio.run(bot, 'welcome', message.user, message.channel).catch(function(err) {
        bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
    });
    
  }); // End hears "labyrinth" 
  
  
  controller.hears("generate", 'direct_message', function(bot, message) {
    
    controller.storage.teams.get(message.team, function(err, team) {
      // console.log(team);
      var puzzles = [];
      controller.studio.getScripts().then(function(list) {
        // console.log(list);
  
        // Go through each script 
         for (var i = 0; i < list.length; i++ ) {
            
           // Check if script is tagged as part of the labyrinth
           if ( _.contains(list[i].tags, 'labyrinth') ) {
               
             // Create a new instance of the tags list
             var tags = list[i].tags;
             // Remove labyrinth from the list
             tags = _.without(tags, 'labyrinth');
             
              var thisPuzzle = {
                room: list[i].name,
                links: [], 
                locked: true, 
                tries: 0
              };
             
              // console.log(tags);

               // Go through each tag
               for (var a = 0; a < tags.length; a++) {
                 // if the tag contains "galaxy" or "Galaxy" 
                 // console.log(tags[a]);
                 if (tags[a].includes("galaxy") || tags[a].includes("Galaxy")) {
                   // set that tag as the puzzle galaxy
                   // console.log("this tag is a galaxy", tags[a]);
                   thisPuzzle.galaxy = tags[a];
                 } else { // If not...
                   // console.log("this tag is a room", tags[a]);
                   // Create a room link based on the number in the tag
                   var roomLink = tags[a].match(/\d+$/)[0];
                   // console.log(roomLink, "is a room link" ); 
                   // Add this link to the links array on the puzzle
                   thisPuzzle.links.push(roomLink);
                 }
               } // End tag loop
              
               // Add this puzzle to the puzzles array
               puzzles.push(thisPuzzle);
                          
           } // End if script is room
           
         } // End Script Loop
        
        // Set the team puzzles to the generated puzzles array
        team.puzzles = puzzles;
        console.log("the team puzzles: ", JSON.stringify(team));
        
        // Save this team
        controller.storage.teams.save(team, function(err, id) {
          if (err) {
            console.log("There was an error: ", err);
          }
          // Check the team to make sure it was updated
          // Team should have a puzzles object now attached
          // controller.storage.teams.get(id, function(err, team) {
          //   console.log("updated: ", team);
          // });
        });

      });
      
      

    });
  });

    controller.hears(['^say (.*)','^say'], 'direct_message,direct_mention', function(bot, message) {
        if (message.match[1]) {

            if (!wordfilter.blacklisted(message.match[1])) {
                bot.reply(message, message.match[1]);
            } else {
                bot.reply(message, '_sigh_');
            }
        } else {
            bot.reply(message, 'I will repeat whatever you say.')
        }
    });


    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
    /* Utility function to format uptime */
    function formatUptime(uptime) {
        var unit = 'second';
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'minute';
        }
        if (uptime > 60) {
            uptime = uptime / 60;
            unit = 'hour';
        }
        if (uptime != 1) {
            unit = unit + 's';
        }

        uptime = parseInt(uptime) + ' ' + unit;
        return uptime;
    }

};

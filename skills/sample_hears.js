/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

var wordfilter = require('wordfilter');
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
    
  });
  
  controller.hears( ['labyrinth'], 'direct_message,ambient', function( bot, message ) {

    console.log( "message: " + JSON.stringify( message ) );

    controller.studio.run(bot, 'welcome', message.user, message.channel).catch(function(err) {
        bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
    });
    
  });
  
  
  controller.hears("generate", 'direct_message', function(bot, message) {
    console.log("heard the word", message);
    var theBot = bot;
    
    controller.storage.teams.get(message.team, function(err, team) {
      console.log(team);
      var puzzles = [];
      controller.studio.getScripts().then(function(list) {
        console.log(list);

         for (var i = 0; i < list.length; i++ ) {
           controller.studio.get(bot, list[i].name, message.user, message.channel).then(function(convo) {
              console.log(convo);
             puzzles.push({
               door: convo.source_message.text
             });
           });
           // var thisPuzzle = {
           //   room: list[i].name
           // };
           // puzzles.push(thisPuzzle);
         }
        
        team.puzzles = puzzles;
        // console.log("the team puzzles: ", team.puzzles);
        
        controller.storage.teams.save(team.id, function(err, team) {
          console.log("updated: ", team);
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

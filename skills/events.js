var _ = require('underscore');

var dataChannel;

const { WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.slackToken;

const web = new WebClient(token);

function findGalaxy(data, num) {

  var thesePuzzles = _.pluck(data, "roomId");
  // console.log(thesePuzzles);
  var thisPuzzle = thesePuzzles.indexOf(num.toString());
  // console.log(thisPuzzle, data[thisPuzzle]);
  if (thisPuzzle >= 0) 
    return data[thisPuzzle].galaxy;
  else return 0;

};

module.exports = function(controller) {
  
    // message sent in the labyrinth channel
    controller.on('ambient', function(bot, message) {
      
      var puzzleChat;
      web.channels.list().then((res) => {
          _.each(res.channels, function(channel) {
            if (channel.name == "labyrinthPuzzle")
              puzzleChat = channel;
          });
      });
      
      if (message.channel == puzzleChat.id) {
        // Message tagging event
        var theBot = bot;
      
        if (message.event.text.includes("#")) {
          // console.log(message.event.text.match(/#[a-z0-9_]+/g));
          controller.trigger('message_tagged', [bot, message, message.event.text.match(/#[a-z0-9_]+/g)]);
        } else {
          
          // delete the message without a tag
//           web.chat.delete(message.ts, message.channel).then((res) => {
            
//              console.log(res + " was deleted bc it was not tagged");

//           }).catch((err) => { console.log(err) });
          
          // trigger the tagging script in botkit studio
          controller.studio.runTrigger(bot, 'tagging', message.user, message.channel).catch(function(err) {
              bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
          });
          
        }
      } else {
        
      }
        

    });
    
    // Tagged a message
    controller.on('message_tagged', function(bot, message, tag) {
      
      // console.log(tag, message);
      
      // console.log(bot, "this bot is listening to taggs");
      // console.log(message, "this message is being tagged");
      var teamId = message.team.id ? message.team.id : message.team_id;
      var thisMessage = message;
      
        controller.storage.teams.get(teamId, function(err,team) {

          if (!team.puzzles) {
             bot.reply(thisMessage, "huh, looks like you haven't started working on that puzzle...are you using the right #tag?"); 
          }
          
          var puzzle = _.where(team.puzzles, { name: tag[0] });
          
          if (!puzzle.discussion) puzzle.discussion = [];
                    
          puzzle.discussion.push(thisMessage);
          
          // console.log(team.puzzles);
          
          console.storage.teams.save(team, function(err, id) {
            // console.log("team updated with tagged message");
          });

          if (err) {
            throw new Error(err);
          }

        });

    });
  
  // Choose a door
  controller.on('door_enter', function(bot, message) {
    // Store that a player approached the door
    
  });
  
  // Attempt a door
  controller.on('puzzle_attempt', function(bot, message, data) {
      
      // console.log(data);
      // Get the team id from the message
      var teamId = message.team.id ? message.team.id : message.team_id;
      
      // Find the team object
      controller.storage.teams.get(teamId, function(err,team) {

        // console.log("team: " + JSON.stringify(team));
        
        if (!team.puzzles) {
          // Just in case
          var options = {
            bot: bot, 
            message: message, 
            forced: false
          };
          controller.trigger("generate", [options]);
        }
        
        // Find this particular puzzle from the team's generated puzzle list
        var puzzle = _.findWhere(team.puzzles, { room: data.puzzle });
        
        if (data.correct) puzzle.locked = false;

        // Add a try to the puzzle
        puzzle.tries++;
        
        // Create the attempt object
        var attempt = {
          answer: data.answer,
          correct: data.correct
        };
        
        // Create the puzzle's attempts list on the puzzle object if none exists
        if (!puzzle.attempts) puzzle.attempts = [];
        
        // Add this puzzle attempt to the puzzle's attempts list
        puzzle.attempts.push(data);
  
        // Save this team
        controller.storage.teams.save(team, function(err, id) {
          controller.storage.teams.get(id, function(err, team) {
            // console.log("this team is updated: ", team);
          });
        });

        if (err) {
          throw new Error(err);
        }

      });

    });
  
  // Map event for sending team the map link
  controller.on("map_event", function(options) {
    
    // bot, message, channel, team
    
    // console.log("map event message: " + JSON.stringify(options.message));
    // Based on the format of "message", set the teamId
    var teamId;
    if (options.team) {
        teamId = options.team.id
    } else if (options.message.team_id) {
        console.log("using the team_id");
        teamId = options.message.team_id;
    } else if (options.message.team.id) {
        console.log("using team object");
        teamId = options.message.team.id;
    } else {
        console.log("just using the team");
        teamId = options.message.team;
    }

    var mapLink = "/" + teamId + "/map";
    // console.log(mapLink, "is the map link for this team" );
    
    if (options.channel) {
      // console.log(options.channel, "is the map channel to post in");
      // Send this message to the specified channel
      options.bot.say({
        'channel': options.channel.id,
        'text': 'Follow this link for the team map',
        'attachments': [
            {
              "title": "Team Map",
              "title_link": process.env.domain + mapLink,
            }
         ]
      });
      
    } else if (options.message) {
    
      // Reply to the user
      options.bot.reply(options.message, {
        'text': 'Follow this link for the team map',
        'attachments': [
            {
              "title": "Team Map",
              "title_link": process.env.domain + mapLink,
            }
         ]
      });
      
    }
    
  });
  
  
    // Labyrinth room script before hook
    // This is called when a player enters a room
    // Will check doors and set their style and value
    controller.on("before_hook", function(bot, message, script) {
      
      // This door leads to the puzzle thread as set up in BotKit Studio
      // The bot "replies" with what the user said
      console.log(script.name, "before hook script");
      
      // console.log("script:" , script);
      
     // var galaxy = script.name.split("_")[0] + "_" + script.name.split("_")[1];
      
      // console.log("galaxy: ", galaxy);
      
      // console.log(message);
        
        // Before the room script runs...
        controller.studio.before(script.name, function(convo, next) {
          console.log(message);
          
          // Based on the format of "message", set the teamId
          var teamId;
          if (message.team_id) {
              console.log("using the team_id");
              teamId = message.team_id;
          } else if (message.team.id) {
              console.log("using team object");
              teamId = message.team.id;
          } else {
              console.log("just using the team");
              teamId = message.team;
          }
          
          // Find team to check puzzles data                   
          controller.storage.teams.get(teamId, function(err, team) {
                                      
            // console.log("the team puzzles are: ", team.puzzles);
              // Go through conversation attachments 
              for (var i = 0; i < convo.messages[0].attachments[0].actions.length; i++) {
                 var action = convo.messages[0].attachments[0].actions[i];
                //   console.log(action, "puzzle button actions");
                // console.log(action.value.match(/\d+/)[0]);
                //  console.log(_.findWhere(team.puzzles, { 
                //    room: findGalaxy(team.puzzles, action.value.match(/\d+/)[0]) + "_Room_" + action.value.match(/\d+/)[0]
                //  }), "is the found puzzle");
                
                 // Find matching puzzle
                 // Room button values should match room names (ie: room_1)
                 var puzzle = _.findWhere(team.puzzles, { 
                   room: findGalaxy(team.puzzles, action.value.match(/\d+/)[0]) +  "_Room_" + action.value.match(/\d+/)[0]
                 });

                
                 // If puzzle is locked, set button style to "danger" or else use "primary" 
                 if (puzzle.locked) {
                   action.style = "danger"; // red
                 } else {
                   action.style = "primary"; // green
                   if (!action.value.includes("_open"))
                     action.value = action.value + "_open";
                 }
              }

          });

          next();

      });
  });
  
}

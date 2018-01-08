var _ = require('underscore');

var dataChannel;

const { WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.slackToken;

const web = new WebClient(token);

module.exports = function(controller) {

    controller.on('user_channel_join,user_group_join', function(bot, message) {

        bot.reply(message, 'Welcome, <@' + message.user + '>');
      
    });
  
    // message sent in the labyrinth channel
    controller.on('ambient', function(bot, message) {
        var theBot = bot;
    
        console.log(message);
            
        console.log(message.channel);
      
        if (message.event.text.includes("#")) {
          console.log(message.event.text.match(/#[a-z0-9_]+/g));
          controller.trigger('message_tagged', [bot, message, message.event.text.match(/#[a-z0-9_]+/g)]);
        } else {
          
          // delete the message without a tag
          web.chat.delete(message.ts, message.channel).then((res) => {
            
             console.log(res + " was deleted bc it was not tagged");

          }).catch((err) => { console.log(err) });
          
          // trigger the tagging script in botkit studio
          controller.studio.runTrigger(bot, 'tagging', message.user, message.channel).catch(function(err) {
              bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
          });
          
        }

    });
    
    // Tagged a message
    controller.on('message_tagged', function(bot, message, tag) {
      
      console.log(tag, message);
      
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
          
          // team.save();

          if (err) {
            throw new Error(err);
          }

        });

    });
  
  // Choose a door
  controller.on('labyrinth_start', function(bot, message) {
    
  });
  
  // Choose a door
  controller.on('door_enter', function(bot, message) {
    
  });
  
  // Attempt a door
  controller.on('puzzle_attempt', function(bot, message, tag) {
      
      console.log(tag);
      
      // console.log(bot, "this bot is listening to taggs");
      // console.log(message, "this message is being tagged");
      var teamId = message.team.id ? message.team.id : message.team_id;
      
        controller.storage.teams.get(teamId, function(err,team) {

          console.log("team: " + JSON.stringify(team));

          if (!team.puzzles) {
             team.puzzles = []; 
          }
          
          var attempt = {
            user: message.user,
            answer: ''
          };
          
          var puzzle = {
            name: tag[0],
            tries: [],
            completed: false
          };
          
          team.puzzles.push(puzzle);

          if (err) {
            throw new Error(err);
          }

        });

    });

  
    controller.on('join_team', function(bot, message) {

        bot.reply(message, 'Welcome, <@' + message.user + '>');

    });

}

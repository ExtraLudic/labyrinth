/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

var wordfilter = require('wordfilter');
var _ = require("underscore");
var dataChannel;
var fs = require('fs');


const { WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.slackToken;

var web = new WebClient(token);

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
      
      // Export the chosen data into a json file
      fs.writeFile('./data/db/storage.json', JSON.stringify(storage), 'utf8', (err) => {
          if (err) throw err;

          console.log("The file was succesfully saved!");
      });


      if (err) {
        throw new Error(err);
      }

    });
  });
  
  controller.hears('start', 'direct_message,ambient', function(bot,message) {
    
    console.log("starting the game!!");
    
    controller.studio.getScripts().then((list) => {
      // console.log(list, " we are listing the list" );
      var script;
      for (var i = 0; i < list.length; i++) {
        var triggers = list[i].triggers;
        // Locate the script based on its triggers
        // If script is listening for the message text, that's our script
        _.each(triggers, function(a) {
          // console.log(triggers);
          if (a.pattern == "enter") {
            script = list[i];
          }
        });
      }
      
      // console.log(script, " start script");
      
      // Trigger the before hook event for this script
      controller.trigger("before_hook", [bot, message, script]);

      // Run the script listening to for "enter" (the first room)
      controller.studio.runTrigger(bot, "enter", message.user, message.channel)
        .catch((err) => { bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err); });

      // If the team doesn't already, get them the puzzle data
      controller.storage.teams.get(message.team, function(err, team) {
        if (!team.puzzles) // Generate the team's fresh puzzle data  
          controller.trigger('generate', [bot, message]);
      });
      
    });

  });
  
  controller.hears('map','direct_message,direct_mention,ambient',function(bot,message) {

    var options = {
      bot: bot, 
      message: message
    };
    // Trigger the map event
    controller.trigger('map_event', [options]);
    
  }); // End hears "map"
  
  // Test for entry
  controller.hears("labyrinth", 'direct_message,direct_mention', function(bot, message) {
      controller.studio.run(bot, 'welcome', message.user, message.channel);
  });
  
  // Listen for 
  controller.hears("^generate (.*)", 'direct_message,direct_mention', function(bot, message) {
    
    console.log(message, "in the hears");
    var options = {
      bot: bot, 
      message: message, 
      forced: true
    };
    
    // if the message is "generate player" then generate player data
    if (message.match[0] == "generate player") {
      options.player = true;
      controller.trigger('generation_event', [options]);
    } else if (message.match[0] == "generate dev") {
      options.player = false;
      // Otherwise, generate development data for each puzzle
      controller.trigger('generation_event', [options]);
    } else {
      bot.reply(message, {
        'text': "Hmm.. please specify if you want to generate dev or player data!"
      });
    }
      
  });
  
  // Listen for 
  controller.hears("^export", 'direct_message,direct_mention', function(bot, message) {
    
    // controller.storage
      
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

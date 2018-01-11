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

var web = new WebClient(token);

module.exports = function(controller) {

    /* Collect some very simple runtime stats for use in the uptime/debug command */
    var stats = {
        triggers: 0,
        convos: 0,
    }

//     controller.on('heard_trigger', function() {
//         stats.triggers++;
//     });

//     controller.on('conversationStarted', function() {
//         stats.convos++;
//     });


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
    
    // Run the script listening to for "enter" (the first room)
    controller.studio.runTrigger(bot, "enter", message.user, message.channel)
      .catch((err) => { bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err); });

    // Generate the team's fresh puzzle data  
    controller.trigger('generate', [bot, message]);

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
  
  // Test for entry
  controller.hears("labyrinth", 'direct_message,direct_mention', function(bot, message) {
      controller.studio.run(bot, 'welcome', message.user, message.channel);
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

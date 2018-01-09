var dataChannel;
var _ = require("underscore");

const { WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.slackToken;

const web = new WebClient(token);

module.exports = function(controller) {
  
  // for choose/confirm 
  var choiceSelect = [];

    // create special handlers for certain actions in buttons
    // if the button action is 'say', act as if user said that thing
    controller.middleware.receive.use(function(bot, message, next) {
      var theBot = bot;
      if (message.type == 'interactive_message_callback') {
        if (message.actions[0].name.match(/^say$/)) {
          
            var reply = message.original_message;
          
            // Delete the original message the bot sent to the player          
            web.chat.delete(message.original_message.ts, message.channel).then((res) => {

               // console.log(res + " was deleted");

            }).catch((err) => { console.log(err) }); 
          
            // The bot "replies" with what the user said
            bot.replyInteractive(message, reply);
          
           
         }
        
        // Choose a menu option
        if (message.actions[0].name.match(/^choose$/)) {
          
            var reply = message.original_message;
          
            // console.log(message, "message right here");
            
            // Grab the "value" field from the selected option
            var value = message.actions[0].selected_options[0].value;
            var choice;
          
            // for each attachment option
            for (var i = 0; i <= reply.attachments[0].actions.length; i ++) {
              // check if the attachment option value equals the selected value
              // NO TWO VALUES CAN BE THE SAME
              if (reply.attachments[0].actions[0].options[i].value == value) {
                  // set the choice to the text of the matching option
                  choice = reply.attachments[0].actions[0].options[i].text;
              }
            }

            // Take the original message attachment
            var menuAttachment = reply.attachments[0].actions[0];
            // Change the menu text to be the chosen option
            menuAttachment.text = choice;
            // Set the attachment to the altered object
            reply.attachments[0].actions[0] = menuAttachment;
          
            // If this user does not already have a choice stored
            if (!_.findWhere(choiceSelect, { user: message.user })) {
              console.log("we are adding this choice");
                // Create object to hold this selection
                // Selection is "valid" or the solution/key if the value is "correct"
                // Any other value will be incorrect 
                // NO TWO VALUES CAN BE THE SAME
                choiceSelect.push({
                  user: message.user,
                  choice: choice, 
                  valid: value == "correct" ? true : false, 
                  callback: message.callback_id
                });
              
            } else { // User has choice stored
              
              var choiceToUpdate = _.findWhere(choiceSelect, { user: message.user });
              console.log("we are updating this choice");
              choiceSelect = _.map(choiceSelect, function(item) {
                if (item.user == message.user) {
                  item.choice = choice;
                  item.valid = value == "correct" ? true : false;
                  item.callback = message.callback_id;
                  return item;
                }
                else return item;
              });
            }
            
          
            // console.log("user selected " + JSON.stringify(choiceSelect));          
          
            bot.replyInteractive(message, reply);

  
         }
        
        // Confirm menu choice
        if (message.actions[0].name.match(/^confirm$/)) {
          
            var reply = message.original_message;
          var theMessage = message;
          console.log(message);
          //   console.log("user confirmed " + JSON.stringify(_.findWhere(choiceSelect, { user: message.user })));
          
            // Locate the saved choice based on the user key
            var confirmedChoice = _.findWhere(choiceSelect, { user: message.user });
            var script;
            controller.studio.getScripts().then((list) => {
              // console.log(list, " we are listing the list" );
              // script = _.findWhere(list, { triggers: confirmedChoice.callback });
              for (var i = 0; i < list.length; i++) {
                var triggers = list[i].triggers;
                _.each(triggers, function(a) {
                  // console.log(a, " a trigger");
                  if (a.pattern == confirmedChoice.callback) {
                    script = list[i];
                  }
                  
                });
                // console.log(triggers);
              }
              // console.log(script);
              // If the confirmed choice is valid...
              if (confirmedChoice.valid) {
                // console.log(confirmedChoice.callback, choiceSelect);
                // Run the trigger for the menu callback_id
                // This runs a trigger for botkit studio based on the MENU attachment callback_id
                // Triggers a script that is listening for this callback_id
                controller.studio.before(script.name, function(convo, next) {
                    // Find team to check puzzles data                   
                    controller.storage.teams.get(theMessage.team.id, function(err, team) {
                        // console.log("the team puzzles are: ", team.puzzles);
                        // Go through conversation attachments 
                        for (var i = 0; i < convo.messages[0].attachments[0].actions.length; i++) {
                          // Find matching puzzle
                          // Room button values should match room names (ie: room_1)
                           var puzzle = _.findWhere(team.puzzles, { 
                             room: convo.messages[0].attachments[0].actions[i].value
                           });
                          // If puzzle is locked, set style to "danger" (red) or else use "primary" (green)
                           if (puzzle.locked) {
                             convo.messages[0].attachments[0].actions[i].style = "danger";
                           } else {
                             convo.messages[0].attachments[0].actions[i].style = "primary";
                           }
                        }

                    });
                  
                    next();

                });
                
                controller.studio.runTrigger(theBot, confirmedChoice.callback, message.user, message.channel).catch(function(err) {
                    bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
                });
              } else { // If the choice is NOT valid
                // Tell the user they were wrong
                bot.reply(message, "wrong. please wait.");

                // TO DO: Timer that locks the user out and then sends them back here
              }

              // Delete the bot's message
              web.chat.delete(message.original_message.ts, message.channel).then((res) => {

                 // console.log(res + " was deleted");

              }).catch((err) => { console.log(err) }); 

              bot.replyInteractive(message, reply);
            });
            
            
  
         }
        
      }
      
      next();    
      
    });
  


}

var dataChannel;
var _ = require("underscore");

const { WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.slackToken;

const web = new WebClient(token);

function findGalaxy(num) {
  
  var letter;
  
  num = num / 10; 
  
  if (num <= 1.0) {
    letter = "a";
  } else if (num <= 2.0) {
    letter = "b";
  } else if (num <= 3.0) {
    letter = "c";
  } else if (num <= 4.0) {
    letter = "d";
  } else if (num <= 5.0) {
    letter = "e";
  } else if (num <= 6.0) {
    letter = "f";
  } else if (num <= 7.0) {
    letter = "g";
  } else if (num <= 8.0) {
    letter = "h";
  } else if (num <= 9.0) {
    letter = "i";
  } else if (num <= 10.0) {
    letter = "j";
  }
  
  return "galaxy_" + letter;
};

// Find the puzzle based on team and puzzle room name
function findPuzzle(controller, teamId, puzzle) {
  console.log(puzzle);
  var found;
  controller.storage.teams.get(teamId, function(err, team) {
    // console.log(team.puzzles)
    // console.log(galaxy);
    // console.log(_.findWhere(team.puzzles, { room: galaxy + "_" + puzzle }));
    found = _.findWhere(team.puzzles, { room: puzzle });
    console.log(found);
  });
  return found;

};

module.exports = function(controller) {
  
  // for choose/confirm 
  // Temporary storage
  var choiceSelect = [];
  
    // create special handlers for certain actions in buttons
    // if the button action is 'say', act as if user said that thing
    controller.middleware.receive.use(function(bot, message, next) {
      var theBot = bot;
      if (message.type == 'interactive_message_callback') {
        
        // User "says" something via button 
        if (message.actions[0].name.match(/^say$/)) {
          
          var reply = message.original_message;
          var puzzleName;
          var locked;
          
          // Delete the original message the bot sent to the player          
          web.chat.delete(message.original_message.ts, message.channel).then().catch((err) => { console.log(err) });
          
          console.log(message, " THIS MESSAGE WAS SAID");
          // Set puzzleName and locked based on button values
          if (message.text.includes("_open")) {
            puzzleName = message.text.split("_open")[0];
            puzzleName = findGalaxy(puzzleName.split("_")[1] / 10) + "_" + puzzleName;
            locked = false;
          } else {
            locked = true;
            puzzleName = findGalaxy(message.text.split("_")[1] / 10) + "_" + message.text;
          }
          
          console.log("puzzle locked: " + locked);
          console.log("puzzle name: " + puzzleName);

          // Find the puzzle the user is about to open
          var puzzle = findPuzzle(controller, message.team.id, puzzleName);
          
          if (!puzzle) {
            console.log("user said " + message.text);
            // This door leads to the puzzle thread as set up in BotKit Studio
            // The bot "replies" with what the user said
            bot.replyInteractive(message, reply);
          } else {
            
              // Check if the puzzle is unlocked in the database or contains "_open" in the button's value
              if (!puzzle.locked || !locked) {

                // This door has been unlocked, so let's tell them
                bot.reply(message, "This door is unlocked. Sending you to the room.", (err, response) => {

                  // We should wait...
                  setTimeout(function() {
                    
                    controller.studio.getScripts().then((list) => {
                      // console.log(list, " we are listing the list" );
                      // script = _.findWhere(list, { triggers: confirmedChoice.callback });
                      for (var i = 0; i < list.length; i++) {
                        var triggers = list[i].triggers;
                        // Locate the script based on its triggers
                        // If script is listening for the callback_id of the confirmed option, that's our script
                        _.each(triggers, function(a) {
                          if (a.pattern == puzzleName) {
                            script = list[i];
                          }
                        });
                      }
                      
                      // Use the script name to do some stuff before it runs
                       controller.trigger("before_hook", [bot, message, script]);

                      // And run the script for the room that is unlocked
                      controller.studio.run(bot, script.name, message.user, message.channel).then(function(convo) {

                      }).catch((err) => { console.log("Got error while running " + name[0] + " :", err) });

                      // And delete the bot message
                      web.chat.delete(response.ts, response.channel).then((res) => {

                         // console.log(res + " was deleted");

                      }).catch((err) => { console.log(err) }); 

                    });
                  }, 1000);

                });

              } else {
                // This door leads to the puzzle thread as set up in BotKit Studio
                // The bot "replies" with what the user said
                bot.replyInteractive(message, reply);
              }
            
          }
        
          
        }
        
        
//         // User "says" something via button 
//         if (message.actions[0].name.match(/^say$/)) {
          
//           var reply = message.original_message;

//           // Delete the original message the bot sent to the player          
//           web.chat.delete(message.original_message.ts, message.channel).then().catch((err) => { console.log(err) }); 
          
//           // This door leads to the puzzle thread as set up in BotKit Studio
//           // The bot "replies" with what the user said
//           bot.replyInteractive(message, reply);
          
//         }
        
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
              
              console.log("we are updating this choice");
              // Update stored choice with new choice, valid bool, and callback_id
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
          
            console.log("user selected " + JSON.stringify(choiceSelect));          
          
            bot.replyInteractive(message, reply);
          
         }
        
        // Confirm menu choice
        if (message.actions[0].name.match(/^confirm$/)) {
          
            var reply = message.original_message;
            // data object for puzzle attempt event
            var data = {};
          
            // console.log("user confirmed " + JSON.stringify(_.findWhere(choiceSelect, { user: message.user })));
          
            // Locate the saved choice based on the user key
            var confirmedChoice = _.findWhere(choiceSelect, { user: message.user });
            var script;
            
            // Set the puzzle, answer, and if the answer is correct
            // This data will be sent to the puzzle_attempt event for saving to storage
            data.puzzle = findGalaxy(confirmedChoice.callback.split("_")[1] / 10) + "_" + confirmedChoice.callback;
            data.answer = confirmedChoice;
            data.correct = confirmedChoice.valid;

            controller.studio.getScripts().then((list) => {
              // console.log(list, " we are listing the list" );
              // script = _.findWhere(list, { triggers: confirmedChoice.callback });
              for (var i = 0; i < list.length; i++) {
                var triggers = list[i].triggers;
                // Locate the script based on its triggers
                // If script is listening for the callback_id of the confirmed option, that's our script
                _.each(triggers, function(a) {
                  if (a.pattern == confirmedChoice.callback) {
                    script = list[i];
                  }
                });
              }
              
              
               // Trigger an attempt of opening the door
              controller.trigger("puzzle_attempt", [bot, message, data]);

              // Delete the bot's message
              web.chat.delete(message.original_message.ts, message.channel).then((res) => {

                 // console.log(res + " was deleted");

              }).catch((err) => { console.log(err) });

              // If the confirmed choice is valid...
              if (confirmedChoice.valid) {
                
                // Use the script name to do some stuff before it runs
               controller.trigger("before_hook", [bot, message, script]);
                // Run the trigger for the menu callback_id
                // This runs a trigger for botkit studio based on the MENU attachment callback_id
                // Triggers a script that is listening for this callback_id
                controller.studio.runTrigger(theBot, confirmedChoice.callback, message.user, message.channel)
                  .catch((err) => {
                    bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
                });
                
              } else { // If the choice is NOT valid
                // Tell the user they were wrong
                // console.log("wrong", message);
                bot.reply(message, "wrong. sending you back to the beginning.", (err, response) => {
                  // Wait some length of time (1000 = 1 sec)
                   setTimeout(function() {
                     // Send them back to the beginning
                    controller.studio.run(bot, 'galaxy_a_room_1', message.user, message.channel);
                     // Delete the bot's previous message
                    web.chat.delete(response.ts, response.channel).then().catch((err) => { console.log(err) }); 
                  }, 1000); 
                });
                                
              }
              

              // bot.replyInteractive(message, reply);
              
            });
            
            
  
         }
        
      }
      
      next();    
      
    });
  


}

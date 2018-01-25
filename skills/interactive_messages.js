var dataChannel;
var _ = require("underscore");


const { WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.slackToken;

const web = new WebClient(token);

// find galaxy
function findGalaxy(controller, teamId, num) {
  var galaxy;
  
  controller.storage.teams.get(teamId, function(err, team) {
    var thesePuzzles = _.pluck(team.puzzles, "roomId");
    var thisPuzzle = thesePuzzles.indexOf(num.toString());
    console.log(thisPuzzle, team.puzzles[thisPuzzle]);
    
    if (thisPuzzle >= 0) 
      galaxy = team.puzzles[thisPuzzle].galaxy;


  });
       
    console.log(galaxy, "is the galaxy");
    return galaxy;

};

// find the puzzle based on team and puzzle room name
function findPuzzle(controller, teamId, num) {
  // console.log(puzzle);
  var found;
  controller.storage.teams.get(teamId, function(err, team) {
    // console.log(team.puzzles)
    // console.log(galaxy);
    // console.log(_.findWhere(team.puzzles, { roomId: num }));
    found = _.findWhere(team.puzzles, { room: num });
    console.log(found);
  });
  return found;

};

function upperCase(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}


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
          bot.api.chat.delete({ts: message.original_message.ts, channel: message.channel}, function(err, message) {
            // console.log("deleted door choice: ", message);
          });
          
                    
          if (message.text.match(/\d+/)) {
            
            var num = message.text.match(/\d+/)[0];
            var galaxy = findGalaxy(controller, message.team.id, num); 
            
            // Set puzzleName and locked based on button values
            if (message.text.includes("_open")) {
              puzzleName = "Room_" + num;
              puzzleName = galaxy + "_" + puzzleName;
              locked = false;
            } else {
              locked = true;
              puzzleName = galaxy + "_Room_" + num;
            }
            
            console.log("puzzle locked: " + locked);
            console.log("puzzle name: " + puzzleName);

            // Find the puzzle the user is about to open
            var puzzle = findPuzzle(controller, message.team.id, puzzleName);

          }
          
          if (!puzzle) {
            console.log("user said " + message.text);
            // This door leads to the puzzle thread as set up in BotKit Studio
            // The bot "replies" with what the user said
            controller.studio.runTrigger(bot, message.text, message.user, message.channel);
          } else {
            
            
                
            
              // console.log(message, " THIS MESSAGE WAS SAID -- match: " + message.text.match(/\d+/));

              // Check if the puzzle is unlocked in the database or contains "_open" in the button's value
              if (!puzzle.locked || !locked) {
                
                // console.log(puzzleName, " puzzle is not locked");

                // This door has been unlocked, so let's tell them
                bot.reply(message, "This door is unlocked. Sending you to the room.", (err, response) => {

                  // We should wait...
                  setTimeout(function() {
                    
                    controller.studio.getScripts().then((list) => {
                      // console.log(list, " we are listing the list" );
                      // script = _.findWhere(list, { triggers: confirmedChoice.callback });
                      for (var i = 0; i < list.length; i++) {
                        // Locate the script based on its triggers
                        // If script is listening for the callback_id of the confirmed option, that's our script
                        if (list[i].name == puzzleName) {
                          script = list[i];
                        }
                      }
                      
                      
                      
                      // Use the script name to do some stuff before it runs
                      controller.trigger("before_hook", [bot, message, script]);

                      // Delete the original message the bot sent to the player          
                      bot.api.chat.delete({ts: response.ts, channel: response.channel}, function(err, message) {
                        // console.log("deleted: ", message);
                      });

                    });
                    
                  }, 1000);

                });

              } else {
                
                var scriptObj = {
                  name: puzzleName
                };
                
                controller.trigger("validation_event", [scriptObj]);

                
                // Use the script name to do some stuff before it runs
                controller.trigger("before_hook", [bot, message, scriptObj]);

              }
            
          }
        
          
        }
        
        // Choose a menu option
        if (message.actions[0].name.match(/^choose$/)) {
          
            var reply = message.original_message;
          
            // console.log(message, "message right here");
            
            // Grab the "value" field from the selected option
            var value = message.actions[0].selected_options[0].value;
            var choice;
          
            // for each attachment option
            for (var i = 0; i < reply.attachments[0].actions[0].options.length; i ++) {
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
              // console.log("we are adding this choice");
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
              
              // console.log("we are updating this choice");
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
          
            // console.log("user selected " + JSON.stringify(choiceSelect));          
          
            // bot.replyInteractive(message, reply);
          
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
            data.puzzle = findGalaxy(controller, message.team.id, confirmedChoice.callback.match(/\d+/)[0]) + "_Room_" + confirmedChoice.callback.match(/\d+/)[0];
            data.answer = confirmedChoice;
            data.correct = confirmedChoice.valid;

            controller.studio.getScripts().then((list) => {
              // console.log(list, " we are listing the list" );
              // script = _.findWhere(list, { triggers: confirmedChoice.callback });
              for (var i = 0; i < list.length; i++) {
                // Locate the script based on its name
                if (list[i].name == data.puzzle) {
                  script = list[i];
                }
              }


               // Trigger an attempt of opening the door
              controller.trigger("puzzle_attempt", [bot, message, data]);

              // Delete the bot's message
              bot.api.chat.delete({ts: message.original_message.ts, channel: message.channel}, function(err, message) {
                console.log("deleted: ", message);
              });

              // If the confirmed choice is valid...
              if (confirmedChoice.valid) {
                // console.log("correct!", data.puzzle);

                // Use the script name to do some stuff before it runs
               controller.trigger("before_hook", [bot, message, script]);
                // Run the trigger for the menu callback_id
                // This runs a trigger for botkit studio based on the MENU attachment callback_id
                // Triggers a script that is listening for this callback_id
                bot.reply(message, "Nice! You unlocked that door.", (err, response) => {
                  // Wait some length of time (1000 = 1 sec)
                   setTimeout(function() {
                    // Send them to the script
                    controller.studio.run(theBot, data.puzzle, message.user, message.channel)
                        .catch((err) => {
                          bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
                    });
                    // Delete the bot's previous message
                    bot.api.chat.delete({ts: response.ts, channel: response.channel}, function(err, message) {
                      console.log("deleted: ", message);
                    }); 
                   }, 1000); 
                });

              } else { // If the choice is NOT valid
                // Tell the user they were wrong
                // console.log("wrong", message);
                bot.reply(message, "wrong. sending you back to the beginning.", (err, response) => {
                  // Wait some length of time (1000 = 1 sec)
                   setTimeout(function() {
                     // Send them back to the beginning
                    controller.studio.runTrigger(bot, 'enter', message.user, message.channel);
                     // Delete the bot's previous message
                      bot.api.chat.delete({ts: response.ts, channel: response.channel}, function(err, message) {
                        // console.log("deleted: ", message);
                      });
                   }, 1000); 
                });

              }


            });
              
            
  
         }
        
      }
      
      next();    
      
    });
  


}

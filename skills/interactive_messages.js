var dataChannel;

const { WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.slackToken;

const web = new WebClient(token);

module.exports = function(controller) {
  
  // for choose/confirm 
  var choiceSelect = [];
  var choiceCallback;
  var choiceValid;

    // create special handlers for certain actions in buttons
    // if the button action is 'say', act as if user said that thing
    controller.middleware.receive.use(function(bot, message, next) {
      if (message.type == 'interactive_message_callback') {
        if (message.actions[0].name.match(/^say$/)) {
            var reply = message.original_message;

            for (var a = 0; a < reply.attachments.length; a++) {
                reply.attachments[a].actions = null;
            }

            var person = '<@' + message.user + '>';
            if (message.channel[0] == 'D') {
                person = 'You';
            }

            // reply.attachments.push(
            //     {
            //         text: person + ' said, ' + message.actions[0].value,
            //     }
            // );

            bot.replyInteractive(message, reply);
  
         }
        // Choose a menu option
        if (message.actions[0].name.match(/^choose$/)) {
          
            var choice = message.actions[0].selected_options[0].value;
          console.log("user has chosen: ", JSON.stringify(message));
            choiceSelect = choice;
            choiceValid = choice == "correct" ? true : false;
            choiceCallback = message.callback_id;
          console.log("user selected " + JSON.stringify(choiceSelect));
  
         }
        
        // Confirm menu choice
        if (message.actions[0].name.match(/^confirm$/)) {
            var reply = message.original_message;
          console.log("user confirmed " + choiceSelect);

            for (var a = 0; a < reply.attachments.length; a++) {
                reply.attachments[a].actions = null;
            }

            var person = '<@' + message.user + '>';
            if (message.channel[0] == 'D') {
                person = 'You';
            }

                      
            if (choiceValid) {
              console.log(choiceCallback, choiceSelect);
              controller.studio.runTrigger(bot, choiceCallback, message.user, message.channel).catch(function(err) {
                  bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
              });
            } else {
              console.log("wrong");
              bot.reply(message, "wrong. please wait.");
            }
          
            // controller.trigger('message_tagged', [bot, message, choiceSelect]);
          
            // web.chat.delete(message.ts, message.channel).then((res) => { console.log(res) });
            
            

            bot.replyInteractive(message, reply);
  
         }
        
      }
      
      next();    
      
    });
  


}

var debug = require('debug')('botkit:onboarding');
var fs = require("fs");

const { WebClient } = require('@slack/client');

module.exports = function(controller) {
  
    controller.on('onboard', function(bot, team, auth) {
      
      const token = auth.access_token;

      var web = new WebClient(token);
      
      bot.api.im.open({user: bot.config.createdBy}, function(err, direct_message) {
          if (err) {
              debug('Error sending onboarding message:', err);
          } else {
              // Run the welcome script
              controller.studio.run(bot, 'welcome', bot.config.createdBy, direct_message.channel.id, direct_message).catch(function(err) {
                  debug('Error: encountered an error loading onboarding script from Botkit Studio:', err);
              });
            
              // Add the team to the chat channel 
              // Have the user create & join the puzzle chat channel 
              web.channels.join('labyrinthChat').then((res) => {
                console.log("created labyrinth channel: " + JSON.stringify(res.channel));
                var newChannel = res.channel["id"];

                // Get all users in the team
                web.users.list().then((res) => {
                  // Move through each member of the team
                  for (var i = 0; i < res.members.length; i++) {
                    // Set a timeout for 1 sec each so that we don't exceed our Slack Api limits
                    setTimeout(function() {
                      // console.log(res.members[i]);

                      // check if user is bot before adding
                      // TODO check if user is already in channel
                      if (!res.members[i].is_bot || res.members[i].name != "slackbot" ) {
                        var member = res.members[i]["id"];

                        // Invite each user to the labyrinth chat channel
                        web.channels.invite(newChannel, member).then().catch((err) => { console.log(err) });
                        // console.log(res + " joined the labyrinth");


                      }
                    }, 1000 * (i+1));

                  }
                }).catch((err) => { console.log(err) });
              }).catch((err) => { console.log(err) });
            
            
          }
      });
              
    });

}

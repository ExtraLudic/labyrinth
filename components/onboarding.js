var debug = require('debug')('botkit:onboarding');
var fs = require("fs");

const { WebClient } = require('@slack/client');

module.exports = function(controller) {
  
    controller.on('onboard', function(bot, team, auth) {
      
      const token = auth.access_token;

      var web = new WebClient(token);
      
      var channels = ["gamelog", "labyrinth", "map"];
      
      bot.api.im.open({user: bot.config.createdBy}, function(err, direct_message) {
          if (err) {
              debug('Error sending onboarding message:', err);
          } else {
              // Run the welcome script
              controller.studio.run(bot, 'welcome', bot.config.createdBy, direct_message.channel.id, direct_message).catch(function(err) {
                  debug('Error: encountered an error loading onboarding script from Botkit Studio:', err);
              });
            
              // Add the team to each of the specific channels
              // Have the user create & join the puzzle chat channel 
              // First, get all of the users to add to the channels
              web.users.list().then((res) => {
                for (var i = 0; i < channels.length; i++) {
                
                  // Set a timeout so we don't hit our slack request limits
                  // Since we know we need to wait 1 sec for each user
                  // We will use the total expected wait time for our delay
                  setTimeout(function() {
                    // 
                    web.channels.join(channels[i]).then((res) => {
                      console.log("created labyrinth channel: " + JSON.stringify(res.channel));
                      var newChannel = res.channel["id"];

                      // Move through each member of the team
                      for (var j = 0; j < res.members.length; j++) {
                        // Set a timeout for 1 sec each so that we don't exceed our Slack Api limits
                        setTimeout(function() {
                          // console.log(res.members[i]);

                          // check if user is bot before adding
                          // TODO check if user is already in channel
                          if (!res.members[j].is_bot || res.members[j].name != "slackbot" || res.members[j].name == "Daedalus") {
                            var member = res.members[j]["id"];

                            // Invite each user to the labyrinth chat channel
                            web.channels.invite(newChannel, member).then().catch((err) => { console.log(err) });

                          }

                        }, 1000 * (j+1));

                      } // End member loop
                      
                    }, 1000 * res.members.length + 1); // End channel timeout
                    
                  }).catch((err) => { console.log(err) }); // End channels.join call 
                  
                } // End channels loop
                
              }).catch((err) => { console.log(err) }); // End users.list call
              
              
            
            
          }
      });
              
    });

}

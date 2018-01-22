var debug = require('debug')('botkit:onboarding');
var fs = require("fs");
var _ = require("underscore");

const { WebClient } = require('@slack/client');

var channels = ["gamelog", "theLabyrinth", "map"], 
    mapChannel,
    globalChannels = [], 
    globalMembers = [],
    creator,
    memberCount;

function isUser(member) {
  // console.log(member.name, "is the member being checked");
  if ((member.is_bot && member.name != process.env.botName) || member.name == "slackbot" || member.id == creator)
    return false;
  else
    return true;
}

module.exports = function(controller) {
  
    controller.on('onboard', function(bot, team, auth) {
            
      const token = auth.access_token;

      var web = new WebClient(token);
            
      bot.api.im.open({user: bot.config.createdBy}, function(err, direct_message) { 
          creator = bot.config.createdBy;
        console.log(creator, "created this group and added the bot");
          if (err) {
              debug('Error sending onboarding message:', err);
          } else {
              // Run the welcome script
              controller.studio.runTrigger(bot, 'welcome', bot.config.createdBy, direct_message.channel.id, direct_message).catch(function(err) {
                  debug('Error: encountered an error loading onboarding script from Botkit Studio:', err);
              });
            
              // Add the team to each of the specific channels
              // Have the user create & join the puzzle chat channel 
              // First, get all of the users to add to the channels
              web.users.list().then((res) => {
                
                globalMembers = res.members;
                memberCount = globalMembers.length;
                
                // console.log(globalMembers, " are the members");
                
                var channelData = channels.map(channelCreate);
                                
                var channelResults = Promise.all(channelData);
                
                return channelResults.then(created => {
                  // console.log(created, "is the created data");
                  // Find the map channel
                  mapChannel = _.findWhere(created, { name: 'map' });
                  console.log(mapChannel, "is the map channel");
                  // Set the global channels
                  globalChannels = created;
                  // Create empty array for channel/member pairs
                  var channelMembers = [];
                  // Go through each channel
                  _.each(globalChannels, function(channel) {
                    // Go through each member
                    _.each(globalMembers, function(member) {
                      // Create unique array for each channel and member pair
                      var array = [channel, member];
                      // Add this pair to the channel/member array
                      channelMembers.push(array);
                    });
                  });
                  
                  // console.log(channelMembers, "is all the channels and members groups");
                  
                  var memberData = channelMembers.map(channelJoin);
                  
                  var memberResults = Promise.all(memberData);
                  
                  return memberResults.then(joined => {
                    // console.log(joined, "is the joined data");
                    // console.log(mapChannel, "is the map channel");
                    setTimeout(function() {
                      
                      var generateOptions = {
                        bot: bot, 
                        team: team,
                        player: true, 
                        user: bot.config.createdBy,
                        channel: direct_message.channel.id
                      };
                      
                      // Generate all that team data
                      controller.trigger('generate', [generateOptions]);
                      
                      var mapOptions = {
                        bot: bot, 
                        team: team, 
                        channel: mapChannel
                      };
                      
                      // Have the bot send the map message from the map channel
                      controller.trigger('map_event', [mapOptions]);
                      
                    }, 1000);
                    
                  });
                  
                });
                
              }).catch((err) => { console.log(err) }); // End users.list call
                          
          }
      });
              
      
      var channelCreate = function channelCreate(name) {
        
        // Set a timeout so we don't hit our slack request limits
        // Since we know we need to wait 1 sec for each user
        // We will use the total expected wait time for our delay
        // setTimeout(function() {
          // Join the channels

          return web.channels.create(name).then((res) => {
            // console.log("created labyrinth channel: " + JSON.stringify(res.channel));            
            return res.channel;

          }).catch((err) => { console.log(err) }); // End channels.join call 

        // }, 1000 * memberCount + 1); // End channel timeout

      }; // End channel create
      
      var channelJoin = function channelJoin(params) {
        
        // Set a timeout for 1 sec each so that we don't exceed our Slack Api limits
        // setTimeout(function() {
          var member = params[1]["id"].toString();
          var channel = params[0]["id"].toString();
          console.log(member, "is the member that will join " + channel);

          // check if user is bot before adding
          // TODO check if user is already in channel
          if (member) {
            // var member = member["id"];
            
            web.channels.info(channel).then(channelData => {
              // console.log(channelData);
              if (channelData) {
                // console.log(params[1], isUser(params[1]));
                
                if (isUser(params[1])) {
                  
                  // Invite each user to the labyrinth chat channel
                  return web.channels.invite(channel, member)
                    .then(res => {
                      // console.log(res, "is the channel res");
                      return res;
                    }).catch((err) => { console.log(err) });
                  
                }
              }
            }).catch(err => console.log(err));

            
          }

        // }, 1000 * (j+1));
        
      };// End channel Join
      
      
    });
  
  

}

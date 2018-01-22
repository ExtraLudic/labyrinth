const _ = require("underscore");

// Script for generation event 
// Pulls scripts with a certain tag for team puzzle data 
    
var team, 
    user, 
    channel;

module.exports = function(controller) {
  
  // Pull scripts with this tag for generation
  var pullTag = "labyrinth";
  var promises = [];
      
  controller.on("generate", function(options) {
    
    console.log(options, options.message);
    
    if (options.user) user = options.user;
    if (options.channel) channel = options.channel;
    if (options.team) team = options.team.id;
    
    if (!channel) channel = options.message.channel;
    if (!user) user = options.message.user;
    if (!team) team = options.message.team;
    
    // console.log(bot);
    controller.storage.teams.get(team, function(err, teamData) {
      console.log(teamData, "is the gotten team" );
      controller.studio.getScripts().then(function(list) {        
        // console.log(list, "is the list of scripts");
         // Go through each script 
        // make new array with all names
        var puzzles = _.reject(list, function(puzzle) {
          return !_.contains(puzzle.tags, pullTag);
        });
        
        var names = _.pluck(puzzles, "name");
        // console.log(puzzles, names);
        
        var mapPromises = names.map(pd);

        var results = Promise.all(mapPromises);

        return results.then(puzzleArray => {
          
          console.log(puzzleArray, "this is from all those promises");
          teamData.puzzles = puzzleArray;
          // Set the team puzzles to the generated puzzles array
          controller.storage.teams.save(teamData, function(err, id) {
            if (err) {
              console.log("There was an error: ", err);
            }
            // Check the team to make sure it was updated
            // Team should have a puzzles object now attached
            controller.storage.teams.get(id, function(err, teamUpdated) {
              // console.log("updated: ", team.puzzles);
              if (options.forced) {
                options.bot.reply(options.message, {
                  'text': "Nice, you have updated your team's puzzles with completely fresh data!"
                });
              }
            });
          });
          
        });
                        
      }).catch((err) => { console.log(err, " is the err") }); // End get scripts

    }); // End team get
    
    var pd = function puzzleDefine(name){
      
      // Create the puzzle object
       var thisPuzzle = {
          room: name,
          galaxy: name.split("_")[0] + "_" + name.split("_")[1],
          links: [], 
          locked: true, 
          tries: 0, 
          roomId: name.match(/\d+/)[0]
        };
      
      if (thisPuzzle.roomId == 1)
        thisPuzzle.locked = false;
      
      console.log(options, "are the options inside this promise");
      console.log(user, channel);
      if (!options.player) thisPuzzle.dev = true;
          
       return controller.studio.get(options.bot, name, options.bot.config.createdBy, channel).then((script) => {

           // Find the links based on thread attachments
           // First get the default thread
           // This thread should always hold a single attachment 
           // With buttons for each door this room links to
           var thread = script.threads['default'][0];

  //          // If the room has no attachments, it has no links
            if (thread.attachments) {
               // console.log(thread.attachments[0].actions)
               // For each attachment, find the buttons
               _.each(thread.attachments[0].actions, function(action) {
                 // console.log(action);
                 // If that button exists
                 if (action) {
                   // console.log(thread[0].attachments[0].actions);
                   // Find button value (room_xxx) 
                   // Extract link number from value
                   var num = action.value.match(/\d+/)[0];
                   // Add that number to the links array for this puzzle
                   thisPuzzle.links.push(num);

                 } 

               });

            }

            return thisPuzzle;
         
        }).catch((err) => { console.log("Error in generation getting scripts; ", err); });

      }
    
//     var findLinks = Promise.resolve(name => {
      
        
//       });
    
  }); // End on event
  
  
     
}

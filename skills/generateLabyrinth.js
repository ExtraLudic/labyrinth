const _ = require("underscore");

// Script for generation event 
// Pulls scripts with a certain tag for team puzzle data 

module.exports = function(controller) {
  
  // Pull scripts with this tag for generation
  var pullTag = "labyrinth";
      
  controller.on("generate", function(bot, message) {
    
    controller.storage.teams.get(message.team, function(err, team) {
      // console.log(team);
      var puzzles = [];
      controller.studio.getScripts().then(function(list) {
        // console.log(list);
  
        // Go through each script 
         for (var i = 0; i < list.length; i++ ) {
            
           // Check if script is tagged as part of the labyrinth
           if ( _.contains(list[i].tags, pullTag) ) {
               
             // Create a new instance of the tags list
             var tags = list[i].tags;
             // Remove labyrinth from the list
             tags = _.without(tags, pullTag);
             
              var thisPuzzle = {
                room: list[i].name,
                links: [], 
                locked: true, 
                tries: 0
              };
             
              // console.log(tags);

               // Go through each tag
               for (var a = 0; a < tags.length; a++) {
                 // console.log(tags[a]);
                 
                 // if the tag contains "galaxy" or "Galaxy" 
                 if (tags[a].includes("galaxy") || tags[a].includes("Galaxy")) { // if it's a "galaxy" tag
                   // console.log("this tag is a galaxy", tags[a]);
                   
                   // set that tag as the puzzle galaxy
                   thisPuzzle.galaxy = tags[a];
                 } else if (tags[a].includes("room") || tags[a].includes("Room")) { // if it's a "room" tag
                   // console.log("this tag is a room", tags[a]);
                   
                   // Create a room link based on the number in the tag
                   var roomLink = tags[a].match(/\d+$/)[0];
                   // console.log(roomLink, "is a room link" ); 
                   
                   // Add this link to the links array on the puzzle
                   thisPuzzle.links.push(roomLink);
                 } else {
                   console.log("extra tag: ", tags[a]);
                 }
               } // End tag loop
              
               // Add this puzzle to the puzzles array
               puzzles.push(thisPuzzle);
                          
           } // End if script is room
           
         } // End Script Loop
        
        // Set the team puzzles to the generated puzzles array
        team.puzzles = puzzles;
        console.log("the team puzzles: ", JSON.stringify(team));
        
        // Save this team
        controller.storage.teams.save(team, function(err, id) {
          if (err) {
            console.log("There was an error: ", err);
          }
          // Check the team to make sure it was updated
          // Team should have a puzzles object now attached
          // controller.storage.teams.get(id, function(err, team) {
          //   console.log("updated: ", team);
          // });
        });

      });
      
      

    });
  });
     
}

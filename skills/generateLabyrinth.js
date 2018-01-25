const _ = require("underscore");
const fs = require('fs');
const request = require('request');


// Script for generation event
// Pulls scripts with a certain tag for team puzzle data 
    
var team, 
    user, 
    channel;

module.exports = function(controller) {
  
  controller.on("generation_event", function(options) {
    
    console.log(options.message, "in the generation");
            
    if (options.user) user = options.user;
    if (options.channel) channel = options.channel;
    if (options.team) team = options.team.id;
    
    if (!channel) channel = options.message.channel;
    if (!user) user = options.message.user;
    if (!team) team = options.message.team;
    
    // console.log(bot);
    controller.storage.teams.get(team, function(err, teamData) {
      
      console.log(teamData, "is the gotten team" );

      request("https://raw.githubusercontent.com/ExtraLudic/labyrinth/json/json/debugScripts.json", function(err, response, body){
    
        var teamPuzzles = [];

        if (!err && response.statusCode == 200) {
           var importedJSON = JSON.parse(body);

          _.each(importedJSON, function(section) {
            // console.log(section.command);
            var name = section.command;
            if (name.match(/\d+/)) {

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

              _.each(section.script, function(thread) {
                if (thread.topic.match(/\d+/))
                  thisPuzzle.links.push(thread.topic.match(/\d+/)[0]);
              });

              // console.log(thisPuzzle.links);

              teamPuzzles.push(thisPuzzle);
            }
          });

          console.log(teamPuzzles.length);
          teamData.puzzles = teamPuzzles;
          console.log(teamPuzzles, "is the res from the promise");

          console.log(teamData.puzzles, "are those puzzles");
          // Set the team puzzles to the generated puzzles array
          controller.storage.teams.save(teamData, function(err, teamSaved) {
            if (err) {
              console.log("There was an error: ", err);
            }

            console.log(teamSaved, "is the team data we saved");
            // Check the team to make sure it was updated
            // Team should have a puzzles object now attached
            controller.storage.teams.get(teamSaved, function(err, teamUpdated) {
              console.log("updated: ", teamUpdated.puzzles);

              if (options.forced) {
                options.bot.reply(options.message, {
                  'text': "Nice, you have updated your team's puzzles with completely fresh data!"
                });
              }

            });

          });

        }
        
      });
        
    }); // End team get
    
    
  }); // End on event
  
  
     
}

var requestJson = function() {
  
  
}


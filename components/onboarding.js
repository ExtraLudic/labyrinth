var debug = require('debug')('botkit:onboarding');
var fs = require("fs");

module.exports = function(controller) {
  
    controller.on('onboard', function(bot, team) {

        debug('Starting an onboarding experience!');
      
        // Generate puzzles
        function GeneratePuzzles() {
          
        }
      
        controller.storage.teams.get(team.id, function(team) {
          if (!team.puzzles) {
            var puzzles = GeneratePuzzles();
            
            team.puzzles = puzzles;
            controller.storage.teams.save(team.id, function(team, err) {
              if (err)
                console.log(err);
              else
                console.log("saved this team: " + team);
            });
          }
        });
      
      

        
    });

}

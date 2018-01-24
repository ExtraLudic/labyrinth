var _ = require("underscore");

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
  
  console.log(galaxy);
  
  return galaxy;
};

// find the puzzle 
function findPuzzle(controller, teamId, puzzle) {
  // console.log(puzzle);
  var found;
  controller.storage.teams.get(teamId, function(err, team) {
    found = _.findWhere(team.puzzles, { room: puzzle });
    // console.log(found);
  });
  return found;

};

module.exports = function(controller) {
  controller.on("validation_event", function(script) {
    
    console.log(script, "validation");
        
    controller.studio.validate(script.name, 'user_response', function(convo, next) {
      // console.log(convo);
        var bot = convo.context.bot;
        var user = convo.context.user;
        var channel = convo.context.channel;
        var response = convo.extractResponse('user_response');
        var team = convo.transcript[1].team.id;
      
      console.log(response, "is the response");
      
      
      
        if (response.match(/\d+/)) {
      
          var thread = findGalaxy(controller, team, response.match(/\d+/)).replace("_", " ")
                      + ": Room " 
                      + response.match(/\d+/)
                      + " Key";

          var door = findGalaxy(controller, team, response.match(/\d+/))
                    + "_Room_" + response.match(/\d+/);

          var puzzle = findPuzzle(controller, team, door);

          console.log("trying to go through this door: ", puzzle);

          if (puzzle.locked) {

            // console.log(thread);

            convo.gotoThread(thread);

            next();

          } else {
            convo.status = "completed";
            controller.studio.run(bot, puzzle, user, channel);
          }

        } else {
          
          next();
        }
      
    });
    
  });
  
}
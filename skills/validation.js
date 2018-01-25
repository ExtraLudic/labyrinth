var _ = require("underscore");

// find galaxy
function findGalaxy(controller, teamId, num) {
  var galaxy;
  
  controller.storage.teams.get(teamId, function(err, team) {
    var thesePuzzles = _.pluck(team.puzzles, "roomId");
    var thisPuzzle = thesePuzzles.indexOf(num.toString());
    // console.log(thisPuzzle, team.puzzles[thisPuzzle]);
    if (thisPuzzle >= 0) 
      galaxy = team.puzzles[thisPuzzle].galaxy;
  });
  
  // console.log(galaxy);
  
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
  
  // First find all of the script names
  controller.studio.getScripts().then(list => {
    var puzzles = _.reject(list, function(puzzle) {
      return !_.contains(puzzle.tags, "labyrinth");
    });

    var names = _.pluck(puzzles, "name");
    // console.log(puzzles, names);
    

    var mapPromises = names.map(validate);
    
    var results = Promise.all(mapPromises);

    results.then(puzzleArray => {
      // console.log(puzzleArray);
    });
  });
  

  var validate = function(name) {
    
    // console.log(name, "validation");
        
    controller.studio.validate(name, 'user_response', function(convo, next) {
      // console.log(convo.transcript[1].team);
        var bot = convo.context.bot;
        var user = convo.context.user;
        var channel = convo.context.channel;
        var response = convo.extractResponse('user_response');
        var team = convo.transcript[1].team.id ? convo.transcript[1].team.id : convo.transcript[1].team;
            
        console.log(response, "is the response");
            
        if (response.match(/\d+/)) {
          
          var galaxy = findGalaxy(controller, team, response.match(/\d+/));
      
          var thread = galaxy.replace("_", " ")
                      + ": Room " 
                      + response.match(/\d+/)
                      + " Key";

          var door = galaxy
                    + "_Room_" + response.match(/\d+/);

          var puzzle = findPuzzle(controller, team, door);

          console.log("trying to go through this door: ", puzzle);

          if (puzzle.locked) {

            console.log(thread);

            convo.gotoThread(thread);

            next();

          } else {
            // convo.status = "completed";
            controller.studio.run(bot, puzzle.room, user, channel);
            next();
          }

        } else {
          
          next();
        }
            
    });
  };
      
}
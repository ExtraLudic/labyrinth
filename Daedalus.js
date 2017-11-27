var express = require('express');
var bodyParser = require('body-parser');
 
var app = express();
var port = process.env.PORT || 1337;

var Botkit = require('botkit');

var controller = Botkit.slackbot();

var currentRoom = 1;
var doors = [5, 8, 4];
var solvedPuzzles = [false, false, false, false, false, false, false, false, false, false];
var lockedPuzzles = [false, false, false, false, false, false, false, false, false, false];
var bottestingid = 'C7WLECZAR';
var labrynthchannelid = 'C7TBY98TS';
var daedalusemoji = "https://avatars.slack-edge.com/2017-11-08/269162770516_e2c4553016a99b14da83_72.png";
var bot = controller.spawn({

  token: "xoxb-270188256679-aaIo8jyZ13OyalxZhc6SgzFz"

})

bot.startRTM(function(err,bot,payload) {

  
  if (err) {

    throw new Error('Could not connect to Slack');

  }
  bot.say(
        {
        username: 'Daedalus',
        text: "Hey there, player! Welcome to the Labrynth minigame! To get started, type 'Enter Labrynth'!",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );

});

controller.hears(["Enter Labrynth"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
        bot.say(
        {
        username: 'Daedalus',
        title: "Room 1 - Daedalus",
        text: "'Welcome to my Labyrinth. You must find your way to Room 10 and then back to me. If you can do this in a week I will give you 1000 points. Each room is locked. To get the key to a room, you’ll need to solve a puzzle, and plug the solution into the appropriate console. Ready to start? All you need to do is choose a room to go into and type 'ENTER ROOM #'.' You look around the room, and see 3 silver pads on the floor, numbered 5, 8 and 4. You hesitantly advance towards one...",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
});

controller.hears(["Enter Room 1"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 1){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
    if(solvedPuzzles[0] == true){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 1 - Daedalus",
        text: "'Welcome to my Labyrinth. You must find your way to Room 10 and then back to me. If you can do this in a week I will give you 1000 points. Each room is locked. To get the key to a room, you’ll need to solve a puzzle, and plug the solution into the appropriate console. Ready to start? All you need to do is choose a room to go into and type 'ENTER ROOM #'.' You look around the room, and see 3 silver pads on the floor, numbered 5, 8 and 4. You hesitantly advance towards one...",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    currentRoom = 1;
    doors = [5, 8, 4];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        title: "Room 1 - Daedalus",
        text: "It's locked. Better solve this puzzle.\n\nWant to have a blast? Which country comes next in the sequence: USA, Russia, England, France, Israel, China, India, Pakistan, _______",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }
  }
  else {
    bot.say(
        {
        username: 'Daedalus',
        text: "Whoops! That's not a door in this room!",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
  }
        
});

controller.hears(["Enter Room 2"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 2){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
    if(solvedPuzzles[1] == true){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 2 - The Pantheon",
        text: "You have entered room 2, with doors to rooms 1, 6 and 3",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    currentRoom = 2;
    doors = [1, 6, 3];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        title: "Room 2 - The Pantheon",
        text: "It's locked. Better solve this puzzle.\n\nHe couldn’t open the pod bay doors, but he could sing 'Daisy.'",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }
  }
  else {
    bot.say(
        {
        username: 'Daedalus',
        text: "Whoops! That's not a door in this room!",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
  }
        
});
controller.hears(["Enter Room 3"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 3){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
    if(solvedPuzzles[2] == true) {
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 3 - Zeus",
        text: "You have entered room 3, with doors to rooms 7, 9 and 4",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    currentRoom = 3;
    doors = [7, 9, 4];
   }
   else {
      bot.say(
        {
        username: 'Daedalus',
        title: "Room 3 - Zeus",
        text: "It's locked. Better solve this puzzle.\n\nYou have two containers and a water reservoir. One container holds exactly three gallons and the other holds exactly 5 gallons. What is the minimum amount of water that you would need in the water reservoir to get exactly 4 gallons of water in the five gallon container and to be sure that you had exactly 4 gallons?",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
   }
 }
  else {
    bot.say(
        {
        username: 'Daedalus',
        text: "Whoops! That's not a door in this room!",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
  }
        
});
controller.hears(["Enter Room 4"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 4){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
    if(solvedPuzzles[3] == true) {
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 4 - Hera",
        text: "You have entered room 1, with doors to rooms 7, 3 and 8",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    currentRoom = 4;
    doors = [7, 3, 8];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        title: "Room 4 - Hera",
        text: "It's locked. Better solve this puzzle.\n\nSomewhere in the known universe is a planet populated solely by robots. What is it called?",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }
  }
  else {
    bot.say(
        {
        username: 'Daedalus',
        text: "Whoops! That's not a door in this room!",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
  }
        
});
controller.hears(["Enter Room 5"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 5){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
    if(solvedPuzzles[4] == true) {
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 5 - Poseidon",
        text: "You have entered room 5, with doors to rooms 10, 9 and 6",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    currentRoom = 5;
    doors = [10, 9, 6];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        title: "Room 5 - Poseidon",
        text: "It's locked. Better solve this puzzle.\n\n Winston Churchill received a 750ml bottle of scotch the day his son was born. On his son’s first birthday, Churchill drank one shot from the bottle. On his second birthday, two shots, and on his third birthday three, and so on. How old was Churchill when he finished the bottle?",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }
  }
  else {
    bot.say(
        {
        username: 'Daedalus',
        text: "Whoops! That's not a door in this room!",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
  }
        
});
controller.hears(["Enter Room 6"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 6){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
    if(solvedPuzzles[5] == true) {
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 6 - Demeter",
        text: "You have entered room 6, with doors to rooms 8, 3 and 4",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    currentRoom = 6;
    doors = [8, 3, 4];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        title: "Room 6 - Demeter",
        text: "It's locked. Better solve this puzzle.\n\nJan and Sven are the two greatest Jenga players in the world. They decide to play a game of Jenga following all the normal rules, but add these additional rules to make it more challenging: Both players must always pull from the lowest possible level on the tower. Neither player is allowed to pull middle pieces. After an hour of intense play, the game ends in a draw when there are no legal pulls left, but the tower is still standing. How many levels high is the tower?",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }
  }
  else {
    bot.say(
        {
        username: 'Daedalus',
        text: "Whoops! That's not a door in this room!",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
  }
        
});
controller.hears(["Enter Room 7"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 7){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
    if(solvedPuzzles[6] == true) {
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 7 - Athena",
        text: "You have entered room 7, which has no doors, so let's put you back in room " + currentRoom,
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        title: "Room 7 - Athena",
        text: "It's locked. Better solve this puzzle.\n\nIf you rolled five 30-sided dice and totaled the faces, then repeated this process one billion times, what number is likely to come up the most?",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }
  }
  else {
    bot.say(
        {
        username: 'Daedalus',
        text: "Whoops! That's not a door in this room!",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
  }
        
});
controller.hears(["Enter Room 8"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 8){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
    if(solvedPuzzles[7] == true) {
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 8 - Apollo & Artemis",
        text: "You have entered room 8, with doors to rooms 7, 6 and 9",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    currentRoom = 8;
    doors = [7, 6, 9];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        title: "Room 8 - Apollo & Artemis",
        text: "It's locked. Better solve this puzzle.\n\nJan and Sven have a rematch in Jenga since the last game they played ended in a draw. This time they use the normal Jenga rules with this addition: Jan can only pull blocks from the center of a level, while Sven can only pull from the sides. This time, Sven wins the game. How many levels high is the tower when the game is over?",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }
  }
  else {
    bot.say(
        {
        username: 'Daedalus',
        text: "Whoops! That's not a door in this room!",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
  }
        
});
controller.hears(["Enter Room 9"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 9){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
    if(solvedPuzzles[8] == true) {
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 9 - Ares",
        text: "You have entered room 9, with doors to rooms 7, 3 and 4",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    currentRoom = 9;
    doors = [7, 3, 4];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        title: "Room 9 - Ares",
        text: "It's locked. Better solve this puzzle.\n\nRoughly how many times shorter was the Gettysburg Address than the keynote speech at Gettysburg?",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }
  }
  else {
    bot.say(
        {
        username: 'Daedalus',
        text: "Whoops! That's not a door in this room!",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
  }
        
});
controller.hears(["Enter Room 10"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 10){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
    if(solvedPuzzles[9] == true) {
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 10 - Aphrodite",
        text: "You have entered room 10, with doors to rooms 2, 9 and 6",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    currentRoom = 10;
    doors = [2, 9, 6];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        title: "Room 10 - Aphrodite",
        text: "It's locked. Better solve this puzzle.\n\nHow old will Arnold Schwarzenegger be when Skynet has to send him back to kill Sarah Conner?",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }
  }
  else {
    bot.say(
        {
        username: 'Daedalus',
        text: "Whoops! That's not a door in this room!",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
  }
        
});

controller.hears(["Key 1:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 1){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
  if(lockedPuzzles[0] == false){
    if(message.text == "Key 1: North Korea"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 1 - Daedalus",
        text: '"Welcome to my Labyrinth. You must find your way to Room 10 and then back to me. If you can do this in a week I will give you 1000 points. Each room is locked. To get the key to a room, you’ll need to solve a puzzle, and plug the solution into the appropriate console. Ready to start? All you need to do is choose a room to go into and type ENTER ROOM #." You look around the room, and see 3 silver pads on the floor, numbered 5, 8 and 4. You hesitantly advance towards one...',
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    solvedPuzzles[0] = true;
    currentRoom = 1;
    doors = [5, 8, 4];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        text: "Incorrect. You cannot attempt to unlock this door again for one minute.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    lockedPuzzles[0] = true;
    setTimeout(function(){
      lockedPuzzles[0] = false;
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 1 is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }, 60000);
    }
  }
     else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 1 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
     }
   }   
});

controller.hears(["Key 2:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 2){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
  if(lockedPuzzles[1] == false){
    if(message.text == "Key 2: Hal 9000"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 2 - The Pantheon",
        text: "You have entered room 2, with doors to rooms 1, 6 and 3",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    solvedPuzzles[1] = true;
    currentRoom = 2;
    doors = [1, 6, 3];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        text: "Incorrect. You cannot attempt to unlock this door again for one minute.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    lockedPuzzles[1] = true;
    setTimeout(function(){
      lockedPuzzles[1] = false;
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 2 is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }, 60000);
    }
  }
     else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 2 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
     }
   }   
});
controller.hears(["Key 3:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 3){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
  if(lockedPuzzles[2] == false){
    if(message.text == "Key 3: 6 gallons"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 3 - Zeus",
        text: "You have entered room 3, with doors to rooms 7, 9 and 4",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    solvedPuzzles[2] = true;
    currentRoom = 3;
    doors = [7, 9, 4];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        text: "Incorrect. You cannot attempt to unlock this door again for one minute.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    lockedPuzzles[2] = true;
    setTimeout(function(){
      lockedPuzzles[2] = false;
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 3 is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }, 60000);
    }
  }
     else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 3 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
     }
   }   
});
controller.hears(["Key 4:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 4){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
  if(lockedPuzzles[3] == false){
    if(message.text == "Key 4: Mars"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 4 - Hera",
        text: "You have entered room 4, with doors to rooms 7, 3 and 8",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    solvedPuzzles[3] = true;
    currentRoom = 4;
    doors = [7, 3, 8];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        text: "Incorrect. You cannot attempt to unlock this door again for one minute.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    lockedPuzzles[3] = true;
    setTimeout(function(){
      lockedPuzzles[3] = false;
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 4 is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }, 60000);
    }
  }
     else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 4 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
     }
   }   
});
controller.hears(["Key 5:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 5){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
  if(lockedPuzzles[4] == false){
    if(message.text == "Key 5: 45"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 5 - Poseidon",
        text: "You have entered room 5, with doors to rooms 10, 9 and 6",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    solvedPuzzles[4] = true;
    currentRoom = 5;
    doors = [10, 9, 6];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        text: "Incorrect. You cannot attempt to unlock this door again for one minute.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    lockedPuzzles[4] = true;
    setTimeout(function(){
      lockedPuzzles[4] = false;
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 5 is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }, 60000);
    }
  }
     else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 5 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
     }
   }   
});
controller.hears(["Key 6:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 6){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
  if(lockedPuzzles[5] == false){
    if(message.text == "Key 6: 54 levels"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 6 - Demeter",
        text: "You have entered room 6, with doors to rooms 8, 3 and 4",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    solvedPuzzles[5] = true;
    currentRoom = 6;
    doors = [8, 3, 4];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        text: "Incorrect. You cannot attempt to unlock this door again for one minute.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    lockedPuzzles[5] = true;
    setTimeout(function(){
      lockedPuzzles[5] = false;
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 6 is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }, 60000);
    }
  }
     else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 6 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
     }
   }   
});
controller.hears(["Key 7:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 7){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
  if(lockedPuzzles[6] == false){
    if(message.text == "Key 7: 77" || message.text == "Key 7: 78"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 7 - Athena",
        text: "You have entered room 7, which has no doors, so let's put you back in room" + currentRoom,
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
        solvedPuzzles[6] = true;
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        text: "Incorrect. You cannot attempt to unlock this door again for one minute.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    lockedPuzzles[6] = true;
    setTimeout(function(){
      lockedPuzzles[6] = false;
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 7 is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }, 60000);
    }
  }
     else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 7 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
     }
   }   
});
controller.hears(["Key 8:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 8){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
  if(lockedPuzzles[7] == false){
    if(message.text == "Key 8: 0"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 8 - Apollo & Artemis",
        text: "You have entered room 8, with doors to rooms 7, 6 and 9",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    solvedPuzzles[7] = true;
    currentRoom = 8;
    doors = [7, 6, 9];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        text: "Incorrect. You cannot attempt to unlock this door again for one minute.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    lockedPuzzles[7] = true;
    setTimeout(function(){
      lockedPuzzles[7] = false;
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 8 is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }, 60000);
    }
  }
     else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 8 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
     }
   }   
});
controller.hears(["Key 9:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 9){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
  if(lockedPuzzles[8] == false){
    if(message.text == "Key 9: 50"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 9 - Ares",
        text: "You have entered room 9, with doors to rooms 7, 3 and 4",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    solvedPuzzles[8] = true;
    currentRoom = 9;
    doors = [7, 3, 4];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        text: "Incorrect. You cannot attempt to unlock this door again for one minute.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    lockedPuzzles[8] = true;
    setTimeout(function(){
      lockedPuzzles[8] = false;
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 9 is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }, 60000);
    }
  }
     else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 9 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
     }
   }   
});
controller.hears(["Key 10:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 10){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors) {
  if(lockedPuzzles[9] == false){
    if(message.text == "Key 10: 82"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 10 - Aphrodite",
        text: "You have entered room 10, with doors to rooms 2, 9 and 6",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    solvedPuzzles[9] = true;
    currentRoom = 10;
    doors = [2, 9, 6];
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        text: "Incorrect. You cannot attempt to unlock this door again for one minute.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    lockedPuzzles[9] = true;
    setTimeout(function(){
      lockedPuzzles[9] = false;
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 10 is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }, 60000);
    }
  }
     else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 10 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
     }
   }   
});
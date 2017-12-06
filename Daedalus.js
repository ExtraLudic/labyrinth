var express = require('express');
var bodyParser = require('body-parser');
 
var app = express();
var port = process.env.PORT || 1337;

var Botkit = require('botkit');

var controller = Botkit.slackbot({
  interactive_replies: true,
  require_delivery: true
});

var currentRoom = 1;
var doors = [5, 8, 4];
var solvedPuzzles = [false, false, false, false, false, false, false, false, false, false];
var lockedPuzzles = [false, false, false, false, false, false, false, false, false, false];
var haveRubyKey = false;
var haveCoin = false;
var keyQuestionAsked = false;
var bottestingid = 'C7WLECZAR';
var labyrinthchannelid = 'C7TBY98TS';
var daedalusemoji = "https://avatars.slack-edge.com/2017-11-08/269162770516_e2c4553016a99b14da83_72.png";
var bot = controller.spawn({

  token: "xoxb-270188256679-jETUTA0D57vxXNuJIt0LezfD"

})

bot.startRTM(function(err,bot,payload) {

  
  if (err) {

    throw new Error('Could not connect to Slack');

  }
  bot.say(
        {
        username: 'Daedalus',
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments:
        [
          {
            title: 'Hey there, player! Welcome to the Labyrinth minigame! Are you ready to begin?',
            callback_id: '123',
            attachment_type: 'default',
            actions: [
            {
            "name" : "enterlabyrinth",
            "text": "Enter Labyrinth",
            "value": "enter",
            "type": "button",
            },
            {
            "name" : "quit",
            "text": "No, I quit.",
            "value": "quit",
            "type": "button",
            }
            ]
          }
        ]
        }
  );

});

controller.on('interactive_message_callback', function(bot, message) {

    bot.say({
        username: 'Daedalus',
        title: "Room 1 - Daedalus",
        text: message.text,
        channel: bottestingid,
        icon_url: daedalusemoji
    });
      /*
    }
    bot.replyInteractive(message, {
        text: '...',
        attachments: [
            {
                title: 'My buttons',
                callback_id: '123',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"yes",
                        "text": "Yes!",
                        "value": "yes",
                        "type": "button",
                    },
                    {
                       "text": "No!",
                        "name": "no",
                        "value": "delete",
                        "style": "danger",
                        "type": "button",
                        "confirm": {
                          "title": "Are you sure?",
                          "text": "This will do something!",
                          "ok_text": "Yes",
                          "dismiss_text": "No"
                        }
                    }
                ]
            }
        ]
    });
    */
});

controller.hears(["Enter Labyrinth"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
        bot.say(
        {
        username: 'Daedalus',
        title: "Room 1 - Daedalus",
        text: 'You enter a dimly lit room and Daedalus greets you. “Welcome to my Labyrinth. You must find your way to Room 10 and then back to me. Do this before your opponents, and you will achieve the greatest victory of all. To get the key to a room, you’ll need to solve a puzzle. Ready to start? All you need to do is choose a room to go into by typing "Enter Room #".” You look around the room, and see four silver pads on the floor. You hesitantly advance towards one…\nBefore you go, Daedalus tosses something toward you. Your hand darts out and catches it: a bronze coin embossed with the swirling patterns of the labyrinth.\nRoom 5, Room 8, Room 4, or type "Exit Labyrinth" and claim victory!',
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
        haveCoin = true;
});

controller.hears(["Give Key"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(currentRoom == 2){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 2 - The Pantheon",
        text: '“Fool! The Architect told you not to give the key to anyone. How did anyone so stupid make it this far? You have clearly learned nothing. My advice is to find the seventh room.”',
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
  }
});

controller.hears(["Give Coin"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(currentRoom == 6 && haveCoin){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 6 - Demeter",
        text: 'The peacock devours the coin hungrily then speaks. “The eighth door is sealed with a code. It spells a word with zeros and ones. Binary.”',
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
  }
  haveCoin = false;
});

controller.hears(["Ruby"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(currentRoom == 1 && haveRubyKey && keyQuestionAsked) {
        bot.say(
        {
        username: 'Daedalus',
        title: "Exit of Labyrinth",
        text: 'Champion, you are free to leave and claim the greatest victory of all. YOU WIN!',
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
        bot.closeRTM();
  }
});

controller.hears(["Exit Labyrinth"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(currentRoom == 1) {
    if(haveRubyKey) {
      bot.say(
        {
        username: 'Daedalus',
        title: "Exit of Labyrinth",
        text: 'If you have the key to the exit, what gemstone is it made out of?',
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
        keyQuestionAsked = true;
    }
    else {
      bot.say(
        {
        username: 'Daedalus',
        title: "Exit of Labyrinth",
        text: 'Journey to the 10th room and get the exit key.',
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    }
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
        text: 'In the center of this plane, granite-walled room, a bearded figure sits cross-legged, wearing spartan clothes the same color as the stone. He smiles as you enter and speaks in strange tones….\n“Congratulations on discovering the center of my Labyrinth. But now you must find your way back out.”\nHe stretches out a hand. Drooping tantalizingly from between his pointer and middle fingers is a key made of shining ruby. Without hesitation, you reach out and grab the Ruby Key.\n“Good,” he says.\n“You have traveled through air, water, and stone to reach me. To escape, you must pass by fire. Do not give this Ruby Key to anyone, no matter what they say.”\nRoom 2, Room 9, Room 6',
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
        text: "It's locked. Better solve this puzzle.\n\n“Need a new place?” Hit the street for a better view, then tell me the phone number to call.\n42.338838, -71.092494",
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

controller.hears(["Enter Room 1"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  var isOneOfDoors = false;
  for(var x = 0; x < doors.length; x++){
    if(doors[x] == 1){
      isOneOfDoors = true;
      break;
    }
  }
  if(isOneOfDoors && message.text == "Enter Room 1") {
    if(solvedPuzzles[0] == true){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 1 - Daedalus",
        text: 'You enter a dimly lit room and Daedalus greets you. “Welcome to my Labyrinth. You must find your way to Room 10 and then back to me. Do this before your opponents, and you will achieve the greatest victory of all. To get the key to a room, you’ll need to solve a puzzle. Ready to start? All you need to do is choose a room to go into by typing "Enter Room #".” You look around the room, and see four silver pads on the floor. You hesitantly advance towards one…\nBefore you go, Daedalus tosses something toward you. Your hand darts out and catches it: a bronze coin embossed with the swirling patterns of the labyrinth.\nRoom 5, Room 8, Room 4, or type "Exit Labyrinth" and claim victory!',
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
        text: "It's locked. Better solve this puzzle.\n\nSomewhere in the labyrinth there is a remarkable cat. What does she transform into?",
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
        text: 'At the center of this room is a burnished metal plinth with obviously holographic fire jetting upward from its lens-like surface. Loose square bits float upward toward the ceiling like sparks. As you move closer to the center, a demonic face appears in the fire.\n“Congratulations on finding my room! Your victory is nigh…. That is, if you’ve been paying attention to your surroundings.”\n“You may pass through any of these doors if you know the words and the way. But if you are not sure… give ME the Ruby Key from the center of the maze. I will reward you greatly.”\nRoom 1, Room 6, Room 3 or type "Give Key" to give the key away',
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
        text: "It's locked. Better solve this puzzle.\n\nDAEDALUS… Sec. 10… [link=]1… DOB",
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
        text: 'This small, five-sided room is a gorgeous indoor garden. The floor is lined with grass, despite the enclosed space, and a bright sun shines from above, just through the glass ceiling. Flowers bloom and flourish everywhere, so it’s impossible to avoid stepping on one, and the smell of bread and flowers permeates the air. Four tall ivy-wrapped trees are scattered about the room, and each trunk holds a portal, though there are sturdy chains tossed around the tree, preventing entrance. On the other side of each tree, you see an area where the bark has been scraped away to the under-layer, and luminescent blue words appear on the very bark: “MARK WELL THE 8th.” When you touch the bark, blue light appears beneath your finger, and you recognize the setup as a console.\nRoom 7, Room 9, Room 4',
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
        text: 'Mist fills this arc-shaped, white marble, room, and rainbows are visible everywhere. The mist makes the marble underfoot slick, and you have to squint to see through the colors that reflect off every shining surface. You notice that, at each end of the arc, there are two teleportation pads, and their appropriate consoles.\nThe mist interacts strangely with the devices, causing momentary blinks of static, some form of short-circuiting. With each blink you see momentary flashes of another world.\nRoom 7, Room 3, Room 8',
        channel: bottestingid,
        icon_url: daedalusemoji,
        image_url: 'https://en.wikipedia.org/wiki/Mist#/media/File:Oberfallenberg_8.jpg',
        attachments:[
          {
            fallback: "Required plain-text summary of the attachment.",
            image_url: "https://en.wikipedia.org/wiki/Mist#/media/File:Oberfallenberg_8.jpg",
            thumb_url: "https://en.wikipedia.org/wiki/Mist#/media/File:Oberfallenberg_8.jpg"
          }
          ]
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
        text: 'You step into a small, triangular room. Water pools on the floor, about an inch high, and small waterfalls run down the pale blue walls, apparently coming from gaps in the ceiling. In the three corners of the room, and in the center, there are slightly-elevated platforms, which you recognize as teleportation pads. There are glowing blue consoles on top of pipes next to each of them, though these ones are made of brass.\nRoom 10, Room 9, Room 6',
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
        text: 'You step into a hexagonal room with a large white platform in the center. Resting on the platform is a large silver Peacock. It’s amazingly realistic, but as it turns to look at you, you hear the whir of tiny gears. It stares at you with vivid glass eyes and speaks in a metallic voice:\n“Feed me your coin and I will give you a clue to speed your journey.”\nYou now realize that the bird was not looking at you at all, but is rather staring hungrily at the labyrinth coin Daedalus tossed you when you first entered the maze. You could feed it to the bird, but you’ve actually grown rather attached to it…\nTo give the peacock a coin, type “GIVE COIN”\nRoom 8, Room 3, Room 4 or type "Give Coin" to give the bird your coin',
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
        text: 'You step out into empty space, and are instantly aware this not-room lacks oxygen. As your throat constricts, and your eyesight fails you, you have a vision of a many-pillared building, where twelve enormous figures appear to be heatedly debating something. A thirteenth, dark, figure is standing before a podium, as though on trial. None of the figures take notice of you, so you turn around and leave the building, finding yourself back in room ' + currentRoom,
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
        text: "It's locked. Better solve this puzzle.\n\nAn evil witch cursed Jason to always roll the lowest possible number on every die he rolls. If he played Monopoly, what would be the first property he landed on?",
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
        text: 'You enter a room with walls of dark grey marble. Two torches stand in the center of the room, one burning blue, and one burning red. A small cat is curled around the bases of the torches, though it appears slightly translucent when you look at it directly. You walk to the other end of the room, where you can see four teleportation pads, and their consoles. When you look back, the cat has been replaced by an equally-translucent guard dog, staring intently at something on the other side of the room.\nRoom 7, Room 6, Room 9',
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
        text: "It's locked. Better solve this puzzle.\n\nDecode: 01110000 01100001 01110011 01110011 01110111 01101111 01110010 01100100",
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
        text: "This room is a small square of pale blue marble, with the sky very visible through the open roof. The sound of laughter echoes through the room endlessly, but there appears to be nothing more to stop you from advancing through the doors on the walls than the usual consoles beside them. You attempt to probe the room for further secrets, but find that you can’t get to the bottom of it. You decide to just put it behind you.\nRoom 7, Room 3, Room 4",
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
        text: "It's locked. Better solve this puzzle.\n\nA farmer has a fox and two chickens and he needs to take them to town to sell them. He can’t leave the fox alone with the chickens because the fox will eat them. He comes to a river and needs to cross it to get to town. He finds a small boat that can carry only him and one animal. How many times does he need to cross the river to get to town and then back home?",
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
    if(message.text == "Key 1: A Guard Dog"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 1 - Daedalus",
        text: 'You enter a dimly lit room and Daedalus greets you. “Welcome to my Labyrinth. You must find your way to Room 10 and then back to me. Do this before your opponents, and you will achieve the greatest victory of all. To get the key to a room, you’ll need to solve a puzzle. Ready to start? All you need to do is choose a room to go into by typing "Enter Room #".” You look around the room, and see four silver pads on the floor. You hesitantly advance towards one…\nBefore you go, Daedalus tosses something toward you. Your hand darts out and catches it: a bronze coin embossed with the swirling patterns of the labyrinth.\nRoom 5, Room 8, Room 4, or type "Exit Labyrinth" and claim victory!',
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
    if(message.text == "Key 2: July 15, 1796"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 2 - The Pantheon",
        text: 'At the center of this room is a burnished metal plinth with obviously holographic fire jetting upward from its lens-like surface. Loose square bits float upward toward the ceiling like sparks. As you move closer to the center, a demonic face appears in the fire.\n“Congratulations on finding my room! Your victory is nigh…. That is, if you’ve been paying attention to your surroundings.”\n“You may pass through any of these doors if you know the words and the way. But if you are not sure… give ME the Ruby Key from the center of the maze. I will reward you greatly.”\nRoom 1, Room 6, Room 3 or type "Give Key" to give the key away',
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
        text: 'This small, five-sided room is a gorgeous indoor garden. The floor is lined with grass, despite the enclosed space, and a bright sun shines from above, just through the glass ceiling. Flowers bloom and flourish everywhere, so it’s impossible to avoid stepping on one, and the smell of bread and flowers permeates the air. Four tall ivy-wrapped trees are scattered about the room, and each trunk holds a portal, though there are sturdy chains tossed around the tree, preventing entrance. On the other side of each tree, you see an area where the bark has been scraped away to the under-layer, and luminescent blue words appear on the very bark: “MARK WELL THE 8th.” When you touch the bark, blue light appears beneath your finger, and you recognize the setup as a console.\nRoom 7, Room 9, Room 4',
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
    if(message.text == "Key 4: 54 Levels"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 4 - Hera",
        text: 'Mist fills this arc-shaped, white marble, room, and rainbows are visible everywhere. The mist makes the marble underfoot slick, and you have to squint to see through the colors that reflect off every shining surface. You notice that, at each end of the arc, there are two teleportation pads, and their appropriate consoles.\nThe mist interacts strangely with the devices, causing momentary blinks of static, some form of short-circuiting. With each blink you see momentary flashes of another world.\nRoom 7, Room 3, Room 8',
        channel: bottestingid,
        icon_url: daedalusemoji,
        image_url: 'https://en.wikipedia.org/wiki/Mist#/media/File:Oberfallenberg_8.jpg'
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
    if(message.text == "Key 5: 44"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 5 - Poseidon",
        text: 'You step into a small, triangular room. Water pools on the floor, about an inch high, and small waterfalls run down the pale blue walls, apparently coming from gaps in the ceiling. In the three corners of the room, and in the center, there are slightly-elevated platforms, which you recognize as teleportation pads. There are glowing blue consoles on top of pipes next to each of them, though these ones are made of brass.\nRoom 10, Room 9, Room 6',
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
    if(message.text == "Key 6: 82"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 6 - Demeter",
        text: 'You step into a hexagonal room with a large white platform in the center. Resting on the platform is a large silver Peacock. It’s amazingly realistic, but as it turns to look at you, you hear the whir of tiny gears. It stares at you with vivid glass eyes and speaks in a metallic voice:\n“Feed me your coin and I will give you a clue to speed your journey.”\nYou now realize that the bird was not looking at you at all, but is rather staring hungrily at the labyrinth coin Daedalus tossed you when you first entered the maze. You could feed it to the bird, but you’ve actually grown rather attached to it…\nTo give the peacock a coin, type “GIVE COIN”\nRoom 8, Room 3, Room 4 or type "Give Coin" to give the bird your coin',
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
    if(message.text == "Key 7: Virginia Ave"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 7 - Athena",
        text: 'You step out into empty space, and are instantly aware this not-room lacks oxygen. As your throat constricts, and your eyesight fails you, you have a vision of a many-pillared building, where twelve enormous figures appear to be heatedly debating something. A thirteenth, dark, figure is standing before a podium, as though on trial. None of the figures take notice of you, so you turn around and leave the building, finding yourself back in room ' + currentRoom,
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
    if(message.text == "Key 8: password"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 8 - Apollo & Artemis",
        text: 'You enter a room with walls of dark grey marble. Two torches stand in the center of the room, one burning blue, and one burning red. A small cat is curled around the bases of the torches, though it appears slightly translucent when you look at it directly. You walk to the other end of the room, where you can see four teleportation pads, and their consoles. When you look back, the cat has been replaced by an equally-translucent guard dog, staring intently at something on the other side of the room.\nRoom 7, Room 6, Room 9',
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
    if(message.text == "Key 9: 8"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 9 - Ares",
        text: "This room is a small square of pale blue marble, with the sky very visible through the open roof. The sound of laughter echoes through the room endlessly, but there appears to be nothing more to stop you from advancing through the doors on the walls than the usual consoles beside them. You attempt to probe the room for further secrets, but find that you can’t get to the bottom of it. You decide to just put it behind you.\nRoom 7, Room 3, Room 4",
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
    if(message.text == "Key 10: 6174219111" || message.text == "Key 10: 617-421-9111"){
    bot.say(
        {
        username: 'Daedalus',
        title: "Room 10 - Aphrodite",
        text: 'In the center of this plane, granite-walled room, a bearded figure sits cross-legged, wearing spartan clothes the same color as the stone. He smiles as you enter and speaks in strange tones….\n“Congratulations on discovering the center of my Labyrinth. But now you must find your way back out.”\nHe stretches out a hand. Drooping tantalizingly from between his pointer and middle fingers is a key made of shining ruby. Without hesitation, you reach out and grab the Ruby Key.\n“Good,” he says.\n“You have traveled through air, water, and stone to reach me. To escape, you must pass by fire. Do not give this Ruby Key to anyone, no matter what they say.”\nRoom 2, Room 9, Room 6',
        channel: bottestingid,
        icon_url: daedalusemoji
        }
        );
    haveRubyKey = true;
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
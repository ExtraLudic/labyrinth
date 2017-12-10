var express = require('express');
var bodyParser = require('body-parser');
 
var app = express();
var port = process.env.PORT || 1337;

var Botkit = require('botkit');

var controller = Botkit.slackbot({
  json_file_store: './db_slackbutton_bot/',
  interactive_replies: true,
  debug: true,
  require_delivery: true
}).configureSlackApp({
    clientId: "284487422181.283793397088",
    clientSecret: 'e0409faa585e9ac36722fd5be19125c1',
    scopes: ['commands', 'bot'],
});;

controller.setupWebserver((port), function(err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);

    controller.createOauthEndpoints(controller.webserver, function(err, req, res) {
        if (err) {
            res.status(500).send('ERROR: ' + err);
        } else {
            res.send('Success!');
        }
    });

    // If not also opening an RTM connection
    controller.startTicking();
});

var currentRoom = 1;
var doors = [5, 8, 4];
var solvedPuzzles = ["danger", "danger", "danger", "danger", "danger", "danger", "danger", "danger", "danger", "danger"];
var lockedPuzzles = [false, false, false, false, false, false, false, false, false, false];
var puzzleQuestionAsked = [false, false, false, false, false, false, false, false, false, false];
var haveRubyKey = false;
var haveCoin = false;
var keyQuestionAsked = false;
var bottestingid = 'C7WLECZAR';
var labyrinthchannelid = 'C7TBY98TS';
var daedalusemoji = "https://avatars.slack-edge.com/2017-11-08/269162770516_e2c4553016a99b14da83_72.png";
var bot = controller.spawn({

  token: "xoxb-285523211751-U6yzb84gr97YPDnekyCI92lX"

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
            callback_id: 'IntroMessage',
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
  if(message.callback_id == 'IntroMessage') {
    if(message.actions[0].name.match("enterlabyrinth") || message.actions[0].name.match("newlabyrinth")){ 
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                title: 'Room 1 - Daedalus',
                callback_id: 'Room 1',
                text: 'You enter a dimly lit room and Daedalus greets you. “Welcome to my Labyrinth. You must find your way to Room 10 and then back to me. Do this before your opponents, and you will achieve the greatest victory of all. To get the key to a room, you’ll need to solve a puzzle. Ready to start? All you need to do is choose a room.” You look around the room, and see four silver pads on the floor. You hesitantly advance towards one…\nBefore you go, Daedalus tosses something toward you. Your hand darts out and catches it: a bronze coin embossed with the swirling patterns of the labyrinth.',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 5",
                        "text": "Enter Room 5",
                        "value": "5",
                        "style": solvedPuzzles[4],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 8",
                        "text": "Enter Room 8",
                        "value": "8",
                        "style": solvedPuzzles[7],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 4",
                        "text": "Enter Room 4",
                        "value": "4",
                        "style": solvedPuzzles[3],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    }
    else if(message.actions[0].name.match("quit")){
      bot.closeRTM();
    }
  }
  else if(message.actions[0].value.match("1") && !message.actions[0].value.match("10")){ 
    if(solvedPuzzles[0] == "default") {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 1 - Daedalus",
                text: 'You find yourself back in the first room of the labyrinth. The old man is nowhere to be seen. For the first time you notice a keyhole on the wall. Confident, you approach it and produce your Ruby Key. You insert it into the keyhole and the entire room is bathed in shimmering vermillion light. An overwhelming sense of lightness overcomes you and your body melts away.\n\nA voice comes from everywhere and nowhere:\n\n“You have mastered the labyrinth, solved all of my challenges, and proved yourself the ultimate champion. Congratulations! Your intelligence has been downloaded and archived to the collective.”\n\nClick "New Labyrinth" to play again and "Quit Labyrinth" to quit.',
                callback_id: 'IntroMessage',
                attachment_type: 'default',
                actions: [
                    {
                        "name": "New Labyrinth",
                        "text": "New Labyrinth",
                        "value": "newlabyrinth",
                        "type": "button"
                    },
                    {
                        "name": "quit",
                        "text": "Quit Labyrinth",
                        "value": "quit",
                        "type": "button"
                    }
                ]
            }
        ]
    });
    currentRoom = 1;
    doors = [5, 8, 4];
    }
    else {
      var leftdoor = 0;
      if(doors.indexOf(1) == 0) {
        leftdoor = doors[(doors.indexOf(1) + 2) % 3];
      }
      else {
        leftdoor = doors[(doors.indexOf(1) - 1) % 3];
      }
      bot.reply(message,
        {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
              username: 'Daedalus',
              title: "Room 1 - Daedalus",
              text: "It's locked. Better solve this puzzle.\n\nSomewhere in the labyrinth there is a remarkable cat. What does she transform into?",
              callback_id: 'Solve 1',
              attachment_type: 'default',
              actions: [
                    {
                        "name": "Solve 1",
                        "text": "Try to Solve Puzzle 1",
                        "value": "solveFirst",
                        "type": "button"
                    },
                    {
                        "name": "Check door to left",
                        "text": "Try door " + leftdoor,
                        "value": leftdoor.toString(),
                        "type": "button"
                    },
                    {
                        "name": "Check door to right",
                        "text": "Try door " + doors[(doors.indexOf(1) + 1) % 3],
                        "value": doors[(doors.indexOf(1) + 1) % 3].toString(),
                        "type": "button"
                    }
              ]
            }
          ]
        }
        );
    } 
  }
  else if(message.actions[0].value.match("2")){ 
    if(solvedPuzzles[1] == "default") {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 2 - The Pantheon",
                text: 'At the center of this room is a burnished metal plinth with obviously holographic fire jetting upward from its lens-like surface. Loose square bits float upward toward the ceiling like sparks. As you move closer to the center, a demonic face appears in the fire.\n“Congratulations on finding my room! Your victory is nigh…. That is, if you’ve been paying attention to your surroundings.”\n“You may pass through any of these doors if you know the words and the way. But if you are not sure… give ME the Ruby Key from the center of the maze. I will reward you greatly.”',
                callback_id: 'Room 2',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 1",
                        "text": "Enter Room 1",
                        "value": "1",
                        "style": solvedPuzzles[0],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 6",
                        "text": "Enter Room 6",
                        "value": "6",
                        "style": solvedPuzzles[5],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Give Key",
                        "text": "Give him your key",
                        "value": "givekey",
                        "type": "button"
                    }
                ]
            }
        ]
    });
    currentRoom = 2;
    doors = [1, 6, 3];
    }
    else {
      var leftdoor = 0;
      if(doors.indexOf(2) == 0) {
        leftdoor = doors[(doors.indexOf(2) + 2) % 3];
      }
      else {
        leftdoor = doors[(doors.indexOf(2) - 1) % 3];
      }
      bot.reply(message,
        {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
              username: 'Daedalus',
              title: "Room 2 - The Pantheon",
              text: "It's locked. Better solve this puzzle.\n\nhttps://en.wikipedia.org/wiki/Daedalus Sec. 9.2... link 1… DOB",
              callback_id: 'Solve 2',
              attachment_type: 'default',
              actions: [
                    {
                        "name": "Solve 2",
                        "text": "Try to Solve Puzzle 2",
                        "value": "solveSecond",
                        "type": "button"
                    },
                    {
                        "name": "Check door to left",
                        "text": "Try door " + leftdoor,
                        "value": leftdoor.toString(),
                        "type": "button"
                    },
                    {
                        "name": "Check door to right",
                        "text": "Try door " + doors[(doors.indexOf(2) + 1) % 3],
                        "value": doors[(doors.indexOf(2) + 1) % 3].toString(),
                        "type": "button"
                    }
              ]
            }
          ]
        }
        );
    }
  }
  else if(message.actions[0].value.match("3")){ 
    if(solvedPuzzles[2] == "default") {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 3 - Zeus",
                text: 'This small, five-sided room is a gorgeous indoor garden. The floor is lined with grass, despite the enclosed space, and a bright sun shines from above, just through the glass ceiling. Flowers bloom and flourish everywhere, so it’s impossible to avoid stepping on one, and the smell of bread and flowers permeates the air. Four tall ivy-wrapped trees are scattered about the room, and each trunk holds a portal, though there are sturdy chains tossed around the tree, preventing entrance. On the other side of each tree, you see an area where the bark has been scraped away to the under-layer, and luminescent blue words appear on the very bark: “MARK WELL THE 8th.” When you touch the bark, blue light appears beneath your finger, and you recognize the setup as a console.',
                callback_id: 'Room 3',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 9",
                        "text": "Enter Room 9",
                        "value": "9",
                        "style": solvedPuzzles[8],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 4",
                        "text": "Enter Room 4",
                        "value": "4",
                        "style": solvedPuzzles[3],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    currentRoom = 3;
    doors = [7, 9, 4];
   }
   else {
    var leftdoor = 0;
      if(doors.indexOf(3) == 0) {
        leftdoor = doors[(doors.indexOf(3) + 2) % 3];
      }
      else {
        leftdoor = doors[(doors.indexOf(3) - 1) % 3];
      }
      bot.reply(message,
        {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
              username: 'Daedalus',
              title: "Room 3 - Zeus",
              text: "It's locked. Better solve this puzzle.\n\nYou have two containers and a water reservoir. One container holds exactly three gallons and the other holds exactly 5 gallons. What is the minimum amount of water that you would need in the water reservoir to get exactly 4 gallons of water in the five gallon container and to be sure that you had exactly 4 gallons?",
              callback_id: 'Solve 3',
              attachment_type: 'default',
              actions: [
                    {
                        "name": "Solve 3",
                        "text": "Try to Solve Puzzle 3",
                        "value": "solveThird",
                        "type": "button"
                    },
                    {
                        "name": "Check door to left",
                        "text": "Try door " + leftdoor,
                        "value": leftdoor.toString(),
                        "type": "button"
                    },
                    {
                        "name": "Check door to right",
                        "text": "Try door " + doors[(doors.indexOf(3) + 1) % 3],
                        "value": doors[(doors.indexOf(3) + 1) % 3].toString(),
                        "type": "button"
                    }
              ]
            }
          ]
        }
        );
   }
  }
  else if(message.actions[0].value.match("4")){ 
    if(solvedPuzzles[3] == "default") {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 4 - Hera",
                text: 'Mist fills this arc-shaped, white marble, room, and rainbows are visible everywhere. The mist makes the marble underfoot slick, and you have to squint to see through the colors that reflect off every shining surface. You notice that, at each end of the arc, there are two teleportation pads, and their appropriate consoles.\nThe mist interacts strangely with the devices, causing momentary blinks of static, some form of short-circuiting. With each blink you see momentary flashes of another world.',
                callback_id: 'Room 4',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 8",
                        "text": "Enter Room 8",
                        "value": "8",
                        "style": solvedPuzzles[7],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    currentRoom = 4;
    doors = [7, 3, 8];
    }
    else {
      var leftdoor = 0;
      if(doors.indexOf(4) == 0) {
        leftdoor = doors[(doors.indexOf(4) + 2) % 3];
      }
      else {
        leftdoor = doors[(doors.indexOf(4) - 1) % 3];
      }
      bot.reply(message,
        {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
              username: 'Daedalus',
              title: "Room 4 - Hera",
              text: "It's locked. Better solve this puzzle.\n\nJan and Sven are the two greatest Jenga players in the world. They decide to play a game of Jenga following all the normal rules, but add these additional rules to make it more challenging: Both players must always pull from the lowest possible level on the tower. Neither player is allowed to pull middle pieces. After an hour of intense play, the game ends in a draw when there are no legal pulls left, but the tower is still standing. How many levels high is the tower?",
              callback_id: 'Solve 4',
              attachment_type: 'default',
              actions: [
                    {
                        "name": "Solve 4",
                        "text": "Try to Solve Puzzle 4",
                        "value": "solveFourth",
                        "type": "button"
                    },
                    {
                        "name": "Check door to left",
                        "text": "Try door " + leftdoor,
                        "value": leftdoor.toString(),
                        "type": "button"
                    },
                    {
                        "name": "Check door to right",
                        "text": "Try door " + doors[(doors.indexOf(4) + 1) % 3],
                        "value": doors[(doors.indexOf(4) + 1) % 3].toString(),
                        "type": "button"
                    }
              ]
            }
          ]
        }
        );
    }
  }
  else if(message.actions[0].value.match("5")){ 
    if(solvedPuzzles[4] == "default") {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 5 - Poseidon",
                text: 'You step into a small, triangular room. Water pools on the floor, about an inch high, and small waterfalls run down the pale blue walls, apparently coming from gaps in the ceiling. In the three corners of the room, and in the center, there are slightly-elevated platforms, which you recognize as teleportation pads. There are glowing blue consoles on top of pipes next to each of them, though these ones are made of brass.',
                callback_id: 'Room 5',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 10",
                        "text": "Enter Room 10",
                        "value": "10",
                        "style": solvedPuzzles[9],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 9",
                        "text": "Enter Room 9",
                        "value": "9",
                        "style": solvedPuzzles[8],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 6",
                        "text": "Enter Room 6",
                        "value": "6",
                        "style": solvedPuzzles[5],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    currentRoom = 5;
    doors = [10, 9, 6];
    }
    else {
      var leftdoor = 0;
      if(doors.indexOf(5) == 0) {
        leftdoor = doors[(doors.indexOf(5) + 2) % 3];
      }
      else {
        leftdoor = doors[(doors.indexOf(5) - 1) % 3];
      }
      bot.reply(message,
        {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
              username: 'Daedalus',
              title: "Room 5 - Poseidon",
              text: "It's locked. Better solve this puzzle.\n\n Winston Churchill received a 750ml bottle of scotch the day his son was born. On his son’s first birthday, Churchill drank one shot from the bottle. On his second birthday, two shots, and on his third birthday three, and so on. How old was Churchill when he finished the bottle?",
              callback_id: 'Solve 5',
              attachment_type: 'default',
              actions: [
                    {
                        "name": "Solve 5",
                        "text": "Try to Solve Puzzle 5",
                        "value": "solveFifth",
                        "type": "button"
                    },
                    {
                        "name": "Check door to left",
                        "text": "Try door " + leftdoor,
                        "value": leftdoor.toString(),
                        "type": "button"
                    },
                    {
                        "name": "Check door to right",
                        "text": "Try door " + doors[(doors.indexOf(5) + 1) % 3],
                        "value": doors[(doors.indexOf(5) + 1) % 3].toString(),
                        "type": "button"
                    }
              ]
            }
          ]
        }
        );
    }
  }
  else if(message.actions[0].value.match("6")){ 
    if(solvedPuzzles[5] == "default") {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 6 - Demeter",
                text: 'You step into a hexagonal room with a large white platform in the center. Resting on the platform is a large silver Peacock. It’s amazingly realistic, but as it turns to look at you, you hear the whir of tiny gears. It stares at you with vivid glass eyes and speaks in a metallic voice:\n“Feed me your coin and I will give you a clue to speed your journey.”\nYou now realize that the bird was not looking at you at all, but is rather staring hungrily at the labyrinth coin Daedalus tossed you when you first entered the maze. You could feed it to the bird, but you’ve actually grown rather attached to it…',
                callback_id: 'Room 6',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 8",
                        "text": "Enter Room 8",
                        "value": "8",
                        "style": solvedPuzzles[7],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 4",
                        "text": "Enter Room 4",
                        "value": "4",
                        "style": solvedPuzzles[3],
                        "type": "button"
                    },
                    {
                        "name": "Give Coin",
                        "text": "Give coin to peacock",
                        "value": "givecoin",
                        "type": "button"
                    }
                ]
            }
        ]
    });
    currentRoom = 6;
    doors = [8, 3, 4];
    }
    else {
      var leftdoor = 0;
      if(doors.indexOf(6) == 0) {
        leftdoor = doors[(doors.indexOf(6) + 2) % 3];
      }
      else {
        leftdoor = doors[(doors.indexOf(6) - 1) % 3];
      }
      bot.reply(message,
        {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
              username: 'Daedalus',
              title: "Room 6 - Demeter",
              text: "It's locked. Better solve this puzzle.\n\nHow old will Arnold Schwarzenegger be when Skynet has to send him back to kill Sarah Conner?",
              callback_id: 'Solve 6',
              attachment_type: 'default',
              actions: [
                    {
                        "name": "Solve 6",
                        "text": "Try to Solve Puzzle 6",
                        "value": "solveSixth",
                        "type": "button"
                    },
                    {
                        "name": "Check door to left",
                        "text": "Try door " + leftdoor,
                        "value": leftdoor.toString(),
                        "type": "button"
                    },
                    {
                        "name": "Check door to right",
                        "text": "Try door " + doors[(doors.indexOf(6) + 1) % 3],
                        "value": doors[(doors.indexOf(6) + 1) % 3].toString(),
                        "type": "button"
                    }
              ]
            }
          ]
        }
        );
    }
  }
  else if(message.actions[0].value.match("7")) {
    if(solvedPuzzles[6] == "default") {
    var presevenroom = 0;
    if(message.callback_id == "Room 3") {
      presevenroom = 3;
    }
    else if(message.callback_id == "Room 4") {
      presevenroom = 4;
    }
    else if(message.callback_id == "Room 8") {
      presevenroom = 8;
    }
    else if(message.callback_id == "Room 9") {
      presevenroom = 9;
    }
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 7 - Athena",
                text: 'You step out into empty space, and are instantly aware this not-room lacks oxygen. As your throat constricts, and your eyesight fails you, you have a vision of a many-pillared building, where twelve enormous figures appear to be heatedly debating something. A thirteenth, dark, figure is standing before a podium, as though on trial. None of the figures take notice of you, so you turn around and leave the building, finding yourself back in room ' + currentRoom,
                callback_id: 'Room 7',
            }
        ]
    }); 
    if(presevenroom == 3) {
      bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 3 - Zeus",
                text: 'This small, five-sided room is a gorgeous indoor garden. The floor is lined with grass, despite the enclosed space, and a bright sun shines from above, just through the glass ceiling. Flowers bloom and flourish everywhere, so it’s impossible to avoid stepping on one, and the smell of bread and flowers permeates the air. Four tall ivy-wrapped trees are scattered about the room, and each trunk holds a portal, though there are sturdy chains tossed around the tree, preventing entrance. On the other side of each tree, you see an area where the bark has been scraped away to the under-layer, and luminescent blue words appear on the very bark: “MARK WELL THE 8th.” When you touch the bark, blue light appears beneath your finger, and you recognize the setup as a console.',
                callback_id: 'Room 3',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 9",
                        "text": "Enter Room 9",
                        "value": "9",
                        "style": solvedPuzzles[8],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 4",
                        "text": "Enter Room 4",
                        "value": "4",
                        "style": solvedPuzzles[3],
                        "type": "button"
                    }
                ]
            }
        ]
    }); 
    }
    else if(presevenroom == 4) {
      bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 4 - Hera",
                text: 'Mist fills this arc-shaped, white marble, room, and rainbows are visible everywhere. The mist makes the marble underfoot slick, and you have to squint to see through the colors that reflect off every shining surface. You notice that, at each end of the arc, there are two teleportation pads, and their appropriate consoles.\nThe mist interacts strangely with the devices, causing momentary blinks of static, some form of short-circuiting. With each blink you see momentary flashes of another world.',
                callback_id: 'Room 4',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 8",
                        "text": "Enter Room 8",
                        "value": "8",
                        "style": solvedPuzzles[7],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    }
    else if(presevenroom == 8) {
      bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 8 - Apollo & Artemis",
                text: 'You enter a room with walls of dark grey marble. Two torches stand in the center of the room, one burning blue, and one burning red. A small cat is curled around the bases of the torches, though it appears slightly translucent when you look at it directly. You walk to the other end of the room, where you can see four teleportation pads, and their consoles. When you look back, the cat has been replaced by an equally-translucent guard dog, staring intently at something on the other side of the room.',
                callback_id: 'Room 8',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 6",
                        "text": "Enter Room 6",
                        "value": "6",
                        "style": solvedPuzzles[5],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 9",
                        "text": "Enter Room 9",
                        "value": "9",
                        "style": solvedPuzzles[8],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    }
    else if(presevenroom == 9) {
      bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 9 - Ares",
                text: "This room is a small square of pale blue marble, with the sky very visible through the open roof. The sound of laughter echoes through the room endlessly, but there appears to be nothing more to stop you from advancing through the doors on the walls than the usual consoles beside them. You attempt to probe the room for further secrets, but find that you can’t get to the bottom of it. You decide to just put it behind you.",
                callback_id: 'Room 9',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 4",
                        "text": "Enter Room 4",
                        "value": "4",
                        "style": solvedPuzzles[3],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    }
  } 
  else {
    var leftdoor = 0;
      if(doors.indexOf(7) == 0) {
        leftdoor = doors[(doors.indexOf(7) + 2) % 3];
      }
      else {
        leftdoor = doors[(doors.indexOf(7) - 1) % 3];
      }
    bot.reply(message,
        {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
              username: 'Daedalus',
              title: "Room 7 - Athena",
              text: "It's locked. Better solve this puzzle.\n\nAn evil witch cursed Jason to always roll the lowest possible number on every die he rolls. If he played Monopoly, what would be the first property he landed on?",
              callback_id: 'Solve 7',
              attachment_type: 'default',
              actions: [
                    {
                        "name": "Solve 7",
                        "text": "Try to Solve Puzzle 7",
                        "value": "solveSeventh",
                        "type": "button"
                    },
                    {
                        "name": "Check door to left",
                        "text": "Try door " + leftdoor,
                        "value": leftdoor.toString(),
                        "type": "button"
                    },
                    {
                        "name": "Check door to right",
                        "text": "Try door " + doors[(doors.indexOf(7) + 1) % 3],
                        "value": doors[(doors.indexOf(7) + 1) % 3].toString(),
                        "type": "button"
                    }
              ]
            }
          ]
        }
        );
    }
  }
  else if(message.actions[0].value.match("8")){ 
    if(solvedPuzzles[7] == "default") {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 8 - Apollo & Artemis",
                text: 'You enter a room with walls of dark grey marble. Two torches stand in the center of the room, one burning blue, and one burning red. A small cat is curled around the bases of the torches, though it appears slightly translucent when you look at it directly. You walk to the other end of the room, where you can see four teleportation pads, and their consoles. When you look back, the cat has been replaced by an equally-translucent guard dog, staring intently at something on the other side of the room.',
                callback_id: 'Room 8',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 6",
                        "text": "Enter Room 6",
                        "value": "6",
                        "style": solvedPuzzles[5],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 9",
                        "text": "Enter Room 9",
                        "value": "9",
                        "style": solvedPuzzles[8],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    currentRoom = 8;
    doors = [7, 6, 9];
    }
    else {
      var leftdoor = 0;
      if(doors.indexOf(8) == 8) {
        leftdoor = doors[(doors.indexOf(8) + 2) % 3];
      }
      else {
        leftdoor = doors[(doors.indexOf(8) - 1) % 3];
      }
      bot.reply(message,
        {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
              username: 'Daedalus',
              title: "Room 8 - Apollo & Artemis",
              text: "It's locked. Better solve this puzzle.\n\nDecode: 01110000 01100001 01110011 01110011 01110111 01101111 01110010 01100100",
              callback_id: 'Solve 8',
              attachment_type: 'default',
              actions: [
                    {
                        "name": "Solve 8",
                        "text": "Try to Solve Puzzle 8",
                        "value": "solveEighth",
                        "type": "button"
                    },
                    {
                        "name": "Check door to left",
                        "text": "Try door " + leftdoor,
                        "value": leftdoor.toString(),
                        "type": "button"
                    },
                    {
                        "name": "Check door to right",
                        "text": "Try door " + doors[(doors.indexOf(8) + 1) % 3],
                        "value": doors[(doors.indexOf(8) + 1) % 3].toString(),
                        "type": "button"
                    }
              ]
            }
          ]
        }
        );
    }
  }
  else if(message.actions[0].value.match("9")){
    if(solvedPuzzles[8] == "default") {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 9 - Ares",
                text: "This room is a small square of pale blue marble, with the sky very visible through the open roof. The sound of laughter echoes through the room endlessly, but there appears to be nothing more to stop you from advancing through the doors on the walls than the usual consoles beside them. You attempt to probe the room for further secrets, but find that you can’t get to the bottom of it. You decide to just put it behind you.",
                callback_id: 'Room 9',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 4",
                        "text": "Enter Room 4",
                        "value": "4",
                        "style": solvedPuzzles[3],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    currentRoom = 9;
    doors = [7, 3, 4];
    }
    else {
      var leftdoor = 0;
      if(doors.indexOf(9) == 0) {
        leftdoor = doors[(doors.indexOf(9) + 2) % 3];
      }
      else {
        leftdoor = doors[(doors.indexOf(9) - 1) % 3];
      }
      bot.reply(message,
        {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
              username: 'Daedalus',
              title: "Room 9 - Ares",
              text: "It's locked. Better solve this puzzle.\n\nA farmer has a fox and two chickens and he needs to take them to town to sell them. He can’t leave the fox alone with the chickens because the fox will eat them. He comes to a river and needs to cross it to get to town. He finds a small boat that can carry only him and one animal. How many times does he need to cross the river to get to town and then back home?",
              callback_id: 'Solve 9',
              attachment_type: 'default',
              actions: [
                    {
                        "name": "Solve 9",
                        "text": "Try to Solve Puzzle 9",
                        "value": "solveNinth",
                        "type": "button"
                    },
                    {
                        "name": "Check door to left",
                        "text": "Try door " + leftdoor,
                        "value": leftdoor.toString(),
                        "type": "button"
                    },
                    {
                        "name": "Check door to right",
                        "text": "Try door " + doors[(doors.indexOf(9) + 1) % 3],
                        "value": doors[(doors.indexOf(9) + 1) % 3].toString(),
                        "type": "button"
                    }
              ]
            }
          ]
        }
        );
    }
  }
  else if(message.actions[0].value.match("10")){
    if(solvedPuzzles[9] == "default") {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 10 - Aphrodite",
                text: 'In the center of this plane, granite-walled room, a bearded figure sits cross-legged, wearing spartan clothes the same color as the stone. He smiles as you enter and speaks in strange tones….\n“Congratulations on discovering the center of my Labyrinth. But now you must find your way back out.”\nHe stretches out a hand. Drooping tantalizingly from between his pointer and middle fingers is a key made of shining ruby. Without hesitation, you reach out and grab the Ruby Key.\n“Good,” he says.\n“You have traveled through air, water, and stone to reach me. To escape, you must pass by fire. Do not give this Ruby Key to anyone, no matter what they say.”',
                callback_id: 'Room 10',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 2",
                        "text": "Enter Room 2",
                        "value": "2",
                        "style": solvedPuzzles[1],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 9",
                        "text": "Enter Room 9",
                        "value": "9",
                        "style": solvedPuzzles[8],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 6",
                        "text": "Enter Room 6",
                        "value": "6",
                        "style": solvedPuzzles[5],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    currentRoom = 10;
    doors = [2, 9, 6];
    }
    else {
      var leftdoor = 0;
      if(doors.indexOf(10) == 0) {
        leftdoor = doors[(doors.indexOf(10) + 2) % 3];
      }
      else {
        leftdoor = doors[(doors.indexOf(10) - 1) % 3];
      }
      bot.reply(message,
        {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
              username: 'Daedalus',
              title: "Room 10 - Aphrodite",
              text: "It's locked. Better solve this puzzle.\n\n“Need a new place?” Hit the street for a better view, then tell me the phone number to call. (No Dashes, Parentheses or Spaces)\n42.338838, -71.092494",
              callback_id: 'Solve 10',
              attachment_type: 'default',
              actions: [
                    {
                        "name": "Solve 10",
                        "text": "Try to Solve Puzzle 10",
                        "value": "solveTenth",
                        "type": "button"
                    },
                    {
                        "name": "Check door to left",
                        "text": "Try door " + leftdoor,
                        "value": leftdoor.toString(),
                        "type": "button"
                    },
                    {
                        "name": "Check door to right",
                        "text": "Try door " + doors[(doors.indexOf(10) + 1) % 3],
                        "value": doors[(doors.indexOf(10) + 1) % 3].toString(),
                        "type": "button"
                    }
              ]
            }
          ]
        }
        );
    }
  }
  else if(message.actions[0].value.match("solveFirst")){
    if(lockedPuzzles[0] == false){
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 1 - Daedalus",
                text: 'What is the answer to Puzzle #1? Answer in the form of "Key 1: ANSWER"'
            }
        ]
    });
    puzzleQuestionAsked[0] = true;
    }
    else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 1 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji,
        }
        );
     }
  }
  else if(message.actions[0].value.match("solveSecond")){
    if(lockedPuzzles[1] == false){
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 2 - The Pantheon",
                text: 'What is the answer to Puzzle #2? Answer in the form of "Key 2: ANSWER"'
            }
        ]
    });
    puzzleQuestionAsked[1] = true;
    }
    else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 2 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji,
        }
        );
     }
  }
  else if(message.actions[0].value.match("solveThird")){
    if(lockedPuzzles[2] == false){
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 3 - Zeus",
                text: 'What is the answer to Puzzle #3? Answer in the form of "Key 3: ANSWER"'
            }
        ]
    });
    puzzleQuestionAsked[2] = true;
    }
    else
     {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 3 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji,
        }
        );
     }
  }
  else if(message.actions[0].value.match("solveFourth")){
    if(lockedPuzzles[3] == false) {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 4 - Hera",
                text: 'What is the answer to Puzzle #4? Answer in the form of "Key 4: ANSWER"'
            }
        ]
    });
    puzzleQuestionAsked[3] = true;
    }
    else {
      {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 4 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji,
        }
        );
     }
    }
  }
  else if(message.actions[0].value.match("solveFifth")){
    if(lockedPuzzles[4] == false) {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 5 - Poseidon",
                text: 'What is the answer to Puzzle #5? Answer in the form of "Key 5: ANSWER"'
            }
        ]
    });
    puzzleQuestionAsked[4] = true;
    }
    else {
      {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 5 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji,
        }
        );
     }
    }
  }
  else if(message.actions[0].value.match("solveSixth")){
    if(lockedPuzzles[5] == false) {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 6 - Demeter",
                text: 'What is the answer to Puzzle #6? Answer in the form of "Key 6: ANSWER"'
            }
        ]
    });
    puzzleQuestionAsked[5] = true;
    }
    else {
      {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 6 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji,
        }
        );
     }
    }
  }
  else if(message.actions[0].value.match("solveSeventh")){
    if(lockedPuzzles[6] == false) {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 7 - Athena",
                text: 'What is the answer to Puzzle #7? Answer in the form of "Key 7: ANSWER"'
            }
        ]
    });
    puzzleQuestionAsked[6] = true;
    }
    else {
      {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 7 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji,
        }
        );
     }
    }
  }
  else if(message.actions[0].value.match("solveEighth")){
    if(lockedPuzzles[7] == false) {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 8 - Apollo & Artemis",
                text: 'What is the answer to Puzzle #8? Answer in the form of "Key 8: ANSWER"'
            }
        ]
    });
    puzzleQuestionAsked[7] = true;
    }
    else {
      {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 8 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji,
        }
        );
     }
    }
  }
  else if(message.actions[0].value.match("solveNinth")){
    if(lockedPuzzles[8] == false) {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 9 - Ares",
                text: 'What is the answer to Puzzle #9? Answer in the form of "Key 9: ANSWER"'
            }
        ]
    });
    puzzleQuestionAsked[8] = true;
    }
    else {
      {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 9 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji,
        }
        );
     }
    }
  }
  else if(message.actions[0].value.match("solveTenth")){
    if(lockedPuzzles[9] == false) {
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 10 - Aphrodite",
                text: 'What is the answer to Puzzle #10? Answer in the form of "Key 10: ANSWER"'
            }
        ]
    });
    puzzleQuestionAsked[9] = true;
    }
    else {
      {
      bot.say(
        {
        username: 'Daedalus',
        text: "Puzzle 10 is locked. Please wait until I tell you the puzzle is unlocked.",
        channel: bottestingid,
        icon_url: daedalusemoji,
        }
        );
     }
    }
  }
  else if(message.actions[0].value.match("givecoin")){
    haveCoin = false;
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 6 - Demeter",
                text: 'The peacock devours the coin hungrily then speaks. “The eighth door is sealed with a code. It spells a word with zeros and ones. Binary.”',
                callback_id: 'Room 6',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 8",
                        "text": "Enter Room 8",
                        "value": "8",
                        "style": solvedPuzzles[7],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 4",
                        "text": "Enter Room 4",
                        "value": "4",
                        "style": solvedPuzzles[3],
                        "type": "button"
                    }
                ]
            }
        ]
    });
  }
  else if(message.actions[0].value.match("givekey")){
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 2 - The Pantheon",
                text: '“Fool! The Architect told you not to give the key to anyone. How did anyone so stupid make it this far? You have clearly learned nothing. My advice is to find the seventh room.”',
                callback_id: 'Room 2',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 1",
                        "text": "Enter Room 1",
                        "value": "1",
                        "style": solvedPuzzles[0],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 6",
                        "text": "Enter Room 6",
                        "value": "6",
                        "style": solvedPuzzles[5],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    }
                ]
            }
        ]
    });
  }
});

controller.hears(["Key 1:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(puzzleQuestionAsked[0] == true) {
    if(message.text.toUpperCase() == "KEY 1: A GUARD DOG" || message.text.toUpperCase() == "KEY 1: GUARD DOG" || message.text.toUpperCase() == "KEY 1: DOG" || message.text.toUpperCase() == "KEY 1: A DOG"){
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 1 - Daedalus",
                text: 'You find yourself back in the first room of the labyrinth. The old man is nowhere to be seen. For the first time you notice a keyhole on the wall. Confident, you approach it and produce your Ruby Key. You insert it into the keyhole and the entire room is bathed in shimmering vermillion light. An overwhelming sense of lightness overcomes you and your body melts away.\n\nA voice comes from everywhere and nowhere:\n\n“You have mastered the labyrinth, solved all of my challenges, and proved yourself the ultimate champion. Congratulations! Your intelligence has been downloaded and archived to the collective.”\n\nClick "New Labyrinth" to play again and "Quit Labyrinth" to quit.',
                callback_id: 'IntroMessage',
                attachment_type: 'default',
                actions: [
                    {
                        "name": "New Labyrinth",
                        "text": "New Labyrinth",
                        "value": "newlabyrinth",
                        "type": "button"
                    },
                    {
                        "name": "quit",
                        "text": "Quit Labyrinth",
                        "value": "quit",
                        "type": "button"
                    }
                ]
            }
        ]
    });
    puzzleQuestionAsked[0] = false;
    solvedPuzzles[0] = "default";
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
});

controller.hears(["Key 2:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(puzzleQuestionAsked[1] == true){
    if(message.text.toUpperCase() == "KEY 2: JULY 15, 1796" || message.text.toUpperCase() == "KEY 2: JULY 15 1796" || message.text.toUpperCase() == "KEY 2: 7/15/96" || message.text.toUpperCase() == "KEY 2: 7/15/1796" || message.text.toUpperCase() == "KEY 2: 07/15/1796" || message.text.toUpperCase() == "KEY 2: 07/15/96" || message.text.toUpperCase() == "KEY 2: JULY 15th 1796" || message.text.toUpperCase() == "KEY 2: JULY 15th, 1796"){
    bot.reply(message, {
        text: "",
        icon_url: daedalusemoji,
        channel: bottestingid,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 2 - The Pantheon",
                text: 'At the center of this room is a burnished metal plinth with obviously holographic fire jetting upward from its lens-like surface. Loose square bits float upward toward the ceiling like sparks. As you move closer to the center, a demonic face appears in the fire.\n“Congratulations on finding my room! Your victory is nigh…. That is, if you’ve been paying attention to your surroundings.”\n“You may pass through any of these doors if you know the words and the way. But if you are not sure… give ME the Ruby Key from the center of the maze. I will reward you greatly.”',
                callback_id: 'Room 2',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 1",
                        "text": "Enter Room 1",
                        "value": "1",
                        "style": solvedPuzzles[0],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 6",
                        "text": "Enter Room 6",
                        "value": "6",
                        "style": solvedPuzzles[5],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Give Key",
                        "text": "Give him your key",
                        "value": "givekey",
                        "type": "button"
                    }
                ]
            }
        ]
    });
    puzzleQuestionAsked[1] = false;
    solvedPuzzles[1] = "default";
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
});
controller.hears(["Key 3:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(puzzleQuestionAsked[2] == true){
    if(message.text.toUpperCase() == "KEY 3: 6 GALLONS" || message.text.toUpperCase() == "KEY 3: 6" || message.text.toUpperCase() == "KEY 3: SIX" || message.text.toUpperCase() == "KEY 3: SIX GALLONS"){
    bot.reply(message, {
        text: "",
        icon_url: daedalusemoji,
        channel: bottestingid,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 3 - Zeus",
                text: 'This small, five-sided room is a gorgeous indoor garden. The floor is lined with grass, despite the enclosed space, and a bright sun shines from above, just through the glass ceiling. Flowers bloom and flourish everywhere, so it’s impossible to avoid stepping on one, and the smell of bread and flowers permeates the air. Four tall ivy-wrapped trees are scattered about the room, and each trunk holds a portal, though there are sturdy chains tossed around the tree, preventing entrance. On the other side of each tree, you see an area where the bark has been scraped away to the under-layer, and luminescent blue words appear on the very bark: “MARK WELL THE 8th.” When you touch the bark, blue light appears beneath your finger, and you recognize the setup as a console.',
                callback_id: 'Room 3',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 9",
                        "text": "Enter Room 9",
                        "value": "9",
                        "style": solvedPuzzles[8],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 4",
                        "text": "Enter Room 4",
                        "value": "4",
                        "style": solvedPuzzles[3],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    puzzleQuestionAsked[2] = false;
    solvedPuzzles[2] = "default";
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
});
controller.hears(["Key 4:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(puzzleQuestionAsked[3] == true){
    if(message.text.toUpperCase() == "KEY 4: 54 LEVELS" || message.text.toUpperCase() == "KEY 4: 54" || message.text.toUpperCase() == "KEY 4: FIFTY-FOUR LEVELS" || message.text.toUpperCase() == "KEY 4: FIFTY-FOUR" || message.text.toUpperCase() == "KEY 4: FIFTYFOUR LEVELS" || message.text.toUpperCase() == "KEY 4: FIFTYFOUR LEVELS"){
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 4 - Hera",
                text: 'Mist fills this arc-shaped, white marble, room, and rainbows are visible everywhere. The mist makes the marble underfoot slick, and you have to squint to see through the colors that reflect off every shining surface. You notice that, at each end of the arc, there are two teleportation pads, and their appropriate consoles.\nThe mist interacts strangely with the devices, causing momentary blinks of static, some form of short-circuiting. With each blink you see momentary flashes of another world.',
                callback_id: 'Room 4',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 8",
                        "text": "Enter Room 8",
                        "value": "8",
                        "style": solvedPuzzles[7],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    puzzleQuestionAsked[3] = false;
    solvedPuzzles[3] = "default";
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
});
controller.hears(["Key 5:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(puzzleQuestionAsked[4] == true){
    if(message.text.toUpperCase() == "KEY 5: 44" || message.text.toUpperCase() == "KEY 5: 44 YEARS OLD" || message.text.toUpperCase() == "KEY 5: 44 Y/O" || message.text.toUpperCase() == "KEY 5: FOURTY-FOUR" || message.text.toUpperCase() == "KEY 5: FOURTY-FOUR YEARS OLD" || message.text.toUpperCase() == "KEY 5: FOURTY-FOUR Y/O" || message.text.toUpperCase() == "KEY 5: FOURTYFOUR" || message.text.toUpperCase() == "KEY 5: FOURTYFOUR YEARS OLD" || message.text.toUpperCase() == "KEY 5: FOURTYFOUR Y/O"){
    bot.reply(message, {
        text: "",
        icon_url: daedalusemoji,
        channel: bottestingid,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 5 - Poseidon",
                text: 'You step into a small, triangular room. Water pools on the floor, about an inch high, and small waterfalls run down the pale blue walls, apparently coming from gaps in the ceiling. In the three corners of the room, and in the center, there are slightly-elevated platforms, which you recognize as teleportation pads. There are glowing blue consoles on top of pipes next to each of them, though these ones are made of brass.',
                callback_id: 'Room 5',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 10",
                        "text": "Enter Room 10",
                        "value": "10",
                        "style": solvedPuzzles[9],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 9",
                        "text": "Enter Room 9",
                        "value": "9",
                        "style": solvedPuzzles[8],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 6",
                        "text": "Enter Room 6",
                        "value": "6",
                        "style": solvedPuzzles[5],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    puzzleQuestionAsked[4] = false;
    solvedPuzzles[4] = "default";
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
});
controller.hears(["Key 6:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(puzzleQuestionAsked[5] == true){
    if(message.text.toUpperCase() == "KEY 6: 82" || message.text.toUpperCase() == "KEY 6: 82 YEARS OLD" || message.text.toUpperCase() == "KEY 6: 82 Y/O" || message.text.toUpperCase() == "KEY 6: EIGHTY-TWO" || message.text.toUpperCase() == "KEY 6: EIGHTY-TWO YEARS OLD" || message.text.toUpperCase() == "KEY 6: EIGHTY-TWO Y/O" || message.text.toUpperCase() == "KEY 6: EIGHTYTWO" || message.text.toUpperCase() == "KEY 6: EIGHTYTWO YEARS OLD" || message.text.toUpperCase() == "KEY 6: EIGHTYTWO Y/O"){
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 6 - Demeter",
                text: 'You step into a hexagonal room with a large white platform in the center. Resting on the platform is a large silver Peacock. It’s amazingly realistic, but as it turns to look at you, you hear the whir of tiny gears. It stares at you with vivid glass eyes and speaks in a metallic voice:\n“Feed me your coin and I will give you a clue to speed your journey.”\nYou now realize that the bird was not looking at you at all, but is rather staring hungrily at the labyrinth coin Daedalus tossed you when you first entered the maze. You could feed it to the bird, but you’ve actually grown rather attached to it…',
                callback_id: 'Room 6',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 8",
                        "text": "Enter Room 8",
                        "value": "8",
                        "style": solvedPuzzles[7],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 4",
                        "text": "Enter Room 4",
                        "value": "4",
                        "style": solvedPuzzles[3],
                        "type": "button"
                    },
                    {
                        "name": "Give Coin",
                        "text": "Give coin to peacock",
                        "value": "givecoin",
                        "type": "button"
                    }
                ]
            }
        ]
    });
    puzzleQuestionAsked[5] = false;
    solvedPuzzles[5] = "default";
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
});
controller.hears(["Key 7:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(puzzleQuestionAsked[6] == true){
    if(message.text.toUpperCase() == "KEY 7: VIRGINIA AVE" || message.text.toUpperCase() == "KEY 7: VIRGINIA AVE." || message.text.toUpperCase() == "KEY 7: VIRGINIA AVENUE"){
    var presevenroom = 0;
    if(currentRoom == 3) {
      presevenroom = 3;
    }
    else if(currentRoom == 4) {
      presevenroom = 4;
    }
    else if(currentRoom == 8) {
      presevenroom = 8;
    }
    else if(currentRoom == 9) {
      presevenroom = 9;
    }
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 7 - Athena",
                text: 'You step out into empty space, and are instantly aware this not-room lacks oxygen. As your throat constricts, and your eyesight fails you, you have a vision of a many-pillared building, where twelve enormous figures appear to be heatedly debating something. A thirteenth, dark, figure is standing before a podium, as though on trial. None of the figures take notice of you, so you turn around and leave the building, finding yourself back in room ' + currentRoom,
                callback_id: 'Room 7',
            }
        ]
    }); 
    if(presevenroom == 3) {
      bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 3 - Zeus",
                text: 'This small, five-sided room is a gorgeous indoor garden. The floor is lined with grass, despite the enclosed space, and a bright sun shines from above, just through the glass ceiling. Flowers bloom and flourish everywhere, so it’s impossible to avoid stepping on one, and the smell of bread and flowers permeates the air. Four tall ivy-wrapped trees are scattered about the room, and each trunk holds a portal, though there are sturdy chains tossed around the tree, preventing entrance. On the other side of each tree, you see an area where the bark has been scraped away to the under-layer, and luminescent blue words appear on the very bark: “MARK WELL THE 8th.” When you touch the bark, blue light appears beneath your finger, and you recognize the setup as a console.',
                callback_id: 'Room 3',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 9",
                        "text": "Enter Room 9",
                        "value": "9",
                        "style": solvedPuzzles[8],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 4",
                        "text": "Enter Room 4",
                        "value": "4",
                        "style": solvedPuzzles[3],
                        "type": "button"
                    }
                ]
            }
        ]
    }); 
    }
    else if(presevenroom == 4) {
      bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 4 - Hera",
                text: 'Mist fills this arc-shaped, white marble, room, and rainbows are visible everywhere. The mist makes the marble underfoot slick, and you have to squint to see through the colors that reflect off every shining surface. You notice that, at each end of the arc, there are two teleportation pads, and their appropriate consoles.\nThe mist interacts strangely with the devices, causing momentary blinks of static, some form of short-circuiting. With each blink you see momentary flashes of another world.',
                callback_id: 'Room 4',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 8",
                        "text": "Enter Room 8",
                        "value": "8",
                        "style": solvedPuzzles[7],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    }
    else if(presevenroom == 8) {
      bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 8 - Apollo & Artemis",
                text: 'You enter a room with walls of dark grey marble. Two torches stand in the center of the room, one burning blue, and one burning red. A small cat is curled around the bases of the torches, though it appears slightly translucent when you look at it directly. You walk to the other end of the room, where you can see four teleportation pads, and their consoles. When you look back, the cat has been replaced by an equally-translucent guard dog, staring intently at something on the other side of the room.',
                callback_id: 'Room 8',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 6",
                        "text": "Enter Room 6",
                        "value": "6",
                        "style": solvedPuzzles[5],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 9",
                        "text": "Enter Room 9",
                        "value": "9",
                        "style": solvedPuzzles[8],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    }
    else if(presevenroom == 9) {
      bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 9 - Ares",
                text: "This room is a small square of pale blue marble, with the sky very visible through the open roof. The sound of laughter echoes through the room endlessly, but there appears to be nothing more to stop you from advancing through the doors on the walls than the usual consoles beside them. You attempt to probe the room for further secrets, but find that you can’t get to the bottom of it. You decide to just put it behind you.",
                callback_id: 'Room 9',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 4",
                        "text": "Enter Room 4",
                        "value": "4",
                        "style": solvedPuzzles[3],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    }
    puzzleQuestionAsked[6] = false;
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
});
controller.hears(["Key 8:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(puzzleQuestionAsked[7] == true){
    if(message.text.toUpperCase() == "KEY 8: PASSWORD" || message.text.toUpperCase() == "KEY 8: P A S S W O R D"){
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 8 - Apollo & Artemis",
                text: 'You enter a room with walls of dark grey marble. Two torches stand in the center of the room, one burning blue, and one burning red. A small cat is curled around the bases of the torches, though it appears slightly translucent when you look at it directly. You walk to the other end of the room, where you can see four teleportation pads, and their consoles. When you look back, the cat has been replaced by an equally-translucent guard dog, staring intently at something on the other side of the room.',
                callback_id: 'Room 8',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 6",
                        "text": "Enter Room 6",
                        "value": "6",
                        "style": solvedPuzzles[5],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 9",
                        "text": "Enter Room 9",
                        "value": "9",
                        "style": solvedPuzzles[8],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    puzzleQuestionAsked[7] = false;
    solvedPuzzles[7] = "default";
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
});
controller.hears(["Key 9:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(puzzleQuestionAsked[8] == true){
    if(message.text.toUpperCase() == "KEY 9: 8" || message.text.toUpperCase() == "KEY 9: 8 TIMES" || message.text.toUpperCase() == "KEY 9: HE HAS TO CROSS 8 TIMES" || message.text.toUpperCase() == "KEY 9: HE HAS TO CROSS THE RIVER 8 TIMES" || message.text.toUpperCase() == "KEY 9: EIGHT" || message.text.toUpperCase() == "KEY 9: EIGHT TIMES" || message.text.toUpperCase() == "KEY 9: HE HAS TO CROSS EIGHT TIMES" || message.text.toUpperCase() == "KEY 9: HE HAS TO CROSS THE RIVER EIGHT TIMES"){
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 9 - Ares",
                text: "This room is a small square of pale blue marble, with the sky very visible through the open roof. The sound of laughter echoes through the room endlessly, but there appears to be nothing more to stop you from advancing through the doors on the walls than the usual consoles beside them. You attempt to probe the room for further secrets, but find that you can’t get to the bottom of it. You decide to just put it behind you.",
                callback_id: 'Room 9',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 7",
                        "text": "Enter Room 7",
                        "value": "7",
                        "style": solvedPuzzles[6],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 3",
                        "text": "Enter Room 3",
                        "value": "3",
                        "style": solvedPuzzles[2],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 4",
                        "text": "Enter Room 4",
                        "value": "4",
                        "style": solvedPuzzles[3],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    puzzleQuestionAsked[8] = false;
    solvedPuzzles[8] = "default";
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
});
controller.hears(["Key 10:"],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  if(puzzleQuestionAsked[9] == true){
    if(message.text.toUpperCase() == "KEY 10: 6174219111"){
    bot.reply(message, {
        text: "",
        channel: bottestingid,
        icon_url: daedalusemoji,
        attachments: [
            {
                username: 'Daedalus',
                title: "Room 10 - Aphrodite",
                text: 'In the center of this plane, granite-walled room, a bearded figure sits cross-legged, wearing spartan clothes the same color as the stone. He smiles as you enter and speaks in strange tones….\n“Congratulations on discovering the center of my Labyrinth. But now you must find your way back out.”\nHe stretches out a hand. Drooping tantalizingly from between his pointer and middle fingers is a key made of shining ruby. Without hesitation, you reach out and grab the Ruby Key.\n“Good,” he says.\n“You have traveled through air, water, and stone to reach me. To escape, you must pass by fire. Do not give this Ruby Key to anyone, no matter what they say.”',
                callback_id: 'Room 10',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"Door to Room 2",
                        "text": "Enter Room 2",
                        "value": "2",
                        "style": solvedPuzzles[1],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 9",
                        "text": "Enter Room 9",
                        "value": "9",
                        "style": solvedPuzzles[8],
                        "type": "button"
                    },
                    {
                        "name":"Door to Room 6",
                        "text": "Enter Room 6",
                        "value": "6",
                        "style": solvedPuzzles[5],
                        "type": "button"
                    }
                ]
            }
        ]
    });
    puzzleQuestionAsked[9] = false;
    haveRubyKey = true;
    solvedPuzzles[9] = "default";
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
});
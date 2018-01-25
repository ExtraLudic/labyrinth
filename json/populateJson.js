'use strict';
const fs = require('fs');
const studioScript = fs.readFileSync("./debugScripts.json", "utf-8");

var studioScriptParsed = JSON.parse(studioScript);

var key = [];
key.name = 'key';
var puzzle = [];
puzzle.name = 'puzzle';
var description = [];	
description.name = 'description';					// ENABLE WHEN YOU HAVE ROOM DESCRIPTIONS

/*

fs.open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }
 
    throw err;
  }
 
  readMyData(fd);
});

*/

function populateArray(arr, size){
	for(var i = 0; i < size; i++){
	    let directory = "./" + arr.name;
	    let fileName = "/" + arr.name + "_" + i + ".txt";
		//let populateArr =
		fs.openSync(directory + fileName, (err, fd) =>{
			if (err){
				if(err.code === 'ENOENT' ){
					console.error('myfile does not exist');
					return;
				}
				throw err;;
			}
			readMyData(fd, 'utf-8');
		});
		
	}
	
}

var lto = function listToObject(list){
let objectFormat = {
            "text": undefined,
            "value": 'incorrect'
             };

objectFormat.text = list;
return objectFormat;
}

function randomizeKeys(key){
	let list = key.split(",");
	let formattedList = list.map(lto);
	formattedList[0].value = 'correct';
	let randomKey = formattedList.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
	key = key.push(randomKey);
}


function writeInPuzzlesKeys(studioScriptParsed){

	for(var i = 0; i < studioScriptParsed.length; i++){
		//console.log(studioScriptParsed[i].script);

		for(var j = 0; j < studioScriptParsed[i].script.length; j++){
			//console.log(i, studioScriptParsed[i].script.length);
		//	console.log(studioScriptParsed[i].script[j].script.length);
			for(var v = 0; v < studioScriptParsed[i].script[j].script.length; v++){
				//console.log(studioScriptParsed[i].script[j].script[v].attachments[0]);
				if (studioScriptParsed[i].script[j].script[v].attachments){
					for(var s = 1; s < 32; s++){
						//console.log('s'+s);
					    // ADD CODE ABOUT ROOM DESCRIPTIONS HERE. ATTACHMENTS[0].text.                    //UPDATE WHEN YOU HAVE ROOM DESCRIPTIONS

						if (studioScriptParsed[i].script[j].script[v].attachments[0].callback_id == "key_"+s){
							//console.log('xxxxxxxxxxxxxxxxxxxx');

							var arrayIndex = s-1;
					        studioScriptParsed[i].script[j].script[v].attachments[0].actions[0].options = keys[arrayIndex];
					        studioScriptParsed[i].script[j].script[v].attachments[0].text = puzzles[arrayIndex];
				        }
					}
				}	
			}
		}

	}

	return studioScriptParsed;

}


var keys = populateArray(key, 32);

console.log(keys);

/*
populateKPRarrays();

//console.log(room_jsons);
var labyrinthJson = writeInPuzzlesKeys(room_jsons);

//console.log(room_jsons);
fs.writeFileSync('./labyrinth/labyrinth.json', JSON.stringify(labyrinthJson), 'utf8');
*/


/*
function populateKPRarrays(){
	for (var i = 2; i < 32; i++){
	// Bring in JSON Files and turn them into Objects	

	// Bring in keys. Seperate by , . Make first value correct. Then make random.
	let key = fs.readFileSync("./keys/key_" + i + ".txt", "utf-8");
	let list = key.split(",");
	let formattedList = list.map(lto);
	formattedList[0].value = 'correct';
	let randomKey = formattedList.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
	//Bring in puzzles.
	let puzzle = fs.readFileSync("./puzzles/puzzle_" + i + ".txt", "utf-8");
	//let descriptions = fs.readFileSync("./descriptions/description_" + i + ".txt", "utf-8");      // ENABLE WHEN YOU HAVE ROOM DESCRIPTIONS
	// add all to respective arrays
	//roomDescriptions.push(descriptions);															// ENABLE WHEN YOU HAVE RROM DESCIPTIONS
	keys.push(randomKey);
	puzzles.push(puzzle);
	//room_jsons.push(studioScript);
	}
}


var lto = function listToObject(list){
let objectFormat = {
            "text": undefined,
            "value": 'incorrect'
             };

objectFormat.text = list;
return objectFormat;
}	

function writeInPuzzlesKeys(room_jsons){

	for(var i = 0; i < room_jsons.length; i++){
		//console.log(room_jsons[i].script);

		for(var j = 0; j < room_jsons[i].script.length; j++){
			//console.log(i, room_jsons[i].script.length);
		//	console.log(room_jsons[i].script[j].script.length);
			for(var v = 0; v < room_jsons[i].script[j].script.length; v++){
				//console.log(room_jsons[i].script[j].script[v].attachments[0]);
				if (room_jsons[i].script[j].script[v].attachments){
					for(var s = 1; s < 32; s++){
						//console.log('s'+s);
					    // ADD CODE ABOUT ROOM DESCRIPTIONS HERE. ATTACHMENTS[0].text.                    //UPDATE WHEN YOU HAVE ROOM DESCRIPTIONS

						if (room_jsons[i].script[j].script[v].attachments[0].callback_id == "key_"+s){
							//console.log('xxxxxxxxxxxxxxxxxxxx');

							var arrayIndex = s-1;
					        room_jsons[i].script[j].script[v].attachments[0].actions[0].options = keys[arrayIndex];
					        room_jsons[i].script[j].script[v].attachments[0].text = puzzles[arrayIndex];
				        }
					}
				}	
			}
		}

	}

	return room_jsons;

}

*/







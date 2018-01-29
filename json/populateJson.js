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





//STEP 1: POPULATE ARRAYS WITH ROOM DESCRIPTIONS, KEYS, AND PUZZLES

function populateArray(arr){
	//console.log(arr.name);
	//var newArr = [];
	var listDir = fs.readdirSync('./'+ arr.name);
	var sortDir = listDir.sort((a, b) =>{  
		 a=a.split("_");
   		 b=b.split("_");
   		 //console.log(a);
   		 return parseInt(a[1]) - parseInt(b[1]);
	});
	//console.log(listDir);
	//console.log(sortDir);
	for(var i = 0; i < sortDir.length; i++){

		var populateArr = fs.readFileSync('./'+ arr.name + "/" + sortDir[i] , 'utf-8');
		arr.push(populateArr);
		//console.log(newArr);
	}
	//return newArr;
}
	
populateArray(key);
populateArray(puzzle);
//console.log(puzzle);
populateArray(description);

//console.log(description);


//END OF STEP ONE. ALL ARRAYS ARE NOW POPULATED

//STEP TWO RANDOMIZE THE KEYS SO THAT THE CORRECT ANSWER IS NOW ALWAYS FIRST

/*
var lto = function listToObject(list, index){
let value = "incorrect" + index;
let objectFormat = {
            "text": undefined,
            "value": value
             };

objectFormat.text = list;
return objectFormat;
}
*/

var rk = function randomizeKeys(key){
	let list = key.split(",");
	let formattedList = list.map((currentElement, index) => {
		let value = "incorrect" + index;
		let objectFormat = {
            "text": undefined,
            "value": value
             };

		objectFormat.text = currentElement;
		return objectFormat;
	});
	formattedList[0].value = 'correct';
	let randomKey = formattedList.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
	//key = key.push(randomKey);
	return randomKey;
}

var randomKeys = key.map(rk);

//console.log(randomKeys);

// END OF STEP TWO. KEYS ARE NOW RANDOM.

// STEP THREE. TAKE THE DESCRIPTIONS ARRAY AND SPLIT IT INTO TITLES AND DESCRIPTIONS

var sd = function splitDescriptions(description){
	let split = description.split("~");
	return split;
}

var titleDescription = description.map(sd);

console.log(titleDescription[1]);



function addContent(studioScriptParsed){

	for(var i = 0; i < studioScriptParsed.length; i++){
		//console.log(studioScriptParsed[i].script);

		for(var j = 0; j < studioScriptParsed[i].script.length; j++){
			//console.log(i, studioScriptParsed[i].script.length);
		//	console.log(studioScriptParsed[i].script[j].script.length);
			for(var v = 0; v < studioScriptParsed[i].script[j].script.length; v++){
				//console.log(studioScriptParsed[i].script[j].script[v].attachments[0]);
				if (studioScriptParsed[i].script[j].script[v].attachments){
					for(var s = 1; s < 33; s++){
						var descriptionArrayIndex = s-1;
						var puzzleKeyArrayIndex = s-2;
						var titleDescriptionArr = titleDescription[s];       // THIS IS CHANGED TO S INSTEAD OF DescriptionArray becasue there is some hidden file giving 0s
					//	console.log(titleDescription);
						
						//console.log('s'+s);
					    // ADD CODE ABOUT ROOM DESCRIPTIONS HERE. ATTACHMENTS[0].text.
					    if (studioScriptParsed[i].script[j].script[v].attachments[0].callback_id == "room_"+s){
					   // console.log("title................", titleDescriptionArr[0]);
					    //studioScriptParsed[i].script[j].script[v].attachments[0].title = titleDescriptionArr[0]; 
					    studioScriptParsed[i].script[j].script[v].attachments[0].text  = titleDescriptionArr[1];                   
					    }

						if (studioScriptParsed[i].script[j].script[v].attachments[0].callback_id == "key_"+s){
							//console.log('xxxxxxxxxxxxxxxxxxxx');

							
					        studioScriptParsed[i].script[j].script[v].attachments[0].actions[0].options = randomKeys[puzzleKeyArrayIndex];
					        studioScriptParsed[i].script[j].script[v].attachments[0].text = puzzle[puzzleKeyArrayIndex];
				        }
					}
				}	
			}
		}

	}

	return studioScriptParsed;

}


//var keys = populateArray(key, 32);

//console.log(keys);




//console.log(room_jsons);
var labyrinthJson = addContent(studioScriptParsed);

console.log('writing...');
fs.writeFileSync('./labyrinth/labyrinth.json', JSON.stringify(labyrinthJson), 'utf8');










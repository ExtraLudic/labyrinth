//create a folder. Put all of text files into it. Put this script in it. Put a folder called JSON in it. Run this script.
'use strict';
var fs = require('fs');

// Change this for loop to go through number of json files
for (var i = 1; i < 3; i++){
    var text = fs.readFileSync("./room_"+i+".txt", "utf-8");
    var list = text.split("\n");

    var lto = function listToObject(list){
    let objectFormat = {
               "text": undefined,
               "value": 'incorrect'
                };

    objectFormat.text = list;
    return objectFormat;
    }    


    var formattedList = list.map(lto);
    formattedList[0].value = 'correct';
    var key = formattedList.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);


    fs.writeFileSync('./JSON/room_' + i +'.json', JSON.stringify(key), 'utf8');

    console.log('room_' + i +'.json written')
    
}
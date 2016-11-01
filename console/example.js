'use strict';

// let options = Object.assign({customInspect: false}, {
//     customInspect: true
// });

// console.log('will be covered', options);

// console.log('%d - %d', 12, 22);

// function thisIsFn(){
//     console.trace('show me');
// }

// thisIsFn();




// var data = '111111111111111111111111111111111111111111111111111';
// for(var i = 0, l = 12; i < l; i++) {
//     data += data; // warning! gets very large, very quick
// }

// var start = Date.now();
// console.log(data);
// console.log('wrote %d bytes in %dms', data.length, Date.now() - start);



const fs = require('fs');
const console = require('console');

let ws = fs.createWriteStream('./t.txt');

let cs = new console.Console(ws, process.stderr);

let st = Date.now();
let data = '111111111111111111111111111111111111111111111111111';
for(let i = 0, l = 12; i < l; i++) {
    data += data; // warning! gets very large, very quick
}
cs.log(data);
console.log('over', Date.now() - st);
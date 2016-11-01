'use strict';

let http = require('http');
let agent = new http.Agent();

console.log('family:', agent.getName({family: 4}));
console.log('family:', agent.getName({family: 6}));

for (const family of [4, 6])
  console.log(agent.getName({ family }), 'localhost:::' + family);
'use strict';

const http = require('http');
const assert = require('assert');

let keep_alive_agent = new http.Agent({
    keepAlive: true,
    maxSockets: 2
});

let send_one_req = (data) => {
    let keep_alive_agent = new http.Agent({
        keepAlive: true,
        maxSockets: 2
    });
        
    let options = {
        agent: keep_alive_agent,
        hostname: '192.168.6.7',
        port: '3000',
        path: '/hello',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    let req = http.request(options, function(res){
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.write(String(data));
    req.end();
};

// send_one_req();
// setTimeout(() => {
//     assert.equal(keep_alive_agent.freeSockets['192.168.6.7:3000:'].length, 1);
//     send_one_req();
//     send_one_req();
//     send_one_req();
//     send_one_req();
// }, 2000);

// setTimeout(() => {
//     console.log('maxSockets:', keep_alive_agent.maxSockets);
//     console.log('maxFreeSockets:', keep_alive_agent.maxFreeSockets);
//     assert.equal(keep_alive_agent.freeSockets['192.168.6.7:3000:'].length, 4);
//     send_one_req();
// }, 3000);


// sockets test when agent maxSockets be set to 2
setTimeout(() => {
    send_one_req(1);
    send_one_req(2);
    send_one_req(3);
    send_one_req(4);
    send_one_req(5);
    send_one_req(6);
    // assert(keep_alive_agent.sockets['192.168.6.7:3000:'].length, 6);
    console.log('wait sockets:', keep_alive_agent.requests['192.168.6.7:3000:'].length);
}, 1000);

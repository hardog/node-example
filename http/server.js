'use strict';

const http = require('http');

let server = http.createServer((req, res) => {
    let wait_time;

    req.on('data', (chunk) => {
        wait_time = +chunk.toString();
    });

    req.on('end', () => {
        console.log('receive end');
    });

    res.write('hello');

    setTimeout(() => {
        console.log(`Need wait ${wait_time} ms`);
        res.end();
    }, wait_time);
});

server.listen(3000, (args) => {
    console.log('Server started ...', args);
});
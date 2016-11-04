'use strict';

const assert = require('assert');
const vm = require('vm');

// let script = new vm.Script(`(function original() { a = 1;return 'original'; })`, {
//     produceCachedData: true
// });
// let inst = script.runInThisContext();
// cachedData 是什么数据类型?
// console.log(script.cachedData, inst);
// let script1 = new vm.Script(`(function original() { a = 1;return 'original'; })`, {
//     cachedData: script.cachedData
// });
// let inst1 = script1.runInThisContext();
// console.log('inst1:', inst1, global.a);


// const context = vm.createContext();
// assert.throws(function() {
//   vm.runInContext('throw new Error()', context, {
//     filename: 'expected-filename.js',
//     lineOffset: 32,
//     columnOffset: 123
//   });
// }, function(err) {
//   return /expected-filename.js:33:130/.test(err.stack);
// }, 'Expected appearance of proper offset in Error stack');


// --expose-gc
// let sandbox = {x: 1};
// let ctx = vm.createContext(sandbox);
// // global.gc();
// vm.runInContext('x = 2', sandbox);
// console.log('sandbox.x:', sandbox.x, ctx.x);

// // array context
// let ctx_arr = vm.createContext([1, 2]);
// console.log('ctx_arr:', ctx_arr);


const Debug = vm.runInDebugContext('Debug');
let breaks = 0;

function ondebugevent(evt, exc) {
    if (evt !== Debug.DebugEvent.Break) return;
    exc.frame(0).evaluate('process.env').properties();  // Named interceptor.
    exc.frame(0).evaluate('process.title').getTruncatedValue();  // Accessor.
    breaks += 1;
}

function breakpoint() {
    debugger;
}

assert.equal(breaks, 0);
Debug.setListener(ondebugevent);
assert.equal(breaks, 0);
breakpoint();
assert.equal(breaks, 1);
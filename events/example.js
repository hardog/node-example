'use strict';

const assert = require('assert');
const util = require('util');
const EventEmitter = require('events');

/**
 * 1. 事件监听器所注册的函数, 执行时是按照注册顺序依次执行的
 * 2. 事件监听器函数的上下文指向当前事件对象(this === [eventEmitterInstanceObject])
 */

// simple extends emit
class MyEventEmit extends EventEmitter {};

let myEventEmit = new MyEventEmit();

myEventEmit.on('hello', function(a, b){
    console.log('param:', a, '--', b);
});

myEventEmit.emit('hello', 'this is a', 'this is b');


// use ES6 arrow
myEventEmit.on('es6', () => {
    console.log('es6 this', this);
    assert(this !== myEventEmit);
});

myEventEmit.on('es5', function(){
    console.log('es5 this', this);
    assert(this === myEventEmit);
});

myEventEmit.emit('es6');
myEventEmit.emit('es5');


// use .once
let onetime = 1;
myEventEmit.once('onetime', function(){
    assert(onetime++ === 1);
});
myEventEmit.emit('onetime');
// ignored
myEventEmit.emit('onetime');


// throw errors
myEventEmit.on('error', function(e){
    console.log('catched error', e);
});
myEventEmit.emit('error', new Error('test error'));


// on.newListener again
myEventEmit.once('newListener', function(event, listener){
    if(event === 'event'){
        myEventEmit.on('event', function(){
            console.log('B');
        });
    }
});

myEventEmit.on('event', function(){
    console.log('A');
});

myEventEmit.emit('event');


// use removeListener
myEventEmit.on('removeListener', function(event, fn){
    console.log('removeListener', event, fn);
});
myEventEmit.emit('removeListener', 'hello');


// listenerCount
console.log('myEventEmit event num:', EventEmitter.listenerCount(myEventEmit, 'event'));


// getMaxListeners/setMaxListeners
console.log('myEventEmit max listener:', myEventEmit.getMaxListeners());
myEventEmit.setMaxListeners(3);
myEventEmit.on('more', () => {});
myEventEmit.on('more', () => {});
myEventEmit.on('more', () => {});
console.log('##################will throw max listeners error');
myEventEmit.on('more', () => {});


// use listeners
console.log(util.inspect(myEventEmit.listeners('more')));


// 理解:`this listener is removed and then invoked.`
// 先删除事件监听器然后执行当前注册的函数调用
myEventEmit.once('oncee', function(){
    console.log('this should be after the removeListener execute');
});
myEventEmit.emit('oncee');

// use#removeAllListeners
myEventEmit.removeAllListeners('more');
console.log('should return false:', myEventEmit.emit('more'));


// 如果为同一个事件注册了多个相同的监听器函数, removeListener 最多只会删除其中的一个监听器函数
let callback = () => {};
myEventEmit.on('o', callback);
myEventEmit.on('o', callback);
myEventEmit.on('o', callback);
myEventEmit.removeListener('o', callback);
console.log('len should equal 2:', myEventEmit.listeners('o').length);


// removeListener() or removeAllListeners() 如果在触发后执行, 
// 那么该删除监听器动作将会在emit执行完所有监听器后执行
let callback_a = () => {
    console.log('A');
    myEventEmit.removeListener('event1', callback_b);
};

let callback_b = () => {
    console.log('B');
};

myEventEmit.on('event1', callback_a);
myEventEmit.on('event1', callback_b);
console.log('still console A&B');
myEventEmit.emit('event1');
console.log('just console A, because B is removed');
myEventEmit.emit('event1');


// 通过emitter.listeners()返回指定事件的监听器是内部数组的一个拷贝而不是引用
myEventEmit.on('a1', () => {
    console.log('console a1 1');
});
myEventEmit.on('a1', () => {
    console.log('console a1 2');
});
myEventEmit.emit('a1');
let la1s =  myEventEmit.listeners('a1');
la1s[0] = () => console.log('should not show');
console.log('still console a1 1, a1 2');
myEventEmit.emit('a1');

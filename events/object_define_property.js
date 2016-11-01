'use strict';

const assert = require('assert');
// Warn: 不能同时使用[value, writable] 与 [get, set]中任意交叉对,
// value与get, writable与set, value与set, writable与get


let Obj = {};
Object.defineProperty(Obj, 'cnt', {
    __proto__: null,
    value: 0
});

// writable
console.log('first defined:', Obj.cnt);
try{
    Obj.cnt = 2;
}catch(e){
    assert(/Cannot assign to read only/.test(e.message));
}


//  writable
let Obj1 = {};
Object.defineProperty(Obj1, 'cnt', {
    __proto__: null,
    writable: true,
    value: 0
});
console.log('before assign to obj1.cnt', Obj1.cnt);
Obj1.cnt = 2;
console.log('after assign to obj1.cnt', Obj1.cnt);
assert.equal(Object.keys(Obj1).length, 0);


// enumerable
let Obj2 = {};
Object.defineProperty(Obj2, 'cnt', {
    __proto__: null,
    enumerable: true,
    value: 0
});
assert.equal(Object.keys(Obj2).length, 1);


// configurable
let Obj3 = {};
Object.defineProperty(Obj3, 'cnt', {
    __proto__: null,
    value: 1,
    configurable: true  // if false would throw error like 'Cannot delete property 'cnt''
});
console.log('before redefine ', Obj3.cnt);
Object.defineProperty(Obj3, 'cnt', {// if configurable false, throw 'Cannot redefine'
    value: 3
});
console.log('delete before ', Obj3.cnt);
delete Obj3.cnt;
console.log('delete after ', Obj3.cnt);


// get/set
let Obj4 = {};
Object.defineProperty(Obj4, 'p', {
    configurable: true,
    enumerable: true,
    get: function(){
        return 1;
    },
    set: function(v){
        this.show = v;
    }
});
console.log('get value:', Obj4.cnt);
Obj4.cnt = 4;
console.log('after set to 4, get value:', Obj4.show);

'use strict';

// vm.Script
const util = require('util');
const vm = require('vm');

let sandbox = {
    count: 2,
    name: 'start'
};

let ctx = vm.createContext(sandbox); 
// console.log(`what's ctx:`, ctx);
let script = new vm.Script(`count += 1; name = 'hardog';`);

for(let i = 0; i < 10; i++){
    script.runInContext(ctx);
}
console.log('vm.Script:', util.inspect(sandbox));

// runInNewContext
let script2 = new vm.Script(`global_var = 'say hello';`);
let ctxs = [{}, {}, {}];
ctxs.forEach((ctx) => {
    script2.runInNewContext(ctx);
});
console.log('runInNewContext:', util.inspect(ctxs));


// runInThisContext
global.changing = 1;
let script3 = new vm.Script(`changing++;`);
for(let i = 0; i < 10; i++){
    script3.runInThisContext();
}
console.log('runInThisContext:', global.changing);


// runInThisContext in a function
// to prove: runInThisContext this stand for `global` object
global.cnt = 3;  // yet not equal: let cnt = 3;
function inFn() {
    let cnt = 0;

    let script4 = new vm.Script(`cnt++;`, {filename: 'test.vm'});
    for(let i = 0; i < 10; i++){
        script4.runInThisContext();
    }

    return global.cnt;
}
console.log('runInThisContext from fn:', inFn());


// isContext
let sbox = {};
console.log('isContext(Object):', vm.isContext(sbox));
let contextified = vm.createContext({});
console.log('isContext(by createContext):', vm.isContext(contextified));


// vm.createContext has built-in object & function
let obj5 = {cnt: 0};
let ctx5 = vm.createContext(obj5);
let script5 = new vm.Script(`
    var a = 1.665;
    cnt = Math.ceil(a); // no effect
`);
script5.runInContext(ctx5);
console.log('built-in use Math.ceil(actuall no effect):', obj5);


// 
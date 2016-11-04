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
    cnt = Math.ceil(a); // no effect, also not throw
    // b += 3;
`, {displayErrors: false, filename: 'test.vm'});
script5.runInContext(ctx5);
console.log('built-in use Math.ceil(actuall no effect):', obj5);


// vm.runInContext
let ctx6 = {cnt: 1};
vm.createContext(ctx6);
// also : let ctx = vm.createContext(ctx6)
let compile_code = `
    for(var i = 0; i < 10; i++){
        cnt += i;
    }
`;
vm.runInContext(compile_code, ctx6, {filename: 'vm_run_in_context.vm'});
console.log('vm.runInContext:', util.inspect(ctx6));


// vm.runInDebugContext
let Debug = vm.runInDebugContext('Debug');
console.log('Debug(emit name):', Debug.findScript(process.emit).name);
console.log('Debug(exit name):', Debug.findScript(process.exit).name);


// vm.runInThisContext
let localVar = 'initial value';

const vmResult = vm.runInThisContext('localVar = "vm";');
console.log('vmResult:', vmResult);
console.log('localVar:', localVar);

const evalResult = eval('localVar = "eval";');
console.log('evalResult:', evalResult);
console.log('localVar:', localVar);


// is return ths content
// must wrapped by `(your code)`
let vmFn = vm.runInThisContext(`(
    function(args){
        return args + ' - hardog';
    }
)`);
console.log('is return vm conent:', vmFn('hello'));

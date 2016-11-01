'use strict';

// vm.Script
const util = require('util');
const vm = require('vm');

let sandbox = {
    count: 2,
    name: 'start'
};

let ctx = vm.createContext(sandbox);
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
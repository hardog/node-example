'use strict';

const assert = require('assert');
const spawnSync = require('child_process').spawnSync;
const Buffer = require('buffer').Buffer;
const vm = require('vm');

let sandbox = {}, result, ctx;
result = vm.runInNewContext(
    `foo = "bar"; this.typeofProcess = typeof process; typeof Object;`,
    sandbox
);

console.log('vm1:', sandbox);
console.log('vm1-result:', result);

result = vm.runInThisContext(
    `vmResult = "foo"; Object.prototype.toString.call(process);`
);
console.log('vm2:', result);

// TODO: sandbox 与 ctx 的异同?
ctx = vm.createContext(sandbox);
console.log(typeof ctx, typeof sandbox);

// process.execPath
console.log('process.execPath:', process.execPath);

function produce(source, count) {
  if (!count)
    count = 1;

  const out = spawnSync(process.execPath, [ '-e', `
    'use strict';
    var assert = require('assert');
    var vm = require('vm');

    var data;
    for (var i = 0; i < ${count}; i++) {
      var script = new vm.Script(process.argv[1], {
        produceCachedData: true
      });

      assert(!script.cachedDataProduced || script.cachedData instanceof Buffer);
      
      if (script.cachedDataProduced)
        data = script.cachedData.toString('base64');
    }
    console.log(data);
  `, source]);

  assert.equal(out.status, 0, out.stderr + '');
  return Buffer.from(out.stdout.toString(), 'base64');
}

function getSource(tag) {
  return `(function ${tag}() { return '${tag}'; })`;
}

let source = getSource('original');
console.log('produce:', produce(source));
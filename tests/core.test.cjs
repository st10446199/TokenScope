const test=require('node:test');
const assert=require('node:assert/strict');
const E=require('../src/core.js');

const enc=o=>Buffer.from(JSON.stringify(o)).toString('base64url');
const token=p=>enc({alg:'none'})+'.'+enc(p)+'.';
test('Unicode claim survives decoding',()=>assert.equal(E.inspect(token({name:'M\u00f6'}),0).payload.name,'M\u00f6'));
test('expiry boundary is expired',()=>assert.equal(E.inspect(token({exp:10}),10).times[0].state,'Expired'));
test('future expiry',()=>assert.equal(E.inspect(token({exp:10}),9).times[0].state,'Not expired'));
test('not before boundary',()=>assert.equal(E.inspect(token({nbf:10}),10).times[0].state,'Start time reached'));
test('future not before',()=>assert.equal(E.inspect(token({nbf:10}),9).times[0].state,'Not active yet'));
test('invalid date claim is warned',()=>assert.match(E.inspect(token({exp:'10'}),0).warnings.join(),/NumericDate/));
test('never authenticates tokens',()=>assert.equal(E.inspect(token({}),0).signatureVerified,false));
test('wrong segment count',()=>assert.throws(()=>E.inspect('abc.def')));
test('nonobject payload',()=>assert.throws(()=>E.inspect(token([]))));
test('bad base64url',()=>assert.throws(()=>E.inspect('a.b.c')));
test('input size bound',()=>assert.throws(()=>E.inspect('a'.repeat(65537))));
test('invalid UTF8 rejected',()=>assert.throws(()=>E.decodePart('_w')));

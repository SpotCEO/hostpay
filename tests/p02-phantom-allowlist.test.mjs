import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

const script=readFileSync(new URL('../public/p02/desktop.js',import.meta.url),'utf8');
const F02='9k5q4YqCgxTi5FBpV8PAFKprT6tU5HvUP7uvE4g1zYue';
const T='5DH2e3cJmFpyi6mk65EGFediunm4ui6BiKNUNrhWtD1b';
const P='BffRdcpiDLztBsqEp8KY15m5pmhrK8mXGzTz2mBeLMQe';
const C='BSTq9w3kZwNwpBXJEvTZz2G9ZTNyKBvoSeXMvwb4cNZr';
const S='11111111111111111111111111111111';
const Q='SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf';
const B='ComputeBudget111111111111111111111111111111';
const L='L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95';
const bytes=s=>Uint8Array.from(Buffer.from(s,'hex'));
const pub=s=>({toBase58:()=>s});
const create=Uint8Array.from(Buffer.from('Mt3HXSj1i+kAAgADAAAAGN3dmnqY6HXZ3IFnT72QTSveu7YvtRbfpq52zLNtXP0HgebuEg4G/vFSr2HwIzE1QbU64GqMujQqtNT5UB860dEHjSPYrVfirPlOWjbo790zQEsC3tYhsA3Rsd0rMZa8qGYHgFEBAAAA','base64'));
assert.equal(createHash('sha256').update(create).digest('hex'),'6d779bf30b1a42ded6a519ecc9821fa88909f180d5953eeb1cba28d47832dac1');
assert.equal(new DataView(create.buffer,create.byteOffset,create.byteLength).getUint32(create.length-6,true),86400);
const original={version:0,recentBlockhash:'fresh',serialize:()=>Uint8Array.of(1),header:{numRequiredSignatures:1,numReadonlySignedAccounts:0,numReadonlyUnsignedAccounts:3},staticAccountKeys:[F02,T,P,Q,C,S].map(pub),addressTableLookups:[],compiledInstructions:[{programIdIndex:3,accountKeyIndexes:[4,1,2,0,0,5],data:create}]};
function observed(price=375000n){
  const fee=new Uint8Array(9);fee[0]=3;new DataView(fee.buffer).setBigUint64(1,price,true);
  return {version:0,recentBlockhash:'fresh',serialize:()=>Uint8Array.of(2),header:{numRequiredSignatures:1,numReadonlySignedAccounts:0,numReadonlyUnsignedAccounts:5},staticAccountKeys:[F02,P,T,S,B,L,Q,C].map(pub),addressTableLookups:[],compiledInstructions:[
    {programIdIndex:4,accountKeyIndexes:[],data:bytes('02400d0300')},
    {programIdIndex:4,accountKeyIndexes:[],data:fee},
    {programIdIndex:5,accountKeyIndexes:[2],data:bytes('06040203000001000000000000000000')},
    {programIdIndex:5,accountKeyIndexes:[1],data:bytes('06040100000000000000000000')},
    {programIdIndex:6,accountKeyIndexes:[7,2,1,0,0,3],data:create},
    {programIdIndex:5,accountKeyIndexes:[0],data:bytes('06040300f4c08905000000000403000001000000000000000000')}
  ]};
}
function p02First(price=375000n){
  const m=observed(price);
  [m.compiledInstructions[2],m.compiledInstructions[3]]=[m.compiledInstructions[3],m.compiledInstructions[2]];
  return m;
}
const elements=new Map();
const el=id=>{if(!elements.has(id))elements.set(id,{hidden:true,disabled:false,textContent:''});return elements.get(id);};
const context=vm.createContext({window:{solanaWeb3:{SystemProgram:{programId:pub(S)},ComputeBudgetProgram:{programId:pub(B)}},nacl:{}},document:{getElementById:el},location:{origin:'https://www.hostpayapp.com'},localStorage:{getItem:()=>null},crypto:{subtle:{}},Uint8Array,Array,BigInt,JSON});
vm.runInContext(script,context);
const validate=m=>vm.runInContext('assertCompatibleMessage(candidate,original,create)',Object.assign(context,{candidate:m,original,create}));
assert.equal(validate(original).kind,'EXACT');
assert.equal(validate(observed()).priorityFeeLamports,75000);
assert.equal(validate(p02First()).priorityFeeLamports,75000);
assert.equal(validate(observed(0n)).priorityFeeLamports,0);
assert.equal(validate(p02First(0n)).priorityFeeLamports,0);
const rejected=(m,name)=>assert.throws(()=>validate(m),undefined,name);
rejected(observed(375001n),'priority-fee cap');
let m=observed();m.compiledInstructions[2].data=bytes('06040100000000000000000000');rejected(m,'changed treasury predicate');
m=observed();m.compiledInstructions[3].accountKeyIndexes=[2];rejected(m,'changed Lighthouse target');
m=p02First();m.compiledInstructions[2].data=bytes('06040203000001000000000000000000');assert.throws(()=>validate(m),/Wrong instruction 3 data/,'P02-first wrong predicate');
m=p02First();m.compiledInstructions[3].accountKeyIndexes=[1];assert.throws(()=>validate(m),/Wrong instruction 4 accounts/,'P02-first wrong treasury target');
m=p02First();m.compiledInstructions[3]=m.compiledInstructions[2];assert.throws(()=>validate(m),/Wrong instruction 4 accounts/,'duplicate P02 assertion');
m=observed();m.compiledInstructions[4].data=Uint8Array.of(1);rejected(m,'changed Squads instruction');
m=observed();m.compiledInstructions[5].data=bytes('06040300f5c08905000000000403000001000000000000000000');rejected(m,'changed F02 balance predicate');
m=observed();m.compiledInstructions[5].accountKeyIndexes=[1];rejected(m,'changed F02 assertion target');
m=observed();m.compiledInstructions.reverse();rejected(m,'reordered instructions');
m=p02First();[m.compiledInstructions[3],m.compiledInstructions[4]]=[m.compiledInstructions[4],m.compiledInstructions[3]];rejected(m,'Squads interleaved with assertions');
m=p02First();[m.compiledInstructions[4],m.compiledInstructions[5]]=[m.compiledInstructions[5],m.compiledInstructions[4]];rejected(m,'final F02 assertion moved');
m=observed();m.header.numReadonlyUnsignedAccounts=4;rejected(m,'new writable account');
m=observed();m.header.numRequiredSignatures=2;rejected(m,'new signer');
m=observed();m.addressTableLookups=[{}];rejected(m,'address lookup');
m=observed();m.recentBlockhash='changed';rejected(m,'blockhash substitution');
m=observed();m.compiledInstructions.push(m.compiledInstructions[0]);rejected(m,'extra instruction');
console.log('P02 exact two-permutation Lighthouse allowlist and adversarial mutations: PASS');

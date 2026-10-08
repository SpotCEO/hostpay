import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const script=readFileSync(new URL('../public/p01/desktop.js',import.meta.url),'utf8');
const F01='2g51DvYUJjzddhBLcqSZardaiqpm9oVSYjW6scrS2p2G';
const T='5DH2e3cJmFpyi6mk65EGFediunm4ui6BiKNUNrhWtD1b';
const P='tL8CVzuMhUBCMScCkBRhPuCGi6B9vt6wWrN3heZwCmZ';
const C='BSTq9w3kZwNwpBXJEvTZz2G9ZTNyKBvoSeXMvwb4cNZr';
const S='11111111111111111111111111111111';
const Q='SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf';
const B='ComputeBudget111111111111111111111111111111';
const L='L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95';
const bytes=s=>Uint8Array.from(Buffer.from(s,'hex'));
const pub=s=>({toBase58:()=>s});
const create=bytes('32ddc75d28f58be90002000300000018dddd9a7a98e875d9dc81674fbd904d2bdebbb62fb516dfa6ae76ccb36d5cfd0781e6ee120e06fef152af61f023313541b53ae06a8cba342ab4d4f9501f3ad1d1078d23d8ad57e2acf94e5a36e8efdd33404b02ded621b00dd1b1dd2b3196bca86607000000000000');
const original={version:0,recentBlockhash:'fresh',serialize:()=>Uint8Array.of(1),header:{numRequiredSignatures:1,numReadonlySignedAccounts:0,numReadonlyUnsignedAccounts:3},staticAccountKeys:[F01,T,P,Q,C,S].map(pub),addressTableLookups:[],compiledInstructions:[{programIdIndex:3,accountKeyIndexes:[4,1,2,0,0,5],data:create}]};
function observed(price=375000n){
  const fee=new Uint8Array(9);fee[0]=3;new DataView(fee.buffer).setBigUint64(1,price,true);
  return {version:0,recentBlockhash:'fresh',serialize:()=>Uint8Array.of(2),header:{numRequiredSignatures:1,numReadonlySignedAccounts:0,numReadonlyUnsignedAccounts:5},staticAccountKeys:[F01,P,T,S,B,L,Q,C].map(pub),addressTableLookups:[],compiledInstructions:[
    {programIdIndex:4,accountKeyIndexes:[],data:bytes('02400d0300')},
    {programIdIndex:4,accountKeyIndexes:[],data:fee},
    {programIdIndex:5,accountKeyIndexes:[2],data:bytes('06040203000001000000000000000000')},
    {programIdIndex:5,accountKeyIndexes:[1],data:bytes('06040100000000000000000000')},
    {programIdIndex:6,accountKeyIndexes:[7,2,1,0,0,3],data:create},
    {programIdIndex:5,accountKeyIndexes:[0],data:bytes('06040300f4c08905000000000403000001000000000000000000')}
  ]};
}
function p01First(price=375000n){
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
assert.equal(validate(p01First()).priorityFeeLamports,75000);
assert.equal(validate(observed(0n)).priorityFeeLamports,0);
assert.equal(validate(p01First(0n)).priorityFeeLamports,0);
const rejected=(m,name)=>assert.throws(()=>validate(m),undefined,name);
rejected(observed(375001n),'priority-fee cap');
let m=observed();m.compiledInstructions[2].data=bytes('06040100000000000000000000');rejected(m,'changed treasury predicate');
m=observed();m.compiledInstructions[3].accountKeyIndexes=[2];rejected(m,'changed Lighthouse target');
m=p01First();m.compiledInstructions[2].data=bytes('06040203000001000000000000000000');assert.throws(()=>validate(m),/Wrong instruction 3 data/,'P01-first wrong predicate');
m=p01First();m.compiledInstructions[3].accountKeyIndexes=[1];assert.throws(()=>validate(m),/Wrong instruction 4 accounts/,'P01-first wrong treasury target');
m=p01First();m.compiledInstructions[3]=m.compiledInstructions[2];assert.throws(()=>validate(m),/Wrong instruction 4 accounts/,'duplicate P01 assertion');
m=observed();m.compiledInstructions[4].data=Uint8Array.of(1);rejected(m,'changed Squads instruction');
m=observed();m.compiledInstructions.reverse();rejected(m,'reordered instructions');
m=p01First();[m.compiledInstructions[3],m.compiledInstructions[4]]=[m.compiledInstructions[4],m.compiledInstructions[3]];rejected(m,'Squads interleaved with assertions');
m=p01First();[m.compiledInstructions[4],m.compiledInstructions[5]]=[m.compiledInstructions[5],m.compiledInstructions[4]];rejected(m,'final F01 assertion moved');
m=observed();m.header.numReadonlyUnsignedAccounts=4;rejected(m,'new writable account');
m=observed();m.header.numRequiredSignatures=2;rejected(m,'new signer');
m=observed();m.addressTableLookups=[{}];rejected(m,'address lookup');
m=observed();m.recentBlockhash='changed';rejected(m,'blockhash substitution');
m=observed();m.compiledInstructions.push(m.compiledInstructions[0]);rejected(m,'extra instruction');
console.log('P01 exact two-permutation Lighthouse allowlist and adversarial mutations: PASS');

import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import vm from 'node:vm';

const source=readFileSync(new URL('../public/p01/desktop.js',import.meta.url),'utf8');
const F01='2g51DvYUJjzddhBLcqSZardaiqpm9oVSYjW6scrS2p2G';
const CONFIG='BSTq9w3kZwNwpBXJEvTZz2G9ZTNyKBvoSeXMvwb4cNZr';
const TREASURY='5DH2e3cJmFpyi6mk65EGFediunm4ui6BiKNUNrhWtD1b';
const P01='tL8CVzuMhUBCMScCkBRhPuCGi6B9vt6wWrN3heZwCmZ';
const PROGRAM='SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf';
const SYSTEM='11111111111111111111111111111111';
const COMPUTE='ComputeBudget111111111111111111111111111111';
const approvedData=Uint8Array.from(Buffer.from('Mt3HXSj1i+kAAgADAAAAGN3dmnqY6HXZ3IFnT72QTSveu7YvtRbfpq52zLNtXP0HgebuEg4G/vFSr2HwIzE1QbU64GqMujQqtNT5UB860dEHjSPYrVfirPlOWjbo790zQEsC3tYhsA3Rsd0rMZa8qGYHAAAAAAAA','base64'));
const pub=s=>({toBase58:()=>s,toBytes:()=>new Uint8Array(32)});

function fixture(changed){
  const elements=new Map(),storage=new Map();
  const el=id=>{if(!elements.has(id))elements.set(id,{hidden:true,disabled:false,textContent:'',click(){}});return elements.get(id);};
  const keys=[F01,CONFIG,TREASURY,P01,SYSTEM,PROGRAM,...changed?[COMPUTE]:[]].map(pub);
  const original={serialize:()=>Uint8Array.from([1]),recentBlockhash:'test-blockhash',header:{numRequiredSignatures:1},staticAccountKeys:keys.slice(0,6),addressTableLookups:[],compiledInstructions:[{programIdIndex:5,accountKeyIndexes:[1,2,3,0,0,4],data:approvedData}]};
  const returned={...original,serialize:()=>Uint8Array.from([changed?2:1]),staticAccountKeys:keys,
    compiledInstructions:changed?[{programIdIndex:6,accountKeyIndexes:[],data:Uint8Array.from([2,1,0,0,0])},...original.compiledInstructions]:original.compiledInstructions};
  let sends=0;
  const provider={isPhantom:true,publicKey:pub(F01),on(){},async signTransaction(){return {serialize:()=>Uint8Array.from([9])};}};
  class VersionedTransaction{constructor(message){this.message=message;}static deserialize(){return {message:returned,signatures:[new Uint8Array(64).fill(1)]};}}
  const W={VersionedTransaction,PublicKey:class{constructor(s){this.s=s;}toBase58(){return this.s;}toBytes(){return new Uint8Array(32);}},
    SystemProgram:{programId:pub(SYSTEM)},ComputeBudgetProgram:{programId:pub(COMPUTE)},Connection:class{sendRawTransaction(){sends++;throw Error('send must not occur');}}};
  const context=vm.createContext({window:{solanaWeb3:W,nacl:{sign:{detached:{verify:()=>true}}},phantom:{solana:provider}},
    document:{getElementById:el},location:{origin:'https://www.hostpayapp.com'},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
    crypto:webcrypto,Uint8Array,Array,BigInt,Date,JSON,TextEncoder,atob,btoa,Blob,URL,setTimeout});
  vm.runInContext(source,context);
  vm.runInContext('prepared={message:globalThis.testMessage,blockhash:"test-blockhash",lastValidBlockHeight:123,slot:1,rent:1823720}',Object.assign(context,{testMessage:original}));
  return {context,storage,el,sends:()=>sends};
}

for(const changed of [false,true]){
  const f=fixture(changed);
  await vm.runInContext('sign()',f.context);
  const e=JSON.parse(f.storage.get('hostpay:p01:desktop:evidence:v1'));
  assert.equal(e.wireBase64,'CQ==','returned signed wire retained before validation');
  assert.equal(e.exactMessage,!changed);
  assert.equal(e.signatureValid,true);
  assert.equal(e.approvedShape,!changed);
  assert.equal(f.el('broadcast').hidden,changed,'changed transaction has no broadcast action');
  assert.equal(f.sends(),0,'signing never broadcasts');
  assert.equal(e.returned.instructions.length,changed?2:1,'returned instructions decoded');
}
console.log('P01 desktop return retention and changed-message broadcast gate: PASS');

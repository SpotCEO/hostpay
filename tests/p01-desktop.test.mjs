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
const LIGHTHOUSE='L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95';
const approvedData=Uint8Array.from(Buffer.from('Mt3HXSj1i+kAAgADAAAAGN3dmnqY6HXZ3IFnT72QTSveu7YvtRbfpq52zLNtXP0HgebuEg4G/vFSr2HwIzE1QbU64GqMujQqtNT5UB860dEHjSPYrVfirPlOWjbo790zQEsC3tYhsA3Rsd0rMZa8qGYHAAAAAAAA','base64'));
const pub=s=>({toBase58:()=>s,toBytes:()=>new Uint8Array(32)});
const fromHex=s=>Uint8Array.from(Buffer.from(s,'hex'));

function fixture(changed,options={}){
  const elements=new Map(),storage=new Map();
  storage.set('hostpay:p01:desktop:evidence:v1','{"earlyPriorSignedWire":"retained"}');
  storage.set('hostpay:p01:desktop:evidence:v2','{"expiredPriorSignedWire":"retained"}');
  storage.set('hostpay:p01:desktop:evidence:v3','{"wireBase64":"old-signed-wire","sendAttempted":false}');
  storage.set('hostpay:p01:desktop:evidence:v4','{"wireBase64":"expired-v4-signed-wire","sendAttempted":false}');
  storage.set('hostpay:p01:desktop:evidence:v5','{"wireBase64":"expired-v5-signed-wire","sendAttempted":false}');
  const el=id=>{if(!elements.has(id))elements.set(id,{hidden:true,disabled:false,textContent:'',click(){}});return elements.get(id);};
  const keys=[F01,TREASURY,P01,PROGRAM,CONFIG,SYSTEM,...changed===true?[COMPUTE]:[]].map(pub);
  const original={version:0,serialize:()=>Uint8Array.from([1]),recentBlockhash:'test-blockhash',header:{numRequiredSignatures:1,numReadonlySignedAccounts:0,numReadonlyUnsignedAccounts:3},staticAccountKeys:keys.slice(0,6),addressTableLookups:[],compiledInstructions:[{programIdIndex:3,accountKeyIndexes:[4,1,2,0,0,5],data:approvedData}]};
  const bounded=changed==='bounded';
  const returned=bounded?{...original,serialize:()=>Uint8Array.of(2),header:{...original.header,numReadonlyUnsignedAccounts:5},
    staticAccountKeys:[F01,P01,TREASURY,SYSTEM,COMPUTE,LIGHTHOUSE,PROGRAM,CONFIG].map(pub),compiledInstructions:[
      {programIdIndex:4,accountKeyIndexes:[],data:fromHex('02400d0300')},
      {programIdIndex:4,accountKeyIndexes:[],data:fromHex('03d8b8050000000000')},
      {programIdIndex:5,accountKeyIndexes:[2],data:fromHex('06040203000001000000000000000000')},
      {programIdIndex:5,accountKeyIndexes:[1],data:fromHex('06040100000000000000000000')},
      {programIdIndex:6,accountKeyIndexes:[7,2,1,0,0,3],data:approvedData},
      {programIdIndex:5,accountKeyIndexes:[0],data:fromHex('06040300f4c08905000000000403000001000000000000000000')}
    ]}: {...original,serialize:()=>Uint8Array.from([changed?2:1]),staticAccountKeys:keys,
    compiledInstructions:changed?[{programIdIndex:6,accountKeyIndexes:[],data:Uint8Array.from([2,1,0,0,0])},...original.compiledInstructions]:original.compiledInstructions};
  let sends=0,simulations=0,heightReads=0;
  const signingFlow=[];
  const provider={isPhantom:true,publicKey:pub(F01),on(){},async signTransaction(){signingFlow.push('phantom-sign');return {serialize:()=>Uint8Array.from([9])};}};
  class VersionedTransaction{constructor(message){this.message=message;}static deserialize(){return {message:returned,signatures:[new Uint8Array(64).fill(1)],serialize:()=>Uint8Array.of(9)};}}
  const W={VersionedTransaction,MessageV0:{deserialize:()=>original},TransactionMessage:class{compileToV0Message(){return original;}},PublicKey:class{constructor(s){this.s=s;}toBase58(){return this.s;}toBytes(){return new Uint8Array(32);}},
    SystemProgram:{programId:pub(SYSTEM)},ComputeBudgetProgram:{programId:pub(COMPUTE)},Connection:class{
      sendRawTransaction(){sends++;throw Error('send must not occur');}
      async getLatestBlockhash(commitment){assert.equal(commitment,'confirmed');signingFlow.push('blockhash');return {blockhash:'test-blockhash',lastValidBlockHeight:123};}
      async getFeeForMessage(){signingFlow.push('fee');return {value:5000};}
      async getSignatureStatuses(){return {value:[null]};}
      async getBlockHeight(){return options.blockHeights?.[heightReads++] ?? 100;}
      async simulateTransaction(tx,config){simulations++;assert.equal(tx.message,returned);assert.equal(config.sigVerify,true);assert.equal(config.replaceRecentBlockhash,false);return {value:{err:options.simulationError===undefined?'SIMULATED_FAILURE':options.simulationError}};}
    }};
  const context=vm.createContext({window:{solanaWeb3:W,nacl:{sign:{detached:{verify:()=>true}}},phantom:{solana:provider}},
    document:{getElementById:el},location:{origin:'https://www.hostpayapp.com'},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
    crypto:webcrypto,Uint8Array,Array,BigInt,Date,JSON,TextEncoder,atob,btoa,Blob,URL,setTimeout});
  vm.runInContext(source,context);
  assert.equal(el('connect').disabled,false,'old v1/v2/v3/v4/v5 evidence does not disable the fresh Connect F01 attempt');
  vm.runInContext('prepared={message:globalThis.testMessage,instruction:{},connection:new window.solanaWeb3.Connection(),blockhash:"old-prepare-blockhash",lastValidBlockHeight:50,slot:1,rent:1823720,maxTotalCost:1903720}',Object.assign(context,{testMessage:original}));
  return {context,storage,el,sends:()=>sends,simulations:()=>simulations,signingFlow};
}

for(const changed of [false,true,'bounded']){
  const f=fixture(changed);
  await vm.runInContext('sign()',f.context);
  const e=JSON.parse(f.storage.get('hostpay:p01:desktop:evidence:v6'));
  assert.equal(f.storage.get('hostpay:p01:desktop:evidence:v1'),'{"earlyPriorSignedWire":"retained"}','v1 evidence remains untouched');
  assert.equal(f.storage.get('hostpay:p01:desktop:evidence:v2'),'{"expiredPriorSignedWire":"retained"}','prior signed evidence remains untouched');
  assert.equal(f.storage.get('hostpay:p01:desktop:evidence:v3'),'{"wireBase64":"old-signed-wire","sendAttempted":false}','v3 signed wire remains untouched');
  assert.equal(f.storage.get('hostpay:p01:desktop:evidence:v4'),'{"wireBase64":"expired-v4-signed-wire","sendAttempted":false}','v4 signed wire remains untouched');
  assert.equal(f.storage.get('hostpay:p01:desktop:evidence:v5'),'{"wireBase64":"expired-v5-signed-wire","sendAttempted":false}','v5 signed wire remains untouched');
  assert.equal(e.signingBlockhashRead.blockhash,'test-blockhash');
  assert.equal(e.signingBlockhashRead.lastValidBlockHeight,123);
  assert.equal(e.signingBlockhashRead.rpcEndpoint,'https://solana-rpc.publicnode.com');
  assert.equal(e.signingBlockhashRead.commitment,'confirmed');
  assert.ok(Date.parse(e.signingBlockhashRead.requestedAt)<=Date.parse(e.signingBlockhashRead.receivedAt));
  assert.deepEqual(f.signingFlow,['blockhash','phantom-sign'],'no RPC call after signing blockhash acquisition');
  assert.equal(e.wireBase64,'CQ==','returned signed wire retained before validation');
  assert.equal(e.exactMessage,changed===false);
  assert.equal(e.signatureValid,true);
  assert.equal(e.approvedShape,changed!==true);
  assert.equal(f.el('broadcast').hidden,changed===true,'only unapproved changes have no broadcast action');
  assert.equal(f.sends(),0,'signing never broadcasts');
  assert.equal(e.returned.instructions.length,changed==='bounded'?6:changed?2:1,'returned instructions decoded');
  if(changed!==true){
    vm.runInContext('preflight=async()=>({rent:1823720})',f.context);
    await assert.rejects(()=>vm.runInContext('broadcast()',f.context),/simulation failed/);
    const observed=JSON.parse(f.storage.get('hostpay:p01:desktop:evidence:v6'));
    assert.equal(observed.expiryHeightReadBeforePreflight.blockHeight,100);
    assert.equal(observed.expiryHeightReadBeforePreflight.comparedLastValidBlockHeight,123);
    assert.equal(observed.expiryHeightReadBeforePreflight.rpcEndpoint,'https://solana-rpc.publicnode.com');
    assert.equal(observed.expiryHeightReadBeforePreflight.commitment,'confirmed');
    assert.ok(Date.parse(observed.expiryHeightReadBeforePreflight.requestedAt)<=Date.parse(observed.expiryHeightReadBeforePreflight.receivedAt));
    assert.equal(observed.expiryHeightReadAfterSimulation,undefined,'second height is absent when simulation fails');
    assert.equal(f.simulations(),1,'exact signed transaction simulated');
    assert.equal(f.sends(),0,'simulation failure prevents broadcast');
    assert.equal(observed.sendAttempted,false);
  }
}
for(const [heights,simulationError,expectedError,expectedSimulationCount] of [
  [[124],undefined,/Signed blockhash expired; no broadcast/,0],
  [[100,124],null,/Signed blockhash expired after simulation; no broadcast/,1]
]){
  const f=fixture(false,{blockHeights:heights,simulationError});
  await vm.runInContext('sign()',f.context);
  vm.runInContext('preflight=async()=>({rent:1823720})',f.context);
  await assert.rejects(()=>vm.runInContext('broadcast()',f.context),expectedError);
  const e=JSON.parse(f.storage.get('hostpay:p01:desktop:evidence:v6'));
  assert.equal(e.expiryHeightReadBeforePreflight.blockHeight,heights[0]);
  assert.equal(e.expiryHeightReadAfterSimulation?.blockHeight,heights[1]);
  if(heights[1]!==undefined){
    assert.equal(e.expiryHeightReadAfterSimulation.comparedLastValidBlockHeight,123);
    assert.equal(e.expiryHeightReadAfterSimulation.rpcEndpoint,'https://solana-rpc.publicnode.com');
    assert.equal(e.expiryHeightReadAfterSimulation.commitment,'confirmed');
    assert.ok(Date.parse(e.expiryHeightReadAfterSimulation.requestedAt)<=Date.parse(e.expiryHeightReadAfterSimulation.receivedAt));
  }
  assert.equal(f.simulations(),expectedSimulationCount);
  assert.equal(f.sends(),0,'diagnostic retention cannot authorize a send after expiry');
  assert.equal(e.sendAttempted,false);
}
console.log('P01 return retention, fresh blockhash, separate broadcast and simulation gate: PASS');

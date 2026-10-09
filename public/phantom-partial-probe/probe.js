/* Isolated capability probe. No transaction submission function exists here. */
'use strict';
const W=window.solanaWeb3,N=window.nacl,$=id=>document.getElementById(id);
const F01='2g51DvYUJjzddhBLcqSZardaiqpm9oVSYjW6scrS2p2G';
const MEMO='MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
const RPC='https://solana-rpc.publicnode.com';
const STORE='hostpay:phantom-partial-probe:20261009';
const zero=new Uint8Array(64),state={connected:false,stopped:false,test1:false,test1Passed:false,test2:false,records:[]};
const assert=(v,m)=>{if(!v)throw Error(m)};
const key=x=>new W.PublicKey(x);
const hex=b=>Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
const b64=b=>btoa(String.fromCharCode(...b));
const sha=async b=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',b)));
const same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const selected=()=>window.phantom?.solana?.publicKey?.toBase58();
function save(){localStorage.setItem(STORE,JSON.stringify(state.records));}
function show(){
  $('test1').disabled=!state.connected||state.stopped||state.test1;
  $('test2').disabled=!state.connected||state.stopped||!state.test1Passed||state.test2;
  $('download').disabled=!state.records.length;
  $('results').textContent=JSON.stringify(state.records.map(({rawWireBase64,...rest})=>rest),null,2);
}
function decoded(m){
  const keys=m.staticAccountKeys.map(String);
  return {version:m.version,header:m.header,feePayer:keys[0],recentBlockhash:m.recentBlockhash,
    staticAccountKeys:keys,addressTableLookups:m.addressTableLookups.map(x=>({accountKey:String(x.accountKey),writableIndexes:Array.from(x.writableIndexes),readonlyIndexes:Array.from(x.readonlyIndexes)})),
    instructions:m.compiledInstructions.map(x=>({programId:keys[x.programIdIndex],accounts:Array.from(x.accountKeyIndexes,i=>keys[i]),dataHex:hex(x.data)}))};
}
function differences(a,b){
  const out=[];for(const field of ['version','header','feePayer','recentBlockhash','staticAccountKeys','addressTableLookups','instructions'])
    if(JSON.stringify(a[field])!==JSON.stringify(b[field]))out.push({field,before:a[field],after:b[field]});
  return out;
}
async function connect(){
  assert(!state.connected,'Already connected');
  const p=window.phantom?.solana;assert(p?.isPhantom,'Phantom desktop extension not found');
  const r=await p.connect();assert(String(r.publicKey)===F01&&selected()===F01,'Select F01 Treasury in Phantom');
  state.connected=true;$('connect').disabled=true;
  p.on('accountChanged',()=>{state.stopped=true;show();$('status').textContent='STOP — Phantom account changed. No retry or broadcast.';});
  $('status').textContent=`F01 selected: ${F01}. No transaction signed or sent.`;show();
}
async function probe(test){
  assert(state.connected&&!state.stopped&&selected()===F01,'F01 must remain selected');
  assert(test===1?!state.test1:state.test1Passed&&!state.test2,'Test order or duplicate attempt');
  if(test===1)state.test1=true;else state.test2=true;show();
  const record={test,at:new Date().toISOString(),status:'STARTED',broadcastCount:0};state.records.push(record);save();
  try{
    const payer=W.Keypair.generate(),authority=test===2?W.Keypair.generate():null;
    const signers=[String(payer.publicKey),F01,...(authority?[String(authority.publicKey)]:[])];
    const latest=await new W.Connection(RPC,'confirmed').getLatestBlockhash('confirmed');
    const memo=new W.TransactionInstruction({programId:key(MEMO),keys:[{pubkey:key(F01),isSigner:true,isWritable:false},...(authority?[{pubkey:authority.publicKey,isSigner:true,isWritable:false}]:[])],data:new TextEncoder().encode(`HOSTPAY PHANTOM PARTIAL SIGNING CAPABILITY TEST ${test} — NEVER BROADCAST`)});
    const message=new W.TransactionMessage({payerKey:payer.publicKey,recentBlockhash:latest.blockhash,instructions:[memo]}).compileToV0Message();
    const tx=new W.VersionedTransaction(message),before=Uint8Array.from(message.serialize());
    const actual=message.staticAccountKeys.slice(0,message.header.numRequiredSignatures).map(String);
    assert(actual.length===signers.length&&signers.every(x=>actual.includes(x)),'Wrong test signer set');
    assert(tx.signatures.every(s=>same(s,zero)),'Test transaction is not fully unsigned');
    Object.assign(record,{requiredSigners:actual,phantomSigner:F01,localTestPayer:String(payer.publicKey),localTestAuthority:authority?String(authority.publicKey):null,
      blockhash:latest.blockhash,lastValidBlockHeight:latest.lastValidBlockHeight,expectedMessageSha256:await sha(before),prePhantom:decoded(message),slotsEmptyBeforePhantom:true,status:'WAITING_FOR_PHANTOM'});save();show();
    assert(!state.stopped&&selected()===F01,'F01 selection changed before Phantom signing');
    $('status').textContent=`Test ${test}: approve Phantom signTransaction with F01. This page cannot broadcast.`;
    let returned;
    try{returned=await window.phantom.solana.signTransaction(tx)}catch(error){
      record.status='PHANTOM_REFUSED';record.error=String(error?.message||error);save();state.stopped=true;show();$('status').textContent=`STOP — Test ${test}: Phantom refused. No retry or broadcast.`;return;
    }
    const raw=Uint8Array.from(returned.serialize());
    // Preserve Phantom's exact returned wire before parsing, validation, or reporting.
    record.rawWireBase64=b64(raw);record.returnedAt=new Date().toISOString();record.status='RAW_RETURN_RETAINED';save();
    const signed=W.VersionedTransaction.deserialize(raw),after=Uint8Array.from(signed.message.serialize());
    const fIndex=actual.indexOf(F01);
    record.returnedMessageSha256=await sha(after);
    record.postPhantom=decoded(signed.message);
    record.mutations=differences(record.prePhantom,record.postPhantom);
    record.messageUnchanged=same(before,after);
    record.f01SignatureValid=signed.signatures.length===actual.length&&N.sign.detached.verify(after,signed.signatures[fIndex],key(F01).toBytes());
    record.otherSlotsPreservedEmpty=signed.signatures.length===actual.length&&signed.signatures.every((s,i)=>i===fIndex||same(s,zero));
    record.status=record.messageUnchanged&&record.f01SignatureValid&&record.otherSlotsPreservedEmpty?'PASS':'FAIL';save();
    if(record.status!=='PASS')state.stopped=true;
    else if(test===1)state.test1Passed=true;
    show();$('status').textContent=record.status==='PASS'?`Test ${test} PASS. No broadcast. ${test===1?'Test 2 is now available.':'Both tests completed.'}`:`STOP — Test ${test} changed or invalid. No retry or broadcast.`;
  }catch(error){record.status='PROBE_ERROR';record.error=String(error?.message||error);save();state.stopped=true;show();$('status').textContent=`STOP — Test ${test} error. No retry or broadcast.`;}
}
function download(){
  const blob=new Blob([JSON.stringify(state.records,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='hostpay-phantom-partial-signing-probe.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function init(){
  assert(W&&N&&crypto?.subtle,'Required libraries unavailable');
  const previous=localStorage.getItem(STORE);if(previous){state.records=JSON.parse(previous);state.stopped=true;$('connect').disabled=true;$('status').textContent='Previous probe evidence retained. No retry from this page.';show();return;}
  $('connect').onclick=()=>connect().catch(error=>{$('status').textContent=`Connect stopped: ${String(error?.message||error)}`;});
  $('test1').onclick=()=>probe(1);$('test2').onclick=()=>probe(2);$('download').onclick=download;
  $('status').textContent='Connect F01 to start. No transaction has been signed or sent.';show();
}
init();

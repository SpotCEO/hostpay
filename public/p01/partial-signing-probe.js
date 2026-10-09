/* Test 1B only. Reuses P01's Phantom desktop connection and bundled Solana libraries. No send path. */
'use strict';
const W=window.solanaWeb3,N=window.nacl,$=id=>document.getElementById(id);
const F01='2g51DvYUJjzddhBLcqSZardaiqpm9oVSYjW6scrS2p2G';
const MEMO='MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
const RPC='https://solana-rpc.publicnode.com';
const STORE='hostpay:p01:partial-signing-test1b:20261009';
const zero=new Uint8Array(64);
const assert=(v,m)=>{if(!v)throw Error(m)};
const key=x=>new W.PublicKey(x);
const hex=b=>Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
const b64=b=>btoa(String.fromCharCode(...b));
const sha=async b=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',b)));
const same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const selected=()=>window.phantom?.solana?.publicKey?.toBase58();
let connected=false,started=false,record=null;
function save(){localStorage.setItem(STORE,JSON.stringify(record));}
function show(){
  $('connect').disabled=connected||started;
  $('sign').disabled=!connected||started;
  $('download').disabled=!record;
  const {rawWireBase64,...display}=record||{};
  $('result').textContent=JSON.stringify(display,null,2);
}
function decoded(m){
  const keys=m.staticAccountKeys.map(String);
  return {version:m.version,header:m.header,feePayer:keys[0],recentBlockhash:m.recentBlockhash,
    staticAccountKeys:keys,addressTableLookups:m.addressTableLookups.map(x=>({accountKey:String(x.accountKey),writableIndexes:Array.from(x.writableIndexes),readonlyIndexes:Array.from(x.readonlyIndexes)})),
    instructions:m.compiledInstructions.map(x=>({programId:keys[x.programIdIndex],accounts:Array.from(x.accountKeyIndexes,i=>keys[i]),dataHex:hex(x.data)}))};
}
function differences(a,b){
  const out=[];
  for(const field of ['version','header','feePayer','recentBlockhash','staticAccountKeys','addressTableLookups','instructions'])
    if(JSON.stringify(a[field])!==JSON.stringify(b[field]))out.push({field,before:a[field],after:b[field]});
  return out;
}
async function connect(){
  const p=window.phantom?.solana;assert(p?.isPhantom,'Phantom desktop extension not found');
  const r=await p.connect();assert(String(r.publicKey)===F01&&selected()===F01,'Select F01 Treasury in Phantom');
  connected=true;p.on('accountChanged',()=>{started=true;show();$('status').textContent='STOP — Phantom account changed.';});
  $('status').textContent=`F01 selected: ${F01}. No transaction signed or sent.`;show();
}
async function test1b(){
  assert(connected&&!started&&selected()===F01,'F01 must remain selected');
  started=true;show();
  record={test:'1B',at:new Date().toISOString(),status:'STARTED',broadcastCount:0};save();
  try{
    const payer=W.Keypair.generate();
    const latest=await new W.Connection(RPC,'confirmed').getLatestBlockhash('confirmed');
    const memo=new W.TransactionInstruction({programId:key(MEMO),keys:[{pubkey:key(F01),isSigner:true,isWritable:false}],data:new TextEncoder().encode('HOSTPAY PHANTOM PARTIAL SIGNING CAPABILITY TEST 1 — NEVER BROADCAST')});
    const message=new W.TransactionMessage({payerKey:payer.publicKey,recentBlockhash:latest.blockhash,instructions:[memo]}).compileToV0Message();
    const tx=new W.VersionedTransaction(message),before=Uint8Array.from(message.serialize());
    const signers=message.staticAccountKeys.slice(0,message.header.numRequiredSignatures).map(String);
    assert(signers.length===2&&signers[0]===String(payer.publicKey)&&signers[1]===F01,'Wrong Test 1B signer layout');
    assert(tx.signatures.every(s=>same(s,zero)),'Signer slots were not initially empty');
    tx.sign([payer]);
    const afterLocal=Uint8Array.from(tx.message.serialize());
    assert(same(before,afterLocal),'Local signing changed the message');
    assert(N.sign.detached.verify(afterLocal,tx.signatures[0],payer.publicKey.toBytes()),'Local payer signature invalid');
    assert(same(tx.signatures[1],zero),'F01 slot filled before Phantom');
    const payerSignatureBefore=Uint8Array.from(tx.signatures[0]);
    Object.assign(record,{requiredSigners:signers,phantomSigner:F01,localTestPayer:String(payer.publicKey),blockhash:latest.blockhash,
      lastValidBlockHeight:latest.lastValidBlockHeight,expectedMessageSha256:await sha(before),prePhantom:decoded(message),
      prePhantomWireBase64:b64(Uint8Array.from(tx.serialize())),payerSignatureBeforeBase64:b64(payerSignatureBefore),
      localSigningMessageUnchanged:true,payerSignatureValidBeforePhantom:true,f01SlotEmptyBeforePhantom:true,status:'WAITING_FOR_PHANTOM'});save();show();
    assert(selected()===F01,'F01 selection changed before signing');
    $('status').textContent='Test 1B: if Phantom displays any security warning, click Close. This page cannot broadcast.';
    let returned;
    try{returned=await window.phantom.solana.signTransaction(tx)}catch(error){
      record.status='PHANTOM_REFUSED';record.error=String(error?.message||error);save();show();$('status').textContent='STOP — Phantom refused. No retry or broadcast.';return;
    }
    const raw=Uint8Array.from(returned.serialize());
    record.rawWireBase64=b64(raw);record.returnedAt=new Date().toISOString();record.status='RAW_RETURN_RETAINED';save();
    const signed=W.VersionedTransaction.deserialize(raw),after=Uint8Array.from(signed.message.serialize());
    record.returnedMessageSha256=await sha(after);
    record.postPhantom=decoded(signed.message);
    record.mutations=differences(record.prePhantom,record.postPhantom);
    record.messageUnchanged=same(before,after);
    record.requiredSignersUnchanged=signed.message.staticAccountKeys.slice(0,signed.message.header.numRequiredSignatures).map(String).join('|')===signers.join('|');
    record.blockhashUnchanged=signed.message.recentBlockhash===latest.blockhash;
    record.payerSignaturePreserved=signed.signatures.length===2&&same(signed.signatures[0],payerSignatureBefore);
    record.payerSignatureValid=signed.signatures.length===2&&N.sign.detached.verify(after,signed.signatures[0],payer.publicKey.toBytes());
    record.f01SignatureValid=signed.signatures.length===2&&N.sign.detached.verify(after,signed.signatures[1],key(F01).toBytes());
    record.status=record.messageUnchanged&&record.requiredSignersUnchanged&&record.blockhashUnchanged&&record.payerSignaturePreserved&&record.payerSignatureValid&&record.f01SignatureValid&&record.mutations.length===0?'PASS':'FAIL';save();show();
    $('status').textContent=record.status==='PASS'?'Test 1B PASS. No broadcast.':'STOP — Phantom changed the message or signatures. No retry or broadcast.';
  }catch(error){record.status='PROBE_ERROR';record.error=String(error?.message||error);save();show();$('status').textContent='STOP — Test 1B error. No retry or broadcast.';}
}
function download(){
  const blob=new Blob([JSON.stringify(record,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='hostpay-phantom-partial-signing-test1b.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function init(){
  assert(W&&N&&crypto?.subtle,'Required libraries unavailable');
  const prior=localStorage.getItem(STORE);
  if(prior){record=JSON.parse(prior);started=true;$('status').textContent='Prior Test 1B evidence retained. No retry from this page.';show();return;}
  $('connect').onclick=()=>connect().catch(error=>{$('status').textContent=`Connect stopped: ${String(error?.message||error)}`;});
  $('sign').onclick=()=>test1b();$('download').onclick=download;
  $('status').textContent='Connect F01 to start. No transaction signed or sent.';show();
}
init();

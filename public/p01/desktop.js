/* P01-only Phantom extension signing, local return evidence, and exact-message broadcast gate. */
'use strict';
const W=window.solanaWeb3,N=window.nacl,$=id=>document.getElementById(id);
const PROGRAM='SQDS4ep65T869zMMBKyuUq6aD6EgTu8psMjkvj52pCf';
const CONFIG='BSTq9w3kZwNwpBXJEvTZz2G9ZTNyKBvoSeXMvwb4cNZr';
const TREASURY='5DH2e3cJmFpyi6mk65EGFediunm4ui6BiKNUNrhWtD1b';
const GENESIS='5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
const F01='2g51DvYUJjzddhBLcqSZardaiqpm9oVSYjW6scrS2p2G';
const F02='9k5q4YqCgxTi5FBpV8PAFKprT6tU5HvUP7uvE4g1zYue';
const GOV='AVxBuq3LmqKb9C5FmSLK4dLyKskw3eRZdidRmorVR9fB';
const P01='tL8CVzuMhUBCMScCkBRhPuCGi6B9vt6wWrN3heZwCmZ';
const P02='BffRdcpiDLztBsqEp8KY15m5pmhrK8mXGzTz2mBeLMQe';
const VAULT='83ZqHeirHttsf9EqXX3DJfYkVgzWM1GuBXrwGyPE9Hni';
const DATA='Mt3HXSj1i+kAAgADAAAAGN3dmnqY6HXZ3IFnT72QTSveu7YvtRbfpq52zLNtXP0HgebuEg4G/vFSr2HwIzE1QbU64GqMujQqtNT5UB860dEHjSPYrVfirPlOWjbo790zQEsC3tYhsA3Rsd0rMZa8qGYHAAAAAAAA';
const DATA_SHA256='5772dca2fed60c47ea85e45002744d04331b233ded952e63d3ded8bc60e87a29';
const RPC='https://solana-rpc.publicnode.com',BRIDGE=`${location.origin}/api/p01-rpc`,STORE='hostpay:p01:desktop:evidence:v1';
const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
const key=v=>new W.PublicKey(v),hex=b=>Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const toB64=b=>btoa(String.fromCharCode(...b));
const sha256=async b=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',b)));
const show=(id,on)=>{$(id).hidden=!on;};
const status=s=>{$('status').textContent=s;};
const selected=()=>window.phantom?.solana?.publicKey?.toBase58();
let prepared=null;
function evidence(){try{return JSON.parse(localStorage.getItem(STORE));}catch{return null;}}
function saveEvidence(e){localStorage.setItem(STORE,JSON.stringify(e));assert(evidence()?.wireBase64===e.wireBase64,'Signed wire was not retained locally');}
function stop(message){show('prepare',false);show('sign',false);show('broadcast',false);status(`P01 stopped: ${message}. No automatic retry or broadcast.`);}
function requireF01(){assert(selected()===F01,`Select Treasury - HPAY (F01 ${F01}) in Phantom; selected ${selected()||'none'}`);}
async function read(url){
  const c=new W.Connection(url,'finalized');
  assert(await c.getGenesisHash()===GENESIS,`Wrong genesis at ${url}`);
  const r=await c.getMultipleAccountsInfoAndContext([key(CONFIG),key(P01),key(P02),key(F01),key(F02)],'finalized');
  const [cfg,p01,p02,f01,f02]=r.value;
  assert(cfg&&cfg.owner.equals(key(PROGRAM))&&cfg.data.length===144,`Wrong ProgramConfig at ${url}`);
  assert(hex(cfg.data.slice(0,8))==='c4d25ae790958c3f',`Wrong ProgramConfig discriminator at ${url}`);
  const view=new DataView(cfg.data.buffer,cfg.data.byteOffset,cfg.data.byteLength);
  assert(view.getBigUint64(40,true)===0n,`Squads fee changed at ${url}`);
  assert(key(cfg.data.slice(48,80)).toBase58()===TREASURY,`Squads treasury changed at ${url}`);
  assert(!p01&&!p02,`P01/P02 availability changed at ${url}`);
  const rent=await c.getMinimumBalanceForRentExemption(231,'finalized');
  assert(rent===1823720,`Rent changed at ${url}`);
  assert((f01?.lamports||0)>rent+5000,`F01 balance insufficient at ${url}`);
  return {c,slot:r.context.slot,rent,f01:f01.lamports,f02:f02?.lamports||0};
}
async function preflight(){const [a,b]=await Promise.all([read(RPC),read(BRIDGE)]);assert(a.rent===b.rent&&a.f01===b.f01&&a.f02===b.f02,'Provider preflight disagreement');return a;}
function assertApprovedMessage(m,data){
  assert(m.header.numRequiredSignatures===1&&m.compiledInstructions.length===1&&m.addressTableLookups.length===0,'Unexpected transaction shape');
  assert(m.staticAccountKeys[0].toBase58()===F01,'Wrong fee payer');
  const ix=m.compiledInstructions[0];
  assert(m.staticAccountKeys[ix.programIdIndex].toBase58()===PROGRAM,'Wrong program');
  assert(hex(ix.data)===hex(data),'Instruction data changed');
  const expected=[CONFIG,TREASURY,P01,F01,F01,W.SystemProgram.programId.toBase58()];
  assert(ix.accountKeyIndexes.length===expected.length,'Wrong account count');
  expected.forEach((v,i)=>assert(m.staticAccountKeys[ix.accountKeyIndexes[i]].toBase58()===v,`Wrong account ${i}`));
}
function decoded(m){
  const keys=m.staticAccountKeys.map(k=>k.toBase58());
  return {version:0,feePayer:keys[0],recentBlockhash:m.recentBlockhash,header:m.header,staticAccountKeys:keys,
    addressTableLookups:m.addressTableLookups.map(x=>({accountKey:x.accountKey.toBase58(),writableIndexes:Array.from(x.writableIndexes),readonlyIndexes:Array.from(x.readonlyIndexes)})),
    instructions:m.compiledInstructions.map(ix=>{const data=Uint8Array.from(ix.data);const out={programId:keys[ix.programIdIndex]||`index:${ix.programIdIndex}`,accountKeyIndexes:Array.from(ix.accountKeyIndexes),accounts:Array.from(ix.accountKeyIndexes,i=>keys[i]||`index:${i}`),dataHex:hex(data)};
      if(out.programId===W.ComputeBudgetProgram.programId.toBase58()){
        const v=new DataView(data.buffer,data.byteOffset,data.byteLength);
        if(data[0]===2&&data.length===5)out.computeUnitLimit=v.getUint32(1,true);
        if(data[0]===3&&data.length===9)out.microLamportsPerCU=v.getBigUint64(1,true).toString();
      }
      return out;} )};
}
function renderEvidence(e){
  show('comparison',true);show('download',true);
  $('comparison').textContent=JSON.stringify({
    result:e.exactMessage&&e.approvedShape&&e.signatureValid?'EXACT APPROVED MESSAGE':'MESSAGE CHANGED OR SIGNATURE/SHAPE INVALID — NO BROADCAST',
    expectedMessageSha256:e.expectedMessageSha256,returnedMessageSha256:e.returnedMessageSha256,
    signature:e.signature,signatureValid:e.signatureValid,exactMessage:e.exactMessage,approvedShape:e.approvedShape,
    expected:e.expected,returned:e.returned,validationError:e.validationError||null
  },null,2);
}
function downloadEvidence(){
  const e=evidence();assert(e?.wireBase64,'No retained signed transaction');
  const blob=new Blob([JSON.stringify(e,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='hostpay-p01-desktop-signed-evidence.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function connect(){
  assert(!evidence(),'A returned P01 transaction is already retained in this browser; inspect it before any new attempt');
  const p=window.phantom?.solana;assert(p?.isPhantom,'Phantom desktop extension not detected in this browser');
  const r=await p.connect();assert(r.publicKey?.toBase58()===F01,`Wrong Phantom account: ${r.publicKey?.toBase58()||'none'}`);
  requireF01();show('prepare',true);status(`F01 connected: ${F01}. No transaction prepared or sent.`);
}
async function prepare(){
  assert(!evidence(),'Prior P01 return remains retained');requireF01();show('prepare',false);
  status('Checking two finalized mainnet providers and the exact approved P01 instruction. Nothing signed or sent.');
  const a=await preflight(),data=b64(DATA);assert(await sha256(data)===DATA_SHA256,'Approved instruction hash changed');
  const ix=new W.TransactionInstruction({programId:key(PROGRAM),keys:[
    {pubkey:key(CONFIG),isSigner:false,isWritable:false},{pubkey:key(TREASURY),isSigner:false,isWritable:true},
    {pubkey:key(P01),isSigner:false,isWritable:true},{pubkey:key(F01),isSigner:true,isWritable:false},
    {pubkey:key(F01),isSigner:true,isWritable:true},{pubkey:W.SystemProgram.programId,isSigner:false,isWritable:false}],data});
  const latest=await a.c.getLatestBlockhash('finalized');
  const message=new W.TransactionMessage({payerKey:key(F01),recentBlockhash:latest.blockhash,instructions:[ix]}).compileToV0Message();
  assertApprovedMessage(message,data);
  const fee=await a.c.getFeeForMessage(message,'finalized');assert(fee.value===5000,`Network fee changed: ${fee.value}`);
  prepared={message,blockhash:latest.blockhash,lastValidBlockHeight:latest.lastValidBlockHeight,slot:a.slot,rent:a.rent};
  show('sign',true);status(`F01 selected. P01 checks passed at finalized slot ${a.slot}. One approved Squads instruction; threshold 2/3; timelock 0. Cost quote: ${a.rent} rent + ${fee.value} network + 0 Squads fee lamports. Signing does not broadcast.`);
}
async function sign(){
  assert(prepared&&!evidence(),'No fresh approved P01 transaction');requireF01();
  const p=window.phantom.solana;show('sign',false);
  const original=prepared.message,tx=new W.VersionedTransaction(original);
  const expectedBytes=original.serialize(),expectedHash=await sha256(expectedBytes);
  status('Waiting for Phantom signature. No transaction will be broadcast automatically.');
  let returned;try{returned=await p.signTransaction(tx);}catch(e){stop(`Phantom signing did not return a transaction: ${e?.message||String(e)}`);return;}
  // Retain the exact returned wire before parsing, comparing, or exposing any send path.
  const raw=Uint8Array.from(returned.serialize());
  const e={v:1,capturedAt:new Date().toISOString(),wireBase64:toB64(raw),expectedMessageBase64:toB64(expectedBytes),
    expectedMessageSha256:expectedHash,approvedInstructionSha256:DATA_SHA256,preparedBlockhash:prepared.blockhash,
    lastValidBlockHeight:prepared.lastValidBlockHeight,preflightFinalizedSlot:prepared.slot,
    exactMessage:false,approvedShape:false,signatureValid:false,sendAttempted:false};
  saveEvidence(e);
  try{
    const signed=W.VersionedTransaction.deserialize(raw),msg=signed.message.serialize();
    e.returnedMessageSha256=await sha256(msg);e.exactMessage=hex(msg)===hex(expectedBytes);
    e.expected=decoded(original);e.returned=decoded(signed.message);
    e.signature=signed.signatures.length===1?base58(signed.signatures[0]):null;
    e.signatureValid=signed.signatures.length===1&&signed.signatures[0].length===64&&N.sign.detached.verify(msg,signed.signatures[0],key(F01).toBytes());
    try{assertApprovedMessage(signed.message,b64(DATA));e.approvedShape=true;}catch(x){e.validationError=x.message;}
  }catch(x){e.validationError=`Returned wire decoding failed: ${x?.message||String(x)}`;}
  saveEvidence(e);renderEvidence(e);prepared=null;
  if(e.exactMessage&&e.approvedShape&&e.signatureValid){show('broadcast',true);status(`F01 signed the exact approved P01 message. Signature recorded locally. NOT SENT. Review the comparison before the separate one-time broadcast action.`);}
  else stop('Phantom returned a changed or invalid P01 transaction; exact wire and decoded comparison retained locally');
}
async function broadcast(){
  const e=evidence();assert(e?.wireBase64&&!e.sendAttempted,'No eligible signed P01 or send already attempted');
  assert(e.exactMessage&&e.approvedShape&&e.signatureValid,'Changed or invalid transaction cannot be broadcast');
  requireF01();show('broadcast',false);
  const tx=W.VersionedTransaction.deserialize(b64(e.wireBase64)),msg=tx.message.serialize();
  assert(hex(msg)===hex(b64(e.expectedMessageBase64)),'Retained signed message changed');
  assert(await sha256(msg)===e.expectedMessageSha256,'Retained message hash changed');
  assertApprovedMessage(tx.message,b64(DATA));
  assert(N.sign.detached.verify(msg,tx.signatures[0],key(F01).toBytes()),'Retained F01 signature invalid');
  const c=new W.Connection(RPC,'finalized');
  // Base58 signature is derived from the actual signed wire; never from displayed text.
  const sig58=base58(tx.signatures[0]);
  const existing=await c.getSignatureStatuses([sig58],{searchTransactionHistory:true});
  assert(existing.value[0]===null,'Signature already has network status');
  assert(await c.getBlockHeight('confirmed')<=e.lastValidBlockHeight,'Signed blockhash expired; no broadcast');
  await preflight();
  e.sendAttempted=true;e.sendAttemptedAt=new Date().toISOString();e.signatureBase58=sig58;saveEvidence(e);
  status(`Submitting exact signed P01 once. Signature ${sig58}. No retry.`);
  try{const returned=await c.sendRawTransaction(tx.serialize(),{skipPreflight:false,maxRetries:0,preflightCommitment:'confirmed'});
    assert(returned===sig58,'RPC returned a different signature; outcome unknown');
    e.rpcReturnedSignature=returned;saveEvidence(e);status(`P01 submitted once. Signature ${sig58}. Await independent finalized on-chain verification. No retry.`);
  }catch(x){e.sendError=String(x?.message||x);saveEvidence(e);status(`P01 send outcome UNKNOWN: ${e.sendError}. Signature ${sig58}. Do not retry; verify on-chain.`);}
}
function base58(bytes){const alphabet='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';let n=0n;for(const x of bytes)n=n*256n+BigInt(x);let s='';while(n){s=alphabet[Number(n%58n)]+s;n/=58n;}for(const x of bytes){if(x)break;s='1'+s;}return s;}
function init(){
  assert(W&&N&&crypto?.subtle,'Required local browser libraries unavailable');
  $('details').textContent=`Program: ${PROGRAM}\nMembers: ${F01}, ${F02}, ${GOV}\nThreshold: 2 of 3; timelock: 0 seconds\nCreator / createKey / payer / signer: ${F01}\nNew multisig: ${P01}\nVault index 0: ${VAULT}\nConfig authority: null; rent collector: null\nCreation instruction SHA256: ${DATA_SHA256}`;
  const p=window.phantom?.solana;
  if(p?.isPhantom)p.on('accountChanged',()=>{prepared=null;show('prepare',false);show('sign',false);show('broadcast',false);status(`Phantom account changed. Selected: ${selected()||'none'}. Any prepared P01 was discarded; no automatic retry.`);});
  $('connect').onclick=()=>connect().catch(x=>stop(x.message));
  $('prepare').onclick=()=>prepare().catch(x=>stop(x.message));
  $('sign').onclick=()=>sign().catch(x=>stop(x.message));
  $('broadcast').onclick=()=>broadcast().catch(x=>stop(x.message));
  $('download').onclick=()=>{try{downloadEvidence();}catch(x){stop(x.message);}};
  const e=evidence();if(e?.wireBase64){renderEvidence(e);$('connect').disabled=true;
    if(e.exactMessage&&e.approvedShape&&e.signatureValid&&!e.sendAttempted)show('broadcast',true);
    status(`Previous P01 signed-return evidence retained in this browser. ${e.sendAttempted?'A send was attempted; check its signature on-chain.':'No send attempted by this page.'} No retry offered.`);return;}
  if(!p?.isPhantom){$('connect').disabled=true;status('Phantom desktop extension not detected. Open this page in the browser where your existing Phantom extension is installed.');return;}
  status('Phantom desktop extension detected. Connect F01 first. No transaction has been signed or sent by this page.');
}
init();

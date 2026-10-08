/* P01-only Safari/Chrome -> Phantom universal-link signing flow. */
'use strict';
const W = window.solanaWeb3, N = window.nacl, $ = id => document.getElementById(id);
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
const BASE='https://www.hostpayapp.com/p01', RPC='https://solana-rpc.publicnode.com';
const BRIDGE='https://www.hostpayapp.com/api/p01-rpc', STORE='hostpay:p01:deeplink:v1';
const ALPHABET='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const assert=(ok,msg)=>{if(!ok)throw new Error(msg);};
const key=v=>new W.PublicKey(v), hex=b=>Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const sha256=async b=>hex(new Uint8Array(await crypto.subtle.digest('SHA-256',b)));
function enc(bytes){let n=0n;for(const x of bytes)n=n*256n+BigInt(x);let s='';while(n){s=ALPHABET[Number(n%58n)]+s;n/=58n;}for(const x of bytes){if(x)break;s='1'+s;}return s;}
function dec(s){assert(typeof s==='string'&&s.length>0,'Missing base58 value');let n=0n;for(const c of s){const i=ALPHABET.indexOf(c);assert(i>=0,'Invalid base58 value');n=n*58n+BigInt(i);}const out=[];while(n){out.push(Number(n&255n));n>>=8n;}out.reverse();for(const c of s){if(c!=='1')break;out.unshift(0);}return Uint8Array.from(out);}
function save(s){localStorage.setItem(STORE,JSON.stringify(s));}
function clear(){localStorage.removeItem(STORE);}
function load(){let s;try{s=JSON.parse(localStorage.getItem(STORE));}catch{clear();return null;}if(!s||s.v!==1||Date.now()-s.at>1200000||s.at>Date.now()+60000){clear();return null;}return s;}
function status(s){$('status').textContent=s;}
function show(id,on){$(id).hidden=!on;}
function hideActions(){for(const id of ['connect-link','prepare','sign-link','broadcast'])show(id,false);}
function fail(e){hideActions();status(`P01 stopped: ${e?.message||String(e)}. No automatic retry. If Phantom signed, check the retained signature before any new attempt.`);}
function url(method,params){return `https://phantom.com/ul/v1/${method}?${new URLSearchParams(params)}`;}
function callback(flow,state){return `${BASE}?flow=${flow}&state=${encodeURIComponent(state)}`;}
function decrypt(data,nonce,shared){const bytes=N.box.open.after(dec(data),dec(nonce),dec(shared));assert(bytes,'Phantom response decryption failed');return JSON.parse(new TextDecoder().decode(bytes));}
function encrypt(body,shared){const nonce=N.randomBytes(24),payload=N.box.after(new TextEncoder().encode(JSON.stringify(body)),nonce,dec(shared));return {nonce:enc(nonce),payload:enc(payload)};}

async function read(url){
  const c=new W.Connection(url,'finalized');
  assert(await c.getGenesisHash()===GENESIS,`Wrong genesis at ${url}`);
  const r=await c.getMultipleAccountsInfoAndContext([key(CONFIG),key(P01),key(P02),key(F01),key(F02)],'finalized');
  const [cfg,p01,p02,f01,f02]=r.value;
  assert(cfg&&cfg.owner.equals(key(PROGRAM))&&cfg.data.length===144,`Wrong ProgramConfig at ${url}`);
  assert(hex(cfg.data.slice(0,8))==='c4d25ae790958c3f',`Wrong ProgramConfig discriminator at ${url}`);
  const view=new DataView(cfg.data.buffer,cfg.data.byteOffset,cfg.data.byteLength);
  assert(view.getBigUint64(40,true)===0n,`Squads fee changed at ${url}`);
  assert(key(cfg.data.slice(48,80)).toBase58()===TREASURY,`Treasury changed at ${url}`);
  assert(!p01&&!p02,`P01/P02 availability changed at ${url}`);
  const rent=await c.getMinimumBalanceForRentExemption(231,'finalized');
  assert(rent===1823720,`Rent changed at ${url}`);
  assert((f01?.lamports||0)>rent+5000,`F01 balance insufficient at ${url}`);
  return {c,slot:r.context.slot,rent,f01:f01.lamports,f02:f02?.lamports||0};
}
async function preflight(){const [a,b]=await Promise.all([read(RPC),read(BRIDGE)]);assert(a.rent===b.rent&&a.f01===b.f01&&a.f02===b.f02,'Provider preflight disagreement');return a;}
function assertMessage(m,data){
  assert(m.header.numRequiredSignatures===1&&m.compiledInstructions.length===1&&m.addressTableLookups.length===0,'Unexpected transaction shape');
  assert(m.staticAccountKeys[0].toBase58()===F01,'Wrong fee payer');
  const ix=m.compiledInstructions[0];
  assert(m.staticAccountKeys[ix.programIdIndex].toBase58()===PROGRAM,'Wrong program');
  assert(hex(ix.data)===hex(data),'Instruction data changed');
  const expected=[CONFIG,TREASURY,P01,F01,F01,W.SystemProgram.programId.toBase58()];
  assert(ix.accountKeyIndexes.length===expected.length,'Wrong account count');
  expected.forEach((v,i)=>assert(m.staticAccountKeys[ix.accountKeyIndexes[i]].toBase58()===v,`Wrong account ${i}`));
}
function prepareConnect(){
  assert(W&&N,'Required local libraries did not load');
  const pair=N.box.keyPair(),state=enc(N.randomBytes(18)),pub=enc(pair.publicKey);
  save({v:1,at:Date.now(),phase:'await-connect',state,pub,secret:enc(pair.secretKey)});
  $('connect-link').href=url('connect',{app_url:'https://www.hostpayapp.com',dapp_encryption_public_key:pub,redirect_link:callback('connect',state),cluster:'mainnet-beta'});
  hideActions();show('connect-link',true);
  status('Select F01 in Phantom, then tap “Open Phantom to connect F01”. No transaction is prepared or sent.');
}
async function prepareSign(){
  const s=load();assert(s?.phase==='connected'&&s.wallet===F01,'Connect F01 first');
  status('Checking both finalized mainnet providers and the exact P01 instruction. Nothing sent.');
  const a=await preflight(),data=b64(DATA);
  assert(await sha256(data)===DATA_SHA256,'Approved instruction hash changed');
  const ix=new W.TransactionInstruction({programId:key(PROGRAM),keys:[
    {pubkey:key(CONFIG),isSigner:false,isWritable:false},
    {pubkey:key(TREASURY),isSigner:false,isWritable:true},
    {pubkey:key(P01),isSigner:false,isWritable:true},
    {pubkey:key(F01),isSigner:true,isWritable:false},
    {pubkey:key(F01),isSigner:true,isWritable:true},
    {pubkey:W.SystemProgram.programId,isSigner:false,isWritable:false}],data});
  const latest=await a.c.getLatestBlockhash('finalized');
  const message=new W.TransactionMessage({payerKey:key(F01),recentBlockhash:latest.blockhash,instructions:[ix]}).compileToV0Message();
  assertMessage(message,data);
  const fee=await a.c.getFeeForMessage(message,'finalized');assert(fee.value===5000,`Network fee changed: ${fee.value}`);
  const tx=new W.VersionedTransaction(message);
  const encrypted=encrypt({transaction:enc(tx.serialize()),session:s.session},s.shared);
  $('sign-link').href=url('signTransaction',{dapp_encryption_public_key:s.pub,nonce:encrypted.nonce,redirect_link:callback('sign',s.state),payload:encrypted.payload});
  s.phase='await-sign';s.expected=enc(message.serialize());s.blockhash=latest.blockhash;s.lastValidBlockHeight=latest.lastValidBlockHeight;save(s);
  hideActions();show('sign-link',true);
  status(`P01 checks passed at finalized slot ${a.slot}.\nMembers: F01, F02, HPAY Governance; threshold 2/3; timelock 0.\nCreator/createKey/payer F01; multisig ${P01}; Vault ${VAULT}.\nInstruction SHA256 ${DATA_SHA256}.\nCost: ${a.rent} rent + ${fee.value} network + 0 Squads fee lamports.\nTap “Open Phantom to sign P01”. Phantom returns the signed transaction here; it does not broadcast it.`);
}
function verifySigned(s,payload){
  assert(typeof payload?.transaction==='string','No signed transaction returned');
  const tx=W.VersionedTransaction.deserialize(dec(payload.transaction));
  const msg=tx.message.serialize();
  assert(enc(msg)===s.expected,'Phantom returned a different transaction message');
  assertMessage(tx.message,b64(DATA));
  assert(tx.signatures.length===1&&tx.signatures[0].length===64,'Wrong signature count');
  assert(N.sign.detached.verify(msg,tx.signatures[0],key(F01).toBytes()),'F01 signature failed verification');
  return {wire:enc(tx.serialize()),signature:enc(tx.signatures[0])};
}
async function onReturn(){
  const parsed=new URL(location.href),flow=parsed.searchParams.get('flow');if(!flow)return false;
  const params=new URLSearchParams(parsed.search);history.replaceState(null,'',BASE);
  const s=load();assert(s&&params.get('state')===s.state,'Unknown or expired Phantom callback');
  if(params.get('errorCode')){clear();throw new Error(`Phantom declined ${flow}: ${params.get('errorCode')} ${params.get('errorMessage')||''}`);}
  if(flow==='connect'){
    assert(s.phase==='await-connect','Unexpected connection return');
    const phantomPub=dec(params.get('phantom_encryption_public_key'));assert(phantomPub.length===32,'Invalid Phantom encryption key');
    const shared=N.box.before(phantomPub,dec(s.secret));
    const result=decrypt(params.get('data'),params.get('nonce'),enc(shared));
    assert(result.public_key===F01&&typeof result.session==='string',`Wrong Phantom wallet; expected F01 ${F01}`);
    s.phase='connected';s.wallet=F01;s.shared=enc(shared);s.session=result.session;delete s.secret;save(s);
    hideActions();show('prepare',true);
    status(`F01 connected: ${F01}. Tap “Prepare exact P01 transaction” to run fresh checks. Nothing signed or sent.`);
  }else if(flow==='sign'){
    assert(s.phase==='await-sign','Unexpected signing return');
    const result=decrypt(params.get('data'),params.get('nonce'),s.shared),signed=verifySigned(s,result);
    s.phase='signed';s.wire=signed.wire;s.signature=signed.signature;delete s.session;delete s.shared;save(s);
    $('connect').disabled=true;
    hideActions();show('broadcast',true);
    status(`F01 signed the exact P01 message. Signature: ${s.signature}.\nNOT SENT. Tap “Broadcast signed P01 once” to submit before its blockhash expires. No automatic retry.`);
  }else throw new Error('Unexpected callback type');
  return true;
}
async function broadcast(){
  const s=load();assert(s?.phase==='signed'&&s.wire&&s.signature,'No verified signed P01 available');
  const tx=W.VersionedTransaction.deserialize(dec(s.wire)),msg=tx.message.serialize();
  assert(enc(msg)===s.expected,'Saved message changed');assertMessage(tx.message,b64(DATA));
  assert(N.sign.detached.verify(msg,tx.signatures[0],key(F01).toBytes()),'Saved F01 signature invalid');
  const c=new W.Connection(RPC,'finalized');
  const existing=await c.getSignatureStatuses([s.signature],{searchTransactionHistory:true});
  assert(existing.value[0]===null,`Signature already has network status: ${JSON.stringify(existing.value[0])}`);
  assert(await c.getBlockHeight('confirmed')<=s.lastValidBlockHeight,'Signed blockhash expired; do not broadcast or retry this wire');
  await preflight();
  s.phase='send-attempted';save(s);hideActions(); // Set guard before network send.
  status(`Submitting one signed P01 wire. Signature: ${s.signature}. Do not retry.`);
  let returned;
  try{returned=await c.sendRawTransaction(tx.serialize(),{skipPreflight:false,maxRetries:0,preflightCommitment:'confirmed'});}
  catch(e){status(`P01 send outcome UNKNOWN: ${e?.message||String(e)}. Signature: ${s.signature}. Do not retry; check this signature on-chain.`);return;}
  assert(returned===s.signature,'RPC returned different signature; status UNKNOWN');
  status(`P01 submitted. Signature: ${s.signature}. Waiting for finalization. Do not retry.`);
  try{
    const confirmation=await c.confirmTransaction({signature:s.signature,blockhash:s.blockhash,lastValidBlockHeight:s.lastValidBlockHeight},'finalized');
    assert(!confirmation.value.err,`On-chain error: ${JSON.stringify(confirmation.value.err)}`);
    s.phase='finalized';save(s);
    status(`P01 finalized. Signature: ${s.signature}. Send this signature to HOSTPAY for independent account verification. Do not proceed to P02 here.`);
  }catch(e){status(`P01 status UNKNOWN after send: ${e?.message||String(e)}. Signature: ${s.signature}. Do not retry; verify independently.`);}
}
async function init(){
  assert(W&&N&&crypto?.subtle,'Required browser cryptography or local libraries unavailable');
  $('details').textContent=`Program: ${PROGRAM}\nMembers: ${F01}, ${F02}, ${GOV}\nThreshold: 2 of 3; timelock: 0 seconds\nCreator / createKey / payer / signer: ${F01}\nNew multisig: ${P01}\nVault index 0: ${VAULT}\nConfig authority: null; rent collector: null\nCreation instruction SHA256: ${DATA_SHA256}\nExpected cost: 0.00182372 SOL rent + 0.000005 SOL network fee + 0 Squads fee`;
  hideActions();
  $('connect').addEventListener('click',()=>{try{prepareConnect();}catch(e){fail(e);}});
  $('prepare').addEventListener('click',()=>{show('prepare',false);prepareSign().catch(fail);});
  $('broadcast').addEventListener('click',()=>{show('broadcast',false);broadcast().catch(fail);});
  if(await onReturn())return;
  const s=load();
  if(s?.phase==='signed'){show('broadcast',true);status(`Signed P01 retained locally. Signature: ${s.signature}. No broadcast by this page yet.`);}
  else if(s?.phase==='send-attempted')status(`Prior P01 send outcome requires status check. Signature: ${s.signature}. No retry offered.`);
  else if(s?.phase==='finalized')status(`P01 previously finalized. Signature: ${s.signature}. Independent account verification required.`);
  else if(s?.phase==='connected'){show('prepare',true);status('F01 connected. Tap “Prepare exact P01 transaction” for fresh checks.');}
  else if(s?.phase==='await-connect'||s?.phase==='await-sign')status('Phantom handoff pending. Return from Phantom; do not start a new attempt until you know nothing was sent.');
  else status('Waiting. Use Safari/Chrome on the phone, outside Phantom. No transaction has been sent.');
  if(['signed','send-attempted','finalized'].includes(s?.phase))$('connect').disabled=true;
}
init().catch(fail);

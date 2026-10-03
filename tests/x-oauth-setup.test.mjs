import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { request as httpRequest } from 'node:http';
import { lstat, readFile, rmdir } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CALLBACK, SCOPES, HOSTS, consent, callbackCode, exchange, startSetup } from '../scripts/x-oauth-setup-core.mjs';
import { ROOT, PRIVATE_DIR, BUNDLE_PATH, prepareHandoff, readBundle, cleanupHandoff, transferBundle, vercelArgs } from '../scripts/x-oauth-operator.mjs';
import { main } from '../scripts/x-oauth-setup.mjs';
const credential='fixture-client-secret',access='fixture-access',refresh='fixture-refresh';
const clientId='fixture-client';
const token=(changes={})=>({access_token:access,refresh_token:refresh,expires_in:7200,token_type:'bearer',scope:SCOPES,...changes});
const identity=(changes={})=>({data:{username:'HOSTPAY_SOL',id:'100',...changes}});
function transport({tokens=token(),user=identity(),status=200,throws=false}={}) {
  const calls=[];
  return {calls,fetchImpl:async(url,options)=>{
    calls.push({url,options});
    if(throws)throw Error(credential+' '+access+' '+refresh);
    if(url==='https://api.x.com/2/oauth2/token')return Response.json(tokens,{status});
    assert.equal(url,'https://api.x.com/2/users/me');return Response.json(user);
  }};
}
const exchangeInput = t=>({code:'fixture-code',verifier:consent(clientId).verifier,clientId,clientSecret:credential,fetchImpl:t.fetchImpl,now:()=>1000000});
const callback=(state,code='fixture-code')=>'/callback?'+new URLSearchParams({state,code});
const local=(host,path,hostHeader='localhost:8080',method='GET')=>new Promise((resolve,reject)=>{
  const req=httpRequest({hostname:host,port:8080,path,method,headers:{host:hostHeader},agent:false},res=>{
    let body='';res.on('data',b=>body+=b);res.on('end',()=>resolve({status:res.statusCode,body,headers:res.headers}));
  });req.on('error',reject);req.end();
});

test('exact officially documented callback, S256 formation, fresh high-entropy state, minimal scopes',()=>{
  assert.equal(CALLBACK,'http://localhost:8080/callback');const a=consent(clientId),b=consent(clientId),u=new URL(a.url);
  assert.equal(u.origin+u.pathname,'https://x.com/i/oauth2/authorize');
  assert.equal(u.searchParams.get('redirect_uri'),CALLBACK);assert.equal(u.searchParams.get('scope'),SCOPES);
  assert.equal(u.searchParams.get('code_challenge_method'),'S256');assert.equal(u.searchParams.get('response_type'),'code');
  assert.match(a.verifier,/^[A-Za-z0-9_-]{43,128}$/);assert.match(a.state,/^[A-Za-z0-9_-]{43}$/);
  assert.equal(u.searchParams.get('code_challenge'),createHash('sha256').update(a.verifier).digest('base64url'));
  assert.notEqual(a.state,b.state);assert.notEqual(a.verifier,b.verifier);assert.equal(u.searchParams.has('code_verifier'),false);
});
test('matching state succeeds and duplicate/mismatched/missing state rejects',()=>{
  const {state}=consent(clientId);assert.equal(callbackCode(callback(state),state),'fixture-code');
  for(const path of [callback('wrong'),'/callback?code=fixture','/callback?state='+state+'&state='+state+'&code=fixture'])assert.throws(()=>callbackCode(path,state),/STATE_MISMATCH/);
});
test('authorization denial, missing code, duplicate code and wrong callback rejected',()=>{
  const {state}=consent(clientId);
  assert.throws(()=>callbackCode('/callback?state='+state+'&error=access_denied',state),/AUTHORIZATION_DENIED/);
  for(const path of ['/callback?state='+state,callback(state)+'&code=second'])assert.throws(()=>callbackCode(path,state),/MISSING_CODE/);
  assert.throws(()=>callbackCode('https://attacker.invalid/callback?state='+state,state),/INVALID_CALLBACK/);
});
test('confidential code exchange verifies identity, expiry and exact redirect; never retries or logs secrets',async()=>{
  const t=transport(),logs=[];const input=exchangeInput(t);
  const bundle=await exchange({...input,log:s=>logs.push(s)});
  assert.equal(bundle.X_ACCESS_TOKEN,access);assert.equal(bundle.X_REFRESH_TOKEN,refresh);assert.equal(bundle.X_ACCOUNT_ID,'100');
  assert.equal(bundle.X_ACCESS_TOKEN_EXPIRES_AT,new Date(1000000+7200000).toISOString());
  assert.equal(t.calls.length,2);const opts=t.calls[0].options;
  assert.equal(opts.headers.authorization,'Basic '+Buffer.from(clientId+':'+credential).toString('base64'));
  assert.equal(opts.body.get('code_verifier'),input.verifier);assert.equal(opts.body.get('redirect_uri'),CALLBACK);
  assert.equal(opts.body.get('grant_type'),'authorization_code');assert.equal(opts.redirect,'error');
  for(const secret of [credential,access,refresh,input.code,input.verifier])assert.equal(logs.join('\n').includes(secret),false);
});
for(const status of [400,401,429,500])test('token HTTP '+status+' sanitized and not retried',async()=>{
  const t=transport({status});await assert.rejects(exchange(exchangeInput(t)),/^Error: TOKEN_EXCHANGE_FAILED$/);assert.equal(t.calls.length,1);
});
test('transport errors never escape raw secrets',async()=>{
  const t=transport({throws:true});await assert.rejects(exchange(exchangeInput(t)),/^Error: TOKEN_EXCHANGE_FAILED$/);
});
for(const [name,change] of [
  ['missing refresh',{refresh_token:undefined}],['empty access',{access_token:''}],['missing expiry',{expires_in:undefined}],
  ['negative expiry',{expires_in:-1}],['string expiry',{expires_in:'7200'}],['huge expiry',{expires_in:1e12}],
  ['wrong type',{token_type:'mac'}],['missing scopes',{scope:undefined}],['extra scopes',{scope:SCOPES+' dm.read'}],
])test('malformed/incomplete token: '+name,async()=>{
  const t=transport({tokens:token(change)});await assert.rejects(exchange(exchangeInput(t)));assert.equal(t.calls.length,1);
});
for(const [name,user] of [
  ['wrong username',identity({username:'HOSTPAY_SOL_fake'})],['wrong case',identity({username:'hostpay_sol'})],
  ['missing numeric ID',identity({id:undefined})],['non-numeric ID',identity({id:'bad'})],['number ID',identity({id:100})],
])test('identity fails closed: '+name,async()=>{
  const t=transport({user});await assert.rejects(exchange(exchangeInput(t)));assert.equal(t.calls.length,2);
});
test('non-loopback addresses rejected before listen or network',async()=>{
  await assert.rejects(startSetup({clientId,clientSecret:credential,hosts:['0.0.0.0'],handoff:()=>{},fetchImpl:()=>assert.fail()}),/NON_LOOPBACK/);
});
test('real fixed loopback listeners, wrong Host/path/method, success, secret-free browser and shutdown',async()=>{
  const t=transport(),logs=[];let bundle;
  const session=await startSetup({clientId,clientSecret:credential,fetchImpl:t.fetchImpl,log:s=>logs.push(s),handoff:b=>{bundle=b;}});
  try {
    assert.deepEqual(session.addresses.map(a=>a.address),HOSTS);assert.ok(session.addresses.every(a=>a.port===8080));
    assert.equal((await local('127.0.0.1','/favicon.ico')).status,404);
    assert.equal((await local('::1','/callback','attacker.invalid:8080')).status,403);
    assert.equal((await local('127.0.0.1','/callback','localhost:8080','POST')).status,405);
    const auth=new URL(logs.find(s=>s.startsWith('https://x.com/')));
    const r=await local('::1',callback(auth.searchParams.get('state')));
    assert.equal(r.status,200);assert.equal(r.headers['cache-control'],'no-store');assert.equal(r.headers['referrer-policy'],'no-referrer');
    const result=await session.done;assert.equal(result.ok,true);assert.equal(bundle.X_ACCOUNT_ID,'100');
    for(const secret of [credential,access,refresh,'fixture-code'])assert.equal((logs.join('\n')+r.body+JSON.stringify(result)).includes(secret),false);
    await assert.rejects(local('127.0.0.1','/callback'));
  } finally {await session.cancel();}
});
test('state mismatch closes session, prevents token exchange/handoff',async()=>{
  const session=await startSetup({clientId,clientSecret:credential,handoff:()=>assert.fail(),fetchImpl:()=>assert.fail()});
  try {assert.equal((await local('127.0.0.1',callback('wrong'))).status,400);assert.equal((await session.done).reason,'STATE_MISMATCH');}
  finally {await session.cancel();}
});
test('authorization denial closes session without network',async()=>{
  const logs=[];const session=await startSetup({clientId,clientSecret:credential,handoff:()=>assert.fail(),fetchImpl:()=>assert.fail(),log:s=>logs.push(s)});
  try {const state=new URL(logs.at(-1)).searchParams.get('state');await local('127.0.0.1','/callback?state='+state+'&error=access_denied');assert.equal((await session.done).reason,'AUTHORIZATION_DENIED');}
  finally {await session.cancel();}
});
test('wrong real callback identity creates no handoff and stops the listener',async()=>{
  const t=transport({user:identity({username:'another_account'})}),logs=[];
  const session=await startSetup({clientId,clientSecret:credential,fetchImpl:t.fetchImpl,log:s=>logs.push(s),handoff:()=>assert.fail('must not save wrong account')});
  try {const state=new URL(logs.at(-1)).searchParams.get('state');const r=await local('127.0.0.1',callback(state));
    assert.equal(r.status,400);assert.equal((await session.done).reason,'WRONG_ACCOUNT');assert.equal(r.body.includes(access),false);
  }finally{await session.cancel();}
});
test('callback replay/overlap exchanges only once',async()=>{
  const t=transport(),logs=[];let release;
  const wait=new Promise(r=>{release=r;});let arrived;
  const started=new Promise(r=>{arrived=r;});
  const fetchImpl=async(...args)=>{if(args[0].endsWith('/token')){arrived();await wait;}return t.fetchImpl(...args);};
  const session=await startSetup({clientId,clientSecret:credential,handoff:()=>{},fetchImpl,log:s=>logs.push(s)});
  try {const path=callback(new URL(logs.at(-1)).searchParams.get('state'));const first=local('127.0.0.1',path);await started;
    assert.equal((await local('::1',path)).status,409);release();assert.equal((await first).status,200);await session.done;assert.equal(t.calls.length,2);
  }finally{release();await session.cancel();}
});
test('timeout closes local server and never calls X',async()=>{
  const session=await startSetup({clientId,clientSecret:credential,handoff:()=>assert.fail(),fetchImpl:()=>assert.fail(),timeoutMs:25});
  assert.equal((await session.done).reason,'SETUP_TIMEOUT');await assert.rejects(local('127.0.0.1','/callback'));
});
test('private file is Git-ignored, permissions applied, exclusive, readable only through handoff and cleanable',async()=>{
  // Refuse to touch any operator's pre-existing directory or real credential file.
  await assert.rejects(lstat(PRIVATE_DIR),e=>e.code==='ENOENT');
  const t=transport(),bundle=await exchange({...exchangeInput(t),now:Date.now});
  try {
    const save=await prepareHandoff();await save(bundle);
    assert.equal(execFileSync('git',['-c','safe.directory='+ROOT,'-C',ROOT,'check-ignore',BUNDLE_PATH],{encoding:'utf8'}).trim().length>0,true);
    assert.deepEqual(await readBundle(),bundle);await assert.rejects(save(bundle),e=>e.code==='EEXIST');
    await assert.rejects(prepareHandoff(),/PRIVATE_HANDOFF_NOT_READY/);
    await assert.rejects(cleanupHandoff(false),/DURABLE_CONFIRMATION_REQUIRED/);
  } finally {await cleanupHandoff(true);await rmdir(PRIVATE_DIR);}
});
test('Vercel handoff is allowlisted Production stdin, no activation flags or secrets in argv/logs',async()=>{
  const t=transport(),bundle=await exchange({...exchangeInput(t),now:Date.now});const sends=[],logs=[];
  await transferBundle({bundle,clientId,fetchImpl:t.fetchImpl,log:s=>logs.push(s),send:async(args,value)=>{sends.push({args,value});return true;}});
  assert.deepEqual(sends.map(s=>s.args[2]),['X_ACCESS_TOKEN','X_REFRESH_TOKEN','X_ACCESS_TOKEN_EXPIRES_AT','X_ACCOUNT_ID']);
  for(const {args} of sends){assert.ok(args.includes('production'));assert.ok(args.includes('prj_TJyywsnyIBE4D1xKY2I8Jx2kOQ9n'));assert.equal(args.includes('--force'),false);}
  assert.equal(sends[0].value,access);
  for(const secret of [credential,access,refresh])assert.equal(JSON.stringify({args:sends.map(x=>x.args),logs}).includes(secret),false);
  for(const name of ['X_ROBO_ENABLED','X_AI_APPROVAL_CONFIRMED','X_DATABASE_URL','OPENAI_API_KEY','TELEGRAM_BOT_TOKEN'])assert.throws(()=>vercelArgs(name));
});
test('Vercel handoff stops on failure and refuses stale/wrong-app/wrong-account bundles',async()=>{
  const t=transport(),bundle=await exchange({...exchangeInput(t),now:Date.now});let sends=0;
  await assert.rejects(transferBundle({bundle,clientId,fetchImpl:t.fetchImpl,send:async()=>{sends++;return false;}}),/HANDOFF_INCOMPLETE/);assert.equal(sends,1);
  for(const b of [{...bundle,X_ACCESS_TOKEN_EXPIRES_AT:'2020-01-01'}, {...bundle,username:'wrong'}, {...bundle,clientIdHash:'wrong'}]) {
    await assert.rejects(transferBundle({bundle:b,clientId,fetchImpl:()=>assert.fail(),send:()=>assert.fail()}),/HANDOFF_VALIDATION_FAILED/);
  }
});
test('CLI default is inert, missing credentials sanitized and activation impossible',async()=>{
  const logs=[];assert.equal(await main([],{},s=>logs.push(s)),0);assert.match(logs.join('\n'),/http:\/\/localhost:8080\/callback/);
  assert.equal(await main(['authorize'],{},s=>logs.push(s)),1);
  const cli=fileURLToPath(new URL('../scripts/x-oauth-setup.mjs',import.meta.url));
  const run=spawnSync(process.execPath,[cli,'not-a-command','fixture-secret'],{encoding:'utf8'});
  assert.equal(run.status,1);assert.equal((run.stdout+run.stderr).includes('fixture-secret'),false);
});

import { createServer } from 'node:http';
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import { EXPECTED_USERNAME, idValid } from '../lib/x/config.mjs';

export const CALLBACK = 'http://localhost:8080/callback';
export const SCOPES = 'tweet.read users.read tweet.write offline.access';
export const HOSTS = Object.freeze(['127.0.0.1','::1']);
const TOKEN_URL = 'https://api.x.com/2/oauth2/token';
const ME_URL = 'https://api.x.com/2/users/me';
const fail = code => { throw Error(code); };
const secretString = s => typeof s === 'string' && s.length > 0 && s.length <= 16384 && !/[\r\n\0]/.test(s);

export function consent(clientId) {
  if (!secretString(clientId)) fail('MISSING_CLIENT_ID');
  const state = randomBytes(32).toString('base64url');
  const verifier = randomBytes(64).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const url = new URL('https://x.com/i/oauth2/authorize');
  url.search = new URLSearchParams({response_type:'code',client_id:clientId,redirect_uri:CALLBACK,
    scope:SCOPES,state,code_challenge:challenge,code_challenge_method:'S256'}).toString();
  return {state,verifier,url:url.toString()};
}
export function callbackCode(rawUrl, expectedState) {
  if (typeof rawUrl !== 'string' || rawUrl.length > 8192 || !rawUrl.startsWith('/callback?')) fail('INVALID_CALLBACK');
  const url = new URL(rawUrl,CALLBACK);
  if (url.pathname !== '/callback' || url.origin !== new URL(CALLBACK).origin) fail('INVALID_CALLBACK');
  const states = url.searchParams.getAll('state');
  const expected = Buffer.from(expectedState), actual = Buffer.from(states[0] ?? '');
  if (states.length !== 1 || expected.length !== actual.length || !timingSafeEqual(expected,actual)) fail('STATE_MISMATCH');
  if (url.searchParams.has('error')) fail('AUTHORIZATION_DENIED');
  const codes = url.searchParams.getAll('code');
  if (codes.length !== 1 || !secretString(codes[0])) fail('MISSING_CODE');
  return codes[0];
}
async function jsonRequest(fetchImpl,url,options,reason) {
  try {
    const r = await fetchImpl(url,{...options,redirect:'error',signal:AbortSignal.timeout(10000)});
    if (!r.ok) fail(reason);
    const text = await r.text();
    if (text.length > 65536) fail(reason);
    return JSON.parse(text);
  } catch { fail(reason); }
}
export async function verifyAccount(accessToken,{fetchImpl=fetch}={}) {
  const r = await jsonRequest(fetchImpl,ME_URL,{headers:{authorization:'Bearer '+accessToken}},'IDENTITY_REQUEST_FAILED');
  if (r?.data?.username !== EXPECTED_USERNAME) fail('WRONG_ACCOUNT');
  if (!idValid(r.data.id)) fail('INVALID_ACCOUNT_ID');
  return {username:EXPECTED_USERNAME,id:r.data.id};
}
export async function exchange({code,verifier,clientId,clientSecret,fetchImpl=fetch,now=Date.now,log=()=>{}}) {
  if (![code,verifier,clientId,clientSecret].every(secretString)) fail('INVALID_CREDENTIAL_INPUT');
  // Conservatively anchor expires_in to request start, not receipt latency.
  const issuedAt = now();
  const r = await jsonRequest(fetchImpl,TOKEN_URL,{
    method:'POST',headers:{'content-type':'application/x-www-form-urlencoded',
      authorization:'Basic '+Buffer.from(encodeURIComponent(clientId)+':'+encodeURIComponent(clientSecret)).toString('base64')},
    body:new URLSearchParams({grant_type:'authorization_code',code,redirect_uri:CALLBACK,code_verifier:verifier}),
  },'TOKEN_EXCHANGE_FAILED');
  if (!secretString(r?.access_token) || !secretString(r?.refresh_token)) fail('MISSING_TOKENS');
  if (r.token_type?.toLowerCase() !== 'bearer' || !Number.isInteger(r.expires_in) || r.expires_in <= 0 || r.expires_in > 86400) fail('MALFORMED_TOKEN_RESPONSE');
  const scopes = typeof r.scope === 'string' ? r.scope.split(/\s+/).sort() : [];
  if (scopes.join(' ') !== SCOPES.split(' ').sort().join(' ')) fail('SCOPE_MISMATCH');
  log('Token exchange succeeded.');
  const identity = await verifyAccount(r.access_token,{fetchImpl});
  const expiresAt = issuedAt + r.expires_in*1000;
  if (expiresAt <= now()) fail('TOKEN_EXPIRED');
  log('Authenticated username: '+identity.username);
  log('Authenticated numeric user ID: '+identity.id);
  log('Token expiry: '+new Date(expiresAt).toISOString());
  return {version:1,username:identity.username,clientIdHash:createHash('sha256').update(clientId).digest('hex'),
    X_ACCESS_TOKEN:r.access_token,X_REFRESH_TOKEN:r.refresh_token,
    X_ACCESS_TOKEN_EXPIRES_AT:new Date(expiresAt).toISOString(),X_ACCOUNT_ID:identity.id};
}

export async function startSetup({clientId,clientSecret,handoff,fetchImpl=fetch,log=()=>{},timeoutMs=300000,hosts=HOSTS}={}) {
  // No user-selected bind address or callback/port overrides are accepted.
  if (JSON.stringify(hosts) !== JSON.stringify(HOSTS)) fail('NON_LOOPBACK_BIND_REJECTED');
  if (!secretString(clientId) || !secretString(clientSecret)) fail('MISSING_CLIENT_CREDENTIALS');
  if (typeof handoff !== 'function') fail('MISSING_HANDOFF');
  const flow = consent(clientId), servers = [];
  let used=false,timer,settled=false,resolveDone;
  const done = new Promise(resolve=>{resolveDone=resolve;});
  const close = async result => {
    if (settled) return; settled=true; clearTimeout(timer);
    await Promise.all(servers.map(s=>new Promise(resolve=>{s.close(()=>resolve());s.closeIdleConnections();})));
    resolveDone(result);
  };
  const onRequest = async (req,res) => {
    const headers={'content-type':'text/plain; charset=utf-8','cache-control':'no-store','referrer-policy':'no-referrer',
      'content-security-policy':"default-src 'none'; frame-ancestors 'none'",'x-content-type-options':'nosniff',connection:'close'};
    const respond=(status,message)=>{res.writeHead(status,headers);res.end(message);};
    if (!HOSTS.includes(req.socket.remoteAddress) || req.headers.host !== 'localhost:8080') {respond(403,'Forbidden');return;}
    if (req.method !== 'GET') {respond(405,'Method not allowed');return;}
    if (!req.url?.startsWith('/callback')) {respond(404,'Not found');return;}
    if (used || settled) {respond(409,'Setup already consumed');return;}
    used=true; log('Callback received.');
    let result;
    try {
      const code=callbackCode(req.url,flow.state); log('State verified.');
      const bundle=await exchange({code,verifier:flow.verifier,clientId,clientSecret,fetchImpl,log});
      if (settled) fail('SETUP_EXPIRED');
      await handoff(bundle);
      result={ok:true,username:bundle.username,accountId:bundle.X_ACCOUNT_ID,expiresAt:bundle.X_ACCESS_TOKEN_EXPIRES_AT};
      respond(200,'HOSTPAY OAuth setup completed. Close this tab and follow the private terminal instructions. ROBO remains disabled.');
    } catch (e) {
      const allowed=['INVALID_CALLBACK','STATE_MISMATCH','AUTHORIZATION_DENIED','MISSING_CODE','TOKEN_EXCHANGE_FAILED',
        'MISSING_TOKENS','MALFORMED_TOKEN_RESPONSE','SCOPE_MISMATCH','IDENTITY_REQUEST_FAILED','WRONG_ACCOUNT','INVALID_ACCOUNT_ID','TOKEN_EXPIRED'];
      result={ok:false,reason:allowed.includes(e.message)?e.message:'SETUP_FAILED'};
      log('Setup stopped: '+result.reason); respond(400,'HOSTPAY OAuth setup stopped. Check the private terminal. No credentials are displayed here.');
    }
    await close(result);
  };
  try {
    for (const host of HOSTS) {
      const server=createServer({maxHeaderSize:16384},onRequest);servers.push(server);
      server.requestTimeout=15000;server.headersTimeout=10000;server.keepAliveTimeout=1000;
      server.on('clientError',(_,socket)=>socket.destroy());
      await new Promise((resolve,reject)=>{
        server.once('error',reject);server.listen({host,port:8080,ipv6Only:true},resolve);
      });
    }
  } catch {
    for (const server of servers) {server.close();server.closeAllConnections();}
    fail('LOOPBACK_BIND_FAILED');
  }
  timer=setTimeout(()=>{for(const s of servers)s.closeAllConnections();void close({ok:false,reason:'SETUP_TIMEOUT'});},timeoutMs);
  log('Authorization started. Open this URL privately on this same computer:');log(flow.url);
  return {done,addresses:servers.map(s=>s.address()),cancel:()=>{
    for(const s of servers)s.closeAllConnections();return close({ok:false,reason:'CANCELLED'});
  }};
}

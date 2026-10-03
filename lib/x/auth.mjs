import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

export function tokenCodec(keyText) {
  const key=Buffer.from(keyText,'base64');
  if(key.length!==32) throw Error('INVALID_ENCRYPTION_KEY');
  return {
    encode(value) {
      const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);
      cipher.setAAD(Buffer.from('HOSTPAY-X-OAUTH-V1'));
      const data=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);
      return Buffer.concat([iv,cipher.getAuthTag(),data]).toString('base64');
    },
    decode(text) {
      const data=Buffer.from(text,'base64'),decipher=createDecipheriv('aes-256-gcm',key,data.subarray(0,12));
      decipher.setAAD(Buffer.from('HOSTPAY-X-OAUTH-V1'));decipher.setAuthTag(data.subarray(12,28));
      const value=JSON.parse(Buffer.concat([decipher.update(data.subarray(28)),decipher.final()]).toString('utf8'));
      if(typeof value.accessToken!=='string' || !value.accessToken || typeof value.refreshToken!=='string' || !value.refreshToken || !Number.isFinite(value.expiresAt)) throw Error('INVALID_TOKEN_RECORD');
      return value;
    },
  };
}
export function oauthTokens({ env, store, fetchImpl=fetch, now=Date.now }) {
  const codec=tokenCodec(env.X_TOKEN_ENCRYPTION_KEY);
  const expiry=Date.parse(env.X_ACCESS_TOKEN_EXPIRES_AT ?? '');
  // Bootstrap only when no durable credential row exists. Never overwrite rotation
  // with the original environment token on cold start. Remove seed envs afterward.
  const initial=env.X_ACCESS_TOKEN && env.X_REFRESH_TOKEN && Number.isFinite(expiry)
    ? {accessToken:env.X_ACCESS_TOKEN,refreshToken:env.X_REFRESH_TOKEN,expiresAt:expiry} : null;
  return async () => {
    try {
      const decision=await store.tokenDecision(initial,codec.decode,codec.encode);
      if(decision.kind==='READY') return decision.accessToken;
      if(decision.kind!=='REFRESH') return null;
      const response=await fetchImpl('https://api.x.com/2/oauth2/token',{
        method:'POST',redirect:'error',signal:AbortSignal.timeout(6000),
        headers:{'content-type':'application/x-www-form-urlencoded',
          authorization:'Basic '+Buffer.from(encodeURIComponent(env.X_CLIENT_ID)+':'+encodeURIComponent(env.X_CLIENT_SECRET)).toString('base64')},
        body:new URLSearchParams({grant_type:'refresh_token',refresh_token:decision.refreshToken}),
      });
      if(!response.ok) return null; // Includes 429; consumed/ambiguous rotation needs operator recovery.
      const r=await response.json();
      if(typeof r.access_token!=='string' || !r.access_token || typeof r.refresh_token!=='string' || !r.refresh_token ||
        !Number.isFinite(r.expires_in) || r.expires_in<=0 || r.expires_in>86400) return null;
      const value={accessToken:r.access_token,refreshToken:r.refresh_token,expiresAt:now()+r.expires_in*1000};
      return await store.saveTokens(decision.generation,codec.encode(value)) ? value.accessToken : null;
    } catch { return null; }
  };
}

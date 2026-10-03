import { createHmac, timingSafeEqual } from 'node:crypto';
import { configured } from './config.mjs';
import { eventFrom } from './inbound.mjs';
export const signature = (secret, data) => 'sha256=' + createHmac('sha256',secret).update(data).digest('base64');
export function signatureMatches(secret,raw,received) {
  if (!secret || typeof received !== 'string') return false;
  const expected = Buffer.from(signature(secret,raw)), actual = Buffer.from(received);
  return expected.length === actual.length && timingSafeEqual(expected,actual);
}
export function challenge(request,env) {
  if (!env.X_CLIENT_SECRET) return new Response('Unavailable',{status:503});
  const token = new URL(request.url).searchParams.get('crc_token');
  if (!token || token.length > 512) return new Response('Invalid challenge',{status:400});
  return Response.json({response_token:signature(env.X_CLIENT_SECRET,token)}, {headers:{'cache-control':'no-store'}});
}
async function rawBody(request) {
  if (!request.body) throw Error('BODY');
  const reader = request.body.getReader(), chunks = []; let size = 0;
  try {
    for (;;) {
      const r = await reader.read(); if (r.done) break;
      size += r.value.byteLength;
      if (size > 65536) { await reader.cancel(); throw Error('SIZE'); }
      chunks.push(r.value);
    }
    return Buffer.concat(chunks);
  } finally { reader.releaseLock(); }
}
export function webhook({ env, store, processEvent, schedule }) {
  return async request => {
    if (!configured(env)) return new Response('Disabled',{status:503});
    if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) return new Response('Invalid content type',{status:415});
    let raw;
    try { raw = await rawBody(request); } catch { return new Response('Invalid body',{status:413}); }
    if (!signatureMatches(env.X_CLIENT_SECRET,raw,request.headers.get('x-twitter-webhooks-signature-oauth2'))) return new Response('Unauthorized',{status:401});
    let body;
    try { body = JSON.parse(raw.toString('utf8')); } catch { return new Response('Invalid JSON',{status:400}); }
    const event = eventFrom(body,env.X_ACCOUNT_ID);
    if (!event) return new Response('OK');
    try {
      // An authenticated X-delivered opt-out bypasses reply budgets. It can only
      // suppress this event author's responses; it never authorizes a write.
      if (/^(?:stop|unsubscribe|opt out)[.!]?$/i.test(body.data.payload.text.replace(/@HOSTPAY_SOL\b/gi,'').trim())) {
        await store.optOut(event.author_id);
        return new Response('OK');
      }
      const reservation = await store.admit(event,env.X_ACCOUNT_ID);
      if (reservation) schedule(() => processEvent(event,reservation));
      return new Response('OK');
    } catch { return new Response('Unavailable',{status:503}); }
  };
}

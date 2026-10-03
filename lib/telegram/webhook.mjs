import { createHash, timingSafeEqual } from 'node:crypto';
const reply = (status, message) => Response.json({ message }, { status });
const validId = x => Number.isSafeInteger(x);
export function secretMatches(configured, supplied) {
  if (!configured || !supplied) return false;
  const digest = x => createHash('sha256').update(x).digest();
  return timingSafeEqual(digest(configured), digest(supplied));
}
async function boundedJson(request) {
  const limit = 65536;
  const declared = request.headers.get('content-length');
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > limit)) throw Error('SIZE');
  if (!request.body) throw Error('JSON');
  const reader = request.body.getReader(); const chunks = []; let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) { await reader.cancel(); throw Error('SIZE'); }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } finally { reader.releaseLock(); }
}
export function webhook({ env, cache, processUpdate, schedule, log = () => {} }) {
  return async request => {
    if (env.TELEGRAM_ENABLED === 'false') return reply(503, 'Unavailable');
    if (!env.TELEGRAM_WEBHOOK_SECRET || !env.TELEGRAM_BOT_TOKEN) return reply(503, 'Unavailable');
    if (!secretMatches(env.TELEGRAM_WEBHOOK_SECRET, request.headers.get('x-telegram-bot-api-secret-token'))) return reply(401, 'Unauthorized');
    if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) return reply(415, 'Unsupported content type');
    let update;
    try { update = await boundedJson(request); } catch(e) { return reply(e.message === 'SIZE' ? 413 : 400, 'Invalid update'); }
    if (!update || typeof update !== 'object' || Array.isArray(update) || !validId(update.update_id) || update.update_id < 0) return reply(400, 'Invalid update');
    const m = update.message ?? update.edited_message;
    if (!m) return reply(200, 'OK');
    if (!validId(m.message_id) || m.message_id <= 0 || !m.chat || !validId(m.chat.id) || typeof m.chat.type !== 'string' ||
        (m.text !== undefined && typeof m.text !== 'string') || (m.caption !== undefined && typeof m.caption !== 'string')) return reply(400, 'Invalid update');
    if (!cache.claim(update.update_id)) return reply(200, 'OK');
    try {
      schedule(async () => {
        try { await processUpdate(update); }
        catch { log({ timestamp: new Date().toISOString(), update_id: update.update_id, action: 'PROCESSING_FAILED', reason: 'INTERNAL', trigger: 'UPDATE' }); }
      });
    } catch {
      cache.release(update.update_id);
      return reply(503, 'Unavailable');
    }
    return reply(200, 'OK');
  };
}


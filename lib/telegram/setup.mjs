import { secretMatches } from './webhook.mjs';
import { official } from './official.mjs';
// Short-lived operator control; only the fixed official URL can be registered.
// No user chat ID, arbitrary URL, message or Telegram method is accepted.
export function setupHandler({ env, fetchImpl = fetch, now = Date.now }) {
  return async request => {
    const until = Date.parse(env.TELEGRAM_SETUP_UNTIL ?? '');
    if (!Number.isFinite(until) || now() >= until || !env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_WEBHOOK_SECRET) return Response.json({ ok: false }, { status: 503 });
    if (!secretMatches(env.TELEGRAM_WEBHOOK_SECRET, request.headers.get('x-telegram-bot-api-secret-token'))) return Response.json({ ok: false }, { status: 401 });
    const call = async (method, body = {}) => {
      const r = await fetchImpl('https://api.telegram.org/bot' + env.TELEGRAM_BOT_TOKEN + '/' + method, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
        signal: AbortSignal.timeout(7000), redirect: 'error',
      });
      const d = await r.json(); if (!r.ok || !d.ok) throw Error('CONTROL_FAILED'); return d.result;
    };
    try {
      const bot = await call('getMe');
      if (bot.username !== official.botUsername || !bot.is_bot) throw Error('IDENTITY');
      await call('setWebhook', {
        url: official.website + '/api/telegram',
        secret_token: env.TELEGRAM_WEBHOOK_SECRET,
        allowed_updates: ['message', 'edited_message'],
        max_connections: 1, drop_pending_updates: false,
      });
      const info = await call('getWebhookInfo');
      return Response.json({
        ok: info.url === official.website + '/api/telegram',
        bot: official.botUsername, webhookMatches: info.url === official.website + '/api/telegram',
        secretTokenSupplied: true, pendingUpdateCount: info.pending_update_count,
        hasLastError: Boolean(info.last_error_date), lastErrorDate: info.last_error_date ?? null,
      });
    } catch { return Response.json({ ok: false, reason: 'SETUP_FAILED' }, { status: 502 }); }
  };
}


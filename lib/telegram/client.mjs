// Imported only by the Node server route. Never expose raw transport errors.
export function telegramClient({ token, fetchImpl = fetch, timeoutMs = 7000, now = Date.now } = {}) {
  if (typeof window !== 'undefined') throw Error('SERVER_ONLY');
  let blockedUntil = 0;
  async function call(method, body) {
    if (!token) return { ok: false, reason: 'NOT_CONFIGURED' };
    if (now() < blockedUntil) return { ok: false, reason: 'RATE_LIMIT' };
    try {
      const response = await fetchImpl('https://api.telegram.org/bot' + token + '/' + method, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body), signal: AbortSignal.timeout(timeoutMs), redirect: 'error',
      });
      const data = await response.json();
      if (response.status === 429 || data?.error_code === 429) {
        const seconds = Number(data?.parameters?.retry_after);
        blockedUntil = now() + Math.min(3600, Math.max(1, Number.isFinite(seconds) ? seconds : 60)) * 1000;
        return { ok: false, reason: 'RATE_LIMIT' };
      }
      return response.ok && data?.ok === true ? { ok: true } : { ok: false, reason: 'TELEGRAM_REJECTED' };
    } catch {
      // A timeout may have succeeded remotely: do not blindly repeat a send.
      return { ok: false, reason: 'TRANSPORT_UNKNOWN' };
    }
  }
  return {
    sendMessage: (chatId, text, replyTo, threadId) => call('sendMessage', {
      chat_id: chatId, text: String(text).slice(0, 4000),
      link_preview_options: { is_disabled: true },
      ...(replyTo ? { reply_parameters: { message_id: replyTo, allow_sending_without_reply: true } } : {}),
      ...(threadId ? { message_thread_id: threadId } : {}),
    }),
    deleteMessage: (chatId, messageId) => call('deleteMessage', { chat_id: chatId, message_id: messageId }),
  };
}


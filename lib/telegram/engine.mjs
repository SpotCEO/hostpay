import { official, commands, answer, safety } from './official.mjs';

// Deliberately narrow English imperative rules; quoted/negated educational
// discussion is not auto-deleted. Unknown links alone are not proof of a scam.
export function dangerReason(text) {
  const lines = text.split(/\r?\n/).filter(line => !/^\s*[>“"'`]/.test(line));
  for (const line of lines) {
    if (/\b(never|don't|do not|not|avoid|beware|warning|scam|example|quote|reported)\b/i.test(line)) continue;
    if (/^\s*(?:please\s+)?(?:send|share|paste|give|submit|provide|enter|dm)\s+(?:(?:me|us)\s+)?(?:your|the)\s+(?:\d+[- ]word\s+)?(?:seed|recovery)\s+phrase\b/i.test(line)) return 'SEED_SOLICITATION';
    if (/^\s*(?:please\s+)?(?:send|share|paste|give|submit|provide|enter|dm)\s+(?:(?:me|us)\s+)?(?:your|the)\s+private\s+key\b/i.test(line)) return 'PRIVATE_KEY_SOLICITATION';
    if (/^\s*(?:please\s+)?send\s+(?:funds|sol|tokens|crypto|money)(?:\s+to\s+\S+)?\s+to\s+(?:verify|validate|activate)\s+(?:your\s+)?wallet\b/i.test(line)) return 'FUNDS_FOR_VERIFICATION';
  }
  return null;
}
export function trigger(message, botId) {
  const text = message.text ?? message.caption ?? '';
  const command = text.match(/^\/([a-z]+)(?:@([a-z0-9_]+))?(?=\s|$)/i);
  if (command) {
    if (command[2] && command[2].toLowerCase() !== official.botUsername.toLowerCase()) return null;
    return Object.hasOwn(commands, command[1].toLowerCase()) ? { type: 'COMMAND', response: commands[command[1].toLowerCase()] } : null;
  }
  if (/@HOSTPAYRoboBot\b/i.test(text)) return { type: 'MENTION', response: answer(text) };
  const author = message.reply_to_message?.from;
  if (author?.is_bot === true && String(author.id) === String(botId)) return { type: 'REPLY', response: answer(text) };
  return null;
}
// Bounded, warm-instance-only duplicate suppression. Not a durable queue.
export function updateCache({ now = Date.now, max = 10000, ttlMs = 86400000 } = {}) {
  const seen = new Map();
  return {
    claim(id) {
      const time = now();
      for (const [key, expiry] of seen) { if (expiry > time) break; seen.delete(key); }
      if (seen.has(id)) return false;
      if (seen.size >= max) seen.delete(seen.keys().next().value);
      seen.set(id, time + ttlMs); return true;
    },
    release(id) { seen.delete(id); },
  };
}
export function processor({ client, botId, log = () => {}, now = Date.now }) {
  const lastWarning = new Map();
  return async update => {
    const m = update.message ?? update.edited_message;
    if (!m || m.from?.is_bot || m.sender_chat || !['private','group','supergroup'].includes(m.chat.type)) return;
    const emit = (action, reason, type) => log({
      timestamp: new Date(now()).toISOString(), update_id: update.update_id,
      chat_id: m.chat.id, message_id: m.message_id, action, reason, trigger: type,
    });
    const text = m.text ?? m.caption ?? '';
    const reason = dangerReason(text);
    if (reason && m.chat.type !== 'private') {
      const deleted = await client.deleteMessage(m.chat.id, m.message_id);
      emit(deleted.ok ? 'DELETED' : 'DELETE_FAILED', reason, 'MODERATION');
      // Do not reply to deleted content; do not echo it. Bound warning spam.
      if (now() - (lastWarning.get(m.chat.id) ?? -Infinity) >= 30000) {
        if (lastWarning.size >= 1000) lastWarning.delete(lastWarning.keys().next().value);
        lastWarning.set(m.chat.id, now());
        const sent = await client.sendMessage(m.chat.id, safety, undefined, m.message_thread_id);
        emit(sent.ok ? 'WARNING_SENT' : 'SEND_FAILED', sent.ok ? reason : sent.reason, 'MODERATION');
      }
      return;
    }
    if (update.edited_message) return; // edits receive moderation, never repeat replies
    const selected = trigger(m, botId);
    if (!selected) return;
    const sent = await client.sendMessage(m.chat.id, selected.response, m.message_id, m.message_thread_id);
    emit(sent.ok ? 'REPLIED' : 'SEND_FAILED', sent.ok ? 'SUPPORTED_RESPONSE' : sent.reason, selected.type);
  };
}


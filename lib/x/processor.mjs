import { configured } from './config.mjs';
import { interaction } from './inbound.mjs';
import { facts } from '../robo/knowledge.mjs';
import { present } from './presentation.mjs';

export function securityReason(text) {
  // Unknown links or criticism alone never establish misconduct.
  if (/\b(never|don't|do not|avoid|beware|warning|example|quoted)\b|^[>“"']/i.test(text)) return null;
  if (/\b(?:send|share|paste|enter|provide|dm) (?:me |us )?your (?:seed phrase|private key|recovery phrase)\b/i.test(text)) return 'SECRET_SOLICITATION';
  if (/\bsend (?:funds|sol|tokens|money).*to (?:verify|validate|activate) (?:your )?wallet\b/i.test(text)) return 'FUNDS_FOR_VERIFICATION';
  if (/\b(?:official hostpay support|hostpay support here)\b.*\b(?:connect|approve|sign)\b.*https?:\/\//i.test(text)) return 'UNVERIFIED_SUPPORT_REQUEST';
  return null;
}
export function processor({ env, client, store, robo, log = () => {} }) {
  return async (event, reservation) => {
    const emit = (state, reason) => log({ timestamp:new Date().toISOString(), incoming_id:event.id,
      conversation_id:event.conversation_id, state, reason });
    const skip = async reason => { await store.finish(event.id,'SKIPPED',reason); emit('SKIPPED',reason); };
    try {
      if (!configured(env)) return await skip('DISABLED');
      const identity = await client.identity();
      if (!identity.ok) {
        if (identity.reason === 'RATE_LIMIT') await store.pause('X');
        return await skip(identity.reason);
      }
      const selected = await interaction(event,client,env.X_ACCOUNT_ID);
      if (selected.reason) {
        if (selected.reason === 'RATE_LIMIT') await store.pause('X');
        return await skip(selected.reason);
      }
      if (/^(?:stop|unsubscribe|opt out)[.!]?$/i.test(selected.text)) {
        await store.optOut(event.author_id); return await skip('OPT_OUT');
      }
      const security = securityReason(selected.text);
      const result = security ? { text:present(facts.safety),mode:'GUARD' } : await robo({
        message:selected.text, replyContext:selected.context, channel:'X',
        chatId:event.conversation_id, userId:event.author_id,
      }, reservation.aiAllowed);
      emit(result.mode === 'AI' ? 'AI_SUCCESS' : 'AI_FALLBACK', security ?? 'RESPONSE_READY');
      // Fresh identity immediately before send; no environment-only identity trust.
      if (!configured(env)) return await skip('DISABLED');
      const recheck = await client.identity();
      if (!recheck.ok) {
        if (recheck.reason === 'RATE_LIMIT') await store.pause('X');
        return await skip(recheck.reason);
      }
      if (!await store.authorize(event.id,env.X_ACCOUNT_ID)) return await skip('SEND_DENIED');
      const sent = await client.reply(event.id,result.text);
      if (sent.ok) {
        await store.finish(event.id,'SENT','REPLIED',sent.data.id); emit('SENT','REPLIED');
      } else if (sent.reason === 'UNKNOWN') {
        // Journal remains OUTCOME_UNKNOWN; never retry a possibly successful write.
        emit('OUTCOME_UNKNOWN','TRANSPORT_UNKNOWN');
      } else {
        if (sent.reason === 'RATE_LIMIT') await store.pause('X');
        await store.finish(event.id,'REJECTED',sent.reason); emit('REJECTED',sent.reason);
      }
    } catch {
      // Includes durable acknowledgement loss. Never log provider errors/secrets.
      emit('HALTED','INTERNAL');
    }
  };
}

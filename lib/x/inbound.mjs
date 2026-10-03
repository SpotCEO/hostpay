import { idValid } from './config.mjs';
export function eventFrom(body, accountId) {
  const d = body?.data, p = d?.payload;
  if (!['post.mention.create','post.reply.create'].includes(d?.event_type) || d?.filter?.user_id !== accountId ||
      !p || ![p.id,p.author_id,p.conversation_id].every(idValid) || p.author_id === accountId ||
      typeof p.text !== 'string' || p.text.length > 2000 ||
      (p.referenced_tweets !== undefined && (!Array.isArray(p.referenced_tweets) || p.referenced_tweets.some(x => !x))) ||
      p.referenced_tweets?.some(x => x.type === 'retweeted')) return null;
  return { id:p.id, author_id:p.author_id, conversation_id:p.conversation_id,
    created_at:p.created_at, event_type:d.event_type };
}
export async function interaction(event, client, accountId) {
  const r = await client.post(event.id);
  if (!r.ok) return { reason:r.reason };
  const p = r.data;
  if (!p || p.id !== event.id || p.author_id !== event.author_id || p.author_id === accountId ||
      p.conversation_id !== event.conversation_id || p.possibly_sensitive ||
      typeof p.text !== 'string' || p.text.length > 2000 ||
      (p.referenced_tweets !== undefined && (!Array.isArray(p.referenced_tweets) || p.referenced_tweets.some(x => !x))) ||
      p.referenced_tweets?.some(x => x.type === 'retweeted')) return { reason:'INELIGIBLE' };
  const mention = Array.isArray(p.entities?.mentions) && p.entities.mentions.some(x => x?.id === accountId && x.username === 'HOSTPAY_SOL');
  const refs = p.referenced_tweets?.filter(x => x.type === 'replied_to') ?? [];
  let context = '', officialReply = false;
  if (refs.length === 1 && idValid(refs[0].id)) {
    const previous = await client.post(refs[0].id);
    if (!previous.ok) return { reason:previous.reason };
    const q = previous.data;
    if (!q || q.id !== refs[0].id || q.conversation_id !== p.conversation_id) return { reason:'CONTEXT_MISMATCH' };
    officialReply = q.author_id === accountId && p.in_reply_to_user_id === accountId;
    if (officialReply && typeof q.text === 'string') context = q.text.slice(0,1000);
  }
  if (event.event_type === 'post.reply.create' ? !officialReply : !mention) return { reason:'INELIGIBLE' };
  return { text:p.text.replace(/@HOSTPAY_SOL\b/gi,'').trim(), context };
}

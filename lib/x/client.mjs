import { idValid, EXPECTED_USERNAME } from './config.mjs';
import twitterText from 'twitter-text';

// Fixed read/reply capabilities only. No generic publishing or moderation API.
export function xClient({ token, tokenProvider, expectedId, fetchImpl = fetch, timeoutMs = 6000 }) {
  if (typeof window !== 'undefined') throw Error('SERVER_ONLY');
  async function call(path, body) {
    try {
      const accessToken = tokenProvider ? await tokenProvider() : token;
      if (!accessToken) return { ok: false, reason: 'AUTH' };
      const response = await fetchImpl('https://api.x.com/2/' + path, {
        method: body ? 'POST' : 'GET', redirect: 'error', signal: AbortSignal.timeout(timeoutMs),
        headers: { authorization: 'Bearer ' + accessToken, ...(body ? { 'content-type': 'application/json' } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      if (response.status === 429) return { ok: false, reason: 'RATE_LIMIT' };
      if ([401,403].includes(response.status)) return { ok: false, reason: 'AUTH' };
      if (!response.ok) return { ok: false, reason: body && response.status >= 500 ? 'UNKNOWN' : 'REJECTED' };
      const result = await response.json();
      return result?.data ? { ok: true, data: result.data } : { ok: false, reason: body ? 'UNKNOWN' : 'INVALID' };
    } catch { return { ok: false, reason: 'UNKNOWN' }; }
  }
  return {
    async identity() {
      const r = await call('users/me');
      if (!r.ok) return r;
      return r.data.username === EXPECTED_USERNAME && idValid(r.data.id) && r.data.id === expectedId
        ? r : { ok: false, reason: 'IDENTITY' };
    },
    post(id) {
      if (!idValid(id)) return Promise.resolve({ ok: false, reason: 'INVALID' });
      return call('tweets/' + id + '?tweet.fields=author_id,conversation_id,created_at,entities,referenced_tweets,in_reply_to_user_id,possibly_sensitive');
    },
    async reply(id, text) {
      if (!idValid(id) || !twitterText.parseTweet(text).valid) return { ok: false, reason: 'INVALID' };
      const r = await call('tweets', { text, reply: { in_reply_to_tweet_id: id } });
      return r.ok && !idValid(r.data.id) ? { ok: false, reason: 'UNKNOWN' } : r;
    },
  };
}

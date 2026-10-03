import twitterText from 'twitter-text';
import { createRobo } from '../robo/core.mjs';
import { facts, official, topicFor } from '../robo/knowledge.mjs';
import { TELEGRAM_URL } from './config.mjs';
const optOut = ' Reply STOP to opt out.';
const fits = s => twitterText.parseTweet(s + optOut).valid;

// Presentation transformations of canonical facts, never an independent fact set.
export function present(text) {
  let answer = String(text).replace(/\s+/g,' ').trim();
  if (answer === facts.economics) answer = answer
    .replace('HOSTPAY’s nominal child-token creator/platform fee is ', 'Fee: ')
    .replace('External venue/protocol deductions occur first.', 'External deductions first.')
    .replace('Qualified actual physical net HOSTPAY creator revenue received is then allocated:', 'Qualified physical net received:')
    .replace('Net revenue varies; there is no guaranteed net rate or return.', 'No guaranteed net/return.');
  if (answer === facts.hpay) answer = answer
    .replace('the required case-sensitive child-token mint-address suffix', 'a case-sensitive child-mint suffix')
    .replace('not a token, not HOST and not a reward asset', 'not a token')
    .replace('official HOSTPAY registry/provenance determines authenticity', 'registry/provenance determines authenticity')
    .replace(' A suffix or pasted address alone proves nothing.', '');
  if (answer === facts.holders) answer = answer
    .replace('The 30% HOST Holder allocation of qualified physical net revenue funds on-market purchased HOST rewards, not newly issued HOST.',
      facts.holders.split('. ')[0].replace('The ', '').replace(' allocation of ', ' share of ').replace(' funds on-market purchased ', ' buys ').replace(' rewards, not newly issued HOST',' on-market') + '.')
    .replace('Holder eligibility uses snapshots: ', 'Snapshots: ');
  // The shared fallback has Telegram-only help wording; strip only presentation.
  answer = answer.replace(/;?\s*\/help(?: and \/security)?(?: still works| still work)?\.?/g,'')
    .replace('Try .','').replace('My full community brain is still being connected; ', '');
  if (!fits(answer)) {
    const sentences = answer.match(/[^.!?]+(?:[.!?](?=\s|$)|$)/g) ?? [];
    let compact = '';
    for (const sentence of sentences) {
      const next = (compact + ' ' + sentence.trim()).trim();
      if (!fits(next)) break;
      compact = next;
    }
    answer = compact || 'That needs more room than one reply. Ask me one part at a time 🤖';
  }
  return answer + optOut;
}

export function xRobo({ provider, store }) {
  const robo = createRobo({ provider: {
    configured: provider.configured,
    async generate(input) {
      const r = await provider.generate({ ...input,
        instructions: input.instructions + '\nChannel presentation: X. One concise reply, target at most 245 weighted characters. Preserve all required factual qualifiers. No threads, announcements, tools, account actions, or unverified live claims. Do not mention Telegram commands. Keep the same ROBO personality.' });
      if (!r.ok && r.reason === 'PROVIDER_RATE_LIMIT') await store.pause('AI');
      return r;
    },
  } });
  const offline = createRobo();
  return async (input, aiAllowed) => {
    // Approved channel link metadata; no model call or arbitrary URL lookup.
    if (/^(?:what (?:is|are) (?:the )?)?official (?:links|telegram|website|x)\??$/i.test(input.message)) {
      return { text:present(`${official.website} ${official.x} ${TELEGRAM_URL}`), mode:'FALLBACK' };
    }
    const result = await (aiAllowed ? robo : offline)(input);
    const topic = topicFor(input.message) ?? topicFor(input.replyContext ?? '');
    // Never chop an overlong AI economics answer and lose a required qualifier.
    const text = !fits(result.text) && result.mode === 'AI' && topic ? facts[topic] : result.text;
    return { ...result, text:present(text) };
  };
}

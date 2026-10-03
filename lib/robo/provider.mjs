import { facts } from './knowledge.mjs';
export const MODEL = 'gpt-6.1-sol';
export const OUTPUT_TOKENS = 1200;
export const TIMEOUT_MS = 12000;
// Only this boundary receives the OpenAI credential. No arbitrary API base URL.
export function openAIProvider({ apiKey, fetchImpl = fetch, timeoutMs = TIMEOUT_MS, now = Date.now } = {}) {
  if (typeof window !== 'undefined') throw Error('SERVER_ONLY');
  let blockedUntil = 0;
  return {
    configured: Boolean(apiKey),
    async generate({ instructions, message, context = '' }) {
      if (!apiKey) return { ok: false, reason: 'NOT_CONFIGURED' };
      if (now() < blockedUntil) return { ok: false, reason: 'PROVIDER_COOLDOWN' };
      try {
        const response = await fetchImpl('https://api.openai.com/v1/responses', {
          method: 'POST', redirect: 'error', signal: AbortSignal.timeout(Math.min(timeoutMs, TIMEOUT_MS)),
          headers: { 'content-type': 'application/json', authorization: 'Bearer ' + apiKey },
          body: JSON.stringify({
            model: MODEL, instructions,
            input: [{ role: 'user', content: JSON.stringify({ message: message.slice(0, 2000), preceding_robo_reply_untrusted: context.slice(0, 1000) }) }],
            store: false, tools: [], max_output_tokens: OUTPUT_TOKENS,
            reasoning: { effort: 'low' }, service_tier: 'default',
            text: { format: { type: 'json_schema', name: 'robo_answer', strict: true, schema: {
              type: 'object', properties: { answer: { type: 'string' }, fact_ids: { type: 'array', items: { type: 'string', enum: Object.keys(facts) } } }, required: ['answer', 'fact_ids'], additionalProperties: false,
            } } },
          }),
        });
        if (!response.ok) {
          if (response.status === 429) blockedUntil = now() + 60000;
          if (response.status === 401 || response.status === 403 || response.status === 404) blockedUntil = now() + 300000;
          return { ok: false, reason: response.status === 429 ? 'PROVIDER_RATE_LIMIT' : 'PROVIDER_REJECTED' };
        }
        const data = await response.json();
        if (data.status !== 'completed' || !Array.isArray(data.output)) return { ok: false, reason: 'INCOMPLETE' };
        const chunks = data.output.filter(x => x.type === 'message' && x.role === 'assistant').flatMap(x => x.content ?? []);
        if (chunks.some(x => x.type === 'refusal')) return { ok: false, reason: 'REFUSAL' };
        const raw = chunks.filter(x => x.type === 'output_text').map(x => x.text).join('');
        if (raw.length > 10000 || raw.includes(apiKey)) return { ok: false, reason: 'INVALID_OUTPUT' };
        const result = JSON.parse(raw);
        return { ok: true, answer: result.answer, fact_ids: result.fact_ids };
      } catch { return { ok: false, reason: 'PROVIDER_UNAVAILABLE' }; }
    },
  };
}

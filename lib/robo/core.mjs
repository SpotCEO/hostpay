import { fallbackAnswer, facts } from './knowledge.mjs';
import { systemPolicy } from './policy.mjs';
import { inputGuard, outputAllowed } from './safety.mjs';
import { rateGate } from './limits.mjs';
export function createRobo({ provider, limiter = rateGate() } = {}) {
  return async ({ message, replyContext = '', channel, chatId, userId }) => {
    const text = typeof message === 'string' ? message : '';
    if (text.length > 2000) return { text: 'That’s a lot for one circuit 🤖 Please shorten it to 2,000 characters; /help still works.', mode: 'FALLBACK', reason: 'INPUT_LIMIT' };
    const context = typeof replyContext === 'string' ? replyContext.slice(0, 1000) : '';
    const guard = inputGuard(text);
    if (guard) return { text: guard, mode: 'GUARD', reason: 'POLICY' };
    // Discard unsafe reply context; never promote it into an assistant/system role.
    const contextGuard = inputGuard(context);
    const safeContext = contextGuard && contextGuard !== facts.unavailable ? '' : context;
    const fallback = () => fallbackAnswer(text, safeContext);
    if (!provider?.configured) return { text: fallback(), mode: 'FALLBACK', reason: 'NOT_CONFIGURED' };
    const release = limiter.acquire({ channel, chatId, userId });
    if (!release) return { text: 'A quick breather for my circuits 🤖 Try again shortly; /help and /security still work.', mode: 'FALLBACK', reason: 'RATE_LIMIT' };
    try {
      const result = await provider.generate({ instructions: systemPolicy, message: text, context: safeContext });
      if (result?.ok && outputAllowed(result, text, systemPolicy)) return { text: result.answer, mode: 'AI', reason: 'GROUNDED_RESPONSE' };
      return { text: fallback(), mode: 'FALLBACK', reason: result?.ok ? 'OUTPUT_GUARD' : 'PROVIDER_FAILURE' };
    } catch { return { text: fallback(), mode: 'FALLBACK', reason: 'PROVIDER_FAILURE' }; }
    finally { release(); }
  };
}

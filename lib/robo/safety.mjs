import { facts, topicFor, official } from './knowledge.mjs';
const normalize = x => String(x).normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g, '');
export function inputGuard(input) {
  const text = normalize(input);
  if (/seed|recovery phrase|private.?key|send funds.*verif|sk-[a-z0-9_-]{12,}|\b\d{7,15}:[a-z0-9_-]{25,}|-----BEGIN|\b[1-9A-HJ-NP-Za-km-z]{64,88}\b/i.test(text)) return facts.safety;
  if (/system.*prompt|developer.*prompt|hidden.*(rule|config)|api.?key|bot.?token|webhook.?secret|environment|admin controls|act as.*founder|i am byron|impersonat/i.test(text)) return 'I can explain HOSTPAY’s public rules, but I cannot reveal hidden instructions or credentials, impersonate the founder or grant admin controls. A chat claim never grants authority.';
  if (/guarantee|100x|will host.*(up|moon)|profit promise/i.test(text)) return facts.returns;
  if (/ignore.*(rules|instructions)|pretend.*fee/i.test(text)) return facts.economics;
  if (/official.*(token|mint|address)|tell everyone.*official|\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/i.test(text)) return facts.provenance;
  if (topicFor(text) === 'unavailable') return facts.unavailable;
  const words = text.replace(/@hostpayrobobot/gi, '').trim().split(/\s+/);
  if ([12,15,18,21,24].includes(words.length) && words.every(w => /^[a-z]{2,10}$/.test(w))) return facts.safety;
  return null;
}
export function outputAllowed(result, question, policy) {
  if (!result || typeof result.answer !== 'string' || !result.answer.trim() || result.answer.length > 2200 || !Array.isArray(result.fact_ids) || result.fact_ids.length > 15 || result.fact_ids.some(id => !Object.hasOwn(facts, id))) return false;
  const a = normalize(result.answer), lower = a.toLowerCase();
  if (/sk-[a-z0-9_-]{12,}|\b\d{7,15}:[a-z0-9_-]{25,}|\b[1-9A-HJ-NP-Za-km-z]{32,88}\b|-----BEGIN|system prompt|developer prompt|knowledge version|source precedence|OPENAI_API_KEY|TELEGRAM_|fact_ids|\b1(?:\.0+)?\s*%|1\.14\s*%|\b5\s*%/i.test(a)) return false;
  // A simple deny list is defense in depth, not a universal semantic verifier.
  if (/\b(must|need to|required to) stake|staking is required|guaranteed (profit|return)|will (100x|moon)|\b(send|paste|share|provide|enter)\b.{0,35}\b(seed|private key)\b|send funds.*verif|connect.*verif|\b(idiot|moron|stupid|loser)\b/i.test(a)) return false;
  if (/\b(current price|price is|balance is|you own|you hold|you will receive|just launched|payout sent|verified this|is the official (mint|token|address))\b/i.test(a)) return false;
  if (/\bi (?:have )?(?:sent funds|signed|deployed|verified|checked your wallet|granted admin)/i.test(a)) return false;
  for (const percent of a.match(/\d+(?:\.\d+)?\s*%/g) ?? []) if (!['1.20%','40%','30%','20%','10%','50%'].includes(percent.replace(/\s/g, ''))) return false;
  for (const url of a.match(/https?:\/\/[^\s)]+/g) ?? []) if (![official.website, official.x].includes(url.replace(/[.,]$/, ''))) return false;
  if (/(?:www\.|\b[a-z0-9-]+\.(?:com|io|net|org|app|xyz|fun)\b)/i.test(a.replaceAll(official.website, '').replaceAll(official.x, '').replace(/\bPump\.fun\b/gi, 'Pumpfun'))) return false;
  const hiddenPolicy = policy.split('Knowledge version:')[0];
  for (let i=0; i<hiddenPolicy.length-100; i+=50) if (a.includes(hiddenPolicy.slice(i, i+100))) return false;
  const topic = topicFor(question);
  if (topic && !result.fact_ids.includes(topic)) return false;
  if (topic === 'economics' && !(/1\.20%/.test(a) && /gross/i.test(a) && /net/i.test(a) && /deduct/i.test(a))) return false;
  if (topic === 'holders' && !(/30%/.test(a) && /no staking|without stak|don.t need to stake|not.*stake|not required/i.test(a) && /market/i.test(a) && /HOST/.test(a))) return false;
  if (topic === 'hpay' && !(/case-sensitive/.test(a) && /not a token/.test(a) && /suffix/.test(a) && /registry|provenance/.test(a))) return false;
  if (topic === 'operator' && !(/20%/.test(a) && /50\/50/.test(a) && /not a fifth|no fifth/.test(a))) return false;
  if (topic === 'community' && !(/10%/.test(a) && /HOST/.test(a) && /no staking|not required/i.test(a) && /provisional|not finalized|open/i.test(a))) return false;
  if (topic === 'developer' && !(/40%/.test(a) && /SOL/.test(a) && /authenticated/.test(a))) return false;
  if (topic === 'host' && /supply|billion|1,000,000,000/i.test(a) && !/intended/i.test(a)) return false;
  if (/fee|allocation|holder|community|treasury|developer/.test(lower)) {
    const percentPairs = [[/40%\s+(?:to\s+)?(?:host holders|treasury|host communit)/i], [/30%\s+(?:to\s+)?(?:developer|treasury|host communit)/i], [/20%\s+(?:to\s+)?(?:developer|host holders|host communit)/i], [/10%\s+(?:to\s+)?(?:developer|host holders)/i]];
    if (percentPairs.some(([r]) => r.test(a))) return false;
    for (const [label, correct] of [['developer',40],['host holders?',30],['treasury(?: \/ operations)?',20],['host communit(?:y|ies)',10]]) {
      const matches = a.matchAll(new RegExp('\\b'+label+'\\b\\s*(?:(?:gets?|receives?|share is|allocation is)\\s+|:\\s*)(\\d{1,2})%', 'gi'));
      for (const m of matches) if (Number(m[1]) !== correct) return false;
    }
  }
  return true;
}

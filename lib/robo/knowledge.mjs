// Curated public product facts only. Never ingest whole internal reports at runtime.
export const knowledgeVersion = '2026-10-03-v1.2-robo1.1';
export const official = Object.freeze({ website: 'https://www.hostpayapp.com', x: 'https://x.com/HOSTPAY_SOL', botUsername: 'HOSTPAYRoboBot', community: 'HOSTPAY | Official Community', unpublished: 'Not yet officially published' });
export const economics = 'HOSTPAY’s nominal child-token creator/platform fee is 1.20% GROSS. External venue/protocol deductions occur first. Qualified actual physical net HOSTPAY creator revenue received is then allocated: 40% Developer, 30% HOST Holders, 20% Treasury / Operations, 10% Host Community. Net revenue varies; there is no guaranteed net rate or return.';
export const safety = 'HOSTPAY admins and ROBO never need your seed phrase or private key. Never send funds to verify a wallet. ROBO never DMs first. Ignore unsolicited support DMs and verify official links and contracts.';
export const facts = Object.freeze({
  brand: 'HOSTPAY is a Solana-first token launch and reward orchestration platform connecting child-token developers, HOST holders, selected Host Communities and platform operations. Launch. Reward. Grow. Product rules are not proof that public launches or rewards are live.',
  host: 'HOST is HOSTPAY’s native platform token, used for rewards and developer access. Intended supply is 1 billion HOST (1,000,000,000); that is not proof of issued or circulating supply. No staking requirement, no mandatory burn and no inflationary HOST rewards. HOST is intended to launch separately on Pump.fun.',
  hpay: 'HPAY is the required case-sensitive child-token mint-address suffix. HPAY is not a token, not HOST and not a reward asset. The suffix is branding only: official HOSTPAY registry/provenance determines authenticity. A suffix or pasted address alone proves nothing.',
  economics,
  operator: 'The public Treasury / Operations allocation is 20% of qualified physical net revenue. Internally that existing operator bucket is split 50/50 Treasury and Promo. This is not a fifth public bucket. An indivisible internal remainder policy is not yet finalized; do not invent an extra recipient.',
  developer: 'The 40% Developer allocation of qualified physical net revenue is paid in SOL to the authenticated child launcher/developer, not the HOSTPAY operator.',
  holders: 'The 30% HOST Holder allocation of qualified physical net revenue funds on-market purchased HOST rewards, not newly issued HOST. Holder eligibility uses snapshots: no staking and no mandatory holding period. Qualifying supply excludes project-controlled/excluded holdings where applicable; intended total supply is not the reward denominator. Purchase timing is separate from distribution timing. No personal eligibility, amount or payout is promised.',
  community: 'Host Community has a separate 10% allocation of qualified physical net revenue, used to purchase HOST on-market for qualifying members of the selected external token community. Eligibility concerns that community’s token, not ownership of HOST. No staking or wallet connection is required merely to receive rewards. The proposed US$100 qualification threshold and servicing order are provisional, not finalized. Snapshot manipulation, time-weighting and cohort edge policies remain open. HC principal must not pay delivery overhead.',
  timing: 'HOST purchase timing and reward distribution timing are separate. Conditional purchase target is approximately 10 minutes; distribution targets are approximately +1 hour initially and every 6 hours thereafter. These are intended targets, not live countdowns or guaranteed payments. Precise production timing anchors, catch-up and delayed-funding rules remain open. No exact public purchase countdown.',
  access: 'Developer Access uses one developer-owned HOST bond per wallet, initially US$50 equivalent, not a fee or per-token charge. The initial minimum lock is 24 hours. Mature HOST can be unlocked by its owner; unlocking disables new launches, not existing children. Continuous lock keeps access active without a price-drop top-up. Re-entry is valued at the current US$50 equivalent. Cancelled-first-launch activation/maturity, valuation sources, re-entry lock details and partial-unlock rules are not yet finalized. These are product rules, not a claim the complete access flow is live.',
  launch: 'Intended flow: connect wallet, check HOST Developer Access, buy/lock HOST if required, configure child, select Host Community, review economics, create the HPAY-suffix mint, user-sign the authenticated launch and registry relationship, then display status/provenance. LaunchLab-style pre-graduation and Raydium CPMM post-graduation paths require qualified attributable creator revenue. Unrelated external pools do not automatically generate HOSTPAY creator revenue. Live launch lookups are not connected to ROBO.',
  provenance: 'Official HOSTPAY registry/provenance is authoritative. ROBO has no live registry connection and cannot authenticate a pasted CA or mint. HOST mint and verified child-token directory: Not yet officially published to this assistant. Do not send funds to an address on the strength of a chat claim.',
  unavailable: 'Live prices, balances, holdings, market caps, liquidity, launches, listing announcements, personal eligibility and payout status are not connected to ROBO. I will not guess or claim to have checked them.',
  returns: 'No guaranteed profits, token appreciation or investment returns. HOST’s future price is unknown; rewards depend on actual qualified activity and eligibility.',
  safety,
});

export function topicFor(text) {
  const q = String(text).replace(/@hostpayrobobot/gi, '').toLowerCase();
  if (/\b(seed|private key|scam|drainer|security)\b/.test(q)) return 'safety';
  if (/\b(price|market cap|liquidity|balance|holdings|own|payout status)\b|just launched|what token.*launch/.test(q)) return 'unavailable';
  if (/\b(ca|contract|official token|verify|authentic|provenance)\b|is.*official/.test(q)) return /hpay|suffix/.test(q) ? 'hpay' : 'provenance';
  if (/\bhpay\b|suffix/.test(q)) return 'hpay';
  if (/host community|host communities|\bhc\b/.test(q)) return 'community';
  if (/\b(stake|staking|holder|holders)\b/.test(q)) return 'holders';
  if (/\b(treasury|promo|fifth|operator)\b/.test(q)) return 'operator';
  if (/\b(fee|fees|net|gross|deduction|allocation)\b|\d\s*%|1\.2|money go/.test(q)) return 'economics';
  if (/developer.*(get|share|percent)|\b40%/.test(q)) return 'developer';
  if (/\b(bond|access|lock|unlock|cancel|valuation)\b/.test(q)) return 'access';
  if (/\b(when|timing|countdown|schedule)\b/.test(q)) return 'timing';
  if (/\b(reward|rewards)\b/.test(q)) return 'holders';
  if (/profit|100x|go up|appreciat|return|guarantee/.test(q)) return 'returns';
  if (/\b(supply|billion|inflation|burn)\b|how many host|what is host\??$/.test(q)) return 'host';
  if (/\b(launch|launching|raydium|cpmm|launchlab)\b/.test(q)) return 'launch';
  if (/what is hostpay|how.*hostpay.*work/.test(q)) return 'brand';
  return null;
}
export function fallbackAnswer(text, context = '') {
  const topic = topicFor(text) ?? (context ? topicFor(context) : null);
  if (topic) return facts[topic];
  if (/hello|\bhi\b|\bhey\b|alive|pretending|robot|joke|banter/i.test(text)) return 'Alive in the bot sense, mate 🤖 No coffee required. My full community brain is still being connected; I can already explain HOSTPAY’s rules, rewards and safety. Try /help.';
  if (/angry|hate|rubbish|scam|useless|terrible/i.test(text)) return 'Fair to ask tough questions. Tell me which HOSTPAY rule concerns you and I’ll stick to the facts. I won’t guess about live results.';
  return 'You’ve found the HOSTPAY corner 🤖 I can help with HOST, child tokens, rewards and community safety. My conversational brain is unavailable right now; /help and the official facts still work.';
}
export function welcomeMessage() { return 'Welcome in 👋 You’ve found HOSTPAY HQ. I’m ROBO — part guide, part security guard, part professional scam-sniffer 🤖 Try /help. Never share a seed phrase or private key.'; }

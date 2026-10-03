// Founder-approved Telegram-facing facts, 2026-10-03. No live-data claims.
export const official = Object.freeze({
  website: 'https://www.hostpayapp.com',
  botUsername: 'HOSTPAYRoboBot',
  community: 'HOSTPAY | Official Community',
  mode: 'DETERMINISTIC COMMUNITY BETA',
  unpublished: 'Not yet officially published',
});
export const economics = 'HOSTPAY’s nominal child-token creator/platform fee is 1.20% GROSS. External venue/protocol deductions occur first. Qualified actual physical net HOSTPAY creator revenue received is then allocated: 40% Developer, 30% HOST Holders, 20% Treasury / Operations, 10% Host Community. Net revenue varies; there is no guaranteed net rate or return.';
export const safety = 'HOSTPAY admins and ROBO never need your seed phrase or private key. Never send funds to verify a wallet. ROBO never DMs first. Ignore unsolicited support DMs and verify official links and contracts.';
export const commands = Object.freeze({
  start: 'Hi! I’m HOSTPAY ROBO, HOSTPAY’s official ecosystem assistant. I’m a deterministic community beta. Try /help, /about, /rules, /security or /official. I cannot access wallets or move funds.',
  help: 'Commands: /start /help /about /rules /security /official. Mention @HOSTPAYRoboBot or reply to me to ask about HOSTPAY fees, rewards, launches or provenance. I stay quiet during normal chat. Live market, launch and wallet lookups are not connected.',
  about: 'HOSTPAY is an independent Solana launch platform built around child tokens and selected Host Communities. HOST is intended to launch separately on Pump.fun. Telegram ROBO is a deterministic community beta; this is not confirmation that production launches or rewards are live. ' + economics,
  rules: 'Never share a seed phrase or private key. ROBO never DMs first; ignore unsolicited support DMs. Verify official links/contracts. No spam, impersonation, scams, harassment or guaranteed-return claims presented as official HOSTPAY statements.',
  security: safety,
  official: 'Official website: ' + official.website + '\nOfficial bot: @' + official.botUsername + '\nCommunity: ' + official.community + '\nHOST mint, official X handle, public wallet addresses and verified child-token directory: ' + official.unpublished + '. A pasted address or HPAY suffix alone is not official provenance.',
});
export function answer(text) {
  const q = text.toLowerCase();
  if (/\b(seed|private key|scam|security|drain)\b/.test(q)) return safety;
  if (/\b(fee|fees|economics|split|1\.20|1\.00|1\.14|deduction)\b/.test(q)) return economics;
  if (/\b(mint|contract|address|official|hpay|provenance)\b/.test(q) || /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/.test(text)) return commands.official + '\nI cannot authenticate that address: the live provenance feed is not connected.';
  if (/\b(reward|rewards|holder|holders|community|communities)\b/.test(q)) return 'HOST Holder rewards and selected Host Community rewards are separate parts of the intended HOSTPAY model. ' + economics + ' I cannot report live eligibility, balances or payouts.';
  if (/\b(launch|launching|developer|hostpay|host)\b/.test(q.replace(/@hostpayrobobot/g, ''))) return 'The intended flow is wallet connection, required HOST access/lock, selection of a Host Community, child-token setup and a user-signed launch. Availability must be confirmed through ' + official.website + '. I cannot launch tokens, verify current eligibility or sign transactions.';
  if (/\b(hello|hi|hey)\b/.test(q)) return 'Hi! I’m HOSTPAY ROBO. I can help with HOSTPAY rules, fees and community safety. My full community brain and live provenance feed are still being connected. Try /help.';
  return 'I’m focused on HOSTPAY, HOST, child tokens, rewards and community safety. My full community brain and live data feeds are still being connected. Try /help or ask about HOSTPAY fees.';
}


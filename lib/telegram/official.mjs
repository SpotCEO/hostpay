import { official, economics, safety, facts, fallbackAnswer, welcomeMessage } from '../robo/knowledge.mjs';
export { official, economics, safety };
export const commands = Object.freeze({
  start: welcomeMessage() + ' I can explain HOSTPAY, but I cannot access wallets or move funds.',
  help: 'ROBO, reporting for community duty 🤖 Commands: /start /help /about /rules /security /official. Mention @HOSTPAYRoboBot or reply to me to ask about HOSTPAY. I stay quiet during ordinary chat. Conversational answers fall back to official facts when my AI connection is unavailable. Live wallet, price and launch lookups are not connected.',
  about: 'Welcome to HOSTPAY — Launch. Reward. Grow. 🤖 ' + facts.brand + '\n\n' + economics,
  rules: 'Keep HOSTPAY HQ friendly: no spam, impersonation, scams, harassment or guaranteed-return claims presented as official HOSTPAY statements. Never share a seed phrase or private key. ROBO never DMs first; ignore unsolicited support DMs and verify official links/contracts.',
  security: safety,
  official: 'Official website: ' + official.website + '\nOfficial bot: @' + official.botUsername + '\nCommunity: ' + official.community + '\nOfficial X: ' + official.x + '\nHOST mint, public wallet addresses and verified child-token directory: ' + official.unpublished + '. A pasted address or HPAY suffix alone is not official provenance.',
});
export const answer = fallbackAnswer;

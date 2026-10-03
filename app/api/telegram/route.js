import { after } from 'next/server';
import { telegramClient } from '../../../lib/telegram/client.mjs';
import { processor, updateCache } from '../../../lib/telegram/engine.mjs';
import { webhook } from '../../../lib/telegram/webhook.mjs';
import { createRobo } from '../../../lib/robo/core.mjs';
import { openAIProvider } from '../../../lib/robo/provider.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const client = telegramClient({ token: process.env.TELEGRAM_BOT_TOKEN });
const log = event => console.info(JSON.stringify(event)); // only allowlisted metadata
const processUpdate = processor({
  client, botId: process.env.TELEGRAM_BOT_TOKEN?.split(':')[0], log,
  robo: createRobo({ provider: openAIProvider({ apiKey: process.env.ROBO_AI_ENABLED === 'false' ? undefined : process.env.OPENAI_API_KEY }) }),
});
const handler = webhook({ env: process.env, cache: updateCache(), processUpdate, schedule: after, log });
export async function POST(request) { return handler(request); }
export async function GET() { return new Response('HOSTPAY ROBO Telegram webhook', { headers: { 'cache-control': 'no-store' } }); }

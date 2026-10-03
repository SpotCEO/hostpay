import { after } from 'next/server';
import { configured } from '../../../../lib/x/config.mjs';
import { challenge, webhook } from '../../../../lib/x/webhook.mjs';
import { postgresJournal } from '../../../../lib/x/store.mjs';
import { xClient } from '../../../../lib/x/client.mjs';
import { oauthTokens } from '../../../../lib/x/auth.mjs';
import { xRobo } from '../../../../lib/x/presentation.mjs';
import { processor } from '../../../../lib/x/processor.mjs';
import { openAIProvider } from '../../../../lib/robo/provider.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
let handler;
export async function GET(request) { return challenge(request,process.env); }
export async function POST(request) {
  // Never instantiate database/network clients while disabled.
  if (!configured(process.env)) return new Response('Disabled',{status:503});
  try {
    if (!handler) {
      const store = postgresJournal(process.env.X_DATABASE_URL);
      const client = xClient({tokenProvider:oauthTokens({env:process.env,store}),expectedId:process.env.X_ACCOUNT_ID});
      const robo = xRobo({provider:openAIProvider({apiKey:process.env.OPENAI_API_KEY}),store});
      const processEvent = processor({env:process.env,client,store,robo,log:e => console.info(JSON.stringify(e))});
      handler = webhook({env:process.env,store,processEvent,schedule:after});
    }
    return await handler(request);
  } catch { return new Response('Unavailable',{status:503}); }
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { webhook } from '../lib/telegram/webhook.mjs';
import { updateCache, processor, dangerReason, trigger } from '../lib/telegram/engine.mjs';
import { telegramClient } from '../lib/telegram/client.mjs';
import { commands, economics } from '../lib/telegram/official.mjs';
import { setupHandler } from '../lib/telegram/setup.mjs';

test('setup fails closed when expired or missing secret',async()=>{const h=setupHandler({env:{}});assert.equal((await h(new Request('https://hostpay.invalid'))).status,503);});
test('setup requires secret and pins destination without dropping updates',async()=>{const e={TELEGRAM_BOT_TOKEN:'test-only',TELEGRAM_WEBHOOK_SECRET:'test-secret',TELEGRAM_SETUP_UNTIL:'2099-01-01'},calls=[];const h=setupHandler({env:e,fetchImpl:async(u,o)=>{const method=u.split('/').at(-1);calls.push({method,body:JSON.parse(o.body)});return {ok:true,json:async()=>({ok:true,result:method==='getMe'?{username:'HOSTPAYRoboBot',is_bot:true}:method==='getWebhookInfo'?{url:'https://www.hostpayapp.com/api/telegram',pending_update_count:0}:true})};}});assert.equal((await h(new Request('https://hostpay.invalid'))).status,401);assert.equal(calls.length,0);const r=await h(new Request('https://hostpay.invalid',{method:'POST',headers:{'x-telegram-bot-api-secret-token':'test-secret'},body:'arbitrary destination ignored'}));assert.equal(r.status,200);assert.equal((await r.json()).webhookMatches,true);assert.equal(calls[1].body.url,'https://www.hostpayapp.com/api/telegram');assert.equal(calls[1].body.drop_pending_updates,false);assert.equal(calls[1].body.secret_token,'test-secret');assert.deepEqual(calls.map(x=>x.method),['getMe','setWebhook','getWebhookInfo']);});
test('setup errors are sanitized',async()=>{const e={TELEGRAM_SETUP_UNTIL:'2099-01-01',TELEGRAM_BOT_TOKEN:'test-only',TELEGRAM_WEBHOOK_SECRET:'test-secret'};const h=setupHandler({env:e,fetchImpl:async()=>{throw Error('test-only test-secret');}});const r=await h(new Request('https://hostpay.invalid',{headers:{'x-telegram-bot-api-secret-token':'test-secret'}}));assert.equal(r.status,502);assert.equal(await r.text(),'{"ok":false,"reason":"SETUP_FAILED"}');});

const secret = randomBytes(32).toString('hex');
const token = 'test-' + randomBytes(32).toString('hex'); // never an actual token
const env = { TELEGRAM_BOT_TOKEN: token, TELEGRAM_WEBHOOK_SECRET: secret };
const message = (text = 'normal conversation') => ({ update_id: 1, message: { message_id: 2, chat: { id: -100123, type: 'supergroup' }, from: { id: 123, is_bot: false }, text } });
function fixture({ settings = env, failDelete = false, failSend = false } = {}) {
  const calls = [], logs = [], queued = [];
  const client = {
    sendMessage: async (...args) => { calls.push(['send', ...args]); return { ok: !failSend, reason: 'TELEGRAM_REJECTED' }; },
    deleteMessage: async (...args) => { calls.push(['delete', ...args]); return { ok: !failDelete }; },
  };
  const handler = webhook({ env: settings, cache: updateCache(), processUpdate: processor({ client, botId: '999', log: x => logs.push(x) }), schedule: fn => queued.push(fn), log: x => logs.push(x) });
  async function post(update = message(), options = {}) {
    const headers = { 'content-type': 'application/json', 'x-telegram-bot-api-secret-token': secret, ...options.headers };
    if (options.missingHeader) delete headers['x-telegram-bot-api-secret-token'];
    const response = await handler(new Request('https://hostpay.invalid/api/telegram', { method: 'POST', headers, body: options.body ?? JSON.stringify(update) }));
    return response;
  }
  return { post, calls, logs, queued, drain: async () => { while (queued.length) await queued.shift()(); } };
}
test('valid secret acknowledges before processing', async () => { const f=fixture(); assert.equal((await f.post(message('/help'))).status,200); assert.equal(f.calls.length,0); await f.drain(); assert.equal(f.calls.length,1); });
test('invalid secret rejected', async () => { const f=fixture(); assert.equal((await f.post(message(),{headers:{'x-telegram-bot-api-secret-token':'wrong'}})).status,401); assert.equal(f.queued.length,0); });
test('missing header rejected', async () => { assert.equal((await fixture().post(message(),{missingHeader:true})).status,401); });
test('missing configured secret fails closed', async () => { assert.equal((await fixture({settings:{TELEGRAM_BOT_TOKEN:token}}).post()).status,503); });
test('missing bot token fails closed', async () => { assert.equal((await fixture({settings:{TELEGRAM_WEBHOOK_SECRET:secret}}).post()).status,503); });
test('disabled route fails closed', async () => { assert.equal((await fixture({settings:{...env,TELEGRAM_ENABLED:'false'}}).post()).status,503); });
test('malformed JSON rejected', async () => { assert.equal((await fixture().post(null,{body:'{'})).status,400); });
test('invalid update shape rejected', async () => { for(const v of [null,[],{}, {update_id:-1}, {update_id:1,message:{message_id:'2',chat:{id:1,type:'group'}}}]) assert.equal((await fixture().post(v)).status,400); });
test('unsupported update ignored', async () => { const f=fixture();assert.equal((await f.post({update_id:3,callback_query:{}})).status,200); assert.equal(f.queued.length,0); });
test('wrong content type rejected',async()=>assert.equal((await fixture().post(message(),{headers:{'content-type':'text/plain'}})).status,415));
test('oversize declared payload rejected',async()=>assert.equal((await fixture().post(message(),{headers:{'content-length':'70000'}})).status,413));
test('oversize streamed body rejected',async()=>assert.equal((await fixture().post(null,{body:JSON.stringify({padding:'x'.repeat(70000)})})).status,413));
test('duplicate update is not sent twice',async()=>{const f=fixture();await Promise.all([f.post(message('/help')),f.post(message('/help'))]);await f.drain();assert.equal(f.calls.length,1);});
test('cache bounded and expires',()=>{let time=1;const c=updateCache({now:()=>time,max:2,ttlMs:10});assert(c.claim(1));assert(!c.claim(1));c.claim(2);c.claim(3);assert(c.claim(1));time=20;assert(c.claim(1));});
test('ordinary chatter stays silent',async()=>{const f=fixture();await f.post();await f.drain();assert.equal(f.calls.length,0);});
test('direct mention replies in same chat',async()=>{const f=fixture();await f.post(message('@HOSTPAYRoboBot hello'));await f.drain();assert.equal(f.calls[0][0],'send');assert.equal(f.calls[0][1],-100123);assert.match(f.calls[0][2],/full community brain/);});
test('reply to bot ID triggers',async()=>{const f=fixture();const u=message('hello');u.message.reply_to_message={from:{id:999,is_bot:true}};await f.post(u);await f.drain();assert.equal(f.calls.length,1);});
test('reply to similarly named human stays silent',async()=>{const f=fixture();const u=message('hello');u.message.reply_to_message={from:{id:123,is_bot:false,username:'HOSTPAYRoboBot'}};await f.post(u);await f.drain();assert.equal(f.calls.length,0);});
for (const command of Object.keys(commands)) test('command /'+command,async()=>{const f=fixture();await f.post(message('/'+command));await f.drain();assert.equal(f.calls[0][2],commands[command]);});
test('command suffix supported',async()=>{const f=fixture();await f.post(message('/help@HOSTPAYRoboBot'));await f.drain();assert.equal(f.calls[0][2],commands.help);});
test('commands addressed to another bot ignored',()=>assert.equal(trigger(message('/help@OtherBot').message,'999'),null));
test('unknown command silent',()=>assert.equal(trigger(message('/dance').message,'999'),null));
test('current economics use gross then net and four buckets',async()=>{const f=fixture();await f.post(message('@HOSTPAYRoboBot what are the fees?'));await f.drain();assert.equal(f.calls[0][2],economics);for(const value of ['1.20% GROSS','40% Developer','30% HOST Holders','20% Treasury','10% Host Community','physical net'])assert(economics.includes(value));assert(!/1\.00%|1\.14%|5%/.test(economics));});
for (const [text,reason] of [['Send me your seed phrase','SEED_SOLICITATION'],['Please provide your private key','PRIVATE_KEY_SOLICITATION'],['send funds to verify your wallet','FUNDS_FOR_VERIFICATION']]) test(reason,async()=>{const f=fixture();await f.post(message(text));await f.drain();assert.deepEqual(f.calls.map(c=>c[0]),['delete','send']);assert.equal(f.logs[0].reason,reason);assert(!JSON.stringify(f.logs).includes(text));});
test('ambiguous wallet/security discussion not deleted',async()=>{for(const text of ['I need wallet support','Never send your seed phrase','Do not share your private key','How does a wallet key work?','> Send me your seed phrase','Someone reported: send funds to verify your wallet']){assert.equal(dangerReason(text),null);const f=fixture();await f.post(message(text));await f.drain();assert.equal(f.calls.length,0);}});
test('delete failure still warns safely',async()=>{const f=fixture({failDelete:true});await f.post(message('Send your private key'));await f.drain();assert.equal(f.logs[0].action,'DELETE_FAILED');assert.equal(f.calls[1][0],'send');});
test('send failure is safe metadata',async()=>{const f=fixture({failSend:true});await f.post(message('/help'));await f.drain();assert.equal(f.logs[0].action,'SEND_FAILED');});
test('bot messages do not loop',async()=>{const f=fixture();const u=message('/help');u.message.from.is_bot=true;await f.post(u);await f.drain();assert.equal(f.calls.length,0);});
test('edited dangerous message moderated but normal edit never replies',async()=>{const f=fixture();let u=message('/help');u.edited_message=u.message;delete u.message;await f.post(u);await f.drain();assert.equal(f.calls.length,0);u=message('Send your private key');u.update_id=2;u.edited_message=u.message;delete u.message;await f.post(u);await f.drain();assert.equal(f.calls[0][0],'delete');});
test('no unsolicited private destination',async()=>{const f=fixture();const u=message('/start');u.message.chat={id:123,type:'private'};await f.post(u);await f.drain();assert.equal(f.calls[0][1],123);});
test('client uses only allowed methods and plain bounded text',async()=>{const sent=[];const c=telegramClient({token,fetchImpl:async(url,options)=>{sent.push({url,body:JSON.parse(options.body)});return {ok:true,json:async()=>({ok:true})};}});assert((await c.sendMessage(1,'x'.repeat(5000),2)).ok);assert((await c.deleteMessage(1,2)).ok);assert.equal(sent[0].body.text.length,4000);assert.equal(sent[0].body.parse_mode,undefined);assert.equal(Object.keys(c).sort().join(','),'deleteMessage,sendMessage');});
test('Telegram 429 is bounded and not retried',async()=>{let sends=0;const c=telegramClient({token,fetchImpl:async()=>{sends++;return {status:429,json:async()=>({ok:false,error_code:429,parameters:{retry_after:60}})};}});assert.equal((await c.sendMessage(1,'a')).reason,'RATE_LIMIT');await c.sendMessage(1,'b');assert.equal(sends,1);});
test('token and webhook secret never appear in errors or logs',async()=>{const capture=[];const c=telegramClient({token,fetchImpl:async()=>{throw Error('secret '+token+' '+secret);}});capture.push(await c.sendMessage(1,'hello'));const f=fixture({failSend:true});await f.post(message('/help'));await f.drain();capture.push(f.logs);const output=JSON.stringify(capture);assert(!output.includes(token));assert(!output.includes(secret));assert.equal(capture[0].reason,'TRANSPORT_UNKNOWN');});
test('Telegram rejection description is never echoed',async()=>{const c=telegramClient({token,fetchImpl:async()=>({ok:false,json:async()=>({ok:false,description:token+secret})})});const output=JSON.stringify(await c.deleteMessage(1,2));assert(!output.includes(token));assert(!output.includes(secret));});
test('transport timeout not retried',async()=>{let calls=0;const c=telegramClient({token,timeoutMs:1,fetchImpl:async(_u,o)=>{calls++;assert(o.signal);throw Error('AbortError');}});assert.equal((await c.sendMessage(1,'a')).reason,'TRANSPORT_UNKNOWN');assert.equal(calls,1);});
test('scheduling failure releases claim for retry',async()=>{const cache=updateCache();const h=webhook({env,cache,processUpdate:async()=>{},schedule:()=>{throw Error('scheduler');}});const r=await h(new Request('https://hostpay.invalid',{method:'POST',headers:{'content-type':'application/json','x-telegram-bot-api-secret-token':secret},body:JSON.stringify(message())}));assert.equal(r.status,503);assert(cache.claim(1));});

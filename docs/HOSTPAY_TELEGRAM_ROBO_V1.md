# HOSTPAY Telegram ROBO V1

Date: 2026-10-03. Scope: SpotCEO/hostpay, main, Vercel SPOT Platform / hostpay.
Starting commit: `91eefd97798cd6129f7799f0b0dad0b7d5922b71`.

## Identity and status

- Bot: **@HOSTPAYRoboBot**, HOSTPAY ROBO.
- Community: **HOSTPAY | Official Community**.
- Website: https://www.hostpayapp.com
- Webhook: https://www.hostpayapp.com/api/telegram
- Mode: **DETERMINISTIC COMMUNITY BETA**. The repository had no production AI/provenance API to reuse. The existing homepage has a rules preview, not a live model or provenance service.
- Deployment-specific results, commit and manual smoke-test status are recorded separately in the deployment report. Implementation tests alone do not prove a live user round-trip.

## Architecture

Telegram POST → header authentication → bounded JSON/shape validation → warm-instance update deduplication → fast HTTP 200 → Next.js `after` processing → deterministic response or conservative moderation → Telegram API.

`app/api/telegram/route.js` is a Node server route. `lib/telegram/official.mjs` is the single Telegram-facing facts source. `engine.mjs` controls triggers/moderation; `client.mjs` exposes only sendMessage/deleteMessage; `webhook.mjs` handles admission. No browser bundle imports the Telegram client or environment secrets.

The existing V4 `app/page.jsx` and public art remain unchanged. A minimal, unstyled root layout is required by Next.js; no homepage redesign was performed. The lockfile pins the existing package declarations for reproducible builds. Resolved versions: Next.js 16.3.8, React/React DOM 19.3.0.

## Environment and security

| Variable | Purpose |
|---|---|
| TELEGRAM_BOT_TOKEN | Existing Production non-exportable Vercel secret; never pulled, displayed or committed |
| TELEGRAM_WEBHOOK_SECRET | Newly generated 256-bit random secret, sent through CLI stdin directly to Production |
| TELEGRAM_SETUP_UNTIL | Bounded ISO expiry for the authenticated registration endpoint |
| TELEGRAM_ENABLED | Optional; literal `false` fails the webhook closed with HTTP 503 after redeployment |

Missing token/configured secret fails closed (503). Missing/wrong header fails (401). Equal-length SHA256 digests are compared with timingSafeEqual. Requests require JSON, maximum 64 KiB, and validated identifiers/message shape. Unsupported update types return 200 without processing. GET exposes only a fixed harmless status string.

Actual secret values never enter source, reports, test logs or evidence files. `.env*`, `.vercel`, dependencies and build output are ignored. TLS certificate validation remains enabled; local CLI uses the operating system trust store.

ROBO has **no wallet keys, seeds, signing, custody, treasury, registry, allocation or Solana authority**. It never proactively opens a DM. It replies only in the incoming chat. No auto-ban or restrict operation exists. Client errors and logs omit raw requests, message contents, Telegram API URLs, credentials and raw error descriptions. Logs use only time/update/chat/message/action/reason/trigger metadata.

## Commands and speaking rules

Supported: `/start`, `/help`, `/about`, `/rules`, `/security`, `/official`, including the `@HOSTPAYRoboBot` command suffix. Other bots' commands and unsupported commands remain silent.

Normal group chat stays silent. Exact bot mentions and replies to messages authored by the token's actual bot ID trigger deterministic answers. Bot messages, channel updates and sender-chat messages are ignored. Edited messages undergo moderation only; they do not repeat ordinary replies.

Rules forbid scams, spam, impersonation, harassment and guaranteed-return statements presented as official. Security responses warn against sharing seeds/private keys, verification payments and unsolicited support DMs. Pasted addresses and HPAY suffixes never establish official provenance. The official X link is https://x.com/HOSTPAY_SOL, sourced from the existing approved homepage. HOST mint, public wallets and child directory are **Not yet officially published** in Telegram configuration until an authoritative public source is supplied.

## Economics

The Telegram bot states **1.20% GROSS** nominal child-token creator/platform fee. External venue/protocol deductions occur first. Qualified actual physical net HOSTPAY creator revenue received is allocated **40% Developer / 30% HOST Holders / 20% Treasury–Operations / 10% Host Community**. No permanent 1.14% net rate or permanent external 5% deduction is promised. No profits, eligibility, live balances or payouts are guaranteed.

The preserved homepage still contains its pre-existing 1% preview language. This task's explicit homepage-preservation boundary prevents changing it; Telegram uses the newer founder-authorized 1.20% decision. Updating that website copy is separate work.

## Moderation and operational limits

Narrow English imperative patterns detect explicit seed/private-key requests and funds-for-wallet-verification solicitations. A match in a group attempts deletion and a fixed safety warning, throttled to one warning per chat per 30 seconds. Deletion permission errors are handled safely. No user is banned. Generic words, unknown links, quoted examples and negated educational warnings do not justify deletion.

This is a foundation, not comprehensive anti-scam protection: obfuscation, other languages, indirect impersonation and novel drainer links may be missed. Human moderators remain necessary. Privacy/admin settings are founder-supplied; deletion permissions require real group observation.

Duplicate suppression and warning/rate-limit state are bounded **warm-instance memory**, not durable cross-instance guarantees. Registration uses max_connections=1, but cold starts/overlapping instances can still duplicate processing. Acknowledged updates are not durably queued: a post-ack crash or failed Telegram send can lose a response. No retry-until-success loop is used. Telegram 429 retry_after creates bounded local cooldown; a timeout is an ambiguous send outcome and is not blindly retried. Plain-text output is length-limited; link previews are disabled.

## Deployment and webhook registration

Commit only the Telegram backend/tests/docs, required root layout and lock/ignore configuration. Push main and use the linked Vercel Production deployment, or authenticated `vercel deploy --prod --yes --scope spotplatform` if needed. Do not touch the separate C:\HOSTPAY\app Solana repository.

The existing bot token cannot be exported by the Vercel CLI. Therefore `/api/telegram/setup` performs registration **inside the deployed runtime**. Before its expiry it requires the webhook-secret header and accepts no arbitrary destination, chat, message or Telegram method. It checks getMe is HOSTPAYRoboBot, calls setWebhook for the fixed official URL with secret_token, message/edited_message updates, max_connections=1 and drop_pending_updates=false, then checks getWebhookInfo. Its response contains only safe identity/status/error-presence fields. After TELEGRAM_SETUP_UNTIL it fails closed; it is not a permanent general-purpose bot control API.

Telegram does not return the configured secret in getWebhookInfo. Secret use is established by the successful setWebhook request and independent endpoint authentication tests, not by claiming Telegram echoed it.

## Tests and smoke test

Run `node --test tests/telegram.test.mjs` and `npm run build`.

46 mocked tests cover all six commands, command suffix, mention/reply identity, chatter silence, economics, authentication, malformed/oversized payloads, duplicates, scheduling errors, moderation/quoted discussion, safe delete/send failure, timeout/rate-limit behavior, sanitized errors and fixed authenticated setup. No automated test sends a live Telegram message.

Production checks: homepage rendering, harmless GET, missing/wrong header rejection, authenticated malformed JSON rejection and unsupported update acknowledgement. These are endpoint checks, not a fabricated user message.

If no genuine incoming test message is available, founder sends exactly:

`@HOSTPAYRoboBot hello`

Expected reply: “Hi! I’m HOSTPAY ROBO. I can help with HOSTPAY rules, fees and community safety. My full community brain and live provenance feed are still being connected. Try /help.”

Only an observed genuine update plus successful Telegram response can upgrade LIVE TELEGRAM ROUND-TRIP from MANUAL TEST REQUIRED to PASS.

## Rollback

1. For immediate code rollback, run `vercel rollback dpl_3DkVkkVE32Tw49MhXy7kj9zKioTG --scope spotplatform` from the linked project. This restores the prior V4 deployment; it does not unregister Telegram's webhook.
2. To disable processing on this implementation, set TELEGRAM_ENABLED=false for Production and redeploy. HTTP 503 preserves fail-closed behavior but Telegram will retry pending updates; this is a temporary stop, not queue cleanup.
3. To unregister, use an authorized server runtime with the existing TELEGRAM_BOT_TOKEN injected, call Telegram `deleteWebhook` with `{drop_pending_updates:false}`, then `getWebhookInfo` and verify an empty URL. Do not place the token in shell arguments, terminal URLs, source or output. The one-purpose setup route deliberately cannot invoke deleteWebhook. A scoped temporary rollback handler may be deployed when needed; do not export the non-exportable token merely to run a local command.

Example for an authorized environment-injected server runtime (never print the request URL or caught exception):

```js
const response = await fetch('https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/deleteWebhook', {
  method: 'POST', headers: {'content-type': 'application/json'},
  body: JSON.stringify({drop_pending_updates: false}), signal: AbortSignal.timeout(7000),
});
const result = await response.json();
console.info({webhookDeleted: response.ok && result.ok === true});
```

No token revocation is needed absent compromise. Removal of a Vercel environment value only affects new deployments; existing deployments retain their environment snapshot.

## Future work

Connect a read-only authoritative provenance/model service with source attribution, scoped tools, abuse/cost controls and explicit unavailable-data behavior. Add durable idempotency/queueing before promising reliable delivery. Keep signing and reward execution outside ROBO. X integration requires a separately authorized account and publishing policy; the existing public X link is informational only; no X keys or posting connection was added.

Official references accessed 2026-10-03: [Telegram Bot API / setWebhook](https://core.telegram.org/bots/api#setwebhook), [Next.js after](https://nextjs.org/docs/app/api-reference/functions/after).

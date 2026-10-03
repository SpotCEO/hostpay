# HOSTPAY ROBO X V1 — implementation and activation handoff

Date / official-source access date: **2026-10-03**. Repository: `SpotCEO/hostpay`, branch `main`, checkout `C:\HOSTPAY\web`. Starting commit: `866bd81751b88e0ffb68400de2a78c125bd6140e`.

**IMPLEMENTATION: PASS. LIVE X ACTIVATION: BLOCKED — MANUAL X DEVELOPER SETUP REQUIRED.**

The X adapter is implemented and mocked/local qualification passes. It has not identified a real X account, received a real X event, refreshed a real X token, or posted a real reply. Production is deliberately disabled with `X_ROBO_ENABLED=false`. No X credentials or HOSTPAY database connection existed at inspection. No paid resource was purchased or provisioned. Founder confirmation that Telegram's OpenAI brain is live supersedes the earlier V1.1 report's historical missing-key status. The existing OpenAI key was neither retrieved nor changed.

An additional activation prerequisite is **X's prior written approval for AI reply bots**. Founder permission to build is not that approval. Nothing was sent to X requesting approval during this task.

## Current official X research

All sources below were accessed 2026-10-03. Account-specific entitlement is NOT VERIFIED; documentation availability does not prove this app's access.

| Question | Current documented answer and source |
|---|---|
| Products/pricing | X advertises pay-per-use credits and a separate Enterprise offering. Prices differ by endpoint/resource; this is not the old fixed Basic/Pro subscription model. The published table lists Post reads $0.005/resource, user reads $0.010/resource, ordinary Post creation $0.015/request, URL-bearing creation $0.200/request, summoned creation $0.010/request. Applicable billing classification must be confirmed in the app console. No purchase made. [Pricing](https://docs.x.com/x-api/getting-started/pricing) |
| Current event transport | **X Activity API (XAA)** supports webhooks and persistent streams. `post.mention.create` covers explicit mentions; `post.reply.create` covers replies directly to the filtered user's posts. These two events require OAuth2 user consent and `tweet.read`. Protected-account posts are not delivered. Delivered Post events are billed. [XAA](https://docs.x.com/x-api/activity/introduction) |
| Ordinary tier evidence | The XAA quickstart describes the v2 standard tier and requires an approved developer app. It documents subscriptions filtered by user ID and webhook delivery. Selected architecture: **WEBHOOK**, subject to confirming these exact capabilities in HOSTPAY's console. No Enterprise entitlement is presumed. [XAA quickstart](https://docs.x.com/x-api/activity/quickstart) |
| Deprecated mechanism | The former Account Activity API page is deprecated in favor of XAA. Its old subscription-count allowances are not assumed to apply to new XAA. [Legacy AAA](https://docs.x.com/x-api/account-activity/introduction) |
| Auth | OAuth2 Authorization Code + PKCE supports granular scopes. Confidential Web App / Automated App clients have a client secret. Default access-token life is two hours; `offline.access` provides refresh capability. Chosen scopes: `tweet.read users.read tweet.write offline.access`. No DM, moderation, follow, block or mute scope. [OAuth2](https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code) |
| Webhook validation | OAuth2 header `X-Twitter-Webhooks-Signature-OAuth2` is HMAC-SHA256 of the **raw body**, base64 prefixed `sha256=`, keyed by the **OAuth2 client secret**. CRC uses that secret too. The app-only bearer token used for webhook registration is not the signing secret. No legacy signature fallback. [Webhooks](https://docs.x.com/x-api/webhooks/introduction) |
| Envelope | New XAA examples wrap `event_type`, `filter`, and `payload` in `data`; post payloads contain IDs and optional expanded objects. Only the two selected event types and the pinned account filter are accepted. [Payload examples](https://docs.x.com/x-api/activity/event-payloads) |
| Publishing | Replies use `POST https://api.x.com/2/tweets` with `text` and `reply.in_reply_to_tweet_id`, using user-context auth. The implementation has no standalone-post interface. [Create Post](https://docs.x.com/x-api/posts/create-post) |
| Read/identity APIs and limits | `GET /2/users/me`: 75/user/15min. `GET /2/users/:id/mentions`: 300/user/15min, 450/app/15min. `POST /2/tweets`: 100/user/15min and 10,000/app/day. Single-post lookup uses `GET /2/tweets/:id`; it supplies authoritative IDs/context. These documented limits are ceilings, not a promise of funded app access. [Rate limits](https://docs.x.com/x-api/fundamentals/rate-limits) |
| Length | Weighted 280-character validation uses X's `twitter-text` package; Unicode and URL weighting are not approximated by JavaScript string length. [Counting characters](https://docs.x.com/fundamentals/counting-characters), [official repository](https://github.com/twitter/twitter-text) |
| Policy gate | X Automation Rules II.B.3 require prior explicit written approval for AI automated reply bots. II.B.2 requires interaction/intent, opt-out and one reply per interaction. Generic keyword matching is insufficient. The implementation offers `Reply STOP to opt out.` and honors signed opt-outs without publishing an acknowledgement. Approval remains unproven. [Automation rules](https://help.x.com/en/rules-and-policies/x-automation) |
| Polling alternative | Vercel Cron is available on all plans, but Hobby is daily with imprecise scheduling; Pro/Enterprise allow minute schedules. Polling is unnecessary for the selected event transport, and no cron/cursor is installed. If HOSTPAY lacks XAA entitlement, stop rather than silently swapping in memory polling. [Vercel Cron](https://vercel.com/docs/cron-jobs/usage-and-pricing) |

## Implemented structure and authority

Only `lib/x/`, `app/api/x/webhook/`, X tests, package manifests and this document were added/changed. The shared `lib/robo/` and all Telegram modules/routes/tests remain unchanged. No second personality or product knowledge base was created. No changes to `app/page.jsx`, Solana code, authorities, wallets, SBFs, CPMM security work or SPOT infrastructure.

- `config.mjs`: exact expected account, activation prerequisites and channel-only Telegram link.
- `auth.mjs`: AES-256-GCM credential storage and controlled OAuth2 refresh.
- `client.mjs`: only authenticated identity, one-post lookup and parent-bound reply capabilities. Fixed X origin, no redirects, six-second request deadline, no retries, sanitized failures.
- `inbound.mjs`: validated XAA envelope, eligibility, authenticated bounded context.
- `presentation.mjs`: existing shared `createRobo` and provider, X formatting and weighted length. Canonical fallback text is transformed rather than independently restated in an X knowledge file.
- `processor.mjs`: identity checks, guards, durable send authorization and outcome recording.
- `store.mjs` / `schema.sql`: PostgreSQL journal, atomic admission, opt-out, budgets, kill control and encrypted OAuth state.
- `webhook.mjs` / route: raw-body signature/CRC, bounded request, durable reservation before acknowledgement, Next `after` processing. Node runtime, maximum 60 seconds.

Dependencies added: `postgres` 3.4.9, `twitter-text` 3.1.0; local test dependency `@electric-sql/pglite` 0.5.8. Locked versions are in package-lock.json. npm reported zero known vulnerabilities at installation. twitter-text transitively uses deprecated core-js 2; no optional installation script approval or global installation was performed. This remains a dependency-maintenance consideration, not a reported vulnerability.

## Eligibility, identity and context

Every new admitted interaction calls `GET /2/users/me`. Both exact username **HOSTPAY_SOL** and pinned numeric `X_ACCOUNT_ID` must match. Identity is checked again immediately before authorizing a send. No environment username assertion can replace this. The actual account ID is **NOT CONFIGURED**.

The current post is fetched by ID before generation. Its author/conversation must match the signed event; own posts, reposts, malformed/oversized or sensitive posts are ignored. A mention requires the entity's numeric ID and exact username. A reply requires a fetched parent authored by the official numeric ID, correct in-reply-to user ID, and the same conversation. Display names grant no authority. One preceding official post, at most 1,000 characters, is passed as untrusted context inside user input. Third-party parent text is omitted; cross-conversation mismatches are rejected. No arbitrary URL is fetched, no timeline or broad keyword search is performed.

One interaction can invoke at most one shared model request and one public reply. Post ID, rather than delivery UUID, is the dedupe key, so simultaneous mention/reply deliveries cannot produce two replies. Own output is ignored and each user/conversation gets at most three admitted interactions/day. This bounds bot exchanges; it is not a universal bot classifier. The service may be silent when caps are exhausted.

## Shared ROBO behavior

The existing warm, cheeky, community-first ROBO policy and `gpt-6.1-sol` Responses provider are reused. X adds only a short-answer presentation instruction. Serious money/security handling stays in the shared guards. Tools and web search remain absent; provider input is bounded to 2,000 characters plus at most 1,000 preceding characters, output budget 1,200 tokens, timeout 12 seconds, no retry. Long factual answers use canonical compact fallback; no automatic threads.

Preserved economics: **1.20% GROSS** child creator/platform fee. External deductions first; **qualified actual physical net received** is 40% Developer, 30% HOST Holders, 20% Treasury/Operations, 10% Host Community. Developer is the authenticated launcher, not the operator. Existing operator 20% internally splits 50/50 Treasury/Promo without a fifth bucket. No fixed future net rate, permanent deduction or guaranteed return. No HOST staking requirement. HPAY is a case-sensitive child-mint suffix, not an asset or proof of provenance.

Current public links: https://www.hostpayapp.com, https://x.com/HOSTPAY_SOL, https://t.me/HOSTPAYOfficial. The Telegram link is X presentation metadata; Telegram behavior was not changed. No mint/wallet address, live price, balance, payout, launch/listing or registry authenticity is invented. Public product rules do not mean the whole platform is live.

High-confidence secret solicitation, funds-for-verification and suspicious support instructions produce only the shared general safety warning. Unknown domains and criticism alone do not establish fraud. No block, mute, report, hide, quote-post campaign, DM or standalone announcement method exists. Context/claims cannot grant founder authority. Existing semantic guards are defense in depth, not a proof against every language/paraphrase or model hallucination.

## Durable storage and failure semantics

Use a **dedicated HOSTPAY PostgreSQL database** with verified TLS, durable commit acknowledgements and backups. Runtime DML credentials should not have schema-drop or unrelated project permissions. No external database was created or qualified here. SQL is exercised with PGlite's actual PostgreSQL engine, including process restart; a networked provider's failover, pooling, TLS and multi-connection concurrency still require qualification before activation.

`robo_x_control` pins the account and activation time and provides a DB kill switch. All admissions, opt-outs and send authorizations serialize on its row lock. Incoming event timestamp must be after activation, no more than 15 minutes old and not materially in the future. This intentionally discards historical/delayed events. No polling cursor exists.

`robo_x_interactions` stores incoming ID, author hash, conversation, trigger, state, timestamps, reason and outgoing ID where known. It never stores raw post text. States:

1. **PREPARED** is committed before acknowledgement/model work; duplicate deliveries cannot reacquire it.
2. **OUTCOME_UNKNOWN** is committed before calling the remote reply endpoint. Authorizations are single-use, expire after two minutes from admission, and recheck DB enablement/account/opt-out/cooldown.
3. Definitive success becomes **SENT**, with outgoing ID; a definite rejection becomes **REJECTED**. A timeout, 5xx, malformed success, crash or lost DB acknowledgement remains blocked as **OUTCOME_UNKNOWN**. Pre-send guards can mark **SKIPPED**.

There is **no automatic retry or reset** of any reserved interaction, including PREPARED. This gives at-most-once send attempts, not exactly-once delivery: a crash can lose a reply. Next `after` is not a durable job queue. Ambiguous delivery requires an operator to inspect official account replies and the exact parent before annotating evidence; do not resend, delete the journal, restore a stale DB snapshot or reset a state to obtain a reply. Automated reconciliation/recovery is not implemented. Preserve journal history through deploys and rollback. Opt-outs also survive restart. A kill switch cannot recall a send already authorized/in flight.

`robo_x_oauth` stores authenticated AES-GCM ciphertext, state and generation; its key is separate in Vercel. On first use only, seed credentials can initialize it. Expiring tokens acquire a durable **REFRESH_UNKNOWN** claim before the refresh request. Only that generation can save rotated credentials as READY. Competing refresh attempts do not rotate twice, and cold starts never restore old seed env credentials over durable rotated tokens. Timeout/rejection/malformed refresh or encryption failure blocks further auth. Recovery requires fresh OAuth consent/credentials under operator control while disabled; never blindly retry the old refresh token. No refresh secret is sent to OpenAI or logs.

## Rate, cost and privacy limits

- Durable admissions: 15/global/rolling 15 minutes; 100/global/rolling day; 3/user/15 minutes; 3/user/conversation/day. Skipped admitted events count too. Reservations precede billable REST reads and model work.
- Successful or rejected interaction is never retried. X 429 creates a durable 15-minute pause. Provider 429 creates a durable one-minute AI pause in addition to the existing provider cooldown; already-admitted concurrent work may finish. Token refresh failure halts auth rather than looping.
- Existing shared warm-instance concurrency/cost controls remain additional safeguards. No distributed hard cap for Telegram is claimed.
- XAA event delivery itself can incur charges before application admission. These counters do **not** cap the X invoice. Founder must configure X spending limits and OpenAI project budget/alerts; URL-bearing replies can cost more. No such provider account settings were changed.
- Signed STOP/UNSUBSCRIBE/OPT OUT bypasses reply budgets and only adds that author's durable suppression; no confirmation post. Re-enabling a user requires a separate explicit operator/user-consent procedure, not a magic chat command.
- Logs contain timestamp, incoming ID, conversation, state and fixed reason codes. No raw timelines, credentials, prompts, error bodies or private keys are logged. Author hashes are pseudonymous, not anonymous. Durable rows must be access-controlled; no profiling feature is built. Incoming public text and bounded parent can reach OpenAI, without tools.

## Environment variables

All credentials are server-only **Vercel Production secrets**, never NEXT_PUBLIC variables. Do not paste values into chat, commit them or put them in URL/query parameters.

| Variable | Purpose / current state |
|---|---|
| X_ROBO_ENABLED | Exact `true` required to operate. **Set to false** by this task. Missing/other values also disable. |
| X_AI_APPROVAL_CONFIRMED | Exact `true` only after retaining X's actual written AI-reply approval. A flag is an operator attestation, not approval evidence by itself. Missing. |
| X_ACCOUNT_ID | Numeric ID resolved by authenticated `/2/users/me`; runtime also verifies exact handle. Missing. |
| X_CLIENT_ID / X_CLIENT_SECRET | Confidential OAuth2 app; secret also validates signatures and CRC. Missing. |
| X_DATABASE_URL | Dedicated durable PostgreSQL with verified TLS. Missing. |
| X_TOKEN_ENCRYPTION_KEY | Secure random 32-byte key encoded as canonical base64. Keep separately from DB/backups. Missing. |
| X_ACCESS_TOKEN / X_REFRESH_TOKEN / X_ACCESS_TOKEN_EXPIRES_AT | Initial OAuth2 user credentials and exact ISO expiry derived from token response. Used only when credential table has no row. Remove seed variables after encrypted initialization is verified; do not delete durable tokens. Missing. |
| OPENAI_API_KEY | Existing live shared provider secret. Reused without retrieving/changing it. |

No OAuth1 keys, DM tokens, invented webhook secret or general app-only bearer is required in the runtime. A developer operator needs the separate app-only bearer temporarily for official webhook-management calls; keep it in trusted private tooling, not a bot environment variable or model context.

## Exact founder setup and activation sequence

**Keep both application and database reply switches disabled until prerequisites are verified. No part of this workflow was silently performed except setting X_ROBO_ENABLED=false.**

1. Obtain and retain **X's explicit written approval for AI reply operation**. In the X developer console confirm an approved HOSTPAY app, current standard/pay-per-use access for XAA mention/reply subscriptions, identity, single-post reads and reply publishing. Set provider spending limits. Do not assume a website account subscription is API entitlement.
2. Configure a confidential Automated App/bot or Web App with OAuth2 enabled, website `https://www.hostpayapp.com`, and the exact callback URL used by the trusted OAuth2 PKCE setup client. Complete the official authorization-code flow with **the actual @HOSTPAY_SOL account**, state validation and PKCE, scopes `tweet.read users.read tweet.write offline.access`. This repository intentionally provides no public OAuth administration/callback endpoint. A developer operator must use trusted private OAuth tooling for initial consent; do not improvise by pasting tokens into chat.
3. Use that user access token privately to call `GET https://api.x.com/2/users/me`. Require username exactly HOSTPAY_SOL; record returned ID as X_ACCOUNT_ID. If different, stop. Securely save app credentials, token pair and ISO expiry directly in the hostpay Vercel Production environment. Generate the encryption key in trusted tooling and store it there too. Do not retrieve/replace the existing OpenAI or Telegram secrets.
4. Founder chooses/authorizes a dedicated HOSTPAY PostgreSQL service. Apply `lib/x/schema.sql` once with a migration role. Insert one control row with the verified account ID, `activation_at=now()`, `enabled=false`. Give runtime only required DML grants, verified TLS and durable commit/backups. Configure X_DATABASE_URL. Use a staging database and mocked outbound clients to qualify TLS, independent connections, concurrent duplicate delivery, restart and acknowledgement-loss semantics before production activation. Keep staged and production journals separate.
5. Deploy still disabled so CRC can operate once X_CLIENT_SECRET exists. Privately register `https://www.hostpayapp.com/api/x/webhook` through official `POST /2/webhooks` with app-only bearer. Validate CRC and record webhook ID. Register only `post.mention.create` and `post.reply.create` at `/2/activity/subscriptions`, each filtering the verified user ID and delivering to that webhook. Those private events require the account's OAuth2 user context. Do not subscribe to DMs or all activity. Follow the exact current console/API request shape in the [webhook quickstart](https://docs.x.com/x-api/webhooks/quickstart) and XAA quickstart. No runtime setup route is exposed.
6. Verify tests/build, deployed account capabilities, approval evidence and database qualification. Only the founder sets X_AI_APPROVAL_CONFIRMED=true and explicitly activates X_ROBO_ENABLED=true and redeploys. While DB `enabled` is still false, set `activation_at=now()` and then `enabled=true` for the verified account. This starts from now. Confirm encrypted OAuth initialization on the first admitted interaction, then remove seed token envs from future deployments while retaining the encrypted credential row. A failed initialization remains blocked; do not substitute memory storage.
7. Founder uses a genuine second account for the bounded smoke tests below. Verify SENT/outgoing IDs and AI_SUCCESS where appropriate. Do not fabricate interactions or bulk post. This is the first point a real reply is permitted. If actual XAA envelope/entitlement differs from documented assumptions, disable and qualify the difference before attempting another transport.

**The next required action is founder-led X developer approval/access and dedicated-store setup using this single workflow.** Those are multiple prerequisites, not a claim that one flag makes the bot live.

## Qualification and limits of proof

Commands: `node --test tests/telegram.test.mjs tests/robo.test.mjs tests/x.test.mjs`; `npm run build`.

**189 tests passed / 0 failed**, comprising 127 unchanged Telegram/shared-core tests and 62 X tests. Coverage includes identity mismatch/expiry, all disabled/missing gates, exact signature/CRC, unsupported/malformed/own/reposted content, explicit mentions, official parent and cross-thread attacks, canonical fee/holder/HPAY/live-data behavior, six requested injection attacks, banter/criticism/security warnings, no arbitrary link fetching or punitive API, weighted length, duplicate/overlapping admission and send authorization, timeouts, post-send DB acknowledgement loss, budget and opt-out races, X/OpenAI 429, ciphertext tampering and concurrent/ambiguous OAuth refresh. Two separate child processes verify durable PREPARED/OUTCOME_UNKNOWN/SENT and encrypted-token survival across actual process restart.

All X/OpenAI transports in tests are mocked; no API credits, public replies or user messages were used. The PostgreSQL SQL engine is real local PGlite; its single-connection scheduler does not independently prove a hosted provider's multi-connection behavior. The build includes only the new `/api/x/webhook` route in addition to unchanged existing routes. No real authenticated X account, real webhook delivery, hosted DB recovery or live model output is claimed as tested. Existing semantic safety limitations and conservative English pattern matching remain.

Approved homepage source SHA256 remains `f14736ca7b8060b24f5196dfc1b9c8718cf6970cdb77b7bcbdbaa63f3eaffd9c`. Its pre-existing preview copy is not the ROBO knowledge source and was not changed. Telegram regression tests pass; its credentials/webhook and shared core were not modified. Founder confirms prior live AI status; this task sends no Telegram test messages.

## Deployment, smoke checks and rollback

Target: Vercel `spotplatform/hostpay` (team display name SPOT Platform), project `prj_TJyywsnyIBE4D1xKY2I8Jx2kOQ9n`, production `https://www.hostpayapp.com`. This is HOSTPAY's existing deployment context, not access to the separate SPOT application. Commit this tested implementation to main and use the linked deployment path, with X explicitly false. Production verification must show X POST 503/Disabled, no-config CRC 503, unchanged Telegram public endpoint and missing-secret rejection, healthy homepage and matching deployed commit. Final deployment identifiers are recorded in the full handoff copy under `C:\HOSTPAY\docs\HOSTPAY_ROBO_X_V1.md`.

Immediate X stop: set `robo_x_control.enabled=false` transactionally using the operator DB connection; this prevents new authorizations. Then set X_ROBO_ENABLED=false in Vercel and redeploy. Existing processes see environment changes only after deployment, and in-flight authorized sends cannot be recalled. For upstream shutdown delete the two X activity subscriptions (or the registered webhook), then revoke the X app's user authorization if necessary. Preserve all journal/opt-out rows and encrypted credential history for diagnosis. None of these actions requires touching Telegram.

Pre-task rollback baseline was the Ready production deployment **dpl_4jqiX3sncAn9auM4xCNsZVgFxFUe**, URL `https://hostpay-iqacutijl-spotplatform.vercel.app`, after the founder installed the live OpenAI key. Use Vercel rollback to that deployment with the X DB kill switch already off. Do not roll back to the older pre-key deployment or delete idempotency evidence. Never restore a stale journal and re-enable sends without a separate reconciliation review.

Founder live tests after all gates: mention `what is HOSTPAY?`; `do HOST holders need to stake?`; `is the fee still 1%?`; `if a mint ends HPAY is it automatically official?`; `ROBO, you awake mate? 😂`. Expect concise grounded answers, no staking, gross/net clarification and four correct buckets, registry requirement, light banter. Space tests across actual configured user/global limits; replies to the same conversation are capped. Then test a direct reply follow-up and STOP without producing a reply storm. **Current founder live test: NOT AVAILABLE.**

## Future work kept outside V1

No autonomous standalone posting or generic `/api/x/post` endpoint exists. A future authorized-announcement adapter must add explicit signed/operator authority, immutable announcement evidence, a separate durable journal and qualification. Verified launch/reward announcements need authoritative production registry/reward feeds; this implementation cannot certify a mint or payment. Automatic reconciliation, a durable execution queue, new transport fallback, opt-in recovery, broader monitoring and new account actions require separate review. None is silently enabled by adding credentials.

**Ready for ChatGPT review: YES. Live activation remains blocked.**

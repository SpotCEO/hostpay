# HOSTPAY ROBO V1.1 — personality and natural-language brain

Date: 2026-10-03. Repository: SpotCEO/hostpay, main. Local checkout: C:\HOSTPAY\web.
Starting commit: `5de8322acd1a4dc123c0c405bb6f02e6509d19c1`.
V1 rollback deployment: `dpl_449WS46QdrYk3vY1QwJ2nifWj7g5`.

## Result and activation boundary

Implementation and mocked qualification PASS: **127 tests passed, 0 failed**, comprising all 46 original V1 tests unchanged plus 81 V1.1 tests. Production build passes. No standalone lint/type-check scripts exist; Next build completed its framework checks. No test sends Telegram messages or spends production model credits.

At preflight, Vercel Production has TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET and TELEGRAM_SETUP_UNTIL, but **no OPENAI_API_KEY**. This release is safe to deploy in **DETERMINISTIC FALLBACK**. The OpenAI provider is implemented, but real model inference, account access and live conversational quality are **not qualified**. A model name appearing in official documentation does not establish account access.

Exactly one manual credential activation workflow: in Vercel → SPOT Platform → hostpay → Settings → Environment Variables, add **OPENAI_API_KEY** as a sensitive **Production** variable, save, and redeploy the latest main commit. Enter the value directly in Vercel, never in chat. Existing deployments do not inherit newly added environment variables. No additional key or arbitrary provider endpoint is required.

The founder's current task explicitly confirms V1's real Telegram → Vercel → ROBO → Telegram round-trip. This supersedes the earlier V1 report's pending manual check. It does not prove V1.1 AI operation. V1.1 live natural-language qualification remains blocked on the credential activation and subsequent founder smoke test.

## One brain, multiple channels

`lib/robo/knowledge.mjs` contains curated, versioned public facts, a safe fallback and the disabled welcome foundation. `policy.mjs` defines persona, authority boundaries and grounding instructions. `provider.mjs` calls the OpenAI Responses API. `safety.mjs` adds local request/output guards. `limits.mjs` bounds short-lived model use. `core.mjs` accepts message, bounded reply context and channel/rate-limit identities, and returns text plus safe outcome metadata.

Telegram's existing webhook admission/authentication, moderation, commands, duplicate suppression and outbound client remain in `lib/telegram/`. The adapter calls the shared core only after a valid mention/reply trigger. Commands and high-confidence moderation stay local. No generic AI tool can invoke Telegram administration or deployment. No X or website endpoint was added.

The provider receives only the curated policy, the triggered user's bounded text and one bounded preceding bot reply. Telegram IDs are used locally for short-lived rate counters, not sent to OpenAI. No broad history, persistent user profile, vector database, filesystem retrieval, web search, chain RPC, recursive agent loop or model tool is used.

## Personality

ROBO is warm, upbeat, cheeky, community-first and helpful. Light banter, an occasional “mate” and sparse emojis are welcome. He is not the founder and does not imitate the founder. He stays calm with angry users and factual with critics. No bullying, insults, humiliation, retaliation, slurs, degrading jokes or dogpiling.

**Fun by default; serious when money or security is involved.** Fees, rewards, provenance, credentials, scams and money movement require clear, precise language. Commands have warmer wording; /security and the existing moderation warning remain direct and serious. A reusable `welcomeMessage()` exists, but join automation is disabled: join updates neither invoke the model nor send welcome messages.

## Authoritative sources and supersession

Precedence: Product Contract → later founder-approved amendments → qualified security invariants → current technical documentation → older plans. A newer explicit founder decision overrides conflicting older language. This task's 2026-10-03 public knowledge requirements are the latest instruction.

The following local sources were inspected; only their public product facts were curated into the brain. Whole internal reports, wallet addresses and implementation details were not uploaded to the model:

| Source | Applied scope |
|---|---|
| C:\HOSTPAY\docs\HOSTPAY_PRODUCT_CONTRACT_V1.md | ID01–03, TK01–06, EC02–07, HH01–04, HC01–09, DA01–13, LA01/03/04 and relevant OPEN decisions O01–06/O17–18 |
| C:\HOSTPAY\docs\HOSTPAY_PRODUCT_CONTRACT_AMENDMENT_V1_2_120_BPS_CREATOR_FEE.md | 1.20% gross, deductions first, qualified physical net allocation; supersedes older 1.00% wording |
| C:\HOSTPAY\docs\HOSTPAY_FOUNDER_ARCHITECTURE_AMENDMENT_TREASURY_PROMO_V1.md | Operator 20% subdivided 50/50 internally; four public buckets remain |
| Current founder V1.1 task | Required personality, current knowledge, safety and channel boundaries |
| Existing V1 official configuration / approved homepage footer | Website, bot/community identity, informational official X link only |

Qualified security boundaries are respected as constraints, not published as evidence of mainnet readiness. No security code, executable or parked gate was re-reviewed, modified or resumed.

Knowledge includes: HOSTPAY / HOST / Launch. Reward. Grow.; intended 1 billion HOST, not asserted circulating supply; no staking, mandatory burn or inflationary rewards; case-sensitive HPAY suffix, not a token/reward asset; LaunchLab-style pre-graduation and Raydium CPMM post-graduation; only qualified attributable creator revenue, never unrelated external pool revenue.

Economics: **1.20% GROSS**, external deductions first, then **qualified ACTUAL PHYSICAL NET** at **40% Developer / 30% HOST Holders / 20% Treasury–Operations / 10% Host Community**. Developer means authenticated child launcher, paid in SOL. Treasury/Promo split only the operator 20% internally 50/50; no fifth public share. No fixed 1.14% net or permanent 5% deduction. Integer remainder policy remains open.

HH/HC rewards use on-market purchased HOST. HH snapshots have no staking or mandatory holding period. HC uses the selected external token community, with separate accounting and no staking; its proposed eligibility threshold and servicing order are not finalized. Purchase and distribution clocks are distinct. Approximate targets are conditional, never live countdowns or payment guarantees.

Developer access remains one developer-owned US$50-equivalent HOST bond per wallet, initially minimum 24 hours, not a per-token fee. Continuous lock/re-entry distinctions are retained. Valuation sources, cancelled-first-launch activation/maturity, additional re-entry lock terms and partial-unlock rules remain OPEN. Product intent does not imply those flows are production-ready.

## Unknown and unavailable information

Live registry, launches, prices, wallet holdings, balances, market caps, liquidity, listings, personal eligibility and payouts are not connected. HOST mint and verified child directory are not officially published to this assistant. A pasted address or HPAY suffix never authenticates a token. The public website's stale 1% preview is not a knowledge source; its visuals and copy remain unchanged under this task's boundary.

## Provider and cost controls

Provider: OpenAI Responses API, fixed `https://api.openai.com/v1/responses`. Model: **gpt-6.1-sol**, reasoning effort **low**, standard/default service tier. No Astra routing or automatic alternate model. Direct server-side fetch avoids adding a dependency.

- Credential: OPENAI_API_KEY only; never in source, logs, responses, command arguments or model input.
- Optional ROBO_AI_ENABLED=false forces deterministic fallback after redeployment. Existing TELEGRAM_ENABLED=false disables the whole webhook as documented in V1.
- One model call per permitted triggered message, no retries, tools or loops.
- User input maximum 2,000 characters; reject longer input before model use. Preceding reply maximum 1,000 characters.
- Maximum 1,200 output tokens, including reasoning; maximum accepted answer 2,200 characters. Incomplete/truncated answers fall back rather than publishing fragments.
- Model request deadline 12 seconds within the existing 30-second route allowance; Telegram send deadline remains 7 seconds.
- Per warm instance: 6 requests/user/minute, 20/chat/minute, 60 total/minute, 300 total/10 minutes and at most 2 in flight. Atomic synchronous admission prevents competing local requests exceeding the limits. Counters use hashed identifiers, expire and have bounded capacity; no text is stored.
- Provider 429 causes 60-second local cooldown; 401/403/404 cause 5-minute cooldown. No error body is logged and no immediate retry is made.

These in-memory controls are **not a global financial cap across Vercel instances or restarts**. A production OpenAI project budget and usage monitoring are recommended for stronger operational cost control; they are not configured or claimed here. Commands, critical safety responses, moderation and unknown live-data responses do not require a model call.

## Context, injection and privacy

Only a reply whose author has the actual bot ID and is_bot=true contributes preceding text. Usernames alone do not authenticate it. Mentioning ROBO while quoting another user does not import that user's text as bot context. The prior text is still untrusted and may be stale; it is serialized inside the user input, never promoted to an assistant/system instruction. Suspected credential/injection context is discarded.

Server instructions contain personality and public curated facts only, not deployment secrets. There are no model-accessible authority tools. Local guards cover prompt/config extraction, claimed founder/admin authority, secret requests, unsupported contract certification, old-fee overrides, profit guarantees and live lookups. Structured output requires an answer and approved fact IDs. Output checks reject malformed/incomplete results, unknown fact IDs, detected credential patterns, unapproved links, obvious guarantees, invented balances/actions, obsolete rates and tested allocation errors. Critical topic checks require relevant factual anchors. Private policy fragments are blocked; public product facts may be quoted.

These checks are defense in depth, **not a proof that all prompt injections or semantic hallucinations are impossible**. The mocked suite tests concrete attacks and transport behavior, not actual production-model quality or every paraphrase/language. A fact ID is a grounding hint, not cryptographic evidence of an answer's truth. Conservative validation can discard a valid model answer and substitute the authoritative fallback. Unlabelled/obfuscated sensitive text cannot be detected perfectly; users must never post credentials. Potential credential/seed patterns are handled locally where detected.

No prompts, raw provider errors, seed/private-key content, credentials or complete conversations are logged. Existing Telegram metadata logs add AI_SUCCESS/AI_FALLBACK and allowlisted reasons. `store:false` disables Responses application-state storage for these requests; this does not promise zero provider-side retention or override the provider's data policies. Only directly addressed content and bounded reply context are sent to OpenAI, not ordinary group chatter.

## Failure handling and retained V1 limitations

Missing/disabled credentials, rate limits, API rejection, timeout, refusal, incomplete JSON or rejected output return local authoritative answers or a brief reboot/help message. Static commands/security/moderation remain available. No raw error reaches Telegram.

V1's warm-instance duplicate suppression and best-effort Next `after` processing remain unchanged. An acknowledged update is not a durable queued job; a post-ack crash or ambiguous outbound timeout can lose a reply. Cross-instance exactly-once delivery is not claimed. Conservative English moderation may miss obfuscated scams. No auto-ban, no unsolicited DM, no wallet/seed/private-key authority, signing, Treasury authority, registry writes, reward allocation, deployment authority or Solana administration is granted to ROBO.

## Verification

Run `node --test tests/telegram.test.mjs tests/robo.test.mjs` and `npm run build`.

The 127 passing tests include the original 46 unchanged tests, all 19 requested factual questions in fallback and mocked-model paths, six explicit prompt-injection attacks, malicious provider output, natural generated prose, reply context/forgery, persona fixtures, OPEN/provisional rules, missing keys, transport errors, timeout setup, 429 cooldown, incomplete/refusal/malformed output, request bounds, input filtering, concurrency/rate windows, no model calls for ordinary chat/commands/joins/edits, and authenticated webhook → shared brain → mocked Telegram integration with duplicate suppression.

No automatic live OpenAI request or Telegram message was sent. Model inference after credential setup still needs evaluation. No new join path, X posting or website ASK ROBO UI was activated.

## Deployment and rollback

Deploy the tested Telegram/shared-core-only commit through main's linked GitHub/Vercel Production path. Keep the current webhook URL and secret; no setWebhook or credential rotation is necessary. Verify public GET /api/telegram, missing/wrong header rejection, Production readiness and unchanged homepage rendering/source hash. A post-deployment handoff copy records final commit/deployment evidence.

To roll back V1.1: `vercel rollback dpl_449WS46QdrYk3vY1QwJ2nifWj7g5 --scope spotplatform`. This restores the founder-confirmed V1 bot and approved website. Alternatively set ROBO_AI_ENABLED=false and redeploy to retain V1.1 grounded fallback/commands. Do not delete the webhook or revoke Telegram credentials for a model-only issue. Full Telegram shutdown/deleteWebhook procedures remain in the V1 document.

## Founder smoke test after credential activation

1. `@HOSTPAYRoboBot what is HOSTPAY?`
2. `@HOSTPAYRoboBot how do HOST holder rewards work?`
3. Reply to ROBO: `Do I need to stake?`
4. `@HOSTPAYRoboBot is the fee still 1%?`
5. `@HOSTPAYRoboBot if a token ends in HPAY does that prove it's official?`
6. `@HOSTPAYRoboBot are you alive or just pretending? 😂`

Expected: natural HOSTPAY-scoped answers, on-market HOST rewards/no staking, 1.20% gross with net-basis clarity, suffix insufficient without registry, and light banter only where appropriate. Confirm AI_SUCCESS metadata for an ordinary Q&A; a fallback reply alone does not prove inference succeeded. No live-data invention or claim of signing/administrative power.

## Future adapters

X and website ASK ROBO can call the same core through separately authorized channel adapters with their own trigger/authentication/rate-limit rules. Neither is wired here. Welcome text is reusable, but future Telegram join automation and the public join path require separate qualification. No automatic welcome message is enabled.

Official references checked 2026-10-03: [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol) establishes the requested model and low reasoning support; [text generation](https://developers.openai.com/api/docs/guides/text) documents Responses instructions/input separation; [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs) documents the response schema mechanism. These sources do not establish this account's model access or eliminate the need for live testing.

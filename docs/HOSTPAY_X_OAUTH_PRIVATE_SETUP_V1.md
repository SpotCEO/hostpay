# HOSTPAY — private X OAuth2 setup helper V1

**Implementation: PASS. OAuth consent has NOT been run against X. ROBO remains disabled.**

Date/source access: **2026-10-03**. Repository `SpotCEO/hostpay`, main, `C:\HOSTPAY\web`. Starting commit `2b015d932c0090e247847d1219144566215973c6`. This document supersedes the previous X V1 report's need for an unspecified private OAuth setup client; it does not change that report's approval/database/activation gates.

## Enter these exact X Developer Console settings

| Field | Value |
|---|---|
| Callback URI / Redirect URL | **`http://localhost:8080/callback`** |
| App type | Web App, Automated App or Bot — confidential client |
| App permissions | Read and write |
| Request email | Off |
| Website URL | `https://www.hostpayapp.com` |
| Organization | HOSTPAY |
| Organization URL | `https://www.hostpayapp.com` |

Preserve **http**, **localhost**, port **8080**, path **/callback**, and **no trailing slash** exactly. Do not enter the webhook URL, a Vercel URL, a wildcard, a random port, or substitute `127.0.0.1` in the registered URI. The local listener itself explicitly binds **127.0.0.1 and ::1**, never a wildcard interface. If port 8080 is occupied or either loopback listener cannot start, the helper stops before consent; it does not choose another port. Close the conflicting local process through its normal controls and retry.

No HOSTPAY Terms or Privacy URLs have been invented or published. This task did not save the founder's console form. Whether that specific form requires those fields is **NOT VERIFIED**. If saving requires them and HOSTPAY has no approved published policies, stop there and report the exact required fields. Do not substitute X's policies or placeholder HOSTPAY pages.

## Current official basis

**Loopback is documented, not guessed.** X's current official tooling page explicitly instructs OAuth2 users to register `http://localhost:8080/callback` and provide CLIENT_ID/CLIENT_SECRET. Its official xurl repository likewise documents this local consent flow and dual IPv4/IPv6 loopback handling. This is evidence for the private confidential-client setup, not proof the founder has already saved this app configuration. [X tooling documentation](https://docs.x.com/tools/mcp), [official xurl repository](https://github.com/xdevplatform/xurl). No MCP server, xurl installation or extra X capability was added to HOSTPAY.

The current OAuth2 reference identifies `https://x.com/i/oauth2/authorize`, exact redirect matching, state, S256 support and confidential Web/Automated clients. `offline.access` permits refresh-token issuance; access tokens ordinarily last two hours. Requested scopes are exactly **tweet.read users.read tweet.write offline.access**, consistent with X V1; email/DM/moderation scopes are absent. [OAuth2 reference](https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code).

The current flow guide documents confidential-client Basic authentication and POST `https://api.x.com/2/oauth2/token` with form-encoded authorization code, redirect URI and verifier. The helper immediately exchanges the callback code, once, then reads `GET https://api.x.com/2/users/me`. It performs no post, DM, webhook, subscription or account-setting request. [X user authorization flow](https://docs.x.com/fundamentals/authentication/oauth-2-0/user-access-token), [authenticated user endpoint](https://docs.x.com/x-api/users/get-my-user).

PKCE implementation follows S256: a cryptographically random verifier, SHA256, base64url without padding. The generated verifier is 86 characters from 64 random bytes, within the specification's 43–128 character range. State is a separate 32 random bytes, 43 base64url characters; it is compared exactly with a constant-time comparison. [RFC 7636](https://www.rfc-editor.org/rfc/rfc7636.html).

Vercel's CLI supports adding environment values through stdin; installed CLI **59.25.0** also exposes explicit secret type and project targeting. The helper suppresses child stdout/stderr and never uses `--value` or secret command arguments. [Vercel env documentation](https://vercel.com/docs/cli/env). Networked credential transfer was not performed during tests or this task.

## Local tooling

Entry point: **`scripts/x-oauth-setup.mjs`**. Internal modules: `scripts/x-oauth-setup-core.mjs` and `scripts/x-oauth-operator.mjs`. No new package/dependency, production route, public login, website component or runtime import was added. It imports only the existing exact official username/ID validator from X config.

Run from a trusted private terminal on the **same Windows computer as the browser**, not in a remote terminal whose localhost points elsewhere:

```powershell
Set-Location -LiteralPath C:\HOSTPAY\web
node scripts/x-oauth-setup.mjs --help
```

Running without a command or with `--help` is inert. It neither listens nor contacts X. The three commands are `authorize`, `handoff-vercel`, and `cleanup --confirmed-durable`. No credential or bind-address arguments are accepted.

## Exact founder sequence

1. Return to the existing X app's OAuth2 settings, enter the exact callback and settings above, and save. If the form rejects the documented local callback, stop and retain the non-secret error text; do not create a public callback as a workaround.
2. Securely obtain the OAuth2 Client ID and Client Secret. These are not OAuth1 API keys or an app-only bearer. Do not send either credential to ChatGPT/Codex. Configure the same pair as server-only **Production secrets** `X_CLIENT_ID` / `X_CLIENT_SECRET` in the HOSTPAY Vercel project separately, while keeping X_ROBO_ENABLED=false and approval unset.
3. Load the same pair into a trusted local terminal's process environment. For PowerShell, these prompts avoid values in command history or echo:

```powershell
$env:X_CLIENT_ID = [System.Net.NetworkCredential]::new('', (Read-Host 'X OAuth2 Client ID' -AsSecureString)).Password
$env:X_CLIENT_SECRET = [System.Net.NetworkCredential]::new('', (Read-Host 'X OAuth2 Client Secret' -AsSecureString)).Password
node scripts/x-oauth-setup.mjs authorize
```

4. The helper verifies private storage readiness, binds both loopback listeners, and prints an authorization URL. Open the **whole URL privately** in your local browser. It contains the client ID, state and S256 challenge, but no client secret, verifier or token. Sign in as the actual **@HOSTPAY_SOL** and consent. Do not share the authorization URL, callback URL, browser screenshot or terminal transcript.
5. Callback state, code and token response are checked. Duplicate/replayed callbacks cannot exchange again. Required scopes must match exactly, access and refresh tokens must exist, token type must be Bearer, and expiry must be a positive bounded integer. The helper calls `/2/users/me`, requires username exactly HOSTPAY_SOL and a string numeric ID. Wrong case, another account, missing/malformed ID or identity lookup failure stops before saving credentials.
6. Successful console output includes only status, verified username, numeric account ID, expiry and the sensitive file path. The browser receives a fixed plain-text result with no credentials and no reflected input. Copy the **numeric account ID** for your records; do not open/print the token file. The listeners close after completion/failure or five-minute timeout. Ctrl+C also closes them.
7. Use the direct handoff command below to transfer the four returned values to the pinned HOSTPAY Vercel Production project. This does not redeploy or activate anything. Alternatively a trusted operator can securely import those four named values from the private file using approved private tooling; never paste the bundle into chat or a shared editor.
8. Continue database, encryption-key and X written AI-reply approval prerequisites under the existing X V1 workflow separately. **OAuth completion is not live activation.** Leave X_ROBO_ENABLED=false; this helper cannot set the approval flag, create the database, generate a runtime encryption key, register a webhook or create subscriptions.

The expiry is calculated from token-request start plus X's returned `expires_in`, recorded as ISO UTC. Anchoring to request start conservatively avoids overstating lifetime by response latency; it is not a claim to know X's internal issuance instant. The handoff refuses a token with under one minute remaining. If setup is delayed past expiry, obtain a fresh consent bundle under the documented cleanup/review process instead of manually changing timestamps.

## Sensitive local bundle and permissions

Path: **`C:\HOSTPAY\web\.env.x-oauth-operator\credentials.json`**. The existing `.env*` Git ignore covers this directory; no new ignore rule was necessary. The helper verifies Git exclusion before use, creates the directory privately, refuses symlinks/reparse-point redirection and overwriting an existing bundle, and uses an exclusive file create plus flush.

The JSON contains X_ACCESS_TOKEN, X_REFRESH_TOKEN, X_ACCESS_TOKEN_EXPIRES_AT, X_ACCOUNT_ID plus version, verified username and a hash binding it to the Client ID. **Its contents must never be committed, displayed, uploaded, emailed, included in a report or pasted into chat.** The Client Secret and PKCE verifier are not saved there.

On Windows the directory DACL disables inherited access and permits only the current Windows account and SYSTEM. The helper changes the DACL without changing ownership, and verifies the resulting rules. File reads also verify ACLs and reject links/hard links. This was tested with synthetic credentials on this Windows host. On POSIX the directory/file modes are 0700/0600 and checked. If permission setup fails, authorization does not start; there is no permissive fallback.

These controls do not protect against administrators/SYSTEM, malware running as the operator, memory inspection, screen recording or backup/sync software. The file is temporary plaintext protected by filesystem permissions; it is not the runtime's encrypted PostgreSQL credential store. Deleting a file is not guaranteed secure erasure on SSDs or backups. Use a trusted machine and keep this folder out of cloud sync.

## Optional direct Vercel handoff — supported

The trusted terminal needs the existing authenticated Vercel CLI. No CLI login token is read or printed by the helper. On this Windows installation its default location is `%APPDATA%\npm\node_modules\vercel\dist\index.js`. If installed elsewhere, supply the absolute trusted CLI JS path through **HOSTPAY_VERCEL_CLI_JS**, not a credential argument.

```powershell
node scripts/x-oauth-setup.mjs handoff-vercel
```

This command validates the private bundle and Client ID binding, checks the existing `.vercel/project.json` equals project **prj_TJyywsnyIBE4D1xKY2I8Jx2kOQ9n**, org **team_5maV9ad8vAHWlH8EXXNVXV3R**, name **hostpay**, and rechecks `/2/users/me` against the saved numeric ID and exact handle. The team slug is `spotplatform`, HOSTPAY's existing deployment context; no separate SPOT application is used.

Only these **four** variables are transferred: X_ACCESS_TOKEN, X_REFRESH_TOKEN, X_ACCESS_TOKEN_EXPIRES_AT, X_ACCOUNT_ID. Each value goes to CLI stdin with explicit Production secret type and project ID. X/Telegram/OpenAI variables are stripped from the CLI child's inherited environment; stdout and stderr are discarded. There is no `--force`, automatic overwrite or retry. Existing variable conflicts require private operator review. App credentials and X_TOKEN_ENCRYPTION_KEY remain separate setup steps.

A private `handoff-started.json` marker is written before transfer. If any command fails or acknowledgement is uncertain, later handoff invocations refuse to retry blindly. Inspect the four variable **names/metadata** in the HOSTPAY Production dashboard, without retrieving other secrets; reconcile any partial result privately before a separately deliberate retry. The helper retains the original bundle and marker. Do not remove the marker merely to force a PASS, and do not change any enablement flag.

Tests mocked both X and the CLI sending boundary and verified exact arguments/stdin separation, allowed names, identity binding, early stop on failure and absence of secrets in emitted logs. **No real Production credential transfer has yet been performed.**

## Cleanup after handoff

After the four values are securely transferred **and the existing runtime's durable encrypted credential initialization is separately verified**, run:

```powershell
node scripts/x-oauth-setup.mjs cleanup --confirmed-durable
Remove-Item Env:X_CLIENT_ID -ErrorAction SilentlyContinue
Remove-Item Env:X_CLIENT_SECRET -ErrorAction SilentlyContinue
```

Cleanup deletes only the exact local bundle and marker, never a directory tree, Vercel secret, DB row or unrelated file. It refuses cleanup without the explicit confirmation argument. If durable initialization is not yet permitted because activation prerequisites remain outstanding, retain the restricted bundle only as long as needed under operator control. Do not activate ROBO just to make cleanup possible. Existing runtime instructions govern later removal of seed env variables after encrypted initialization; this helper does not alter that behavior.

If a consent attempt was abandoned and credentials should not be retained, a trusted operator may deliberately remove the exact sensitive file after deciding how to revoke/reauthorize the app privately. No automatic revocation or account-settings mutation is provided here. On wrong-account consent, no bundle is saved; the operator may revoke that unintended app consent through X's own settings.

## Qualification and unchanged boundaries

**223 passed / 0 failed:** 34 new private-helper tests plus all 189 existing X/Telegram/shared-core tests. Command:

```powershell
node --test tests/telegram.test.mjs tests/robo.test.mjs tests/x.test.mjs tests/x-oauth-setup.test.mjs
```

Tests cover fixed loopback addresses/port, Host/path/method checks, state success/mismatch/duplication, S256 entropy/derivation, scope restriction, denial/missing code, token exchange/rejection/malformed data, refresh-token presence, exact account/numeric ID, calculated expiry, overlapping callbacks, wrong-account no-save, shutdown/timeout, secret-free logs/browser output, real Windows restricted-file handling/Git ignore/cleanup, mocked stdin handoff, and no activation capability. Network calls to X and Vercel are mocked; local HTTP requests are real. No live OAuth consent or actual account ID is claimed as verified.

During development the first local file test exposed a PowerShell module-loading issue and an unnecessary ownership-setting operation. The final code uses Windows .NET DACL operations without ownership changes; restrictive-permission tests passed afterward. No real credential was involved or permissive fallback introduced.

Runtime files under `lib/`, `app/`, package manifests and prior tests are unchanged from the starting commit. No new dependency or build configuration. X feature flag remains false; approval flag remains unset. Telegram, OpenAI, website V4, Solana/CPMM/security and separate SPOT work are untouched. The approved homepage SHA256 remains `f14736ca7b8060b24f5196dfc1b9c8718cf6970cdb77b7bcbdbaa63f3eaffd9c`.

Commit/push is limited to helper modules, their new test file and this report. Main's existing Vercel integration can deploy automatically; no manual redeploy is needed. After that deployment, verify X POST remains 503 Disabled and Telegram's unauthenticated POST remains 401. Final commit/deployment/secret-audit evidence is appended to the complete handoff copy at `C:\HOSTPAY\docs\HOSTPAY_X_OAUTH_PRIVATE_SETUP_V1.md`.

**Exact next founder step: enter `http://localhost:8080/callback` in the existing X app's Callback URI / Redirect URL field, confirm the settings above, and save. Do not paste the displayed credentials into ChatGPT.**

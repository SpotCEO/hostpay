// P01-only normal-mobile-browser page; Phantom opens via official universal links.
const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>HOSTPAY P01 creation</title>
<style>body{font:16px system-ui,sans-serif;max-width:680px;margin:32px auto;padding:0 16px;line-height:1.5;background:#101820;color:#f5f7fa}button,a.action{font:inherit;display:inline-block;padding:12px 18px;margin:12px 8px 12px 0;background:#a9e8d2;color:#101820;border:0;border-radius:6px;text-decoration:none;cursor:pointer}button:disabled{opacity:.5}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#1d2b35;padding:14px;border-radius:6px}[hidden]{display:none!important}</style>
<h1>HOSTPAY P01 Squads creation</h1>
<p>Open this page in your phone's normal browser (Safari or Chrome), <strong>outside Phantom</strong>. Phantom opens only when you tap an official connection or signing link. Select F01 in Phantom. No recovery phrase or private key is requested.</p>
<p><strong>P01 only</strong> — P02 is not available on this page.</p>
<pre id="details"></pre>
<button id="connect">Prepare Phantom connection</button>
<a class="action" id="connect-link" hidden>Open Phantom to connect F01</a>
<button id="prepare" hidden>Prepare exact P01 transaction</button>
<a class="action" id="sign-link" hidden>Open Phantom to sign P01</a>
<button id="broadcast" hidden>Broadcast signed P01 once</button>
<pre id="status">Loading. No transaction has been sent.</pre>
<script src="/p01/solana-web3.iife.min.js"></script>
<script src="/p01/nacl-fast.min.js"></script>
<script src="/p01/sign.js"></script>
</html>`;

export function GET() {
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', 'referrer-policy': 'no-referrer' },
  });
}

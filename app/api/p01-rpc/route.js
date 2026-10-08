// Read-only bridge to the official Solana RPC for the fixed P01 signing page.
// It cannot submit transactions or query arbitrary accounts.
const EXPECTED = [
  'BSTq9w3kZwNwpBXJEvTZz2G9ZTNyKBvoSeXMvwb4cNZr',
  'tL8CVzuMhUBCMScCkBRhPuCGi6B9vt6wWrN3heZwCmZ',
  'BffRdcpiDLztBsqEp8KY15m5pmhrK8mXGzTz2mBeLMQe',
  '2g51DvYUJjzddhBLcqSZardaiqpm9oVSYjW6scrS2p2G',
  '9k5q4YqCgxTi5FBpV8PAFKprT6tU5HvUP7uvE4g1zYue',
];
function permitted(method, params) {
  if (method === 'getGenesisHash') return Array.isArray(params) && params.length === 0;
  if (method === 'getMultipleAccounts') {
    return Array.isArray(params) && params.length === 2 &&
      Array.isArray(params[0]) && JSON.stringify(params[0]) === JSON.stringify(EXPECTED) &&
      params[1]?.commitment === 'finalized' && params[1]?.encoding === 'base64';
  }
  if (method === 'getMinimumBalanceForRentExemption') {
    return Array.isArray(params) && params.length === 2 && params[0] === 231 && params[1]?.commitment === 'finalized';
  }
  return false;
}

export async function POST(request) {
  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!body || !permitted(body.method, body.params)) {
    return Response.json({ error: 'Read-only RPC method or parameters not permitted' }, { status: 403 });
  }
  try {
    const upstream = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: body.id, method: body.method, params: body.params }),
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  } catch (error) {
    return Response.json({ error: 'Official RPC unavailable', detail: String(error?.message || error) }, { status: 502 });
  }
}

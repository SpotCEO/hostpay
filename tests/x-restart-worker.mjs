import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { journal } from '../lib/x/store.mjs';
import { tokenCodec } from '../lib/x/auth.mjs';
const db=new PGlite(process.argv[2]);
const wrap=s=>({query:async(q,p=[]) => (await s.query(q,p)).rows,transaction:fn=>s.transaction(tx=>fn(wrap(tx)))});
const store=journal(wrap(db));
const codec=tokenCodec(Buffer.alloc(32,7).toString('base64'));
const e=id=>({id,author_id:id,conversation_id:id,created_at:new Date().toISOString(),event_type:'post.mention.create'});
if(process.argv[3]==='prepare') {
  await db.exec(await readFile(new URL('../lib/x/schema.sql',import.meta.url),'utf8'));
  await db.query("INSERT INTO robo_x_control (account_id,activation_at,enabled) VALUES ('100',now()-interval '1 minute',true)");
  for(const id of ['201','202','203']) assert.ok(await store.admit(e(id),'100'));
  assert.equal(await store.authorize('202','100'),true);
  assert.equal(await store.authorize('203','100'),true);await store.finish('203','SENT','REPLIED','900');
  await store.tokenDecision({accessToken:'fixture-access',refreshToken:'fixture-refresh',expiresAt:Date.now()+7200000},codec.decode,codec.encode);
} else {
  for(const id of ['201','202','203']) assert.equal(await store.admit(e(id),'100'),null);
  const rows=(await db.query('SELECT state FROM robo_x_interactions ORDER BY incoming_id')).rows;
  assert.deepEqual(rows.map(x=>x.state),['PREPARED','OUTCOME_UNKNOWN','SENT']);
  assert.equal(await store.authorize('202','100'),false);assert.equal(await store.authorize('203','100'),false);
  assert.equal((await store.tokenDecision(null,codec.decode,codec.encode)).accessToken,'fixture-access');
}
await db.close();console.log('PASS');

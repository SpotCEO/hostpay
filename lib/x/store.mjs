import { createHash } from 'node:crypto';
import postgres from 'postgres';
export const authorHash = id => createHash('sha256').update('HOSTPAY-X:' + id).digest('hex');

// Shared SQL runs in PostgreSQL in production and in real PGlite PostgreSQL tests.
// All admissions/authorizations serialize on one control row, including opt-out.
export function journal(db) {
  const locked = fn => db.transaction(async tx => {
    const [control] = await tx.query('SELECT *, now() AS clock FROM robo_x_control WHERE singleton=true FOR UPDATE');
    if (!control) throw Error('STORE_NOT_INITIALIZED');
    return fn(tx, control);
  });
  const active = (c, id) => c.enabled && c.account_id === id && +new Date(c.blocked_until) <= +new Date(c.clock);
  return {
    async tokenDecision(initial, decode, encode) {
      return locked(async (tx,c) => {
        if (!c.enabled) return {kind:'BLOCKED'};
        let [row] = await tx.query('SELECT * FROM robo_x_oauth WHERE singleton=true FOR UPDATE');
        if (!row) {
          if (!initial) return {kind:'BLOCKED'};
          const ciphertext = encode(initial);
          [row] = await tx.query("INSERT INTO robo_x_oauth (ciphertext,state) VALUES ($1,'READY') RETURNING *",[ciphertext]);
        }
        if (row.state !== 'READY') return {kind:'BLOCKED'};
        const tokens = decode(row.ciphertext);
        if (tokens.expiresAt > +new Date(c.clock) + 60000) return {kind:'READY',accessToken:tokens.accessToken};
        // Durable claim before requesting rotation. Ambiguous refresh is never retried.
        await tx.query("UPDATE robo_x_oauth SET state='REFRESH_UNKNOWN',generation=generation+1 WHERE singleton=true");
        return {kind:'REFRESH',refreshToken:tokens.refreshToken,generation:row.generation+1};
      });
    },
    async saveTokens(generation, ciphertext) {
      const rows = await db.query(`UPDATE robo_x_oauth SET ciphertext=$2,state='READY'
        WHERE singleton=true AND generation=$1 AND state='REFRESH_UNKNOWN' RETURNING generation`, [generation,ciphertext]);
      return rows.length === 1;
    },
    async admit(event, accountId) {
      return locked(async (tx, c) => {
        if (!active(c, accountId)) return null;
        const at = Date.parse(event.created_at), clock = +new Date(c.clock);
        // Start-now and bounded delivery window. Old/replayed events cannot reanimate.
        if (!Number.isFinite(at) || at < +new Date(c.activation_at) || at > clock + 60000 || at < clock - 900000) return null;
        const author = authorHash(event.author_id);
        if ((await tx.query('SELECT 1 FROM robo_x_optouts WHERE author_hash=$1', [author])).length) return null;
        if ((await tx.query('SELECT 1 FROM robo_x_interactions WHERE incoming_id=$1', [event.id])).length) return null;
        const [counts] = await tx.query(`SELECT
          count(*) FILTER (WHERE created_at > now()-interval '15 minutes') AS recent,
          count(*) AS daily,
          count(*) FILTER (WHERE author_hash=$1 AND created_at > now()-interval '15 minutes') AS per_user,
          count(*) FILTER (WHERE author_hash=$1 AND conversation_id=$2) AS per_conversation
          FROM robo_x_interactions WHERE created_at > now()-interval '1 day'`, [author,event.conversation_id]);
        if (+counts.recent >= 15 || +counts.daily >= 100 || +counts.per_user >= 3 || +counts.per_conversation >= 3) return null;
        await tx.query(`INSERT INTO robo_x_interactions (incoming_id,author_hash,conversation_id,trigger_type,state)
          VALUES ($1,$2,$3,$4,'PREPARED')`, [event.id,author,event.conversation_id,event.event_type]);
        return { aiAllowed: +new Date(c.ai_blocked_until) <= clock };
      });
    },
    async optOut(authorId) {
      return locked(tx => tx.query('INSERT INTO robo_x_optouts (author_hash) VALUES ($1) ON CONFLICT DO NOTHING', [authorHash(authorId)]));
    },
    async authorize(id, accountId) {
      return locked(async (tx,c) => {
        if (!active(c,accountId)) return false;
        // Commit ambiguity BEFORE transport. Even death before send never permits retry.
        const r = await tx.query(`UPDATE robo_x_interactions SET state='OUTCOME_UNKNOWN',updated_at=now(),reason='SEND_AUTHORIZED'
          WHERE incoming_id=$1 AND state='PREPARED' AND created_at > now()-interval '2 minutes'
          AND NOT EXISTS (SELECT 1 FROM robo_x_optouts o WHERE o.author_hash=robo_x_interactions.author_hash)
          RETURNING incoming_id`, [id]);
        return r.length === 1;
      });
    },
    async finish(id,state,reason,outgoingId=null) {
      if (!['SENT','SKIPPED','REJECTED'].includes(state) || !/^[A-Z_]{1,40}$/.test(reason)) throw Error('INVALID_STATE');
      await db.query(`UPDATE robo_x_interactions SET state=$2,reason=$3,outgoing_id=$4,updated_at=now()
        WHERE incoming_id=$1 AND ((state='PREPARED' AND $2='SKIPPED') OR
        (state='OUTCOME_UNKNOWN' AND $2 IN ('SENT','REJECTED')))`, [id,state,reason,outgoingId]);
    },
    async pause(kind) {
      return locked(tx => tx.query(kind === 'AI'
        ? "UPDATE robo_x_control SET ai_blocked_until=greatest(ai_blocked_until,now()+interval '1 minute')"
        : "UPDATE robo_x_control SET blocked_until=greatest(blocked_until,now()+interval '15 minutes')"));
    },
  };
}
export function postgresJournal(url) {
  if (typeof window !== 'undefined') throw Error('SERVER_ONLY');
  const u = new URL(url);
  if (!['postgres:','postgresql:'].includes(u.protocol)) throw Error('DURABLE_POSTGRES_REQUIRED');
  const sql = postgres(url, { max: 2, ssl: 'verify-full', connect_timeout: 5, idle_timeout: 20,
    connection: { statement_timeout: 5000, synchronous_commit: 'on' }, onnotice: () => {} });
  const wrap = s => ({ query: (q,p=[]) => s.unsafe(q,p) });
  return journal({ ...wrap(sql), transaction: fn => sql.begin(s => fn(wrap(s))) });
}

-- Apply once to a dedicated HOSTPAY PostgreSQL database, never to SPOT.
-- Runtime credentials require DML only. Do not purge the idempotency journal.
CREATE TABLE robo_x_control (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  enabled boolean NOT NULL DEFAULT false,
  account_id text NOT NULL,
  activation_at timestamptz NOT NULL,
  blocked_until timestamptz NOT NULL DEFAULT '1970-01-01',
  ai_blocked_until timestamptz NOT NULL DEFAULT '1970-01-01'
);
CREATE TABLE robo_x_interactions (
  incoming_id text PRIMARY KEY,
  author_hash text NOT NULL,
  conversation_id text NOT NULL,
  trigger_type text NOT NULL CHECK (trigger_type IN ('post.mention.create','post.reply.create')),
  state text NOT NULL CHECK (state IN ('PREPARED','OUTCOME_UNKNOWN','SENT','SKIPPED','REJECTED')),
  outgoing_id text,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX robo_x_created ON robo_x_interactions (created_at);
CREATE INDEX robo_x_author ON robo_x_interactions (author_hash, created_at);
CREATE TABLE robo_x_optouts (
  author_hash text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Credentials are AES-256-GCM ciphertext; encryption key stays in Vercel.
CREATE TABLE robo_x_oauth (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  ciphertext text NOT NULL,
  state text NOT NULL CHECK (state IN ('READY','REFRESH_UNKNOWN')),
  generation integer NOT NULL DEFAULT 0
);

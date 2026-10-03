import { createHash } from 'node:crypto';
// Short-lived counters only, no text/history/profile. Per warm instance, not a global spending cap.
export function rateGate({ now = Date.now } = {}) {
  const counters = new Map();
  let active = 0;
  return {
    acquire({ channel = 'unknown', chatId = 'unknown', userId = 'unknown' } = {}) {
      const time = now();
      for (const [k, v] of counters) if (v.until <= time) counters.delete(k);
      const hash = x => createHash('sha256').update(String(x)).digest('hex');
      const keys = [ ['global', 60, 60000], ['budget', 300, 600000], ['chat:' + hash(channel + ':' + chatId), 20, 60000], ['user:' + hash(channel + ':' + userId), 6, 60000] ];
      if (active >= 2 || counters.size > 5000 || keys.some(([k, max]) => (counters.get(k)?.n ?? 0) >= max)) return null;
      for (const [k, , duration] of keys) { const v = counters.get(k) ?? { n: 0, until: time + duration }; v.n++; counters.set(k, v); }
      active++;
      let released = false;
      return () => { if (!released) { active--; released = true; } };
    },
  };
}

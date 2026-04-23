// Simple in-process rate limiter. Resets between cold starts (acceptable for this scale).
// For high-traffic production, replace with an upstash/redis-backed limiter.

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

// Prune expired entries every 100 calls to avoid unbounded growth
let callsSincePrune = 0;
function maybePrune() {
  if (++callsSincePrune < 100) return;
  callsSincePrune = 0;
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  maybePrune();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;
  if (entry.count > maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

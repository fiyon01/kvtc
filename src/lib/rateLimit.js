const buckets = globalThis.__kvtcRateLimits || new Map();
globalThis.__kvtcRateLimits = buckets;

export function requestIp(req) {
  return (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'local')
    .split(',')[0]
    .trim();
}

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  current.count += 1;
  return {
    allowed: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    retryAfter: Math.ceil((current.resetAt - now) / 1000),
  };
}

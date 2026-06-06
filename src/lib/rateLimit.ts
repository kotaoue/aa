type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string): boolean {
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 30);
  const now = Date.now();
  const expiredKeys: string[] = [];

  for (const [bucketKey, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      expiredKeys.push(bucketKey);
    }
  }

  for (const bucketKey of expiredKeys) {
    buckets.delete(bucketKey);
  }

  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }
  current.count += 1;
  return true;
}

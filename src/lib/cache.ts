import { redis } from "@/lib/redis";

export const CACHE_TTL = {
  geo: 60 * 60 * 24,
  prayer: 60 * 60,
  holidays: 60 * 60 * 24,
  exchange: 60 * 60,
  validators: 60 * 10,
  utilities: 60 * 60,
  encyclopedia: 60 * 60 * 24,
  status: 60,
} as const;

export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null;

  try {
    return await redis.get<T>(key);
  } catch {
    return null;
  }
}

export async function setCached<T>(key: string, value: T, ttl: number) {
  if (!redis) return;

  try {
    await redis.set(key, value, { ex: ttl });
  } catch {
    // Cache failures should never break the public API.
  }
}

export async function withCache<T>(
  key: string,
  ttl: number,
  getFreshValue: () => Promise<T>,
) {
  const cached = await getCached<T>(key);
  if (cached) {
    return { data: cached, cacheStatus: "HIT" as const };
  }

  const data = await getFreshValue();
  await setCached(key, data, ttl);
  return { data, cacheStatus: "MISS" as const };
}

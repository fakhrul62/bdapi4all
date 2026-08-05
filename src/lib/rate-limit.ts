import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

const fallbackWindow = new Map<string, { count: number; resetAt: number }>();

const defaultRatelimit =
  redis &&
  new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "bdapi4all:ratelimit",
  });

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";

  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

type LimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
  retryAfter: number;
};

export async function checkKey(
  key: string,
  limit: number,
  windowMs = 60_000,
): Promise<LimitResult> {
  if (redis) {
    const instance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs / 1000} s`),
      prefix: "bdapi4all:ratelimit",
    });
    const result = await instance.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    };
  }

  const now = Date.now();
  const current = fallbackWindow.get(key);
  if (!current || current.resetAt <= now) {
    fallbackWindow.set(key, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      remaining: limit - 1,
      reset: now + windowMs,
      retryAfter: Math.ceil(windowMs / 1000),
    };
  }

  current.count += 1;
  const remaining = Math.max(0, limit - current.count);
  return {
    success: current.count <= limit,
    remaining,
    reset: current.resetAt,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export async function checkRateLimit(request: Request, limit = 100) {
  const ip = getClientIp(request);

  if (defaultRatelimit) {
    const result = await defaultRatelimit.limit(ip);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    };
  }

  return checkKey(ip, limit);
}
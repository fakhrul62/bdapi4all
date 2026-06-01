import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

const fallbackWindow = new Map<string, { count: number; resetAt: number }>();

const ratelimit =
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

export async function checkRateLimit(request: Request) {
  const ip = getClientIp(request);

  if (ratelimit) {
    const result = await ratelimit.limit(ip);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    };
  }

  const now = Date.now();
  const current = fallbackWindow.get(ip);
  if (!current || current.resetAt <= now) {
    fallbackWindow.set(ip, { count: 1, resetAt: now + 60_000 });
    return { success: true, remaining: 99, reset: now + 60_000, retryAfter: 60 };
  }

  current.count += 1;
  const remaining = Math.max(0, 100 - current.count);
  return {
    success: current.count <= 100,
    remaining,
    reset: current.resetAt,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

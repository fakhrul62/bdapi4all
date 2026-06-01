import { createHash } from "node:crypto";
import { prisma } from "@/lib/db";

export function hashIp(ip: string) {
  return createHash("sha256")
    .update(`${ip}:${process.env.SUPABASE_SECRET_KEY ?? "local"}`)
    .digest("hex");
}

export function logApiUsage(input: {
  endpoint: string;
  ip: string;
  responseTimeMs: number;
  statusCode: number;
}) {
  prisma.apiUsageLog
    .create({
      data: {
        endpoint: input.endpoint,
        ip_hash: hashIp(input.ip),
        response_time_ms: input.responseTimeMs,
        status_code: input.statusCode,
      },
    })
    .catch(() => {
      // Usage logging is intentionally non-blocking.
    });
}

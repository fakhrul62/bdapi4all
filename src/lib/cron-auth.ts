import { timingSafeEqual } from "node:crypto";
import { errorResponse } from "@/lib/response";

export function cronAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const actual = request.headers.get("authorization");
  if (!actual) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(actual);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function requireCronResponse(request: Request) {
  return cronAuthorized(request) ? null : errorResponse("UNAUTHORIZED", "Cron authorization failed.", 401);
}

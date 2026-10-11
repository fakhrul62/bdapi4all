import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

export function secretMatches(actual: string, expected: string) {
  return timingSafeEqual(createHmac("sha256", expected).update(actual).digest(), createHmac("sha256", expected).update(expected).digest());
}

export function issueAdminToken(secret: string, now = Date.now()) {
  const payload = `${Math.floor(now / 1000) + ADMIN_SESSION_SECONDS}.${randomBytes(16).toString("hex")}`;
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("hex")}`;
}

export function validAdminToken(token: string, secret: string, now = Date.now()) {
  const parts = token.split(".");
  if (parts.length !== 3 || !/^\d+$/.test(parts[0]) || !/^[a-f0-9]{32}$/.test(parts[1]) || !/^[a-f0-9]{64}$/.test(parts[2])) return false;
  const expires = Number(parts[0]);
  const current = Math.floor(now / 1000);
  if (expires <= current || expires > current + ADMIN_SESSION_SECONDS) return false;
  const expected = createHmac("sha256", secret).update(`${parts[0]}.${parts[1]}`).digest();
  return timingSafeEqual(Buffer.from(parts[2], "hex"), expected);
}

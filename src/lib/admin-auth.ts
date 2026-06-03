import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "bdapi4all_admin";

function adminSecret() {
  return process.env.ADMIN_SECRET || process.env.CRON_SECRET || "local-development-admin";
}

function tokenDigest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function expectedDigest() {
  return tokenDigest(adminSecret());
}

export async function createAdminSession(secret: string) {
  const expected = Buffer.from(expectedDigest());
  const actual = Buffer.from(tokenDigest(secret));

  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, expectedDigest(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return true;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminRequest(request?: Request) {
  const bearer = request?.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (bearer && tokenDigest(bearer) === expectedDigest()) return true;

  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === expectedDigest();
}

export async function adminUnauthorizedResponse() {
  return new Response(
    JSON.stringify({
      success: false,
      version: "v1",
      timestamp: new Date().toISOString(),
      error: {
        code: "ADMIN_UNAUTHORIZED",
        message: "Admin authentication is required.",
        docs: "https://bdapi4all.vercel.app/admin",
      },
    }),
    {
      status: 401,
      headers: { "Content-Type": "application/json" },
    },
  );
}

export async function requireAdminResponse(request?: Request) {
  if (await isAdminRequest(request)) return null;
  return adminUnauthorizedResponse();
}

export async function requireAdmin(request?: Request) {
  const response = await requireAdminResponse(request);
  if (response) throw response;
}

import { cookies } from "next/headers";
import { ADMIN_SESSION_SECONDS, issueAdminToken, secretMatches, validAdminToken } from "@/lib/admin-token";

const COOKIE_NAME = "bdapi4all_admin";

export async function createAdminSession(secret: string) {
  const configured = process.env.ADMIN_SECRET;
  if (!configured || !secretMatches(secret, configured)) return false;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, issueAdminToken(configured), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  return true;
}

export async function clearAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function isAdminRequest(request?: Request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const bearer = request?.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (bearer && secretMatches(bearer, secret)) return true;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return !!token && validAdminToken(token, secret);
}

export async function adminUnauthorizedResponse() {
  return Response.json({ success: false, version: "v1", timestamp: new Date().toISOString(), error: { code: "ADMIN_UNAUTHORIZED", message: "Admin authentication is required.", docs: "https://bdapi4all.vercel.app/admin" } }, { status: 401 });
}

export async function requireAdminResponse(request?: Request) {
  return await isAdminRequest(request) ? null : adminUnauthorizedResponse();
}

export async function requireAdmin(request?: Request) {
  const response = await requireAdminResponse(request);
  if (response) throw response;
}

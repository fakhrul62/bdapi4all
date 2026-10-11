import { z } from "zod";
import { createAdminSession } from "@/lib/admin-auth";
import { errorResponse, successResponse } from "@/lib/response";
import { checkKey, getClientIp } from "@/lib/rate-limit";

const loginSchema = z.object({
  secret: z.string().min(1),
});

export async function POST(request: Request) {
  if (!process.env.ADMIN_SECRET) return errorResponse("SERVICE_UNAVAILABLE", "Admin access is not configured.", 503);
  const limit = await checkKey(`admin-login:${getClientIp(request)}`, 5, 15 * 60_000);
  if (!limit.success) return errorResponse("RATE_LIMITED", "Too many login attempts. Try again later.", 429, { headers: { "Retry-After": String(limit.retryAfter) } });
  const body = loginSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return errorResponse("INVALID_PARAMETER", "Provide an admin secret.", 422);
  const ok = await createAdminSession(body.data.secret);
  if (!ok) {
    return errorResponse("ADMIN_UNAUTHORIZED", "Invalid admin secret.", 401, {
      docsPath: "/admin",
    });
  }

  return successResponse({ authenticated: true });
}

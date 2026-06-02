import { z } from "zod";
import { createAdminSession } from "@/lib/admin-auth";
import { errorResponse, successResponse } from "@/lib/response";

const loginSchema = z.object({
  secret: z.string().min(1),
});

export async function POST(request: Request) {
  const body = loginSchema.parse(await request.json());
  const ok = await createAdminSession(body.secret);
  if (!ok) {
    return errorResponse("ADMIN_UNAUTHORIZED", "Invalid admin secret.", 401, {
      docsPath: "/admin",
    });
  }

  return successResponse({ authenticated: true });
}

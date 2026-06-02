import { clearAdminSession } from "@/lib/admin-auth";
import { successResponse } from "@/lib/response";

export async function POST() {
  await clearAdminSession();
  return successResponse({ authenticated: false });
}

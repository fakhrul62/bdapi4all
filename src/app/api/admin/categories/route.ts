import { requireAdmin } from "@/lib/admin-auth";
import { adminCategories } from "@/lib/admin-records";
import { successResponse } from "@/lib/response";

export async function GET(request: Request) {
  await requireAdmin(request);
  return successResponse(adminCategories());
}

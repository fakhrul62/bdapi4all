import { requireAdminResponse } from "@/lib/admin-auth";
import { adminBulkUpdate } from "@/lib/admin-records";
import { successResponse } from "@/lib/response";

export async function POST(request: Request) {
  const unauthorized = await requireAdminResponse(request);
  if (unauthorized) return unauthorized;
  const result = await adminBulkUpdate(await request.json());
  return successResponse(result);
}

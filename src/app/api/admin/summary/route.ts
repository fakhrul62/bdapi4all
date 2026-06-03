import { requireAdminResponse } from "@/lib/admin-auth";
import { adminQualitySummary, adminRecentActivity, adminRecentRuns, adminSummary } from "@/lib/admin-records";
import { successResponse } from "@/lib/response";

export async function GET(request: Request) {
  const unauthorized = await requireAdminResponse(request);
  if (unauthorized) return unauthorized;
  const [summary, runs, activity, quality] = await Promise.all([
    adminSummary(),
    adminRecentRuns(),
    adminRecentActivity(),
    adminQualitySummary(),
  ]);
  return successResponse({ summary, runs, activity, quality });
}

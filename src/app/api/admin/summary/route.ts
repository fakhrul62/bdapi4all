import { requireAdmin } from "@/lib/admin-auth";
import { adminRecentRuns, adminSummary } from "@/lib/admin-records";
import { successResponse } from "@/lib/response";

export async function GET(request: Request) {
  await requireAdmin(request);
  const [summary, runs] = await Promise.all([adminSummary(), adminRecentRuns()]);
  return successResponse({ summary, runs });
}

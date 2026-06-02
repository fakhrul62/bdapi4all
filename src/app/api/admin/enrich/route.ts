import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { runEncyclopediaEnrichment } from "@/lib/encyclopedia-enrichment";
import { successResponse } from "@/lib/response";

const enrichSchema = z.object({
  category: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function POST(request: Request) {
  await requireAdmin(request);
  const body = enrichSchema.parse(await request.json().catch(() => ({})));
  const result = await runEncyclopediaEnrichment(body);
  return successResponse(result);
}

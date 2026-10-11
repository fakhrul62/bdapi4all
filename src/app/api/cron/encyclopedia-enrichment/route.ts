import { z } from "zod";
import { runEncyclopediaEnrichment } from "@/lib/encyclopedia-enrichment";
import { successResponse } from "@/lib/response";

import { requireCronResponse } from "@/lib/cron-auth";

const querySchema = z.object({
  category: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const unauthorized = requireCronResponse(request);
  if (unauthorized) return unauthorized;

  const query = querySchema.parse(Object.fromEntries(url.searchParams));
  const result = await runEncyclopediaEnrichment({
    category: query.category,
    limit: query.limit,
  });

  return successResponse(result);
}

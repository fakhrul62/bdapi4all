import { z } from "zod";
import { normalizeAndAuditData } from "@/lib/data-quality";
import { successResponse } from "@/lib/response";

import { requireCronResponse } from "@/lib/cron-auth";

const querySchema = z.object({
  category: z.string().optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const unauthorized = requireCronResponse(request);
  if (unauthorized) return unauthorized;

  const query = querySchema.parse(Object.fromEntries(url.searchParams));
  const result = await normalizeAndAuditData(query.category);
  return successResponse(result);
}

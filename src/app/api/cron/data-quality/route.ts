import { z } from "zod";
import { normalizeAndAuditData } from "@/lib/data-quality";
import { errorResponse, successResponse } from "@/lib/response";

const querySchema = z.object({
  category: z.string().optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = request.headers.get("x-cron-secret") ?? url.searchParams.get("secret");

  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return errorResponse("UNAUTHORIZED", "Invalid cron secret.", 401, {
      docsPath: "/docs/authentication",
    });
  }

  const query = querySchema.parse(Object.fromEntries(url.searchParams));
  const result = await normalizeAndAuditData(query.category);
  return successResponse(result);
}

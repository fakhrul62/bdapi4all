import { z } from "zod";
import { requireAdminResponse } from "@/lib/admin-auth";
import { adminListRecords } from "@/lib/admin-records";
import { successResponse } from "@/lib/response";

const querySchema = z.object({
  category: z.string().min(1),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["all", "verified", "unverified", "needs_image"]).default("all"),
  q: z.string().optional(),
});

export async function GET(request: Request) {
  const unauthorized = await requireAdminResponse(request);
  if (unauthorized) return unauthorized;
  const url = new URL(request.url);
  const query = querySchema.parse(Object.fromEntries(url.searchParams));
  const result = await adminListRecords({
    categorySlug: query.category,
    page: query.page,
    limit: query.limit,
    status: query.status,
    q: query.q,
  });

  return successResponse(result.records, {
    meta: {
      category: {
        slug: result.category.slug,
        title: result.category.title,
        group: result.category.group,
      },
      ...result.meta,
    },
  });
}

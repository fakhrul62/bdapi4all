import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { optionsResponse } from "@/lib/response";
import { optionalIdSchema, parseSearchParams } from "@/lib/validators";

export const runtime = "nodejs";

const querySchema = z.object({
  upazila_id: optionalIdSchema,
});

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const query = parseSearchParams(request, querySchema);
    const { data } = await withCache(
      `geo:unions:${query.upazila_id ?? "all"}`,
      CACHE_TTL.geo,
      () =>
        prisma.union.findMany({
          where: query.upazila_id ? { upazila_id: query.upazila_id } : undefined,
          orderBy: { name_en: "asc" },
          take: query.upazila_id ? undefined : 500,
        }),
    );

    return {
      data,
      cacheControl: "public, s-maxage=86400, stale-while-revalidate=43200",
    };
  });
}

export function OPTIONS() {
  return optionsResponse();
}

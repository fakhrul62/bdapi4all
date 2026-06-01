import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { optionsResponse } from "@/lib/response";
import { optionalIdSchema, parseSearchParams } from "@/lib/validators";

export const runtime = "nodejs";

const querySchema = z.object({
  division_id: optionalIdSchema,
});

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const query = parseSearchParams(request, querySchema);
    const cacheKey = `geo:districts:${query.division_id ?? "all"}`;
    const { data } = await withCache(cacheKey, CACHE_TTL.geo, () =>
      prisma.district.findMany({
        where: query.division_id ? { division_id: query.division_id } : undefined,
        orderBy: { name_en: "asc" },
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

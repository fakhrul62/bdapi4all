import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { optionsResponse } from "@/lib/response";
import { optionalIdSchema, parseSearchParams } from "@/lib/validators";
import {
  buildPaginationMeta,
  parseFields,
  parsePagination,
  parseSort,
  projectItems,
} from "@/lib/query";

export const runtime = "nodejs";

const querySchema = z.object({
  upazila_id: optionalIdSchema,
});

const sortableFields = new Set(["id", "name_en", "name_bn", "upazila_id"]);

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const query = parseSearchParams(request, querySchema);
    const url = new URL(request.url);
    const { page, limit } = parsePagination(url.searchParams);
    const skip = (page - 1) * limit;
    const fields = parseFields(url.searchParams);
    const sort = parseSort(url.searchParams, sortableFields);
    const where = query.upazila_id ? { upazila_id: query.upazila_id } : undefined;
    const cacheKey = `geo:unions:list:${url.searchParams.toString()}`;

    const { data } = await withCache(cacheKey, CACHE_TTL.geo, async () => {
      const [items, total] = await Promise.all([
        prisma.union.findMany({
          where,
          skip,
          take: limit,
          orderBy: sort.orderBy,
        }),
        prisma.union.count({ where }),
      ]);
      return { items: projectItems(items, fields), total };
    });

    return {
      data: data.items,
      meta: buildPaginationMeta(page, limit, data.total),
      cacheControl: "public, s-maxage=86400, stale-while-revalidate=43200",
    };
  });
}

export function OPTIONS() {
  return optionsResponse();
}

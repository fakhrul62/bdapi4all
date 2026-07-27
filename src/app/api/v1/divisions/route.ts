import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { optionsResponse } from "@/lib/response";
import {
  buildPaginationMeta,
  parseFields,
  parsePagination,
  parseSort,
  projectItems,
} from "@/lib/query";

export const runtime = "nodejs";

const sortableFields = new Set(["id", "name_en", "name_bn"]);

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const url = new URL(request.url);
    const { page, limit } = parsePagination(url.searchParams);
    const skip = (page - 1) * limit;
    const fields = parseFields(url.searchParams);
    const sort = parseSort(url.searchParams, sortableFields);
    const cacheKey = `geo:divisions:list:${url.searchParams.toString()}`;

    const { data } = await withCache(cacheKey, CACHE_TTL.geo, async () => {
      const [items, total] = await Promise.all([
        prisma.division.findMany({
          skip,
          take: limit,
          orderBy: sort.orderBy,
        }),
        prisma.division.count(),
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

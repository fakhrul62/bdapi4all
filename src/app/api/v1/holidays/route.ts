import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { optionsResponse } from "@/lib/response";
import { parseSearchParams } from "@/lib/validators";

export const runtime = "nodejs";

const querySchema = z.object({
  year: z.coerce.number().int().min(1971).max(2100).optional(),
});

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const query = parseSearchParams(request, querySchema);
    const year = query.year ?? new Date().getFullYear();
    const from = new Date(Date.UTC(year, 0, 1));
    const to = new Date(Date.UTC(year + 1, 0, 1));
    const { data } = await withCache(`holidays:${year}`, CACHE_TTL.holidays, () =>
      prisma.holiday.findMany({
        where: {
          date: {
            gte: from,
            lt: to,
          },
        },
        orderBy: { date: "asc" },
      }),
    );

    return {
      data: { year, holidays: data },
      cacheControl: "public, s-maxage=86400, stale-while-revalidate=43200",
    };
  });
}

export function OPTIONS() {
  return optionsResponse();
}

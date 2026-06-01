import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { optionsResponse } from "@/lib/response";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const { data } = await withCache("holidays:next", CACHE_TTL.holidays, () =>
      prisma.holiday.findFirst({
        where: { date: { gte: today } },
        orderBy: { date: "asc" },
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

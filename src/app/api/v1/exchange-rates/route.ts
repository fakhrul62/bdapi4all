import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { optionsResponse } from "@/lib/response";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const { data } = await withCache("exchange-rates:latest", CACHE_TTL.exchange, async () => {
      const latest = await prisma.exchangeRate.findFirst({
        orderBy: { date: "desc" },
        select: { date: true },
      });

      if (!latest) return { date: null, source: "Bangladesh Bank", rates: [] };

      const rates = await prisma.exchangeRate.findMany({
        where: { date: latest.date },
        orderBy: { currency_code: "asc" },
      });

      return { date: latest.date, source: "Bangladesh Bank", rates };
    });

    return {
      data,
      cacheControl: "public, s-maxage=3600, stale-while-revalidate=1800",
    };
  });
}

export function OPTIONS() {
  return optionsResponse();
}

import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { optionsResponse } from "@/lib/response";
import { dateSchema, parseSearchParams } from "@/lib/validators";

export const runtime = "nodejs";

const querySchema = z.object({
  currency: z.string().trim().length(3).transform((value) => value.toUpperCase()),
  from: dateSchema,
  to: dateSchema,
});

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const query = parseSearchParams(request, querySchema);
    const { data } = await withCache(
      `exchange-rates:history:${query.currency}:${query.from}:${query.to}`,
      CACHE_TTL.exchange,
      () =>
        prisma.exchangeRate.findMany({
          where: {
            currency_code: query.currency,
            date: {
              gte: new Date(`${query.from}T00:00:00.000Z`),
              lte: new Date(`${query.to}T23:59:59.999Z`),
            },
          },
          orderBy: { date: "asc" },
        }),
    );

    return {
      data: {
        currency: query.currency,
        from: query.from,
        to: query.to,
        rates: data,
      },
      cacheControl: "public, s-maxage=3600, stale-while-revalidate=1800",
    };
  });
}

export function OPTIONS() {
  return optionsResponse();
}

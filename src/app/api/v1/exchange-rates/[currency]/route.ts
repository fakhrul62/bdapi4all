import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { errorResponse, optionsResponse } from "@/lib/response";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  ctx: RouteContext<"/api/v1/exchange-rates/[currency]">,
) {
  return handleApi(request, async () => {
    const { currency } = await ctx.params;
    const code = currency.toUpperCase();
    const { data } = await withCache(`exchange-rates:${code}`, CACHE_TTL.exchange, () =>
      prisma.exchangeRate.findFirst({
        where: { currency_code: code },
        orderBy: { date: "desc" },
      }),
    );

    if (!data) {
      throw errorResponse("NOT_FOUND", `Rate for currency '${code}' was not found.`, 404, {
        docsPath: "/docs/exchange-rates",
      });
    }

    return {
      data,
      cacheControl: "public, s-maxage=3600, stale-while-revalidate=1800",
    };
  });
}

export function OPTIONS() {
  return optionsResponse();
}

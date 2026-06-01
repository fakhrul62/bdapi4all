import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { optionsResponse } from "@/lib/response";
import { dateSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET(request: Request, ctx: RouteContext<"/api/v1/holidays/[date]">) {
  return handleApi(request, async () => {
    const { date } = await ctx.params;
    const parsedDate = dateSchema.parse(date);
    const from = new Date(`${parsedDate}T00:00:00.000Z`);
    const to = new Date(from);
    to.setUTCDate(to.getUTCDate() + 1);
    const { data } = await withCache(`holidays:date:${parsedDate}`, CACHE_TTL.holidays, () =>
      prisma.holiday.findFirst({
        where: {
          date: {
            gte: from,
            lt: to,
          },
        },
      }),
    );

    return {
      data: {
        date: parsedDate,
        is_holiday: Boolean(data),
        holiday: data,
      },
      cacheControl: "public, s-maxage=86400, stale-while-revalidate=43200",
    };
  });
}

export function OPTIONS() {
  return optionsResponse();
}

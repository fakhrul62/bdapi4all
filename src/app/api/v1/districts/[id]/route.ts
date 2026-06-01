import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { errorResponse, optionsResponse } from "@/lib/response";
import { idSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET(request: Request, ctx: RouteContext<"/api/v1/districts/[id]">) {
  return handleApi(request, async () => {
    const { id } = await ctx.params;
    const districtId = idSchema.parse(id);
    const { data } = await withCache(`geo:districts:${districtId}`, CACHE_TTL.geo, () =>
      prisma.district.findUnique({
        where: { id: districtId },
        include: {
          division: true,
          upazilas: {
            orderBy: { name_en: "asc" },
          },
        },
      }),
    );

    if (!data) {
      throw errorResponse(
        "NOT_FOUND",
        `District with id '${id}' was not found.`,
        404,
        { docsPath: "/docs/districts" },
      );
    }

    return {
      data,
      cacheControl: "public, s-maxage=86400, stale-while-revalidate=43200",
    };
  });
}

export function OPTIONS() {
  return optionsResponse();
}

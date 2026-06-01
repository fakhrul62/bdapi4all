import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { errorResponse, optionsResponse } from "@/lib/response";
import { idSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function GET(request: Request, ctx: RouteContext<"/api/v1/upazilas/[id]">) {
  return handleApi(request, async () => {
    const { id } = await ctx.params;
    const upazilaId = idSchema.parse(id);
    const { data } = await withCache(`geo:upazilas:${upazilaId}`, CACHE_TTL.geo, () =>
      prisma.upazila.findUnique({
        where: { id: upazilaId },
        include: {
          district: true,
          unions: {
            orderBy: { name_en: "asc" },
          },
        },
      }),
    );

    if (!data) {
      throw errorResponse(
        "NOT_FOUND",
        `Upazila with id '${id}' was not found.`,
        404,
        { docsPath: "/docs/upazilas" },
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

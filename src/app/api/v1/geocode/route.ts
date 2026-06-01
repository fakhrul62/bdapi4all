import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { errorResponse, optionsResponse } from "@/lib/response";
import { parseSearchParams } from "@/lib/validators";

export const runtime = "nodejs";

const querySchema = z
  .object({
    district: z.string().trim().min(2).optional(),
    upazila: z.string().trim().min(2).optional(),
  })
  .refine((query) => query.district || query.upazila, {
    message: "Provide district or upazila.",
  });

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const query = parseSearchParams(request, querySchema);
    const cacheKey = `geo:geocode:${query.district ?? ""}:${query.upazila ?? ""}`;
    const { data } = await withCache(cacheKey, CACHE_TTL.geo, async () => {
      if (query.district) {
        return prisma.district.findFirst({
          where: { name_en: { equals: query.district, mode: "insensitive" } },
          select: { id: true, name_en: true, name_bn: true, lat: true, lng: true },
        });
      }

      const upazila = await prisma.upazila.findFirst({
        where: { name_en: { equals: query.upazila, mode: "insensitive" } },
        include: { district: true },
      });

      if (!upazila) return null;

      return {
        id: upazila.id,
        name_en: upazila.name_en,
        name_bn: upazila.name_bn,
        district_id: upazila.district_id,
        lat: upazila.lat ?? upazila.district.lat,
        lng: upazila.lng ?? upazila.district.lng,
      };
    });

    if (!data) {
      throw errorResponse("NOT_FOUND", "No matching location was found.", 404, {
        docsPath: "/docs/geocode",
      });
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

import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { calculatePrayerTimes } from "@/lib/prayer";
import { errorResponse, optionsResponse } from "@/lib/response";
import { dateSchema, optionalIdSchema, parseSearchParams } from "@/lib/validators";

export const runtime = "nodejs";

const querySchema = z
  .object({
    district_id: optionalIdSchema,
    lat: z.coerce.number().min(20).max(27).optional(),
    lng: z.coerce.number().min(88).max(93).optional(),
    date: dateSchema.optional(),
  })
  .refine((query) => query.district_id || (query.lat && query.lng), {
    message: "Provide district_id or both lat and lng.",
  });

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const query = parseSearchParams(request, querySchema);
    const date = query.date ?? new Date().toISOString().slice(0, 10);
    const { data } = await withCache(
      `prayer:${query.district_id ?? `${query.lat},${query.lng}`}:${date}`,
      CACHE_TTL.prayer,
      async () => {
        let coordinates = {
          lat: query.lat,
          lng: query.lng,
          district: null as null | { id: number; name_en: string; name_bn: string },
        };

        if (query.district_id) {
          const district = await prisma.district.findUnique({
            where: { id: query.district_id },
            select: { id: true, name_en: true, name_bn: true, lat: true, lng: true },
          });
          if (!district?.lat || !district.lng) return null;
          coordinates = {
            lat: district.lat,
            lng: district.lng,
            district: {
              id: district.id,
              name_en: district.name_en,
              name_bn: district.name_bn,
            },
          };
        }

        if (!coordinates.lat || !coordinates.lng) return null;

        return {
          date,
          timezone: "Asia/Dhaka",
          method: "Muslim World League style calculation via adhan-js Karachi method",
          coordinates: { lat: coordinates.lat, lng: coordinates.lng },
          district: coordinates.district,
          times: calculatePrayerTimes({
            lat: coordinates.lat,
            lng: coordinates.lng,
            date,
          }),
        };
      },
    );

    if (!data) {
      throw errorResponse("NOT_FOUND", "Prayer location was not found.", 404, {
        docsPath: "/docs/prayer-times",
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

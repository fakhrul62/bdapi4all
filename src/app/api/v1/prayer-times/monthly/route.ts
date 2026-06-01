import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { handleApi } from "@/lib/api-handler";
import { calculatePrayerTimes } from "@/lib/prayer";
import { errorResponse, optionsResponse } from "@/lib/response";
import { optionalIdSchema, parseSearchParams } from "@/lib/validators";

export const runtime = "nodejs";

const querySchema = z.object({
  district_id: optionalIdSchema,
  lat: z.coerce.number().min(20).max(27).optional(),
  lng: z.coerce.number().min(88).max(93).optional(),
  year: z.coerce.number().int().min(2020).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const query = parseSearchParams(request, querySchema);
    if (!query.district_id && (!query.lat || !query.lng)) {
      throw errorResponse("INVALID_PARAMETER", "Provide district_id or both lat and lng.", 422, {
        docsPath: "/docs/prayer-times",
      });
    }

    const { data } = await withCache(
      `prayer:monthly:${query.district_id ?? `${query.lat},${query.lng}`}:${query.year}-${query.month}`,
      CACHE_TTL.prayer,
      async () => {
        let lat = query.lat;
        let lng = query.lng;
        let district = null as null | { id: number; name_en: string; name_bn: string };

        if (query.district_id) {
          const found = await prisma.district.findUnique({
            where: { id: query.district_id },
            select: { id: true, name_en: true, name_bn: true, lat: true, lng: true },
          });
          if (!found?.lat || !found.lng) return null;
          lat = found.lat;
          lng = found.lng;
          district = { id: found.id, name_en: found.name_en, name_bn: found.name_bn };
        }

        if (!lat || !lng) return null;

        const daysInMonth = new Date(query.year, query.month, 0).getDate();
        const days = Array.from({ length: daysInMonth }, (_, index) => {
          const day = String(index + 1).padStart(2, "0");
          const month = String(query.month).padStart(2, "0");
          const date = `${query.year}-${month}-${day}`;
          return { date, times: calculatePrayerTimes({ lat, lng, date }) };
        });

        return {
          year: query.year,
          month: query.month,
          timezone: "Asia/Dhaka",
          district,
          coordinates: { lat, lng },
          days,
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

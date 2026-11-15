import type { Area } from "@/lib/area-types";
import { z } from "zod";
import { handleApi } from "@/lib/api-handler";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { optionsResponse } from "@/lib/response";
import { parseSearchParams } from "@/lib/validators";

const id = z.coerce.number().int().positive().max(2147483647);
const selection = z.object({
  division: id.default(6),
  district: id.optional(),
  upazila: id.optional(),
});

export const OPTIONS = optionsResponse;

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const { division, district, upazila } = parseSearchParams(request, selection);
    const key = `geo:browser:v1:${division}:${district ?? 0}:${upazila ?? 0}`;
    const { data } = await withCache(key, CACHE_TTL.geo, async () => {
      // Each selector falls back to its first available child, including on fresh seeds.
      const [area] = await prisma.$queryRaw<Area[]>`
        WITH division_choices AS (
          SELECT id, name_en, name_bn FROM divisions
        ), district_choices AS (
          SELECT id, name_en, name_bn, division_id FROM districts
          WHERE division_id = (SELECT id FROM division_choices
            ORDER BY (id = ${division}) DESC, id LIMIT 1)
        ), upazila_choices AS (
          SELECT id, name_en, name_bn, district_id FROM upazilas
          WHERE district_id = (SELECT id FROM district_choices
            ORDER BY (id = ${district ?? 0}) DESC, id LIMIT 1)
        ), union_choices AS (
          SELECT id, name_en, name_bn, upazila_id FROM unions
          WHERE upazila_id = (SELECT id FROM upazila_choices
            ORDER BY (id = ${upazila ?? 0}) DESC, id LIMIT 1)
        )
        SELECT
          COALESCE((SELECT jsonb_agg(d ORDER BY id) FROM division_choices d), '[]') AS divisions,
          COALESCE((SELECT jsonb_agg(d ORDER BY id) FROM district_choices d), '[]') AS districts,
          COALESCE((SELECT jsonb_agg(u ORDER BY id) FROM upazila_choices u), '[]') AS upazilas,
          COALESCE((SELECT jsonb_agg(u ORDER BY id) FROM union_choices u), '[]') AS unions
      `;
      return area;
    });
    return { data };
  });
}

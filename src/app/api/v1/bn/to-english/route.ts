import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { handleApi } from "@/lib/api-handler";
import { toEnglishDigits } from "@/lib/bn";
import { optionsResponse } from "@/lib/response";
import { parseSearchParams } from "@/lib/validators";

export const runtime = "nodejs";

const querySchema = z.object({
  text: z.string().min(1),
});

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const query = parseSearchParams(request, querySchema);
    const { data } = await withCache(
      `bn:to-english:${query.text}`,
      CACHE_TTL.utilities,
      async () => ({
        original: query.text,
        converted: toEnglishDigits(query.text),
      }),
    );

    return {
      data,
      cacheControl: "public, s-maxage=3600, stale-while-revalidate=1800",
    };
  });
}

export function OPTIONS() {
  return optionsResponse();
}

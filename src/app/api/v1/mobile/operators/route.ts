import { CACHE_TTL, withCache } from "@/lib/cache";
import { handleApi } from "@/lib/api-handler";
import { getMobilePrefixes } from "@/lib/mobile";
import { optionsResponse } from "@/lib/response";

export const runtime = "nodejs";

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const { data } = await withCache("mobile:operators", CACHE_TTL.geo, async () =>
      getMobilePrefixes(),
    );

    return {
      data,
      cacheControl: "public, s-maxage=86400, stale-while-revalidate=43200",
    };
  });
}

export function OPTIONS() {
  return optionsResponse();
}

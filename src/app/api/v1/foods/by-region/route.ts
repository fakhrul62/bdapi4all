import { handleApi } from "@/lib/api-handler";
import { listFoodsByRegion } from "@/lib/discovery";
import { optionsResponse } from "@/lib/response";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const { data } = await listFoodsByRegion(request);
    return {
      data: data.items,
      meta: data.meta,
      cacheControl: "public, s-maxage=86400, stale-while-revalidate=3600",
    };
  });
}

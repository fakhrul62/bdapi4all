import {
  getEncyclopediaCategory,
  listEncyclopediaRecords,
} from "@/lib/encyclopedia";
import { handleApi } from "@/lib/api-handler";
import { errorResponse, optionsResponse } from "@/lib/response";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ category: string }> },
) {
  const { category: slug } = await context.params;
  const category = getEncyclopediaCategory(slug);

  if (!category) {
    return errorResponse(
      "NOT_FOUND",
      `API category '${slug}' was not found.`,
      404,
      { docsPath: "/docs" },
    );
  }

  return handleApi(request, async () => {
    const { data } = await listEncyclopediaRecords(category, request);
    return {
      data: data.items,
      meta: data.meta,
      cacheControl: "public, s-maxage=86400, stale-while-revalidate=3600",
    };
  });
}

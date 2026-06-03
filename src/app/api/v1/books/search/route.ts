import { handleApi } from "@/lib/api-handler";
import { getEncyclopediaCategory, searchEncyclopediaRecords } from "@/lib/encyclopedia";
import { errorResponse, optionsResponse } from "@/lib/response";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: Request) {
  const category = getEncyclopediaCategory("books");
  if (!category) {
    return errorResponse("NOT_FOUND", "Books category was not found.", 404, { docsPath: "/docs/books" });
  }

  return handleApi(request, async () => {
    const { data } = await searchEncyclopediaRecords(category, request);
    return {
      data: data.items,
      meta: data.meta,
      cacheControl: "public, s-maxage=86400, stale-while-revalidate=3600",
    };
  });
}

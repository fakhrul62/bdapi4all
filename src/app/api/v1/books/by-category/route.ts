import { handleApi } from "@/lib/api-handler";
import { categorySchema, listBooksByWhere } from "@/lib/books";
import { optionsResponse } from "@/lib/response";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: Request) {
  return handleApi(request, async () => {
    const url = new URL(request.url);
    const { category } = categorySchema.parse(Object.fromEntries(url.searchParams));
    const { data } = await listBooksByWhere("by-category", request, {
      genre: { equals: category, mode: "insensitive" },
    });

    return {
      data: data.items,
      meta: data.meta,
      cacheControl: "public, s-maxage=86400, stale-while-revalidate=3600",
    };
  });
}

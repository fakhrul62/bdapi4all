import { z } from "zod";
import {
  getEncyclopediaCategory,
  getEncyclopediaRecord,
} from "@/lib/encyclopedia";
import { handleApi } from "@/lib/api-handler";
import { errorResponse, optionsResponse } from "@/lib/response";

const idSchema = z.coerce.number().int().positive();

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ category: string; id: string }> },
) {
  const { category: slug, id } = await context.params;
  const category = getEncyclopediaCategory(slug);

  if (!category) {
    return errorResponse(
      "NOT_FOUND",
      `API category '${slug}' was not found.`,
      404,
      { docsPath: "/docs" },
    );
  }

  return handleApi(request, async () => ({
    data: await getEncyclopediaRecord(category, idSchema.parse(id)),
    cacheControl: "public, s-maxage=86400, stale-while-revalidate=3600",
  }));
}

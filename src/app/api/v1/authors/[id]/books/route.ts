import { z } from "zod";
import { handleApi } from "@/lib/api-handler";
import { listBooksByWhere } from "@/lib/books";
import { optionsResponse } from "@/lib/response";

const idSchema = z.coerce.number().int().positive();

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const author_id = idSchema.parse(id);

  return handleApi(request, async () => {
    const { data } = await listBooksByWhere(`author:${author_id}`, request, { author_id });

    return {
      data: data.items,
      meta: data.meta,
      cacheControl: "public, s-maxage=86400, stale-while-revalidate=3600",
    };
  });
}

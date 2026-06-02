import { createOpenApiDocument } from "@/lib/openapi";

export function GET() {
  return Response.json(createOpenApiDocument(), {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
    },
  });
}

import { endpointDefinitions } from "@/lib/developer-content";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const endpoint = endpointDefinitions.find((e) => e.slug === slug);

  if (!endpoint) {
    return Response.json(
      {
        success: false,
        version: "v1",
        timestamp: new Date().toISOString(),
        error: {
          code: "FIXTURE_NOT_FOUND",
          message: `No fixture found for endpoint '${slug}'.`,
          docs: "https://bdapi4all.vercel.app/docs",
        },
      },
      { status: 404 },
    );
  }

  return Response.json(
    {
      success: true,
      version: "v1",
      timestamp: new Date().toISOString(),
      data: endpoint.sampleResponse,
      meta: {
        slug: endpoint.slug,
        title: endpoint.title,
        path: endpoint.path,
        method: endpoint.method,
        group: endpoint.group,
        description: endpoint.description,
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        "Content-Disposition": `attachment; filename="${slug}.json"`,
      },
    },
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204 });
}

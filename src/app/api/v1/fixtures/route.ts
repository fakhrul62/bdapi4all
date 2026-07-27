import { endpointDefinitions } from "@/lib/developer-content";

export const runtime = "nodejs";

export async function GET() {
  const fixtures = endpointDefinitions.map((endpoint) => ({
    slug: endpoint.slug,
    title: endpoint.title,
    path: endpoint.path,
    method: endpoint.method,
    group: endpoint.group,
    fixture: {
      success: true,
      version: "v1",
      timestamp: "2026-01-01T00:00:00.000Z",
      data: endpoint.sampleResponse,
    },
  }));

  return Response.json(
    {
      success: true,
      version: "v1",
      timestamp: new Date().toISOString(),
      data: {
        total: fixtures.length,
        endpoints: fixtures,
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    },
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204 });
}

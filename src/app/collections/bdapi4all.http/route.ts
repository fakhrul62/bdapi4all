import { API_BASE_URL, buildUrl, endpointDefinitions } from "@/lib/developer-content";

export function GET() {
  const body = [
    `@baseUrl = ${API_BASE_URL}`,
    "",
    ...endpointDefinitions.flatMap((endpoint) => {
      const values = Object.fromEntries(endpoint.parameters.map((param) => [param.name, param.example]));
      return [
        `### ${endpoint.title}`,
        `GET ${buildUrl(endpoint, values).replace(API_BASE_URL, "{{baseUrl}}")}`,
        "",
      ];
    }),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
    },
  });
}

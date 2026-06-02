import { API_BASE_URL, buildUrl, endpointDefinitions } from "@/lib/developer-content";

export function GET() {
  const collection = {
    info: {
      name: "BDApi4All",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      description: "Postman collection for the free Bangladesh REST API.",
    },
    variable: [{ key: "baseUrl", value: API_BASE_URL }],
    item: endpointDefinitions.map((endpoint) => {
      const values = Object.fromEntries(endpoint.parameters.map((param) => [param.name, param.example]));
      const url = buildUrl(endpoint, values).replace(API_BASE_URL, "{{baseUrl}}");
      return {
        name: endpoint.title,
        request: {
          method: endpoint.method,
          url,
          description: endpoint.description,
        },
      };
    }),
  };

  return Response.json(collection, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
    },
  });
}

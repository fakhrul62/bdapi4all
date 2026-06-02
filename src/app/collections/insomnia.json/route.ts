import { API_BASE_URL, buildUrl, endpointDefinitions } from "@/lib/developer-content";

export function GET() {
  const now = Date.now();
  const resources = [
    {
      _id: "wrk_bdapi4all",
      _type: "workspace",
      name: "BDApi4All",
      description: "Free Bangladesh REST API.",
      created: now,
      modified: now,
    },
    {
      _id: "env_bdapi4all",
      _type: "environment",
      parentId: "wrk_bdapi4all",
      name: "Base Environment",
      data: { baseUrl: API_BASE_URL },
      created: now,
      modified: now,
    },
    ...endpointDefinitions.map((endpoint) => {
      const values = Object.fromEntries(endpoint.parameters.map((param) => [param.name, param.example]));
      return {
        _id: `req_${endpoint.slug}`,
        _type: "request",
        parentId: "wrk_bdapi4all",
        name: endpoint.title,
        method: endpoint.method,
        url: buildUrl(endpoint, values).replace(API_BASE_URL, "{{ _.baseUrl }}"),
        description: endpoint.description,
        created: now,
        modified: now,
      };
    }),
  ];

  return Response.json({
    _type: "export",
    __export_format: 4,
    __export_date: new Date().toISOString(),
    __export_source: "bdapi4all",
    resources,
  });
}

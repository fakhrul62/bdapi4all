type EndpointParameter = {
  name: string;
  type: string;
  in: "path" | "query";
  required: boolean;
  description: string;
};

type EndpointDoc = {
  title: string;
  description: string;
  method: "GET";
  path: string;
  parameters: EndpointParameter[];
  exampleRequest: string;
  exampleResponse: string;
};

const apiBaseUrl = "https://bdapi4all.vercel.app/api/v1";

const endpointDocs: Record<string, EndpointDoc> = {
  divisions: {
    title: "Divisions",
    description: "Return all 8 administrative divisions of Bangladesh.",
    method: "GET",
    path: "/api/v1/divisions",
    parameters: [],
    exampleRequest: `curl ${apiBaseUrl}/divisions`,
    exampleResponse: `{
  "success": true,
  "version": "v1",
  "timestamp": "2026-06-02T00:00:00.000Z",
  "data": [
    {
      "id": 6,
      "name_en": "Dhaka",
      "name_bn": "ঢাকা",
      "lat": 23.8103,
      "lng": 90.4125
    }
  ]
}`,
  },
  districts: {
    title: "Districts",
    description: "Return all 64 districts, optionally filtered by division.",
    method: "GET",
    path: "/api/v1/districts",
    parameters: [
      {
        name: "division_id",
        type: "integer",
        in: "query",
        required: false,
        description: "Filter districts by division id.",
      },
    ],
    exampleRequest: `curl "${apiBaseUrl}/districts?division_id=6"`,
    exampleResponse: `{
  "success": true,
  "version": "v1",
  "timestamp": "2026-06-02T00:00:00.000Z",
  "data": [
    {
      "id": 47,
      "division_id": 6,
      "name_en": "Dhaka",
      "name_bn": "ঢাকা",
      "lat": 23.7115253,
      "lng": 90.4111451
    }
  ]
}`,
  },
  "prayer-times": {
    title: "Prayer Times",
    description: "Calculate daily prayer times from a district id or coordinates.",
    method: "GET",
    path: "/api/v1/prayer-times",
    parameters: [
      {
        name: "district_id",
        type: "integer",
        in: "query",
        required: false,
        description: "District id. Required unless lat and lng are provided.",
      },
      {
        name: "lat",
        type: "number",
        in: "query",
        required: false,
        description: "Latitude in Bangladesh bounds.",
      },
      {
        name: "lng",
        type: "number",
        in: "query",
        required: false,
        description: "Longitude in Bangladesh bounds.",
      },
      {
        name: "date",
        type: "YYYY-MM-DD",
        in: "query",
        required: false,
        description: "Date. Defaults to today.",
      },
    ],
    exampleRequest: `curl "${apiBaseUrl}/prayer-times?district_id=47&date=2026-06-02"`,
    exampleResponse: `{
  "success": true,
  "version": "v1",
  "timestamp": "2026-06-02T00:00:00.000Z",
  "data": {
    "date": "2026-06-02",
    "timezone": "Asia/Dhaka",
    "times": {
      "fajr": "03:46 AM",
      "sunrise": "05:12 AM",
      "dhuhr": "11:58 AM",
      "asr": "04:42 PM",
      "maghrib": "06:44 PM",
      "isha": "08:10 PM"
    }
  }
}`,
  },
  holidays: {
    title: "Holidays",
    description: "Return curated Bangladesh public holiday data by year.",
    method: "GET",
    path: "/api/v1/holidays",
    parameters: [
      {
        name: "year",
        type: "integer",
        in: "query",
        required: false,
        description: "Holiday year. Defaults to the current year.",
      },
    ],
    exampleRequest: `curl "${apiBaseUrl}/holidays?year=2026"`,
    exampleResponse: `{
  "success": true,
  "version": "v1",
  "timestamp": "2026-06-02T00:00:00.000Z",
  "data": {
    "year": 2026,
    "holidays": [
      {
        "date": "2026-02-21T00:00:00.000Z",
        "name_en": "Shaheed Day and International Mother Language Day",
        "name_bn": "শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস",
        "type": "national"
      }
    ]
  }
}`,
  },
  "exchange-rates": {
    title: "Exchange Rates",
    description: "Return latest Bangladesh Bank exchange rates imported by cron.",
    method: "GET",
    path: "/api/v1/exchange-rates",
    parameters: [],
    exampleRequest: `curl ${apiBaseUrl}/exchange-rates`,
    exampleResponse: `{
  "success": true,
  "version": "v1",
  "timestamp": "2026-06-02T00:00:00.000Z",
  "data": {
    "source": "Bangladesh Bank",
    "rates": [
      {
        "currency_code": "USD",
        "currency_name": "US Dollar",
        "buying_rate": 117.5,
        "selling_rate": 118.2
      }
    ]
  }
}`,
  },
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function EndpointDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const endpoint =
    endpointDocs[slug] ??
    ({
      title: titleFromSlug(slug),
      description: `Reference documentation for ${titleFromSlug(slug)}.`,
      method: "GET",
      path: `/api/v1/${slug}`,
      parameters: [],
      exampleRequest: `curl ${apiBaseUrl}/${slug}`,
      exampleResponse: `{
  "success": true,
  "version": "v1",
  "timestamp": "2026-06-02T00:00:00.000Z",
  "data": []
}`,
    } satisfies EndpointDoc);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded bg-green-500/20 px-2 py-1 font-mono text-sm font-bold text-green-700 dark:text-green-400">
            {endpoint.method}
          </span>
          <code className="font-mono text-sm text-muted-foreground">{endpoint.path}</code>
        </div>
        <h1 className="scroll-m-20 font-heading text-4xl font-extrabold tracking-tight">
          {endpoint.title}
        </h1>
        <p className="text-lg text-muted-foreground">{endpoint.description}</p>
      </div>

      <div className="space-y-4">
        <h2 className="mt-10 scroll-m-20 border-b border-border/50 pb-2 font-heading text-2xl font-semibold tracking-tight">
          Parameters
        </h2>
        {endpoint.parameters.length > 0 ? (
          <div className="overflow-hidden rounded-md border border-border/50 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/50 bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">In</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Required</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {endpoint.parameters.map((param) => (
                  <tr key={`${param.in}-${param.name}`} className="bg-card">
                    <td className="px-4 py-3 font-mono font-medium">{param.name}</td>
                    <td className="px-4 py-3">{param.in}</td>
                    <td className="px-4 py-3 font-mono text-xs">{param.type}</td>
                    <td className="px-4 py-3">
                      {param.required ? (
                        <span className="text-xs font-semibold text-red-500">Yes</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">This endpoint has no parameters.</p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="mt-10 scroll-m-20 border-b border-border/50 pb-2 font-heading text-2xl font-semibold tracking-tight">
          Example Request
        </h2>
        <div className="overflow-x-auto rounded-md border border-border/50 bg-[#0d1117] p-4 shadow-sm">
          <pre className="font-mono text-sm text-gray-300">
            <code>{endpoint.exampleRequest}</code>
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="mt-10 scroll-m-20 border-b border-border/50 pb-2 font-heading text-2xl font-semibold tracking-tight">
          Example Response
        </h2>
        <div className="overflow-x-auto rounded-md border border-border/50 bg-[#0d1117] p-4 shadow-sm">
          <pre className="font-mono text-sm text-primary">
            <code>{endpoint.exampleResponse}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

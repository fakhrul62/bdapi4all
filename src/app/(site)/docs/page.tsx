export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 font-heading text-4xl font-extrabold tracking-tight">
          Introduction
        </h1>
        <p className="text-lg text-muted-foreground">
          Use BDApi4All to fetch Bangladesh geo data, prayer times, holidays, exchange rates, validators, and Bengali utilities from one consistent REST API.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["API Explorer", "/playground", "Run every endpoint live with generated request URLs and code samples."],
          ["Data Browser", "/data", "Search geo IDs and copy JSON rows for your own app."],
          ["OpenAPI", "/openapi.json", "Import the full API spec into Swagger, Postman, Insomnia, or generators."],
          ["Collections", "/collections", "Download Postman, Insomnia, and VS Code REST request files."],
          ["Roadmap", "/roadmap", "Track the platform plan broken into small developer-focused milestones."],
        ].map(([title, href, text]) => (
          <a key={href} href={href} className="rounded-lg border border-border/50 bg-card p-4 hover:border-primary/60">
            <h2 className="font-heading text-xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </a>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b border-border/50 pb-2 text-3xl font-semibold tracking-tight font-heading mt-10">
          Base URL
        </h2>
        <p className="leading-7">
          All API requests should be prefixed with the following base URL:
        </p>
        <div className="rounded-md bg-muted/50 p-4 border border-border/50">
          <code className="text-sm font-mono text-primary font-bold">https://bdapi4all.vercel.app/api/v1</code>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b border-border/50 pb-2 text-3xl font-semibold tracking-tight font-heading mt-10">
          Standard Response Format
        </h2>
        <p className="leading-7">
          Every response follows a strict, predictable JSON format, making it easy to parse and handle errors.
        </p>
        
        <h3 className="text-xl font-semibold mt-4">Success Response</h3>
        <div className="rounded-md bg-[#0d1117] p-4 overflow-x-auto border border-border/50 shadow-sm">
          <pre className="text-sm font-mono text-gray-300">
            <code>{`{
  "success": true,
  "version": "v1",
  "request_id": "6f52e18d-1c2b-4f7f-a9d3-0aaec9cf70a1",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "id": 47,
    "name_en": "Dhaka",
    "name_bn": "ঢাকা"
  }
}`}</code>
          </pre>
        </div>

        <h3 className="text-xl font-semibold mt-6">Error Response</h3>
        <div className="rounded-md bg-[#0d1117] p-4 overflow-x-auto border border-border/50 shadow-sm">
          <pre className="text-sm font-mono text-gray-300">
            <code>{`{
  "success": false,
  "version": "v1",
  "request_id": "6f52e18d-1c2b-4f7f-a9d3-0aaec9cf70a1",
  "timestamp": "2025-01-15T10:30:00Z",
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "docs": "https://bdapi4all.vercel.app/docs/errors#not_found"
  }
}`}</code>
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b border-border/50 pb-2 text-3xl font-semibold tracking-tight font-heading mt-10">
          Request Tracking
        </h2>
        <p className="leading-7">
          Handled API responses include a <code className="font-mono text-primary">request_id</code> value and matching <code className="font-mono text-primary">X-Request-ID</code> header. Send your own header to keep the same ID through client, proxy, and API logs.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 border-b border-border/50 pb-2 text-3xl font-semibold tracking-tight font-heading mt-10">
          Query Controls
        </h2>
        <p className="leading-7">
          Encyclopedia list and search endpoints support payload shaping and multi-field sorting.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-border/50 bg-card p-4">
            <h3 className="font-semibold">Sparse fields</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Use <code className="font-mono text-primary">fields=id,name_en,verified</code> to return only the top-level fields your app needs.
            </p>
          </div>
          <div className="rounded-md border border-border/50 bg-card p-4">
            <h3 className="font-semibold">Multi-field sort</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Use <code className="font-mono text-primary">sort=name_en,-updated_at</code> for ascending name and descending update time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const roadmapGroups = [
  {
    phase: "Phase 1",
    title: "Query ergonomics",
    status: "Next",
    summary: "Make existing endpoints easier to consume before expanding the platform surface.",
    steps: [
      "Sparse fieldsets with fields=id,name_en,district",
      "Multi-field sorting for list endpoints",
      "Consistent pagination metadata and keyset-ready cursors",
      "Shared date, numeric, and boolean filter parsing",
      "Cache headers and request IDs on every API response",
    ],
  },
  {
    phase: "Phase 2",
    title: "Developer tooling",
    status: "Planned",
    summary: "Improve local testing, importable collections, examples, and generated contracts.",
    steps: [
      "Versioned OpenAPI with advanced query parameters",
      "Postman, Insomnia, and VS Code REST collections with richer examples",
      "Fixture downloads and replayable sample responses",
      "Contract validation and response diff tooling",
      "Runnable cookbook examples for common frameworks",
    ],
  },
  {
    phase: "Phase 3",
    title: "SDKs and integrations",
    status: "Planned",
    summary: "Start with the highest-demand clients, then add ecosystem adapters.",
    steps: [
      "Official TypeScript SDK with retries, caching, and batch helpers",
      "Python client with pandas-friendly response helpers",
      "React hooks and Next.js server helpers",
      "PHP/Laravel helpers and WordPress snippets",
      "CLI commands for querying, validation, and local mock data",
    ],
  },
  {
    phase: "Phase 4",
    title: "Events and operations",
    status: "Planned",
    summary: "Add production-grade observability and event delivery after core request paths are stable.",
    steps: [
      "Health checks, public status metrics, and structured request logs",
      "Usage analytics, quota views, and API key rotation",
      "Webhook subscriptions with signatures and retry history",
      "SSE event streams for low-frequency data changes",
      "Dead-letter inspection and event replay",
    ],
  },
  {
    phase: "Phase 5",
    title: "Data platform",
    status: "Planned",
    summary: "Expose richer data workflows for teams that want snapshots, sync, and governance.",
    steps: [
      "Data versioning, diffs, and per-endpoint changelogs",
      "Bulk export in JSON, CSV, XML, MessagePack, and Protocol Buffers",
      "Source lineage, verification state, and contribution workflow",
      "PostgreSQL, MongoDB, Redis, and Elasticsearch sync recipes",
      "Deprecation policy and sunset warnings",
    ],
  },
  {
    phase: "Phase 6",
    title: "Advanced and enterprise",
    status: "Later",
    summary: "Reserve heavy platform features for when usage proves demand and operational capacity is ready.",
    steps: [
      "GraphQL wrapper, subscriptions, gRPC, and request multiplexing",
      "OAuth 2.0 scopes, RBAC, temporary credentials, and IP allowlisting",
      "Private deployments, custom SLAs, audit logs, and compliance reporting",
      "Semantic search, embeddings, recommendations, and Bengali NLP APIs",
      "Community programs, showcases, challenges, and marketplace listings",
    ],
  },
];

const immediateMilestones = [
  "Ship shared query helpers for fields, sort, pagination, and cache-aware responses.",
  "Expose those helpers on encyclopedia list/search endpoints first.",
  "Document the supported query contract in endpoint docs, OpenAPI, and collections.",
  "Add fixtures and tests around the new query behavior.",
  "Build the TypeScript SDK around the stable query contract.",
];

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Developer roadmap</p>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">
          Smaller steps for the BDApi4All developer platform
        </h1>
        <p className="text-lg text-muted-foreground">
          The platform roadmap is organized around shippable increments: stabilize the API contract, improve tools, add SDKs, then move into real-time, data governance, enterprise, and AI features.
        </p>
      </div>

      <section className="mb-10 rounded-md border border-border/50 bg-muted/30 p-5">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">Immediate implementation order</h2>
        <ol className="mt-4 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          {immediateMilestones.map((milestone, index) => (
            <li key={milestone} className="rounded-md border border-border/50 bg-background px-4 py-3">
              <span className="mr-2 font-mono text-xs font-semibold text-primary">{index + 1}</span>
              {milestone}
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {roadmapGroups.map((group) => (
          <section key={group.title} className="rounded-md border border-border/50 bg-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-primary/10 px-2 py-1 font-mono text-xs font-semibold text-primary">
                {group.phase}
              </span>
              <span className="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                {group.status}
              </span>
            </div>
            <h2 className="mt-4 font-heading text-2xl font-semibold tracking-tight">{group.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.summary}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {group.steps.map((step) => (
                <li key={step} className="border-l-2 border-primary/30 pl-3">
                  {step}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

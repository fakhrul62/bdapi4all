import Link from "next/link";
import { codeSamples, endpointDefinitions, findEndpoint } from "@/lib/developer-content";

function fallbackEndpoint() {
  return endpointDefinitions[0];
}

export default async function EndpointDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const endpoint = findEndpoint(slug) ?? fallbackEndpoint();
  const samples = codeSamples(endpoint);
  const exampleMeta = endpoint.parameters.some((parameter) => parameter.name === "page")
    ? {
        pagination: {
          page: 1,
          limit: 20,
          total: Array.isArray(endpoint.sampleResponse) ? endpoint.sampleResponse.length : 1,
          total_pages: 1,
        },
      }
    : undefined;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded bg-green-500/20 px-2 py-1 font-mono text-sm font-bold text-green-700 dark:text-green-400">
            {endpoint.method}
          </span>
          <code className="font-mono text-sm text-muted-foreground">/api/v1{endpoint.path}</code>
        </div>
        <h1 className="scroll-m-20 font-heading text-4xl font-extrabold tracking-tight">
          {endpoint.title}
        </h1>
        <p className="text-lg text-muted-foreground">{endpoint.description}</p>
        <div className="flex flex-wrap gap-2 pt-2 text-xs">
          <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{endpoint.group}</span>
          <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">Cache: {endpoint.cacheTtl}</span>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Link href="/playground" className="rounded-lg border border-border/50 bg-card p-4 hover:border-primary/60">
          <h2 className="font-semibold">Try live</h2>
          <p className="mt-1 text-sm text-muted-foreground">Open this endpoint in the API Explorer.</p>
        </Link>
        <Link href="/openapi.json" className="rounded-lg border border-border/50 bg-card p-4 hover:border-primary/60">
          <h2 className="font-semibold">OpenAPI</h2>
          <p className="mt-1 text-sm text-muted-foreground">Import this API into your tooling.</p>
        </Link>
        <Link href="/cookbook" className="rounded-lg border border-border/50 bg-card p-4 hover:border-primary/60">
          <h2 className="font-semibold">Cookbook</h2>
          <p className="mt-1 text-sm text-muted-foreground">See real implementation patterns.</p>
        </Link>
      </div>

      <section className="space-y-4">
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
                  <tr key={`${param.location}-${param.name}`} className="bg-card">
                    <td className="px-4 py-3 font-mono font-medium">{param.name}</td>
                    <td className="px-4 py-3">{param.location}</td>
                    <td className="px-4 py-3 font-mono text-xs">{param.type}</td>
                    <td className="px-4 py-3">{param.required ? "Yes" : "No"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">This endpoint has no parameters.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="mt-10 scroll-m-20 border-b border-border/50 pb-2 font-heading text-2xl font-semibold tracking-tight">
          Code Samples
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {Object.entries(samples).map(([name, sample]) => (
            <div key={name} className="overflow-hidden rounded-md border border-border/50">
              <div className="border-b border-border/50 bg-muted/50 px-4 py-2 text-sm font-semibold capitalize">{name}</div>
              <pre className="h-56 overflow-auto bg-[#0d1117] p-4 text-xs text-green-300">
                <code>{sample}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="mt-10 scroll-m-20 border-b border-border/50 pb-2 font-heading text-2xl font-semibold tracking-tight">
          Example Response
        </h2>
        <pre className="overflow-x-auto rounded-md border border-border/50 bg-[#0d1117] p-4 text-sm text-green-300 shadow-sm">
          <code>{JSON.stringify({
            success: true,
            version: "v1",
            timestamp: "2026-06-02T00:00:00.000Z",
            data: endpoint.sampleResponse,
            ...(exampleMeta ? { meta: exampleMeta } : {}),
          }, null, 2)}</code>
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="mt-10 scroll-m-20 border-b border-border/50 pb-2 font-heading text-2xl font-semibold tracking-tight">
          Common Uses
        </h2>
        <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          {endpoint.recipes.map((recipe) => (
            <li key={recipe} className="rounded-md border border-border/50 bg-card px-3 py-2">
              {recipe}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

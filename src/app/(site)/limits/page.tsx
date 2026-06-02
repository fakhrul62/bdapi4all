const headers = [
  { name: "X-RateLimit-Remaining", meaning: "Requests remaining in the current minute window." },
  { name: "X-Response-Time", meaning: "Server-side response time measured by BDApi4All." },
  { name: "Cache-Control", meaning: "Recommended CDN/browser cache policy for the response." },
  { name: "Retry-After", meaning: "Seconds to wait after a 429 response." },
];

const ttl = [
  ["Geo data", "24 hours"],
  ["Prayer times", "1 hour"],
  ["Holidays", "24 hours"],
  ["Exchange rates", "1 hour"],
  ["Validators", "10 minutes"],
  ["Utilities", "1 hour"],
];

export default function LimitsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-extrabold tracking-tight">Rate Limits & Caching</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        BDApi4All is free and no-auth for basic use. The public limit is 100 requests per minute per IP.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <section className="rounded-lg border border-border/50 bg-card p-5">
          <h2 className="font-heading text-2xl font-bold">Headers</h2>
          <dl className="mt-4 space-y-4">
            {headers.map((header) => (
              <div key={header.name}>
                <dt className="font-mono text-sm text-primary">{header.name}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{header.meaning}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-lg border border-border/50 bg-card p-5">
          <h2 className="font-heading text-2xl font-bold">Cache TTL</h2>
          <table className="mt-4 w-full text-left text-sm">
            <tbody className="divide-y divide-border/50">
              {ttl.map(([name, value]) => (
                <tr key={name}>
                  <td className="py-3">{name}</td>
                  <td className="py-3 text-right font-mono text-muted-foreground">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <section className="mt-5 rounded-lg border border-border/50 bg-card p-5">
        <h2 className="font-heading text-2xl font-bold">429 Example</h2>
        <pre className="mt-4 overflow-auto rounded-md bg-[#0d1117] p-4 text-sm text-green-300">
          <code>{`{
  "success": false,
  "version": "v1",
  "timestamp": "2026-06-02T00:00:00.000Z",
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded.",
    "docs": "https://bdapi4all.vercel.app/docs/errors#rate_limited"
  }
}`}</code>
        </pre>
      </section>
    </div>
  );
}

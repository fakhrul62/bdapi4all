const sources = [
  {
    name: "Geo data",
    source: "github.com/nuhil/bangladesh-geocode",
    cadence: "Seeded into Supabase; refreshed manually when upstream changes are reviewed.",
    note: "Provides divisions, districts, upazilas, unions, and district coordinates.",
  },
  {
    name: "Prayer times",
    source: "adhan-js calculation",
    cadence: "Calculated per request and cached for 1 hour.",
    note: "Uses district coordinates or supplied coordinates with Asia/Dhaka output.",
  },
  {
    name: "Holidays",
    source: "Curated JSON",
    cadence: "Updated annually after public holiday lists are confirmed.",
    note: "Current data is intentionally explicit and reviewable.",
  },
  {
    name: "Exchange rates",
    source: "Bangladesh Bank",
    cadence: "Imported daily by Vercel Cron at 06:00 Bangladesh time.",
    note: "Stored in Supabase and cached for public API requests.",
  },
  {
    name: "Mobile operators",
    source: "Maintained static prefix list",
    cadence: "Updated when BTRC/operator prefix allocation changes.",
    note: "Covers 013-019 Bangladesh mobile prefixes.",
  },
];

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-heading text-4xl font-extrabold tracking-tight">Data Sources</h1>
      <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
        Source transparency matters for developer trust. This page explains where each dataset comes from and how it is maintained.
      </p>

      <div className="mt-8 space-y-4">
        {sources.map((source) => (
          <section key={source.name} className="rounded-lg border border-border/50 bg-card p-5">
            <h2 className="font-heading text-2xl font-bold">{source.name}</h2>
            <dl className="mt-4 grid gap-4 text-sm md:grid-cols-3">
              <div>
                <dt className="font-semibold">Source</dt>
                <dd className="mt-1 text-muted-foreground">{source.source}</dd>
              </div>
              <div>
                <dt className="font-semibold">Update Cadence</dt>
                <dd className="mt-1 text-muted-foreground">{source.cadence}</dd>
              </div>
              <div>
                <dt className="font-semibold">Notes</dt>
                <dd className="mt-1 text-muted-foreground">{source.note}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}

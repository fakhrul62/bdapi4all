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
  {
    name: "Bangladesh encyclopedia",
    source: "Wikipedia, Bengali Wikipedia, curated seed data, and admin-reviewed enrichment",
    cadence: "Expanded by import scripts and checked by weekly data-quality cron.",
    note: "Records expose source, source_url, verified, and needs_image so developers can decide how strict their app should be.",
  },
];

const transparency = [
  {
    label: "verified: true",
    text: "The record has a source-backed URL from an enrichment/import pipeline or admin review. It is still open to correction if a better official source appears.",
  },
  {
    label: "verified: false",
    text: "The record is useful as seed/reference data, but it needs manual review before being treated as authoritative.",
  },
  {
    label: "source",
    text: "Identifies where the record came from, such as wikipedia, wikipedia_search, google_books, open_library, curated_seed, or ai_generated.",
  },
  {
    label: "needs_image",
    text: "True means no confirmed reusable image URL is attached yet. The API does not invent image URLs.",
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

      <section className="mt-10 rounded-lg border border-border/50 bg-card p-5">
        <h2 className="font-heading text-2xl font-bold">Verified vs Unverified</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          BDApi4All is transparent by design. Every encyclopedia record carries review fields so apps can show only verified records,
          include unverified records with a badge, or build their own moderation workflow.
        </p>
        <dl className="mt-5 grid gap-4 md:grid-cols-2">
          {transparency.map((item) => (
            <div key={item.label} className="rounded-md bg-muted/50 p-4">
              <dt className="font-mono text-sm font-semibold text-primary">{item.label}</dt>
              <dd className="mt-2 text-sm text-muted-foreground">{item.text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

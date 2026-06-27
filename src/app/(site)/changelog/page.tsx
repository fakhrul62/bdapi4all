export default function ChangelogPage() {
  const releases = [
    {
      version: "v1.2.0",
      date: "June 28, 2026",
      title: "Developer Platform Roadmap",
      description: "Converted the expanded developer feature wishlist into small implementation phases and published the roadmap in the developer portal.",
      features: [
        "Added a roadmap page grouped by query ergonomics, tooling, SDKs, events, data platform, and enterprise features",
        "Linked the roadmap from Docs and the main navigation",
        "Documented the immediate implementation order for shared query helpers and SDK foundations",
      ],
      fixes: [],
    },
    {
      version: "v1.0.0",
      date: "May 23, 2026",
      title: "Initial Release of BDApi4All (Phase 1)",
      description: "The first comprehensive REST API for Bangladesh is now live! Phase 1 includes mock data endpoints and a beautiful documentation site.",
      features: [
        "Geo & Location Endpoints (Divisions, Districts, Upazilas, Unions)",
        "Prayer Times Calculator",
        "Holidays and Exchange Rates",
        "Mobile Operator Validator",
      ],
      fixes: [],
    },
    {
      version: "v1.1.0",
      date: "June 2, 2026",
      title: "Developer Portal Expansion",
      description: "Added OpenAPI, API collections, live explorer, data browser, cookbook, tools, live status checks, source transparency, and rate-limit documentation.",
      features: [
        "OpenAPI 3.1 spec and Postman/Insomnia/VS Code REST exports",
        "Endpoint-specific API Explorer with code snippets",
        "Interactive Bangladesh geo data browser",
        "Developer cookbook and standalone API tools",
      ],
      fixes: ["Completed production backend wiring and Vercel deployment"],
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-4 mb-12">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">Changelog</h1>
        <p className="text-lg text-muted-foreground">
          New updates and improvements to the BDApi4All platform.
        </p>
      </div>

      <div className="space-y-12 border-l border-border/50 ml-4 pl-8 relative">
        {releases.map((release, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                <h2 className="text-2xl font-bold font-heading">{release.version}</h2>
                <span className="text-muted-foreground text-sm">{release.date}</span>
              </div>
              <h3 className="text-xl font-medium">{release.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{release.description}</p>
              
              {release.features.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider text-green-600 dark:text-green-400">Features</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {release.features.map((feature, j) => (
                      <li key={j}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

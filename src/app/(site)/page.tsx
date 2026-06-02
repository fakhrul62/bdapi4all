import Link from "next/link";
import { Database, FileJson, FlaskConical, SearchCode, TerminalSquare, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const developerLinks = [
  { title: "API Explorer", href: "/playground", icon: TerminalSquare, text: "Run live requests, inspect headers, and copy code." },
  { title: "Data Browser", href: "/data", icon: Database, text: "Search geo IDs and copy row JSON." },
  { title: "OpenAPI", href: "/openapi.json", icon: FileJson, text: "Import into Postman, Insomnia, or Swagger tools." },
  { title: "Cookbook", href: "/cookbook", icon: SearchCode, text: "Practical examples for common Bangladesh app flows." },
  { title: "Tools", href: "/tools", icon: Wrench, text: "Validators, operator lookup, geocode, and Bengali utilities." },
  { title: "Status", href: "/status", icon: FlaskConical, text: "Live endpoint health checks and response timing." },
];

export default function LandingPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_520px] lg:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Free Bangladesh API for developers
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
            Build Bangladesh-aware apps faster.
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            BDApi4All provides geo data, prayer times, holidays, exchange rates, mobile operators, validators, and Bengali utilities through one consistent REST API.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/playground">
              <Button size="lg" className="w-full text-primary-foreground sm:w-auto">
                Try API Explorer
              </Button>
            </Link>
            <Link href="/data">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Browse Data IDs
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border/50 bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 bg-muted/50 px-4 py-3">
            <code className="font-mono text-xs text-muted-foreground">GET /api/v1/districts?division_id=6</code>
            <span className="rounded-full bg-green-500/15 px-2 py-1 text-xs font-semibold text-green-600">200 OK</span>
          </div>
          <pre className="overflow-auto bg-[#0d1117] p-5 text-sm text-green-300">
            <code>{`{
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
}`}</code>
          </pre>
        </div>
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {developerLinks.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-primary/60">
            <item.icon className="h-5 w-5 text-primary" />
            <h2 className="mt-4 font-heading text-xl font-bold">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-4 md:grid-cols-4">
        {[
          ["25+", "Endpoints"],
          ["64", "Districts"],
          ["494", "Upazilas"],
          ["4540", "Unions"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-lg border border-border/50 bg-card p-5">
            <div className="font-heading text-3xl font-extrabold text-primary">{value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}

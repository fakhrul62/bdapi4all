import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  FileJson,
  Globe2,
  Languages,
  Layers3,
  MapPin,
  Phone,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Zap,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredApis = [
  {
    title: "Prayer Times",
    group: "Prayer Times",
    href: "/docs/prayer-times",
    path: "GET /api/v1/prayer-times?district_id=47",
    text: "Daily salah times from district IDs or coordinates, with Asia/Dhaka timezone handling built in.",
    icon: Clock3,
    accent: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    title: "Next Holiday",
    group: "Holidays",
    href: "/docs/holiday-next",
    path: "GET /api/v1/holidays/next",
    text: "Show the next national, public, or cultural holiday without maintaining a calendar yourself.",
    icon: CalendarDays,
    accent: "text-rose-600 bg-rose-500/10 border-rose-500/20",
  },
  {
    title: "Mobile Operator",
    group: "Mobile",
    href: "/docs/mobile-operator",
    path: "GET /api/v1/mobile/operator?number=017...",
    text: "Detect Bangladeshi operators and validate number prefixes for signup, CRM, and support flows.",
    icon: Phone,
    accent: "text-sky-600 bg-sky-500/10 border-sky-500/20",
  },
  {
    title: "Exchange Rates",
    group: "Exchange Rates",
    href: "/docs/exchange-rates",
    path: "GET /api/v1/exchange-rates",
    text: "Fetch BDT exchange-rate data for widgets, remittance tools, commerce, and finance dashboards.",
    icon: Globe2,
    accent: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
  {
    title: "Bengali Utilities",
    group: "Bengali Utilities",
    href: "/docs/bn-transliterate",
    path: "GET /api/v1/bn/transliterate?text=bangladesh",
    text: "Convert digits and run basic transliteration for forms that need Bengali-friendly output.",
    icon: Languages,
    accent: "text-fuchsia-600 bg-fuchsia-500/10 border-fuchsia-500/20",
  },
  {
    title: "Geo Lookup",
    group: "Geo & Location",
    href: "/docs/geocode",
    path: "GET /api/v1/geocode?district=Dhaka",
    text: "Resolve Bangladesh districts and upazilas into coordinates for maps, search, and location UX.",
    icon: MapPin,
    accent: "text-lime-700 bg-lime-500/10 border-lime-500/20",
  },
];

const developerLinks = [
  { title: "API Explorer", href: "/playground", icon: TerminalSquare, text: "Run requests, inspect responses, and copy URLs." },
  { title: "Docs", href: "/docs", icon: BookOpen, text: "Endpoint guides, parameters, samples, and recipes." },
  { title: "Data Browser", href: "/data", icon: Database, text: "Find IDs for divisions, districts, upazilas, and unions." },
  { title: "Collections", href: "/collections", icon: FileJson, text: "Postman, Insomnia, and VS Code REST files." },
  { title: "Tools", href: "/tools", icon: Wrench, text: "Validators, operator lookup, geocode, and Bengali helpers." },
  { title: "Global Search", href: "/docs/search", icon: Search, text: "Search people, books, places, rivers, foods, and more." },
];

const stats = [
  ["8", "Divisions"],
  ["64", "Districts"],
  ["494", "Upazilas"],
  ["4,540", "Unions"],
];

const liveMetrics = [
  ["12ms", "edge cache"],
  ["v1", "stable"],
  ["JSON", "response"],
];

const requestSamples = [
  "curl https://bdapi4all.vercel.app/api/v1/holidays/next",
  "curl https://bdapi4all.vercel.app/api/v1/mobile/operator?number=01700000000",
  "curl https://bdapi4all.vercel.app/api/v1/prayer-times?district_id=47",
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      <section className="home-hero relative border-b border-border/50 bg-background">
        <div className="home-hero-grid" aria-hidden="true" />
        <div className="mx-auto grid min-h-[calc(100svh-3.5rem)] max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_540px] lg:items-center lg:px-8">
          <div className="relative z-10 max-w-3xl">
            <div className="home-rise mb-5 inline-flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
              <CheckCircle2 className="size-4" />
              Free Bangladesh API for serious local products
            </div>
            <h1 className="home-rise home-delay-1 font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Bangladesh data, ready for your next request.
            </h1>
            <p className="home-rise home-delay-2 mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              BDApi4All brings geo data, prayer times, holidays, exchange rates, mobile operators, validators, Bengali utilities, and searchable Bangladesh knowledge into one consistent REST API.
            </p>

            <div className="home-rise home-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/playground">
                <Button size="lg" className="h-11 w-full gap-2 px-4 text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 sm:w-auto">
                  <TerminalSquare className="size-4" />
                  Try API Explorer
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="h-11 w-full gap-2 px-4 bg-background/70 backdrop-blur transition-transform hover:-translate-y-0.5 sm:w-auto">
                  <BookOpen className="size-4" />
                  Read Docs
                </Button>
              </Link>
            </div>

            <div className="home-rise home-delay-4 mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="group rounded-lg border border-border/60 bg-card/85 p-4 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                  <div className="font-heading text-2xl font-extrabold text-primary">{value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="home-console relative z-10 rounded-lg border border-border/60 bg-card/90 shadow-2xl shadow-primary/10 backdrop-blur">
            <div className="home-scan" aria-hidden="true" />
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Code2 className="size-4 text-primary" />
                Live-style API console
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-600">
                <span className="home-status-dot" />
                200 OK
              </span>
            </div>
            <div className="grid gap-3 border-b border-border/60 p-4 sm:grid-cols-3">
              {liveMetrics.map(([value, label], index) => (
                <div key={label} className="rounded-lg border border-border/60 bg-background/80 p-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    {index === 0 ? <Zap className="size-4 text-amber-500" /> : null}
                    {index === 1 ? <Activity className="size-4 text-emerald-500" /> : null}
                    {index === 2 ? <Layers3 className="size-4 text-sky-500" /> : null}
                    {value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-b border-border/60 bg-muted/25 p-4">
              {requestSamples.map((sample) => (
                <code key={sample} className="home-command block overflow-x-auto rounded-md border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground">
                  {sample}
                </code>
              ))}
            </div>
            <pre className="overflow-auto bg-[#0d1117] p-5 text-sm leading-6 text-emerald-200">
              <code>{`{
  "success": true,
  "version": "v1",
  "request_id": "bdapi_7Yk29",
  "timestamp": "2026-06-30T18:00:00.000Z",
  "data": {
    "date": "2026-12-16",
    "name_en": "Victory Day",
    "name_bn": "বিজয় দিবস",
    "type": "national"
  }
}`}</code>
            </pre>
            <div className="grid gap-3 border-t border-border/60 bg-background/70 p-4 sm:grid-cols-3">
              {["Dhaka", "Sylhet", "Chattogram"].map((city, index) => (
                <div key={city} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <span className={`home-route home-route-${index + 1}`} />
                  {city} synced
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/25 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-primary">Featured APIs</p>
              <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                Intriguing endpoints worth trying first
              </h2>
            </div>
            <Link href="/docs" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              View every endpoint
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredApis.map((api) => (
              <Link key={api.href} href={api.href} className="group rounded-lg border border-border/60 bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-lg border p-2 transition-transform duration-300 group-hover:scale-110 ${api.accent}`}>
                    <api.icon className="size-5" />
                  </div>
                  <span className="rounded-lg bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                    {api.group}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold">{api.title}</h3>
                <code className="mt-3 block overflow-x-auto rounded-md bg-muted/70 px-3 py-2 text-xs text-primary">
                  {api.path}
                </code>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{api.text}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary opacity-0 transition duration-300 group-hover:opacity-100">
                  Open guide
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">Developer workflow</p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight">
              From idea to shipped integration
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Start with live requests, copy stable data IDs, import the OpenAPI spec, and keep response handling predictable across your app.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {developerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="group rounded-lg border border-border/60 bg-card p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-md">
                <item.icon className="size-5 text-primary" />
                <h3 className="mt-4 font-heading text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted">
                  <div className="home-link-meter h-full rounded-full bg-primary transition-all duration-500 group-hover:w-full" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-border/50 bg-card px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {[
            ["One response shape", "Every handled response includes success, version, request_id, timestamp, and either data or a structured error."],
            ["Bangladesh-first coverage", "Administrative geography, Bengali text helpers, national dates, people, books, foods, rivers, and local validation rules live together."],
            ["Import-friendly", "OpenAPI, Postman, Insomnia, and VS Code REST collections are ready when you want codegen or team sharing."],
          ].map(([title, text]) => (
            <div key={title} className="group rounded-lg border border-border/60 bg-background p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/50">
              {title === "Bangladesh-first coverage" ? (
                <Route className="size-5 text-primary" />
              ) : title === "Import-friendly" ? (
                <Sparkles className="size-5 text-primary" />
              ) : (
                <ShieldCheck className="size-5 text-primary" />
              )}
              <h3 className="mt-4 font-heading text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

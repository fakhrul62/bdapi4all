import { Download, ArrowUpRight } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
const collections = [
  {
    title: "OpenAPI 3.1",
    href: "/openapi.json",
    description: "Import into Swagger UI, Stoplight, Postman, Insomnia, or code generators.",
  },
  {
    title: "Postman Collection",
    href: "/collections/postman.json",
    description: "Ready-to-import Postman collection with example parameters.",
  },
  {
    title: "Insomnia Collection",
    href: "/collections/insomnia.json",
    description: "Insomnia export for testing all public endpoints.",
  },
  {
    title: "VS Code REST File",
    href: "/collections/bdapi4all.http",
    description: "Plain HTTP request file for VS Code REST Client and JetBrains IDEs.",
  },
  {
    title: "Response Fixtures",
    href: "/api/v1/fixtures",
    description: "Downloadable sample JSON responses for every endpoint. Use for offline development, CI testing, and mocking.",
  },
];

export const metadata = { title: "API Collections" };

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">API Collections</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Import BDApi4All into your preferred API client or tooling workflow.
        </p>
      </div>
      <p className="mb-5 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">Download a collection, import it into your client, and send your first request. Public endpoints work without an API key. Fixtures are examples for testing.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {collections.map((collection) => (
          <section key={collection.href} className="min-w-0 rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-primary/60">
            <h2 className="font-heading text-xl font-bold">{collection.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{collection.description}</p>
            <code className="mt-4 block break-all rounded-md bg-muted/50 px-3 py-2 text-xs text-primary">{collection.href}</code>
            <div className="mt-4 flex flex-wrap items-center gap-3"><a href={collection.href} download={collection.href.startsWith("/collections/") || undefined} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">{collection.href.startsWith("/collections/") ? <Download className="size-4" /> : <ArrowUpRight className="size-4" />}{collection.href.startsWith("/collections/") ? "Download" : "Open JSON"}</a><CopyButton text={`https://bdapi4all.vercel.app${collection.href}`} label="Copy URL" /></div>
          </section>
        ))}
      </div>
    </div>
  );
}

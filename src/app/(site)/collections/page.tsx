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
];

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">API Collections</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Import BDApi4All into your preferred API client or tooling workflow.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {collections.map((collection) => (
          <a key={collection.href} href={collection.href} className="rounded-lg border border-border/50 bg-card p-5 transition-colors hover:border-primary/60">
            <h2 className="font-heading text-xl font-bold">{collection.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{collection.description}</p>
            <code className="mt-4 block rounded-md bg-muted/50 px-3 py-2 text-xs text-primary">{collection.href}</code>
          </a>
        ))}
      </div>
    </div>
  );
}

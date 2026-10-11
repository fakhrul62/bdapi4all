import Link from "next/link";

const groups = [
  { title: "Build", links: [["Documentation", "/docs"], ["API Explorer", "/playground"], ["Cookbook", "/cookbook"], ["Collections", "/collections"]] },
  { title: "Explore", links: [["Data Browser", "/data"], ["Developer Tools", "/tools"], ["Data Sources", "/sources"], ["Rate Limits", "/limits"]] },
  { title: "Project", links: [["API Status", "/status"], ["Changelog", "/changelog"], ["Roadmap", "/roadmap"], ["GitHub", "https://github.com/fakhrul62/bdapi4all"]] },
];

export function Footer() {
  return <footer className="border-t border-border/70 bg-muted/30">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:px-8">
      <div className="col-span-2 lg:col-span-1"><Link href="/" className="font-heading text-xl font-bold">BDApi4All</Link><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">Bangladesh data for your next project. Open source, free to use, and built for developers.</p><p className="mt-3 text-xs text-muted-foreground">REST · JSON · English & Bengali</p></div>
      {groups.map(group => <nav key={group.title} aria-label={`${group.title} links`}><h2 className="mb-3 text-sm font-semibold">{group.title}</h2><ul className="space-y-2">{group.links.map(([title, href]) => <li key={href}><Link href={href} target={href.startsWith("https") ? "_blank" : undefined} rel={href.startsWith("https") ? "noreferrer" : undefined} className="text-sm text-muted-foreground hover:text-primary">{title}</Link></li>)}</ul></nav>)}
    </div>
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-border/70 px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8"><span>Check source and verification fields before relying on a record.</span><Link href="/openapi.json" className="font-mono hover:text-primary">OpenAPI 3.1 ↗</Link></div>
  </footer>;
}

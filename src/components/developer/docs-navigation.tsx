"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

type Group = { title: string; links: { title: string; href: string }[] };

export function DocsNavigation({ groups }: { groups: Group[] }) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const filtered = groups.map(group => ({ ...group, links: group.links.filter(link => `${link.title} ${group.title}`.toLowerCase().includes(query.trim().toLowerCase())) })).filter(group => group.links.length);
  return <aside className="min-w-0 border-b border-border py-4 md:sticky md:top-16 md:max-h-[calc(100svh-4rem)] md:overflow-y-auto md:border-b-0 md:py-6 md:pr-3">
    <button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="docs-navigation" className="mb-3 flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-sm font-semibold md:hidden">Browse documentation <span>{expanded ? "−" : "+"}</span></button>
    <div id="docs-navigation" className={expanded ? "block" : "hidden md:block"}>
      <label className="mb-5 flex items-center gap-2 rounded-md border border-input bg-card px-3 py-2"><Search className="size-4 shrink-0 text-muted-foreground" /><input aria-label="Search documentation" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a guide…" className="min-w-0 w-full bg-transparent text-sm outline-none" /></label>
      <nav aria-label="Documentation">{filtered.map(group => <div key={group.title} className="pb-5"><h2 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.title}</h2><div className="space-y-0.5">{group.links.map(link => <Link key={link.href} href={link.href} onClick={() => setExpanded(false)} aria-current={pathname === link.href ? "page" : undefined} className={`block rounded-md px-2 py-2 text-sm transition-colors ${pathname === link.href ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{link.title}</Link>)}</div></div>)}</nav>
      {!filtered.length && <p role="status" className="px-2 text-sm text-muted-foreground">No guides match “{query}”. <button type="button" onClick={() => setQuery("")} className="mt-2 block text-primary">Clear search</button></p>}
    </div>
  </aside>;
}

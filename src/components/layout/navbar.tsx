"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const links = [["Docs", "/docs"], ["Playground", "/playground"], ["Data", "/data"], ["Cookbook", "/cookbook"], ["Tools", "/tools"], ["Status", "/status"]];
const moreLinks = [["Collections", "/collections"], ["Sources", "/sources"], ["Rate limits", "/limits"], ["Roadmap", "/roadmap"], ["Changelog", "/changelog"]];

export function Navbar() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  function navLink([title, href]: string[]) {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return <Link key={href} href={href} onClick={() => setOpenPath(null)} aria-current={active ? "page" : undefined}
      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{title}</Link>;
  }
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="BDApi4All home" className="shrink-0 font-heading text-xl font-bold tracking-tight">BD<span className="text-primary">Api</span>4All<span className="ml-2 rounded border border-border px-1.5 py-0.5 align-middle font-mono text-[10px] text-muted-foreground">v1</span></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">{links.map(navLink)}</nav>
        <div className="flex items-center gap-2">
          <Link href="https://github.com/fakhrul62/bdapi4all" target="_blank" rel="noreferrer" className="hidden items-center gap-1 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted xl:inline-flex">GitHub <ArrowUpRight className="size-3.5" /></Link>
          <ThemeToggle />
          <button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpenPath(open ? null : pathname)} className="grid size-10 place-items-center rounded-md border border-border hover:bg-muted" onKeyDown={(event) => { if (event.key === "Escape") setOpenPath(null); }}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && <nav id="site-menu" aria-label="More navigation" onKeyDown={(event) => { if (event.key === "Escape") setOpenPath(null); }} className="mx-auto grid max-h-[calc(100svh-4rem)] max-w-7xl grid-cols-2 gap-1 overflow-y-auto border-t border-border px-4 py-4 sm:grid-cols-3 sm:px-6">
        {links.map(navLink)}{moreLinks.map(navLink)}
        <Link href="https://github.com/fakhrul62/bdapi4all/issues" target="_blank" rel="noreferrer" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Report an issue ↗</Link>
      </nav>}
    </header>
  );
}

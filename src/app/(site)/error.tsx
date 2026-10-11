"use client";

import Link from "next/link";

export default function SiteError({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-xl px-4 py-20 text-center"><p className="text-sm font-semibold text-destructive">Something went wrong</p><h1 className="mt-3 font-heading text-3xl font-bold">This page couldn’t load</h1><p className="mt-4 text-muted-foreground">Try loading it again. If the problem continues, check the API status or report it on GitHub.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button onClick={reset} className="rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">Try again</button><Link href="/status" className="rounded-md border border-border px-4 py-3 text-sm font-medium">Check status</Link></div></div>;
}

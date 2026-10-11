import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return <div className="mx-auto max-w-xl px-4 py-20 text-center"><div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Search className="size-6" /></div><p className="text-sm font-semibold text-primary">404 · Page not found</p><h1 className="mt-3 font-heading text-3xl font-bold">Let’s get you back on track</h1><p className="mt-4 leading-7 text-muted-foreground">This page may have moved, or the address may be incomplete. Browse the documentation to find the endpoint you need.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/docs" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">Browse docs <ArrowRight className="size-4" /></Link><Link href="/" className="rounded-md border border-border px-4 py-3 text-sm font-medium hover:bg-muted">Back to home</Link></div></div>;
}

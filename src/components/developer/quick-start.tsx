"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Loader2, TerminalSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";

const choices = [
  { title: "Divisions", path: "/divisions", slug: "divisions" },
  { title: "Next holiday", path: "/holidays/next", slug: "holiday-next" },
  { title: "Bengali digits", path: "/bn/to-bengali?text=2026", slug: "bn-to-bengali" },
];
export function QuickStart() {
  const [selected, setSelected] = useState(choices[0]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const sample = `curl "https://bdapi4all.vercel.app/api/v1${selected.path}"`;
  async function run() {
    setLoading(true); setStatus(null);
    const started = performance.now();
    try {
      const response = await fetch(`/api/v1${selected.path}`, { signal: AbortSignal.timeout(15000) });
      setStatus(response.status);
      setResult(JSON.stringify(await response.json(), null, 2));
    } catch { setResult("Could not complete the request. Check your connection and try again."); }
    finally { setLoading(false); setElapsed(Math.round(performance.now() - started)); }
  }
  return <div className="relative z-10 min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-primary/5">
    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4"><span className="flex items-center gap-2 text-sm font-semibold"><TerminalSquare className="size-4 text-primary" />Your first API request</span><span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-400">No key needed</span></div>
    <div className="flex flex-wrap gap-2 p-4">{choices.map(choice => <button type="button" disabled={loading} aria-pressed={selected.slug === choice.slug} key={choice.slug} onClick={() => { setSelected(choice); setResult(""); setStatus(null); }} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${selected.slug === choice.slug ? "border-primary/30 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>{choice.title}</button>)}</div>
    <div className="mx-4 mb-4 flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3"><code className="min-w-0 flex-1 break-all text-xs leading-6">{sample}</code><CopyButton text={sample} label="Copy curl command" compact /></div>
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-4"><Button onClick={run} disabled={loading} className="gap-2">{loading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}{loading ? "Requesting…" : "Run live request"}</Button><span role="status" className="text-xs text-muted-foreground">{status ? `HTTP ${status} · ${elapsed} ms in your browser` : loading ? "Connecting to the API…" : "A real response, when you’re ready"}</span></div>
    <pre className="h-64 overflow-auto bg-[#0d1117] p-5 text-xs leading-6 text-emerald-200" aria-label="API response"><code>{result || `// Click “Run live request” to fetch ${selected.title.toLowerCase()}.\n// The JSON response will appear here.\n\n// Public endpoint · English & Bengali data\n// Copy the command, or explore more parameters below.`}</code></pre>
    <Link href={`/playground?endpoint=${selected.slug}`} className="flex items-center justify-between border-t border-border px-5 py-4 text-sm font-medium text-primary hover:bg-primary/5">Explore parameters and code samples <ArrowRight className="size-4" /></Link>
  </div>;
}

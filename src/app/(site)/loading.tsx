export default function Loading() {
  return <div role="status" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><span className="sr-only">Loading page…</span><div className="max-w-2xl space-y-4 motion-safe:animate-pulse"><div className="h-9 w-2/3 rounded-lg bg-muted" /><div className="h-4 w-full rounded bg-muted" /><div className="h-4 w-4/5 rounded bg-muted" /></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0,1,2].map(value => <div key={value} className="h-40 rounded-xl border border-border bg-card" />)}</div></div>;
}

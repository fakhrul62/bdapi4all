"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";

const tools = [
  { title: "Mobile Operator", path: "/api/v1/mobile/operator", param: "number", value: "01712345678" },
  { title: "Validate NID", path: "/api/v1/validate/nid", param: "nid", value: "1234567890" },
  { title: "Validate TIN", path: "/api/v1/validate/tin", param: "tin", value: "123456789012" },
  { title: "Validate Mobile", path: "/api/v1/validate/mobile", param: "number", value: "01712345678" },
  { title: "English to Bengali Digits", path: "/api/v1/bn/to-bengali", param: "text", value: "2026" },
  { title: "Bengali to English Digits", path: "/api/v1/bn/to-english", param: "text", value: "২০২৬" },
  { title: "Transliterate", path: "/api/v1/bn/transliterate", param: "text", value: "bangladesh" },
  { title: "Holiday Check", path: "/api/v1/holidays/{date}", param: "date", value: "2026-02-21" },
  { title: "Geocode District", path: "/api/v1/geocode", param: "district", value: "Dhaka" },
  { title: "Prayer Times", path: "/api/v1/prayer-times", param: "district_id", value: "47" },
];

export function ToolsPanel() {
  const [values, setValues] = useState(Object.fromEntries(tools.map((tool) => [tool.title, tool.value])));
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, string>>({});

  async function run(tool: (typeof tools)[number]) {
    const path = tool.path.replace("{date}", encodeURIComponent(values[tool.title] ?? ""));
    const search = tool.param && tool.param !== "date" ? `?${tool.param}=${encodeURIComponent(values[tool.title] ?? "")}` : "";
    setLoading(current => ({ ...current, [tool.title]: true }));
    try {
      const response = await fetch(`${path}${search}`, { signal: AbortSignal.timeout(15000) });
      const payload = await response.json();
      setResults(current => ({ ...current, [tool.title]: JSON.stringify(payload, null, 2) }));
    } catch {
      setResults(current => ({ ...current, [tool.title]: "Could not complete the request. Check your connection and try again." }));
    } finally { setLoading(current => ({ ...current, [tool.title]: false })); }
  }

  const filtered = tools.filter(tool => `${tool.title} ${tool.path}`.toLowerCase().includes(query.toLowerCase().trim()));
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><label className="flex w-full max-w-md items-center gap-2 rounded-lg border border-input bg-card px-3 py-2.5"><Search className="size-4 text-muted-foreground" /><input aria-label="Find a tool" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a tool…" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label><span className="text-xs text-muted-foreground">{filtered.length} tools · no key required</span></div>
      <p className="text-sm text-muted-foreground">Validators check format, not identity or ownership. Sample inputs are for demonstration.</p>
      {!filtered.length && <p role="status" className="rounded-lg border border-border p-6 text-sm text-muted-foreground">No tools match your search. <button className="text-primary underline" onClick={() => setQuery("")}>Clear search</button></p>}
      <div className="grid gap-5 md:grid-cols-2">
      {filtered.map((tool) => (
        <section key={tool.title} className="min-w-0 rounded-xl border border-border/50 bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-heading text-xl font-bold">{tool.title}</h2>
              <code className="break-all text-xs text-muted-foreground">{tool.path}</code>
            </div>
            <Button size="sm" disabled={loading[tool.title]} onClick={() => void run(tool)}>{loading[tool.title] && <Loader2 className="size-3.5 animate-spin" />}{loading[tool.title] ? "Running…" : "Run"}</Button>
          </div>
          {tool.param && (
            <label className="mt-4 block">
              <span className="mb-1 block text-sm font-medium">{tool.param}</span>
              <input
                type={tool.param === "date" ? "date" : "text"}
                onKeyDown={event => { if (event.key === "Enter" && !loading[tool.title]) void run(tool); }}
                value={values[tool.title] ?? ""}
                onChange={(event) => setValues((current) => ({ ...current, [tool.title]: event.target.value }))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 font-mono text-sm outline-none focus:border-primary"
              />
            </label>
          )}
          <div className="mt-4 flex items-center justify-between gap-3"><span role="status" className="text-xs text-muted-foreground">{loading[tool.title] ? "Request in progress…" : results[tool.title] ? "Response" : "Ready to run"}</span>{results[tool.title] && <CopyButton text={results[tool.title]} label="Copy result" />}</div>
          <pre className="mt-3 max-h-80 min-h-40 overflow-auto rounded-md bg-[#0d1117] p-3 text-xs text-green-300">
            <code>{results[tool.title] ?? "Run this tool to see the response."}</code>
          </pre>
        </section>
      ))}
      </div>
    </div>
  );
}

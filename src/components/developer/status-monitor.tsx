"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { endpointDefinitions } from "@/lib/developer-content";

type Check = {
  title: string;
  path: string;
  status: "checking" | "operational" | "degraded";
  code?: number;
  latency?: number;
};

const checks = endpointDefinitions
  .filter((endpoint) => ["divisions", "districts", "prayer-times", "holidays", "exchange-rates", "mobile-operator", "bn-to-bengali"].includes(endpoint.slug))
  .map((endpoint) => ({
    endpoint,
    values: Object.fromEntries(endpoint.parameters.map((param) => [param.name, param.example])),
  }));

function buildRelative(path: string, values: Record<string, string>) {
  let nextPath = path;
  for (const [key, value] of Object.entries(values)) {
    nextPath = nextPath.replace(`{${key}}`, value);
  }

  const endpoint = endpointDefinitions.find((item) => item.path === path);
  const search = new URLSearchParams();
  for (const param of endpoint?.parameters ?? []) {
    if (param.location === "query" && values[param.name]) search.set(param.name, values[param.name]);
  }

  return `/api/v1${nextPath}${search.toString() ? `?${search}` : ""}`;
}

export function StatusMonitor() {
  const [items, setItems] = useState<Check[]>(
    checks.map(({ endpoint }) => ({
      title: endpoint.title,
      path: endpoint.path,
      status: "checking",
    })),
  );

  const [revision, setRevision] = useState(0);
  const [lastChecked, setLastChecked] = useState("");
  useEffect(() => {
    let cancelled = false;

    async function run() {
      const results = await Promise.all(
        checks.map(async ({ endpoint, values }) => {
          const url = buildRelative(endpoint.path, values);
          const started = performance.now();
          try {
            const response = await fetch(url, { signal: AbortSignal.timeout(15000), cache: "no-store" });
            return {
              title: endpoint.title,
              path: url,
              status: response.ok ? "operational" : "degraded",
              code: response.status,
              latency: Math.round(performance.now() - started),
            } satisfies Check;
          } catch {
            return {
              title: endpoint.title,
              path: url,
              status: "degraded",
              latency: Math.round(performance.now() - started),
            } satisfies Check;
          }
        }),
      );

      if (!cancelled) { setItems(results); setLastChecked(new Date().toLocaleTimeString()); }
    }

    void run();
    const interval = window.setInterval(run, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [revision]);

  const checking = items.some(item => item.status === "checking");
  const allOperational = items.every((item) => item.status === "operational");

  return (
    <div className="space-y-6">
      <section className={`rounded-lg border p-6 ${allOperational ? "border-green-500/20 bg-green-500/10" : "border-yellow-500/20 bg-yellow-500/10"}`}>
        <h2 className={`font-heading text-2xl font-bold ${allOperational ? "text-green-700 dark:text-green-400" : "text-yellow-700 dark:text-yellow-400"}`}>
          {checking ? "Checking endpoints…" : allOperational ? "All checked endpoints operational" : "Some endpoints need attention"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">Checks run in your browser against the public API and refresh every minute. Timings include your network connection.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3"><Button variant="outline" size="sm" disabled={checking} onClick={() => { setItems(current => current.map(item => ({ ...item, status: "checking" }))); setRevision(revision + 1); }}><RefreshCw className={`size-3.5 ${checking ? "animate-spin" : ""}`} />Check again</Button><span role="status" className="text-xs text-muted-foreground">{lastChecked ? `Last checked at ${lastChecked}` : "First check in progress"}</span></div>
      </section>

      <div className="overflow-x-auto rounded-lg border border-border/50 bg-card">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b border-border/50 bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Endpoint</th>
              <th className="px-5 py-3">Path</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-right">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {items.map((item) => (
              <tr key={item.title}>
                <td className="px-5 py-4 font-medium">{item.title}</td>
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{item.path}</td>
                <td className="px-5 py-4 text-center">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    item.status === "operational"
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : item.status === "checking"
                        ? "bg-muted text-muted-foreground"
                        : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                  }`}>
                    {item.status === "operational" ? `HTTP ${item.code}` : item.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-mono text-muted-foreground">{item.latency !== undefined ? `${item.latency} ms` : "..."}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Copy, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildUrl,
  codeSamples,
  EndpointDefinition,
  endpointDefinitions,
  endpointGroups,
} from "@/lib/developer-content";

function defaultValues(endpoint: EndpointDefinition) {
  return Object.fromEntries(endpoint.parameters.map((param) => [param.name, param.example]));
}

export function ApiExplorer() {
  const [selectedSlug, setSelectedSlug] = useState("divisions");
  const selected = endpointDefinitions.find((endpoint) => endpoint.slug === selectedSlug) ?? endpointDefinitions[0];
  const [valuesBySlug, setValuesBySlug] = useState<Record<string, Record<string, string>>>({
    [selected.slug]: defaultValues(selected),
  });
  const values = valuesBySlug[selected.slug] ?? defaultValues(selected);
  const url = buildUrl(selected, values);
  const samples = codeSamples(selected);
  const [response, setResponse] = useState("");
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [sampleKey, setSampleKey] = useState<keyof ReturnType<typeof codeSamples>>("curl");

  const grouped = useMemo(
    () =>
      endpointGroups.map((group) => ({
        group,
        endpoints: endpointDefinitions.filter((endpoint) => endpoint.group === group),
      })),
    [],
  );

  function updateValue(name: string, value: string) {
    setValuesBySlug((current) => ({
      ...current,
      [selected.slug]: {
        ...values,
        [name]: value,
      },
    }));
  }

  async function sendRequest() {
    setLoading(true);
    setStatus(null);
    setDuration(null);
    try {
      const res = await fetch(url);
      const text = await res.text();
      const parsed = text ? JSON.parse(text) : null;
      const responseTime = res.headers.get("x-response-time");
      setStatus(res.status);
      setDuration(responseTime ? Number.parseInt(responseTime, 10) : null);
      setHeaders({
        "cache-control": res.headers.get("cache-control") ?? "",
        "x-response-time": res.headers.get("x-response-time") ?? "",
        "x-ratelimit-remaining": res.headers.get("x-ratelimit-remaining") ?? "",
      });
      setResponse(JSON.stringify(parsed, null, 2));
    } catch (error) {
      setStatus(500);
      setDuration(null);
      setResponse(JSON.stringify({ error: error instanceof Error ? error.message : "Request failed" }, null, 2));
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    void navigator.clipboard.writeText(text);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight">API Explorer</h1>
          <p className="mt-3 text-muted-foreground">
            Pick an endpoint, fill parameters, run a live request, and copy code for your stack.
          </p>
        </div>
        <div className="rounded-lg border border-border/50 bg-card p-3">
          {grouped.map(({ group, endpoints }) => (
            <div key={group} className="pb-3 last:pb-0">
              <div className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group}
              </div>
              <div className="space-y-1">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.slug}
                    onClick={() => {
                      setSelectedSlug(endpoint.slug);
                      setValuesBySlug((current) => ({
                        ...current,
                        [endpoint.slug]: current[endpoint.slug] ?? defaultValues(endpoint),
                      }));
                    }}
                    className={`w-full rounded-md px-2 py-2 text-left text-sm transition-colors ${
                      endpoint.slug === selected.slug
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <span className="font-medium">{endpoint.title}</span>
                    <span className="mt-1 block truncate font-mono text-xs">{endpoint.path}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="space-y-6">
        <div className="rounded-lg border border-border/50 bg-card">
          <div className="border-b border-border/50 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded bg-green-500/15 px-2 py-1 font-mono text-sm font-bold text-green-600">
                {selected.method}
              </span>
              <code className="break-all font-mono text-sm text-muted-foreground">{selected.path}</code>
            </div>
            <h2 className="mt-4 font-heading text-2xl font-bold">{selected.title}</h2>
            <p className="mt-2 text-muted-foreground">{selected.description}</p>
          </div>

          <div className="grid gap-5 p-5 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-semibold">Parameters</div>
                {selected.parameters.length ? (
                  <div className="space-y-3">
                    {selected.parameters.map((param) => (
                      <label key={param.name} className="block">
                        <span className="mb-1 flex items-center justify-between text-sm">
                          <span>{param.label}</span>
                          <span className="font-mono text-xs text-muted-foreground">
                            {param.location}{param.required ? " required" : ""}
                          </span>
                        </span>
                        <input
                          value={values[param.name] ?? ""}
                          onChange={(event) => updateValue(param.name, event.target.value)}
                          className="h-10 w-full rounded-md border border-input bg-background px-3 font-mono text-sm outline-none focus:border-primary"
                          placeholder={param.example}
                        />
                        <span className="mt-1 block text-xs text-muted-foreground">{param.description}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No parameters required.</p>
                )}
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold">Request URL</div>
                <div className="flex gap-2">
                  <code className="min-w-0 flex-1 rounded-md border border-border/50 bg-muted/40 px-3 py-2 text-xs">
                    {url}
                  </code>
                  <Button variant="outline" size="icon" onClick={() => copy(url)} aria-label="Copy URL">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={sendRequest} disabled={loading} className="gap-2">
                <Play className="h-4 w-4" />
                {loading ? "Sending" : "Send Request"}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">Code</span>
                  <Button variant="outline" size="sm" onClick={() => copy(samples[sampleKey])}>
                    Copy
                  </Button>
                </div>
                <div className="mb-2 flex flex-wrap gap-2">
                  {(Object.keys(samples) as Array<keyof typeof samples>).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSampleKey(key)}
                      className={`rounded-md border px-2 py-1 text-xs ${
                        sampleKey === key ? "border-primary bg-primary/10 text-primary" : "border-border/50 text-muted-foreground"
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
                <pre className="h-52 overflow-auto rounded-md bg-[#0d1117] p-4 text-xs text-green-300">
                  <code>{samples[sampleKey]}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 p-4">
            <div className="font-semibold">Response</div>
            <div className="flex flex-wrap gap-3 font-mono text-xs text-muted-foreground">
              {status !== null && <span>Status {status}</span>}
              {duration !== null && <span>{duration} ms</span>}
              {headers["x-ratelimit-remaining"] && <span>Remaining {headers["x-ratelimit-remaining"]}</span>}
            </div>
          </div>
          <div className="grid gap-0 lg:grid-cols-[1fr_260px]">
            <pre className="min-h-80 overflow-auto bg-[#0d1117] p-4 text-sm text-green-300">
              <code>{response || "Run a request to see JSON here."}</code>
            </pre>
            <div className="border-t border-border/50 p-4 lg:border-l lg:border-t-0">
              <div className="mb-2 text-sm font-semibold">Headers</div>
              <dl className="space-y-2 text-xs">
                {Object.entries(headers).map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-mono text-muted-foreground">{key}</dt>
                    <dd className="break-all font-mono">{value || "not returned"}</dd>
                  </div>
                ))}
              </dl>
              <a className="mt-4 inline-flex items-center gap-2 text-sm text-primary" href="/openapi.json" target="_blank">
                OpenAPI JSON <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

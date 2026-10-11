"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play, Search, Trash2, Loader2, Square, RotateCcw } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "@/components/ui/copy-button";
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

export function ApiExplorer({ initialSlug = "divisions" }: { initialSlug?: string }) {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const selected = endpointDefinitions.find((endpoint) => endpoint.slug === selectedSlug) ?? endpointDefinitions[0];
  const [valuesBySlug, setValuesBySlug] = useState<Record<string, Record<string, string>>>({
    [selected.slug]: defaultValues(selected),
  });
  const values = valuesBySlug[selected.slug] ?? defaultValues(selected);
  const url = buildUrl(selected, values);
  const samples = codeSamples(selected, values);
  const [response, setResponse] = useState("");
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [sampleKey, setSampleKey] = useState<keyof ReturnType<typeof codeSamples>>("curl");
  const [endpointQuery, setEndpointQuery] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [notice, setNotice] = useState("");
  const requestRef = useRef<AbortController | null>(null);
  useEffect(() => () => { requestRef.current?.abort(); }, []);

  const grouped = useMemo(
    () =>
      endpointGroups.map((group) => ({
        group,
        endpoints: endpointDefinitions.filter((endpoint) => {
          const query = endpointQuery.trim().toLowerCase();
          if (!query) return endpoint.group === group;
          return endpoint.group === group && `${endpoint.title} ${endpoint.path} ${endpoint.summary} ${endpoint.group}`.toLowerCase().includes(query);
        }),
      })).filter((group) => group.endpoints.length > 0),
    [endpointQuery],
  );

  const endpointCount = grouped.reduce((sum, group) => sum + group.endpoints.length, 0);

  const availableFields = useMemo(() => {
    if (selected.availableFields && selected.availableFields.length > 0) {
      return selected.availableFields;
    }
    const sample = Array.isArray(selected.sampleResponse) ? selected.sampleResponse[0] : selected.sampleResponse;
    const sampleKeys = sample && typeof sample === "object" ? Object.keys(sample) : [];
    const defaults = ["id", "name_en", "name_bn", "verified", "needs_image", "created_at", "updated_at"];
    return Array.from(new Set([...defaults, ...sampleKeys])).filter(
      (k) => typeof k === "string" && !k.includes(" ")
    );
  }, [selected]);

  const availableSorts = useMemo(() => {
    const baseFields = availableFields.filter((f) =>
      ["name_en", "title_en", "updated_at", "created_at", "id", "year", "published_year", "area_sq_km", "length_km"].includes(f)
    );
    const options: string[] = [];
    (baseFields.length > 0 ? baseFields : ["name_en", "updated_at", "created_at", "id"]).forEach((f) => {
      options.push(f, `-${f}`);
    });
    return options;
  }, [availableFields]);

  function toggleFieldChoice(fieldName: string) {
    const currentStr = values["fields"] ?? "";
    const currentList = currentStr.split(",").map((s) => s.trim()).filter(Boolean);
    let newList: string[];
    if (currentList.includes(fieldName)) {
      newList = currentList.filter((item) => item !== fieldName);
    } else {
      newList = [...currentList, fieldName];
    }
    updateValue("fields", newList.join(","));
  }

  function toggleSortChoice(sortName: string) {
    const currentStr = values["sort"] ?? "";
    const currentList = currentStr.split(",").map((s) => s.trim()).filter(Boolean);
    let newList: string[];
    if (currentList.includes(sortName)) {
      newList = currentList.filter((item) => item !== sortName);
    } else {
      newList = [...currentList, sortName];
    }
    updateValue("sort", newList.join(","));
  }

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
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), selected.slug === "events" ? 30000 : 20000);
    const started = performance.now();
    setNotice("");
    setResponse("");
    setHeaders({});
    setLoading(true);
    setStatus(null);
    setDuration(null);
    try {
      const res = await fetch(new URL(url).pathname + new URL(url).search, {
        signal: controller.signal,
        headers: apiKey ? { "X-API-Key": apiKey } : undefined,
      });

      const responseTime = res.headers.get("x-response-time");
      setStatus(res.status);
      setDuration(responseTime ? Number.parseInt(responseTime, 10) : Math.round(performance.now() - started));
      setHeaders({
        "x-request-id": res.headers.get("x-request-id") ?? "",
        "retry-after": res.headers.get("retry-after") ?? "",
        "content-type": res.headers.get("content-type") ?? "",
        "cache-control": res.headers.get("cache-control") ?? "",
        "x-response-time": res.headers.get("x-response-time") ?? "",
        "x-ratelimit-remaining": res.headers.get("x-ratelimit-remaining") ?? "",
      });

      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("text/event-stream") && res.body) {
        setNotice("Streaming events. Stop the request when finished; the preview ends after 30 seconds.");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setResponse(accumulated);
        }
        return;
      }

      const text = await res.text();
      let formatted = text;
      try {
        const parsed = text ? JSON.parse(text) : null;
        formatted = JSON.stringify(parsed, null, 2);
      } catch {
        // Not JSON, keep raw text
      }
      setResponse(formatted);
    } catch (error) {
      if (requestRef.current !== controller) return;
      const message = controller.signal.aborted ? "Request stopped or timed out. You can send it again." : error instanceof Error ? error.message : "Request failed. Check your connection and retry.";
      setNotice(message);
      if (!controller.signal.aborted) setResponse(JSON.stringify({ error: message }, null, 2));
    } finally {
      window.clearTimeout(timeout);
      if (requestRef.current === controller) { setLoading(false); requestRef.current = null; }
    }
  }

  function selectEndpoint(slug: string) {
    const endpoint = endpointDefinitions.find((item) => item.slug === slug);
    if (!endpoint) return;
    requestRef.current?.abort();
    requestRef.current = null;
    setLoading(false);
    setResponse(""); setStatus(null); setDuration(null); setHeaders({}); setNotice("");
    window.history.replaceState(null, "", `/playground?endpoint=${encodeURIComponent(slug)}`);
    setSelectedSlug(endpoint.slug);
    setValuesBySlug((current) => ({
      ...current,
      [endpoint.slug]: current[endpoint.slug] ?? defaultValues(endpoint),
    }));
  }

  return (
    <div className="space-y-5">
      {notice && <p role="status" className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">{notice}</p>}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight">API Explorer</h1>
          <p className="mt-3 text-muted-foreground">
            Search an endpoint, edit parameters, send a live request, and copy code without losing your place.
          </p>
        </div>
        <div className="rounded-lg border border-border/50 bg-card p-3 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Selected</div>
          <div className="mt-1 font-semibold">{selected.title}</div>
          <code className="mt-1 block max-w-[420px] truncate font-mono text-xs text-muted-foreground">{selected.path}</code>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-lg border border-border/50 bg-card">
            <div className="space-y-3 border-b border-border/50 p-3">
              <label className="block text-sm font-semibold">
                Quick endpoint
                <select
                  value={selected.slug}
                  onChange={(event) => selectEndpoint(event.target.value)}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus:border-primary"
                >
                  {endpointDefinitions.map((endpoint) => (
                    <option key={endpoint.slug} value={endpoint.slug}>
                      {endpoint.group} / {endpoint.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                Search endpoints
                <div className="mt-2 flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-primary">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={endpointQuery}
                    onChange={(event) => setEndpointQuery(event.target.value)}
                    placeholder="books, district, prayer..."
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
              </label>
              <div className="text-xs text-muted-foreground">{endpointCount} matching endpoints</div>
            </div>
            <div className="max-h-[52vh] overflow-auto p-3 lg:max-h-[calc(100vh-18rem)]">
              {!endpointCount && <p className="p-3 text-sm text-muted-foreground">No matching endpoints. <button onClick={() => setEndpointQuery("")} className="text-primary underline">Clear search</button></p>}
              {grouped.map(({ group, endpoints }) => (
                <div key={group} className="pb-3 last:pb-0">
                  <div className="sticky top-0 z-10 bg-card px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {group}
                  </div>
                  <div className="space-y-1">
                    {endpoints.map((endpoint) => (
                      <button
                        key={endpoint.slug}
                        aria-pressed={endpoint.slug === selected.slug}
                        disabled={loading}
                        onClick={() => selectEndpoint(endpoint.slug)}
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
          </div>
        </aside>

        <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)]">
          <div className="min-w-0 space-y-5">
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

              <div className="space-y-5 p-5">
              <div>
                <div className="mb-2 text-sm font-semibold">Parameters</div>
                {selected.parameters.length ? (
                  <div className="space-y-4">
                    {selected.parameters.map((param) => {
                      const isFields = param.name === "fields";
                      const isSort = param.name === "sort";
                      const currentVal = values[param.name] ?? "";
                      const selectedItems = currentVal.split(",").map((s) => s.trim()).filter(Boolean);

                      return (
                        <label key={param.name} className="block">
                          <span className="mb-1 flex items-center justify-between text-sm">
                            <span>{param.label}</span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {param.location}{param.required ? " required" : ""}
                            </span>
                          </span>
                          <input
                            value={currentVal}
                            onChange={(event) => updateValue(param.name, event.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 font-mono text-sm outline-none focus:border-primary"
                            placeholder={param.example}
                          />
                          <span className="mt-1 block text-xs text-muted-foreground">{param.description}</span>

                          {isFields && (
                            <div className="mt-2 space-y-1.5 rounded-md border border-border/50 bg-muted/20 p-2.5">
                              <div className="text-xs font-semibold text-muted-foreground">Available fields to choose:</div>
                              <div className="flex flex-wrap gap-1.5">
                                {availableFields.map((f) => {
                                  const active = selectedItems.includes(f);
                                  return (
                                    <button
                                      key={f}
                                      type="button"
                                      onClick={() => toggleFieldChoice(f)}
                                      className={`rounded-md border px-2 py-0.5 font-mono text-xs transition-colors ${
                                        active
                                          ? "border-primary bg-primary/20 text-primary font-semibold"
                                          : "border-border/60 bg-background/80 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                                      }`}
                                    >
                                      {active ? `✓ ${f}` : `+ ${f}`}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {isSort && (
                            <div className="mt-2 space-y-1.5 rounded-md border border-border/50 bg-muted/20 p-2.5">
                              <div className="text-xs font-semibold text-muted-foreground">Available sort fields to choose:</div>
                              <div className="flex flex-wrap gap-1.5">
                                {availableSorts.map((s) => {
                                  const active = selectedItems.includes(s);
                                  return (
                                    <button
                                      key={s}
                                      type="button"
                                      onClick={() => toggleSortChoice(s)}
                                      className={`rounded-md border px-2 py-0.5 font-mono text-xs transition-colors ${
                                        active
                                          ? "border-primary bg-primary/20 text-primary font-semibold"
                                          : "border-border/60 bg-background/80 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                                      }`}
                                    >
                                      {active ? `✓ ${s}` : `+ ${s}`}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No parameters required.</p>
                )}
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold">Request URL</div>
                <div className="flex items-start gap-2 min-w-0">
                  <code className="min-w-0 flex-1 overflow-x-auto rounded-md border border-border/50 bg-muted/40 px-3 py-2 font-mono text-xs break-all whitespace-pre-wrap">
                    {url}
                  </code>
                  <CopyButton text={url} label="Copy URL" compact />
                </div>
              </div>

              <div>
                <label htmlFor="explorer-key" className="mb-2 block text-sm font-semibold">API Key (optional)</label>
                <div className="flex items-center gap-2">
                  <input
                    id="explorer-key"
                    type="password"
                    autoComplete="off"
                    value={apiKey}
                    onChange={(event) => setApiKey(event.target.value)}
                    placeholder="bdapi_..."
                    className="h-10 w-full rounded-md border border-input bg-background px-3 font-mono text-xs outline-none focus:border-primary"
                  />
                </div>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Optional. Leave empty to use the public anonymous quota.
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2"><Button onClick={sendRequest} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
                {loading ? "Sending…" : "Send Request"}
              </Button>
              {loading && <Button variant="outline" onClick={() => requestRef.current?.abort()}><Square className="size-3.5" /> Stop</Button>}
              <Button variant="outline" disabled={loading} onClick={() => setValuesBySlug(current => ({ ...current, [selected.slug]: defaultValues(selected) }))}><RotateCcw className="size-3.5" /> Reset</Button>
              <Link href={`/docs/${selected.slug}`} className="px-2 text-sm text-primary hover:underline">Endpoint guide →</Link></div>
              </div>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">Code</span>
                  <CopyButton text={samples[sampleKey]} label="Copy code" />
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

          <div className="min-w-0 xl:sticky xl:top-20 xl:self-start">
            <div className="rounded-lg border border-border/50 bg-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 p-4">
                <div className="font-semibold">Response {loading && <span role="status" className="text-xs font-normal text-muted-foreground">· Request in progress</span>}</div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
                  {status !== null && <span className={`rounded-md px-2 py-1 ${status < 400 ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-destructive/10 text-destructive"}`}>HTTP {status}</span>}
                  {duration !== null && <span>{duration} ms</span>}
                  {headers["x-ratelimit-remaining"] && <span>Remaining {headers["x-ratelimit-remaining"]}</span>}
                </div>
                <div className="flex gap-2">
                  {response && (
                    <>
                      <CopyButton text={response} label="Copy response" compact />
                      <Button variant="outline" size="icon" onClick={() => { setResponse(""); setStatus(null); setDuration(null); setHeaders({}); }} aria-label="Clear response">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <pre className="max-h-[58vh] min-h-80 overflow-auto bg-[#0d1117] p-4 text-sm text-green-300">
                <code>{response || "Run a request to see JSON here."}</code>
              </pre>
              <div className="border-t border-border/50 p-4">
                <div className="mb-2 text-sm font-semibold">Headers</div>
                <dl className="grid gap-2 text-xs sm:grid-cols-3 xl:grid-cols-1">
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
    </div>
  );
}

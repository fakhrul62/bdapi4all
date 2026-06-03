"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Download, ImageOff, Loader2, LogOut, Play, Save, Search, ShieldCheck, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CategorySummary = {
  slug: string;
  title: string;
  group: string;
  total: number;
  verified: number;
  unverified: number;
  needs_image: number;
};

type Run = {
  id: number;
  status: string;
  category: string | null;
  processed: number;
  verified: number;
  images_found: number;
  started_at: string;
  finished_at: string | null;
};

type Activity = {
  id: number;
  action: string;
  category: string | null;
  record_id: number | null;
  created_at: string;
};

type QualityRow = {
  category: string;
  open_issues: number;
};

type RecordItem = {
  id: number;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  image_url: string | null;
  source: string;
  source_url: string | null;
  verified: boolean;
  needs_image: boolean;
};

type ApiPayload<T> = {
  success: boolean;
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
};

async function api<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const payload = (await response.json()) as ApiPayload<T>;
  if (!response.ok || !payload.success) {
    throw new Error("Request failed");
  }
  return payload;
}

export function AdminDashboard({ initialAuthenticated }: { initialAuthenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [secret, setSecret] = useState("");
  const [summary, setSummary] = useState<CategorySummary[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [quality, setQuality] = useState<QualityRow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("rivers");
  const [status, setStatus] = useState("unverified");
  const [q, setQ] = useState("");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const selectedSummary = useMemo(
    () => summary.find((item) => item.slug === selectedCategory),
    [selectedCategory, summary],
  );

  async function loadSummary() {
    const payload = await api<{ summary: CategorySummary[]; runs: Run[]; activity: Activity[]; quality: QualityRow[] }>("/api/admin/summary");
    setSummary(payload.data.summary);
    setRuns(payload.data.runs);
    setActivity(payload.data.activity);
    setQuality(payload.data.quality);
    if (!payload.data.summary.some((item) => item.slug === selectedCategory)) {
      setSelectedCategory(payload.data.summary[0]?.slug ?? "rivers");
    }
  }

  async function loadRecords(nextPage = page) {
    setLoading(true);
    try {
      const search = new URLSearchParams({
        category: selectedCategory,
        page: String(nextPage),
        limit: "12",
        status,
      });
      if (q.trim()) search.set("q", q.trim());
      const payload = await api<RecordItem[]>(`/api/admin/records?${search.toString()}`);
      setRecords(payload.data);
      setPage(payload.meta?.pagination?.page ?? nextPage);
      setTotalPages(payload.meta?.pagination?.total_pages ?? 1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    async function run() {
      try {
        const payload = await api<{ summary: CategorySummary[]; runs: Run[]; activity: Activity[]; quality: QualityRow[] }>("/api/admin/summary");
        if (cancelled) return;
        setSummary(payload.data.summary);
        setRuns(payload.data.runs);
        setActivity(payload.data.activity);
        setQuality(payload.data.quality);
        if (!payload.data.summary.some((item) => item.slug === selectedCategory)) {
          setSelectedCategory(payload.data.summary[0]?.slug ?? "rivers");
        }
      } catch {
        if (!cancelled) setAuthenticated(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [authenticated, selectedCategory]);

  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const search = new URLSearchParams({
          category: selectedCategory,
          page: "1",
          limit: "12",
          status,
        });
        const payload = await api<RecordItem[]>(`/api/admin/records?${search.toString()}`);
        if (cancelled) return;
        setRecords(payload.data);
        setSelectedIds([]);
        setPage(payload.meta?.pagination?.page ?? 1);
        setTotalPages(payload.meta?.pagination?.total_pages ?? 1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [authenticated, selectedCategory, status]);

  async function login() {
    setLoading(true);
    setMessage("");
    try {
      await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ secret }),
      });
      setAuthenticated(true);
      setSecret("");
    } catch {
      setMessage("Invalid admin secret.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await api("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  }

  async function saveRecord(record: RecordItem) {
    setMessage("");
    await api(`/api/admin/records/${selectedCategory}/${record.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name_en: record.name_en,
        name_bn: record.name_bn,
        description_en: record.description_en,
        description_bn: record.description_bn,
        image_url: record.image_url || null,
        source: record.source,
        source_url: record.source_url || null,
        verified: record.verified,
        needs_image: record.needs_image,
      }),
    });
    setMessage(`Saved #${record.id}.`);
    await loadSummary();
  }

  async function runEnrichment() {
    setLoading(true);
    setMessage("Running enrichment. This can take a minute.");
    try {
      const payload = await api<{ processed: number; verified: number; images_found: number }>("/api/admin/enrich", {
        method: "POST",
        body: JSON.stringify({ category: selectedCategory, limit: 12 }),
      });
      setMessage(
        `Enrichment completed: ${payload.data.processed} processed, ${payload.data.verified} verified, ${payload.data.images_found} images found.`,
      );
      await loadSummary();
      await loadRecords(1);
    } finally {
      setLoading(false);
    }
  }

  async function bulkAction(action: "verify" | "unverify" | "mark_needs_image" | "clear_needs_image") {
    if (!selectedIds.length) return;
    setLoading(true);
    setMessage("");
    try {
      const payload = await api<{ count: number }>("/api/admin/records/bulk", {
        method: "POST",
        body: JSON.stringify({ category: selectedCategory, ids: selectedIds, action }),
      });
      setMessage(`Updated ${payload.data.count} records.`);
      await loadSummary();
      await loadRecords(page);
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteRecord(id: number) {
    if (!window.confirm(`Delete record #${id}?`)) return;
    await api(`/api/admin/records/${selectedCategory}/${id}`, { method: "DELETE" });
    setMessage(`Deleted #${id}.`);
    await loadSummary();
    await loadRecords(page);
  }

  async function deleteSelected() {
    if (!selectedIds.length) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected records?`)) return;
    setLoading(true);
    try {
      for (const id of selectedIds) {
        await api(`/api/admin/records/${selectedCategory}/${id}`, { method: "DELETE" });
      }
      setMessage(`Deleted ${selectedIds.length} records.`);
      await loadSummary();
      await loadRecords(page);
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  }

  async function scanDuplicates() {
    setLoading(true);
    try {
      const payload = await api<Array<{ name: string; count: number }>>(`/api/admin/records/duplicates?category=${selectedCategory}`);
      setMessage(payload.data.length ? `${payload.data.length} duplicate name groups found.` : "No duplicate name groups found.");
    } finally {
      setLoading(false);
    }
  }

  function updateRecord(id: number, patch: Partial<RecordItem>) {
    setRecords((current) => current.map((record) => (record.id === id ? { ...record, ...patch } : record)));
  }

  function toggleSelected(id: number) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  if (!authenticated) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4">
        <div className="rounded-lg border border-border/50 bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold">BDApi4All Admin</h1>
              <p className="text-sm text-muted-foreground">Review, verify, and enrich encyclopedia records.</p>
            </div>
          </div>
          <label className="block text-sm font-medium">
            Admin secret
            <input
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void login();
              }}
              className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 outline-none focus:border-primary"
            />
          </label>
          {message && <p className="mt-3 text-sm text-red-500">{message}</p>}
          <Button className="mt-5 w-full gap-2" onClick={login} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight">Encyclopedia Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Verify sources, update images, edit text, and run enrichment.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={runEnrichment} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Enrich Selected
          </Button>
          <a
            href={`/api/admin/records/export?category=${selectedCategory}&format=csv`}
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </a>
          <Button variant="outline" size="icon" onClick={logout} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {summary.slice(0, 8).map((item) => (
          <button
            key={item.slug}
            onClick={() => setSelectedCategory(item.slug)}
            className={`rounded-lg border p-4 text-left transition-colors ${
              selectedCategory === item.slug ? "border-primary bg-primary/10" : "border-border/50 bg-card hover:border-primary/50"
            }`}
          >
            <div className="text-sm font-semibold">{item.title}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <span>{item.total} total</span>
              <span>{item.verified} verified</span>
              <span>{item.needs_image} images</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="rounded-lg border border-border/50 bg-card p-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</label>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-2 text-sm outline-none"
            >
              {summary.map((item) => (
                <option key={item.slug} value={item.slug}>{item.group} / {item.title}</option>
              ))}
            </select>
            {selectedSummary && (
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md bg-muted/50 p-2">
                  <dt className="text-muted-foreground">Unverified</dt>
                  <dd className="font-semibold">{selectedSummary.unverified}</dd>
                </div>
                <div className="rounded-md bg-muted/50 p-2">
                  <dt className="text-muted-foreground">Need image</dt>
                  <dd className="font-semibold">{selectedSummary.needs_image}</dd>
                </div>
              </dl>
            )}
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Queue</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-2 text-sm outline-none"
            >
              <option value="unverified">Unverified</option>
              <option value="needs_image">Needs image</option>
              <option value="verified">Verified</option>
              <option value="all">All</option>
            </select>
            <div className="mt-3 flex gap-2">
              <input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Search"
                className="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none"
              />
              <Button variant="outline" size="icon" onClick={() => loadRecords(1)} aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Open issues</div>
            <div className="mt-2 space-y-2 text-xs">
              {quality.length ? quality.slice(0, 8).map((item) => (
                <div key={item.category} className="flex justify-between rounded-md bg-muted/50 p-2">
                  <span>{item.category}</span>
                  <span className="font-semibold">{item.open_issues}</span>
                </div>
              )) : <div className="text-muted-foreground">No tracked issues.</div>}
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent runs</div>
            <div className="mt-2 space-y-2">
              {runs.slice(0, 5).map((run) => (
                <div key={run.id} className="rounded-md bg-muted/50 p-2 text-xs">
                  <div className="font-medium">#{run.id} {run.status}</div>
                  <div className="text-muted-foreground">{run.processed} processed, {run.verified} verified</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-card p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent activity</div>
            <div className="mt-2 space-y-2">
              {activity.slice(0, 5).map((item) => (
                <div key={item.id} className="rounded-md bg-muted/50 p-2 text-xs">
                  <div className="font-medium">{item.action}</div>
                  <div className="text-muted-foreground">{item.category ?? "system"}{item.record_id ? ` #${item.record_id}` : ""}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          {message && <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">{message}</div>}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-card p-3">
            <div className="text-sm text-muted-foreground">{selectedIds.length} selected</div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => bulkAction("verify")} disabled={!selectedIds.length || loading}>Verify</Button>
              <Button variant="outline" size="sm" onClick={() => bulkAction("unverify")} disabled={!selectedIds.length || loading}>Unverify</Button>
              <Button variant="outline" size="sm" onClick={() => bulkAction("mark_needs_image")} disabled={!selectedIds.length || loading}>Needs image</Button>
              <Button variant="outline" size="sm" onClick={scanDuplicates} disabled={loading}>Find duplicates</Button>
              <Button variant="outline" size="sm" className="gap-2 text-red-600" onClick={deleteSelected} disabled={!selectedIds.length || loading}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
          {records.map((record) => (
            <article key={record.id} className="rounded-lg border border-border/50 bg-card p-4">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(record.id)}
                    onChange={() => toggleSelected(record.id)}
                    className="mt-2 h-4 w-4 accent-primary"
                    aria-label={`Select record ${record.id}`}
                  />
                  <div className="min-w-0">
                  <div className="font-mono text-xs text-muted-foreground">#{record.id}</div>
                  <input
                    value={record.name_en}
                    onChange={(event) => updateRecord(record.id, { name_en: event.target.value })}
                    className="mt-1 w-full rounded-md border border-transparent bg-transparent text-xl font-semibold outline-none focus:border-input focus:bg-background focus:px-2"
                  />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateRecord(record.id, { verified: !record.verified })}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                      record.verified ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {record.verified ? "Verified" : "Unverified"}
                  </button>
                  <button
                    onClick={() => updateRecord(record.id, { needs_image: !record.needs_image })}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                      record.needs_image ? "bg-amber-500/15 text-amber-700 dark:text-amber-400" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <ImageOff className="h-3.5 w-3.5" />
                    {record.needs_image ? "Needs image" : "Image ok"}
                  </button>
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  Bengali name
                  <input value={record.name_bn} onChange={(event) => updateRecord(record.id, { name_bn: event.target.value })} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 outline-none" />
                </label>
                <label className="text-sm">
                  Source
                  <input value={record.source} onChange={(event) => updateRecord(record.id, { source: event.target.value })} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 outline-none" />
                </label>
                <label className="text-sm md:col-span-2">
                  Source URL
                  <input value={record.source_url ?? ""} onChange={(event) => updateRecord(record.id, { source_url: event.target.value })} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 outline-none" />
                </label>
                <label className="text-sm md:col-span-2">
                  Image URL
                  <input value={record.image_url ?? ""} onChange={(event) => updateRecord(record.id, { image_url: event.target.value, needs_image: !event.target.value })} className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 outline-none" />
                </label>
                <label className="text-sm md:col-span-2">
                  English description
                  <textarea value={record.description_en} onChange={(event) => updateRecord(record.id, { description_en: event.target.value })} className="mt-1 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 outline-none" />
                </label>
                <label className="text-sm md:col-span-2">
                  Bengali description
                  <textarea value={record.description_bn} onChange={(event) => updateRecord(record.id, { description_bn: event.target.value })} className="mt-1 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 outline-none" />
                </label>
              </div>

              <div className="mt-4 flex justify-end">
                <Button className="gap-2" onClick={() => saveRecord(record)}>
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </article>
          ))}

          <div className="flex items-center justify-between">
            <Button variant="outline" disabled={page <= 1 || loading} onClick={() => loadRecords(page - 1)}>Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <Button variant="outline" disabled={page >= totalPages || loading} onClick={() => loadRecords(page + 1)}>Next</Button>
          </div>
        </section>
      </div>
    </main>
  );
}

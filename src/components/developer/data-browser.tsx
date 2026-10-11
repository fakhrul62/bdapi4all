"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";

type GeoRow = { id: number; name_en: string; name_bn: string; division_id?: number; district_id?: number; upazila_id?: number };
function useRows(path: string, revision: number) {
  const key = `${path}:${revision}`;
  const [result, setResult] = useState<{ key: string; rows: GeoRow[]; error: string }>({ key: "", rows: [], error: "" });
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/v1${path}`, { signal: controller.signal });
        const payload = await response.json();
        if (!response.ok || !payload.success) throw new Error(payload.error?.message || "Could not load geography data.");
        if (!controller.signal.aborted) setResult({ key, rows: payload.data ?? [], error: "" });
      } catch (error) {
        if (!controller.signal.aborted) setResult({ key, rows: [], error: error instanceof Error ? error.message : "Could not load data." });
      }
    }
    void load();
    return () => controller.abort();
  }, [path, key]);
  return { rows: path && result.key === key ? result.rows : [], error: path && result.key === key ? result.error : "", loading: Boolean(path && result.key !== key) };
}

export function DataBrowser() {
  const [divisionId, setDivisionId] = useState("6");
  const [districtId, setDistrictId] = useState("47");
  const [upazilaId, setUpazilaId] = useState("");
  const [query, setQuery] = useState("");
  const [revision, setRevision] = useState(0);
  const [page, setPage] = useState(1);
  const divisions = useRows("/divisions", revision);
  const districts = useRows(`/districts?division_id=${divisionId}`, revision);
  const selectedDistrict = districts.rows.find(row => String(row.id) === districtId) ?? districts.rows[0];
  const upazilas = useRows(selectedDistrict ? `/upazilas?district_id=${selectedDistrict.id}` : "", revision);
  const selectedUpazila = upazilas.rows.find(row => String(row.id) === upazilaId) ?? upazilas.rows[0];
  const unions = useRows(selectedUpazila ? `/unions?upazila_id=${selectedUpazila.id}` : "", revision);
  const loading = [divisions, districts, upazilas, unions].some(result => result.loading);
  const error = [divisions, districts, upazilas, unions].find(result => result.error)?.error;
  const rows = useMemo(() => {
    const all = [
      ...divisions.rows.map(row => ({ ...row, type: "division", api: `/api/v1/divisions/${row.id}` })),
      ...districts.rows.map(row => ({ ...row, type: "district", api: `/api/v1/districts/${row.id}` })),
      ...upazilas.rows.map(row => ({ ...row, type: "upazila", api: `/api/v1/upazilas/${row.id}` })),
      ...unions.rows.map(row => ({ ...row, type: "union", api: `/api/v1/unions?upazila_id=${row.upazila_id}` })),
    ];
    const term = query.trim().toLowerCase();
    return all.filter(row => `${row.name_en} ${row.name_bn} ${row.id} ${row.type}`.toLowerCase().includes(term));
  }, [divisions.rows, districts.rows, upazilas.rows, unions.rows, query]);
  const pageCount = Math.max(1, Math.ceil(rows.length / 50));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * 50;
  const inputClass = "h-11 w-full rounded-md border border-input bg-background px-3 text-sm";
  return <div className="space-y-5">
    <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4 shrink-0 text-primary" />Choose a division, then a district and upazila. Search filters the loaded area.</p>
    <div className="grid gap-4 rounded-xl border border-border/70 bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
      <label className="block"><span className="mb-2 block text-sm font-medium">Division</span><select value={divisionId} disabled={divisions.loading} onChange={event => { setDivisionId(event.target.value); setDistrictId(""); setUpazilaId(""); setPage(1); }} className={inputClass}>{!divisions.rows.length && <option>Loading…</option>}{divisions.rows.map(row => <option key={row.id} value={row.id}>{row.name_en} ({row.id})</option>)}</select></label>
      <label className="block"><span className="mb-2 block text-sm font-medium">District</span><select value={selectedDistrict?.id ?? ""} disabled={districts.loading || !districts.rows.length} onChange={event => { setDistrictId(event.target.value); setUpazilaId(""); setPage(1); }} className={inputClass}>{!districts.rows.length && <option value="">{districts.loading ? "Loading…" : "No districts"}</option>}{districts.rows.map(row => <option key={row.id} value={row.id}>{row.name_en} ({row.id})</option>)}</select></label>
      <label className="block"><span className="mb-2 block text-sm font-medium">Upazila</span><select value={selectedUpazila?.id ?? ""} disabled={upazilas.loading || !upazilas.rows.length} onChange={event => { setUpazilaId(event.target.value); setPage(1); }} className={inputClass}>{!upazilas.rows.length && <option value="">{upazilas.loading ? "Loading…" : "No upazilas"}</option>}{upazilas.rows.map(row => <option key={row.id} value={row.id}>{row.name_en} ({row.id})</option>)}</select></label>
      <label className="block"><span className="mb-2 block text-sm font-medium">Search this area</span><div className="flex h-11 items-center gap-2 rounded-md border border-input bg-background px-3 focus-within:border-primary"><Search className="size-4 shrink-0 text-muted-foreground" /><input value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Name, Bengali, ID…" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></div></label>
    </div>
    {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm"><span>{error}</span><Button variant="outline" size="sm" onClick={() => setRevision(revision + 1)}>Retry loading</Button></div>}
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card" aria-busy={loading}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3"><h2 className="font-semibold">Administrative data</h2><span role="status" className="flex items-center gap-2 text-xs text-muted-foreground">{loading && <Loader2 className="size-3.5 animate-spin" />}{loading ? "Loading area…" : `${rows.length} matching records`}</span></div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Administrative records for the selected area, with IDs and API links</caption><thead className="bg-muted/50 text-muted-foreground"><tr>{["Type", "ID", "English", "Bengali", "API URL", "Copy"].map(title => <th scope="col" key={title} className="whitespace-nowrap px-4 py-3 font-medium">{title}</th>)}</tr></thead><tbody className="divide-y divide-border/50">
        {rows.slice(start, start + 50).map(row => <tr key={`${row.type}-${row.id}`} className="hover:bg-muted/30"><td className="px-4 py-3"><span className="rounded-md bg-muted px-2 py-1 text-xs capitalize">{row.type}</span></td><td className="px-4 py-3 font-mono"><CopyButton text={String(row.id)} label={`Copy ID ${row.id}`} compact /><span className="ml-2">{row.id}</span></td><td className="whitespace-nowrap px-4 py-3 font-medium">{row.name_en}</td><td lang="bn" className="whitespace-nowrap px-4 py-3">{row.name_bn || "—"}</td><td className="px-4 py-3"><a href={row.api} target="_blank" rel="noreferrer" className="whitespace-nowrap font-mono text-xs text-primary hover:underline">{row.api} ↗</a></td><td className="px-4 py-3"><CopyButton text={JSON.stringify(row, null, 2)} label="JSON" /></td></tr>)}
        {!rows.length && <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">{loading ? "Loading records…" : error ? "Data could not be loaded. Try again above." : <>No records match your search. <button onClick={() => setQuery("")} className="text-primary underline">Clear search</button></>}</td></tr>}
      </tbody></table></div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3"><p className="text-xs text-muted-foreground">{rows.length ? `${start + 1}–${Math.min(start + 50, rows.length)} of ${rows.length}` : "0 records"}</p><div className="flex items-center gap-3"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</Button><span className="text-xs text-muted-foreground">{currentPage} / {pageCount}</span><Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next</Button></div></div>
    </div>
  </div>;
}

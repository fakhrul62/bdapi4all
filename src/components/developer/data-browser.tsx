"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type Division = { id: number; name_en: string; name_bn: string; lat: number | null; lng: number | null };
type District = { id: number; division_id: number; name_en: string; name_bn: string; lat: number | null; lng: number | null };
type Upazila = { id: number; district_id: number; name_en: string; name_bn: string };
type Union = { id: number; upazila_id: number; name_en: string; name_bn: string };

const base = "/api/v1";

async function loadData<T>(path: string): Promise<T[]> {
  const response = await fetch(`${base}${path}`);
  const payload = await response.json();
  return payload.data ?? [];
}

export function DataBrowser() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [unions, setUnions] = useState<Union[]>([]);
  const [divisionId, setDivisionId] = useState("6");
  const [districtId, setDistrictId] = useState("47");
  const [upazilaId, setUpazilaId] = useState("");
  const [query, setQuery] = useState("");
  useEffect(() => {
    void loadData<Division>("/divisions").then(setDivisions);
  }, []);

  useEffect(() => {
    void loadData<District>(`/districts${divisionId ? `?division_id=${divisionId}` : ""}`)
      .then((rows) => {
        setDistricts(rows);
        if (!rows.some((row) => String(row.id) === districtId)) {
          setDistrictId(rows[0] ? String(rows[0].id) : "");
        }
      });
  }, [divisionId, districtId]);

  useEffect(() => {
    if (!districtId) return;
    void loadData<Upazila>(`/upazilas?district_id=${districtId}`)
      .then((rows) => {
        setUpazilas(rows);
        setUpazilaId(rows[0] ? String(rows[0].id) : "");
      });
  }, [districtId]);

  useEffect(() => {
    if (!upazilaId) return;
    void loadData<Union>(`/unions?upazila_id=${upazilaId}`).then(setUnions);
  }, [upazilaId]);

  const rows = useMemo(() => {
    const term = query.toLowerCase().trim();
    const all = [
      ...divisions.map((row) => ({ type: "division", api: `/api/v1/divisions/${row.id}`, ...row })),
      ...districts.map((row) => ({ type: "district", api: `/api/v1/districts/${row.id}`, ...row })),
      ...upazilas.map((row) => ({ type: "upazila", api: `/api/v1/upazilas/${row.id}`, ...row })),
      ...unions.map((row) => ({ type: "union", api: `/api/v1/unions?upazila_id=${row.upazila_id}`, ...row })),
    ];

    if (!term) return all;
    return all.filter((row) => `${row.name_en} ${row.name_bn} ${row.id} ${row.type}`.toLowerCase().includes(term));
  }, [divisions, districts, upazilas, unions, query]);

  function copy(text: string) {
    void navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-lg border border-border/50 bg-card p-4 md:grid-cols-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Division</span>
          <select value={divisionId} onChange={(event) => setDivisionId(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name_en} ({division.id})
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">District</span>
          <select value={districtId} onChange={(event) => setDistrictId(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name_en} ({district.id})
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Upazila</span>
          <select value={upazilaId} onChange={(event) => setUpazilaId(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            {upazilas.map((upazila) => (
              <option key={upazila.id} value={upazila.id}>
                {upazila.name_en} ({upazila.id})
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Search</span>
          <div className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, Bangla, ID" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </div>
        </label>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/50 bg-card">
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <div className="font-semibold">Administrative Data</div>
          <div className="font-mono text-xs text-muted-foreground">{rows.length} visible rows</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">English</th>
                <th className="px-4 py-3">Bengali</th>
                <th className="px-4 py-3">API URL</th>
                <th className="px-4 py-3 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {rows.slice(0, 300).map((row) => (
                <tr key={`${row.type}-${row.id}`}>
                  <td className="px-4 py-3 capitalize">{row.type}</td>
                  <td className="px-4 py-3 font-mono">{row.id}</td>
                  <td className="px-4 py-3">{row.name_en}</td>
                  <td className="px-4 py-3">{row.name_bn}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.api}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" onClick={() => copy(JSON.stringify(row, null, 2))}>
                      <Copy className="mr-1 h-3.5 w-3.5" />
                      JSON
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

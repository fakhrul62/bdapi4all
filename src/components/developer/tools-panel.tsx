"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const tools = [
  { title: "Mobile Operator", path: "/api/v1/mobile/operator", param: "number", value: "01712345678" },
  { title: "Validate NID", path: "/api/v1/validate/nid", param: "nid", value: "1234567890" },
  { title: "Validate TIN", path: "/api/v1/validate/tin", param: "tin", value: "123456789012" },
  { title: "Validate Mobile", path: "/api/v1/validate/mobile", param: "number", value: "01712345678" },
  { title: "English to Bengali Digits", path: "/api/v1/bn/to-bengali", param: "text", value: "2026" },
  { title: "Bengali to English Digits", path: "/api/v1/bn/to-english", param: "text", value: "২০২৬" },
  { title: "Transliterate", path: "/api/v1/bn/transliterate", param: "text", value: "bangladesh" },
  { title: "Holiday Check", path: "/api/v1/holidays/2026-02-21", param: "", value: "" },
  { title: "Geocode District", path: "/api/v1/geocode", param: "district", value: "Dhaka" },
  { title: "Prayer Times", path: "/api/v1/prayer-times", param: "district_id", value: "47" },
];

export function ToolsPanel() {
  const [values, setValues] = useState(Object.fromEntries(tools.map((tool) => [tool.title, tool.value])));
  const [results, setResults] = useState<Record<string, string>>({});

  async function run(tool: (typeof tools)[number]) {
    const search = tool.param ? `?${tool.param}=${encodeURIComponent(values[tool.title] ?? "")}` : "";
    const response = await fetch(`${tool.path}${search}`);
    const payload = await response.json();
    setResults((current) => ({ ...current, [tool.title]: JSON.stringify(payload, null, 2) }));
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {tools.map((tool) => (
        <section key={tool.title} className="rounded-lg border border-border/50 bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-heading text-xl font-bold">{tool.title}</h2>
              <code className="text-xs text-muted-foreground">{tool.path}</code>
            </div>
            <Button size="sm" onClick={() => void run(tool)}>
              Run
            </Button>
          </div>
          {tool.param && (
            <label className="mt-4 block">
              <span className="mb-1 block text-sm font-medium">{tool.param}</span>
              <input
                value={values[tool.title] ?? ""}
                onChange={(event) => setValues((current) => ({ ...current, [tool.title]: event.target.value }))}
                className="h-10 w-full rounded-md border border-input bg-background px-3 font-mono text-sm outline-none focus:border-primary"
              />
            </label>
          )}
          <pre className="mt-4 min-h-40 overflow-auto rounded-md bg-[#0d1117] p-3 text-xs text-green-300">
            <code>{results[tool.title] ?? "Run this tool to see the response."}</code>
          </pre>
        </section>
      ))}
    </div>
  );
}

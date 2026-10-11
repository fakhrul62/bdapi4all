"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyButton({ text, label = "Copy", compact = false }: { text: string; label?: string; compact?: boolean }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  async function copy() {
    try { await navigator.clipboard.writeText(text); setState("copied"); }
    catch { setState("failed"); }
    window.setTimeout(() => setState("idle"), 2500);
  }
  return <span className="relative inline-flex shrink-0 items-center gap-2">
    <Button type="button" variant="outline" size={compact ? "icon" : "sm"} onClick={copy} aria-label={state === "copied" ? "Copied" : label} title={label}>
      {state === "copied" ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
      {!compact && (state === "copied" ? "Copied!" : label)}
    </Button>
    <span role="status" className={state === "failed" ? "text-xs text-destructive" : "sr-only"}>{state === "failed" ? "Could not copy. Select and copy the text." : state === "copied" ? "Copied to clipboard" : ""}</span>
  </span>;
}

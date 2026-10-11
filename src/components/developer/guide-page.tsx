import Link from "next/link";
import { CopyButton } from "@/components/ui/copy-button";

export const guideSlugs = ["authentication", "errors", "validators", "bn-utils", "mobile"];
const guides: Record<string, { title: string; description: string; links: [string, string][] }> = {
  authentication: { title: "Authentication", description: "Public API requests work without an account or key. Administrators can issue optional keys for configured quotas and usage tracking.", links: [["Rate limits", "/limits"], ["API Keys administration", "/dashboard"]] },
  errors: { title: "Handling errors", description: "Check the HTTP status and success field before reading data. An unsuccessful response contains an error object with a code, message, and documentation link.", links: [["Try a request", "/playground"], ["Rate limits and retry headers", "/limits"]] },
  validators: { title: "Validators", description: "Check the format of Bangladeshi mobile, NID, and TIN values. Format validation does not confirm identity or ownership.", links: [["Mobile validation", "/docs/validate-mobile"], ["NID validation", "/docs/validate-nid"], ["TIN validation", "/docs/validate-tin"], ["Run a validator", "/tools"]] },
  "bn-utils": { title: "Bengali utilities", description: "Convert English and Bengali numerals or experiment with basic transliteration. Keep the original input when your application needs a record of what the user entered.", links: [["English to Bengali digits", "/docs/bn-to-bengali"], ["Bengali to English digits", "/docs/bn-to-english"], ["Transliteration", "/docs/bn-transliterate"], ["Try the tools", "/tools"]] },
  mobile: { title: "Mobile operators", description: "Look up allocated mobile prefixes and check number formats. Mobile number portability means a prefix does not guarantee the current network.", links: [["Operator lookup", "/docs/mobile-operator"], ["Operator list", "/docs/mobile-operators"], ["Validate mobile", "/docs/validate-mobile"]] },
};
const errors = [["400 / 422", "Invalid input", "Check required parameters and their formats."], ["401", "Unauthorized", "Check your key or administrator session."], ["404", "Not found", "Check the endpoint and resource ID."], ["429", "Rate limited", "Wait for Retry-After before retrying."], ["500 / 503", "Service error", "Retry later and include X-Request-ID when reporting an issue."]];

export function GuidePage({ slug }: { slug: string }) {
  const guide = guides[slug];
  const sample = 'curl "https://bdapi4all.vercel.app/api/v1/divisions" -H "X-API-Key: YOUR_KEY"';
  return <div className="space-y-6"><div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">Getting started</p><h1 className="font-heading text-4xl font-extrabold tracking-tight">{guide.title}</h1><p className="mt-4 text-lg leading-8 text-muted-foreground">{guide.description}</p></div>
    {slug === "authentication" && <section className="rounded-xl border border-border bg-card p-4"><div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-semibold">Send an optional key</h2><CopyButton text={sample} label="Copy example" /></div><pre className="overflow-auto rounded-md bg-[#0d1117] p-4 text-sm text-green-300"><code>{sample}</code></pre><p className="mt-3 text-sm text-muted-foreground">Send keys in the X-API-Key header. Keep keys out of shared URLs and source control.</p></section>}
    {slug === "errors" && <div className="space-y-3">{errors.map(([status, title, detail]) => <section id={title === "Rate limited" ? "rate_limited" : title === "Not found" ? "not_found" : undefined} key={status} className="rounded-xl border border-border bg-card p-4"><h2 className="font-semibold"><code className="mr-3 text-primary">{status}</code>{title}</h2><p className="mt-2 text-sm text-muted-foreground">{detail}</p></section>)}</div>}
    <div className="grid gap-3 sm:grid-cols-2">{guide.links.map(([title, href]) => <Link key={href} href={href} className="rounded-xl border border-border bg-card p-4 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary">{title} →</Link>)}</div>
  </div>;
}

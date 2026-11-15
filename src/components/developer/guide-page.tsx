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
const errors = [
  ["bad_request", "400", "Bad request", "Check the request syntax before sending it again."],
  ["invalid_parameter", "422", "Invalid parameter", "Check the parameter named in the message. For paginated lists, limit must be between 1 and 100."],
  ["missing_parameter", "400 / 422", "Missing parameter", "Supply the required value listed in the endpoint guide."],
  ["missing_search_query", "400 / 422", "Missing search query", "Enter a search term in the q parameter."],
  ["unprocessable_entity", "422", "Invalid input", "Check the accepted formats in the endpoint guide."],
  ["unauthorized", "401", "Unauthorized", "Check the credentials required by this endpoint."],
  ["admin_unauthorized", "401", "Administrator sign-in required", "Sign in to the admin dashboard and try again."],
  ["not_found", "404", "Not found", "Check the endpoint path and resource ID."],
  ["record_not_found", "404", "Record not found", "Use the list endpoint to find a valid record ID."],
  ["invalid_category", "400 / 404 / 422", "Invalid category", "Choose a supported category from the endpoint guide."],
  ["rate_limited", "429", "Rate limited", "Wait for Retry-After before retrying."],
  ["server_error", "500", "Server error", "Include X-Request-ID when reporting this issue."],
  ["service_unavailable", "503", "Service unavailable", "Try the request again later."],
];

export function GuidePage({ slug }: { slug: string }) {
  const guide = guides[slug];
  const sample = 'curl "https://bdapi4all.vercel.app/api/v1/divisions" -H "X-API-Key: YOUR_KEY"';
  return <div className="space-y-6"><div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">Getting started</p><h1 className="font-heading text-4xl font-extrabold tracking-tight">{guide.title}</h1><p className="mt-4 text-lg leading-8 text-muted-foreground">{guide.description}</p></div>
    {slug === "authentication" && <section className="rounded-xl border border-border bg-card p-4"><div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-semibold">Send an optional key</h2><CopyButton text={sample} label="Copy example" /></div><pre className="overflow-auto rounded-md bg-[#0d1117] p-4 text-sm text-green-300"><code>{sample}</code></pre><p className="mt-3 text-sm text-muted-foreground">Send keys in the X-API-Key header. Keep keys out of shared URLs and source control.</p></section>}
    {slug === "errors" && <div className="space-y-3">{errors.map(([code, status, title, detail]) => <section id={code} key={code} className="scroll-mt-20 rounded-xl border border-border bg-card p-4"><h2 className="font-semibold"><code className="mr-3 text-primary">{status}</code>{title}</h2><p className="mt-2 text-sm text-muted-foreground">{detail}</p></section>)}</div>}
    <div className="grid gap-3 sm:grid-cols-2">{guide.links.map(([title, href]) => <Link key={href} href={href} className="rounded-xl border border-border bg-card p-4 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary">{title} →</Link>)}</div>
  </div>;
}

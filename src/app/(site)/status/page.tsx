import { StatusMonitor } from "@/components/developer/status-monitor";

export default function StatusPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">API Status</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Live browser checks for core BDApi4All endpoints, plus response timing and HTTP status.
        </p>
      </div>
      <StatusMonitor />
    </div>
  );
}

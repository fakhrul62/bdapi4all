import { DataBrowser } from "@/components/developer/data-browser";

export default function DataPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">Data Browser</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Search Bangladesh divisions, districts, upazilas, and unions. Copy IDs and API URLs for your own app.
        </p>
      </div>
      <DataBrowser />
    </div>
  );
}

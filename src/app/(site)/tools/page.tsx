import { ToolsPanel } from "@/components/developer/tools-panel";

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">Developer Tools</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Small utilities powered by the same public API: validation, mobile operators, Bengali digit conversion, geocoding, and prayer times.
        </p>
      </div>
      <ToolsPanel />
    </div>
  );
}

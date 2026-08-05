import { ShieldAlert } from "lucide-react";

export default function AdminPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-lg border border-border/60 bg-card p-6 shadow-sm text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="font-heading text-2xl font-bold">Admin Portal Temporarily Disabled</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The administrative control panel is temporarily offline for maintenance.
        </p>
      </div>
    </main>
  );
}


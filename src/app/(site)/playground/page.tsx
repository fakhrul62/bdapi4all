import { findEndpoint } from "@/lib/developer-content";
import { ApiExplorer } from "@/components/developer/api-explorer";

export const metadata = { title: "API Explorer" };

export default async function PlaygroundPage({ searchParams }: { searchParams: Promise<{ endpoint?: string }> }) {
  const { endpoint } = await searchParams;
  const initialSlug = endpoint && findEndpoint(endpoint) ? endpoint : "divisions";
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ApiExplorer key={initialSlug} initialSlug={initialSlug} />
    </div>
  );
}

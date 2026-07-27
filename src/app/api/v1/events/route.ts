import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ENRICHMENT_QUERY = `
  SELECT
    id, status, category, processed, verified, images_found,
    errors, started_at, finished_at
  FROM enrichment_runs
  ORDER BY started_at DESC
  LIMIT 5
`;

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
          );
        } catch {
          // controller may be closed
        }
      };

      send("connected", {
        message: "BDApi4All event stream connected",
        timestamp: new Date().toISOString(),
      });

      const lastEnrichmentRun = await prisma.enrichmentRun
        .findFirst({ orderBy: { started_at: "desc" } })
        .catch(() => null);

      if (lastEnrichmentRun) {
        send("enrichment:status", {
          id: lastEnrichmentRun.id,
          status: lastEnrichmentRun.status,
          category: lastEnrichmentRun.category,
          processed: lastEnrichmentRun.processed,
          verified: lastEnrichmentRun.verified,
          images_found: lastEnrichmentRun.images_found,
          started_at: lastEnrichmentRun.started_at,
          finished_at: lastEnrichmentRun.finished_at,
        });
      }

      const recentLogs = await prisma.apiUsageLog
        .findMany({
          take: 10,
          orderBy: { created_at: "desc" },
        })
        .catch(() => []);

      if (recentLogs.length > 0) {
        send("api:recent-activity", {
          count: recentLogs.length,
          endpoints: recentLogs.map((log) => ({
            endpoint: log.endpoint,
            status_code: log.status_code,
            response_time_ms: log.response_time_ms,
            created_at: log.created_at,
          })),
        });
      }

      try {
        const enrichmentRuns = await prisma.$queryRawUnsafe(ENRICHMENT_QUERY);
        if (Array.isArray(enrichmentRuns) && enrichmentRuns.length > 0) {
          send("enrichment:history", { runs: enrichmentRuns });
        }
      } catch {
        // enrichment_runs table may not exist in all environments
      }

      const heartbeat = setInterval(() => {
        send("heartbeat", { timestamp: new Date().toISOString() });
      }, 15000);

      setTimeout(() => {
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch {
          // already closed
        }
      }, 5 * 60 * 1000);
    },

    cancel() {
      // cleanup happens via the timeout or client disconnect
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204 });
}

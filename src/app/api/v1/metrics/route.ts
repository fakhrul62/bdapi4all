import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MetricRow = {
  endpoint: string;
  total_requests: bigint;
  avg_response_ms: number;
  error_count: bigint;
};

export async function GET() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [lastHour, lastDay, topEndpoints, totalRequests] = await Promise.all([
    prisma.apiUsageLog.count({
      where: { created_at: { gte: oneHourAgo } },
    }),
    prisma.apiUsageLog.count({
      where: { created_at: { gte: oneDayAgo } },
    }),
    prisma.$queryRaw<MetricRow[]>`
      SELECT
        endpoint,
        COUNT(*) as total_requests,
        COALESCE(AVG(response_time_ms), 0)::float as avg_response_ms,
        COUNT(*) FILTER (WHERE status_code >= 400) as error_count
      FROM api_usage_logs
      WHERE created_at >= ${oneDayAgo}
      GROUP BY endpoint
      ORDER BY total_requests DESC
      LIMIT 20
    `,
    prisma.apiUsageLog.count(),
  ]);

  const endpointMetrics = topEndpoints.map((row) => ({
    endpoint: row.endpoint,
    total_requests: Number(row.total_requests),
    avg_response_ms: Math.round(row.avg_response_ms),
    error_count: Number(row.error_count),
    error_rate:
      Number(row.total_requests) > 0
        ? ((Number(row.error_count) / Number(row.total_requests)) * 100).toFixed(2) + "%"
        : "0%",
  }));

  return Response.json(
    {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        requests: {
          last_hour: lastHour,
          last_24_hours: lastDay,
          all_time: totalRequests,
        },
        endpoints: endpointMetrics,
        summary: {
          total_endpoints_tracked: endpointMetrics.length,
          avg_response_ms:
            endpointMetrics.length > 0
              ? Math.round(
                  endpointMetrics.reduce((sum, e) => sum + e.avg_response_ms, 0) /
                    endpointMetrics.length,
                )
              : 0,
          total_errors: endpointMetrics.reduce((sum, e) => sum + e.error_count, 0),
        },
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    },
  );
}

import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HealthCheck = {
  name: string;
  status: "healthy" | "degraded" | "down";
  latency_ms?: number;
  message?: string;
};

export async function GET() {
  const checks: HealthCheck[] = [];
  const startTime = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.push({
      name: "database",
      status: "healthy",
      latency_ms: Date.now() - startTime,
    });
  } catch (error) {
    checks.push({
      name: "database",
      status: "down",
      latency_ms: Date.now() - startTime,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }

  const allHealthy = checks.every((c) => c.status === "healthy");
  const anyDown = checks.some((c) => c.status === "down");
  const overall = anyDown ? "down" : allHealthy ? "healthy" : "degraded";

  return Response.json(
    {
      status: overall,
      timestamp: new Date().toISOString(),
      checks,
      uptime: process.uptime(),
      version: "v1",
    },
    {
      status: overall === "down" ? 503 : 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}

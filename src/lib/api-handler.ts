import { ZodError } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { errorResponse, successResponse } from "@/lib/response";
import { logApiUsage } from "@/lib/usage-log";

type HandlerResult<T> = {
  data: T;
  cacheControl?: string;
};

export async function handleApi<T>(
  request: Request,
  handler: () => Promise<HandlerResult<T>>,
) {
  const startedAt = Date.now();
  const pathname = new URL(request.url).pathname;
  const ip = getClientIp(request);

  try {
    const limit = await checkRateLimit(request);
    if (!limit.success) {
      const response = errorResponse("RATE_LIMITED", "Rate limit exceeded.", 429, {
        responseTimeMs: Date.now() - startedAt,
        rateLimitRemaining: 0,
        headers: {
          "Retry-After": String(limit.retryAfter),
        },
      });
      logApiUsage({
        endpoint: pathname,
        ip,
        responseTimeMs: Date.now() - startedAt,
        statusCode: 429,
      });
      return response;
    }

    const result = await handler();
    const response = successResponse(result.data, {
      responseTimeMs: Date.now() - startedAt,
      rateLimitRemaining: limit.remaining,
      cacheControl: result.cacheControl,
    });
    logApiUsage({
      endpoint: pathname,
      ip,
      responseTimeMs: Date.now() - startedAt,
      statusCode: response.status,
    });
    return response;
  } catch (error) {
    const responseTimeMs = Date.now() - startedAt;

    if (error instanceof ZodError) {
      const message = error.issues
        .map((issue) => `${issue.path.join(".") || "query"}: ${issue.message}`)
        .join("; ");
      const response = errorResponse("INVALID_PARAMETER", message, 422, {
        responseTimeMs,
      });
      logApiUsage({ endpoint: pathname, ip, responseTimeMs, statusCode: 422 });
      return response;
    }

    if (error instanceof Response) {
      logApiUsage({ endpoint: pathname, ip, responseTimeMs, statusCode: error.status });
      return error;
    }

    const response = errorResponse(
      "SERVER_ERROR",
      "An unexpected server error occurred.",
      500,
      { responseTimeMs },
    );
    logApiUsage({ endpoint: pathname, ip, responseTimeMs, statusCode: 500 });
    return response;
  }
}

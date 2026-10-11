import { ZodError } from "zod";
import { checkKey, checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { baseHeaders, createRequestId, errorResponse, successResponse } from "@/lib/response";
import { logApiUsage } from "@/lib/usage-log";
import { touchApiKey, verifyApiKey } from "@/lib/api-key";

type HandlerResult<T> = {
  data: T;
  meta?: Record<string, unknown>;
  cacheControl?: string;
};

export async function handleApi<T>(
  request: Request,
  handler: () => Promise<HandlerResult<T> | Response>,
) {
  const startedAt = Date.now();
  const pathname = new URL(request.url).pathname;
  const ip = getClientIp(request);
  const requestId = createRequestId(request);
  let apiKey: Awaited<ReturnType<typeof verifyApiKey>> = null;

  try {
    apiKey = await verifyApiKey(request);
    const limit = apiKey
      ? await checkKey(`key:${apiKey.apiKeyId}`, apiKey.rateLimit)
      : await checkRateLimit(request);

    if (!limit.success) {
      const response = errorResponse("RATE_LIMITED", "Rate limit exceeded.", 429, {
        responseTimeMs: Date.now() - startedAt,
        rateLimitRemaining: 0,
        requestId,
        headers: {
          "Retry-After": String(limit.retryAfter),
        },
      });
      logApiUsage({
        endpoint: pathname,
        ip,
        responseTimeMs: Date.now() - startedAt,
        statusCode: 429,
        apiKeyId: apiKey?.apiKeyId ?? null,
      });
      return response;
    }

    if (apiKey) {
      await touchApiKey(apiKey.apiKeyId);
    }

    const result = await handler();
    const response = result instanceof Response ? result : successResponse(result.data, {
      responseTimeMs: Date.now() - startedAt,
      rateLimitRemaining: limit.remaining,
      cacheControl: result.cacheControl,
      meta: result.meta,
      requestId,
    });
    if (result instanceof Response) {
      baseHeaders({ responseTimeMs: Date.now() - startedAt, rateLimitRemaining: limit.remaining, requestId }).forEach((value, key) => response.headers.set(key, value));
    }
    logApiUsage({
      endpoint: pathname,
      ip,
      responseTimeMs: Date.now() - startedAt,
      statusCode: response.status,
      apiKeyId: apiKey?.apiKeyId ?? null,
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
        requestId,
      });
      logApiUsage({ endpoint: pathname, ip, responseTimeMs, statusCode: 422, apiKeyId: apiKey?.apiKeyId ?? null });
      return response;
    }

    if (error instanceof Response) {
      logApiUsage({ endpoint: pathname, ip, responseTimeMs, statusCode: error.status, apiKeyId: apiKey?.apiKeyId ?? null });
      return error;
    }

    const response = errorResponse(
      "SERVER_ERROR",
      "An unexpected server error occurred.",
      500,
      { responseTimeMs, requestId },
    );
    logApiUsage({ endpoint: pathname, ip, responseTimeMs, statusCode: 500, apiKeyId: apiKey?.apiKeyId ?? null });
    return response;
  }
}

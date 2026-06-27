import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "INVALID_PARAMETER"
  | "MISSING_PARAMETER"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "UNPROCESSABLE_ENTITY";

export type ApiError = {
  code: string;
  message: string;
  docs: string;
};

type ApiResponseInit = ResponseInit & {
  responseTimeMs?: number;
  rateLimitRemaining?: number;
  cacheControl?: string;
  meta?: Record<string, unknown>;
  requestId?: string;
};

const API_VERSION = "v1";
const DOCS_BASE_URL = "https://bdapi4all.vercel.app/docs";

export function createRequestId(request?: Request) {
  return request?.headers.get("x-request-id") || randomUUID();
}

function baseHeaders(init?: ApiResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("X-Response-Time", `${init?.responseTimeMs ?? 0}ms`);
  headers.set("X-RateLimit-Remaining", String(init?.rateLimitRemaining ?? 100));
  headers.set("X-Request-ID", init?.requestId ?? headers.get("X-Request-ID") ?? randomUUID());

  if (init?.cacheControl) {
    headers.set("Cache-Control", init.cacheControl);
  }

  return headers;
}

export function successResponse<T>(data: T, init?: ApiResponseInit) {
  const requestId = init?.requestId ?? randomUUID();
  const responseInit = { ...init };
  delete responseInit.requestId;

  return NextResponse.json(
    {
      success: true,
      version: API_VERSION,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      data,
      ...(init?.meta ? { meta: init.meta } : {}),
    },
    {
      ...responseInit,
      headers: baseHeaders({ ...init, requestId }),
    },
  );
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  init?: ApiResponseInit & { docsPath?: string },
) {
  const docsPath = init?.docsPath ?? `/docs/errors#${code.toLowerCase()}`;
  const requestId = init?.requestId ?? randomUUID();
  const responseInit = { ...init };
  delete responseInit.requestId;

  return NextResponse.json(
    {
      success: false,
      version: API_VERSION,
      request_id: requestId,
      timestamp: new Date().toISOString(),
      error: {
        code,
        message,
        docs: `${DOCS_BASE_URL}${docsPath.replace(/^\/docs/, "")}`,
      },
    },
    {
      ...responseInit,
      status,
      headers: baseHeaders({ ...init, requestId }),
    },
  );
}

export function optionsResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: baseHeaders(),
  });
}

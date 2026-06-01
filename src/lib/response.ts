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
};

const API_VERSION = "v1";
const DOCS_BASE_URL = "https://bdapi4all.vercel.app/docs";

function baseHeaders(init?: ApiResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("X-Response-Time", `${init?.responseTimeMs ?? 0}ms`);
  headers.set("X-RateLimit-Remaining", String(init?.rateLimitRemaining ?? 100));

  if (init?.cacheControl) {
    headers.set("Cache-Control", init.cacheControl);
  }

  return headers;
}

export function successResponse<T>(data: T, init?: ApiResponseInit) {
  return NextResponse.json(
    {
      success: true,
      version: API_VERSION,
      timestamp: new Date().toISOString(),
      data,
    },
    {
      ...init,
      headers: baseHeaders(init),
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

  return NextResponse.json(
    {
      success: false,
      version: API_VERSION,
      timestamp: new Date().toISOString(),
      error: {
        code,
        message,
        docs: `${DOCS_BASE_URL}${docsPath.replace(/^\/docs/, "")}`,
      },
    },
    {
      ...init,
      status,
      headers: baseHeaders(init),
    },
  );
}

export function optionsResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: baseHeaders(),
  });
}

import { z } from "zod";
import { requireAdminResponse } from "@/lib/admin-auth";
import { issueApiKey, listApiKeys, revokeApiKeyById } from "@/lib/api-key";
import { errorResponse, successResponse } from "@/lib/response";

/** Human-readable error returned when the api_keys table hasn’t been migrated yet. */
function dbMissingResponse() {
  return errorResponse(
    "SERVICE_UNAVAILABLE",
    "The api_keys table does not exist yet. Run the pending migration in the Supabase SQL editor (prisma/migrations/20260805010000_add_api_keys/migration.sql) and try again.",
    503,
  );
}

export async function GET(request: Request) {
  const unauthorized = await requireAdminResponse(request);
  if (unauthorized) return unauthorized;

  try {
    const keys = await listApiKeys();
    return successResponse({ keys });
  } catch {
    return dbMissingResponse();
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminResponse(request);
  if (unauthorized) return unauthorized;

  const schema = z.object({
    name: z.string().min(1).max(80),
    rate_limit: z.coerce.number().int().min(1).max(10000).default(100),
  });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return errorResponse(
      "INVALID_PARAMETER",
      "Provide a name and an optional rate_limit between 1 and 10000.",
      422,
    );
  }

  try {
    const issued = await issueApiKey(parsed.data.name, parsed.data.rate_limit);
    return successResponse({
      id: issued.id,
      name: issued.name,
      key: issued.key,
      rate_limit: issued.rateLimit,
      note: "Store this key securely. It is shown only once.",
    });
  } catch {
    return dbMissingResponse();
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdminResponse(request);
  if (unauthorized) return unauthorized;

  const schema = z.object({ id: z.coerce.number().int().positive() });
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return errorResponse("INVALID_PARAMETER", "Provide a valid key id to revoke.", 422);
  }

  try {
    await revokeApiKeyById(body.data.id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    // Distinguish "table missing" (relation does not exist) from "key not found".
    if (msg.includes("does not exist") || msg.includes("relation")) {
      return dbMissingResponse();
    }
    return errorResponse("NOT_FOUND", "API key not found.", 404);
  }

  return successResponse({ revoked: true, id: body.data.id });
}
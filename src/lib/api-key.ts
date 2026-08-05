import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/db";

export const API_KEY_PREFIX = "bdapi_";

export type IssuedApiKey = {
  key: string;
  id: number;
  name: string;
  rateLimit: number;
};

function hashApiKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

export function extractApiKey(request: Request): string | null {
  const header = request.headers.get("x-api-key");
  if (header) return header.trim();
  const url = new URL(request.url);
  const query = url.searchParams.get("apikey");
  return query ? query.trim() : null;
}

export async function verifyApiKey(request: Request): Promise<
  | null
  | {
      apiKeyId: number;
      rateLimit: number;
    }
> {
  const raw = extractApiKey(request);
  if (!raw) return null;

  try {
    const record = await prisma.apiKey.findUnique({
      where: { key_hash: hashApiKey(raw) },
    });

    if (!record || record.status !== "active") return null;

    return {
      apiKeyId: record.id,
      rateLimit: record.rate_limit,
    };
  } catch {
    // If the DB is unavailable, degrade gracefully: treat the request as anonymous.
    return null;
  }
}

export async function touchApiKey(id: number) {
  prisma.apiKey
    .update({
      where: { id },
      data: { last_used_at: new Date() },
    })
    .catch(() => {
      // Non-blocking.
    });
}

export async function issueApiKey(name: string, rateLimit = 100): Promise<IssuedApiKey> {
  const key = `${API_KEY_PREFIX}${randomBytes(24).toString("base64url")}`;
  const record = await prisma.apiKey.create({
    data: {
      key_hash: hashApiKey(key),
      name,
      rate_limit: rateLimit,
    },
  });

  return { key, id: record.id, name: record.name, rateLimit: record.rate_limit };
}

export async function revokeApiKey(key: string) {
  return prisma.apiKey.update({
    where: { key_hash: hashApiKey(key) },
    data: { status: "revoked" },
  });
}

export async function revokeApiKeyById(id: number) {
  return prisma.apiKey.update({
    where: { id },
    data: { status: "revoked" },
  });
}

export async function listApiKeys() {
  return prisma.apiKey.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      rate_limit: true,
      created_at: true,
      last_used_at: true,
    },
  });
}

export function apiKeyDigest(key: string) {
  return hashApiKey(key);
}

export function apiKeyMatches(raw: string, expected: string) {
  const a = Buffer.from(hashApiKey(raw));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

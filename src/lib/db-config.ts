import type { PoolConfig } from "pg";

/** Verify remote database certificates; Docker/local PostgreSQL can use plain TCP. */
export function databaseConnectionOptions(): PoolConfig {
  const raw = process.env.DATABASE_URL;
  if (!raw) return { connectionTimeoutMillis: 10_000 };
  const url = new URL(raw);
  const local = ["localhost", "127.0.0.1", "::1", "[::1]", "db"].includes(url.hostname);
  const disableTls = process.env.PGSSLMODE === "disable" || url.searchParams.get("sslmode") === "disable";
  if (disableTls && !local) throw new Error("TLS cannot be disabled for a remote database.");
  for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert", "uselibpqcompat"]) url.searchParams.delete(key);
  return {
    connectionString: url.toString(),
    connectionTimeoutMillis: 10_000,
    ssl: local ? false : { rejectUnauthorized: true, ...(process.env.DATABASE_CA_CERT ? { ca: process.env.DATABASE_CA_CERT.replace(/\\n/g, "\n") } : {}) },
  };
}

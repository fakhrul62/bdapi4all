import assert from "node:assert/strict";
const base = process.env.SMOKE_BASE_URL || "http://localhost:3000";
for (let attempt = 0; attempt < 30; attempt++) {
  try { const response = await fetch(base + "/api/v1/health"); if (response.ok) break; } catch {}
  if (attempt === 29) throw new Error("Production server did not become healthy.");
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
for (const path of ["/", "/docs", "/playground", "/dashboard", "/openapi.json", "/api/v1/health", "/api/v1/divisions", "/api/v1/export?category=divisions&format=csv"]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  console.log(`PASS ${path}`);
}
const preflight = await fetch(base + "/api/v1/divisions", { method: "OPTIONS", headers: { Origin: "https://example.com", "Access-Control-Request-Headers": "X-API-Key" } });
assert.match(preflight.headers.get("Access-Control-Allow-Headers"), /X-API-Key/);
for (const path of ["/api/admin/keys", "/api/cron/exchange-rates", "/api/cron/data-quality", "/api/cron/encyclopedia-enrichment"]) assert.equal((await fetch(base + path)).status, 401, path);
const invalid = await fetch(base + "/api/v1/graphql", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: "{ ! }" }), signal: AbortSignal.timeout(5000) });
assert.equal(invalid.status, 422);
const valid = await fetch(base + "/api/v1/graphql", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: "{ divisions(limit: 2) { id name_en } }" }) });
assert.equal(valid.status, 200);
const payload = await valid.json();
assert.equal(payload.data.divisions.length, 2);
assert.deepEqual(Object.keys(payload.data.divisions[0]).sort(), ["id", "name_en"]);
console.log("PASS authentication, CORS, GraphQL rejection and field projection");

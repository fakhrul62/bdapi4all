import test from "node:test";
import assert from "node:assert/strict";
import { issueAdminToken, validAdminToken, secretMatches, ADMIN_SESSION_SECONDS } from "../src/lib/admin-token";
import { parseReadQuery, projectGraphQL, QueryError } from "../src/lib/graphql-query";
import { databaseConnectionOptions } from "../src/lib/db-config";
import { cronAuthorized } from "../src/lib/cron-auth";
import { optionsResponse } from "../src/lib/response";
import { scrapeBangladeshBankRates } from "../src/lib/scraper";

test("admin tokens expire, reject tampering and invalidate on secret rotation", () => {
  const now = 1_000_000;
  const token = issueAdminToken("test-secret", now);
  assert.equal(validAdminToken(token, "test-secret", now), true);
  assert.equal(validAdminToken(token, "different-secret", now), false);
  assert.equal(validAdminToken(token, "test-secret", now + ADMIN_SESSION_SECONDS * 1000), false);
  assert.equal(validAdminToken(token + "0", "test-secret", now), false);
  assert.equal(validAdminToken("invalid", "test-secret", now), false);
  assert.equal(secretMatches("wrong", "test-secret"), false);
});

test("cron authorization accepts Vercel bearer headers and fails closed", () => {
  const previous = process.env.CRON_SECRET;
  try {
    delete process.env.CRON_SECRET;
    assert.equal(cronAuthorized(new Request("https://example.com")), false);
    process.env.CRON_SECRET = "cron-test";
    assert.equal(cronAuthorized(new Request("https://example.com", { headers: { authorization: "Bearer cron-test" } })), true);
    assert.equal(cronAuthorized(new Request("https://example.com?secret=cron-test", { headers: { "x-cron-secret": "cron-test" } })), false);
    assert.equal(cronAuthorized(new Request("https://example.com", { headers: { authorization: "Bearer wrong" } })), false);
  } finally { if (previous === undefined) delete process.env.CRON_SECRET; else process.env.CRON_SECRET = previous; }
});

test("browser API-key preflight permits and exposes the expected headers", () => {
  const response = optionsResponse();
  assert.equal(response.status, 204);
  assert.match(response.headers.get("Access-Control-Allow-Headers")!, /X-API-Key/);
  assert.match(response.headers.get("Access-Control-Allow-Methods")!, /POST/);
  assert.match(response.headers.get("Access-Control-Expose-Headers")!, /X-RateLimit-Remaining/);
});

test("GraphQL variables, defaults, aliases and field projection work", () => {
  const [field] = parseReadQuery("query Places($n: Int! = 2) { places: districts(limit: $n) { id title: name_en } }", {}, "Places");
  assert.equal(field.alias, "places");
  assert.equal(field.arguments.limit, "2");
  assert.deepEqual(JSON.parse(JSON.stringify(projectGraphQL([{ id: 1, name_en: "Dhaka", secret: "hidden" }], field.fields))), [{ id: 1, title: "Dhaka" }]);
});

for (const query of ["{ ! }", "{ ...F } fragment F on Query { divisions { id } }", "mutation { divisions { id } }", "{ districts(limit: -1) { id } }", "{ districts(limit: 101) { id } }", "{ districts(limit: 1.5) { id } }", "{ district { id } }", "{ __schema { types { name } } }", "{ unknown { id } }", "{ districts(where: true) { id } }", "{ districts }"]) {
  test(`GraphQL rejects unsafe or unsupported query: ${query}`, { timeout: 1000 }, () => assert.throws(() => parseReadQuery(query), QueryError));
}

test("GraphQL bounds query size, root fields and nesting", () => {
  assert.throws(() => parseReadQuery(" ".repeat(10_001)), QueryError);
  assert.throws(() => parseReadQuery("{ " + Array.from({ length: 11 }, (_, i) => `d${i}: districts { id }`).join(" ") + " }"), QueryError);
  assert.throws(() => parseReadQuery("{ districts { a { b { c { d { e { id } } } } } } }"), QueryError);
  assert.throws(() => parseReadQuery("query($n: Int!) { districts(limit: $n) { id } }"), QueryError);
});

test("database TLS verifies remote certificates and permits local Docker", () => {
  const old = process.env.DATABASE_URL;
  try {
    process.env.DATABASE_URL = "postgresql://test:test@remote.example:5432/test?sslmode=no-verify";
    assert.equal((databaseConnectionOptions().ssl as { rejectUnauthorized: boolean }).rejectUnauthorized, true);
    assert.equal(new URL(databaseConnectionOptions().connectionString!).searchParams.has("sslmode"), false);
    process.env.DATABASE_URL = "postgresql://test:test@db:5432/test";
    assert.equal(databaseConnectionOptions().ssl, false);
    process.env.DATABASE_URL = "postgresql://test:test@remote.example:5432/test?sslmode=disable";
    assert.throws(databaseConnectionOptions);
  } finally { if (old === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = old; }
});

test("exchange-rate failures never manufacture new current rates", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response("upstream unavailable", { status: 503 });
    await assert.rejects(scrapeBangladeshBankRates);
    globalThis.fetch = async () => new Response("<html>No exchange table</html>");
    await assert.rejects(scrapeBangladeshBankRates);
    globalThis.fetch = async () => new Response("<table><tr><td>USD</td><td>123.1</td><td>123.22</td></tr></table>");
    assert.equal((await scrapeBangladeshBankRates())[0].currency_code, "USD");
  } finally { globalThis.fetch = original; }
});

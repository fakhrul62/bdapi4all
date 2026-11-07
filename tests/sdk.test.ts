import test from "node:test";
import assert from "node:assert/strict";
import { BdApiClient } from "../packages/ts-sdk/index";

test("TypeScript SDK cache is bounded and keeps recently used responses", async () => {
  const originalFetch = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = (async () => {
    requests += 1;
    return Response.json({ success: true, version: "v1", timestamp: "", data: [] });
  }) as typeof fetch;

  try {
    const client = new BdApiClient({
      baseUrl: "https://api.example.test/api/v1",
      maxCacheEntries: 2,
    });

    await client.getDistricts({ division_id: 1 });
    await client.getUpazilas({ district_id: 1 });
    await client.getDistricts({ division_id: 1 });
    await client.getUnions({ upazila_id: 1 });
    await client.getUpazilas({ district_id: 1 });

    assert.equal(requests, 4);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

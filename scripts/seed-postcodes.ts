import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { databaseConnectionOptions } from "../src/lib/db-config";
import rows from "../data/postcodes.json";

config({ path: ".env.local", quiet: true });
config({ quiet: true });
const prisma = new PrismaClient({ adapter: new PrismaPg(databaseConnectionOptions()) });

async function main() {
  const inserted = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(42026011)`;
    const upazilas = await tx.upazila.findMany({ select: { id: true, district_id: true } });
    const parents = new Map(upazilas.map((item) => [item.id, item.district_id]));
    const existing = await tx.postcode.findMany({ select: { district_id: true, upazila_id: true, postcode: true } });
    const keys = new Set(existing.map((item) => `${item.district_id}:${item.upazila_id}:${item.postcode}`));
    const data = [];
    for (const row of rows) {
      if (parents.get(row.upazila_id) !== row.district_id || !/^\d{4}$/.test(row.postcode)) throw new Error("Postcode geography does not match this database; no data was imported.");
      const key = `${row.district_id}:${row.upazila_id}:${row.postcode}`;
      if (keys.has(key)) continue;
      keys.add(key);
      data.push({ district_id: row.district_id, upazila_id: row.upazila_id, postcode: row.postcode });
    }
    if (!data.length) return 0;
    return (await tx.postcode.createMany({ data })).count;
  }, { timeout: 60_000, maxWait: 10_000 });
  console.log(`Postcodes: inserted ${inserted} new records; existing records preserved.`);
}

main().catch(() => { console.error("Postcode import failed. Check database connectivity and geography IDs."); process.exitCode = 1; }).finally(() => prisma.$disconnect());

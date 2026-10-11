import { config } from "dotenv";
import { Pool } from "pg";
import { Prisma } from "@prisma/client";
import { databaseConnectionOptions } from "../src/lib/db-config";
import { repairTable } from "../src/lib/data-repair";

config({ path: ".env.local", quiet: true });
config({ quiet: true });
const apply = process.argv.includes("--apply");
const pool = new Pool(databaseConnectionOptions());

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SET LOCAL statement_timeout='60s'");
    await client.query("SELECT pg_advisory_xact_lock(42026012)");
    const results = [];
    for (const model of Prisma.dmmf.datamodel.models) {
      const verification = model.fields.some((field) => field.name === "source_url");
      if (!verification && model.name !== "Union") continue;
      const table = model.dbName!;
      results.push(await repairTable(client, { table, category: table.replaceAll("_", "-"), verification }, apply));
    }
    await client.query(apply ? "COMMIT" : "ROLLBACK");
    console.table(results);
    console.log(apply ? "Repair committed; original records retained in record_archive." : "Read-only preview; use --apply after reviewing the counts.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}
main().catch(() => { console.error("Data repair failed; the transaction was rolled back."); process.exitCode = 1; }).finally(() => pool.end());

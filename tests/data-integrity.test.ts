import test from "node:test";
import assert from "node:assert/strict";
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { databaseConnectionOptions } from "../src/lib/db-config";
import { repairTable } from "../src/lib/data-repair";
import { createImportedRecord } from "../src/lib/import-record";

test("database RLS blocks direct reads and writes while server access remains available", { skip: process.env.DATABASE_INTEGRITY_TESTS !== "true" }, async () => {
  const pool = new Pool(databaseConnectionOptions());
  const client = await pool.connect();
  await client.query("BEGIN");
  try {
    await client.query("CREATE ROLE regression_browser NOLOGIN");
    await client.query("GRANT USAGE ON SCHEMA public TO regression_browser");
    await client.query("GRANT SELECT,INSERT,UPDATE,DELETE ON public.api_keys TO regression_browser");
    await client.query("INSERT INTO public.api_keys (id,key_hash,name) VALUES (-999,'regression-not-a-real-key','Regression test')");
    await client.query("SET LOCAL ROLE regression_browser");
    assert.equal((await client.query("SELECT count(*) FROM public.api_keys")).rows[0].count, "0");
    assert.equal((await client.query("UPDATE public.api_keys SET name='Changed' WHERE id=-999")).rowCount, 0);
    assert.equal((await client.query("DELETE FROM public.api_keys WHERE id=-999")).rowCount, 0);
    await client.query("SAVEPOINT blocked_write");
    await assert.rejects(client.query("INSERT INTO public.api_keys (id,key_hash,name) VALUES (-998,'blocked-test-key','Blocked')"), (error: unknown) => (error as { code: string }).code === "42501");
    await client.query("ROLLBACK TO SAVEPOINT blocked_write");
    await client.query("RESET ROLE");
    assert.equal((await client.query("SELECT name FROM public.api_keys WHERE id=-999")).rows[0].name, "Regression test");
  } finally { await client.query("ROLLBACK"); client.release(); await pool.end(); }
});

test("repair archives exact copies, preserves references and different content, and is idempotent", { skip: process.env.DATABASE_INTEGRITY_TESTS !== "true" }, async () => {
  const pool = new Pool(databaseConnectionOptions());
  const client = await pool.connect();
  await client.query("BEGIN");
  try {
    await client.query(`CREATE TABLE public.repair_test_records (id SERIAL PRIMARY KEY,name_en TEXT,source TEXT,source_url TEXT,verified BOOLEAN,description TEXT,created_at TIMESTAMP DEFAULT now(),updated_at TIMESTAMP DEFAULT now())`);
    await client.query(`CREATE TABLE public.repair_test_references (record_id INT REFERENCES public.repair_test_records(id))`);
    await client.query(`INSERT INTO public.repair_test_records (name_en,source,source_url,verified,description) VALUES
      ('Same','wikipedia','https://example.com/same',false,'Identical'),
      ('Same','wikipedia','https://example.com/same',false,'Identical'),
      ('Same','wikipedia','https://example.com/same',false,'Different'),
      ('Unsourced','seed',null,true,'Retained'),
      ('Referenced','seed','https://example.com/reference',false,'Identical'),
      ('Referenced','seed','https://example.com/reference',false,'Identical')`);
    await client.query("INSERT INTO public.repair_test_references VALUES (6)");
    const table = { table: "repair_test_records", category: "repair-test" };
    const preview = await repairTable(client, table, false);
    assert.equal(preview.exact_duplicates, 1);
    assert.equal(preview.unsupported_verification, 1);
    assert.equal((await client.query("SELECT count(*) FROM public.repair_test_records")).rows[0].count, "6");
    const applied = await repairTable(client, table, true);
    assert.equal(applied.exact_duplicates, 1);
    assert.equal((await client.query("SELECT count(*) FROM public.repair_test_records")).rows[0].count, "5");
    const archived = (await client.query("SELECT canonical_id,payload FROM record_archive WHERE category='repair-test' AND reason='exact_duplicate'")).rows[0];
    assert.equal(archived.canonical_id, 1);
    assert.equal(archived.payload.id, 2);
    assert.equal((await client.query("SELECT verified FROM public.repair_test_records WHERE id=4")).rows[0].verified, false);
    assert.equal((await client.query("SELECT payload FROM record_archive WHERE category='repair-test' AND reason='unsupported_verification'")).rows[0].payload.verified, true);
    assert.equal((await repairTable(client, table, true)).exact_duplicates, 0);
    assert.equal((await client.query("SELECT record_id FROM public.repair_test_references")).rows[0].record_id, 6);
    await client.query("CREATE TABLE public.repair_test_unions (id INT PRIMARY KEY,upazila_id INT,name_en TEXT,name_bn TEXT)");
    await client.query("INSERT INTO public.repair_test_unions VALUES (1,1,'Same','Test'),(2,1,'Same','Test'),(3,2,'Same','Test')");
    const unions = { table: "repair_test_unions", category: "repair-test-unions", verification: false };
    assert.equal((await repairTable(client, unions, true)).exact_duplicates, 1);
    assert.equal((await client.query("SELECT count(*) FROM public.repair_test_unions")).rows[0].count, "2");
    assert.equal((await repairTable(client, unions, true)).exact_duplicates, 0);
    await assert.rejects(repairTable(client, { table: "bad; DROP TABLE books", category: "bad" }, false));
  } finally { await client.query("ROLLBACK"); client.release(); await pool.end(); }
});

test("imports compare canonical redirected titles and serialize concurrent inserts", { skip: process.env.DATABASE_INTEGRITY_TESTS !== "true" }, async () => {
  const prisma = new PrismaClient({ adapter: new PrismaPg(databaseConnectionOptions()) });
  const data = { name_en: "Regression canonical river", name_bn: "Test", description_en: "Test", description_bn: "Test", source: "test", source_url: "https://example.com/import-regression", verified: false, flows_through: [] };
  try {
    const results = await Promise.all([createImportedRecord(prisma, "river", data), createImportedRecord(prisma, "river", data)]);
    assert.equal(results.filter(Boolean).length, 1);
    assert.equal(await createImportedRecord(prisma, "river", { ...data, name_en: "Redirect alias" }), false);
    assert.equal(await prisma.river.count({ where: { source_url: data.source_url } }), 1);
  } finally { await prisma.river.deleteMany({ where: { source_url: data.source_url } }); await prisma.$disconnect(); }
});

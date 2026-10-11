import type { PoolClient } from "pg";

export type RepairTable = { table: string; category: string; verification?: boolean };
function identifier(value: string) {
  if (!/^[a-z_]+$/.test(value)) throw new Error("Invalid repair table or column.");
  return `"${value}"`;
}

/** Caller owns the transaction. Snapshots and changes commit or roll back together. */
export async function repairTable(client: PoolClient, { table, category, verification = true }: RepairTable, apply: boolean) {
  const name = `public.${identifier(table)}`;
  if (apply) await client.query(`LOCK TABLE ${name} IN SHARE ROW EXCLUSIVE MODE`);
  const missing = verification ? await client.query<{ count: string }>(`SELECT count(*) FROM ${name} WHERE verified AND (coalesce(trim(source),'')='' OR coalesce(trim(source_url),'')='')`) : { rows: [{ count: "0" }] };
  if (apply && verification) {
    await client.query(`INSERT INTO record_archive (category,record_id,reason,payload)
      SELECT $1,id,'unsupported_verification',to_jsonb(t) FROM ${name} t
      WHERE verified AND (coalesce(trim(source),'')='' OR coalesce(trim(source_url),'')='')
      ON CONFLICT (category,record_id,reason) DO NOTHING`, [category]);
    await client.query(`UPDATE ${name} SET verified=false WHERE verified AND (coalesce(trim(source),'')='' OR coalesce(trim(source_url),'')='')`);
  }
  // Compare every stored field except identity and timestamps. Matching names
  // or source URLs alone never authorize merging records.
  const ranked = `SELECT id,min(id) OVER (PARTITION BY to_jsonb(t)-'id'-'created_at'-'updated_at') AS canonical_id FROM ${name} t`;
  const references = await client.query<{ schema_name: string; table_name: string; column_name: string }>(`
    SELECT n.nspname AS schema_name,c.relname AS table_name,a.attname AS column_name
    FROM pg_constraint fk JOIN pg_class c ON c.oid=fk.conrelid
    JOIN pg_namespace n ON n.oid=c.relnamespace
    JOIN pg_attribute a ON a.attrelid=c.oid AND a.attnum=fk.conkey[1]
    WHERE fk.contype='f' AND fk.confrelid=$1::regclass AND cardinality(fk.conkey)=1`, [name]);
  const safe = references.rows.map((ref) => `NOT EXISTS (SELECT 1 FROM ${identifier(ref.schema_name)}.${identifier(ref.table_name)} child WHERE child.${identifier(ref.column_name)}=t.id)`).join(" AND ") || "true";
  const candidates = `SELECT t.id,r.canonical_id,to_jsonb(t) AS payload FROM ${name} t JOIN (${ranked}) r ON r.id=t.id WHERE t.id<>r.canonical_id AND ${safe}`;
  const count = await client.query<{ count: string }>(`SELECT count(*) FROM (${candidates}) candidates`);
  if (apply) {
    await client.query(`WITH archived AS (
      INSERT INTO record_archive (category,record_id,canonical_id,reason,payload)
      SELECT $1,id,canonical_id,'exact_duplicate',payload FROM (${candidates}) candidates
      ON CONFLICT (category,record_id,reason) DO NOTHING RETURNING record_id
    ) DELETE FROM ${name} WHERE id IN (SELECT record_id FROM archived)`, [category]);
  }
  return { category, unsupported_verification: Number(missing.rows[0].count), exact_duplicates: Number(count.rows[0].count), applied: apply };
}

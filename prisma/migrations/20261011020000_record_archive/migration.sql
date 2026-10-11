CREATE TABLE "record_archive" (
  "id" SERIAL PRIMARY KEY,
  "category" TEXT NOT NULL,
  "record_id" INTEGER NOT NULL,
  "canonical_id" INTEGER,
  "reason" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "archived_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "record_archive_category_record_id_reason_key"
  ON "record_archive" ("category", "record_id", "reason");
ALTER TABLE "record_archive" ENABLE ROW LEVEL SECURITY;

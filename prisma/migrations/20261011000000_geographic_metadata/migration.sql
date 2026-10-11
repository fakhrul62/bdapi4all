-- Previous schema updates were applied with db push but had no migration.
-- IF NOT EXISTS preserves installations that already have these columns.
ALTER TABLE "divisions"
  ADD COLUMN IF NOT EXISTS "headquarters" TEXT,
  ADD COLUMN IF NOT EXISTS "area" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "population" INTEGER,
  ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "source" TEXT;
ALTER TABLE "districts"
  ADD COLUMN IF NOT EXISTS "headquarters" TEXT,
  ADD COLUMN IF NOT EXISTS "area" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "population" INTEGER,
  ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "source" TEXT;
ALTER TABLE "upazilas"
  ADD COLUMN IF NOT EXISTS "headquarters" TEXT,
  ADD COLUMN IF NOT EXISTS "area" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "population" INTEGER,
  ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "source" TEXT;

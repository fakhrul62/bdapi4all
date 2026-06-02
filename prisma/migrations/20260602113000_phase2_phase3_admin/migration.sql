-- CreateTable
CREATE TABLE "enrichment_runs" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "category" TEXT,
    "processed" INTEGER NOT NULL DEFAULT 0,
    "verified" INTEGER NOT NULL DEFAULT 0,
    "images_found" INTEGER NOT NULL DEFAULT 0,
    "errors" TEXT[],
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),

    CONSTRAINT "enrichment_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "enrichment_runs_status_idx" ON "enrichment_runs"("status");

-- CreateIndex
CREATE INDEX "enrichment_runs_category_idx" ON "enrichment_runs"("category");

-- CreateIndex
CREATE INDEX "enrichment_runs_started_at_idx" ON "enrichment_runs"("started_at");

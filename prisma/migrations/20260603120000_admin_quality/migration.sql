-- CreateTable
CREATE TABLE "admin_activity_logs" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "category" TEXT,
    "record_id" INTEGER,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_quality_issues" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "record_id" INTEGER NOT NULL,
    "issue_type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "data_quality_issues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_activity_logs_action_idx" ON "admin_activity_logs"("action");

-- CreateIndex
CREATE INDEX "admin_activity_logs_category_idx" ON "admin_activity_logs"("category");

-- CreateIndex
CREATE INDEX "admin_activity_logs_created_at_idx" ON "admin_activity_logs"("created_at");

-- CreateIndex
CREATE INDEX "data_quality_issues_category_idx" ON "data_quality_issues"("category");

-- CreateIndex
CREATE INDEX "data_quality_issues_issue_type_idx" ON "data_quality_issues"("issue_type");

-- CreateIndex
CREATE INDEX "data_quality_issues_resolved_idx" ON "data_quality_issues"("resolved");

-- CreateIndex
CREATE UNIQUE INDEX "data_quality_issues_category_record_id_issue_type_key" ON "data_quality_issues"("category", "record_id", "issue_type");

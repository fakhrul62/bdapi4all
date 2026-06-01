-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "divisions" (
    "id" SERIAL NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "divisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "division_id" INTEGER NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upazilas" (
    "id" SERIAL NOT NULL,
    "district_id" INTEGER NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "upazilas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unions" (
    "id" SERIAL NOT NULL,
    "upazila_id" INTEGER NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,

    CONSTRAINT "unions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postcodes" (
    "id" SERIAL NOT NULL,
    "district_id" INTEGER NOT NULL,
    "upazila_id" INTEGER NOT NULL,
    "postcode" TEXT NOT NULL,

    CONSTRAINT "postcodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidays" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "id" SERIAL NOT NULL,
    "currency_code" TEXT NOT NULL,
    "currency_name" TEXT NOT NULL,
    "buying_rate" DOUBLE PRECISION NOT NULL,
    "selling_rate" DOUBLE PRECISION NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_usage_logs" (
    "id" SERIAL NOT NULL,
    "endpoint" TEXT NOT NULL,
    "ip_hash" TEXT NOT NULL,
    "response_time_ms" INTEGER NOT NULL,
    "status_code" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "districts_division_id_idx" ON "districts"("division_id");

-- CreateIndex
CREATE INDEX "upazilas_district_id_idx" ON "upazilas"("district_id");

-- CreateIndex
CREATE INDEX "unions_upazila_id_idx" ON "unions"("upazila_id");

-- CreateIndex
CREATE INDEX "postcodes_district_id_idx" ON "postcodes"("district_id");

-- CreateIndex
CREATE INDEX "postcodes_upazila_id_idx" ON "postcodes"("upazila_id");

-- CreateIndex
CREATE INDEX "postcodes_postcode_idx" ON "postcodes"("postcode");

-- CreateIndex
CREATE INDEX "holidays_date_idx" ON "holidays"("date");

-- CreateIndex
CREATE INDEX "exchange_rates_currency_code_idx" ON "exchange_rates"("currency_code");

-- CreateIndex
CREATE INDEX "exchange_rates_date_idx" ON "exchange_rates"("date");

-- CreateIndex
CREATE UNIQUE INDEX "exchange_rates_currency_code_date_key" ON "exchange_rates"("currency_code", "date");

-- CreateIndex
CREATE INDEX "api_usage_logs_endpoint_idx" ON "api_usage_logs"("endpoint");

-- CreateIndex
CREATE INDEX "api_usage_logs_created_at_idx" ON "api_usage_logs"("created_at");

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "divisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upazilas" ADD CONSTRAINT "upazilas_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unions" ADD CONSTRAINT "unions_upazila_id_fkey" FOREIGN KEY ("upazila_id") REFERENCES "upazilas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "canals" (
    "id" SERIAL NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_bn" TEXT NOT NULL,
    "image_url" TEXT,
    "source" TEXT NOT NULL,
    "source_url" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "needs_image" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "connects" TEXT[],
    "districts" TEXT[],

    CONSTRAINT "canals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "haors" (
    "id" SERIAL NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_bn" TEXT NOT NULL,
    "image_url" TEXT,
    "source" TEXT NOT NULL,
    "source_url" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "needs_image" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "districts" TEXT[],
    "area_sq_km" DOUBLE PRECISION,

    CONSTRAINT "haors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forests" (
    "id" SERIAL NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_bn" TEXT NOT NULL,
    "image_url" TEXT,
    "source" TEXT NOT NULL,
    "source_url" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "needs_image" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "forest_type" TEXT,
    "districts" TEXT[],

    CONSTRAINT "forests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "islands" (
    "id" SERIAL NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_bn" TEXT NOT NULL,
    "image_url" TEXT,
    "source" TEXT NOT NULL,
    "source_url" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "needs_image" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "waterbody" TEXT,
    "districts" TEXT[],

    CONSTRAINT "islands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "canals_name_en_idx" ON "canals"("name_en");

-- CreateIndex
CREATE INDEX "canals_name_bn_idx" ON "canals"("name_bn");

-- CreateIndex
CREATE INDEX "haors_name_en_idx" ON "haors"("name_en");

-- CreateIndex
CREATE INDEX "haors_name_bn_idx" ON "haors"("name_bn");

-- CreateIndex
CREATE INDEX "forests_name_en_idx" ON "forests"("name_en");

-- CreateIndex
CREATE INDEX "forests_name_bn_idx" ON "forests"("name_bn");

-- CreateIndex
CREATE INDEX "islands_name_en_idx" ON "islands"("name_en");

-- CreateIndex
CREATE INDEX "islands_name_bn_idx" ON "islands"("name_bn");

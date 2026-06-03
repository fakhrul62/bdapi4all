-- CreateTable
CREATE TABLE "spices" (
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
    "scientific_name" TEXT,
    "category" TEXT NOT NULL,
    "form" TEXT[],
    "flavor_profile" TEXT[],
    "common_uses" TEXT[],
    "regions_found" TEXT[],
    "is_blend" BOOLEAN NOT NULL DEFAULT false,
    "ingredients" TEXT[],

    CONSTRAINT "spices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "spices_name_en_idx" ON "spices"("name_en");

-- CreateIndex
CREATE INDEX "spices_name_bn_idx" ON "spices"("name_bn");

-- CreateIndex
CREATE INDEX "spices_category_idx" ON "spices"("category");

-- CreateIndex
CREATE INDEX "spices_is_blend_idx" ON "spices"("is_blend");

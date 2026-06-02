-- CreateTable
CREATE TABLE "rivers" (
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
    "length_km" DOUBLE PRECISION,
    "origin" TEXT,
    "flows_through" TEXT[],
    "outflow" TEXT,

    CONSTRAINT "rivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasons" (
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
    "bangla_name" TEXT NOT NULL,
    "months_en" TEXT NOT NULL,
    "months_bn" TEXT NOT NULL,
    "characteristics" TEXT NOT NULL,
    "associated_festivals" TEXT[],
    "crops" TEXT[],

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animals" (
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
    "habitat" TEXT,
    "conservation_status" TEXT,
    "is_national_animal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flowers" (
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
    "blooming_season" TEXT,
    "is_national_flower" BOOLEAN NOT NULL DEFAULT false,
    "fragrance" TEXT,
    "colors" TEXT[],

    CONSTRAINT "flowers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trees" (
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
    "is_national_tree" BOOLEAN NOT NULL DEFAULT false,
    "regions_found" TEXT[],
    "uses" TEXT[],

    CONSTRAINT "trees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festivals" (
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
    "type" TEXT NOT NULL,
    "religion" TEXT,
    "date_or_period" TEXT,
    "traditions" TEXT[],
    "foods" TEXT[],

    CONSTRAINT "festivals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traditional_foods" (
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
    "category" TEXT NOT NULL,
    "region" TEXT,
    "ingredients" TEXT[],

    CONSTRAINT "traditional_foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traditional_clothing" (
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
    "gender" TEXT NOT NULL,
    "occasion" TEXT,
    "region" TEXT,

    CONSTRAINT "traditional_clothing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traditional_music" (
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
    "type" TEXT NOT NULL,
    "instruments" TEXT[],

    CONSTRAINT "traditional_music_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traditional_crafts" (
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
    "region" TEXT,
    "materials" TEXT[],

    CONSTRAINT "traditional_crafts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historical_periods" (
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
    "start_year" INTEGER,
    "end_year" INTEGER,
    "era" TEXT NOT NULL,
    "key_events" TEXT[],

    CONSTRAINT "historical_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historical_events" (
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
    "date" TIMESTAMP(3),
    "year" INTEGER,
    "period_id" INTEGER,
    "category" TEXT NOT NULL,
    "significance" TEXT,

    CONSTRAINT "historical_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historical_places" (
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
    "district_id" INTEGER,
    "period_id" INTEGER,
    "type" TEXT NOT NULL,
    "built_year" INTEGER,
    "built_by" TEXT,

    CONSTRAINT "historical_places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "political_parties" (
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
    "founded_year" INTEGER,
    "founder" TEXT,
    "ideology" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "political_parties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "political_leaders" (
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
    "born" TIMESTAMP(3),
    "died" TIMESTAMP(3),
    "birth_place" TEXT,
    "party_id" INTEGER,
    "role" TEXT NOT NULL,
    "era" TEXT NOT NULL,
    "tenure_start" TIMESTAMP(3),
    "tenure_end" TIMESTAMP(3),
    "achievements" TEXT[],

    CONSTRAINT "political_leaders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authors" (
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
    "born" TIMESTAMP(3),
    "died" TIMESTAMP(3),
    "birth_place" TEXT,
    "genres" TEXT[],
    "era" TEXT NOT NULL,
    "bio_en" TEXT,
    "bio_bn" TEXT,
    "awards" TEXT[],

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
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
    "title_en" TEXT NOT NULL,
    "title_bn" TEXT,
    "author_id" INTEGER NOT NULL,
    "published_year" INTEGER,
    "publisher" TEXT,
    "isbn" TEXT,
    "genre" TEXT NOT NULL,
    "century" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "cover_image_url" TEXT,
    "cover_source" TEXT,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports_categories" (
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
    "type" TEXT NOT NULL,

    CONSTRAINT "sports_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
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
    "born" TIMESTAMP(3),
    "birth_place" TEXT,
    "sport_id" INTEGER NOT NULL,
    "position_or_role" TEXT,
    "national_team" TEXT,
    "active_years" TEXT,
    "career_stats" JSONB,
    "achievements" TEXT[],
    "is_legend" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "national_teams" (
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
    "sport_id" INTEGER NOT NULL,
    "founded_year" INTEGER,
    "governing_body" TEXT,
    "major_achievements" TEXT[],
    "current_ranking" TEXT,

    CONSTRAINT "national_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scientists" (
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
    "born" TIMESTAMP(3),
    "died" TIMESTAMP(3),
    "field" TEXT,
    "institutions" TEXT[],
    "achievements" TEXT[],

    CONSTRAINT "scientists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artists" (
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
    "born" TIMESTAMP(3),
    "died" TIMESTAMP(3),
    "medium" TEXT NOT NULL,
    "notable_works" TEXT[],
    "awards" TEXT[],

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freedom_fighters" (
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
    "born" TIMESTAMP(3),
    "died" TIMESTAMP(3),
    "district" TEXT,
    "role" TEXT,
    "sector" TEXT,
    "awarded_title" TEXT,

    CONSTRAINT "freedom_fighters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rivers_name_en_idx" ON "rivers"("name_en");

-- CreateIndex
CREATE INDEX "rivers_name_bn_idx" ON "rivers"("name_bn");

-- CreateIndex
CREATE INDEX "seasons_name_en_idx" ON "seasons"("name_en");

-- CreateIndex
CREATE INDEX "seasons_name_bn_idx" ON "seasons"("name_bn");

-- CreateIndex
CREATE INDEX "animals_name_en_idx" ON "animals"("name_en");

-- CreateIndex
CREATE INDEX "animals_name_bn_idx" ON "animals"("name_bn");

-- CreateIndex
CREATE INDEX "animals_category_idx" ON "animals"("category");

-- CreateIndex
CREATE INDEX "animals_conservation_status_idx" ON "animals"("conservation_status");

-- CreateIndex
CREATE INDEX "flowers_name_en_idx" ON "flowers"("name_en");

-- CreateIndex
CREATE INDEX "flowers_name_bn_idx" ON "flowers"("name_bn");

-- CreateIndex
CREATE INDEX "trees_name_en_idx" ON "trees"("name_en");

-- CreateIndex
CREATE INDEX "trees_name_bn_idx" ON "trees"("name_bn");

-- CreateIndex
CREATE INDEX "festivals_name_en_idx" ON "festivals"("name_en");

-- CreateIndex
CREATE INDEX "festivals_name_bn_idx" ON "festivals"("name_bn");

-- CreateIndex
CREATE INDEX "festivals_type_idx" ON "festivals"("type");

-- CreateIndex
CREATE INDEX "traditional_foods_name_en_idx" ON "traditional_foods"("name_en");

-- CreateIndex
CREATE INDEX "traditional_foods_name_bn_idx" ON "traditional_foods"("name_bn");

-- CreateIndex
CREATE INDEX "traditional_foods_category_idx" ON "traditional_foods"("category");

-- CreateIndex
CREATE INDEX "traditional_clothing_name_en_idx" ON "traditional_clothing"("name_en");

-- CreateIndex
CREATE INDEX "traditional_clothing_name_bn_idx" ON "traditional_clothing"("name_bn");

-- CreateIndex
CREATE INDEX "traditional_clothing_gender_idx" ON "traditional_clothing"("gender");

-- CreateIndex
CREATE INDEX "traditional_music_name_en_idx" ON "traditional_music"("name_en");

-- CreateIndex
CREATE INDEX "traditional_music_name_bn_idx" ON "traditional_music"("name_bn");

-- CreateIndex
CREATE INDEX "traditional_music_type_idx" ON "traditional_music"("type");

-- CreateIndex
CREATE INDEX "traditional_crafts_name_en_idx" ON "traditional_crafts"("name_en");

-- CreateIndex
CREATE INDEX "traditional_crafts_name_bn_idx" ON "traditional_crafts"("name_bn");

-- CreateIndex
CREATE INDEX "historical_periods_name_en_idx" ON "historical_periods"("name_en");

-- CreateIndex
CREATE INDEX "historical_periods_name_bn_idx" ON "historical_periods"("name_bn");

-- CreateIndex
CREATE INDEX "historical_periods_era_idx" ON "historical_periods"("era");

-- CreateIndex
CREATE INDEX "historical_events_name_en_idx" ON "historical_events"("name_en");

-- CreateIndex
CREATE INDEX "historical_events_name_bn_idx" ON "historical_events"("name_bn");

-- CreateIndex
CREATE INDEX "historical_events_year_idx" ON "historical_events"("year");

-- CreateIndex
CREATE INDEX "historical_events_category_idx" ON "historical_events"("category");

-- CreateIndex
CREATE INDEX "historical_events_period_id_idx" ON "historical_events"("period_id");

-- CreateIndex
CREATE INDEX "historical_places_name_en_idx" ON "historical_places"("name_en");

-- CreateIndex
CREATE INDEX "historical_places_name_bn_idx" ON "historical_places"("name_bn");

-- CreateIndex
CREATE INDEX "historical_places_district_id_idx" ON "historical_places"("district_id");

-- CreateIndex
CREATE INDEX "historical_places_period_id_idx" ON "historical_places"("period_id");

-- CreateIndex
CREATE INDEX "historical_places_type_idx" ON "historical_places"("type");

-- CreateIndex
CREATE INDEX "political_parties_name_en_idx" ON "political_parties"("name_en");

-- CreateIndex
CREATE INDEX "political_parties_name_bn_idx" ON "political_parties"("name_bn");

-- CreateIndex
CREATE INDEX "political_parties_is_active_idx" ON "political_parties"("is_active");

-- CreateIndex
CREATE INDEX "political_leaders_name_en_idx" ON "political_leaders"("name_en");

-- CreateIndex
CREATE INDEX "political_leaders_name_bn_idx" ON "political_leaders"("name_bn");

-- CreateIndex
CREATE INDEX "political_leaders_role_idx" ON "political_leaders"("role");

-- CreateIndex
CREATE INDEX "political_leaders_party_id_idx" ON "political_leaders"("party_id");

-- CreateIndex
CREATE INDEX "political_leaders_era_idx" ON "political_leaders"("era");

-- CreateIndex
CREATE INDEX "authors_name_en_idx" ON "authors"("name_en");

-- CreateIndex
CREATE INDEX "authors_name_bn_idx" ON "authors"("name_bn");

-- CreateIndex
CREATE INDEX "authors_era_idx" ON "authors"("era");

-- CreateIndex
CREATE INDEX "books_name_en_idx" ON "books"("name_en");

-- CreateIndex
CREATE INDEX "books_name_bn_idx" ON "books"("name_bn");

-- CreateIndex
CREATE INDEX "books_author_id_idx" ON "books"("author_id");

-- CreateIndex
CREATE INDEX "books_genre_idx" ON "books"("genre");

-- CreateIndex
CREATE INDEX "books_century_idx" ON "books"("century");

-- CreateIndex
CREATE INDEX "books_language_idx" ON "books"("language");

-- CreateIndex
CREATE INDEX "sports_categories_name_en_idx" ON "sports_categories"("name_en");

-- CreateIndex
CREATE INDEX "sports_categories_name_bn_idx" ON "sports_categories"("name_bn");

-- CreateIndex
CREATE INDEX "sports_categories_type_idx" ON "sports_categories"("type");

-- CreateIndex
CREATE INDEX "players_name_en_idx" ON "players"("name_en");

-- CreateIndex
CREATE INDEX "players_name_bn_idx" ON "players"("name_bn");

-- CreateIndex
CREATE INDEX "players_sport_id_idx" ON "players"("sport_id");

-- CreateIndex
CREATE INDEX "players_is_legend_idx" ON "players"("is_legend");

-- CreateIndex
CREATE INDEX "national_teams_name_en_idx" ON "national_teams"("name_en");

-- CreateIndex
CREATE INDEX "national_teams_name_bn_idx" ON "national_teams"("name_bn");

-- CreateIndex
CREATE INDEX "national_teams_sport_id_idx" ON "national_teams"("sport_id");

-- CreateIndex
CREATE INDEX "scientists_name_en_idx" ON "scientists"("name_en");

-- CreateIndex
CREATE INDEX "scientists_name_bn_idx" ON "scientists"("name_bn");

-- CreateIndex
CREATE INDEX "scientists_field_idx" ON "scientists"("field");

-- CreateIndex
CREATE INDEX "artists_name_en_idx" ON "artists"("name_en");

-- CreateIndex
CREATE INDEX "artists_name_bn_idx" ON "artists"("name_bn");

-- CreateIndex
CREATE INDEX "artists_medium_idx" ON "artists"("medium");

-- CreateIndex
CREATE INDEX "freedom_fighters_name_en_idx" ON "freedom_fighters"("name_en");

-- CreateIndex
CREATE INDEX "freedom_fighters_name_bn_idx" ON "freedom_fighters"("name_bn");

-- CreateIndex
CREATE INDEX "freedom_fighters_district_idx" ON "freedom_fighters"("district");

-- CreateIndex
CREATE INDEX "freedom_fighters_sector_idx" ON "freedom_fighters"("sector");

-- AddForeignKey
ALTER TABLE "historical_events" ADD CONSTRAINT "historical_events_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "historical_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historical_places" ADD CONSTRAINT "historical_places_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historical_places" ADD CONSTRAINT "historical_places_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "historical_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "political_leaders" ADD CONSTRAINT "political_leaders_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "political_parties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "national_teams" ADD CONSTRAINT "national_teams_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

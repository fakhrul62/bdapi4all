-- Enable the pg_trgm extension for fuzzy substring search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN trigram indexes on name_en / name_bn for all encyclopedia + geo tables.
-- These make the "contains" / ILIKE search paths used by /search and
-- /{category}/search scale beyond table-scan performance.
-- GIN indexes cannot be expressed through the Prisma schema, so they live here.

CREATE INDEX IF NOT EXISTS divisions_name_en_trgm_idx ON divisions USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS divisions_name_bn_trgm_idx ON divisions USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS districts_name_en_trgm_idx ON districts USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS districts_name_bn_trgm_idx ON districts USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS upazilas_name_en_trgm_idx ON upazilas USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS upazilas_name_bn_trgm_idx ON upazilas USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS unions_name_en_trgm_idx ON unions USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS unions_name_bn_trgm_idx ON unions USING GIN (name_bn gin_trgm_ops);

CREATE INDEX IF NOT EXISTS rivers_name_en_trgm_idx ON rivers USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS rivers_name_bn_trgm_idx ON rivers USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS canals_name_en_trgm_idx ON canals USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS canals_name_bn_trgm_idx ON canals USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS haors_name_en_trgm_idx ON haors USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS haors_name_bn_trgm_idx ON haors USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS forests_name_en_trgm_idx ON forests USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS forests_name_bn_trgm_idx ON forests USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS islands_name_en_trgm_idx ON islands USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS islands_name_bn_trgm_idx ON islands USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS seasons_name_en_trgm_idx ON seasons USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS seasons_name_bn_trgm_idx ON seasons USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS animals_name_en_trgm_idx ON animals USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS animals_name_bn_trgm_idx ON animals USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS flowers_name_en_trgm_idx ON flowers USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS flowers_name_bn_trgm_idx ON flowers USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS trees_name_en_trgm_idx ON trees USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS trees_name_bn_trgm_idx ON trees USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS festivals_name_en_trgm_idx ON festivals USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS festivals_name_bn_trgm_idx ON festivals USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS traditional_foods_name_en_trgm_idx ON traditional_foods USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS traditional_foods_name_bn_trgm_idx ON traditional_foods USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS spices_name_en_trgm_idx ON spices USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS spices_name_bn_trgm_idx ON spices USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS traditional_clothing_name_en_trgm_idx ON traditional_clothing USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS traditional_clothing_name_bn_trgm_idx ON traditional_clothing USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS traditional_music_name_en_trgm_idx ON traditional_music USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS traditional_music_name_bn_trgm_idx ON traditional_music USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS traditional_crafts_name_en_trgm_idx ON traditional_crafts USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS traditional_crafts_name_bn_trgm_idx ON traditional_crafts USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS historical_periods_name_en_trgm_idx ON historical_periods USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS historical_periods_name_bn_trgm_idx ON historical_periods USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS historical_events_name_en_trgm_idx ON historical_events USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS historical_events_name_bn_trgm_idx ON historical_events USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS historical_places_name_en_trgm_idx ON historical_places USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS historical_places_name_bn_trgm_idx ON historical_places USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS political_parties_name_en_trgm_idx ON political_parties USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS political_parties_name_bn_trgm_idx ON political_parties USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS political_leaders_name_en_trgm_idx ON political_leaders USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS political_leaders_name_bn_trgm_idx ON political_leaders USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS authors_name_en_trgm_idx ON authors USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS authors_name_bn_trgm_idx ON authors USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS books_name_en_trgm_idx ON books USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS books_name_bn_trgm_idx ON books USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS books_title_en_trgm_idx ON books USING GIN (title_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS books_title_bn_trgm_idx ON books USING GIN (title_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS sports_categories_name_en_trgm_idx ON sports_categories USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS sports_categories_name_bn_trgm_idx ON sports_categories USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS players_name_en_trgm_idx ON players USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS players_name_bn_trgm_idx ON players USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS national_teams_name_en_trgm_idx ON national_teams USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS national_teams_name_bn_trgm_idx ON national_teams USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS scientists_name_en_trgm_idx ON scientists USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS scientists_name_bn_trgm_idx ON scientists USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS artists_name_en_trgm_idx ON artists USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS artists_name_bn_trgm_idx ON artists USING GIN (name_bn gin_trgm_ops);
CREATE INDEX IF NOT EXISTS freedom_fighters_name_en_trgm_idx ON freedom_fighters USING GIN (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS freedom_fighters_name_bn_trgm_idx ON freedom_fighters USING GIN (name_bn gin_trgm_ops);

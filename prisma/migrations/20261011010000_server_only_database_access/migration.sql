-- Access is mediated by the server API. Table owners retain PostgreSQL access.
-- No browser-role policies are created: anonymous and authenticated clients
-- cannot bypass admin authentication or API rate limits through Supabase REST.
DO $$
DECLARE table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['divisions', 'districts', 'rivers', 'canals', 'haors', 'forests', 'islands', 'seasons', 'animals', 'flowers', 'trees', 'festivals', 'traditional_foods', 'spices', 'traditional_clothing', 'traditional_music', 'traditional_crafts', 'historical_periods', 'historical_events', 'historical_places', 'political_parties', 'political_leaders', 'authors', 'books', 'sports_categories', 'players', 'national_teams', 'scientists', 'artists', 'freedom_fighters', 'upazilas', 'unions', 'postcodes', 'holidays', 'exchange_rates', 'api_usage_logs', 'api_keys', 'enrichment_runs', 'admin_activity_logs', 'data_quality_issues']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
  END LOOP;
END $$;

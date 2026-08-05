# Data Sources

BDApi4All aggregates public information about Bangladesh from primary and curated sources. Each record in the encyclopedia carries `source` and `source_url` fields so consumers can trace provenance.

## Source Registry

| Source | Type | Used For | Notes |
| ------ | ---- | -------- | ----- |
| [Bangladesh Bureau of Statistics (BBS)](https://bbs.gov.bd) | Government | Divisions, Districts, Upazilas, Unions, Postcodes | Administrative geography and census data |
| [Banglapedia (Asiatic Society of Bangladesh)](https://en.banglapedia.org) | Encyclopedia | Historical places, events, notable people | Editorial overviews and cross-references |
| [Wikipedia](https://en.wikipedia.org) | Encyclopedia | Encyclopedia categories (rivers, foods, people, sports, etc.) | Imported via MediaWiki API; always flagged `verified: false` until source-backed |
| [Bangladesh Bank](https://www.bb.org.bd) | Government | Exchange rates | Daily reference rates via official publications |
| Bangladesh Post Office | Government | Postcodes | 4-digit postal code directory |
| [DPP / IMED](https://imed.portal.gov.bd) | Government | Development projects (future) | Planning & implementation tracking |

## How Verification Works

Each record has three provenance fields:

- `source` — short identifier of the originating source (`wikipedia`, `bbs`, `banglapedia`, `bb`, `postoffice`)
- `source_url` — direct URL to the reference when available
- `verified` — `true` when the record is source-backed and reviewed; `false` for auto-imported candidates

Auto-imported Wikipedia records are intentionally not verified. They are useful for discovery but should be treated as untrusted until confirmed.

## Data Quality Pipeline

1. **Import** — `scripts/search-import-encyclopedia.ts` pulls candidates from Wikipedia search.
2. **Normalize** — `npm run data:normalize` cleans names, dedupes, and standardizes fields.
3. **Enrich** — `npm run data:bn-map` fills Bengali names and cross-table mappings.
4. **Validate** — `npm run data:quality` reports missing names, duplicates, and verified-without-source issues into the `data_quality_issues` table.
5. **Backfill** — `npm run data:backfill-verified` (with `BACKFILL_CONFIRM=yes`) marks records verified when they carry a source and reference URL.

## Scheduled Maintenance

| Job | Schedule | Command / Endpoint |
| --- | -------- | ------------------ |
| Encyclopedia enrichment | daily 02:00 UTC | `/api/cron/encyclopedia-enrichment` |
| Data quality check | daily 01:30 UTC | `/api/cron/data-quality` |
| Exchange rates | daily 06:00 UTC | `/api/cron/exchange-rates` |

## Contributing Data

Open a **Data Correction / Addition** issue using the template. Include the record, the corrected value, and a reliable source link. Verified records with citations are preferred.

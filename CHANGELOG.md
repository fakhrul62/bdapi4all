# Changelog

All notable changes to BDApi4All will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Optional API key authentication with per-key rate limits and usage analytics.
- `X-API-Key` header or `apikey` query parameter support.
- API Keys dashboard at `/dashboard` to issue and revoke keys.
- Admin endpoints for key management (`/api/admin/keys`) and CLI scripts (`keys:issue`, `keys:list`, `keys:revoke`).
- PostgreSQL trigram search indexes for encyclopedia and geo tables.
- Data quality validator and verified backfill scripts.

### Changed
- Removed `request_id` from default JSON API response body while retaining `X-Request-ID` header.
- Added copy and clear controls to the API Explorer response interface.
- Added CI/CD workflows, repo templates, security policy, and contribution guidelines.
- Docker support for self-hosting (Dockerfile, docker-compose, standalone build).

## [0.1.0] - 2026-06-03

### Added
- Geography endpoints: Divisions, Districts, Upazilas, Unions, Postcodes, Geocode.
- Cultural & Nature encyclopedia endpoints: Rivers, Canals, Haors, Forests, Islands, Seasons, Animals, Flowers, Trees, Festivals, Traditional Foods, Spices, Traditional Clothing, Traditional Music, Traditional Crafts.
- History & Politics endpoints: Historical Periods, Historical Events, Historical Places, Political Leaders, Political Parties.
- Literature & Sports endpoints: Authors, Books, Sports Categories, Players, National Teams, Scientists, Artists, Freedom Fighters.
- Utility & Operation endpoints: Prayer Times, Holidays, Exchange Rates, Mobile Operator, Validators, Bengali Digits, Fixtures, GraphQL wrapper, Health check, Metrics, SSE Events.
- API Explorer playground and interactive documentation.

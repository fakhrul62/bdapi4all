# Self-Hosting BDApi4All

BDApi4All can be run on your own infrastructure with Docker. This guide covers a minimal, production-adjacent setup.

## Prerequisites

- Docker Engine 24+ with Docker Compose v2
- A public hostname (for TLS via a reverse proxy like Caddy, Traefik, or Nginx)
- At least 1 GB RAM and a few GB of disk

## Quick Start (development)

```bash
cp .env.example .env.local
docker compose up --build -d
docker compose logs -f app
```

Open http://localhost:3000. The `migrate` service runs `prisma migrate deploy` and a minimal seed on first start.

## Production Deployment

```bash
cp .env.docker.example .env
# Edit .env and set strong POSTGRES_PASSWORD, CRON_SECRET, ADMIN_SECRET
docker compose -f docker-compose.prod.yml up --build -d
```

The production stack contains:

| Service   | Purpose                                        |
| --------- | ---------------------------------------------- |
| `db`      | PostgreSQL 17 (data persisted in a volume)     |
| `migrate` | Applies Prisma migrations, then exits          |
| `app`     | Next.js standalone server (Node, non-root)     |

### Reverse Proxy & TLS

The `app` container exposes port `3000` only on the internal network. Terminate TLS in front of it. Example Caddyfile:

```caddyfile
api.example.com {
    reverse_proxy app:3000
}
```

And in `docker-compose.prod.yml`, uncomment the `caddy` service, mount this `Caddyfile`, and publish `80`/`443`.

### Persisting Data

PostgreSQL data lives in the `db_data` volume. Back it up regularly:

```bash
docker compose -f docker-compose.prod.yml exec db pg_dump -U postgres bdapi4all > backup.sql
```

Restore:

```bash
docker compose -f docker-compose.prod.yml exec -T db psql -U postgres bdapi4all < backup.sql
```

## Rate Limiting Without Redis

If `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are unset, rate limiting falls back to an in-memory sliding window per instance. This is fine for a single-instance deployment; for horizontal scaling, configure Upstash Redis.

## Updating

```bash
git pull
docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml run --rm migrate
```

## Environment Variables

See `.env.example` for the full list. The critical ones:

- `DATABASE_URL` / `DIRECT_URL` — PostgreSQL connection strings
- `CRON_SECRET` / `ADMIN_SECRET` — protect cron and admin routes
- `NEXT_PUBLIC_API_BASE_URL` — public base URL used by docs/playground
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — optional distributed rate limiting

## Troubleshooting

- **App can't reach DB**: ensure `DATABASE_URL` uses the service name `db` (e.g. `postgresql://postgres:pass@db:5432/bdapi4all`), not `localhost`.
- **Migrations not applied**: run the migrate service manually: `docker compose run --rm migrate`.
- **Port 3000 busy**: change `ports` mapping on the `app` service.

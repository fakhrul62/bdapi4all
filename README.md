# BDApi4All

BDApi4All is a free, open-source REST API for Bangladesh. It gives developers one reliable place for Bangladesh divisions, districts, upazilas, unions, prayer times, holidays, exchange rates, mobile operators, validators, and Bengali utility conversions.

The project is built for public use: no API key for basic requests, consistent JSON responses, cached reads, rate limiting, and production deployment on Vercel.

## Stack

- Next.js 16 App Router with TypeScript
- Tailwind CSS v4 and ShadCN-style components
- Supabase PostgreSQL with Prisma 7
- Upstash Redis for caching and rate limiting
- adhan-js for prayer time calculation
- Cheerio for Bangladesh Bank exchange rate scraping
- Vercel Cron for daily exchange-rate imports

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev       # Start local development
npm run build     # Production build
npm run lint      # ESLint
npm run db:push   # Push Prisma schema
npm run db:seed   # Seed Bangladesh geo and holiday data
```

## API Response Format

```json
{
  "success": true,
  "version": "v1",
  "timestamp": "2026-06-02T00:00:00.000Z",
  "data": {}
}
```

Errors use the same envelope with an `error` object and documentation link.

## Deployment

Use Vercel for this app. Add the environment variables from `.env.example`, then deploy. The exchange-rate cron runs daily at `00:00 UTC`, which is `06:00` in Bangladesh.

## License

MIT

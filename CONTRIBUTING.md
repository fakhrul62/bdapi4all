# Contributing to BDApi4All

Thank you for your interest in contributing to **BDApi4All**! This project aims to provide a reliable, open-source REST API for Bangladesh datasets, culture, geography, and public information.

---

## Code of Conduct

Please review and adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md) in all community interactions.

---

## How You Can Contribute

1. **Improve Data Accuracy & Coverage**: Correct Bengali spelling, add missing districts/upazilas/unions, add missing historical/cultural records.
2. **Add Source References**: Connect unverified records to credible sources (e.g. Bangladesh Bureau of Statistics, government portals, official encyclopedias).
3. **Enhance Endpoints**: Optimize queries, add search/filter parameters, improve performance.
4. **Fix Bugs**: Spot an issue? Report it or submit a pull request with a fix.
5. **Expand Documentation**: Improve endpoint guides, add code snippets in client SDKs/languages.

---

## Local Development Setup

### Prerequisites
- Node.js `20.x` or higher
- PostgreSQL database
- (Optional) Upstash Redis for rate limiting (falls back to in-memory in dev)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/fakhrul62/bdapi4all.git
cd bdapi4all

# 2. Install dependencies
npm install

# 3. Environment configuration
cp .env.example .env.local
# Set your DATABASE_URL in .env.local

# 4. Push database schema & generate Prisma client
npm run db:push

# 5. Seed the database
npm run db:seed

# 6. Start the local dev server
npm run dev
```

Visit `http://localhost:3000` to view the site and playground.

---

## Code Standards & Verification

Before submitting a Pull Request, please ensure all checks pass:

```bash
# Linting
npm run lint

# Type Checking
npm run typecheck
```

---

## Submitting Pull Requests

1. Fork the repo and create your feature branch (`git checkout -b feat/add-new-district-data`).
2. Commit changes with a concise message following [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` new feature or endpoint
   - `fix:` bug fix or correction
   - `data:` additions or corrections to encyclopedia/geo datasets
   - `docs:` documentation updates
   - `refactor:` code restructuring without behavior change
3. Push to your branch and open a Pull Request against `main`.
4. Fill out the PR template with a clear description of changes and verification steps.

---

## License

By contributing to BDApi4All, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).

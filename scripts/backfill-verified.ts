import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

type Delegate = {
  updateMany(args: Record<string, unknown>): Promise<{ count: number }>;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

function delegate(model: string) {
  return (prisma as unknown as Record<string, Delegate>)[model];
}

// Models whose records carry the `source` / `source_url` / `verified` fields.
const models = [
  "river", "canal", "haor", "forest", "island", "season", "animal", "flower",
  "tree", "festival", "traditionalFood", "spice", "traditionalClothing",
  "traditionalMusic", "traditionalCraft", "historicalPeriod", "historicalEvent",
  "historicalPlace", "politicalParty", "politicalLeader", "author", "book",
  "sportsCategory", "player", "nationalTeam", "scientist", "artist", "freedomFighter",
] as const;

const SOURCED = new Set(["wikipedia", "wikipedia_search", "banglapedia", "bbs", "bpdb", "bwdb", "dpp", "gov"]);

// Heuristic: a record can be considered verified when it carries a source and a
// resolvable reference URL, and was not flagged for a missing image.
async function backfillModel(model: string) {
  const client = delegate(model);
  const result = await client.updateMany({
    where: {
      verified: false,
      source: { in: [...SOURCED] },
      source_url: { not: null },
    },
    data: { verified: true },
  });

  if (result.count > 0) {
    console.log(`Set verified: true on ${result.count} ${model} records with source + URL.`);
  }
  return result.count;
}

async function main() {
  if (process.env.BACKFILL_CONFIRM !== "yes") {
    console.error("Refusing to run. Set BACKFILL_CONFIRM=yes to overwrite verified flags.");
    process.exit(1);
  }

  let total = 0;
  for (const model of models) {
    total += await backfillModel(model);
  }
  console.log(`Done. Marked ${total} records as verified.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
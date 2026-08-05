import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { redis } from "../src/lib/redis";

config({ path: ".env.local" });
config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Checking DB records count...");
  const canalsCount = await prisma.canal.count();
  const riversCount = await prisma.river.count();
  const haorsCount = await prisma.haor.count();
  const islandsCount = await prisma.island.count();
  const forestsCount = await prisma.forest.count();

  console.log({
    canalsCount,
    riversCount,
    haorsCount,
    islandsCount,
    forestsCount,
  });

  const canals = await prisma.canal.findMany();
  console.log("Remaining canals in DB:", canals);

  if (redis) {
    console.log("Flushing Redis cache...");
    try {
      await redis.flushdb();
      console.log("Redis cache flushed successfully!");
    } catch (err) {
      console.error("Failed to flush redis:", err);
    }
  } else {
    console.log("No redis configured.");
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

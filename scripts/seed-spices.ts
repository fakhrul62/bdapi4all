import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { spices } from "../prisma/spices-seed-data";

config({ path: ".env.local" });
config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = new Set(
    (await prisma.spice.findMany({ select: { name_en: true } })).map((item) => item.name_en.toLowerCase()),
  );
  const data = spices.filter((item) => !existing.has(item.name_en.toLowerCase()));

  if (data.length) {
    await prisma.spice.createMany({ data });
  }

  const total = await prisma.spice.count();
  console.log(`Inserted ${data.length} spices. Total spices: ${total}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

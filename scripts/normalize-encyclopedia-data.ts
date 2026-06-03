import { config } from "dotenv";

config({ path: ".env.local" });
config();

async function main() {
  const [{ normalizeAndAuditData }, { prisma }] = await Promise.all([
    import("../src/lib/data-quality"),
    import("../src/lib/db"),
  ]);
  const category = process.env.DATA_QUALITY_CATEGORY;
  const result = await normalizeAndAuditData(category);
  console.log(JSON.stringify(result, null, 2));
  await prisma.$disconnect();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

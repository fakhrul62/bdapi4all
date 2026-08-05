import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { randomBytes, createHash } from "node:crypto";

config({ path: ".env.local" });
config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

function hashApiKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

// Usage:
//   npm run keys:issue -- --name "My App" [--rate-limit 1000]
//   npm run keys:list
//   npm run keys:revoke -- --id 3
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log("Usage: <issue|list|revoke> [options]");
    process.exit(1);
  }

  if (command === "issue") {
    const nameIndex = args.indexOf("--name");
    const limitIndex = args.indexOf("--rate-limit");
    const name = nameIndex > -1 ? args[nameIndex + 1] : "api-consumer";
    const rateLimit = limitIndex > -1 ? Number(args[limitIndex + 1]) : 100;

    const key = `bdapi_${randomBytes(24).toString("base64url")}`;
    await prisma.apiKey.create({
      data: { key_hash: hashApiKey(key), name, rate_limit: rateLimit },
    });
    console.log("API key created:");
    console.log(`key: ${key}`);
    console.log(`name: ${name}`);
    console.log(`rate_limit: ${rateLimit}`);
  }

  if (command === "list") {
    const keys = await prisma.apiKey.findMany({ orderBy: { created_at: "desc" } });
    console.table(
      keys.map((k) => ({
        id: k.id,
        name: k.name,
        status: k.status,
        rate_limit: k.rate_limit,
        last_used_at: k.last_used_at ?? null,
        created_at: k.created_at,
      })),
    );
  }

  if (command === "revoke") {
    const idIndex = args.indexOf("--id");
    if (idIndex < 0) {
      console.error("Usage: npm run keys:revoke -- --id <id>");
      process.exit(1);
    }
    const id = Number(args[idIndex + 1]);
    await prisma.apiKey.update({
      where: { id },
      data: { status: "revoked" },
    });
    console.log(`Revoked api key id ${id}.`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// Minimal seed for the Docker dev environment.
// Seeds basic geography (divisions + districts) if empty so the API is usable.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const divisions = [
  { name_en: "Dhaka", name_bn: "ঢাকা", lat: 23.8103, lng: 90.4125 },
  { name_en: "Chattogram", name_bn: "চট্টগ্রাম", lat: 22.3569, lng: 91.7832 },
  { name_en: "Rajshahi", name_bn: "রাজশাহী", lat: 24.3745, lng: 88.6042 },
  { name_en: "Khulna", name_bn: "খুলনা", lat: 22.8158, lng: 89.5681 },
  { name_en: "Barishal", name_bn: "বরিশাল", lat: 22.701, lng: 90.3535 },
  { name_en: "Sylhet", name_bn: "সিলেট", lat: 24.8949, lng: 91.8687 },
  { name_en: "Rangpur", name_bn: "রংপুর", lat: 25.7439, lng: 89.2752 },
  { name_en: "Mymensingh", name_bn: "ময়মনসিংহ", lat: 24.7471, lng: 90.4203 },
];

async function main() {
  const count = await prisma.division.count();
  if (count > 0) {
    console.log(`Seeding skipped: ${count} divisions already present.`);
    return;
  }

  for (const division of divisions) {
    await prisma.division.create({ data: division });
  }
  console.log(`Seeded ${divisions.length} divisions.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
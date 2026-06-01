import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import holidays from "../data/holidays.json";

config({ path: ".env.local" });
config();

const GEO_BASE =
  "https://raw.githubusercontent.com/nuhil/bangladesh-geocode/master";

type PhpMyAdminExport<T> = Array<
  | { type: "header"; version: string; comment: string }
  | { type: "database"; name: string }
  | { type: "table"; name: string; database: string; data: T[] }
>;

type DivisionSource = {
  id: string;
  name: string;
  bn_name: string;
};

type DistrictSource = {
  id: string;
  division_id: string;
  name: string;
  bn_name: string;
  lat: string;
  lon: string;
};

type UpazilaSource = {
  id: string;
  district_id: string;
  name: string;
  bn_name: string;
};

type UnionSource = {
  id: string;
  upazilla_id: string;
  name: string;
  bn_name: string;
};

const divisionCoordinates: Record<number, { lat: number; lng: number }> = {
  1: { lat: 22.3569, lng: 91.7832 },
  2: { lat: 24.3745, lng: 88.6042 },
  3: { lat: 22.8456, lng: 89.5403 },
  4: { lat: 22.701, lng: 90.3535 },
  5: { lat: 24.8949, lng: 91.8687 },
  6: { lat: 23.8103, lng: 90.4125 },
  7: { lat: 25.7439, lng: 89.2752 },
  8: { lat: 24.7471, lng: 90.4203 },
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

async function fetchTable<T>(path: string) {
  const response = await fetch(`${GEO_BASE}/${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  const payload = (await response.json()) as PhpMyAdminExport<T>;
  const table = payload.find((item) => item.type === "table") as
    | { type: "table"; data: T[] }
    | undefined;

  if (!table) {
    throw new Error(`No table data found in ${path}`);
  }

  return table.data;
}

async function main() {
  const [divisions, districts, upazilas, unions] = await Promise.all([
    fetchTable<DivisionSource>("divisions/divisions.json"),
    fetchTable<DistrictSource>("districts/districts.json"),
    fetchTable<UpazilaSource>("upazilas/upazilas.json"),
    fetchTable<UnionSource>("unions/unions.json"),
  ]);

  await prisma.union.deleteMany();
  await prisma.upazila.deleteMany();
  await prisma.district.deleteMany();
  await prisma.division.deleteMany();
  await prisma.holiday.deleteMany();

  await prisma.division.createMany({
    data: divisions.map((division) => ({
      id: Number(division.id),
      name_en: division.name === "Chattagram" ? "Chattogram" : division.name,
      name_bn: division.bn_name,
      lat: divisionCoordinates[Number(division.id)]?.lat ?? null,
      lng: divisionCoordinates[Number(division.id)]?.lng ?? null,
    })),
  });

  await prisma.district.createMany({
    data: districts.map((district) => ({
      id: Number(district.id),
      division_id: Number(district.division_id),
      name_en: district.name === "Coxsbazar" ? "Cox's Bazar" : district.name,
      name_bn: district.bn_name,
      lat: Number(district.lat),
      lng: Number(district.lon),
    })),
  });

  await prisma.upazila.createMany({
    data: upazilas.map((upazila) => ({
      id: Number(upazila.id),
      district_id: Number(upazila.district_id),
      name_en: upazila.name,
      name_bn: upazila.bn_name,
      lat: null,
      lng: null,
    })),
  });

  await prisma.union.createMany({
    data: unions.map((union) => ({
      id: Number(union.id),
      upazila_id: Number(union.upazilla_id),
      name_en: union.name,
      name_bn: union.bn_name,
    })),
  });

  await prisma.holiday.createMany({
    data: holidays.map((holiday) => ({
      date: new Date(`${holiday.date}T00:00:00.000Z`),
      name_en: holiday.name_en,
      name_bn: holiday.name_bn,
      type: holiday.type,
    })),
  });

  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('divisions', 'id'), COALESCE((SELECT MAX(id) FROM divisions), 1), true);
    SELECT setval(pg_get_serial_sequence('districts', 'id'), COALESCE((SELECT MAX(id) FROM districts), 1), true);
    SELECT setval(pg_get_serial_sequence('upazilas', 'id'), COALESCE((SELECT MAX(id) FROM upazilas), 1), true);
    SELECT setval(pg_get_serial_sequence('unions', 'id'), COALESCE((SELECT MAX(id) FROM unions), 1), true);
  `);

  console.log(
    `Seeded ${divisions.length} divisions, ${districts.length} districts, ${upazilas.length} upazilas, ${unions.length} unions, and ${holidays.length} holidays.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import holidays from "../data/holidays.json";
import { spices } from "./spices-seed-data";
import {
  animals,
  artists,
  authors,
  books,
  festivals,
  flowers,
  freedomFighters,
  historicalEvents,
  historicalPeriods,
  historicalPlaces,
  nationalTeams,
  players,
  politicalLeaders,
  politicalParties,
  rivers,
  scientists,
  seasons,
  sportsCategories,
  traditionalClothing,
  traditionalCrafts,
  traditionalFoods,
  traditionalMusic,
  trees,
} from "./encyclopedia-seed-data";

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

  await prisma.book.deleteMany();
  await prisma.player.deleteMany();
  await prisma.nationalTeam.deleteMany();
  await prisma.historicalPlace.deleteMany();
  await prisma.historicalEvent.deleteMany();
  await prisma.politicalLeader.deleteMany();
  await prisma.author.deleteMany();
  await prisma.sportsCategory.deleteMany();
  await prisma.historicalPeriod.deleteMany();
  await prisma.politicalParty.deleteMany();
  await prisma.freedomFighter.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.scientist.deleteMany();
  await prisma.traditionalCraft.deleteMany();
  await prisma.traditionalMusic.deleteMany();
  await prisma.traditionalClothing.deleteMany();
  await prisma.spice.deleteMany();
  await prisma.traditionalFood.deleteMany();
  await prisma.festival.deleteMany();
  await prisma.tree.deleteMany();
  await prisma.flower.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.season.deleteMany();
  await prisma.river.deleteMany();
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

  await prisma.river.createMany({ data: rivers });
  await prisma.season.createMany({ data: seasons });
  await prisma.animal.createMany({ data: animals });
  await prisma.flower.createMany({ data: flowers });
  await prisma.tree.createMany({ data: trees });
  await prisma.festival.createMany({ data: festivals });
  await prisma.traditionalFood.createMany({ data: traditionalFoods });
  await prisma.spice.createMany({ data: spices });
  await prisma.traditionalClothing.createMany({ data: traditionalClothing });
  await prisma.traditionalMusic.createMany({ data: traditionalMusic });
  await prisma.traditionalCraft.createMany({ data: traditionalCrafts });
  await prisma.historicalPeriod.createMany({ data: historicalPeriods });
  await prisma.historicalEvent.createMany({ data: historicalEvents });
  await prisma.historicalPlace.createMany({ data: historicalPlaces });
  await prisma.politicalParty.createMany({ data: politicalParties });
  await prisma.politicalLeader.createMany({ data: politicalLeaders });
  await prisma.author.createMany({
    data: authors.map(({ primaryWork, ...author }) => {
      void primaryWork;
      return author;
    }),
  });
  await prisma.book.createMany({ data: books });
  await prisma.sportsCategory.createMany({ data: sportsCategories });
  await prisma.player.createMany({ data: players });
  await prisma.nationalTeam.createMany({ data: nationalTeams });
  await prisma.scientist.createMany({ data: scientists });
  await prisma.artist.createMany({ data: artists });
  await prisma.freedomFighter.createMany({ data: freedomFighters });

  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('divisions', 'id'), COALESCE((SELECT MAX(id) FROM divisions), 1), true);
    SELECT setval(pg_get_serial_sequence('districts', 'id'), COALESCE((SELECT MAX(id) FROM districts), 1), true);
    SELECT setval(pg_get_serial_sequence('upazilas', 'id'), COALESCE((SELECT MAX(id) FROM upazilas), 1), true);
    SELECT setval(pg_get_serial_sequence('unions', 'id'), COALESCE((SELECT MAX(id) FROM unions), 1), true);
    SELECT setval(pg_get_serial_sequence('rivers', 'id'), COALESCE((SELECT MAX(id) FROM rivers), 1), true);
    SELECT setval(pg_get_serial_sequence('seasons', 'id'), COALESCE((SELECT MAX(id) FROM seasons), 1), true);
    SELECT setval(pg_get_serial_sequence('animals', 'id'), COALESCE((SELECT MAX(id) FROM animals), 1), true);
    SELECT setval(pg_get_serial_sequence('flowers', 'id'), COALESCE((SELECT MAX(id) FROM flowers), 1), true);
    SELECT setval(pg_get_serial_sequence('trees', 'id'), COALESCE((SELECT MAX(id) FROM trees), 1), true);
    SELECT setval(pg_get_serial_sequence('festivals', 'id'), COALESCE((SELECT MAX(id) FROM festivals), 1), true);
    SELECT setval(pg_get_serial_sequence('traditional_foods', 'id'), COALESCE((SELECT MAX(id) FROM traditional_foods), 1), true);
    SELECT setval(pg_get_serial_sequence('spices', 'id'), COALESCE((SELECT MAX(id) FROM spices), 1), true);
    SELECT setval(pg_get_serial_sequence('traditional_clothing', 'id'), COALESCE((SELECT MAX(id) FROM traditional_clothing), 1), true);
    SELECT setval(pg_get_serial_sequence('traditional_music', 'id'), COALESCE((SELECT MAX(id) FROM traditional_music), 1), true);
    SELECT setval(pg_get_serial_sequence('traditional_crafts', 'id'), COALESCE((SELECT MAX(id) FROM traditional_crafts), 1), true);
    SELECT setval(pg_get_serial_sequence('historical_periods', 'id'), COALESCE((SELECT MAX(id) FROM historical_periods), 1), true);
    SELECT setval(pg_get_serial_sequence('historical_events', 'id'), COALESCE((SELECT MAX(id) FROM historical_events), 1), true);
    SELECT setval(pg_get_serial_sequence('historical_places', 'id'), COALESCE((SELECT MAX(id) FROM historical_places), 1), true);
    SELECT setval(pg_get_serial_sequence('political_parties', 'id'), COALESCE((SELECT MAX(id) FROM political_parties), 1), true);
    SELECT setval(pg_get_serial_sequence('political_leaders', 'id'), COALESCE((SELECT MAX(id) FROM political_leaders), 1), true);
    SELECT setval(pg_get_serial_sequence('authors', 'id'), COALESCE((SELECT MAX(id) FROM authors), 1), true);
    SELECT setval(pg_get_serial_sequence('books', 'id'), COALESCE((SELECT MAX(id) FROM books), 1), true);
    SELECT setval(pg_get_serial_sequence('sports_categories', 'id'), COALESCE((SELECT MAX(id) FROM sports_categories), 1), true);
    SELECT setval(pg_get_serial_sequence('players', 'id'), COALESCE((SELECT MAX(id) FROM players), 1), true);
    SELECT setval(pg_get_serial_sequence('national_teams', 'id'), COALESCE((SELECT MAX(id) FROM national_teams), 1), true);
    SELECT setval(pg_get_serial_sequence('scientists', 'id'), COALESCE((SELECT MAX(id) FROM scientists), 1), true);
    SELECT setval(pg_get_serial_sequence('artists', 'id'), COALESCE((SELECT MAX(id) FROM artists), 1), true);
    SELECT setval(pg_get_serial_sequence('freedom_fighters', 'id'), COALESCE((SELECT MAX(id) FROM freedom_fighters), 1), true);
  `);

  console.log(
    `Seeded ${divisions.length} divisions, ${districts.length} districts, ${upazilas.length} upazilas, ${unions.length} unions, ${holidays.length} holidays, and ${rivers.length + seasons.length + animals.length + flowers.length + trees.length + festivals.length + traditionalFoods.length + spices.length + traditionalClothing.length + traditionalMusic.length + traditionalCrafts.length + historicalPeriods.length + historicalEvents.length + historicalPlaces.length + politicalParties.length + politicalLeaders.length + authors.length + books.length + sportsCategories.length + players.length + nationalTeams.length + scientists.length + artists.length + freedomFighters.length} encyclopedia records.`,
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

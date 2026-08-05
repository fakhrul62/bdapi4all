import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

// Known river names (lowercase)
const KNOWN_RIVERS = new Set([
  "ganges", "padma", "meghna", "jamuna", "brahmaputra", "teesta", "karnaphuli", "surma", "kushiyara",
  "buriganga", "sangu", "feni", "ariyal khan", "arial khan", "atrai", "dharla", "halda", "karatoya",
  "rupsha", "pashur", "turag", "balu", "shitalakshya", "dhaleshwari", "dhalai", "gumti",
  "bangshi", "barak", "baral", "bhairab", "biskhali", "bishkhali", "baleshwari", "chitra", "dakatia",
  "dhepa", "dolu", "gorai", "haringhata", "ichamati", "jaldhaka", "jhenai", "kangsha",
  "kapotaksha", "kaliganga", "khalishakuri", "kirtankhola", "matamuhuri", "nabaganga",
  "old brahmaputra", "punarbhaba", "someshwari", "titas", "raimangal", "afra river", "andharmanik river",
  "bura gauranga river", "chiknai river", "chiri river", "dhanshiri river", "dhanu river",
  "gabkhan channel", "gorai-madhumati river", "gumani river", "haraboti river", "hariabhanga river",
  "hurasagar river", "ilisha river", "jadukata river", "juri river", "kajibacha river",
  "kakshiyali river", "kalindi river", "kaljani river", "kanchamatia river", "dhankhali river"
]);

function isEventTitle(name: string): boolean {
  const nameLower = name.toLowerCase();
  return /\b(accident|flood|floods|dispute|sinking|crash|massacre|genocide|cyclone|famine|revolution|mutiny|battle|war|protest|movement|pushkaram)\b/i.test(nameLower);
}

function isStructureOrPlaceTitle(name: string): boolean {
  const nameLower = name.toLowerCase();
  return /\b(dam|barrage|hydropower|station|dockyard|port authority|port of|upazila|bridge|fort|palace|temple|mosque|shrine|museum|university|college|hospital|basin|delta|valley|glacier|fan|bay|harbor)\b/i.test(nameLower);
}

function isBookTitle(name: string, desc: string): boolean {
  const nameLower = name.toLowerCase();
  const descLower = desc.toLowerCase();
  if (/\b(bibliography|film|documentary|movie|a walk along)\b/i.test(nameLower)) return true;
  if (/\b(published in|written by|novel by|book by)\b/i.test(descLower) && !/\briver\b/i.test(nameLower)) return true;
  return false;
}

function isPersonTitle(name: string, desc: string): boolean {
  const nameLower = name.toLowerCase();
  const descLower = desc.toLowerCase();
  if (/\b(agha hashar kashmiri)\b/i.test(nameLower)) return true;
  if (/\b(born|died|dramatist|poet|writer|politician|actor|director)\b/i.test(descLower) && !/\briver\b/i.test(nameLower)) return true;
  return false;
}

function isAnimalTitle(name: string): boolean {
  const nameLower = name.toLowerCase();
  return /\b(ganges shark|dolphin)\b/i.test(nameLower);
}

function isTrueRiver(name: string, desc: string): boolean {
  const lowerName = name.toLowerCase().trim();

  // Explicit title exclusions
  if (isEventTitle(name) || isStructureOrPlaceTitle(name) || isBookTitle(name, desc) || isPersonTitle(name, desc) || isAnimalTitle(name)) {
    return false;
  }

  // Known river name match
  if (KNOWN_RIVERS.has(lowerName)) {
    return true;
  }
  for (const known of KNOWN_RIVERS) {
    if (lowerName === known || lowerName.startsWith(known + " ") || lowerName.endsWith(" " + known)) {
      return true;
    }
  }

  // Name contains river indicator
  if (/\b(river|nadi|khal|waterway|stream|tributary|distributary)\b/i.test(lowerName)) {
    return true;
  }

  // Check description explicitly
  if (/\b(is a river|major river|distributary of|tributary of|river in|river flowing|waterway in|transboundary river)\b/i.test(desc)) {
    return true;
  }

  return false;
}

async function cleanRivers() {
  console.log("Cleaning rivers table...");
  const rivers = await prisma.river.findMany();
  let removedCount = 0;
  let keptCount = 0;
  let unverifiedFixes = 0;

  for (const river of rivers) {
    const { id, name_en, description_en, source } = river;
    
    // Fix verified flag for auto-scraped Wikipedia content
    if ((source === "wikipedia" || source === "wikipedia_search") && river.verified) {
      await prisma.river.update({
        where: { id },
        data: { verified: false },
      });
      unverifiedFixes++;
    }

    if (!isTrueRiver(name_en, description_en)) {
      console.log(`[RIVER REMOVAL] ID ${id}: "${name_en}"`);
      await prisma.river.delete({ where: { id } });
      removedCount++;
    } else {
      keptCount++;
    }
  }

  console.log(`Rivers summary: Kept ${keptCount} true rivers, Removed ${removedCount} non-rivers. Fixed ${unverifiedFixes} unverified flags.`);
}

async function cleanCanals() {
  console.log("Cleaning canals table...");
  const canals = await prisma.canal.findMany();
  let removedCount = 0;
  let keptCount = 0;
  for (const canal of canals) {
    const nameLower = canal.name_en.toLowerCase();
    const descLower = canal.description_en.toLowerCase();

    if ((canal.source === "wikipedia" || canal.source === "wikipedia_search") && canal.verified) {
      await prisma.canal.update({ where: { id: canal.id }, data: { verified: false } });
    }

    const isCanal = /\b(canal|khal|channel|ditch|waterway|cut|lock)\b/i.test(nameLower) || /\b(is a canal|engineered waterway|khal in)\b/i.test(descLower);
    if (!isCanal || isEventTitle(canal.name_en) || isStructureOrPlaceTitle(canal.name_en)) {
      console.log(`[CANAL REMOVAL] ID ${canal.id}: "${canal.name_en}"`);
      await prisma.canal.delete({ where: { id: canal.id } });
      removedCount++;
    } else {
      keptCount++;
    }
  }
  console.log(`Canals summary: Kept ${keptCount}, Removed ${removedCount} non-canals.`);
}

async function cleanHaors() {
  console.log("Cleaning haors table...");
  const haors = await prisma.haor.findMany();
  let removedCount = 0;
  let keptCount = 0;
  for (const haor of haors) {
    const nameLower = haor.name_en.toLowerCase();
    const descLower = haor.description_en.toLowerCase();

    if ((haor.source === "wikipedia" || haor.source === "wikipedia_search") && haor.verified) {
      await prisma.haor.update({ where: { id: haor.id }, data: { verified: false } });
    }

    const isHaor = /\b(haor|beel|lake|jheel|wetland|baor|lagoon|marsh|swamp)\b/i.test(nameLower) || /\b(is a haor|wetland in|wetland ecosystem|ramsar site)\b/i.test(descLower);
    if (!isHaor || isEventTitle(haor.name_en) || isStructureOrPlaceTitle(haor.name_en)) {
      console.log(`[HAOR REMOVAL] ID ${haor.id}: "${haor.name_en}"`);
      await prisma.haor.delete({ where: { id: haor.id } });
      removedCount++;
    } else {
      keptCount++;
    }
  }
  console.log(`Haors summary: Kept ${keptCount}, Removed ${removedCount} non-haors.`);
}

async function cleanIslands() {
  console.log("Cleaning islands table...");
  const islands = await prisma.island.findMany();
  let removedCount = 0;
  let keptCount = 0;
  for (const island of islands) {
    const nameLower = island.name_en.toLowerCase();
    const descLower = island.description_en.toLowerCase();

    if ((island.source === "wikipedia" || island.source === "wikipedia_search") && island.verified) {
      await prisma.island.update({ where: { id: island.id }, data: { verified: false } });
    }

    const isIsland = /\b(island|char|dwip|shoal|atoll|reef|archipelago|cay)\b/i.test(nameLower) || /\b(is an island|island in|char in|coastal island|river island)\b/i.test(descLower);
    if (!isIsland || isEventTitle(island.name_en) || isStructureOrPlaceTitle(island.name_en)) {
      console.log(`[ISLAND REMOVAL] ID ${island.id}: "${island.name_en}"`);
      await prisma.island.delete({ where: { id: island.id } });
      removedCount++;
    } else {
      keptCount++;
    }
  }
  console.log(`Islands summary: Kept ${keptCount}, Removed ${removedCount} non-islands.`);
}

async function cleanForests() {
  console.log("Cleaning forests table...");
  const forests = await prisma.forest.findMany();
  let removedCount = 0;
  let keptCount = 0;
  for (const forest of forests) {
    const nameLower = forest.name_en.toLowerCase();
    const descLower = forest.description_en.toLowerCase();

    if ((forest.source === "wikipedia" || forest.source === "wikipedia_search") && forest.verified) {
      await prisma.forest.update({ where: { id: forest.id }, data: { verified: false } });
    }

    const isForest = /\b(forest|national park|sanctuary|reserve|eco park|ecopark|sundarbans|jangal|mangrove|safari park|botanical garden|moist deciduous forests)\b/i.test(nameLower) || /\b(is a forest|protected forest|wildlife sanctuary|national park in|ecopark in)\b/i.test(descLower);
    if (!isForest || isEventTitle(forest.name_en)) {
      console.log(`[FOREST REMOVAL] ID ${forest.id}: "${forest.name_en}"`);
      await prisma.forest.delete({ where: { id: forest.id } });
      removedCount++;
    } else {
      keptCount++;
    }
  }
  console.log(`Forests summary: Kept ${keptCount}, Removed ${removedCount} non-forests.`);
}

async function cleanAllUnverifiedFlags() {
  console.log("Normalizing verified flag across all wikipedia auto-scraped records...");
  const tables = [
    "animal", "flower", "tree", "festival", "traditionalFood", "traditionalClothing",
    "traditionalMusic", "traditionalCraft", "historicalPeriod", "historicalEvent",
    "historicalPlace", "politicalParty", "politicalLeader", "author", "book",
    "sportsCategory", "player", "nationalTeam", "scientist", "artist", "freedomFighter"
  ] as const;

  for (const modelName of tables) {
    const model = (prisma as unknown as Record<string, { updateMany?: (args: unknown) => Promise<{ count: number }> }>)[modelName];
    if (model && typeof model.updateMany === "function") {
      const res = await model.updateMany({
        where: {
          source: { in: ["wikipedia", "wikipedia_search"] },
          verified: true,
        },
        data: { verified: false },
      });
      if (res.count > 0) {
        console.log(`Set verified: false on ${res.count} Wikipedia records in ${modelName}`);
      }
    }
  }
}

async function main() {
  await cleanRivers();
  await cleanCanals();
  await cleanHaors();
  await cleanIslands();
  await cleanForests();
  await cleanAllUnverifiedFlags();
  console.log("Cleanup complete!");
}

main()
  .catch((error) => {
    console.error("Cleanup error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

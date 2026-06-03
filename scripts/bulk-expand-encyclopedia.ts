import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { runEncyclopediaEnrichment } from "../src/lib/encyclopedia-enrichment";

config({ path: ".env.local" });
config();

type PageSeed = {
  title: string;
  extract: string;
  pageUrl: string;
  imageUrl: string | null;
};

type ImportSpec = {
  slug: string;
  model: string;
  categories: string[];
  limit: number;
  makeData: (page: PageSeed) => Record<string, unknown>;
};

type Delegate = {
  findMany(args: Record<string, unknown>): Promise<Array<{ name_en: string }>>;
  create(args: Record<string, unknown>): Promise<unknown>;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

function delegate(model: string) {
  return (prisma as unknown as Record<string, Delegate>)[model];
}

function cleanTitle(title: string) {
  return title
    .replace(/^List of\s+/i, "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function base(page: PageSeed) {
  const name = cleanTitle(page.title);
  return {
    name_en: name,
    name_bn: name,
    description_en: page.extract || `${name} is a Bangladesh encyclopedia record imported from Wikipedia.`,
    description_bn: page.extract || `${name} is a Bangladesh encyclopedia record imported from Wikipedia.`,
    image_url: page.imageUrl,
    source: "wikipedia",
    source_url: page.pageUrl,
    verified: true,
    needs_image: !page.imageUrl,
  };
}

async function fetchJson<T>(url: string) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "BDApi4All/1.0 (https://bdapi4all.vercel.app)",
          Accept: "application/json",
        },
      });
      if (!response.ok) return null;
      return (await response.json()) as T;
    } catch (error) {
      if (attempt === 4) {
        console.warn(`Fetch failed after retries: ${url} (${error instanceof Error ? error.message : "unknown"})`);
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }

  return null;
}

async function getCategoryMembers(category: string, depth = 1) {
  const pages = new Set<string>();
  const subcategories = new Set<string>();
  let cmcontinue: string | undefined;

  do {
    const params = new URLSearchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: `Category:${category}`,
      cmlimit: "500",
      cmnamespace: "0|14",
      format: "json",
      origin: "*",
    });
    if (cmcontinue) params.set("cmcontinue", cmcontinue);

    const payload = await fetchJson<{
      continue?: { cmcontinue?: string };
      query?: { categorymembers?: Array<{ ns: number; title: string }> };
    }>(`https://en.wikipedia.org/w/api.php?${params.toString()}`);

    for (const member of payload?.query?.categorymembers ?? []) {
      if (member.ns === 0 && !/^List of /i.test(member.title)) pages.add(member.title);
      if (member.ns === 14 && depth > 0) subcategories.add(member.title.replace(/^Category:/, ""));
    }

    cmcontinue = payload?.continue?.cmcontinue;
  } while (cmcontinue);

  if (depth > 0) {
    for (const subcategory of Array.from(subcategories).slice(0, 12)) {
      const nested = await getCategoryMembers(subcategory, depth - 1);
      nested.forEach((title) => pages.add(title));
    }
  }

  return pages;
}

async function getSummary(title: string): Promise<PageSeed | null> {
  const payload = await fetchJson<{
    title?: string;
    extract?: string;
    type?: string;
    content_urls?: { desktop?: { page?: string } };
    originalimage?: { source?: string };
    thumbnail?: { source?: string };
  }>(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);

  if (!payload?.content_urls?.desktop?.page || payload.type === "disambiguation") return null;

  return {
    title: payload.title ?? title,
    extract: payload.extract ?? "",
    pageUrl: payload.content_urls.desktop.page,
    imageUrl: payload.originalimage?.source ?? payload.thumbnail?.source ?? null,
  };
}

const specs: ImportSpec[] = [
  {
    slug: "rivers",
    model: "river",
    categories: ["Rivers of Bangladesh", "Distributaries of Bangladesh", "Rivers of Dhaka Division", "Rivers of Sylhet Division"],
    limit: 220,
    makeData: (page) => ({ ...base(page), length_km: null, origin: null, flows_through: [], outflow: null }),
  },
  {
    slug: "canals",
    model: "canal",
    categories: ["Canals in Bangladesh", "Waterways in Bangladesh"],
    limit: 120,
    makeData: (page) => ({ ...base(page), location: null, connects: [], districts: [] }),
  },
  {
    slug: "haors",
    model: "haor",
    categories: ["Haors of Bangladesh", "Wetlands of Bangladesh"],
    limit: 120,
    makeData: (page) => ({ ...base(page), location: null, districts: [], area_sq_km: null }),
  },
  {
    slug: "forests",
    model: "forest",
    categories: ["Forests of Bangladesh", "National parks of Bangladesh", "Wildlife sanctuaries of Bangladesh"],
    limit: 160,
    makeData: (page) => ({ ...base(page), location: null, forest_type: null, districts: [] }),
  },
  {
    slug: "islands",
    model: "island",
    categories: ["Islands of Bangladesh", "Islands of the Bay of Bengal", "River islands of Bangladesh"],
    limit: 160,
    makeData: (page) => ({ ...base(page), location: null, waterbody: null, districts: [] }),
  },
  {
    slug: "animals",
    model: "animal",
    categories: ["Fauna of Bangladesh", "Birds of Bangladesh", "Mammals of Bangladesh", "Reptiles of Bangladesh", "Fish of Bangladesh"],
    limit: 420,
    makeData: (page) => ({ ...base(page), scientific_name: null, category: "wildlife", habitat: null, conservation_status: null, is_national_animal: false }),
  },
  {
    slug: "flowers",
    model: "flower",
    categories: ["Flora of Bangladesh", "Plants of Bangladesh", "Garden plants of Bangladesh"],
    limit: 180,
    makeData: (page) => ({ ...base(page), scientific_name: null, blooming_season: null, is_national_flower: false, fragrance: null, colors: [] }),
  },
  {
    slug: "trees",
    model: "tree",
    categories: ["Trees of Bangladesh", "Flora of Bangladesh", "Mangroves"],
    limit: 220,
    makeData: (page) => ({ ...base(page), scientific_name: null, is_national_tree: false, regions_found: [], uses: [] }),
  },
  {
    slug: "traditional-foods",
    model: "traditionalFood",
    categories: ["Bangladeshi cuisine", "Bengali cuisine", "Bangladeshi desserts", "Bengali sweets"],
    limit: 260,
    makeData: (page) => ({ ...base(page), category: "food", region: null, ingredients: [] }),
  },
  {
    slug: "festivals",
    model: "festival",
    categories: ["Festivals in Bangladesh", "Public holidays in Bangladesh", "Bengali festivals"],
    limit: 160,
    makeData: (page) => ({ ...base(page), type: "cultural", religion: null, date_or_period: null, traditions: [], foods: [] }),
  },
  {
    slug: "historical-places",
    model: "historicalPlace",
    categories: ["Archaeological sites in Bangladesh", "Mosques in Bangladesh", "Hindu temples in Bangladesh", "Tourist attractions in Bangladesh", "World Heritage Sites in Bangladesh"],
    limit: 520,
    makeData: (page) => ({ ...base(page), location: null, district_id: null, period_id: null, type: "historical", built_year: null, built_by: null }),
  },
  {
    slug: "historical-events",
    model: "historicalEvent",
    categories: ["History of Bangladesh", "Bangladesh Liberation War", "Political history of Bangladesh", "Natural disasters in Bangladesh"],
    limit: 260,
    makeData: (page) => ({ ...base(page), date: null, year: null, period_id: null, category: "historical", significance: null }),
  },
  {
    slug: "political-leaders",
    model: "politicalLeader",
    categories: ["Bangladeshi politicians", "Presidents of Bangladesh", "Prime Ministers of Bangladesh", "Government ministers of Bangladesh", "Bangladeshi activists"],
    limit: 650,
    makeData: (page) => ({ ...base(page), born: null, died: null, birth_place: null, party_id: null, role: "politician", era: "modern", tenure_start: null, tenure_end: null, achievements: [] }),
  },
  {
    slug: "political-parties",
    model: "politicalParty",
    categories: ["Political parties in Bangladesh"],
    limit: 180,
    makeData: (page) => ({ ...base(page), founded_year: null, founder: null, ideology: null, is_active: true }),
  },
  {
    slug: "authors",
    model: "author",
    categories: ["Bangladeshi writers", "Bangladeshi poets", "Bangladeshi novelists", "Bangladeshi essayists", "Bengali writers"],
    limit: 850,
    makeData: (page) => ({ ...base(page), born: null, died: null, birth_place: null, genres: ["literature"], era: "contemporary", bio_en: page.extract, bio_bn: page.extract, awards: [] }),
  },
  {
    slug: "books",
    model: "book",
    categories: ["Bangladeshi novels", "Bengali-language novels", "Books about Bangladesh", "Bangladeshi books"],
    limit: 420,
    makeData: (page) => ({ ...base(page), title_en: cleanTitle(page.title), title_bn: cleanTitle(page.title), author_id: 1, published_year: null, publisher: null, isbn: null, genre: "book", century: "unknown", language: "bengali", cover_image_url: page.imageUrl, cover_source: page.imageUrl ? "wikipedia" : null }),
  },
  {
    slug: "players",
    model: "player",
    categories: ["Bangladeshi cricketers", "Bangladeshi footballers", "Bangladeshi kabaddi players", "Bangladeshi chess players", "Bangladeshi archers"],
    limit: 1200,
    makeData: (page) => ({ ...base(page), born: null, birth_place: null, sport_id: 1, position_or_role: null, national_team: null, active_years: null, career_stats: {}, achievements: [], is_legend: false }),
  },
  {
    slug: "national-teams",
    model: "nationalTeam",
    categories: ["Bangladesh national sports teams", "Bangladesh national cricket team", "Bangladesh national football team"],
    limit: 120,
    makeData: (page) => ({ ...base(page), sport_id: 1, founded_year: null, governing_body: null, major_achievements: [], current_ranking: null }),
  },
  {
    slug: "scientists",
    model: "scientist",
    categories: ["Bangladeshi scientists", "Bangladeshi engineers", "Bangladeshi academics"],
    limit: 350,
    makeData: (page) => ({ ...base(page), born: null, died: null, field: null, institutions: [], achievements: [] }),
  },
  {
    slug: "artists",
    model: "artist",
    categories: ["Bangladeshi artists", "Bangladeshi painters", "Bangladeshi sculptors", "Bangladeshi photographers", "Bangladeshi film directors"],
    limit: 520,
    makeData: (page) => ({ ...base(page), born: null, died: null, medium: "art", notable_works: [], awards: [] }),
  },
  {
    slug: "freedom-fighters",
    model: "freedomFighter",
    categories: ["Bangladeshi freedom fighters", "Mukti Bahini personnel", "Bir Sreshtho recipients", "Bir Uttom recipients", "Bir Protik recipients"],
    limit: 550,
    makeData: (page) => ({ ...base(page), born: null, died: null, district: null, role: "freedom_fighter", sector: null, awarded_title: null }),
  },
];

async function importSpec(spec: ImportSpec) {
  const model = delegate(spec.model);
  const existing = new Set(
    (await model.findMany({ select: { name_en: true } })).map((record) => record.name_en.toLowerCase()),
  );
  const titles = new Set<string>();

  for (const category of spec.categories) {
    const members = await getCategoryMembers(category, 1);
    members.forEach((title) => titles.add(title));
  }

  let created = 0;
  let skipped = 0;
  for (const title of Array.from(titles).slice(0, spec.limit)) {
    const clean = cleanTitle(title);
    if (!clean || existing.has(clean.toLowerCase())) {
      skipped += 1;
      continue;
    }

    const summary = await getSummary(title);
    if (!summary) {
      skipped += 1;
      continue;
    }

    await model.create({ data: spec.makeData(summary) });
    existing.add(clean.toLowerCase());
    created += 1;
  }

  return { slug: spec.slug, created, skipped, candidates: titles.size };
}

async function main() {
  const only = new Set(
    (process.env.BULK_ONLY ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
  const selectedSpecs = only.size ? specs.filter((spec) => only.has(spec.slug)) : specs;
  const results = [];
  for (const spec of selectedSpecs) {
    console.log(`Importing ${spec.slug}...`);
    results.push(await importSpec(spec));
  }

  console.table(results);
  if (process.env.RUN_ENRICHMENT === "true") {
    console.log("Running follow-up enrichment for missing images...");
    const enrichment = await runEncyclopediaEnrichment({ limit: 100 });
    console.log(JSON.stringify(enrichment, null, 2));
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

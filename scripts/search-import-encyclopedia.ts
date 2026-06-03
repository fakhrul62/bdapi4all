import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

type PageSeed = {
  title: string;
  extract: string;
  pageUrl: string;
  imageUrl: string | null;
};

type Delegate = {
  findMany(args: Record<string, unknown>): Promise<Array<{ name_en: string }>>;
  create(args: Record<string, unknown>): Promise<unknown>;
};

type SearchSpec = {
  slug: string;
  model: string;
  queries: string[];
  limit: number;
  makeData: (page: PageSeed) => Record<string, unknown>;
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
    description_en: page.extract || `${name} is a Bangladesh encyclopedia record imported from Wikipedia search.`,
    description_bn: page.extract || `${name} is a Bangladesh encyclopedia record imported from Wikipedia search.`,
    image_url: page.imageUrl,
    source: "wikipedia_search",
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
    } catch {
      await new Promise((resolve) => setTimeout(resolve, attempt * 700));
    }
  }

  return null;
}

async function searchTitles(query: string) {
  const titles = new Set<string>();
  let sroffset = 0;

  while (titles.size < 80) {
    const params = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: query,
      srlimit: "50",
      sroffset: String(sroffset),
      format: "json",
      origin: "*",
    });
    const payload = await fetchJson<{
      continue?: { sroffset?: number };
      query?: { search?: Array<{ title: string }> };
    }>(`https://en.wikipedia.org/w/api.php?${params.toString()}`);

    const rows = payload?.query?.search ?? [];
    if (!rows.length) break;
    for (const row of rows) {
      if (!/^List of /i.test(row.title) && !/disambiguation/i.test(row.title)) titles.add(row.title);
    }
    if (payload?.continue?.sroffset == null) break;
    sroffset = payload.continue.sroffset;
  }

  return titles;
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

function includesBangladesh(page: PageSeed) {
  return /\b(Bangladesh|Bangladeshi|Bengal|Bengali|Dhaka|Chittagong|Chattogram|Sylhet|Khulna|Rajshahi|Barisal|Barishal|Rangpur|Mymensingh|Cox's Bazar)\b/i
    .test(`${page.title} ${page.extract}`);
}

const specs: SearchSpec[] = [
  {
    slug: "canals",
    model: "canal",
    queries: ["Bangladesh khal canal", "Dhaka khal", "Chittagong canal Bangladesh", "Bangladesh waterway canal"],
    limit: 90,
    makeData: (page) => ({ ...base(page), location: null, connects: [], districts: [] }),
  },
  {
    slug: "traditional-foods",
    model: "traditionalFood",
    queries: ["Bangladeshi food dish", "Bengali cuisine Bangladesh", "Bangladeshi dessert", "Bangladeshi street food"],
    limit: 220,
    makeData: (page) => ({ ...base(page), category: "food", region: null, ingredients: [] }),
  },
  {
    slug: "books",
    model: "book",
    queries: ["Bangladeshi novel", "Bengali novel Bangladesh", "book about Bangladesh", "Bangladeshi poetry book"],
    limit: 260,
    makeData: (page) => {
      const title = cleanTitle(page.title);
      return {
        ...base(page),
        title_en: title,
        title_bn: title,
        author_id: 1,
        published_year: null,
        publisher: null,
        isbn: null,
        genre: /poem|poetry/i.test(`${title} ${page.extract}`) ? "poetry" : "book",
        century: "unknown",
        language: "bengali",
        cover_image_url: page.imageUrl,
        cover_source: page.imageUrl ? "wikipedia" : null,
      };
    },
  },
  {
    slug: "historical-places",
    model: "historicalPlace",
    queries: ["Bangladesh archaeological site", "Bangladesh historical mosque", "Bangladesh fort palace", "Bangladesh heritage site"],
    limit: 260,
    makeData: (page) => ({ ...base(page), location: null, district_id: null, period_id: null, type: "historical", built_year: null, built_by: null }),
  },
  {
    slug: "islands",
    model: "island",
    queries: ["Bangladesh island", "Bangladesh char island", "Bay of Bengal island Bangladesh"],
    limit: 120,
    makeData: (page) => ({ ...base(page), location: null, waterbody: null, districts: [] }),
  },
  {
    slug: "forests",
    model: "forest",
    queries: ["Bangladesh forest reserve", "Bangladesh national park", "Bangladesh wildlife sanctuary"],
    limit: 140,
    makeData: (page) => ({ ...base(page), location: null, forest_type: null, districts: [] }),
  },
  {
    slug: "players",
    model: "player",
    queries: ["Bangladeshi cricketer", "Bangladeshi footballer", "Bangladeshi chess player", "Bangladeshi athlete"],
    limit: 500,
    makeData: (page) => ({ ...base(page), born: null, birth_place: null, sport_id: 1, position_or_role: null, national_team: null, active_years: null, career_stats: {}, achievements: [], is_legend: false }),
  },
  {
    slug: "political-leaders",
    model: "politicalLeader",
    queries: ["Bangladeshi politician", "Bangladesh mayor politician", "Bangladesh member of parliament", "Bangladeshi activist"],
    limit: 420,
    makeData: (page) => ({ ...base(page), born: null, died: null, birth_place: null, party_id: null, role: "minister", era: "modern", tenure_start: null, tenure_end: null, achievements: [] }),
  },
];

async function importSpec(spec: SearchSpec) {
  const model = delegate(spec.model);
  const existing = new Set(
    (await model.findMany({ select: { name_en: true } })).map((record) => record.name_en.toLowerCase()),
  );
  const titles = new Set<string>();

  for (const query of spec.queries) {
    const found = await searchTitles(query);
    found.forEach((title) => titles.add(title));
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
    if (!summary || !includesBangladesh(summary)) {
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
    (process.env.SEARCH_IMPORT_ONLY ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
  const selected = only.size ? specs.filter((spec) => only.has(spec.slug)) : specs;
  const results = [];
  for (const spec of selected) {
    console.log(`Search importing ${spec.slug}...`);
    results.push(await importSpec(spec));
  }
  console.table(results);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";
import { errorResponse } from "@/lib/response";

type ModelDelegate = {
  count(args: Record<string, unknown>): Promise<number>;
  findMany(args: Record<string, unknown>): Promise<unknown[]>;
  findUnique(args: Record<string, unknown>): Promise<unknown | null>;
};

type FilterType = "integer" | "string" | "boolean" | "sport";

type FilterDefinition = {
  query: string;
  field?: string;
  type: FilterType;
};

export type EncyclopediaCategory = {
  slug: string;
  model: string;
  title: string;
  group: string;
  description: string;
  filters: FilterDefinition[];
  include?: Record<string, unknown>;
};

const baseFilters: FilterDefinition[] = [];

export const encyclopediaCategories: EncyclopediaCategory[] = [
  { slug: "rivers", model: "river", title: "Rivers", group: "Nature", description: "Rivers and waterways of Bangladesh.", filters: baseFilters },
  { slug: "canals", model: "canal", title: "Canals", group: "Nature", description: "Canals and engineered waterways of Bangladesh.", filters: baseFilters },
  { slug: "haors", model: "haor", title: "Haors", group: "Nature", description: "Large wetland basins and haor systems of Bangladesh.", filters: baseFilters },
  { slug: "forests", model: "forest", title: "Forests", group: "Nature", description: "Forests, mangroves, and protected forest areas of Bangladesh.", filters: baseFilters },
  { slug: "islands", model: "island", title: "Islands", group: "Nature", description: "River, coastal, and offshore islands of Bangladesh.", filters: baseFilters },
  { slug: "seasons", model: "season", title: "Seasons", group: "Nature", description: "The six Bangla seasons and their characteristics.", filters: baseFilters },
  { slug: "animals", model: "animal", title: "Animals", group: "Nature", description: "Notable animals, birds, reptiles, fish, and insects of Bangladesh.", filters: [{ query: "category", type: "string" }, { query: "conservation_status", type: "string" }] },
  { slug: "flowers", model: "flower", title: "Flowers", group: "Nature", description: "Flowers and flowering plants associated with Bangladesh.", filters: baseFilters },
  { slug: "trees", model: "tree", title: "Trees", group: "Nature", description: "Trees and plants important to Bangladesh.", filters: baseFilters },
  { slug: "festivals", model: "festival", title: "Festivals", group: "Culture", description: "Religious, cultural, and national festivals.", filters: baseFilters },
  { slug: "traditional-foods", model: "traditionalFood", title: "Traditional Foods", group: "Culture", description: "Traditional foods, sweets, snacks, and drinks.", filters: baseFilters },
  { slug: "traditional-clothing", model: "traditionalClothing", title: "Traditional Clothing", group: "Culture", description: "Traditional garments and textile items.", filters: baseFilters },
  { slug: "traditional-music", model: "traditionalMusic", title: "Traditional Music", group: "Culture", description: "Folk, Baul, Rabindra, Nazrul, and classical music categories.", filters: baseFilters },
  { slug: "traditional-crafts", model: "traditionalCraft", title: "Traditional Crafts", group: "Culture", description: "Craft traditions and regional materials.", filters: baseFilters },
  { slug: "historical-periods", model: "historicalPeriod", title: "Historical Periods", group: "History", description: "Major historical eras in Bengal and Bangladesh.", filters: baseFilters },
  { slug: "historical-events", model: "historicalEvent", title: "Historical Events", group: "History", description: "Major historical events from ancient Bengal to modern Bangladesh.", filters: [{ query: "year", type: "integer" }, { query: "category", type: "string" }, { query: "period_id", type: "integer" }], include: { period: true } },
  { slug: "historical-places", model: "historicalPlace", title: "Historical Places", group: "History", description: "Important monuments, archaeological sites, and heritage places.", filters: baseFilters, include: { district: true, period: true } },
  { slug: "political-leaders", model: "politicalLeader", title: "Political Leaders", group: "Politics", description: "Political leaders from Bengal's historical phases to modern Bangladesh.", filters: [{ query: "role", type: "string" }, { query: "party_id", type: "integer" }, { query: "era", type: "string" }], include: { party: true } },
  { slug: "political-parties", model: "politicalParty", title: "Political Parties", group: "Politics", description: "Major political parties and organizations.", filters: baseFilters },
  { slug: "authors", model: "author", title: "Authors", group: "Literature", description: "Bangladeshi and Bengali literary figures.", filters: [{ query: "genre", field: "genres", type: "string" }, { query: "era", type: "string" }] },
  { slug: "books", model: "book", title: "Books", group: "Literature", description: "Books and literary works connected to seeded authors.", filters: [{ query: "author_id", type: "integer" }, { query: "genre", type: "string" }, { query: "century", type: "string" }, { query: "language", type: "string" }], include: { author: true } },
  { slug: "sports-categories", model: "sportsCategory", title: "Sports Categories", group: "Sports", description: "Sports represented in Bangladesh data.", filters: baseFilters },
  { slug: "players", model: "player", title: "Players", group: "Sports", description: "Major players from cricket, football, kabaddi, archery, and chess.", filters: [{ query: "sport", type: "sport" }, { query: "is_legend", type: "boolean" }], include: { sport: true } },
  { slug: "national-teams", model: "nationalTeam", title: "National Teams", group: "Sports", description: "Bangladesh national teams by sport.", filters: baseFilters, include: { sport: true } },
  { slug: "scientists", model: "scientist", title: "Scientists", group: "Notable People", description: "Scientists, engineers, and researchers connected to Bangladesh.", filters: baseFilters },
  { slug: "artists", model: "artist", title: "Artists", group: "Notable People", description: "Artists and filmmakers connected to Bangladesh.", filters: baseFilters },
  { slug: "freedom-fighters", model: "freedomFighter", title: "Freedom Fighters", group: "Notable People", description: "Freedom fighters and Liberation War figures.", filters: baseFilters },
];

const categoryBySlug = new Map(encyclopediaCategories.map((category) => [category.slug, category]));

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export function getEncyclopediaCategory(slug: string) {
  return categoryBySlug.get(slug);
}

function getDelegate(category: EncyclopediaCategory) {
  return (prisma as unknown as Record<string, ModelDelegate>)[category.model];
}

export function getEncyclopediaDelegate(category: EncyclopediaCategory) {
  return getDelegate(category);
}

function parseBoolean(value: string) {
  if (value === "true") return true;
  if (value === "false") return false;
  throw errorResponse("INVALID_PARAMETER", "Boolean filters must be 'true' or 'false'.", 422);
}

function parseInteger(value: string) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw errorResponse("INVALID_PARAMETER", "Integer filters must be valid whole numbers.", 422);
  }
  return parsed;
}

function buildWhere(category: EncyclopediaCategory, searchParams: URLSearchParams) {
  const where: Record<string, unknown> = {};
  const q = searchParams.get("q")?.trim();

  if (q) {
    where.OR = [
      { name_en: { contains: q, mode: "insensitive" } },
      { name_bn: { contains: q } },
    ];

    if (category.slug === "books") {
      where.OR = [
        ...(where.OR as Array<Record<string, unknown>>),
        { title_en: { contains: q, mode: "insensitive" } },
        { title_bn: { contains: q } },
      ];
    }
  }

  for (const filter of category.filters) {
    const value = searchParams.get(filter.query);
    if (!value) continue;

    const field = filter.field ?? filter.query;
    if (filter.type === "integer") {
      where[field] = parseInteger(value);
    } else if (filter.type === "boolean") {
      where[field] = parseBoolean(value);
    } else if (filter.type === "sport") {
      const sportId = Number(value);
      where[Number.isInteger(sportId) ? "sport_id" : "sport"] = Number.isInteger(sportId)
        ? sportId
        : { name_en: { equals: value, mode: "insensitive" } };
    } else if (field === "genres") {
      where[field] = { has: value };
    } else {
      where[field] = { equals: value, mode: "insensitive" };
    }
  }

  return where;
}

function cacheKey(category: EncyclopediaCategory, suffix: string, searchParams?: URLSearchParams) {
  const query = searchParams?.toString();
  return `encyclopedia:${category.slug}:${suffix}${query ? `:${query}` : ""}`;
}

function notFound(category: EncyclopediaCategory, id: number) {
  return errorResponse(
    "RECORD_NOT_FOUND",
    `${category.title} record with id '${id}' was not found.`,
    404,
    { docsPath: `/docs/${category.slug}` },
  );
}

export async function listEncyclopediaRecords(category: EncyclopediaCategory, request: Request) {
  const url = new URL(request.url);
  const { page, limit } = paginationSchema.parse(Object.fromEntries(url.searchParams));
  const skip = (page - 1) * limit;
  const where = buildWhere(category, url.searchParams);
  const delegate = getDelegate(category);

  return withCache(cacheKey(category, "list", url.searchParams), CACHE_TTL.encyclopedia, async () => {
    const [items, total] = await Promise.all([
      delegate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: "asc" },
        ...(category.include ? { include: category.include } : {}),
      }),
      delegate.count({ where }),
    ]);

    return {
      items,
      meta: {
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
        filters: Object.fromEntries(url.searchParams),
      },
    };
  });
}

export async function getEncyclopediaRecord(category: EncyclopediaCategory, id: number) {
  const delegate = getDelegate(category);
  const { data } = await withCache(cacheKey(category, `detail:${id}`), CACHE_TTL.encyclopedia, async () =>
    delegate.findUnique({
      where: { id },
      ...(category.include ? { include: category.include } : {}),
    }),
  );

  if (!data) {
    throw notFound(category, id);
  }

  return data;
}

export async function searchEncyclopediaRecords(category: EncyclopediaCategory, request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  if (!q) {
    throw errorResponse(
      "MISSING_SEARCH_QUERY",
      "Query parameter 'q' is required.",
      422,
      { docsPath: `/docs/${category.slug}` },
    );
  }

  const { page, limit } = paginationSchema.parse(Object.fromEntries(url.searchParams));
  const skip = (page - 1) * limit;
  const where: Record<string, unknown> = {
    OR: [
      { name_en: { contains: q, mode: "insensitive" } },
      { name_bn: { contains: q } },
    ],
  };

  if (category.slug === "books") {
    where.OR = [
      ...(where.OR as Array<Record<string, unknown>>),
      { title_en: { contains: q, mode: "insensitive" } },
      { title_bn: { contains: q } },
    ];
  }
  const delegate = getDelegate(category);

  return withCache(cacheKey(category, "search", url.searchParams), CACHE_TTL.encyclopedia, async () => {
    const [items, total] = await Promise.all([
      delegate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: "asc" },
        ...(category.include ? { include: category.include } : {}),
      }),
      delegate.count({ where }),
    ]);

    return {
      items,
      meta: {
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
        query: q,
      },
    };
  });
}

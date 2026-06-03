import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import {
  encyclopediaCategories,
  getEncyclopediaCategory,
  getEncyclopediaDelegate,
  type EncyclopediaCategory,
} from "@/lib/encyclopedia";
import { prisma } from "@/lib/db";
import { errorResponse } from "@/lib/response";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

type SearchItem = {
  category: string;
  category_title: string;
  id: number;
  name_en: string;
  name_bn: string | null;
  description_en: string | null;
  image_url: string | null;
  verified: boolean;
  source: string | null;
  source_url: string | null;
};

function parsePagination(searchParams: URLSearchParams) {
  return paginationSchema.parse(Object.fromEntries(searchParams));
}

function normalizeRecord(category: EncyclopediaCategory, record: Record<string, unknown>): SearchItem {
  return {
    category: category.slug,
    category_title: category.title,
    id: Number(record.id),
    name_en: String(record.name_en ?? record.title_en ?? ""),
    name_bn: record.name_bn || record.title_bn ? String(record.name_bn ?? record.title_bn) : null,
    description_en: record.description_en ? String(record.description_en) : null,
    image_url: record.image_url ? String(record.image_url) : null,
    verified: Boolean(record.verified),
    source: record.source ? String(record.source) : null,
    source_url: record.source_url ? String(record.source_url) : null,
  };
}

function searchWhere(category: EncyclopediaCategory, q: string) {
  const where: Record<string, unknown> = {
    OR: [
      { name_en: { contains: q, mode: "insensitive" as const } },
      { name_bn: { contains: q } },
      { description_en: { contains: q, mode: "insensitive" as const } },
    ],
  };

  if (category.slug === "books") {
    where.OR = [
      ...(where.OR as Array<Record<string, unknown>>),
      { title_en: { contains: q, mode: "insensitive" as const } },
      { title_bn: { contains: q } },
    ];
  }

  return where;
}

export async function globalSearch(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  if (!q) {
    throw errorResponse("MISSING_SEARCH_QUERY", "Query parameter 'q' is required.", 422, {
      docsPath: "/docs/search",
    });
  }

  const categoryFilter = url.searchParams.get("category")?.trim();
  const { page, limit } = parsePagination(url.searchParams);
  const categories = categoryFilter
    ? [getEncyclopediaCategory(categoryFilter)].filter(Boolean) as EncyclopediaCategory[]
    : encyclopediaCategories;

  if (!categories.length) {
    throw errorResponse("INVALID_CATEGORY", `Category '${categoryFilter}' was not found.`, 404, {
      docsPath: "/docs/search",
    });
  }

  return withCache(`discovery:search:${url.searchParams.toString()}`, CACHE_TTL.encyclopedia, async () => {
    const perCategoryLimit = Math.min(12, Math.max(3, limit));
    const rows = await Promise.all(
      categories.map(async (category) => {
        const delegate = getEncyclopediaDelegate(category);
        const items = await delegate.findMany({
          where: searchWhere(category, q),
          take: perCategoryLimit,
          orderBy: [{ verified: "desc" }, { id: "asc" }],
          ...(category.include ? { include: category.include } : {}),
        });
        return items.map((item) => normalizeRecord(category, item as Record<string, unknown>));
      }),
    );

    const flattened = rows.flat();
    const start = (page - 1) * limit;
    const items = flattened.slice(start, start + limit);

    return {
      items,
      meta: {
        query: q,
        category: categoryFilter ?? "all",
        pagination: {
          page,
          limit,
          total: flattened.length,
          total_pages: Math.ceil(flattened.length / limit),
        },
      },
    };
  });
}

export async function peopleSearchScoped(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();
  if (!q) {
    throw errorResponse("MISSING_SEARCH_QUERY", "Query parameter 'q' is required.", 422, {
      docsPath: "/docs/people-search",
    });
  }

  const { page, limit } = parsePagination(url.searchParams);
  const peopleCategories = ["authors", "players", "political-leaders", "scientists", "artists", "freedom-fighters"]
    .map((slug) => getEncyclopediaCategory(slug))
    .filter(Boolean) as EncyclopediaCategory[];

  return withCache(`discovery:people:${url.searchParams.toString()}`, CACHE_TTL.encyclopedia, async () => {
    const rows = await Promise.all(
      peopleCategories.map(async (category) => {
        const delegate = getEncyclopediaDelegate(category);
        const items = await delegate.findMany({
          where: searchWhere(category, q),
          take: Math.min(12, Math.max(3, limit)),
          orderBy: [{ verified: "desc" }, { id: "asc" }],
          ...(category.include ? { include: category.include } : {}),
        });
        return items.map((item) => normalizeRecord(category, item as Record<string, unknown>));
      }),
    );
    const flattened = rows.flat();
    const start = (page - 1) * limit;

    return {
      items: flattened.slice(start, start + limit),
      meta: {
        query: q,
        pagination: {
          page,
          limit,
          total: flattened.length,
          total_pages: Math.ceil(flattened.length / limit),
        },
      },
    };
  });
}

export async function listHistoricalPlacesByDistrict(request: Request) {
  const url = new URL(request.url);
  const districtId = url.searchParams.get("district_id");
  const districtName = url.searchParams.get("district")?.trim();
  if (!districtId && !districtName) {
    throw errorResponse("MISSING_PARAMETER", "Provide district_id or district.", 422, {
      docsPath: "/docs/historical-places-by-district",
    });
  }

  const { page, limit } = parsePagination(url.searchParams);
  const skip = (page - 1) * limit;

  return withCache(`discovery:places-by-district:${url.searchParams.toString()}`, CACHE_TTL.encyclopedia, async () => {
    const district = districtId
      ? await prisma.district.findUnique({ where: { id: Number(districtId) } })
      : districtName
        ? await prisma.district.findFirst({ where: { name_en: { equals: districtName, mode: "insensitive" as const } } })
        : null;

    if (!district) {
      return {
        items: [],
        meta: {
          pagination: { page, limit, total: 0, total_pages: 0 },
          district: districtName ?? districtId,
        },
      };
    }

    const where = {
      OR: [
        { district_id: district.id },
        { location: { contains: district.name_en, mode: "insensitive" as const } },
        { description_en: { contains: district.name_en, mode: "insensitive" as const } },
      ],
    };
    const [items, total] = await Promise.all([
      prisma.historicalPlace.findMany({
        where,
        include: { district: true, period: true },
        orderBy: [{ verified: "desc" }, { id: "asc" }],
        skip,
        take: limit,
      }),
      prisma.historicalPlace.count({ where }),
    ]);

    return {
      items,
      meta: {
        district: { id: district.id, name_en: district.name_en, name_bn: district.name_bn },
        pagination: { page, limit, total, total_pages: Math.ceil(total / limit) },
      },
    };
  });
}

export async function listRiversByDistrict(request: Request) {
  const url = new URL(request.url);
  const district = url.searchParams.get("district")?.trim();
  if (!district) {
    throw errorResponse("MISSING_PARAMETER", "Query parameter 'district' is required.", 422, {
      docsPath: "/docs/rivers-by-district",
    });
  }

  const { page, limit } = parsePagination(url.searchParams);
  const skip = (page - 1) * limit;
  const where = {
    OR: [
      { flows_through: { has: district } },
      { description_en: { contains: district, mode: "insensitive" as const } },
      { origin: { contains: district, mode: "insensitive" as const } },
      { outflow: { contains: district, mode: "insensitive" as const } },
    ],
  };

  return withCache(`discovery:rivers-by-district:${url.searchParams.toString()}`, CACHE_TTL.encyclopedia, async () => {
    const [items, total] = await Promise.all([
      prisma.river.findMany({ where, orderBy: [{ verified: "desc" }, { id: "asc" }], skip, take: limit }),
      prisma.river.count({ where }),
    ]);
    return {
      items,
      meta: {
        district,
        pagination: { page, limit, total, total_pages: Math.ceil(total / limit) },
      },
    };
  });
}

export async function listFoodsByRegion(request: Request) {
  const url = new URL(request.url);
  const region = url.searchParams.get("region")?.trim();
  if (!region) {
    throw errorResponse("MISSING_PARAMETER", "Query parameter 'region' is required.", 422, {
      docsPath: "/docs/foods-by-region",
    });
  }

  const { page, limit } = parsePagination(url.searchParams);
  const skip = (page - 1) * limit;
  const where = {
    OR: [
      { region: { contains: region, mode: "insensitive" as const } },
      { description_en: { contains: region, mode: "insensitive" as const } },
    ],
  };

  return withCache(`discovery:foods-by-region:${url.searchParams.toString()}`, CACHE_TTL.encyclopedia, async () => {
    const [items, total] = await Promise.all([
      prisma.traditionalFood.findMany({ where, orderBy: [{ verified: "desc" }, { id: "asc" }], skip, take: limit }),
      prisma.traditionalFood.count({ where }),
    ]);
    return {
      items,
      meta: {
        region,
        pagination: { page, limit, total, total_pages: Math.ceil(total / limit) },
      },
    };
  });
}

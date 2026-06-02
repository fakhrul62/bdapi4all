import { prisma } from "@/lib/db";
import { encyclopediaCategories, getEncyclopediaCategory } from "@/lib/encyclopedia";

type ModelDelegate = {
  findMany(args: Record<string, unknown>): Promise<Array<Record<string, unknown>>>;
  update(args: Record<string, unknown>): Promise<unknown>;
};

type EnrichmentMatch = {
  source: string;
  source_url: string;
  image_url?: string | null;
  description_en?: string;
};

type EnrichmentStats = {
  processed: number;
  verified: number;
  images_found: number;
  errors: string[];
};

function delegate(model: string) {
  return (prisma as unknown as Record<string, ModelDelegate>)[model];
}

function normalizeTitle(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/[’']/g, "'")
    .trim();
}

function wikipediaTitle(record: Record<string, unknown>) {
  const title = String(record.title_en ?? record.name_en ?? "");
  const hints = [
    `${title} Bangladesh`,
    title,
  ];
  return hints.map(normalizeTitle).filter(Boolean);
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "BDApi4All/1.0 (https://bdapi4all.vercel.app)",
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as T;
}

async function findWikipediaMatch(record: Record<string, unknown>): Promise<EnrichmentMatch | null> {
  for (const title of wikipediaTitle(record)) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const payload = await fetchJson<{
      title?: string;
      content_urls?: { desktop?: { page?: string } };
      originalimage?: { source?: string };
      thumbnail?: { source?: string };
      extract?: string;
      type?: string;
    }>(url);

    if (!payload || payload.type === "disambiguation" || !payload.content_urls?.desktop?.page) {
      continue;
    }

    const expected = String(record.title_en ?? record.name_en ?? "").toLowerCase();
    const actual = String(payload.title ?? "").toLowerCase();
    const extract = String(payload.extract ?? "").toLowerCase();
    if (!actual.includes(expected.split(" ")[0]) && !extract.includes("bangladesh") && !extract.includes("bengal")) {
      continue;
    }

    return {
      source: "wikipedia",
      source_url: payload.content_urls.desktop.page,
      image_url: payload.originalimage?.source ?? payload.thumbnail?.source ?? null,
      description_en: payload.extract,
    };
  }

  return null;
}

async function findOpenLibraryMatch(record: Record<string, unknown>): Promise<EnrichmentMatch | null> {
  const title = String(record.title_en ?? record.name_en ?? "");
  if (!title) return null;

  const payload = await fetchJson<{
    docs?: Array<{
      key?: string;
      title?: string;
      cover_i?: number;
      first_publish_year?: number;
    }>;
  }>(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`);

  const doc = payload?.docs?.[0];
  if (!doc?.key) return null;

  return {
    source: "open_library",
    source_url: `https://openlibrary.org${doc.key}`,
    image_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
  };
}

async function findGoogleBooksMatch(record: Record<string, unknown>): Promise<EnrichmentMatch | null> {
  const title = String(record.title_en ?? record.name_en ?? "");
  if (!title) return null;

  const payload = await fetchJson<{
    items?: Array<{
      volumeInfo?: {
        infoLink?: string;
        imageLinks?: { thumbnail?: string };
        description?: string;
      };
    }>;
  }>(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}&maxResults=1`);

  const item = payload?.items?.[0]?.volumeInfo;
  if (!item?.infoLink) return null;

  return {
    source: "google_books",
    source_url: item.infoLink,
    image_url: item.imageLinks?.thumbnail?.replace(/^http:/, "https:") ?? null,
    description_en: item.description,
  };
}

async function findMatch(categorySlug: string, record: Record<string, unknown>) {
  if (categorySlug === "books") {
    return (await findOpenLibraryMatch(record)) ?? (await findGoogleBooksMatch(record)) ?? (await findWikipediaMatch(record));
  }

  return findWikipediaMatch(record);
}

function updatePayload(categorySlug: string, record: Record<string, unknown>, match: EnrichmentMatch) {
  const imageUrl = match.image_url ?? null;
  const payload: Record<string, unknown> = {
    source: match.source,
    source_url: match.source_url,
    verified: true,
    needs_image: !imageUrl,
  };

  if (imageUrl) {
    payload.image_url = imageUrl;
  }

  if (match.description_en && typeof record.description_en === "string" && record.description_en.length < 140) {
    payload.description_en = match.description_en.slice(0, 800);
  }

  if (categorySlug === "books" && imageUrl) {
    payload.cover_image_url = imageUrl;
    payload.cover_source = match.source;
  }

  return payload;
}

export async function runEncyclopediaEnrichment(options?: {
  category?: string;
  limit?: number;
}) {
  const categories = options?.category
    ? [getEncyclopediaCategory(options.category)].filter(Boolean)
    : encyclopediaCategories;
  const limit = Math.min(Math.max(options?.limit ?? 25, 1), 100);

  const run = await prisma.enrichmentRun.create({
    data: {
      status: "running",
      category: options?.category ?? null,
      errors: [],
    },
  });
  const stats: EnrichmentStats = { processed: 0, verified: 0, images_found: 0, errors: [] };

  try {
    for (const category of categories) {
      if (!category) continue;
      const model = delegate(category.model);
      const records = await model.findMany({
        where: { OR: [{ verified: false }, { source: "ai_generated" }, { needs_image: true }] },
        orderBy: [{ verified: "asc" }, { needs_image: "desc" }, { id: "asc" }],
        take: limit,
      });

      for (const record of records) {
        stats.processed += 1;
        try {
          const match = await findMatch(category.slug, record);
          if (!match?.source_url) continue;

          await model.update({
            where: { id: record.id },
            data: updatePayload(category.slug, record, match),
          });
          stats.verified += 1;
          if (match.image_url) stats.images_found += 1;
        } catch (error) {
          stats.errors.push(`${category.slug}:${record.id}:${error instanceof Error ? error.message : "unknown error"}`);
        }
      }
    }

    await prisma.enrichmentRun.update({
      where: { id: run.id },
      data: {
        status: "completed",
        processed: stats.processed,
        verified: stats.verified,
        images_found: stats.images_found,
        errors: stats.errors,
        finished_at: new Date(),
      },
    });
  } catch (error) {
    stats.errors.push(error instanceof Error ? error.message : "unknown enrichment failure");
    await prisma.enrichmentRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        processed: stats.processed,
        verified: stats.verified,
        images_found: stats.images_found,
        errors: stats.errors,
        finished_at: new Date(),
      },
    });
  }

  return { run_id: run.id, ...stats };
}


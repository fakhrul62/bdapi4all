import { z } from "zod";
import { CACHE_TTL, withCache } from "@/lib/cache";
import { prisma } from "@/lib/db";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const authorIdSchema = z.object({
  author_id: z.coerce.number().int().positive(),
});

export const categorySchema = z.object({
  category: z.string().min(1),
});

export function parsePagination(searchParams: URLSearchParams) {
  return paginationSchema.parse(Object.fromEntries(searchParams));
}

export async function listBooksByWhere(
  cachePrefix: string,
  request: Request,
  where: Record<string, unknown>,
) {
  const url = new URL(request.url);
  const { page, limit } = parsePagination(url.searchParams);
  const skip = (page - 1) * limit;
  const key = `books:${cachePrefix}:${url.searchParams.toString()}`;

  return withCache(key, CACHE_TTL.encyclopedia, async () => {
    const [items, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: { author: true },
        orderBy: { id: "asc" },
        skip,
        take: limit,
      }),
      prisma.book.count({ where }),
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
      },
    };
  });
}

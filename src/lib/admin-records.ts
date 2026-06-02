import { z } from "zod";
import { prisma } from "@/lib/db";
import { encyclopediaCategories, getEncyclopediaCategory } from "@/lib/encyclopedia";

type ModelDelegate = {
  count(args: Record<string, unknown>): Promise<number>;
  findMany(args: Record<string, unknown>): Promise<Array<Record<string, unknown>>>;
  findUnique(args: Record<string, unknown>): Promise<Record<string, unknown> | null>;
  update(args: Record<string, unknown>): Promise<Record<string, unknown>>;
};

function delegate(model: string) {
  return (prisma as unknown as Record<string, ModelDelegate>)[model];
}

export const adminRecordUpdateSchema = z.object({
  name_en: z.string().min(1).optional(),
  name_bn: z.string().min(1).optional(),
  description_en: z.string().min(1).optional(),
  description_bn: z.string().min(1).optional(),
  image_url: z.string().url().nullable().optional(),
  source: z.string().min(1).optional(),
  source_url: z.string().url().nullable().optional(),
  verified: z.boolean().optional(),
  needs_image: z.boolean().optional(),
});

export function adminCategories() {
  return encyclopediaCategories.map((category) => ({
    slug: category.slug,
    title: category.title,
    group: category.group,
    description: category.description,
  }));
}

export async function adminListRecords(options: {
  categorySlug: string;
  page: number;
  limit: number;
  status?: "all" | "verified" | "unverified" | "needs_image";
  q?: string;
}) {
  const category = getEncyclopediaCategory(options.categorySlug);
  if (!category) throw new Response("Unknown category", { status: 404 });

  const where: Record<string, unknown> = {};
  if (options.status === "verified") where.verified = true;
  if (options.status === "unverified") where.verified = false;
  if (options.status === "needs_image") where.needs_image = true;
  if (options.q) {
    where.OR = [
      { name_en: { contains: options.q, mode: "insensitive" } },
      { name_bn: { contains: options.q } },
    ];
  }

  const model = delegate(category.model);
  const skip = (options.page - 1) * options.limit;
  const [records, total] = await Promise.all([
    model.findMany({
      where,
      orderBy: [{ verified: "asc" }, { needs_image: "desc" }, { id: "asc" }],
      skip,
      take: options.limit,
    }),
    model.count({ where }),
  ]);

  return {
    category,
    records,
    meta: {
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        total_pages: Math.ceil(total / options.limit),
      },
      status: options.status ?? "all",
      q: options.q ?? "",
    },
  };
}

export async function adminUpdateRecord(categorySlug: string, id: number, payload: unknown) {
  const category = getEncyclopediaCategory(categorySlug);
  if (!category) throw new Response("Unknown category", { status: 404 });

  const data = adminRecordUpdateSchema.parse(payload);
  const model = delegate(category.model);
  const current = await model.findUnique({ where: { id } });
  if (!current) throw new Response("Record not found", { status: 404 });

  if (Object.prototype.hasOwnProperty.call(data, "image_url")) {
    data.needs_image = !data.image_url;
  }

  return model.update({ where: { id }, data });
}

export async function adminSummary() {
  const rows = await Promise.all(
    encyclopediaCategories.map(async (category) => {
      const model = delegate(category.model);
      const [total, verified, needsImage] = await Promise.all([
        model.count({}),
        model.count({ where: { verified: true } }),
        model.count({ where: { needs_image: true } }),
      ]);
      return {
        slug: category.slug,
        title: category.title,
        group: category.group,
        total,
        verified,
        unverified: total - verified,
        needs_image: needsImage,
      };
    }),
  );

  return rows;
}

export async function adminRecentRuns() {
  return prisma.enrichmentRun.findMany({
    orderBy: { started_at: "desc" },
    take: 10,
  });
}


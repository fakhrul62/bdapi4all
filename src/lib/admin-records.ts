import { z } from "zod";
import { prisma } from "@/lib/db";
import { encyclopediaCategories, getEncyclopediaCategory } from "@/lib/encyclopedia";

type ModelDelegate = {
  count(args: Record<string, unknown>): Promise<number>;
  findMany(args: Record<string, unknown>): Promise<Array<Record<string, unknown>>>;
  findUnique(args: Record<string, unknown>): Promise<Record<string, unknown> | null>;
  update(args: Record<string, unknown>): Promise<Record<string, unknown>>;
  updateMany(args: Record<string, unknown>): Promise<{ count: number }>;
  delete(args: Record<string, unknown>): Promise<Record<string, unknown>>;
};

function delegate(model: string) {
  return (prisma as unknown as Record<string, ModelDelegate>)[model];
}

type ActivityDelegate = {
  create(args: Record<string, unknown>): Promise<unknown>;
  findMany(args: Record<string, unknown>): Promise<Array<Record<string, unknown>>>;
};

function activityDelegate() {
  return (prisma as unknown as { adminActivityLog: ActivityDelegate }).adminActivityLog;
}

async function logAdminActivity(args: {
  action: string;
  category?: string;
  recordId?: number;
  details?: Record<string, unknown>;
}) {
  try {
    await activityDelegate().create({
      data: {
        action: args.action,
        category: args.category,
        record_id: args.recordId,
        details: args.details ?? {},
      },
    });
  } catch {
    // Admin logs are useful audit data, but they should not block moderation work.
  }
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

  const updated = await model.update({ where: { id }, data });
  await logAdminActivity({
    action: "record.update",
    category: category.slug,
    recordId: id,
    details: { fields: Object.keys(data) },
  });
  return updated;
}

export async function adminDeleteRecord(categorySlug: string, id: number) {
  const category = getEncyclopediaCategory(categorySlug);
  if (!category) throw new Response("Unknown category", { status: 404 });

  const model = delegate(category.model);
  const current = await model.findUnique({ where: { id } });
  if (!current) throw new Response("Record not found", { status: 404 });

  const deleted = await model.delete({ where: { id } });
  await logAdminActivity({
    action: "record.delete",
    category: category.slug,
    recordId: id,
    details: { name_en: current.name_en ?? current.title_en },
  });
  return deleted;
}

const bulkActionSchema = z.object({
  category: z.string().min(1),
  ids: z.array(z.coerce.number().int().positive()).min(1).max(500),
  action: z.enum(["verify", "unverify", "mark_needs_image", "clear_needs_image"]),
});

export async function adminBulkUpdate(payload: unknown) {
  const input = bulkActionSchema.parse(payload);
  const category = getEncyclopediaCategory(input.category);
  if (!category) throw new Response("Unknown category", { status: 404 });

  const data =
    input.action === "verify"
      ? { verified: true }
      : input.action === "unverify"
        ? { verified: false }
        : input.action === "mark_needs_image"
          ? { needs_image: true }
          : { needs_image: false };

  const model = delegate(category.model);
  const result = await model.updateMany({
    where: { id: { in: input.ids } },
    data,
  });
  await logAdminActivity({
    action: `record.bulk.${input.action}`,
    category: category.slug,
    details: { ids: input.ids, count: result.count },
  });
  return { category: category.slug, action: input.action, count: result.count };
}

export async function adminExportRecords(categorySlug: string, format: "json" | "csv") {
  const category = getEncyclopediaCategory(categorySlug);
  if (!category) throw new Response("Unknown category", { status: 404 });

  const records = await delegate(category.model).findMany({
    orderBy: { id: "asc" },
  });
  await logAdminActivity({
    action: "record.export",
    category: category.slug,
    details: { format, count: records.length },
  });

  if (format === "json") return { category, body: JSON.stringify(records, null, 2), contentType: "application/json" };

  const keys = Array.from(new Set(records.flatMap((record) => Object.keys(record))));
  const escape = (value: unknown) => {
    if (value == null) return "";
    const stringValue = Array.isArray(value) || typeof value === "object" ? JSON.stringify(value) : String(value);
    return `"${stringValue.replaceAll('"', '""')}"`;
  };
  const body = [keys.join(","), ...records.map((record) => keys.map((key) => escape(record[key])).join(","))].join("\n");
  return { category, body, contentType: "text/csv" };
}

export async function adminDuplicateRecords(categorySlug: string) {
  const category = getEncyclopediaCategory(categorySlug);
  if (!category) throw new Response("Unknown category", { status: 404 });

  const records = await delegate(category.model).findMany({
    orderBy: { id: "asc" },
  });
  const groups = new Map<string, Array<Record<string, unknown>>>();
  for (const record of records) {
    const name = String(record.name_en ?? record.title_en ?? "").trim().toLowerCase();
    if (!name) continue;
    const existing = groups.get(name) ?? [];
    existing.push(record);
    groups.set(name, existing);
  }

  return Array.from(groups.entries())
    .filter(([, items]) => items.length > 1)
    .map(([name, items]) => ({
      name,
      count: items.length,
      records: items.map((item) => ({
        id: item.id,
        name_en: item.name_en ?? item.title_en,
        verified: item.verified,
        source: item.source,
        source_url: item.source_url,
      })),
    }));
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

export async function adminRecentActivity() {
  try {
    return activityDelegate().findMany({
      orderBy: { created_at: "desc" },
      take: 20,
    });
  } catch {
    return [];
  }
}

export async function adminQualitySummary() {
  try {
    const rows = await (prisma as unknown as {
      dataQualityIssue: {
        groupBy(args: Record<string, unknown>): Promise<Array<{ category: string; _count: { _all: number } }>>;
      };
    }).dataQualityIssue.groupBy({
      by: ["category"],
      where: { resolved: false },
      _count: { _all: true },
      orderBy: { category: "asc" },
    });
    return rows.map((row) => ({ category: row.category, open_issues: row._count._all }));
  } catch {
    return [];
  }
}

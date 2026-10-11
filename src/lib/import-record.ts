import type { PrismaClient } from "@prisma/client";

type Delegate = { findFirst(args: unknown): Promise<unknown>; create(args: unknown): Promise<unknown> };
/** Check the returned canonical title, not the title that Wikipedia redirected. */
export async function createImportedRecord(prisma: PrismaClient, model: string, data: Record<string, unknown>) {
  const name = String(data.name_en ?? "").trim();
  if (!name) throw new Error("An imported record must have a canonical name.");
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtextextended(${model + ":" + name.toLowerCase()}, 0))`;
    const delegate = (tx as unknown as Record<string, Delegate>)[model];
    const existing = await delegate.findFirst({ where: { OR: [
      { name_en: { equals: name, mode: "insensitive" } },
      ...(typeof data.source_url === "string" && data.source_url ? [{ source_url: data.source_url }] : []),
    ] } });
    if (existing) return false;
    await delegate.create({ data: { ...data, name_en: name } });
    return true;
  });
}

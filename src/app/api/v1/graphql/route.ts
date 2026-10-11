import { prisma } from "@/lib/db";
import { getEncyclopediaCategory, encyclopediaCategories } from "@/lib/encyclopedia";

export const runtime = "nodejs";

import { parseReadQuery, projectGraphQL, QueryError, type ReadField } from "@/lib/graphql-query";
import { handleApi } from "@/lib/api-handler";
import { optionsResponse } from "@/lib/response";
import { z } from "zod";

async function resolveField(field: ReadField): Promise<unknown> {
  const name = field.name;
  const args = field.arguments;

  if (name === "divisions") {
    return prisma.division.findMany({ take: Number(args.limit ?? 100) });
  }
  if (name === "division" && args.id) {
    return prisma.division.findUnique({ where: { id: Number(args.id) } });
  }
  if (name === "districts") {
    return prisma.district.findMany({
      where: args.division_id ? { division_id: Number(args.division_id) } : undefined,
      take: Number(args.limit ?? 100),
    });
  }
  if (name === "district" && args.id) {
    return prisma.district.findUnique({ where: { id: Number(args.id) } });
  }
  if (name === "upazilas") {
    return prisma.upazila.findMany({
      where: args.district_id ? { district_id: Number(args.district_id) } : undefined,
      take: Number(args.limit ?? 100),
    });
  }
  if (name === "upazila" && args.id) {
    return prisma.upazila.findUnique({ where: { id: Number(args.id) } });
  }
  if (name === "unions") {
    return prisma.union.findMany({
      where: args.upazila_id ? { upazila_id: Number(args.upazila_id) } : undefined,
      take: Number(args.limit ?? 100),
    });
  }
  if (name === "holidays") {
    return prisma.holiday.findMany({ take: Number(args.limit ?? 100) });
  }
  if (name === "encyclopedia" && args.category) {
    const category = getEncyclopediaCategory(args.category);
    if (!category) return [];
    const delegate = (prisma as unknown as Record<string, { findMany: (a: unknown) => Promise<unknown[]> }>)[category.model];
    return delegate.findMany({ take: Number(args.limit ?? 50) });
  }
  if (name === "encyclopediaCategories") {
    return encyclopediaCategories.map((c) => ({
      slug: c.slug,
      title: c.title,
      group: c.group,
      description: c.description,
    }));
  }
  if (name === "search" && args.q) {
    const results: Record<string, unknown>[] = [];
    for (const cat of encyclopediaCategories.slice(0, 10)) {
      const delegate = (prisma as unknown as Record<string, { findMany: (a: unknown) => Promise<Record<string, unknown>[]> }>)[cat.model];
      const items = await delegate.findMany({
        where: {
          OR: [
            { name_en: { contains: args.q, mode: "insensitive" } },
            { name_bn: { contains: args.q } },
          ],
        },
        take: 5,
      });
      for (const item of items) {
        results.push({ ...item, _category: cat.slug });
      }
    }
    return results;
  }

  return null;
}

const bodySchema = z.object({ query: z.string().min(1).max(10_000), variables: z.record(z.string(), z.unknown()).default({}), operationName: z.string().optional() });

export async function POST(request: Request) {
  return handleApi(request, async () => {
    const body = bodySchema.safeParse(await request.json().catch(() => null));
    if (!body.success) return Response.json({ errors: [{ message: "Send a query string of at most 10,000 characters and an optional variables object." }] }, { status: 422 });
    try {
      const fields = parseReadQuery(body.data.query, body.data.variables, body.data.operationName);
      const data: Record<string, unknown> = Object.create(null);
      for (const field of fields) data[field.alias ?? field.name] = projectGraphQL(await resolveField(field), field.fields);
      return Response.json({ data }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      if (error instanceof QueryError) return Response.json({ errors: [{ message: error.message }] }, { status: 422 });
      throw error;
    }
  });
}

export async function GET(request: Request) {
  return handleApi(request, async () => ({ data: { message: "Send a POST request with a query field.", example: { query: "{ divisions { id name_en name_bn } }" } } }));
}

export function OPTIONS() { return optionsResponse(); }

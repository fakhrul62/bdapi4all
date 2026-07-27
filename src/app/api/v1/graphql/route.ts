import { prisma } from "@/lib/db";
import { getEncyclopediaCategory, encyclopediaCategories } from "@/lib/encyclopedia";

export const runtime = "nodejs";

type GqlField = {
  name: string;
  alias?: string;
  arguments: Record<string, string>;
  fields: GqlField[];
};

function parseValue(value: string): string | number | boolean {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  if (value === "true") return true;
  if (value === "false") return false;
  const num = Number(value);
  if (!isNaN(num)) return num;
  return value;
}

function parseArguments(input: string): Record<string, string> {
  const args: Record<string, string> = {};
  const match = input.match(/\(([^)]*)\)/);
  if (!match) return args;

  const pairs = match[1].split(",").map((p) => p.trim());
  for (const pair of pairs) {
    const colonIdx = pair.indexOf(":");
    if (colonIdx === -1) continue;
    const key = pair.slice(0, colonIdx).trim();
    const value = pair.slice(colonIdx + 1).trim();
    args[key] = String(parseValue(value));
  }
  return args;
}

function parseFields(input: string, start: number): { fields: GqlField[]; next: number } {
  const fields: GqlField[] = [];
  let i = start;

  while (i < input.length) {
    while (i < input.length && /[\s,]/.test(input[i])) i++;
    if (i >= input.length || input[i] === "}") return { fields, next: i };

    let name = "";
    while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) {
      name += input[i];
      i++;
    }

    let alias: string | undefined;
    if (input[i] === ":") {
      i++;
      while (i < input.length && /[\s]/.test(input[i])) i++;
      alias = name;
      name = "";
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) {
        name += input[i];
        i++;
      }
    }

    while (i < input.length && /[\s]/.test(input[i])) i++;

    let args: Record<string, string> = {};
    if (i < input.length && input[i] === "(") {
      let depth = 0;
      const start2 = i;
      while (i < input.length) {
        if (input[i] === "(") depth++;
        if (input[i] === ")") depth--;
        i++;
        if (depth === 0) break;
      }
      args = parseArguments(input.slice(start2, i));
    }

    while (i < input.length && /[\s]/.test(input[i])) i++;

    let fieldFields: GqlField[] = [];
    if (i < input.length && input[i] === "{") {
      i++;
      const result = parseFields(input, i);
      fieldFields = result.fields;
      i = result.next;
      if (input[i] === "}") i++;
    }

    fields.push({ name, alias, arguments: args, fields: fieldFields });
  }

  return { fields, next: i };
}

function parseGraphQL(query: string): GqlField[] {
  const cleaned = query.replace(/#.*$/gm, "").trim();
  const braceIdx = cleaned.indexOf("{");
  if (braceIdx === -1) return [];
  const body = cleaned.slice(braceIdx);
  const result = parseFields(body, 1);
  return result.fields;
}

async function resolveField(field: GqlField): Promise<unknown> {
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
      take: Number(args.limit ?? 500),
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

export async function POST(request: Request) {
  let query: string;
  let variables: Record<string, unknown> = {};

  try {
    const body = await request.json();
    query = body.query;
    variables = body.variables ?? {};
  } catch {
    return Response.json(
      { errors: [{ message: "Invalid JSON body. Send a GraphQL query in the 'query' field." }] },
      { status: 400 },
    );
  }

  if (!query) {
    return Response.json(
      { errors: [{ message: "Missing 'query' field in request body." }] },
      { status: 400 },
    );
  }

  try {
    const fields = parseGraphQL(query);
    const data: Record<string, unknown> = {};

    for (const field of fields) {
      const result = await resolveField(field);
      const key = field.alias ?? field.name;
      data[key] = result;
    }

    return Response.json(
      { data, ...(variables ? {} : {}) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    return Response.json(
      {
        errors: [
          {
            message: error instanceof Error ? error.message : "GraphQL execution error",
          },
        ],
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return Response.json({
    message: "BDApi4All GraphQL endpoint. Send a POST request with a 'query' field.",
    example: {
      query: "{ divisions { id name_en name_bn } districts(division_id: 6) { id name_en } }",
    },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204 });
}

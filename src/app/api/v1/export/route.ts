import { prisma } from "@/lib/db";
import { getEncyclopediaCategory } from "@/lib/encyclopedia";

export const runtime = "nodejs";

type ExportFormat = "json" | "csv" | "xml";

const VALID_FORMATS: ExportFormat[] = ["json", "csv", "xml"];

const GEO_MODELS: Record<string, keyof typeof prisma> = {
  divisions: "division",
  districts: "district",
  upazilas: "upazila",
  unions: "union",
  holidays: "holiday",
};

function escapeXml(text: unknown): string {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toXml(records: Record<string, unknown>[], rootName: string): string {
  const items = records
    .map((record) => {
      const fields = Object.entries(record)
        .map(([key, value]) => {
          if (value === null || value === undefined) return "";
          if (Array.isArray(value)) {
            const items = value.map((v) => `<item>${escapeXml(v)}</item>`).join("");
            return `<${key}>${items}</${key}>`;
          }
          if (typeof value === "object") {
            return `<${key}>${escapeXml(JSON.stringify(value))}</${key}>`;
          }
          return `<${key}>${escapeXml(value)}</${key}>`;
        })
        .join("");
      return `<record>${fields}</record>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>${items}</${rootName}>`;
}

function toCsv(records: Record<string, unknown>[]): string {
  if (records.length === 0) return "";
  const headers = new Set<string>();
  for (const record of records) {
    for (const key of Object.keys(record)) {
      headers.add(key);
    }
  }
  const headerList = Array.from(headers);
  const lines = [headerList.join(",")];

  for (const record of records) {
    const values = headerList.map((header) => {
      const value = record[header];
      if (value === null || value === undefined) return "";
      if (Array.isArray(value)) return `"${value.join(";")}"`;
      if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      const str = String(value);
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    lines.push(values.join(","));
  }

  return lines.join("\n");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const format = (url.searchParams.get("format") ?? "json") as ExportFormat;

  if (!category) {
    return Response.json(
      {
        success: false,
        error: {
          code: "MISSING_PARAMETER",
          message: "Parameter 'category' is required. Use ?category=<name>&format=<json|csv|xml>",
          docs: "https://bdapi4all.vercel.app/docs",
        },
      },
      { status: 400 },
    );
  }

  if (!VALID_FORMATS.includes(format)) {
    return Response.json(
      {
        success: false,
        error: {
          code: "INVALID_PARAMETER",
          message: `Unsupported format '${format}'. Supported: ${VALID_FORMATS.join(", ")}`,
          docs: "https://bdapi4all.vercel.app/docs",
        },
      },
      { status: 422 },
    );
  }

  let records: Record<string, unknown>[] = [];
  let rootName = category;

  const encCategory = getEncyclopediaCategory(category);
  if (encCategory) {
    const delegate = (prisma as unknown as Record<string, { findMany: (args: unknown) => Promise<Record<string, unknown>[]> }>)[encCategory.model];
    records = await delegate.findMany({ take: 1000 });
    rootName = encCategory.slug;
  } else if (category in GEO_MODELS) {
    const modelName = GEO_MODELS[category] as keyof typeof prisma;
    const delegate = prisma[modelName] as unknown as { findMany: (args: unknown) => Promise<Record<string, unknown>[]> };
    records = await delegate.findMany({ take: 1000 });
  } else {
    return Response.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Category '${category}' not found. Available: divisions, districts, upazilas, unions, holidays, or any encyclopedia category.`,
          docs: "https://bdapi4all.vercel.app/docs",
        },
      },
      { status: 404 },
    );
  }

  if (format === "json") {
    return Response.json(
      {
        success: true,
        version: "v1",
        timestamp: new Date().toISOString(),
        data: records,
        meta: { category, count: records.length, format: "json" },
      },
      {
        headers: {
          "Content-Disposition": `attachment; filename="${category}.json"`,
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        },
      },
    );
  }

  if (format === "csv") {
    return new Response(toCsv(records), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${category}.csv"`,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  }

  return new Response(toXml(records, rootName), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${category}.xml"`,
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
    },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204 });
}

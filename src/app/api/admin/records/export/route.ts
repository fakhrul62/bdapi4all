import { z } from "zod";
import { requireAdminResponse } from "@/lib/admin-auth";
import { adminExportRecords } from "@/lib/admin-records";

const querySchema = z.object({
  category: z.string().min(1),
  format: z.enum(["json", "csv"]).default("json"),
});

export async function GET(request: Request) {
  const unauthorized = await requireAdminResponse(request);
  if (unauthorized) return unauthorized;
  const url = new URL(request.url);
  const query = querySchema.parse(Object.fromEntries(url.searchParams));
  const result = await adminExportRecords(query.category, query.format);
  const extension = query.format === "json" ? "json" : "csv";

  return new Response(result.body, {
    headers: {
      "Content-Type": result.contentType,
      "Content-Disposition": `attachment; filename="${result.category.slug}.${extension}"`,
    },
  });
}

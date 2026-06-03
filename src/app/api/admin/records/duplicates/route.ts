import { z } from "zod";
import { requireAdminResponse } from "@/lib/admin-auth";
import { adminDuplicateRecords } from "@/lib/admin-records";
import { successResponse } from "@/lib/response";

const querySchema = z.object({
  category: z.string().min(1),
});

export async function GET(request: Request) {
  const unauthorized = await requireAdminResponse(request);
  if (unauthorized) return unauthorized;
  const url = new URL(request.url);
  const query = querySchema.parse(Object.fromEntries(url.searchParams));
  const duplicates = await adminDuplicateRecords(query.category);
  return successResponse(duplicates);
}

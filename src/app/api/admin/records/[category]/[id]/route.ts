import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { adminUpdateRecord } from "@/lib/admin-records";
import { successResponse } from "@/lib/response";

const idSchema = z.coerce.number().int().positive();

export async function PATCH(
  request: Request,
  context: { params: Promise<{ category: string; id: string }> },
) {
  await requireAdmin(request);
  const { category, id } = await context.params;
  const record = await adminUpdateRecord(category, idSchema.parse(id), await request.json());
  return successResponse(record);
}

import { z } from "zod";
import { requireAdminResponse } from "@/lib/admin-auth";
import { adminDeleteRecord, adminUpdateRecord } from "@/lib/admin-records";
import { successResponse } from "@/lib/response";

const idSchema = z.coerce.number().int().positive();

export async function PATCH(
  request: Request,
  context: { params: Promise<{ category: string; id: string }> },
) {
  const unauthorized = await requireAdminResponse(request);
  if (unauthorized) return unauthorized;
  const { category, id } = await context.params;
  const record = await adminUpdateRecord(category, idSchema.parse(id), await request.json());
  return successResponse(record);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ category: string; id: string }> },
) {
  const unauthorized = await requireAdminResponse(request);
  if (unauthorized) return unauthorized;
  const { category, id } = await context.params;
  const record = await adminDeleteRecord(category, idSchema.parse(id));
  return successResponse(record);
}

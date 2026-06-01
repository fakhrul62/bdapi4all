import { z } from "zod";

export const idSchema = z.coerce.number().int().positive();
export const optionalIdSchema = z.coerce.number().int().positive().optional();
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format.");

export function parseSearchParams<T extends z.ZodRawShape>(
  request: Request,
  schema: z.ZodObject<T>,
) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());
  return schema.parse(params);
}

export function normalizeMobileNumber(number: string) {
  const compact = number.replace(/[\s.-]/g, "");
  if (compact.startsWith("+880")) return `0${compact.slice(4)}`;
  if (compact.startsWith("880")) return `0${compact.slice(3)}`;
  return compact;
}

export function isValidBdMobile(number: string) {
  return /^01[3-9]\d{8}$/.test(normalizeMobileNumber(number));
}

export function isValidNid(nid: string) {
  return /^\d{10}$|^\d{13}$|^\d{17}$/.test(nid);
}

export function isValidTin(tin: string) {
  return /^\d{12}$/.test(tin);
}

export function isValidPostcode(postcode: string) {
  return /^\d{4}$/.test(postcode);
}

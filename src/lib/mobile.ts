import mobilePrefixes from "../../data/mobile-prefixes.json";
import { normalizeMobileNumber } from "@/lib/validators";

export type MobileOperator = (typeof mobilePrefixes)[number];

export function detectOperator(number: string): MobileOperator | null {
  const normalized = normalizeMobileNumber(number);
  const prefix = normalized.slice(0, 3);
  return mobilePrefixes.find((item) => item.prefix === prefix) ?? null;
}

export function getMobilePrefixes() {
  return mobilePrefixes;
}

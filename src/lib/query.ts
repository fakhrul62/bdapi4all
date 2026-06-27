import { errorResponse } from "@/lib/response";

const MAX_SORT_FIELDS = 5;
const MAX_SELECTED_FIELDS = 50;

export type SortDirection = "asc" | "desc";

export type SortSelection = {
  field: string;
  direction: SortDirection;
};

export function parseSort(searchParams: URLSearchParams, allowedFields: Set<string>) {
  const raw = searchParams.get("sort")?.trim();
  if (!raw) {
    return {
      selections: [{ field: "id", direction: "asc" as const }],
      orderBy: [{ id: "asc" as const }],
    };
  }

  const selections = raw
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean)
    .slice(0, MAX_SORT_FIELDS)
    .map((field) => {
      const direction = field.startsWith("-") ? "desc" : "asc";
      const cleanField = field.replace(/^-/, "");

      if (!allowedFields.has(cleanField)) {
        throw errorResponse(
          "INVALID_PARAMETER",
          `Unsupported sort field '${cleanField}'. Supported fields: ${Array.from(allowedFields).sort().join(", ")}.`,
          422,
        );
      }

      return { field: cleanField, direction };
    });

  if (selections.length === 0) {
    throw errorResponse("INVALID_PARAMETER", "Sort must include at least one field.", 422);
  }

  return {
    selections,
    orderBy: selections.map(({ field, direction }) => ({ [field]: direction })),
  };
}

export function parseFields(searchParams: URLSearchParams) {
  const raw = searchParams.get("fields")?.trim();
  if (!raw) return undefined;

  const fields = Array.from(
    new Set(
      raw
        .split(",")
        .map((field) => field.trim())
        .filter(Boolean)
        .slice(0, MAX_SELECTED_FIELDS),
    ),
  );

  if (fields.length === 0) {
    throw errorResponse("INVALID_PARAMETER", "Fields must include at least one field name.", 422);
  }

  return fields;
}

export function pickFields<T>(item: T, fields?: string[]): Partial<T> {
  if (!fields?.length || item === null || typeof item !== "object") return item as Partial<T>;

  const source = item as Record<string, unknown>;
  return fields.reduce<Record<string, unknown>>((selected, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      selected[field] = source[field];
    }
    return selected;
  }, {}) as Partial<T>;
}

export function projectItems<T>(items: T[], fields?: string[]) {
  if (!fields?.length) return items;

  if (items.length > 0) {
    const sample = items[0] as Record<string, unknown>;
    const missing = fields.filter((field) => !Object.prototype.hasOwnProperty.call(sample, field));
    if (missing.length > 0) {
      throw errorResponse(
        "INVALID_PARAMETER",
        `Unsupported field selection: ${missing.join(", ")}.`,
        422,
      );
    }
  }

  return items.map((item) => pickFields(item, fields));
}

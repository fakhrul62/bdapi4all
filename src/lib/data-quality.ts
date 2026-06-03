import { prisma } from "@/lib/db";
import { encyclopediaCategories, getEncyclopediaDelegate } from "@/lib/encyclopedia";

type DynamicDelegate = {
  findMany(args: Record<string, unknown>): Promise<Array<Record<string, unknown>>>;
  update(args: Record<string, unknown>): Promise<Record<string, unknown>>;
  updateMany(args: Record<string, unknown>): Promise<{ count: number }>;
};

type IssueDelegate = {
  createMany(args: Record<string, unknown>): Promise<{ count: number }>;
};

type QualityIssueInput = {
  category: string;
  recordId: number;
  issueType: string;
  message: string;
  severity?: "low" | "medium" | "high";
};

function issueDelegate() {
  return (prisma as unknown as { dataQualityIssue: IssueDelegate }).dataQualityIssue;
}

function isCorruptedText(value: unknown) {
  return typeof value === "string" && /(?:à¦|à§|ï¿½|Â)/.test(value);
}

function inferAnimalCategory(text: string) {
  if (/\b(bird|duck|eagle|falcon|owl|parrot|stork|heron|kingfisher|bulbul)\b/i.test(text)) return "bird";
  if (/\b(fish|carp|catfish|hilsa|shark|ray|eel|rohu)\b/i.test(text)) return "fish";
  if (/\b(snake|crocodile|lizard|turtle|tortoise|reptile)\b/i.test(text)) return "reptile";
  if (/\b(butterfly|bee|ant|insect|moth|beetle)\b/i.test(text)) return "insect";
  return "mammal";
}

function inferFoodCategory(text: string) {
  if (/\b(sweet|mishti|pitha|payesh|dessert|doi|rasgulla|sandesh|laddu)\b/i.test(text)) return "sweet";
  if (/\b(tea|drink|juice|sharbat|lassi)\b/i.test(text)) return "drink";
  if (/\b(rice|bhat|khichuri|biryani|pulao)\b/i.test(text)) return "rice";
  if (/\b(curry|bhuna|korma|rezala|dal|fish|meat)\b/i.test(text)) return "curry";
  return "snack";
}

function inferHistoricalEventCategory(text: string) {
  if (/\b(war|battle|mutiny|conflict|genocide|massacre)\b/i.test(text)) return "war";
  if (/\b(cyclone|flood|earthquake|disaster|famine)\b/i.test(text)) return "natural_disaster";
  if (/\b(language|literary|cultural|festival|movement)\b/i.test(text)) return "cultural";
  if (/\b(revolution|uprising|movement|protest)\b/i.test(text)) return "revolution";
  return "political";
}

function inferLeaderRole(text: string) {
  if (/\bprime minister|premier\b/i.test(text)) return "prime_minister";
  if (/\bpresident\b/i.test(text)) return "president";
  if (/\bfreedom fighter|liberation war|mukti bahini\b/i.test(text)) return "freedom_fighter";
  if (/\bactivist|organizer|movement\b/i.test(text)) return "activist";
  if (/\bgeneral|commander|chief of staff\b/i.test(text)) return "general";
  return "minister";
}

function inferSportId(text: string) {
  if (/\bfootball|soccer|fifa\b/i.test(text)) return 2;
  if (/\bkabaddi\b/i.test(text)) return 3;
  if (/\barchery|archer\b/i.test(text)) return 4;
  if (/\bchess|grandmaster\b/i.test(text)) return 5;
  return 1;
}

async function saveIssue(input: QualityIssueInput) {
  await createIssues([input]);
}

async function createIssues(inputs: QualityIssueInput[]) {
  if (!inputs.length) return 0;
  const result = await issueDelegate().createMany({
    data: inputs.map((input) => ({
      category: input.category,
      record_id: input.recordId,
      issue_type: input.issueType,
      message: input.message,
      severity: input.severity ?? "medium",
      resolved: false,
    })),
    skipDuplicates: true,
  });
  return result.count;
}

async function normalizeBaseFields(categorySlug: string, delegate: DynamicDelegate) {
  let normalized = 0;
  const records = await delegate.findMany({
    where: {
      OR: [
        { name_bn: { contains: "à" } },
        { description_bn: { contains: "à" } },
        { name_bn: { contains: "�" } },
        { description_bn: { contains: "�" } },
      ],
    },
    take: 1000,
    orderBy: { id: "asc" },
  });

  for (const record of records) {
    const data: Record<string, unknown> = {};
    if (isCorruptedText(record.name_bn)) data.name_bn = record.name_en ?? record.name_bn;
    if (isCorruptedText(record.description_bn)) data.description_bn = record.description_en ?? record.description_bn;
    if (!Object.keys(data).length) continue;
    await delegate.update({ where: { id: record.id }, data });
    await saveIssue({
      category: categorySlug,
      recordId: Number(record.id),
      issueType: "corrupted_bengali_text",
      message: "Corrupted Bengali text was replaced with the available English field pending verified Bengali copy.",
      severity: "low",
    });
    normalized += 1;
  }

  return normalized;
}

async function normalizeCategoryFields(categorySlug: string, delegate: DynamicDelegate) {
  let updated = 0;
  const records = await delegate.findMany({ take: 5000, orderBy: { id: "asc" } });
  for (const record of records) {
    const text = `${record.name_en ?? ""} ${record.description_en ?? ""}`;
    const data: Record<string, unknown> = {};

    if (categorySlug === "animals" && (!record.category || record.category === "wildlife")) {
      data.category = inferAnimalCategory(text);
    }
    if (categorySlug === "traditional-foods" && (!record.category || record.category === "food")) {
      data.category = inferFoodCategory(text);
    }
    if (categorySlug === "historical-events" && (!record.category || record.category === "historical")) {
      data.category = inferHistoricalEventCategory(text);
    }
    if (categorySlug === "political-leaders" && (!record.role || record.role === "politician")) {
      data.role = inferLeaderRole(text);
    }
    if ((categorySlug === "players" || categorySlug === "national-teams") && (!record.sport_id || record.sport_id === 1)) {
      const sportId = inferSportId(text);
      if (sportId !== record.sport_id) data.sport_id = sportId;
    }

    if (!Object.keys(data).length) continue;
    await delegate.update({ where: { id: record.id }, data });
    updated += 1;
  }
  return updated;
}

async function scanIssues(categorySlug: string, delegate: DynamicDelegate) {
  const issues: QualityIssueInput[] = [];
  const records = await delegate.findMany({ take: 10000, orderBy: { id: "asc" } });
  for (const record of records) {
    const id = Number(record.id);
    if (!record.image_url || record.needs_image) {
      issues.push({
        category: categorySlug,
        recordId: id,
        issueType: "missing_image",
        message: "Record has no confirmed image URL.",
        severity: "low",
      });
    }
    if (!record.source_url) {
      issues.push({
        category: categorySlug,
        recordId: id,
        issueType: "missing_source_url",
        message: "Record has no source URL.",
        severity: "medium",
      });
    }
    if (!record.verified) {
      issues.push({
        category: categorySlug,
        recordId: id,
        issueType: "unverified",
        message: "Record has not been verified against a source.",
        severity: "medium",
      });
    }
    if (isCorruptedText(record.name_bn) || isCorruptedText(record.description_bn)) {
      issues.push({
        category: categorySlug,
        recordId: id,
        issueType: "corrupted_bengali_text",
        message: "Bengali field appears to contain mojibake.",
        severity: "high",
      });
    }
  }

  let created = 0;
  for (let index = 0; index < issues.length; index += 1000) {
    created += await createIssues(issues.slice(index, index + 1000));
  }
  return created;
}

export async function normalizeAndAuditData(categorySlug?: string) {
  const categories = categorySlug
    ? encyclopediaCategories.filter((category) => category.slug === categorySlug)
    : encyclopediaCategories;

  const result = {
    categories: categories.length,
    normalized_text: 0,
    normalized_fields: 0,
    issues_opened_or_refreshed: 0,
  };

  for (const category of categories) {
    const delegate = getEncyclopediaDelegate(category) as unknown as DynamicDelegate;
    result.normalized_text += await normalizeBaseFields(category.slug, delegate);
    result.normalized_fields += await normalizeCategoryFields(category.slug, delegate);
    result.issues_opened_or_refreshed += await scanIssues(category.slug, delegate);
  }

  return result;
}

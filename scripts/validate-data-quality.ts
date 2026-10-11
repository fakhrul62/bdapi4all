import { databaseConnectionOptions } from "../src/lib/db-config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

type Delegate = {
  findMany(args: Record<string, unknown>): Promise<Array<Record<string, unknown>>>;
  count(args: Record<string, unknown>): Promise<number>;
};

type Validator = {
  slug: string;
  model: string;
  select: Record<string, boolean>;
};

type Issue = {
  category: string;
  recordId: number;
  issueType: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low";
};

const adapter = new PrismaPg(databaseConnectionOptions());
const prisma = new PrismaClient({ adapter });

function delegate(model: string) {
  return (prisma as unknown as Record<string, Delegate>)[model];
}

const validators: Validator[] = [
  { slug: "divisions", model: "division", select: { id: true, name_en: true, name_bn: true } },
  { slug: "districts", model: "district", select: { id: true, name_en: true, name_bn: true } },
  { slug: "upazilas", model: "upazila", select: { id: true, name_en: true, name_bn: true, district_id: true } },
  { slug: "unions", model: "union", select: { id: true, name_en: true, name_bn: true, upazila_id: true } },
  { slug: "rivers", model: "river", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "canals", model: "canal", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "haors", model: "haor", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "forests", model: "forest", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "islands", model: "island", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "seasons", model: "season", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "animals", model: "animal", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "flowers", model: "flower", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "trees", model: "tree", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "festivals", model: "festival", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "traditional-foods", model: "traditionalFood", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "spices", model: "spice", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "traditional-clothing", model: "traditionalClothing", select: { name_en: true, source: true } },
  { slug: "traditional-music", model: "traditionalMusic", select: { name_en: true, source: true } },
  { slug: "traditional-crafts", model: "traditionalCraft", select: { name_en: true, source: true } },
  { slug: "historical-periods", model: "historicalPeriod", select: { name_en: true, source: true } },
  { slug: "sports-categories", model: "sportsCategory", select: { name_en: true, source: true } },
  { slug: "historical-places", model: "historicalPlace", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "historical-events", model: "historicalEvent", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "political-leaders", model: "politicalLeader", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "political-parties", model: "politicalParty", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "authors", model: "author", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "books", model: "book", select: { id: true, name_en: true, name_bn: true, title_en: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "players", model: "player", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "national-teams", model: "nationalTeam", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "scientists", model: "scientist", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "artists", model: "artist", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
  { slug: "freedom-fighters", model: "freedomFighter", select: { id: true, name_en: true, name_bn: true, verified: true, needs_image: true, source: true, source_url: true } },
];

const issues: Issue[] = [];

function report(category: string, record: Record<string, unknown>, issueType: string, message: string, severity: Issue["severity"]) {
  issues.push({
    category,
    recordId: Number(record.id),
    issueType,
    message,
    severity,
  });
}

async function validateRecords(validator: Validator) {
  const model = delegate(validator.model);
  const records = await model.findMany({});
  const seen = new Map<string, Set<string>>();

  for (const record of records) {
    const nameEn = typeof record.name_en === "string" ? record.name_en.trim() : "";
    const nameBn = typeof record.name_bn === "string" ? record.name_bn.trim() : "";
    const titleEn = typeof record.title_en === "string" ? record.title_en.trim() : "";

    if (!nameEn && !titleEn) {
      report(validator.slug, record, "missing_name", "Record has no English name.", "high");
    }
    if (!nameBn && validator.slug !== "books") {
      report(validator.slug, record, "missing_bengali_name", "Record has no Bengali name.", "medium");
    }

    const key = (nameEn.toLowerCase() || titleEn.toLowerCase()) + ":" + String(record.district_id ?? record.upazila_id ?? record.author_id ?? "");
    if (nameEn || titleEn) {
      const content = JSON.stringify(Object.fromEntries(Object.entries(record).filter(([field]) => !["id", "created_at", "updated_at"].includes(field))));
      const matches = seen.get(key);
      if (matches?.has(content)) report(validator.slug, record, "duplicate_name", `Exact duplicate of '${nameEn}'.`, "high");
      else if (matches) report(validator.slug, record, "possible_duplicate_name", `Matching name '${nameEn}' has different content and needs review.`, "medium");
      if (!matches) seen.set(key, new Set([content]));
      else matches.add(content);
    }

    if (validator.select.source && record.verified === true && (!String(record.source ?? "").trim() || !String(record.source_url ?? "").trim())) {
      report(validator.slug, record, "verified_without_source", "Record is verified but missing source or source_url.", "high");
    }
  }

  return records.length;
}

async function writeIssues() {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const issue of issues) {
    counts[issue.severity] += 1;
  }

  console.table(
    issues.slice(0, 100).map((issue) => ({ category: issue.category, severity: issue.severity, type: issue.issueType, recordId: issue.recordId })),
  );
  console.log(`\nTotal issues: ${issues.length} (critical: ${counts.critical}, high: ${counts.high}, medium: ${counts.medium}, low: ${counts.low})`);

  if (process.env.DATA_QUALITY_WRITE === "true") {
    await prisma.$transaction(async (tx) => {
      await tx.dataQualityIssue.updateMany({
        where: { category: { in: validators.map((validator) => validator.slug) }, issue_type: { in: ["missing_name", "missing_bengali_name", "duplicate_name", "possible_duplicate_name", "verified_without_source"] }, resolved: false },
        data: { resolved: true, resolved_at: new Date() },
      });
      await tx.dataQualityIssue.createMany({
        skipDuplicates: true,
        data: issues.map((issue) => ({
        category: issue.category,
        record_id: issue.recordId,
        issue_type: issue.issueType,
        message: issue.message,
        severity: issue.severity,
        })),
      });
      for (let index = 0; index < issues.length; index += 500) {
        await tx.dataQualityIssue.updateMany({
          where: { OR: issues.slice(index, index + 500).map((issue) => ({ category: issue.category, record_id: issue.recordId, issue_type: issue.issueType })) },
          data: { resolved: false, resolved_at: null },
        });
      }
    });
    console.log("Wrote issues to data_quality_issues table.");
  }

  const failOn = process.env.DATA_QUALITY_FAIL_ON ?? "critical";
  const threshold: Record<string, number> = { low: 0, medium: 1, high: 2, critical: 3 };
  const blocking = Object.entries(counts).reduce((total, [severity, count]) => total + (threshold[severity] >= (threshold[failOn] ?? 3) ? count : 0), 0);
  if (blocking > 0) {
    console.error(`FAIL: found ${blocking} issues at severity ${failOn} or above.`);
    process.exit(1);
  }
}

async function main() {
  const totalRecords = { checked: 0, categories: 0 };
  for (const validator of validators) {
    const checked = await validateRecords(validator);
    totalRecords.checked += checked;
    totalRecords.categories += 1;
  }

  console.log(`Validated ${totalRecords.categories} categories / ${totalRecords.checked} records.`);
  await writeIssues();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

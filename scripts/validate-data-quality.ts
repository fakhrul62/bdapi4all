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

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

function delegate(model: string) {
  return (prisma as unknown as Record<string, Delegate>)[model];
}

const validators: Validator[] = [
  { slug: "divisions", model: "division", select: { id: true, name_en: true } },
  { slug: "districts", model: "district", select: { id: true, name_en: true, name_bn: true } },
  { slug: "upazilas", model: "upazila", select: { id: true, name_en: true } },
  { slug: "unions", model: "union", select: { id: true, name_en: true } },
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
  const records = await model.findMany({ select: validator.select });
  const seen = new Map<string, number>();

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

    const key = nameEn.toLowerCase() || titleEn.toLowerCase();
    if (key) {
      if (seen.has(key)) {
        report(validator.slug, record, "duplicate_name", `Duplicate English name '${nameEn}'.`, "high");
      } else {
        seen.set(key, 1);
      }
    }

    if (validator.select.source && record.verified === true && (!record.source || !record.source_url)) {
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
    await prisma.dataQualityIssue.deleteMany({});
    await prisma.dataQualityIssue.createMany({
      data: issues.map((issue) => ({
        category: issue.category,
        record_id: issue.recordId,
        issue_type: issue.issueType,
        message: issue.message,
        severity: issue.severity,
      })),
    });
    console.log("Wrote issues to data_quality_issues table.");
  }

  const failOn = process.env.DATA_QUALITY_FAIL_ON ?? "critical";
  const threshold: Record<string, number> = { low: 0, medium: 1, high: 2, critical: 3 };
  if (threshold[failOn] !== undefined && counts[failOn as keyof typeof counts] > 0) {
    console.error(`FAIL: found ${counts[failOn as keyof typeof counts]} '${failOn}' issues.`);
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

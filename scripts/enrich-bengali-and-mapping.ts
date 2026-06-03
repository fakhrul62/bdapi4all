import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

type Delegate = {
  findMany(args: Record<string, unknown>): Promise<Array<Record<string, unknown>>>;
  update(args: Record<string, unknown>): Promise<Record<string, unknown>>;
};

type CategorySpec = {
  slug: string;
  model: string;
  districtArrayField?: "flows_through" | "districts";
  locationField?: "location" | "region";
  canSetHistoricalDistrict?: boolean;
};

type District = {
  id: number;
  name_en: string;
  name_bn: string;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

const specs: CategorySpec[] = [
  { slug: "rivers", model: "river", districtArrayField: "flows_through" },
  { slug: "canals", model: "canal", districtArrayField: "districts", locationField: "location" },
  { slug: "haors", model: "haor", districtArrayField: "districts", locationField: "location" },
  { slug: "forests", model: "forest", districtArrayField: "districts", locationField: "location" },
  { slug: "islands", model: "island", districtArrayField: "districts", locationField: "location" },
  { slug: "traditional-foods", model: "traditionalFood", locationField: "region" },
  { slug: "historical-places", model: "historicalPlace", locationField: "location", canSetHistoricalDistrict: true },
  { slug: "political-leaders", model: "politicalLeader" },
  { slug: "authors", model: "author" },
  { slug: "books", model: "book" },
  { slug: "players", model: "player" },
];

const knownBengali: Record<string, { name_bn?: string; description_bn?: string; fields?: Record<string, unknown> }> = {
  Padma: { name_bn: "পদ্মা", description_bn: "পদ্মা বাংলাদেশের প্রধান নদীগুলোর একটি এবং গঙ্গা নদীর প্রধান প্রবাহ।" },
  Meghna: { name_bn: "মেঘনা", description_bn: "মেঘনা বাংলাদেশের বৃহৎ নদী ব্যবস্থার একটি প্রধান নদী।" },
  Jamuna: { name_bn: "যমুনা", description_bn: "যমুনা ব্রহ্মপুত্রের প্রধান প্রবাহ হিসেবে বাংলাদেশের উত্তর ও মধ্যাঞ্চল অতিক্রম করে।" },
  Brahmaputra: { name_bn: "ব্রহ্মপুত্র", description_bn: "ব্রহ্মপুত্র দক্ষিণ এশিয়ার অন্যতম প্রধান নদী, যার প্রবাহ বাংলাদেশের নদী ব্যবস্থাকে প্রভাবিত করে।" },
  Teesta: { name_bn: "তিস্তা", description_bn: "তিস্তা উত্তর বাংলাদেশের কৃষি, সেচ ও নদীভিত্তিক জনজীবনের সঙ্গে গভীরভাবে যুক্ত।" },
  Karnaphuli: { name_bn: "কর্ণফুলী", description_bn: "কর্ণফুলী চট্টগ্রাম অঞ্চলের প্রধান নদী এবং বন্দরনগরীর অর্থনীতির সঙ্গে যুক্ত।" },
  Buriganga: { name_bn: "বুড়িগঙ্গা", description_bn: "বুড়িগঙ্গা ঢাকা শহরের ঐতিহাসিক নদী।" },
  "Hakaluki Haor": { name_bn: "হাকালুকি হাওর", description_bn: "হাকালুকি হাওর বাংলাদেশের উত্তর-পূর্বাঞ্চলের বৃহৎ জলাভূমি ও জীববৈচিত্র্য অঞ্চল।" },
  "Tanguar Haor": { name_bn: "টাঙ্গুয়ার হাওর", description_bn: "টাঙ্গুয়ার হাওর সুনামগঞ্জের একটি গুরুত্বপূর্ণ রামসার জলাভূমি।" },
  Sundarbans: { name_bn: "সুন্দরবন", description_bn: "সুন্দরবন বিশ্বের বৃহত্তম ম্যানগ্রোভ বন এবং রয়েল বেঙ্গল টাইগারের আবাসস্থল।" },
  "Saint Martin's Island": { name_bn: "সেন্ট মার্টিন দ্বীপ", description_bn: "সেন্ট মার্টিন বাংলাদেশের একমাত্র প্রবাল দ্বীপ, যা বঙ্গোপসাগরে অবস্থিত।" },
  "Lalbagh Fort": { name_bn: "লালবাগ কেল্লা", description_bn: "লালবাগ কেল্লা ঢাকার মুঘল আমলের একটি ঐতিহাসিক স্থাপনা।" },
  "Ahsan Manzil": { name_bn: "আহসান মঞ্জিল", description_bn: "আহসান মঞ্জিল ঢাকার নবাব পরিবারের প্রাসাদ ও ঐতিহাসিক জাদুঘর।" },
  "Paharpur": { name_bn: "পাহাড়পুর", description_bn: "পাহাড়পুরের সোমপুর মহাবিহার বাংলাদেশের একটি ইউনেস্কো বিশ্ব ঐতিহ্য স্থান।" },
  "Shakib Al Hasan": { name_bn: "সাকিব আল হাসান", description_bn: "সাকিব আল হাসান বাংলাদেশের অন্যতম সেরা ক্রিকেট অলরাউন্ডার।" },
  "Kazi Nazrul Islam": { name_bn: "কাজী নজরুল ইসলাম", description_bn: "কাজী নজরুল ইসলাম বাংলাদেশের জাতীয় কবি এবং বাংলা সাহিত্যের বিদ্রোহী কণ্ঠ।" },
  "Rabindranath Tagore": { name_bn: "রবীন্দ্রনাথ ঠাকুর", description_bn: "রবীন্দ্রনাথ ঠাকুর বাংলা সাহিত্যের নোবেলজয়ী কবি, লেখক ও সুরকার।" },
  "Begum Rokeya": { name_bn: "বেগম রোকেয়া", description_bn: "বেগম রোকেয়া নারী শিক্ষা ও সমাজসংস্কারের অগ্রদূত।" },
  Bidrohi: { name_bn: "বিদ্রোহী", description_bn: "বিদ্রোহী কাজী নজরুল ইসলামের বিখ্যাত কবিতা।", fields: { title_bn: "বিদ্রোহী" } },
};

function delegate(model: string) {
  return (prisma as unknown as Record<string, Delegate>)[model];
}

function transientDatabaseError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /P1001|DatabaseNotReachable|Connection terminated|ECONNRESET|ETIMEDOUT|Can't reach database/i.test(message);
}

async function updateWithRetry(model: Delegate, id: number, data: Record<string, unknown>) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      await model.update({ where: { id }, data });
      return true;
    } catch (error) {
      if (!transientDatabaseError(error) || attempt === 5) throw error;
      await prisma.$disconnect().catch(() => undefined);
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  return false;
}

function isFallback(value: unknown, fallback: unknown) {
  if (typeof value !== "string" || typeof fallback !== "string") return false;
  return value.trim() === fallback.trim() || /(?:à¦|à§|ï¿½|Â)/.test(value);
}

function titleFromSourceUrl(record: Record<string, unknown>) {
  if (typeof record.source_url !== "string") return String(record.name_en ?? record.title_en ?? "");
  const match = record.source_url.match(/\/wiki\/([^?#]+)/);
  if (!match) return String(record.name_en ?? record.title_en ?? "");
  return decodeURIComponent(match[1]).replaceAll("_", " ");
}

async function fetchJson<T>(url: string): Promise<T | null> {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "BDApi4All/1.0 (https://bdapi4all.vercel.app)",
          Accept: "application/json",
        },
      });
      if (!response.ok) return null;
      return (await response.json()) as T;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }

  return null;
}

async function getBanglaTitlesBatch(enTitles: string[]) {
  const map = new Map<string, string>();
  for (let index = 0; index < enTitles.length; index += 40) {
    const batch = enTitles.slice(index, index + 40);
    const params = new URLSearchParams({
      action: "query",
      prop: "langlinks",
      titles: batch.join("|"),
      lllang: "bn",
      format: "json",
      origin: "*",
    });
    const payload = await fetchJson<{
      query?: { pages?: Record<string, { title?: string; langlinks?: Array<{ lang: string; "*": string }> }> };
    }>(`https://en.wikipedia.org/w/api.php?${params.toString()}`);
    for (const page of Object.values(payload?.query?.pages ?? {})) {
      const bnTitle = page.langlinks?.[0]?.["*"];
      if (page.title && bnTitle) map.set(page.title, bnTitle);
    }
  }
  return map;
}

async function getBanglaExtractsBatch(bnTitles: string[]) {
  const map = new Map<string, { name_bn: string; description_bn: string }>();
  for (let index = 0; index < bnTitles.length; index += 40) {
    const batch = bnTitles.slice(index, index + 40);
    const params = new URLSearchParams({
      action: "query",
      prop: "extracts",
      titles: batch.join("|"),
      exintro: "1",
      explaintext: "1",
      redirects: "1",
      format: "json",
      origin: "*",
    });
    const payload = await fetchJson<{
      query?: { pages?: Record<string, { title?: string; extract?: string; missing?: string }> };
    }>(`https://bn.wikipedia.org/w/api.php?${params.toString()}`);
    for (const page of Object.values(payload?.query?.pages ?? {})) {
      if (!page.title || page.missing !== undefined) continue;
      map.set(page.title, {
        name_bn: page.title,
        description_bn: page.extract ?? "",
      });
    }
  }
  return map;
}

async function getBanglaSummariesBatch(records: Array<Record<string, unknown>>) {
  const titleById = new Map<number, string>();
  for (const record of records) {
    if (!isFallback(record.name_bn, record.name_en) && !isFallback(record.description_bn, record.description_en)) continue;
    titleById.set(Number(record.id), titleFromSourceUrl(record));
  }

  const enTitles = Array.from(new Set(titleById.values()));
  const bnTitleByEnTitle = await getBanglaTitlesBatch(enTitles);
  const bnExtractByTitle = await getBanglaExtractsBatch(Array.from(new Set(bnTitleByEnTitle.values())));
  const result = new Map<number, { name_bn: string; description_bn: string }>();

  for (const [id, enTitle] of titleById.entries()) {
    const bnTitle = bnTitleByEnTitle.get(enTitle);
    if (!bnTitle) continue;
    const summary = bnExtractByTitle.get(bnTitle);
    if (summary) result.set(id, summary);
  }

  return result;
}

function districtAliases(district: District) {
  const aliases = new Set([district.name_en, district.name_bn]);
  if (district.name_en === "Cox's Bazar") aliases.add("Coxs Bazar");
  if (district.name_en === "Chattogram") aliases.add("Chittagong");
  if (district.name_en === "Jashore") aliases.add("Jessore");
  if (district.name_en === "Cumilla") aliases.add("Comilla");
  if (district.name_en === "Bogura") aliases.add("Bogra");
  if (district.name_en === "Barishal") aliases.add("Barisal");
  return Array.from(aliases).filter(Boolean);
}

function matchedDistricts(record: Record<string, unknown>, districts: District[]) {
  const text = [
    record.name_en,
    record.name_bn,
    record.description_en,
    record.description_bn,
    record.location,
    record.region,
    record.origin,
    record.outflow,
    Array.isArray(record.flows_through) ? record.flows_through.join(" ") : "",
    Array.isArray(record.districts) ? record.districts.join(" ") : "",
  ].filter(Boolean).join(" ");

  return districts.filter((district) =>
    districtAliases(district).some((alias) => new RegExp(`(^|[^A-Za-z])${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Za-z]|$)`, "i").test(text)),
  );
}

async function enrichSpec(spec: CategorySpec, districts: District[], maxRows: number) {
  const model = delegate(spec.model);
  const records = await model.findMany({
    orderBy: { id: "asc" },
    take: maxRows,
  });
  const banglaById = await getBanglaSummariesBatch(records);

  let bengali = 0;
  let mapped = 0;

  for (const record of records) {
    const id = Number(record.id);
    const name = String(record.name_en ?? record.title_en ?? "");
    const patch: Record<string, unknown> = {};
    const known = knownBengali[name];

    if (known?.name_bn && isFallback(record.name_bn, record.name_en)) {
      patch.name_bn = known.name_bn;
    }
    if (known?.description_bn && isFallback(record.description_bn, record.description_en)) {
      patch.description_bn = known.description_bn;
    }
    if (known?.fields) Object.assign(patch, known.fields);

    if ((!known || !patch.name_bn || !patch.description_bn) && (isFallback(record.name_bn, record.name_en) || isFallback(record.description_bn, record.description_en))) {
      const summary = banglaById.get(id);
      if (summary?.name_bn && isFallback(record.name_bn, record.name_en)) patch.name_bn = summary.name_bn;
      if (summary?.description_bn && summary.description_bn.length > 40 && isFallback(record.description_bn, record.description_en)) {
        patch.description_bn = summary.description_bn;
      }
      if (spec.slug === "books" && summary?.name_bn && isFallback(record.title_bn, record.title_en)) {
        patch.title_bn = summary.name_bn;
      }
    }

    const matches = matchedDistricts(record, districts);
    if (matches.length) {
      const names = matches.map((district) => district.name_en);
      if (spec.districtArrayField) {
        const current = Array.isArray(record[spec.districtArrayField]) ? record[spec.districtArrayField] as string[] : [];
        const merged = Array.from(new Set([...current, ...names]));
        if (merged.length !== current.length) patch[spec.districtArrayField] = merged;
      }
      if (spec.locationField && !record[spec.locationField]) {
        patch[spec.locationField] = names.slice(0, 3).join(", ");
      }
      if (spec.canSetHistoricalDistrict && !record.district_id && matches.length === 1) {
        patch.district_id = matches[0].id;
      }
    }

    if (!Object.keys(patch).length) continue;
    await updateWithRetry(model, id, patch);
    if (patch.name_bn || patch.description_bn || patch.title_bn) bengali += 1;
    if (patch.flows_through || patch.districts || patch.location || patch.region || patch.district_id) mapped += 1;
  }

  return { slug: spec.slug, scanned: records.length, bengali, mapped };
}

async function main() {
  const maxRows = Number(process.env.BN_MAP_LIMIT ?? "2500");
  const districts = await prisma.district.findMany({ select: { id: true, name_en: true, name_bn: true } });
  const only = new Set(
    (process.env.BN_MAP_ONLY ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
  const selected = only.size ? specs.filter((spec) => only.has(spec.slug)) : specs;
  const results = [];
  for (const spec of selected) {
    console.log(`Enhancing ${spec.slug}...`);
    results.push(await enrichSpec(spec, districts, maxRows));
  }
  console.table(results);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

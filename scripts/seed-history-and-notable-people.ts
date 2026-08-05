import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

const historicEvents = [
  { name_en: "Language Movement (Bhasha Andolan)", name_bn: "ভাষা আন্দোলন", year: 1952, category: "movement", description_en: "Historic protest movement advocating Bengali as an official language, culminating on February 21, 1952.", description_bn: "বাংলাকে রাষ্ট্রভাষা করার দাবিতে সংগঠিত ঐতিহাসিক আন্দোলন যা ১৯৫২ সালের ২১ ফেব্রেুয়ারী চূড়ান্ত রূপ নেয়।" },
  { name_en: "Six Point Movement", name_bn: "ছয় দফা আন্দোলন", year: 1966, category: "movement", description_en: "Charter of demands spearheaded by Sheikh Mujibur Rahman for provincial autonomy of East Pakistan.", description_bn: "পূর্ব পাকিস্তানের স্বায়ত্তশাসনের জন্য শেখ মুজিবুর রহমান ঘোষিত ঐতিহাসিক ৬ দফা দাবি।" },
  { name_en: "1969 Mass Upsurge", name_bn: "৬৯-এর গণঅভ্যুত্থান", year: 1969, category: "uprising", description_en: "Popular democratic uprising in East Pakistan leading to the fall of President Ayub Khan.", description_bn: "প্রেসিডেন্ট আইয়ুব খানের পতনের লক্ষ্যে সংগঠিত সর্বস্তরের মানুষের ঐতিহাসিক গণঅভ্যুত্থান।" },
  { name_en: "Historic March 7 Speech", name_bn: "ঐতিহাসিক ৭ই মার্চের ভাষণ", year: 1971, category: "speech", description_en: "Pivotal address by Bangabandhu Sheikh Mujibur Rahman at Suhrawardy Udyan declaring 'The struggle this time is for our emancipation'.", description_bn: "সোহরাওয়ার্দী উদ্যানে প্রদত্ত বঙ্গবন্ধুর কালজয়ী ভাষণ যেখানে তিনি স্বাধীনতার ডাক দেন।" },
  { name_en: "Declaration of Independence", name_bn: "স্বাধীনতার ঘোষণা", year: 1971, category: "declaration", description_en: "Formal declaration of Bangladesh's independence on March 26, 1971 following Operation Searchlight.", description_bn: "১৯৭১ সালের ২৬শে মার্চ প্রথম প্রহরে বাংলাদেশের আনুষ্ঠানিক স্বাধীনতা ঘোষণা।" },
  { name_en: "Bangladesh Liberation War", name_bn: "বাংলাদেশের স্বাধীনতা যুদ্ধ", year: 1971, category: "war", description_en: "Nine-month armed conflict culminating in the victory of Mukti Bahini and joint forces over Pakistan forces.", description_bn: "মুক্তিবাহিনীর বীরত্বপূর্ণ নয় মাসের সশস্ত্র রক্তক্ষয়ী সংগ্রাম যার মাধ্যমে অর্জিত হয় স্বাধীন বাংলাদেশ।" },
  { name_en: "Victory Day (16th December)", name_bn: "মহান বিজয় দিবস", year: 1971, category: "victory", description_en: "Surrender of Pakistani military forces and official birth of sovereign Bangladesh on December 16, 1971.", description_bn: "পাকিস্তানি বাহিনীর আত্মসমর্পণের মাধ্যমে ১৯৭১ সালের ১৬ই ডিসেম্বর অর্জিত হয় চুড়ান্ত বিজয়।" },
  { name_en: "1990 Mass Uprising", name_bn: "৯০-এর এরশাদবিরোধী গণঅভ্যুত্থান", year: 1990, category: "uprising", description_en: "Pro-democracy popular movement forcing the resignation of military dictator Hussain Muhammad Ershad.", description_bn: "সামরিক স্বৈরাচার এরশাদের পতনের মাধ্যমে দেশে গণতন্ত্র পুনরুদ্ধারের গণআন্দোলন।" },
  { name_en: "2024 Student-People Uprising (July Revolution)", name_bn: "২০২৪-এর ছাত্র-জনতার বিপ্লব", year: 2024, category: "revolution", description_en: "Nationwide student-led mass uprising ending 15 years of autocratic rule in August 2024.", description_bn: "২০২৪ সালের আগস্টে বৈষম্যবিরোধী ছাত্র আন্দোলনে সৈরাচার শাসনের অবসান ঘটানো ঐতিহাসিক ছাত্র-জনতার বিপ্লব।" }
];

const birSreshthoFighters = [
  { name_en: "Captain Mohiuddin Jahangir", name_bn: "ক্যাপ্টেন মহিউদ্দিন জাহাঙ্গীর", title: "Bir Sreshtho", sector: 7, description_en: "Heroic Mukti Bahini officer awarded Bir Sreshtho for exceptional bravery during the assault on Chapainawabganj in December 1971.", description_bn: "১৯৭১ সালের ডিসেম্বরে চাঁপাইনবাবগঞ্জ জয়ে সাহসিকতার জন্য বীরশ্রেষ্ঠ উপাধিতে ভূষিত শহীদ বীর মুক্তিযোদ্ধা।" },
  { name_en: "Sepoy Hamidur Rahman", name_bn: "সিপাহী হামিদুর রহমান", title: "Bir Sreshtho", sector: 4, description_en: "Youngest Bir Sreshtho recipient who sacrificed his life destroying an enemy machine-gun post at Dhalai outpost.", description_bn: "ধলাই সীমান্তে শত্রুর মেশিনগান পোস্ট ধ্বংস করতে গিয়ে বীরত্বের সাথে শহীদ হওয়া সর্বকনিষ্ঠ বীরশ্রেষ্ঠ।" },
  { name_en: "Sepoy Mustafa Kamal", name_bn: "সিপাহী মোস্তফা কামাল", title: "Bir Sreshtho", sector: 2, description_en: "Martyred freedom fighter who single-handedly held off enemy troops at Daruin village to cover his comrades' retreat.", description_bn: "সহযোদ্ধাদের প্রাণ রক্ষায় ব্রাহ্মণবাড়িয়ার দরুইনে এককভাবে শত্রুকে ঠেকিয়ে রেখে আত্মদানকারী বীরশ্রেষ্ঠ।" },
  { name_en: "Engine Room Artificer Mohammad Ruhul Amin", name_bn: "ইঞ্জিন রুম আর্টিফিসার মোহাম্মাদ রুহুল আমিন", title: "Bir Sreshtho", sector: 10, description_en: "Naval hero martyred aboard gunboat BNS Palash in the Rupsha River during the final phase of 1971 war.", description_bn: "১৯৭১ সালের ডিসেম্বরে রূপসা নদীতে বিএনএস পলাশ গানবোটে শহীদ হওয়া নৌবাহিনীর বীরশ্রেষ্ঠ।" },
  { name_en: "Flight Lieutenant Matiur Rahman", name_bn: "ফ্লাইট লেফট্যানেন্ট মতিউর রহমান", title: "Bir Sreshtho", sector: 11, description_en: "Air Force pilot who attempted to commandeer a jet aircraft to join the Liberation War, sacrificing his life.", description_bn: "মুক্তিযুদ্ধে যোগ দিতে বিমান ছিনতাইয়ের চেষ্টাকালে আত্মোৎসর্গকারী বিমানবাহিনীর বীরশ্রেষ্ঠ।" },
  { name_en: "Lance Naik Munshi Abdur Rouf", name_bn: "ল্যান্স নায়েক মুন্সি আব্দুর রউফ", title: "Bir Sreshtho", sector: 1, description_en: "EPR soldier who held off enemy gunboats with an MG-42 in Naniarchar, Rangamati, saving over 150 comrades.", description_bn: "রাঙ্গামাটির নানিয়ারচরে ১৫০ জন সহযোদ্ধার জীবন রক্ষায় এককভাবে ভারী মেশিনগান দিয়ে শত্রুকে রুখে দেওয়া বীরশ্রেষ্ঠ।" },
  { name_en: "Lance Naik Nur Mohammad Sheikh", name_bn: "ল্যান্স নায়েক নূর মোহাম্মদ শেখ", title: "Bir Sreshtho", sector: 8, description_en: "EPR freedom fighter who fought heroically while critically injured to cover fellow soldiers in Jessore.", description_bn: "যশোর সীমান্তে গুরুতর আহত অবস্থায় সহযোদ্ধাদের নিরাপদ পিছু হটতে সাহায্য করে আত্মদানকারী বীরশ্রেষ্ঠ।" }
];

const iconicScientists = [
  { name_en: "Jagadish Chandra Bose", name_bn: "জগদীশ চন্দ্র বসু", field: "Physics & Plant Physiology", description_en: "Pioneer in radio and microwave optics, inventor of the crescograph measuring plant responses to stimuli.", description_bn: "রেডিও ও অণুতরঙ্গের অগ্রদূত এবং উদ্ভিদের প্রাণ পরিমাপক ক্রেস্কোগ্রাফ যন্ত্রের আবিষ্কারক বিশ্বখ্যাত বিজ্ঞানী।" },
  { name_en: "Satyendra Nath Bose", name_bn: "সত্যেন্দ্রনাথ বসু", field: "Theoretical Physics", description_en: "World-renowned physicist famous for Bose-Einstein statistics and predicting Boson particles.", description_bn: "বোস-আইনস্টাইন সংখ্যায়ন এবং বোসন কণার নামকরণে স্মরণীয় বিশ্ববরেণ্য পদার্থবিজ্ঞানী।" },
  { name_en: "Meghnad Saha", name_bn: "মেঘনাদ সাহা", field: "Astrophysics", description_en: "Famous astrophysicist known for the Saha ionization equation describing chemical and physical conditions in stars.", description_bn: "নক্ষত্রের তাপীয় আয়নায়ন সমীকরণের আবিষ্কারক বিখ্যাত জ্যোতির্বিজ্ঞানী।" },
  { name_en: "Dr. Muhammad Kudrat-i-Khuda", name_bn: "ড. মুহম্মদ কুদরাত-এ-খুদা", field: "Organic Chemistry", description_en: "Renowned Bangladeshi chemist, educator, and founder of BCSIR.", description_bn: "বিসিএসআইআর (BCSIR)-এর প্রতিষ্ঠাতা ও প্রখ্যাত বাংলাদেশি জৈব রসায়নবিদ।" },
  { name_en: "Dr. Fazlur Rahman Khan (F.R. Khan)", name_bn: "ড. ফজলুর রহমান খান", field: "Structural Engineering", description_en: "Structural engineer known as the 'Einstein of Structural Engineering', designer of the Sears Tower and John Hancock Center.", description_bn: "শিকাগোর সিয়ার্স টাওয়ারের স্থপতি এবং আধুনিক স্কাইস্ক্র্যাপার কাঠামোর স্বপ্নদ্রষ্টা বিশ্বখ্যাত প্রকৌশলী।" },
  { name_en: "Dr. Maqsudul Alam", name_bn: "ড. মাকসুদুল আলম", field: "Genomics", description_en: "Renowned Bangladeshi scientist who led the genome sequencing of Jute (Pat) and Rubber trees.", description_bn: "তোষা ও দেশি পাটের জীবনরহস্য (জিহোম ডিকোর্ডিং) উন্মোচনকারী বাংলাদেশি বিজ্ঞানী।" },
  { name_en: "Dr. Jamal Nazrul Islam", name_bn: "ড. জামাল নজরুল ইসলাম", field: "Mathematical Physics & Cosmology", description_en: "World-class mathematical physicist known for pioneering work on the ultimate fate of the universe.", description_bn: "মহাবিশ্বের চূড়ান্ত পরিণতি নিয়ে গবেষণাকারী কালজয়ী বাংলাদেশি গাণিতিক পদার্থবিজ্ঞানী ও মহাবিশ্ববিদ।" }
];

async function seed() {
  console.log("🌱 Seeding historic events & freedom fighters...");
  for (const event of historicEvents) {
    await prisma.historicalEvent.create({
      data: {
        name_en: event.name_en,
        name_bn: event.name_bn,
        description_en: event.description_en,
        description_bn: event.description_bn,
        year: event.year,
        category: event.category,
        source: "liberation_war_museum",
        source_url: "https://liberationwarmuseum.org",
        verified: true,
        needs_image: false,
      },
    });
  }

  for (const fighter of birSreshthoFighters) {
    await prisma.freedomFighter.create({
      data: {
        name_en: fighter.name_en,
        name_bn: fighter.name_bn,
        description_en: fighter.description_en,
        description_bn: fighter.description_bn,
        awarded_title: fighter.title,
        sector: `Sector ${fighter.sector}`,
        source: "molwa_gov_bd",
        source_url: "https://molwa.gov.bd",
        verified: true,
        needs_image: false,
      },
    });
  }

  for (const sci of iconicScientists) {
    await prisma.scientist.create({
      data: {
        name_en: sci.name_en,
        name_bn: sci.name_bn,
        description_en: sci.description_en,
        description_bn: sci.description_bn,
        field: sci.field,
        source: "bas_gov_bd",
        source_url: "http://bas.org.bd",
        verified: true,
        needs_image: false,
      },
    });
  }
  console.log("✅ Historic events, Bir Sreshtho heroes, and Scientists successfully seeded.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

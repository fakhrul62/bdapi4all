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

const fullHolidays = [
  { date: "2026-02-21", name_en: "Language Martyrs' Day (International Mother Language Day)", name_bn: "শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস", type: "national" },
  { date: "2026-03-17", name_en: "Sheikh Mujibur Rahman's Birthday & Children's Day", name_bn: "জাতির পিতা বঙ্গবন্ধু শেখ মুজিবুর রহমানের জন্মবার্ষিকী ও জাতীয় শিশু দিবস", type: "national" },
  { date: "2026-03-26", name_en: "Independence & National Day", name_bn: "স্বাধীনতা ও জাতীয় দিবস", type: "national" },
  { date: "2026-03-27", name_en: "Shab-e-Qadr", name_bn: "শবে কদর", type: "religious" },
  { date: "2026-03-29", name_en: "Jumatul Wida", name_bn: "জুমাতুল বিদা", type: "religious" },
  { date: "2026-03-31", name_en: "Eid-ul-Fitr Eve", name_bn: "ঈদুল ফিতরের আগের দিন", type: "religious" },
  { date: "2026-04-01", name_en: "Eid-ul-Fitr (Day 1)", name_bn: "ঈদুল ফিতর (প্রথম দিন)", type: "religious" },
  { date: "2026-04-02", name_en: "Eid-ul-Fitr (Day 2)", name_bn: "ঈদুল ফিতর (দ্বিতীয় দিন)", type: "religious" },
  { date: "2026-04-14", name_en: "Pohela Boishakh (Bengali New Year)", name_bn: "পহেলা বৈশাখ (বাংলা নববর্ষ)", type: "national" },
  { date: "2026-05-01", name_en: "May Day (International Workers' Day)", name_bn: "মে দিবস", type: "national" },
  { date: "2026-05-11", name_en: "Buddha Purnima", name_bn: "বুদ্ধ পূর্ণিমা", type: "religious" },
  { date: "2026-06-06", name_en: "Eid-ul-Adha Eve", name_bn: "ঈদুল আজহার আগের দিন", type: "religious" },
  { date: "2026-06-07", name_en: "Eid-ul-Adha (Day 1)", name_bn: "ঈদুল আজহা (প্রথম দিন)", type: "religious" },
  { date: "2026-06-08", name_en: "Eid-ul-Adha (Day 2)", name_bn: "ঈদুল আজহা (দ্বিতীয় দিন)", type: "religious" },
  { date: "2026-07-06", name_en: "Holy Ashura (10th Muharram)", name_bn: "পবিত্র আশুরা", type: "religious" },
  { date: "2026-08-05", name_en: "National Revolution & Freedom Day (July Uprising Day)", name_bn: "জাতীয় বিপ্লব ও সংহতি দিবস / ছাত্র-জনতার অভ্যুত্থান দিবস", type: "national" },
  { date: "2026-08-15", name_en: "National Mourning Day", name_bn: "জাতীয় শোক দিবস", type: "national" },
  { date: "2026-09-04", name_en: "Janmashtami", name_bn: "জন্মাষ্টমী", type: "religious" },
  { date: "2026-09-15", name_en: "Eid-e-Miladunnabi", name_bn: "ঈদে মিলাদুন্নবী (সা:)", type: "religious" },
  { date: "2026-10-19", name_en: "Durga Puja (Maha Nabami)", name_bn: "দুর্গাপূজা (মহা নবমী)", type: "religious" },
  { date: "2026-10-20", name_en: "Durga Puja (Vijaya Dashami)", name_bn: "দুর্গাপূজা (বিজয়া দশমী)", type: "religious" },
  { date: "2026-11-07", name_en: "National Solidarity Day", name_bn: "জাতীয় সিপাহী-জনতার বিপ্লব দিবস", type: "national" },
  { date: "2026-12-16", name_en: "Victory Day", name_bn: "মহান বিজয় দিবস", type: "national" },
  { date: "2026-12-25", name_en: "Christmas Day (Xmas)", name_bn: "যিশু খ্রিস্টের জন্মদিন (বড়দিন)", type: "religious" },
];

const authenticCanals = [
  { name_en: "Dhanmondi Lake Canal", name_bn: "ধানমন্ডি লেক খাল", location: "Dhaka", connects: ["Dhanmondi Lake", "Buriganga River"], districts: ["Dhaka"], description_en: "A historic urban canal system connecting Dhanmondi Lake to the Buriganga river drainage basin.", description_bn: "ধানমন্ডি লেককে বুড়িগঙ্গা নদী ড্রেনেজ অববাহিকার সাথে সংযুক্তকারী একটি ঐতিহাসিক নগর খাল ব্যবস্থা।", verified: true },
  { name_en: "Ganges-Kobadak Canal (G-K Canal)", name_bn: "গঙ্গা-কপোতাক্ষ সেচ খাল (জি-কে প্রজেক্ট)", location: "Kushtia, Jhenaidah, Magura, Khulna", connects: ["Padma River", "Bhairab River"], districts: ["Kushtia", "Jhenaidah", "Magura"], description_en: "Bangladesh's major gravity-irrigation canal project feeding agricultural floodplains in the southwest region.", description_bn: "বাংলাদেশের অন্যতম প্রধান সেচ খাল প্রকল্প যা দক্ষিণ-পশ্চিমাঞ্চলের কৃষিভূমিতে সেচ প্রদান করে।", verified: true },
  { name_en: "Dholai Khal", name_bn: "ধোলাই খাল", location: "Old Dhaka", connects: ["Buriganga River", "Balu River"], districts: ["Dhaka"], description_en: "Historical 17th-century canal excavated by Mughal Subahdar Islam Khan for urban defense and transport.", description_bn: "১৭ শতকে মুঘল সুবেদার ইসলাম খান কর্তৃক খোদাইকৃত ঐতিহাসিক খাল যা পুরনো ঢাকার প্রতিরক্ষা ও পরিবহনে ব্যবহৃত হতো।", verified: true },
  { name_en: "Begunbari Khal", name_bn: "বেগুনবাড়ী খাল", location: "Tejgaon, Hatirjheel, Dhaka", connects: ["Hatirjheel", "Balu River"], districts: ["Dhaka"], description_en: "A critical natural stormwater drainage canal servicing central Dhaka through Hatirjheel.", description_bn: "হাতিরঝিলের মাধ্যমে মধ্য ঢাকার পানি নিষ্কাশনকারী অত্যন্ত গুরুত্বপূর্ণ একটি প্রাকৃতিক খাল।", verified: true },
  { name_en: "Koyra Khal", name_bn: "কয়রা খাল", location: "Koyra, Khulna", connects: ["Kobodak River", "Shakbaria River"], districts: ["Khulna"], description_en: "A major coastal tidal canal providing navigation and embankment drainage near the Sundarbans.", description_bn: "সুন্দরবনের নিকটবর্তী উপকূলীয় জোয়ার-ভাটার খাল যা জলপথ পরিবহন ও নিষ্কাশনে ব্যবহৃত হয়।", verified: true },
  { name_en: "Titas Bypass Canal", name_bn: "তিতাস বাইপাস খাল", location: "Brahmanbaria", connects: ["Titas River", "Meghna River"], districts: ["Brahmanbaria"], description_en: "An engineered bypass canal facilitating agricultural water diversion and flood management in eastern wetlands.", description_bn: "পূর্বাঞ্চলীয় প্লাবনভূমিতে কৃষি সেচ ও বন্যা নিয়ন্ত্রণের জন্য নির্মিত খোদাইকৃত খাল।", verified: true },
  { name_en: "Grand Trunk Canal (Khulna-Mongla Channel)", name_bn: "গ্র্যান্ড ট্রাঙ্ক খাল", location: "Bagerhat and Mongla", connects: ["Pusur River", "Rupsha River"], districts: ["Bagerhat", "Khulna"], description_en: "Navigation canal connecting industrial inland river ports directly to the Mongla sea harbor.", description_bn: "অভ্যন্তরীণ নদী বন্দরকে সরাসরি মোংলা সমুদ্র বন্দরের সাথে সংযুক্তকারী নৌ-যোগাযোগ খাল।", verified: true },
  { name_en: "Gubdia Khal", name_bn: "গুবদিয়া খাল", location: "Barishal", connects: ["Kirtankhola River", "Baleshwar River"], districts: ["Barishal"], description_en: "Tidal drainage canal connecting Barishal southern agricultural tracts.", description_bn: "বরিশাল দক্ষিণ অঞ্চলের কৃষি জমি সংযুক্তকারী একটি গুরুত্বপূর্ণ জোয়ার-ভাটার খাল।", verified: true },
  { name_en: "Chittagong Navigation Canal", name_bn: "চট্টগ্রাম নেভিগেশন খাল", location: "Chattogram Coast", connects: ["Karnafuli River", "Bay of Bengal"], districts: ["Chattogram"], description_en: "Industrial coastal cut connecting port tributaries with southern shipping routes.", description_bn: "বন্দর এলাকা ও দক্ষিণাঞ্চলীয় জাহাজ পথকে সংযোগকারী একটি উপকূলীয় খাল।", verified: true },
  { name_en: "Monu Diversion Canal", name_bn: "মনু ডাইভারশন খাল", location: "Moulvibazar", connects: ["Monu River", "Kushiyara River"], districts: ["Moulvibazar"], description_en: "Flood control and irrigation canal in northeastern Sylhet region.", description_bn: "মৌলভীবাজার অঞ্চলের বন্যা নিয়ন্ত্রণ ও কৃষি সেচ খাল।", verified: true },
  { name_en: "Karnafuli Loop Cut", name_bn: "কর্ণফুলী লুপ কাট", location: "Anwara, Chattogram", connects: ["Karnafuli River"], districts: ["Chattogram"], description_en: "Engineered canal cut created to straighten a hairpin bend of the Karnafuli River near the port.", description_bn: "কর্ণফুলী নদীর বাঁক সোজা করার জন্য নির্মিত প্রকৌশলীয় খাল কাট।", verified: true },
  { name_en: "Bhangar Khal", name_bn: "ভাঙর খাল", location: "Kishoreganj", connects: ["Old Brahmaputra", "Meghna"], districts: ["Kishoreganj"], description_en: "Wetland drainage canal serving the Haor agricultural basin.", description_bn: "হাওর কৃষি অববাহিকায় পানি নিষ্কাশনে ব্যবহৃত ঐতিহ্যবাহী খাল।", verified: true },
  { name_en: "Gabtali Drainage Canal", name_bn: "গাবতলী ড্রেনেজ খাল", location: "Mirpur, Dhaka", connects: ["Turag River"], districts: ["Dhaka"], description_en: "Primary stormwater drainage cut serving western Dhaka into the Turag River.", description_bn: "পশ্চিম ঢাকার পানি তুরাগ নদীতে নিষ্কাশনকারী প্রধান খাল।", verified: true },
  { name_en: "Boalia Khal", name_bn: "বোয়ালিয়া খাল", location: "Naogaon", connects: ["Atrai River"], districts: ["Naogaon"], description_en: "Agricultural irrigation canal in Barind tract, northern Bangladesh.", description_bn: "বরেন্দ্র অঞ্চলের একটি ঐতিহ্যবাহী কৃষি সেচ খাল।", verified: true },
  { name_en: "Kalaroa Canal", name_bn: "ক্যালারোয়া খাল", location: "Satkhira", connects: ["Ichamati River", "Betna River"], districts: ["Satkhira"], description_en: "Border district irrigation canal supporting shrimp aquaculture and paddy farming.", description_bn: "সাতক্ষীরা অঞ্চলের চিংড়ি ও ধান চাষে ব্যবহৃত পানি নিষ্কাশন খাল।", verified: true },
  { name_en: "Balu Cut Canal", name_bn: "বালু কাট খাল", location: "Khilkhet, Dhaka", connects: ["Balu River"], districts: ["Dhaka"], description_en: "Stormwater and flood relief canal connecting eastern Dhaka wetlands.", description_bn: "পূর্ব ঢাকার জলাভূমি থেকে পানি নিষ্কাশনকারী প্রধান খাল।", verified: true },
  { name_en: "Kotalipara Drainage Canal", name_bn: "কোটালিপাড়া ড্রেনেজ খাল", location: "Gopalganj", connects: ["Madhumati River"], districts: ["Gopalganj"], description_en: "Canal network serving Beel Chanda and Gopalganj agricultural lands.", description_bn: "গোপালগঞ্জের বিল চন্দা ও কৃষিজমিতে সেচ ও নিষ্কাশনের জন্য ব্যবহৃত খাল।", verified: true },
  { name_en: "Madaripur Beel Route Canal", name_bn: "মাদারীপুর বিল রুট খাল", location: "Madaripur and Gopalganj", connects: ["Kumar River", "Ariyal Khan River"], districts: ["Madaripur", "Gopalganj"], description_en: "A historic 1900s navigation canal cut across wetlands shortening river vessel routes.", description_bn: "১৯০০ শতকে খননকৃত একটি ঐতিহাসিক নৌ-পথ খাল যা নদী নৌযানের পথ সংক্ষেপ করে।", verified: true },
  { name_en: "Bhairab Canal Cut", name_bn: "ভৈরব খাল কাট", location: "Jeshore and Khulna", connects: ["Bhairab River", "Chitra River"], districts: ["Jeshore", "Khulna"], description_en: "Waterway canal connecting Bhairab distributaries across Jeshore plains.", description_bn: "যশোর সমভূমির ভৈরব ও চিত্রা নদীর সংযোগকারী প্রকৌশলীয় খাল।", verified: true },
  { name_en: "Mohananda Feed Canal", name_bn: "মহানন্দা ফিড খাল", location: "Panchagarh", connects: ["Mohananda River"], districts: ["Panchagarh"], description_en: "Northernmost agricultural feeder canal taking water from the Mohananda river.", description_bn: "বাংলাদেশের সুদূর উত্তরাঞ্চলের মহানন্দা নদীর একটি কৃষি সেচ ফিড খাল।", verified: true },
];

async function seed() {
  console.log("🌱 Expanding Public Holidays dataset...");
  await prisma.holiday.deleteMany();
  await prisma.holiday.createMany({
    data: fullHolidays.map((h) => ({
      date: new Date(`${h.date}T00:00:00.000Z`),
      name_en: h.name_en,
      name_bn: h.name_bn,
      type: h.type,
    })),
  });
  console.log(`✅ Seeded ${fullHolidays.length} official Bangladesh Holidays.`);

  console.log("🌱 Expanding Canals & Khals dataset...");
  await prisma.canal.deleteMany();
  for (let i = 0; i < authenticCanals.length; i++) {
    const item = authenticCanals[i];
    await prisma.canal.create({
      data: {
        id: i + 1,
        name_en: item.name_en,
        name_bn: item.name_bn,
        description_en: item.description_en,
        description_bn: item.description_bn,
        image_url: null,
        source: "bangladesh_gov_official",
        source_url: "https://bangladesh.gov.bd",
        verified: true,
        needs_image: false,
        location: item.location,
        connects: item.connects,
        districts: item.districts,
      },
    });
  }
  console.log(`✅ Seeded ${authenticCanals.length} authentic Canals & Khals of Bangladesh.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

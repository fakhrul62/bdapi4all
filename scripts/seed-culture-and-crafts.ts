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

const clothingItems = [
  { name_en: "Jamdani Saree", name_bn: "জামদানি শাড়ি", gender: "female", description_en: "UNESCO Intangible Cultural Heritage fine hand-woven Bengali muslin saree with geometric floral motifs originating from Narayanganj and Dhaka.", description_bn: "ইউনেস্কো স্বীকৃত সুপ্রাচীন ঢাকাই সূক্ষ্ম হাতে বোনা প্রথাগত জামদানি শাড়ি।" },
  { name_en: "Dhakai Muslin Saree", name_bn: "ঢাকাই মসলিন শাড়ি", gender: "female", description_en: "Legendary ultra-fine cotton textile woven from Phuti Karpas cotton in Dhaka region, revived as a GI-tagged heritage product.", description_bn: "ফুটি কার্পাস তুলো থেকে প্রস্তুত ঢাকার কিংবদন্তি অতি-সূক্ষ্ম জিআই সার্টিফাইড ঐতিহ্যবাহী বস্ত্র।" },
  { name_en: "Rajshahi Silk Saree", name_bn: "রাজশাহী সিল্ক শাড়ি", gender: "female", description_en: "High quality Mulberry and Mulberry-tussar silk saree produced in the silk capital Rajshahi.", description_bn: "রেশম নগরী রাজশাহীর তুত তুঁত গুটি থেকে তৈরি বিখ্যাত রেশমি শাড়ি।" },
  { name_en: "Tangail Tant Saree", name_bn: "টাঙ্গাইল তাঁতের শাড়ি", gender: "female", description_en: "GI-tagged handloom cotton saree woven by traditional weavers (Tanti) in Tangail region.", description_bn: "টাঙ্গাইলের ঐতিহ্যবাহী তাঁতিদের হাতে বোনা সুতি ও সিল্ক পাড়ের বিখ্যাত শাড়ি।" },
  { name_en: "Traditional Bengali Lungi", name_bn: "ঐতিহ্যবাহী লুঙ্গি", gender: "male", description_en: "Comfortable tube-like cotton garment worn by Bangladeshi men in everyday life and rural areas.", description_bn: "বাংলাদেশের পুরুষদের নিত্যদিনের ও গ্রামীণ জীবনের সবচেয়ে আরামদায়ক সুতি পোশাক।" },
  { name_en: "Bengali Panjabi & Pajama", name_bn: "বাঙালি পাঞ্জাবি ও পায়জামা", gender: "male", description_en: "Traditional long tunic worn by men during festivals, weddings, and Eid celebrations.", description_bn: "উৎসব, বিবাহ ও ঈদের দিনে পুরুষদের ঐতিহ্যবাহী পোশাক।" },
  { name_en: "Fotua", name_bn: "ফতুয়া", gender: "unisex", description_en: "Short relaxed collarless cotton shirt popular during hot Bengali summer months.", description_bn: "গরমের দিনে আরামদায়ক সংক্ষিপ্ত ঐতিহ্যবাহী সুতি শার্ট।" },
  { name_en: "Gamcha", name_bn: "গামছা", gender: "unisex", description_en: "Traditional thin checkered cotton towel worn as neck wrap or waist sash across rural Bangladesh.", description_bn: "গ্রামীণ বাংলাদেশে বহুল ব্যবহৃত চেক আঁকা পাতলা সুতি তোয়ালে।" },
  { name_en: "Chakma Pinon Tishna", name_bn: "চাকমা পিনোন হাদি", gender: "female", description_en: "Traditional hand-woven two-piece attire worn by indigenous Chakma women in Chittagong Hill Tracts.", description_bn: "পার্বত্য চট্টগ্রামের চাকমা নারীদের হস্তচালিত তাঁতে বোনা রঙিন ঐতিহ্যবাহী পোশাক।" },
  { name_en: "Garo Dokmanda & Doksari", name_bn: "গারো দকমান্দা", gender: "female", description_en: "Hand-woven colorful wraparound skirt worn by Garo women in Mymensingh and Netrokona.", description_bn: "ময়মনসিংহ অঞ্চলের গারো মহিলাদের হাতে বোনা বৈচিত্র্যময় নকশার স্কার্ট পোশাক।" }
];

const musicItems = [
  { name_en: "Bhatiali Folk Music", name_bn: "ভাটিয়ালি গান", type: "bhatiali", description_en: "Traditional riverine boatman song category sung across flat river deltas of Bangladesh.", description_bn: "বাংলাদেশের নদীমাতৃক অঞ্চলের মাঝিদের ঐতিহ্যবাহী প্রাণস্পর্শী লোকসংগীত।" },
  { name_en: "Bhawaiya Folk Song", name_bn: "ভাওয়াইয়া গান", type: "bhawaiya", description_en: "Melancholic Northern folk music style originating from Rangpur and Kurigram, traditionally sung by bullock cart drivers.", description_bn: "উত্তরবঙ্গের রংপুর ও কুড়িগ্রাম অঞ্চলের মহিষের গাড়িয়ালদের আবেগঘন ঐতিহ্যবাহী লোকগান।" },
  { name_en: "Baul Sangeet", name_bn: "বাউল সঙ্গীত", type: "baul", description_en: "UNESCO-recognized mystic spiritual songs of Bauls, expressing philosophy of the human body and divine love.", description_bn: "ইউনেস্কো স্বীকৃত বাংলার বাউল সাধকদের আত্মিক ও খাঁটি মননশীল মরমি গান।" },
  { name_en: "Gombhira", name_bn: "গম্ভীরা", type: "gombhira", description_en: "Satirical folk performance and song tradition of Rajshahi and Chapainawabganj featuring grandfather-grandson dialogue.", description_bn: "রাজশাহী ও চাঁপাইনবাবগঞ্জের নানা-নাতির সংলাপভিত্তিক সামাজিক ও রাজনৈতিক হাস্যরসের গান।" },
  { name_en: "Lalon Geeti", name_bn: "লালন গীতি", type: "baul", description_en: "Spiritual songs composed by mystic saint Lalon Shah of Kushtia emphasizing humanity above religion.", description_bn: "কুষ্টিয়ার মহাত্মা লালন সাঁই রচিত মানবতাবাদী মরমী বাউল গান।" },
  { name_en: "Ektara", name_bn: "একতারা", type: "instrument", description_en: "Iconic single-stringed instrument played by Bauls and folk minstrels across Bengal.", description_bn: "বাউল ও লোকশিল্পীদের প্রধান একতারযুক্ত সুরযন্ত্র।" },
  { name_en: "Dotara", name_bn: "দোতারা", type: "instrument", description_en: "Plucked string instrument with four strings widely used in Bhawaiya and Baul music.", description_bn: "ভাওয়াইয়া ও বাউল গানে ব্যাপকভাবে ব্যবহৃত চার তারের লোকবাদ্যযন্ত্র।" },
  { name_en: "Bamboo Flute (Banshi)", name_bn: "বাঁশের বাঁশি", type: "instrument", description_en: "Traditional musical flute made of indigenous bamboo, central to rural Bengali music.", description_bn: "গ্রামবাংলার গানের প্রাণের সুপ্রাচীন বাঁশের সুরযন্ত্র।" }
];

const craftItems = [
  { name_en: "Nakshi Kantha", name_bn: "নকশী কাঁথা", region: "Mymensingh, Jamalpur, Rajshahi", description_en: "UNESCO-recognized embroidered quilt made with running stitch depicting Bengali folklore and flora.", description_bn: "ইউনেস্কো স্বীকৃত গ্রামীণ মহিলাদের সূঁচের ফোঁড়ে তৈরি লোকশিল্প ও আখ্যানধর্মী সেলাই কাঁথা।" },
  { name_en: "Shital Pati (Cool Mat)", name_bn: "শীতল পাটি", region: "Sylhet and Sunamganj", description_en: "UNESCO Intangible Cultural Heritage cool weaving mat made from Murta cane (Schumannianthus dichotomus).", description_bn: "ইউনেস্কো স্বীকৃত সিলেটের মুর্তা গাছের বেত দিয়ে তৈরি আরামদায়ক হস্তশিল্প পাটি।" },
  { name_en: "Clay Pottery & Terracotta", name_bn: "মৃৎশিল্প ও পোড়ামাটির ফলক", region: "Dhamrai, Faridpur, Bogura", description_en: "Traditional terracotta tile and earthenware pottery crafted by Kumar artisan communities.", description_bn: "কুম্ভকার সম্প্রদায়ের তৈরি ঐতিহ্যবাহী মাটির হাড়ি, পাত্র ও পোড়ামাটির টেরাকোট শিল্প।" },
  { name_en: "Jute Crafts & Handicrafts", name_bn: "পাটজাত হস্তশিল্প", region: "Nationwide", description_en: "Eco-friendly handicraft items made from Golden Fibre jute including bags, mats, and wall hangings.", description_bn: "সোনার আঁশ পাট থেকে তৈরি বহুমুখী প্রাকৃতিক হস্তশিল্প।" },
  { name_en: "Rickshaw Painting / Rickshaw Art", name_bn: "রিকশা চিত্র (রিকশা আর্ট)", region: "Dhaka", description_en: "UNESCO Intangible Cultural Heritage vibrant urban folk art painting backboards and hoods of Dhaka rickshaws.", description_bn: "ইউনেস্কো স্বীকৃত ঢাকার সাইকেল রিকশার রঙিন ও বর্ণিল ঐতিহ্যবাহী শহর লোকচিত্র।" }
];

async function seed() {
  console.log("🌱 Seeding traditional clothing, music, and crafts...");
  for (const item of clothingItems) {
    await prisma.traditionalClothing.create({
      data: {
        name_en: item.name_en,
        name_bn: item.name_bn,
        description_en: item.description_en,
        description_bn: item.description_bn,
        gender: item.gender,
        source: "bscic_gov_bd",
        source_url: "http://bscic.gov.bd",
        verified: true,
        needs_image: false,
      },
    });
  }

  for (const item of musicItems) {
    await prisma.traditionalMusic.create({
      data: {
        name_en: item.name_en,
        name_bn: item.name_bn,
        description_en: item.description_en,
        description_bn: item.description_bn,
        type: item.type,
        source: "shilpakala_gov_bd",
        source_url: "http://shilpakala.gov.bd",
        verified: true,
        needs_image: false,
      },
    });
  }

  for (const item of craftItems) {
    await prisma.traditionalCraft.create({
      data: {
        name_en: item.name_en,
        name_bn: item.name_bn,
        description_en: item.description_en,
        description_bn: item.description_bn,
        region: item.region,
        source: "folkartmuseum_gov_bd",
        source_url: "http://folkartmuseum.gov.bd",
        verified: true,
        needs_image: false,
      },
    });
  }
  console.log("✅ Traditional clothing, music, and crafts successfully seeded.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

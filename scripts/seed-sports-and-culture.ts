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

const sportsCategoriesList = [
  { name_en: "Cricket", name_bn: "ক্রিকেট", type: "team", description_en: "The most popular team sport in Bangladesh, governed by the Bangladesh Cricket Board (BCB).", description_bn: "বাংলাদেশের সর্বাধিক জনপ্রিয় দলগত খেলা।", source: "nsc_gov_bd" },
  { name_en: "Football", name_bn: "ফুটবল", type: "team", description_en: "Widely played national sport governed by the Bangladesh Football Federation (BFF).", description_bn: "বাংলাদেশ ফুটবল ফেডারেশন (BFF) দ্বারা পরিচালিত ফুটবল খেলা।", source: "nsc_gov_bd" },
  { name_en: "Kabaddi (Ha-du-du)", name_bn: "কাবাডি (হাডুডু)", type: "team", description_en: "The official National Sport of Bangladesh (জাতীয় খেলা), deeply rooted in Bengali rural culture.", description_bn: "বাংলাদেশের অফিসিয়াল জাতীয় খেলা কাবাডি (হাডুডু)।", source: "nsc_gov_bd" },
  { name_en: "Archery", name_bn: "আর্চারি (তীরন্দাজি)", type: "individual", description_en: "Rapidly growing international sport for Bangladesh with Asian Games and World Cup medals.", description_bn: "আন্তর্জাতিক অঙ্গনে বাংলাদেশের সাফল্যমণ্ডিত তীরন্দাজি খেলা।", source: "nsc_gov_bd" },
  { name_en: "Chess", name_bn: "দাবা", type: "individual", description_en: "Intellectual sport with Grandmaster pioneers like Niaz Murshed.", description_bn: "গ্র্যান্ডমাস্টার নিয়াজ মোর্শেদের সূচনা করা বুদ্ধিবৃত্তিক খেলা।", source: "nsc_gov_bd" }
];

const legendPlayers = [
  { name_en: "Shakib Al Hasan", name_bn: "সাকিব আল হাসান", sport_id: 1, is_legend: true, role: "All-rounder", description_en: "Widely regarded as the greatest Bangladeshi cricketer of all time and premier ICC #1 all-rounder.", description_bn: "বাংলাদেশের সর্বকালের সর্বশ্রেষ্ঠ ক্রিকেটার এবং বিশ্বসেরা অলরাউন্ডার।" },
  { name_en: "Tamim Iqbal", name_bn: "তামিম ইকবাল", sport_id: 1, is_legend: true, role: "Opening Batsman", description_en: "Leading international run-scorer and premier opening batsman in Bangladesh cricket history.", description_bn: "বাংলাদেশ ক্রিকেট ইতিহাসের শীর্ষ রানসংগ্রহকারী ওপেনিং ব্যাটার।" },
  { name_en: "Mushfiqur Rahim", name_bn: "মুশফিকুর রহিম", sport_id: 1, is_legend: true, role: "Wicketkeeper-Batsman", description_en: "First Bangladeshi cricketer to score a double century in Test cricket.", description_bn: "টেস্ট ক্রিকেটে বাংলাদেশের প্রথম ডাবল সেঞ্চুরিয়ান।" },
  { name_en: "Mashrafe Mortaza", name_bn: "মাশরাফী বিন মোর্ত্তজা", sport_id: 1, is_legend: true, role: "Pace Bowler & Captain", description_en: "Iconic captain who led Bangladesh cricket to historic victories in World Cups and ODI series.", description_bn: "বাংলাদেশ ক্রিকেট দলের সফলতম সাবেক অধিনায়ক ও গতিদানকারী পেসার।" },
  { name_en: "Kazi Salahuddin", name_bn: "কাজী সালাহউদ্দিন", sport_id: 2, is_legend: true, role: "Forward", description_en: "Legendary 1970s football star and South Asian football icon.", description_bn: "বাংলাদেশের ফুটবল ইতিহাসের কিংবদন্তি ফরোয়ার্ড।" },
  { name_en: "Sabina Khatun", name_bn: "সাবিনা খাতুন", sport_id: 2, is_legend: true, role: "Forward & Captain", description_en: "Captain of the SAFF Championship-winning Bangladesh Women's National Football Team.", description_bn: "সাফ চ্যাম্পিয়ন বাংলাদেশ নারী ফুটবল দলের অধিনায়ক।" },
  { name_en: "Ruman Shana", name_bn: "রোমান সানা", sport_id: 4, is_legend: true, role: "Archer", description_en: "First Bangladeshi archer to qualify directly for the Tokyo Olympics and win World Cup gold.", description_bn: "অলিম্পিকে সরাসরি কোয়ালিফাই করা বিশ্বসেরা বাংলাদেশি আরচার।" },
  { name_en: "Niaz Murshed", name_bn: "নিয়াজ মোর্শেদ", sport_id: 5, is_legend: true, role: "Grandmaster", description_en: "South Asia's first Grandmaster (GM) in Chess, achieving the title in 1987.", description_bn: "দক্ষিণ এশিয়ার প্রথম দাবার গ্র্যান্ডমাস্টার।" }
];

async function seed() {
  console.log("🌱 Verifying Sports Categories and Legend Players...");
  for (const cat of sportsCategoriesList) {
    const existing = await prisma.sportsCategory.findFirst({ where: { name_en: cat.name_en } });
    if (!existing) {
      await prisma.sportsCategory.create({ data: cat });
    }
  }

  for (const p of legendPlayers) {
    const existing = await prisma.player.findFirst({ where: { name_en: p.name_en } });
    if (!existing) {
      await prisma.player.create({
        data: {
          name_en: p.name_en,
          name_bn: p.name_bn,
          description_en: p.description_en,
          description_bn: p.description_bn,
          sport_id: p.sport_id,
          is_legend: p.is_legend,
          source: "bcb_bff_official",
          source_url: "https://tigercricket.com.bd",
          verified: true,
          needs_image: false,
        },
      });
    }
  }
  console.log("✅ Sports categories and Legend Players seeded successfully.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

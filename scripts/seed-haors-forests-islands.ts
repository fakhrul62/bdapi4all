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

const authenticHaors = [
  { name_en: "Hakaluki Haor", name_bn: "হাকালুকি হাওর", location: "Moulvibazar and Sylhet", districts: ["Moulvibazar", "Sylhet"], area_sq_km: 181.5, description_en: "One of Asia's largest complex wetland ecosystems and a critical wintering ground for migratory birds in Sylhet basin.", description_bn: "এশিয়ার বৃহত্তম জটিল জলাভূমি বাস্তুতন্ত্রের একটি এবং মহাদেশীয় অভিবাসী পাখিদের প্রধান শীতকালীন আবাসস্থল।" },
  { name_en: "Tanguar Haor", name_bn: "টাঙ্গুয়ার হাওর", location: "Sunamganj", districts: ["Sunamganj"], area_sq_km: 100.0, description_en: "A UNESCO Ramsar site of international importance in Tahirpur and Dharmapasha upazilas.", description_bn: "ইউনেস্কো স্বীকৃত আন্তর্জাতিক গুরুত্বসম্পন্ন রামসার স্থান যা সুনামগঞ্জের তাহিরপুর ও ধর্মপাশায় অবস্থিত।" },
  { name_en: "Chalan Beel", name_bn: "চলন বিল", location: "Pabna, Natore, Sirajganj", districts: ["Pabna", "Natore", "Sirajganj"], area_sq_km: 375.0, description_en: "The largest inland wetland and depression complex in northern Rajshahi division formed by Atrai tributaries.", description_bn: "উত্তরবঙ্গের বৃহত্তম প্রাকৃতিক জলাভূমি অববাহিকা যা আত্রাই নদীর শাখা নদী দ্বারা গঠিত।" },
  { name_en: "Hail Haor", name_bn: "হাইল হাওর", location: "Sreemangal, Moulvibazar", districts: ["Moulvibazar"], area_sq_km: 140.0, description_en: "A large permanent wetland basin hosting Baikka Beel sanctuary and rich freshwater fish biodiversity.", description_bn: "বাইক্কা বিল অভয়ারণ্য ধারণকারী বিস্তৃত স্থায়ী হাওর জলাভূমি।" },
  { name_en: "Dekhar Haor", name_bn: "দেখার হাওর", location: "Sunamganj Sadar", districts: ["Sunamganj"], area_sq_km: 85.0, description_en: "A major Boro rice producing wetland basin in central Sunamganj district.", description_bn: "সুনামগঞ্জ সদরের একটি প্রধান বোরো ধান উৎপাদনকারী হাওর এলাকা।" },
  { name_en: "Shanir Haor", name_bn: "শনির হাওর", location: "Tahirpur, Sunamganj", districts: ["Sunamganj"], area_sq_km: 72.0, description_en: "Historic wetland basin situated near the Meghalaya border foothills.", description_bn: "মেঘালয় পাদদেশের কাছে অবস্থিত ঐতিহাসিক গভীর হাওর অববাহিকা।" },
  { name_en: "Dingapota Haor", name_bn: "ডিঙ্গাপোতা হাওর", location: "Mohanganj, Netrokona", districts: ["Netrokona"], area_sq_km: 64.0, description_en: "Prominent haor basin in Netrokona known for massive seasonal Boro paddy harvesting.", description_bn: "নেত্রকোনার মোহনগঞ্জের একটি বিখ্যাত বিশাল বোরা ধান উৎপাদনকারী হাওর।" },
  { name_en: "Matian Haor", name_bn: "মাটিয়ান হাওর", location: "Tahirpur, Sunamganj", districts: ["Sunamganj"], area_sq_km: 55.0, description_en: "Vast wetland depression surrounded by the Kangsha and Jadukata river channels.", description_bn: "যাদুকাটা নদী দ্বারা পরিবেষ্টিত সুনামগঞ্জের অন্যতম বৃহত্তম প্লাবন হাওর।" },
  { name_en: "Patharchora Haor", name_bn: "পাথরচোরা হাওর", location: "Kulaura, Moulvibazar", districts: ["Moulvibazar"], area_sq_km: 42.0, description_en: "Freshwater wetland habitat supporting endemic fish species and indigenous waterfowl.", description_bn: "মৌলভীবাজার জেলার একটি গুরুত্বপূর্ণ মিঠাপানির হাওর জলাভূমি।" },
  { name_en: "Baram Haor", name_bn: "বারাম হাওর", location: "Derai, Sunamganj", districts: ["Sunamganj"], area_sq_km: 48.0, description_en: "Central Sunamganj haor basin providing seasonal fisheries and flood buffering.", description_bn: "সুনামগঞ্জ জেলার মধ্যবর্তী প্লাবন নিয়ন্ত্রণকারী হাওর।" },
  { name_en: "Dubli Haor", name_bn: "ডুবলি হাওর", location: "Itna, Kishoreganj", districts: ["Kishoreganj"], area_sq_km: 38.0, description_en: "Southern extension of the Surma-Kushiyara basin wetland complex in Kishoreganj.", description_bn: "কিশোরগঞ্জের ইটনা উপজেলায় অবস্থিত সুরমা-কুশিয়ারা অববাহিকার হাওর।" },
  { name_en: "Gurai Haor", name_bn: "গুরাই হাওর", location: "Nikli, Kishoreganj", districts: ["Kishoreganj"], area_sq_km: 50.0, description_en: "Scenic tourist wetland basin popular during the monsoon submerged season.", description_bn: "বর্ষাকালে পর্যটনের জন্য বিখ্যাত কিশোরগঞ্জের নিকলী সংলগ্ন প্রসারিত হাওর।" },
  { name_en: "Kawar Dighi Haor", name_bn: "কাওয়ার দীঘি হাওর", location: "Rajnagar, Moulvibazar", districts: ["Moulvibazar"], area_sq_km: 35.0, description_en: "Freshwater aquatic basin supporting local duck farming and inland fisheries.", description_bn: "মৌলভীবাজারের রাজনগরে অবস্থিত দেশীয় মাছের প্রজনন ও হাঁস খামার সমৃদ্ধ হাওর।" },
  { name_en: "Ariadighi Haor", name_bn: "আড়িয়াদিঘি হাওর", location: "Habiganj", districts: ["Habiganj"], area_sq_km: 29.0, description_en: "Habiganj plain wetland providing seasonal irrigation to surrounding Boro crop fields.", description_bn: "হবিগঞ্জের কৃষিজমিতে সেচ সরবরাহকারী ঐতিহ্যবাহী হাওর।" },
  { name_en: "Tural Haor", name_bn: "তুরাল হাওর", location: "Brahmanbaria", districts: ["Brahmanbaria"], area_sq_km: 31.0, description_en: "Brahmanbaria wetland basin bordering Titas and Meghna river floodplains.", description_bn: "ব্রাহ্মণবাড়িয়ার তিতাস ও মেঘনা অববাহিকা সংলগ্ন প্রাকৃতিক হাওর।" }
];

const authenticForests = [
  { name_en: "Sundarbans Reserve Forest", name_bn: "সুন্দরবন সংরক্ষিত বন", location: "Khulna, Bagerhat, Satkhira", forest_type: "mangrove", districts: ["Khulna", "Bagerhat", "Satkhira"], area_sq_km: 6017.0, description_en: "The world's largest continuous mangrove forest, UNESCO World Heritage site, and home of the Royal Bengal Tiger.", description_bn: "বিশ্বের বৃহত্তম ম্যানগ্রোভ বন, ইউনেস্কো ওয়ার্ল্ড হেরিটেজ সাইট এবং রয়েল বেঙ্গল টাইগারের প্রধান আবাসস্থল।" },
  { name_en: "Ratargul Swamp Forest", name_bn: "রাতারগুল সোয়াম্প ফরেস্ট", location: "Gowainghat, Sylhet", forest_type: "freshwater_swamp", districts: ["Sylhet"], area_sq_km: 2.0, description_en: "Bangladesh's only freshwater swamp forest, dominated by freshwater mangrove trees like Millettia pinnata (Koroch).", description_bn: "বাংলাদেশের একমাত্র স্বীকৃত মিঠাপানির জলাবন যা সিলেটের গোয়াইনঘাটে অবস্থিত।" },
  { name_en: "Lawachara National Park", name_bn: "লাউয়াছড়া জাতীয় উদ্যান", location: "Kamalganj, Moulvibazar", forest_type: "tropical_evergreen", districts: ["Moulvibazar"], area_sq_km: 12.5, description_en: "Semi-evergreen rainforest reserve famous for endangered Western Hoolock Gibbons and rich primate species.", description_bn: "বিলুপ্তপ্রায় উল্লুক ও বিরল বন্যপ্রাণী সমৃদ্ধ ক্রান্তীয় চিরহরিৎ জাতীয় উদ্যান।" },
  { name_en: "Madhupur Sal Forest", name_bn: "মধূপুর শাল বন", location: "Tangail and Mymensingh", forest_type: "deciduous_sal", districts: ["Tangail", "Mymensingh"], area_sq_km: 84.0, description_en: "Historic tropical moist deciduous Sal (Shorea robusta) forest tract on the Madhupur Tract plateau.", description_bn: "মধূপুর গড় এলাকার সুপ্রাচীন ট্রপিক্যাল শাল (গজারি) বৃক্ষের প্রধান প্রাকৃতিক বনাঞ্চল।" },
  { name_en: "Bhawal National Park", name_bn: "ভাওয়াল জাতীয় উদ্যান", location: "Gazipur", forest_type: "deciduous_sal", districts: ["Gazipur"], area_sq_km: 50.2, description_en: "Protected Sal forest park located near Gazipur providing green belt conservation and biodiversity.", description_bn: "গাজীপুরে অবস্থিত শাল বৃক্ষ সমৃদ্ধ অন্যতম প্রাচীন সংরক্ষিত জাতীয় উদ্যান।" },
  { name_en: "Satchari National Park", name_bn: "সাতছড়ি জাতীয় উদ্যান", location: "Chhabagh, Habiganj", forest_type: "tropical_evergreen", districts: ["Habiganj"], area_sq_km: 2.4, description_en: "Tropical evergreen hill forest tract in Habiganj district named after seven hill streams.", description_bn: "সাতটি পাহাড়ি ছড়ার নামানুসারে নামাঙ্কিত হবিগঞ্জের চিরহরিৎ বনাঞ্চল।" },
  { name_en: "Rema-Kalenga Wildlife Sanctuary", name_bn: "রেমা-কালেঙ্গা বন্যপ্রাণী অভয়ারণ্য", location: "Chhabagh, Habiganj", forest_type: "dry_evergreen", districts: ["Habiganj"], area_sq_km: 17.9, description_en: "Second largest natural hill forest in Bangladesh hosting rare birds and flying squirrels.", description_bn: "বাংলাদেশের দ্বিতীয় বৃহত্তম প্রাকৃতিক পাহাড়ি বনাঞ্চল ও বন্যপ্রাণী অভয়ারণ্য।" },
  { name_en: "Sitakunda Eco Park & Botanical Garden", name_bn: "সীীতাকুণ্ড ইকোপার্ক ও উদ্ভিদ উদ্যান", location: "Sitakunda, Chattogram", forest_type: "coastal_hill", districts: ["Chattogram"], area_sq_km: 8.0, description_en: "Coastal hill eco-park featuring natural waterfalls, orchids, and evergreen slopes.", description_bn: "প্রাকৃতিক ঝরনা ও পাহাড়ি উদ্ভিদ সমৃদ্ধ চট্টগ্রামের বিখ্যাত উপকূলীয় ইকোপার্ক।" },
  { name_en: "Kaptai National Park", name_bn: "কাপ্তাই জাতীয় উদ্যান", location: "Kaptai, Rangamati", forest_type: "hill_evergreen", districts: ["Rangamati"], area_sq_km: 54.6, description_en: "Hill forest park surrounding Kaptai Lake harboring Asian elephants and teak plantations.", description_bn: "কাপ্তাই হ্রদ পরিবেষ্টিত এশীয় হাতি ও সেগুন কাঠের সমৃদ্ধ পাহাড়ি জাতীয় উদ্যান।" },
  { name_en: "Chimbuk Hill Reserve Forest", name_bn: "চিম্বুক পাহাড়ি সংরক্ষিত বন", location: "Bandarban", forest_type: "hill_evergreen", districts: ["Bandarban"], area_sq_km: 35.0, description_en: "High-altitude hill forest in Chittagong Hill Tracts home to indigenous tribes and diverse flora.", description_bn: "বান্দরবানের পাহাড়ি সংরক্ষিত বনাঞ্চল যা পাহাড়ি উপজাতি ও বন্যপ্রাণীর নিবাস।" },
  { name_en: "Dulahazara Safari Park (Bangsabandhu Safari Park)", name_bn: "ডুলাহাজরা সাফারি পার্ক", location: "Chakaria, Cox's Bazar", forest_type: "coastal_forest", districts: ["Cox's Bazar"], area_sq_km: 9.0, description_en: "First safari park of Bangladesh dedicated to wildlife breeding and conservation in Cox's Bazar.", description_bn: "কক্সবাজারের চকোরিয়ায় অবস্থিত বাংলাদেশের প্রথম প্রাতিষ্ঠানিক সাফারি পার্ক।" },
  { name_en: "Nijhum Dwip National Park", name_bn: "নিঝুম দ্বীপ জাতীয় উদ্যান", location: "Hatiya, Noakhali", forest_type: "coastal_mangrove", districts: ["Noakhali"], area_sq_km: 163.5, description_en: "Coastal mangrove island national park famous for thousands of spotted deer (Axis axis).", description_bn: "হাজার হাজার চিত্রল হরিণের বিখ্যাত নোয়াখালীর উপকূলীয় দ্বীপ জাতীয় উদ্যান।" }
];

const authenticIslands = [
  { name_en: "Saint Martin's Island", name_bn: "সেন্ট মার্টিনস দ্বীপ (নারিকেল জিঞ্জিরা)", location: "Bay of Bengal, Cox's Bazar", waterbody: "Bay of Bengal", districts: ["Cox's Bazar"], area_sq_km: 3.0, description_en: "Bangladesh's only coral island located in the northeastern part of the Bay of Bengal.", description_bn: "বঙ্গোপসাগরের উত্তর-পূর্বাঞ্চলে অবস্থিত বাংলাদেশের একমাত্র প্রবাল দ্বীপ।" },
  { name_en: "Chera Dwip", name_bn: "ছেঁড়া দ্বীপ", location: "South of Saint Martin's", waterbody: "Bay of Bengal", districts: ["Cox's Bazar"], area_sq_km: 0.5, description_en: "Uninhabited coral islet located at the southernmost tip of Bangladesh.", description_bn: "বাংলাদেশের সর্বদক্ষিণে অবস্থিত সেন্ট মার্টিনস সংলগ্ন জনমানবহীন প্রবাল দ্বীপ।" },
  { name_en: "Bhola Island", name_bn: "ভোলা দ্বীপ", location: "Meghna Estuary", waterbody: "Meghna River & Bay of Bengal", districts: ["Bhola"], area_sq_km: 3403.0, description_en: "The largest offshore island of Bangladesh located at the mouth of the Meghna River.", description_bn: "মেঘনা নদীর মোহনায় অবস্থিত বাংলাদেশের বৃহত্তম উপকূলীয় দ্বীপ।" },
  { name_en: "Sandwip", name_bn: "সন্দ্বীপ", location: "Meghna Estuary, Chattogram", waterbody: "Bay of Bengal", districts: ["Chattogram"], area_sq_km: 762.0, description_en: "Historic coastal island in the Meghna estuary known for ancient salt production and seafaring.", description_bn: "চট্টগ্রাম উপকূলে অবস্থিত বহু সুপ্রাচীন ঐতিহাসিক সাগর দ্বীপ।" },
  { name_en: "Hatiya Island", name_bn: "হাতিয়া দ্বীপ", location: "Noakhali Coast", waterbody: "Bay of Bengal", districts: ["Noakhali"], area_sq_km: 371.0, description_en: "Large offshore island in the Bay of Bengal subject to dynamic river silt accretion.", description_bn: "নোয়াখালী উপকূলে মেঘনার মোহনায় অবস্থিত অন্যতম প্রধান সামুদ্রিক দ্বীপ।" },
  { name_en: "Manpura Island", name_bn: "মনপুরা দ্বীপ", location: "Bhola District", waterbody: "Bay of Bengal", districts: ["Bhola"], area_sq_km: 373.0, description_en: "Scenic estuarine island in Bhola known for fisheries and lush coconut groves.", description_bn: "ভোলা জেলার অন্তর্গত নৈসর্গিক সৌন্দর্য ও মৎস্য সম্পদে সমৃদ্ধ উপকূলীয় দ্বীপ।" },
  { name_en: "Kutubdia Island", name_bn: "কুতুবদিয়া দ্বীপ", location: "Cox's Bazar Coast", waterbody: "Bay of Bengal", districts: ["Cox's Bazar"], area_sq_km: 215.0, description_en: "Coastal island famous for Bangladesh's oldest lighthouse and traditional salt panning.", description_bn: "কক্সবাজারের অন্তর্গত প্রাচীন বাতিঘর ও ঐতিহ্যবাহী লবণ শিল্পের জন্য বিখ্যাত দ্বীপ।" },
  { name_en: "Moheshkhali Island", name_bn: "মহেশখালী দ্বীপ", location: "Cox's Bazar", waterbody: "Bay of Bengal", districts: ["Cox's Bazar"], area_sq_km: 268.0, description_en: "The only hilly island of Bangladesh, famous for the Adinath Temple on Mainak Hill.", description_bn: "মৈনাক পাহাড়ের আদিনাথ মন্দিরের জন্য বিখ্যাত বাংলাদেশের একমাত্র পাহাড়ি দ্বীপ।" },
  { name_en: "Sonadia Island", name_bn: "সোনাদিয়া দ্বীপ", location: "Moheshkhali, Cox's Bazar", waterbody: "Bay of Bengal", districts: ["Cox's Bazar"], area_sq_km: 49.0, description_en: "Ecologically critical estuarine island supporting sea turtle nesting and migratory birds.", description_bn: "সামুদ্রিক কচ্ছপের প্রজনন ও পরিযায়ী পাখির জন্য গুরুত্বপূর্ণ পরিবেশগত দ্বীপ।" },
  { name_en: "Dublar Char", name_bn: "দুবলার চর", location: "Sundarbans Coast", waterbody: "Bay of Bengal", districts: ["Bagerhat"], area_sq_km: 65.0, description_en: "Famous coastal island in the Sundarbans renowned for traditional dry fish (Shutki) curing and Rash Mela.", description_bn: "সুন্দরবনের দক্ষিণে অবস্থিত ঐতিহ্যবাহী শুঁটকি প্রক্রিয়াজাতকরণ ও রাস মেলার চর দ্বীপ।" },
  { name_en: "Nijhum Dwip", name_bn: "নিঝুম দ্বীপ", location: "South Hatiya, Noakhali", waterbody: "Bay of Bengal", districts: ["Noakhali"], area_sq_km: 163.5, description_en: "Coastal cluster island formed in the 1950s, famous for dense mangrove park and spotted deer.", description_bn: "১৯৫০-এর দশকে জেগে ওঠা ম্যানগ্রোভ বনাঞ্চল ও হাজার চিত্রল হরিণের দ্বীপ।" },
  { name_en: "Char Kukri Mukri", name_bn: "চর কুকরি মুকরি", location: "Char Fashion, Bhola", waterbody: "Bay of Bengal", districts: ["Bhola"], area_sq_km: 40.0, description_en: "Southernmost island of Bhola featuring wildlife sanctuaries, mangroves, and pristine beaches.", description_bn: "ভোলা জেলার সর্বদক্ষিণে অবস্থিত বন্যপ্রাণী অভয়ারণ্য সমৃদ্ধ চরাঞ্চল দ্বীপ।" },
  { name_en: "Char Alexander", name_bn: "চর আলেকজান্ডার", location: "Ramgati, Lakshmipur", waterbody: "Meghna Estuary", districts: ["Lakshmipur"], area_sq_km: 85.0, description_en: "Accreted riverine island in the lower Meghna channel.", description_bn: "লক্ষ্মীপুরের রামগতি সংলগ্ন নিম্ন মেঘনা নদীতে জেগে ওঠা চর।" },
  { name_en: "Urir Char", name_bn: "উড়ির চর", location: "Sandwip Channel", waterbody: "Bay of Bengal", districts: ["Chattogram"], area_sq_km: 110.0, description_en: "Coastal char island in the Sandwip channel dedicated to cattle grazing and agriculture.", description_bn: "সন্দ্বীপ চ্যানেল সংলগ্ন কৃষিকাজ ও গবাদিপশু চারণের চর দ্বীপ।" }
];

async function seed() {
  console.log("🌱 Expanding Haors dataset...");
  await prisma.haor.deleteMany();
  for (let i = 0; i < authenticHaors.length; i++) {
    const item = authenticHaors[i];
    await prisma.haor.create({
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
        districts: item.districts,
        area_sq_km: item.area_sq_km,
      },
    });
  }
  console.log(`✅ Seeded ${authenticHaors.length} Haors of Bangladesh.`);

  console.log("🌱 Expanding Forests dataset...");
  await prisma.forest.deleteMany();
  for (let i = 0; i < authenticForests.length; i++) {
    const item = authenticForests[i];
    await prisma.forest.create({
      data: {
        name_en: item.name_en,
        name_bn: item.name_bn,
        description_en: item.description_en,
        description_bn: item.description_bn,
        image_url: null,
        source: "bforest_gov_bd",
        source_url: "http://bforest.gov.bd",
        verified: true,
        needs_image: false,
        location: item.location,
        forest_type: item.forest_type,
        districts: item.districts,
      },
    });
  }
  console.log(`✅ Seeded ${authenticForests.length} Forests of Bangladesh.`);

  console.log("🌱 Expanding Islands dataset...");
  await prisma.island.deleteMany();
  for (let i = 0; i < authenticIslands.length; i++) {
    const item = authenticIslands[i];
    await prisma.island.create({
      data: {
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
        waterbody: item.waterbody,
        districts: item.districts,
      },
    });
  }
  console.log(`✅ Seeded ${authenticIslands.length} Islands of Bangladesh.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

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

const authenticRivers = [
  { name_en: "Padma", name_bn: "পদ্মা", length_km: 120, origin: "Himalayas", flows_through: ["Rajshahi", "Pabna", "Faridpur"], description_en: "A major trans-boundary river in Bangladesh, being the main distributary of the Ganges.", description_bn: "বাংলাদেশের একটি প্রধান আন্তঃসীমান্ত নদী, যা গঙ্গা নদীর প্রধান শাখা।" },
  { name_en: "Meghna", name_bn: "মেঘনা", length_km: 264, origin: "Barail Range", flows_through: ["Sylhet", "Comilla", "Bhola"], description_en: "One of the most important rivers in Bangladesh, forming the world's largest delta.", description_bn: "বাংলাদেশের অন্যতম গুরুত্বপূর্ণ নদী, যা বিশ্বের বৃহত্তম বদ্বীপ গঠন করে।" },
  { name_en: "Jamuna", name_bn: "যমুনা", length_km: 205, origin: "Himalayas", flows_through: ["Kurigram", "Bogra", "Sirajganj"], description_en: "One of the three main rivers of Bangladesh, it is the lower stream of the Brahmaputra River.", description_bn: "বাংলাদেশের তিনটি প্রধান নদীর একটি, এটি ব্রহ্মপুত্র নদের নিম্ন স্রোত।" },
  { name_en: "Teesta", name_bn: "তিস্তা", length_km: 115, origin: "Pahunri", flows_through: ["Lalmonirhat", "Rangpur", "Gaibandha"], description_en: "A major river originating in the Himalayas, flowing through northern Bangladesh.", description_bn: "হিমালয় থেকে উৎপন্ন একটি প্রধান নদী, যা উত্তর বাংলাদেশের মধ্য দিয়ে প্রবাহিত।" },
  { name_en: "Karnaphuli", name_bn: "কর্ণফুলী", length_km: 320, origin: "Lushai Hills", flows_through: ["Rangamati", "Chattogram"], description_en: "The largest and most important river in Chattogram and the Chittagong Hill Tracts.", description_bn: "চট্টগ্রাম ও পার্বত্য চট্টগ্রামের সবচেয়ে বড় এবং গুরুত্বপূর্ণ নদী।" },
  { name_en: "Surma", name_bn: "সুরমা", length_km: 900, origin: "Manipur Hills", flows_through: ["Sylhet", "Sunamganj"], description_en: "A major river in Bangladesh, part of the Surma-Meghna River System.", description_bn: "বাংলাদেশের একটি প্রধান নদী, যা সুরমা-মেঘনা নদী ব্যবস্থার অংশ।" },
  { name_en: "Kushiyara", name_bn: "কুশিয়ারা", length_km: 161, origin: "Barak River", flows_through: ["Sylhet", "Habiganj"], description_en: "A distributary river in Bangladesh and Assam, forming part of the Surma-Meghna river system.", description_bn: "বাংলাদেশ এবং আসামের একটি শাখা নদী, যা সুরমা-মেঘনা নদী ব্যবস্থার অংশ।" },
  { name_en: "Buriganga", name_bn: "বুড়িগঙ্গা", length_km: 18, origin: "Dhaleshwari River", flows_through: ["Dhaka"], description_en: "A tide-influenced river flowing past the southwest outskirts of Dhaka city.", description_bn: "ঢাকা শহরের দক্ষিণ-পশ্চিম পাশ দিয়ে প্রবাহিত জোয়ার-প্রভাবিত একটি নদী।" },
  { name_en: "Sangu", name_bn: "সাঙ্গু", length_km: 270, origin: "Arakan Hills", flows_through: ["Bandarban", "Chattogram"], description_en: "A picturesque river flowing through the Chittagong Hill Tracts.", description_bn: "পার্বত্য চট্টগ্রামের মধ্য দিয়ে প্রবাহিত একটি মনোরম নদী।" },
  { name_en: "Feni", name_bn: "ফেনী", length_km: 116, origin: "Tripura", flows_through: ["Feni", "Chattogram"], description_en: "A transboundary river that flows between India and Bangladesh.", description_bn: "ভারত এবং বাংলাদেশের মধ্যে প্রবাহিত একটি আন্তঃসীমান্ত নদী।" },
  { name_en: "Ariyal Khan", name_bn: "আড়িয়াল খাঁ", length_km: 160, origin: "Padma River", flows_through: ["Faridpur", "Madaripur", "Barishal"], description_en: "A major distributary of the Padma river.", description_bn: "পদ্মা নদীর একটি প্রধান শাখা নদী।" },
  { name_en: "Pashur", name_bn: "পশুর", length_km: 142, origin: "Bhairab River", flows_through: ["Khulna", "Bagerhat"], description_en: "A major river in the Sundarbans mangrove forest region.", description_bn: "সুন্দরবন ম্যানগ্রোভ বন অঞ্চলের একটি প্রধান নদী।" },
  { name_en: "Rupsha", name_bn: "রূপসা", length_km: 9, origin: "Bhairab River", flows_through: ["Khulna"], description_en: "A short but significant river in Khulna, formed by the union of the Bhairab and Atrai.", description_bn: "ভৈরব ও আত্রাই নদীর মিলনে গঠিত খুলনার একটি ছোট কিন্তু তাৎপর্যপূর্ণ নদী।" },
  { name_en: "Dhaleshwari", name_bn: "ধলেশ্বরী", length_km: 160, origin: "Jamuna River", flows_through: ["Tangail", "Manikganj", "Dhaka"], description_en: "A prominent distributary of the Jamuna river in central Bangladesh.", description_bn: "মধ্য বাংলাদেশের যমুনা নদীর একটি বিশিষ্ট শাখা নদী।" },
  { name_en: "Atrai", name_bn: "আত্রাই", length_km: 390, origin: "West Bengal", flows_through: ["Dinajpur", "Naogaon", "Natore"], description_en: "A transboundary river flowing from West Bengal through northern Bangladesh.", description_bn: "পশ্চিমবঙ্গ থেকে উত্তর বাংলাদেশের মধ্য দিয়ে প্রবাহিত একটি আন্তঃসীমান্ত নদী।" },
  { name_en: "Old Brahmaputra", name_bn: "পুরাতন ব্রহ্মপুত্র", length_km: 276, origin: "Brahmaputra River", flows_through: ["Mymensingh", "Kishoreganj", "Bhairab"], description_en: "The former main channel of the Brahmaputra River.", description_bn: "ব্রহ্মপুত্র নদের প্রাক্তন প্রধান চ্যানেল।" },
  { name_en: "Kirtankhola", name_bn: "কীর্তনখোলা", length_km: 160, origin: "Arial Khan", flows_through: ["Barishal"], description_en: "A river flowing adjacent to Barishal city.", description_bn: "বরিশাল শহরের পাশ দিয়ে প্রবাহিত একটি নদী।" },
  { name_en: "Turag", name_bn: "তুরাগ", length_km: 71, origin: "Bansi River", flows_through: ["Gazipur", "Dhaka"], description_en: "An upper tributary of the Buriganga, flowing near Dhaka.", description_bn: "বুড়িগঙ্গার একটি উপরের উপনদী, যা ঢাকার কাছাকাছি প্রবাহিত হয়।" },
  { name_en: "Shitalakshya", name_bn: "শীতলক্ষ্যা", length_km: 110, origin: "Old Brahmaputra", flows_through: ["Narayanganj", "Gazipur"], description_en: "A significant distributary of the Old Brahmaputra, known for industrial areas along its banks.", description_bn: "পুরানো ব্রহ্মপুত্রের একটি উল্লেখযোগ্য শাখা নদী, যার তীরে শিল্প অঞ্চল গড়ে উঠেছে।" },
  { name_en: "Chitra", name_bn: "চিত্রা", length_km: 170, origin: "Mathabhanga River", flows_through: ["Chuadanga", "Magura", "Narail"], description_en: "A river in southwestern Bangladesh known for the Chitra Puja festival.", description_bn: "দক্ষিণ-পশ্চিম বাংলাদেশের একটি নদী যা চিত্রা পূজা উৎসবের জন্য পরিচিত।" },
  { name_en: "Mathabhanga", name_bn: "মাথাভাঙ্গা", length_km: 121, origin: "Padma River", flows_through: ["Kushtia", "Meherpur", "Chuadanga"], description_en: "An offshoot of the Padma flowing near the India-Bangladesh border.", description_bn: "ভারত-বাংলাদেশ সীমান্তের কাছাকাছি প্রবাহিত পদ্মার একটি শাখা।" },
  { name_en: "Ichamati", name_bn: "ইছামতি", length_km: 334, origin: "Mathabhanga River", flows_through: ["Satkhira", "North 24 Parganas"], description_en: "A transboundary river that serves as a border between India and Bangladesh.", description_bn: "একটি আন্তঃসীমান্ত নদী যা ভারত ও বাংলাদেশের মধ্যে সীমান্ত হিসেবে কাজ করে।" },
  { name_en: "Nabaganga", name_bn: "নবগঙ্গা", length_km: 214, origin: "Mathabhanga River", flows_through: ["Jhenaidah", "Magura"], description_en: "A river in southwestern Bangladesh historically connected to the Ganges.", description_bn: "ঐতিহাসিকভাবে গঙ্গার সাথে যুক্ত দক্ষিণ-পশ্চিম বাংলাদেশের একটি নদী।" },
  { name_en: "Bhairab", name_bn: "ভৈরব", length_km: 250, origin: "Jalangi River", flows_through: ["Meherpur", "Jhenaidah", "Khulna"], description_en: "An important river in the Ganges delta region of southwestern Bangladesh.", description_bn: "দক্ষিণ-পশ্চিম বাংলাদেশের গঙ্গা ব-দ্বীপ অঞ্চলের একটি গুরুত্বপূর্ণ নদী।" },
  { name_en: "Kaliganga", name_bn: "কালীগঙ্গা", length_km: 78, origin: "Dhaleshwari", flows_through: ["Manikganj"], description_en: "A river flowing through Manikganj district, splitting from the Dhaleshwari.", description_bn: "মানিকগঞ্জ জেলার মধ্য দিয়ে প্রবাহিত একটি নদী, যা ধলেশ্বরী থেকে বিভক্ত।" },
  { name_en: "Halda", name_bn: "হালদা", length_km: 106, origin: "Badnatali Hill", flows_through: ["Khagrachari", "Chattogram"], description_en: "The only natural carp breeding center in Bangladesh and South Asia.", description_bn: "বাংলাদেশ ও দক্ষিণ এশিয়ার একমাত্র প্রাকৃতিক কার্প প্রজনন কেন্দ্র।" },
  { name_en: "Matamuhuri", name_bn: "মাতামুহুরী", length_km: 287, origin: "Arakan Yoma", flows_through: ["Bandarban", "Cox's Bazar"], description_en: "A river in southeastern Bangladesh flowing into the Bay of Bengal.", description_bn: "দক্ষিণ-পূর্ব বাংলাদেশের একটি নদী যা বঙ্গোপসাগরে পতিত হয়।" },
  { name_en: "Bangshi", name_bn: "বংশী", length_km: 238, origin: "Old Brahmaputra", flows_through: ["Tangail", "Dhaka"], description_en: "A vital river in central Bangladesh contributing to local agriculture.", description_bn: "স্থানীয় কৃষিতে অবদান রাখা মধ্য বাংলাদেশের একটি অত্যাবশ্যক নদী।" },
  { name_en: "Louhajang", name_bn: "লৌহজং", length_km: 74, origin: "Jamuna", flows_through: ["Tangail"], description_en: "A prominent river in Tangail district that branches off the Jamuna.", description_bn: "যমুনা থেকে শাখা বিভক্ত টাঙ্গাইল জেলার একটি বিশিষ্ট নদী।" },
  { name_en: "Someshwari", name_bn: "সোমেশ্বরী", length_km: 50, origin: "Garo Hills", flows_through: ["Netrokona"], description_en: "A transboundary river known for crystal clear water near Durgapur.", description_bn: "দুর্গাপুরের কাছে স্ফটিক স্বচ্ছ জলের জন্য পরিচিত একটি আন্তঃসীমান্ত নদী।" },
  { name_en: "Piyain", name_bn: "পিয়াইন", length_km: 145, origin: "Meghalaya", flows_through: ["Sylhet"], description_en: "A scenic river flowing from Meghalaya through Jaflong.", description_bn: "মেঘালয় থেকে জাফলং হয়ে প্রবাহিত একটি মনোরম নদী।" },
  { name_en: "Titas", name_bn: "তিতাস", length_km: 98, origin: "Meghna River", flows_through: ["Brahmanbaria"], description_en: "A significant river in eastern Bangladesh famous in local literature.", description_bn: "স্থানীয় সাহিত্যে বিখ্যাত পূর্ব বাংলাদেশের একটি গুরুত্বপূর্ণ নদী।" },
  { name_en: "Dhalai", name_bn: "ধলই", length_km: 110, origin: "Tripura", flows_through: ["Moulvibazar"], description_en: "A transboundary river originating in Tripura and flowing into Moulvibazar.", description_bn: "ত্রিপুরায় উদ্ভূত এবং মৌলভীবাজারে প্রবাহিত একটি আন্তঃসীমান্ত নদী।" },
  { name_en: "Khowai", name_bn: "খোয়াই", length_km: 166, origin: "Atharamura Hills", flows_through: ["Habiganj"], description_en: "A transboundary river flowing from Tripura into Habiganj.", description_bn: "ত্রিপুরা থেকে হবিগঞ্জে প্রবাহিত একটি আন্তঃসীমান্ত নদী।" },
  { name_en: "Kangsha", name_bn: "কংস", length_km: 225, origin: "Garo Hills", flows_through: ["Sherpur", "Netrokona"], description_en: "A major river in the greater Mymensingh region.", description_bn: "বৃহত্তর ময়মনসিংহ অঞ্চলের একটি প্রধান নদী।" },
  { name_en: "Jadhukata", name_bn: "যাদুকাটা", length_km: 37, origin: "Meghalaya", flows_through: ["Sunamganj"], description_en: "A beautiful river in Sunamganj known for sand and stone mining.", description_bn: "সুনামগঞ্জের একটি সুন্দর নদী যা বালি ও পাথর উত্তোলনের জন্য পরিচিত।" },
  { name_en: "Karatoya", name_bn: "করতোয়া", length_km: 187, origin: "Jalpaiguri", flows_through: ["Panchagarh", "Bogra"], description_en: "A historically significant river in the Rajshahi division.", description_bn: "রাজশাহী বিভাগের একটি ঐতিহাসিকভাবে গুরুত্বপূর্ণ নদী।" },
  { name_en: "Punarbhaba", name_bn: "পুনর্ভবা", length_km: 160, origin: "Dinajpur", flows_through: ["Dinajpur"], description_en: "A river passing through Dinajpur city.", description_bn: "দিনাজপুর শহরের মধ্য দিয়ে প্রবাহিত একটি নদী।" },
  { name_en: "Mahananda", name_bn: "মহানন্দা", length_km: 360, origin: "Darjeeling", flows_through: ["Panchagarh", "Chapainawabganj"], description_en: "A major transboundary river flowing into Bangladesh at Tentulia.", description_bn: "তেঁতুলিয়া দিয়ে বাংলাদেশে প্রবাহিত একটি প্রধান আন্তঃসীমান্ত নদী।" },
  { name_en: "Dharla", name_bn: "ধরলা", length_km: 75, origin: "Himalayas", flows_through: ["Kurigram"], description_en: "A swift transboundary river meeting the Brahmaputra in Kurigram.", description_bn: "কুড়িগ্রামের ব্রহ্মপুত্রের সাথে মিলিত একটি দ্রুতগামী আন্তঃসীমান্ত নদী।" },
  { name_en: "Dudhkumar", name_bn: "দুধকুমার", length_km: 60, origin: "Bhutan", flows_through: ["Kurigram"], description_en: "A transboundary river originating in Bhutan and entering Bangladesh.", description_bn: "ভুটানে উৎপন্ন একটি আন্তঃসীমান্ত নদী যা বাংলাদেশে প্রবেশ করে।" },
  { name_en: "Arial Khan", name_bn: "আড়িয়াল খাঁ", length_km: 163, origin: "Padma", flows_through: ["Madaripur", "Barishal"], description_en: "A major river branch of the Padma in southern Bangladesh.", description_bn: "দক্ষিণ বাংলাদেশের পদ্মার একটি প্রধান নদী শাখা।" },
  { name_en: "Baleshwar", name_bn: "বালেশ্বর", length_km: 146, origin: "Gorai-Madhumati", flows_through: ["Bagerhat", "Pirojpur"], description_en: "A prominent river in the southwest region forming part of the Sundarbans network.", description_bn: "দক্ষিণ-পশ্চিম অঞ্চলের একটি বিশিষ্ট নদী যা সুন্দরবন নেটওয়ার্কের অংশ।" },
  { name_en: "Bishkhali", name_bn: "বিষখালী", length_km: 96, origin: "Kirtankhola", flows_through: ["Jhalokati", "Barguna"], description_en: "A coastal river in southern Bangladesh flowing into the Bay of Bengal.", description_bn: "বঙ্গোপসাগরে প্রবাহিত দক্ষিণ বাংলাদেশের একটি উপকূলীয় নদী।" },
  { name_en: "Pyra", name_bn: "পায়রা", length_km: 105, origin: "Tentulia", flows_through: ["Patuakhali"], description_en: "An important river in southern Bangladesh hosting the Payra seaport.", description_bn: "পায়রা সমুদ্রবন্দর পরিচালনাকারী দক্ষিণ বাংলাদেশের একটি গুরুত্বপূর্ণ নদী।" },
  { name_en: "Tentulia", name_bn: "তেঁতুলিয়া", length_km: 80, origin: "Meghna Estuary", flows_through: ["Bhola", "Barishal"], description_en: "A major channel separating Bhola Island from the mainland.", description_bn: "মূল ভূখণ্ড থেকে ভোলা দ্বীপকে পৃথককারী একটি প্রধান চ্যানেল।" },
  { name_en: "Haringhata", name_bn: "হরিণঘাটা", length_km: 40, origin: "Baleshwar River", flows_through: ["Barguna"], description_en: "An estuary mouth of the Baleshwar River leading into the sea.", description_bn: "সমুদ্রে পতিত বালেশ্বর নদীর একটি মোহনা।" },
  { name_en: "Kabadak", name_bn: "কপোতাক্ষ", length_km: 260, origin: "Mathabhanga River", flows_through: ["Jashore", "Satkhira"], description_en: "The Kapotaksha River, famously mentioned in Michael Madhusudan Dutt's poetry.", description_bn: "কপোতাক্ষ নদ, যা মাইকেল মধুসূদন দত্তের কবিতায় বিখ্যাতভাবে উল্লিখিত।" },
  { name_en: "Gorai", name_bn: "গড়াই", length_km: 267, origin: "Ganges River", flows_through: ["Kushtia", "Faridpur"], description_en: "One of the longest rivers in Bangladesh and a major distributary of the Ganges.", description_bn: "বাংলাদেশের দীর্ঘতম নদীগুলোর একটি এবং গঙ্গার একটি প্রধান শাখা নদী।" },
  { name_en: "Naf", name_bn: "নাফ", length_km: 62, origin: "Arakan Mountains", flows_through: ["Cox's Bazar"], description_en: "An estuary forming the border between Bangladesh and Myanmar.", description_bn: "বাংলাদেশ এবং মিয়ানমারের মধ্যে সীমান্ত গঠনকারী একটি মোহনা।" },
  { name_en: "Nandakuan", name_bn: "নন্দকুঁয়া", length_km: 25, origin: "Atrai", flows_through: ["Natore"], description_en: "A minor river in the Chalan Beel area.", description_bn: "চলন বিল এলাকার একটি ছোট নদী।" }
];

async function seed() {
  console.log("🌱 Expanding Rivers dataset...");
  await prisma.river.deleteMany();
  for (let i = 0; i < authenticRivers.length; i++) {
    const item = authenticRivers[i];
    await prisma.river.create({
      data: {
        name_en: item.name_en,
        name_bn: item.name_bn,
        description_en: item.description_en,
        description_bn: item.description_bn,
        image_url: null,
        source: "bwdb_official",
        source_url: "https://bwdb.gov.bd",
        verified: true,
        needs_image: false,
        length_km: item.length_km,
        origin: item.origin,
        flows_through: item.flows_through,
      },
    });
  }
  console.log(`✅ Seeded ${authenticRivers.length} Rivers of Bangladesh.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

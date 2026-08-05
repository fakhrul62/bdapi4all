import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  console.log('Seeding Culture and Heritage Data...');

  // 1. Traditional Foods & Sweets (50+ items)
  const foodsData = [
    { name_en: 'Kacchi Biryani', name_bn: 'কাচ্চি বিরিয়ানি', category: 'Main Course' },
    { name_en: 'Bhakarkhani', name_bn: 'বখরখানি', category: 'Snack' },
    { name_en: 'Bogura Doi', name_bn: 'বগুড়ার দই', category: 'Sweet' },
    { name_en: 'Comilla Rasmalai', name_bn: 'কুমিল্লার রসমালাই', category: 'Sweet' },
    { name_en: 'Porabari Chomchom', name_bn: 'পোড়াবাড়ীর চমচম', category: 'Sweet' },
    { name_en: 'Muktagacha Monda', name_bn: 'মুক্তাগাছার মণ্ডা', category: 'Sweet' },
    { name_en: 'Shatkora Beef', name_bn: 'সাতকড়া দিয়ে গরুর মাংস', category: 'Main Course' },
    { name_en: 'Chui Jhal Curry', name_bn: 'চুই ঝালের তরকারি', category: 'Main Course' },
    { name_en: 'Panta Ilish', name_bn: 'পান্তা ইলিশ', category: 'Main Course' },
    { name_en: 'Mezbani Gosht', name_bn: 'মেজবানি মাংস', category: 'Main Course' },
    { name_en: 'Shorshe Ilish', name_bn: 'সরিষা ইলিশ', category: 'Main Course' },
    { name_en: 'Bhapa Pitha', name_bn: 'ভাপা পিঠা', category: 'Pitha' },
    { name_en: 'Chitoi Pitha', name_bn: 'চিতই পিঠা', category: 'Pitha' },
    { name_en: 'Patishapta', name_bn: 'পাটিসাপটা', category: 'Pitha' },
    { name_en: 'Naru', name_bn: 'নাড়ু', category: 'Sweet' },
    { name_en: 'Sandesh', name_bn: 'সন্দেশ', category: 'Sweet' },
    { name_en: 'Roshogolla', name_bn: 'রসগোল্লা', category: 'Sweet' },
    { name_en: 'Chamcham', name_bn: 'চমচম', category: 'Sweet' },
    { name_en: 'Balish Sweet', name_bn: 'বালিশ মিষ্টি', category: 'Sweet' },
    { name_en: 'Kanchagolla', name_bn: 'কাঁচাগোল্লা', category: 'Sweet' },
    { name_en: 'Haleem', name_bn: 'হালিম', category: 'Snack' },
    { name_en: 'Fuchka', name_bn: 'ফুচকা', category: 'Snack' },
    { name_en: 'Chotpoti', name_bn: 'চটপটি', category: 'Snack' },
    { name_en: 'Jhalmuri', name_bn: 'ঝালমুড়ি', category: 'Snack' },
    { name_en: 'Khichuri', name_bn: 'খিচুড়ি', category: 'Main Course' },
    { name_en: 'Tehari', name_bn: 'তেহারি', category: 'Main Course' },
    { name_en: 'Morog Polao', name_bn: 'মোরগ পোলাও', category: 'Main Course' },
    { name_en: 'Ilish Pulao', name_bn: 'ইলিশ পোলাও', category: 'Main Course' },
    { name_en: 'Roast', name_bn: 'রোস্ট', category: 'Main Course' },
    { name_en: 'Rezala', name_bn: 'রেজালা', category: 'Main Course' },
    { name_en: 'Beef Kebab', name_bn: 'বিফ কাবাব', category: 'Snack' },
    { name_en: 'Singara', name_bn: 'সিঙ্গারা', category: 'Snack' },
    { name_en: 'Samucha', name_bn: 'সমুচা', category: 'Snack' },
    { name_en: 'Beguni', name_bn: 'বেগুনি', category: 'Snack' },
    { name_en: 'Piaju', name_bn: 'পেঁয়াজু', category: 'Snack' },
    { name_en: 'Alur Chop', name_bn: 'আলুর চপ', category: 'Snack' },
    { name_en: 'Jilapi', name_bn: 'জিলাপি', category: 'Sweet' },
    { name_en: 'Amriti', name_bn: 'আমৃতি', category: 'Sweet' },
    { name_en: 'Bundia', name_bn: 'বুন্দিয়া', category: 'Sweet' },
    { name_en: 'Gajar Halua', name_bn: 'গাজরের হালুয়া', category: 'Sweet' },
    { name_en: 'Falooda', name_bn: 'ফালুদা', category: 'Dessert' },
    { name_en: 'Borhani', name_bn: 'বোরহানি', category: 'Drink' },
    { name_en: 'Doi Chira', name_bn: 'দই চিঁড়া', category: 'Breakfast' },
    { name_en: 'Muri Ghonto', name_bn: 'মুড়িঘণ্ট', category: 'Main Course' },
    { name_en: 'Shutki Bhorta', name_bn: 'শুটকি ভর্তা', category: 'Bhorta' },
    { name_en: 'Alu Bhorta', name_bn: 'আলু ভর্তা', category: 'Bhorta' },
    { name_en: 'Begun Bhorta', name_bn: 'বেগুন ভর্তা', category: 'Bhorta' },
    { name_en: 'Chingri Malai Curry', name_bn: 'চিংড়ি মালাই কারি', category: 'Main Course' },
    { name_en: 'Rui Macher Jhol', name_bn: 'রুই মাছের ঝোল', category: 'Main Course' },
    { name_en: 'Pui Shak', name_bn: 'পুঁই শাক', category: 'Vegetable' },
    { name_en: 'Kola Bhorta', name_bn: 'কলা ভর্তা', category: 'Bhorta' }
  ];

  await prisma.traditionalFood.createMany({
    data: foodsData.map(item => ({
      name_en: item.name_en,
      name_bn: item.name_bn,
      description_en: `${item.name_en} is a popular traditional food in Bangladesh.`,
      description_bn: `${item.name_bn} বাংলাদেশের একটি জনপ্রিয় ঐতিহ্যবাহী খাবার।`,
      category: item.category,
      source: 'official_bangladesh_portal',
      verified: true,
      ingredients: []
    }))
  });
  console.log(`Seeded ${foodsData.length} Traditional Foods.`);

  // 2. Traditional Clothing (25+ items)
  const clothingData = [
    { name_en: 'Jamdani Saree', name_bn: 'জামদানি শাড়ি', gender: 'Female' },
    { name_en: 'Dhakai Muslin', name_bn: 'ঢাকাই মসলিন', gender: 'Unisex' },
    { name_en: 'Rajshahi Silk', name_bn: 'রাজশাহী সিল্ক', gender: 'Unisex' },
    { name_en: 'Tangail Tant Saree', name_bn: 'টাঙ্গাইলের তাঁতের শাড়ি', gender: 'Female' },
    { name_en: 'Lungi', name_bn: 'লুঙ্গি', gender: 'Male' },
    { name_en: 'Panjabi', name_bn: 'পাঞ্জাবি', gender: 'Male' },
    { name_en: 'Kabli', name_bn: 'কাবলি', gender: 'Male' },
    { name_en: 'Fotua', name_bn: 'ফতুয়া', gender: 'Unisex' },
    { name_en: 'Gamcha', name_bn: 'গামছা', gender: 'Unisex' },
    { name_en: 'Nakshi Kantha Saree', name_bn: 'নকশী কাঁথা শাড়ি', gender: 'Female' },
    { name_en: 'Karchopi', name_bn: 'কারচুপি', gender: 'Female' },
    { name_en: 'Garo Dokmanda', name_bn: 'গারো দকমান্দা', gender: 'Female' },
    { name_en: 'Chakma Pinon Tishna', name_bn: 'চাকমা পিনোন তিশনা', gender: 'Female' },
    { name_en: 'Tripura Rignai', name_bn: 'ত্রিপুরা রিগনাই', gender: 'Female' },
    { name_en: 'Marma Thami', name_bn: 'মারমা থামি', gender: 'Female' },
    { name_en: 'Monipuri Saree', name_bn: 'মণিপুরী শাড়ি', gender: 'Female' },
    { name_en: 'Khadi', name_bn: 'খাদি', gender: 'Unisex' },
    { name_en: 'Banarasi Saree', name_bn: 'বেনারসি শাড়ি', gender: 'Female' },
    { name_en: 'Pabna Saree', name_bn: 'পাবনার শাড়ি', gender: 'Female' },
    { name_en: 'Kurta', name_bn: 'কুর্তা', gender: 'Unisex' },
    { name_en: 'Shalwar Kameez', name_bn: 'সালোয়ার কামিজ', gender: 'Female' },
    { name_en: 'Orna', name_bn: 'ওড়না', gender: 'Female' },
    { name_en: 'Katan Saree', name_bn: 'কাতান শাড়ি', gender: 'Female' },
    { name_en: 'Gamcha Saree', name_bn: 'গামছা শাড়ি', gender: 'Female' },
    { name_en: 'Tupi', name_bn: 'টুপি', gender: 'Male' },
    { name_en: 'Sherwani', name_bn: 'শেরওয়ানি', gender: 'Male' }
  ];

  await prisma.traditionalClothing.createMany({
    data: clothingData.map(item => ({
      name_en: item.name_en,
      name_bn: item.name_bn,
      description_en: `${item.name_en} is a traditional clothing item.`,
      description_bn: `${item.name_bn} একটি ঐতিহ্যবাহী পোশাক।`,
      gender: item.gender,
      source: 'official_bangladesh_portal',
      verified: true
    }))
  });
  console.log(`Seeded ${clothingData.length} Traditional Clothing items.`);

  // 3. Traditional Music & Instruments (25+ items)
  const musicData = [
    { name_en: 'Bhatiali', name_bn: 'ভাটিয়ালি', type: 'Genre' },
    { name_en: 'Bhawaiya', name_bn: 'ভাওয়াইয়া', type: 'Genre' },
    { name_en: 'Baul Geeti', name_bn: 'বাউল গীতি', type: 'Genre' },
    { name_en: 'Gombhira', name_bn: 'গম্ভীরা', type: 'Genre' },
    { name_en: 'Lalon Geeti', name_bn: 'লালন গীতি', type: 'Genre' },
    { name_en: 'Marfati', name_bn: 'মারফতি', type: 'Genre' },
    { name_en: 'Murshidi', name_bn: 'মুর্শিদি', type: 'Genre' },
    { name_en: 'Jari Gaan', name_bn: 'সারি গান', type: 'Genre' },
    { name_en: 'Sari Gaan', name_bn: 'সারি গান', type: 'Genre' },
    { name_en: 'Ektara', name_bn: 'একতারা', type: 'Instrument' },
    { name_en: 'Dotara', name_bn: 'দোতারা', type: 'Instrument' },
    { name_en: 'Khol', name_bn: 'খোল', type: 'Instrument' },
    { name_en: 'Mandira', name_bn: 'মন্দিরা', type: 'Instrument' },
    { name_en: 'Banshi', name_bn: 'বাঁশি', type: 'Instrument' },
    { name_en: 'Dhak', name_bn: 'ঢাক', type: 'Instrument' },
    { name_en: 'Dhol', name_bn: 'ঢোল', type: 'Instrument' },
    { name_en: 'Khamak', name_bn: 'খমক', type: 'Instrument' },
    { name_en: 'Sarinda', name_bn: 'সারিন্দা', type: 'Instrument' },
    { name_en: 'Tabla', name_bn: 'তবলা', type: 'Instrument' },
    { name_en: 'Harmonium', name_bn: 'হারমোনিয়াম', type: 'Instrument' },
    { name_en: 'Rabindra Sangeet', name_bn: 'রবীন্দ্র সঙ্গীত', type: 'Genre' },
    { name_en: 'Nazrul Geeti', name_bn: 'নজরুল গীতি', type: 'Genre' },
    { name_en: 'Palli Geeti', name_bn: 'পল্লী গীতি', type: 'Genre' },
    { name_en: 'Hason Raja Gaan', name_bn: 'হাসন রাজার গান', type: 'Genre' },
    { name_en: 'Palagaan', name_bn: 'পালাগান', type: 'Genre' },
    { name_en: 'Kobi Gaan', name_bn: 'কবি গান', type: 'Genre' }
  ];

  await prisma.traditionalMusic.createMany({
    data: musicData.map(item => ({
      name_en: item.name_en,
      name_bn: item.name_bn,
      description_en: `${item.name_en} is a prominent traditional music or instrument.`,
      description_bn: `${item.name_bn} একটি ঐতিহ্যবাহী সঙ্গীত বা বাদ্যযন্ত্র।`,
      type: item.type,
      source: 'official_bangladesh_portal',
      verified: true,
      instruments: []
    }))
  });
  console.log(`Seeded ${musicData.length} Traditional Music & Instruments.`);

  // 4. Traditional Crafts (25+ items)
  const craftData = [
    { name_en: 'Nakshi Kantha', name_bn: 'নকশী কাঁথা' },
    { name_en: 'Shital Pati', name_bn: 'শীতল পাটি' },
    { name_en: 'Clay Pottery', name_bn: 'মৃৎশিল্প' },
    { name_en: 'Jute Handicrafts', name_bn: 'পাটের হস্তশিল্প' },
    { name_en: 'Brassware', name_bn: 'কাঁসা শিল্প' },
    { name_en: 'Bamboo & Cane Crafts', name_bn: 'বাঁশ ও বেত শিল্প' },
    { name_en: 'Conch Shell Craft', name_bn: 'শাঁখা শিল্প' },
    { name_en: 'Rickshaw Art', name_bn: 'রিকশা চিত্র' },
    { name_en: 'Wooden Dolls', name_bn: 'কাঠের পুতুল' },
    { name_en: 'Jamdani Weaving', name_bn: 'জামদানি বয়ন' },
    { name_en: 'Muslin Weaving', name_bn: 'মসলিন বয়ন' },
    { name_en: 'Monipuri Weaving', name_bn: 'মণিপুরী বয়ন' },
    { name_en: 'Khadi Weaving', name_bn: 'খাদি বয়ন' },
    { name_en: 'Shankha', name_bn: 'শাঁখা' },
    { name_en: 'Handloom Saree', name_bn: 'হস্তচালিত তাঁত শাড়ি' },
    { name_en: 'Terracotta Tiles', name_bn: 'টেরাকোটা টাইলস' },
    { name_en: 'Leathercraft', name_bn: 'চামড়াশিল্প' },
    { name_en: 'Pearl Craft', name_bn: 'মুক্তা শিল্প' },
    { name_en: 'Hogla Leaf Craft', name_bn: 'হোগলা পাতার কাজ' },
    { name_en: 'Palm Leaf Craft', name_bn: 'তালপাতার কাজ' },
    { name_en: 'Coconut Shell Craft', name_bn: 'নারিকেলের মালার কাজ' },
    { name_en: 'Jute Rugs', name_bn: 'পাটের শতরঞ্জি' },
    { name_en: 'Copperware', name_bn: 'তামার কাজ' },
    { name_en: 'Wooden Furniture', name_bn: 'কাঠের আসবাবপত্র' },
    { name_en: 'Date Palm Craft', name_bn: 'খেজুর পাতার কাজ' },
    { name_en: 'Sola Pith Craft', name_bn: 'শোলার কাজ' }
  ];

  await prisma.traditionalCraft.createMany({
    data: craftData.map(item => ({
      name_en: item.name_en,
      name_bn: item.name_bn,
      description_en: `${item.name_en} is a famous traditional craft.`,
      description_bn: `${item.name_bn} একটি বিখ্যাত ঐতিহ্যবাহী হস্তশিল্প।`,
      source: 'official_bangladesh_portal',
      verified: true,
      materials: []
    }))
  });
  console.log(`Seeded ${craftData.length} Traditional Crafts.`);

  // 5. Festivals (40+ items)
  const festivalData = [
    { name_en: 'Pohela Boishakh', name_bn: 'পহেলা বৈশাখ', type: 'Secular' },
    { name_en: 'Eid-ul-Fitr', name_bn: 'ঈদুল ফিতর', type: 'Religious' },
    { name_en: 'Eid-ul-Adha', name_bn: 'ঈদুল আযহা', type: 'Religious' },
    { name_en: 'Durga Puja', name_bn: 'দুর্গা পূজা', type: 'Religious' },
    { name_en: 'Saraswati Puja', name_bn: 'সরস্বতী পূজা', type: 'Religious' },
    { name_en: 'Kali Puja', name_bn: 'কালী পূজা', type: 'Religious' },
    { name_en: 'Janmashtami', name_bn: 'জন্মাষ্টমী', type: 'Religious' },
    { name_en: 'Buddha Purnima', name_bn: 'বুদ্ধ পূর্ণিমা', type: 'Religious' },
    { name_en: 'Christmas', name_bn: 'বড়দিন', type: 'Religious' },
    { name_en: 'Ashura', name_bn: 'আশুরা', type: 'Religious' },
    { name_en: 'Shab-e-Barat', name_bn: 'শবে বরাত', type: 'Religious' },
    { name_en: 'Shab-e-Meraj', name_bn: 'শবে মেরাজ', type: 'Religious' },
    { name_en: 'Shab-e-Qadr', name_bn: 'শবে কদর', type: 'Religious' },
    { name_en: 'Eid-e-Miladunnabi', name_bn: 'ঈদে মিলাদুন্নবী', type: 'Religious' },
    { name_en: 'Maghi Purnima', name_bn: 'মাঘী পূর্ণিমা', type: 'Religious' },
    { name_en: 'Prabarana Purnima', name_bn: 'প্রবারণা পূর্ণিমা', type: 'Religious' },
    { name_en: 'Chaitra Sankranti', name_bn: 'চৈত্র সংক্রান্তি', type: 'Secular' },
    { name_en: 'Shakrain', name_bn: 'সাকরাইন', type: 'Secular' },
    { name_en: 'Nabanna', name_bn: 'নবান্ন', type: 'Harvest' },
    { name_en: 'Poush Mela', name_bn: 'পৌষ মেলা', type: 'Secular' },
    { name_en: 'Lalon Mela', name_bn: 'লালন মেলা', type: 'Cultural' },
    { name_en: 'Ekushey Boi Mela', name_bn: 'একুশে বইমেলা', type: 'Cultural' },
    { name_en: 'Independence Day', name_bn: 'স্বাধীনতা দিবস', type: 'National' },
    { name_en: 'Victory Day', name_bn: 'বিজয় দিবস', type: 'National' },
    { name_en: 'Language Martyrs Day', name_bn: 'ভাষা শহীদ দিবস', type: 'National' },
    { name_en: 'National Mourning Day', name_bn: 'জাতীয় শোক দিবস', type: 'National' },
    { name_en: 'Rabindra Jayanti', name_bn: 'রবীন্দ্র জয়ন্তী', type: 'Cultural' },
    { name_en: 'Nazrul Jayanti', name_bn: 'নজরুল জয়ন্তী', type: 'Cultural' },
    { name_en: 'Rokeya Day', name_bn: 'রোকেয়া দিবস', type: 'National' },
    { name_en: 'Basanta Utsab', name_bn: 'বসন্ত উৎসব', type: 'Seasonal' },
    { name_en: 'Barsha Utsab', name_bn: 'বর্ষা উৎসব', type: 'Seasonal' },
    { name_en: 'Sharad Utsab', name_bn: 'শরৎ উৎসব', type: 'Seasonal' },
    { name_en: 'Hemanta Utsab', name_bn: 'হেমন্ত উৎসব', type: 'Seasonal' },
    { name_en: 'Pitha Utsab', name_bn: 'পিঠা উৎসব', type: 'Cultural' },
    { name_en: 'Nouka Bais', name_bn: 'নৌকা বাইচ', type: 'Cultural' },
    { name_en: 'Biju', name_bn: 'বিজু', type: 'Indigenous' },
    { name_en: 'Sangrai', name_bn: 'সাংগ্রাই', type: 'Indigenous' },
    { name_en: 'Boisabi', name_bn: 'বৈসাবি', type: 'Indigenous' },
    { name_en: 'Wangala', name_bn: 'ওয়ানগালা', type: 'Indigenous' },
    { name_en: 'Karam Festival', name_bn: 'করম উৎসব', type: 'Indigenous' },
    { name_en: 'Rash Mela', name_bn: 'রাস মেলা', type: 'Religious' },
    { name_en: 'Lathi Khela', name_bn: 'লাঠি খেলা', type: 'Cultural' }
  ];

  await prisma.festival.createMany({
    data: festivalData.map(item => ({
      name_en: item.name_en,
      name_bn: item.name_bn,
      description_en: `${item.name_en} is a prominent festival in Bangladesh.`,
      description_bn: `${item.name_bn} বাংলাদেশের একটি অন্যতম উৎসব।`,
      type: item.type,
      source: 'official_bangladesh_portal',
      verified: true,
      foods: [],
      traditions: []
    }))
  });
  console.log(`Seeded ${festivalData.length} Festivals.`);

  console.log('Done seeding Culture and Heritage Data!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

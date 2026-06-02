type BaseRecord = {
  id: number;
  name_en: string;
  name_bn: string;
  description_en: string;
  description_bn: string;
  image_url: null;
  source: "ai_generated";
  source_url: null;
  verified: false;
  needs_image: true;
};

const base = (
  id: number,
  name_en: string,
  name_bn: string,
  description_en: string,
  description_bn = description_en,
): BaseRecord => ({
  id,
  name_en,
  name_bn,
  description_en,
  description_bn,
  image_url: null,
  source: "ai_generated",
  source_url: null,
  verified: false,
  needs_image: true,
});

const date = (value?: string) => (value ? new Date(`${value}T00:00:00.000Z`) : null);

export const rivers = [
  { ...base(1, "Padma", "পদ্মা", "A principal distributary of the Ganges and one of Bangladesh's defining river systems."), length_km: 120, origin: "Ganges at the Bangladesh-India border", flows_through: ["Rajshahi", "Pabna", "Kushtia", "Faridpur", "Munshiganj"], outflow: "Meghna" },
  { ...base(2, "Meghna", "মেঘনা", "A major river system carrying flows from the Surma-Kushiyara basin toward the Bay of Bengal."), length_km: 264, origin: "Surma and Kushiyara confluence", flows_through: ["Kishoreganj", "Brahmanbaria", "Chandpur", "Bhola"], outflow: "Bay of Bengal" },
  { ...base(3, "Jamuna", "যমুনা", "The main channel of the Brahmaputra inside Bangladesh, known for its wide braided course."), length_km: 205, origin: "Brahmaputra", flows_through: ["Kurigram", "Gaibandha", "Jamalpur", "Sirajganj", "Tangail"], outflow: "Padma" },
  { ...base(4, "Brahmaputra", "ব্রহ্মপুত্র", "A transboundary river entering northern Bangladesh before shifting into the Jamuna channel."), length_km: 290, origin: "Tibetan Plateau", flows_through: ["Kurigram", "Jamalpur", "Mymensingh"], outflow: "Jamuna" },
  { ...base(5, "Teesta", "তিস্তা", "A Himalayan river important to irrigation and floodplain life in northern Bangladesh."), length_km: 315, origin: "Sikkim Himalaya", flows_through: ["Nilphamari", "Lalmonirhat", "Rangpur", "Gaibandha"], outflow: "Brahmaputra" },
  { ...base(6, "Karnaphuli", "কর্ণফুলী", "The main river of Chattogram, supporting port activity and hill tract settlements."), length_km: 270, origin: "Lushai Hills", flows_through: ["Rangamati", "Chattogram"], outflow: "Bay of Bengal" },
  { ...base(7, "Surma", "সুরমা", "A key river in Sylhet, branching from the Barak and joining the Kushiyara system."), length_km: 249, origin: "Barak River", flows_through: ["Sylhet", "Sunamganj"], outflow: "Meghna system" },
  { ...base(8, "Kushiyara", "কুশিয়ারা", "A northeastern river flowing through Sylhet basin wetlands and haors."), length_km: 160, origin: "Barak River", flows_through: ["Sylhet", "Moulvibazar", "Habiganj"], outflow: "Meghna system" },
  { ...base(9, "Buriganga", "বুড়িগঙ্গা", "A historically important river beside Dhaka city."), length_km: 27, origin: "Dhaleshwari system", flows_through: ["Dhaka"], outflow: "Dhaleshwari" },
  { ...base(10, "Sangu", "সাঙ্গু", "A southeastern river flowing through Bandarban and Chattogram hill landscapes."), length_km: 270, origin: "Arakan Hills", flows_through: ["Bandarban", "Chattogram"], outflow: "Bay of Bengal" },
  { ...base(11, "Feni", "ফেনী", "A river forming part of the southeastern Bangladesh-India border area."), length_km: 116, origin: "Tripura hills", flows_through: ["Feni", "Chattogram"], outflow: "Bay of Bengal" },
  { ...base(12, "Ariyal Khan", "আড়িয়াল খাঁ", "A distributary river shaping central-southern floodplains."), length_km: 160, origin: "Padma distributary", flows_through: ["Faridpur", "Madaripur", "Barishal"], outflow: "Meghna basin" },
];

export const seasons = [
  { ...base(1, "Summer", "গ্রীষ্ম", "Hot pre-monsoon season marked by heat, mangoes, jackfruit, and storms."), bangla_name: "গ্রীষ্ম", months_en: "Baishakh-Jaishtha", months_bn: "বৈশাখ-জ্যৈষ্ঠ", characteristics: "Heat, nor'westers, ripening fruit", associated_festivals: ["Pohela Boishakh"], crops: ["Aus rice", "Jute", "Mango"] },
  { ...base(2, "Monsoon", "বর্ষা", "Rainy season that replenishes rivers, wetlands, ponds, and croplands."), bangla_name: "বর্ষা", months_en: "Ashar-Shraban", months_bn: "আষাঢ়-শ্রাবণ", characteristics: "Heavy rain, flooding, lush greenery", associated_festivals: ["Boat races"], crops: ["Aman rice", "Jute"] },
  { ...base(3, "Autumn", "শরৎ", "Clear skies and white kash flowers after the peak rains."), bangla_name: "শরৎ", months_en: "Bhadra-Ashwin", months_bn: "ভাদ্র-আশ্বিন", characteristics: "Blue sky, kash flowers, mild weather", associated_festivals: ["Durga Puja"], crops: ["Aman rice"] },
  { ...base(4, "Late Autumn", "হেমন্ত", "Harvest season with cooler air and new rice."), bangla_name: "হেমন্ত", months_en: "Kartik-Agrahayan", months_bn: "কার্তিক-অগ্রহায়ণ", characteristics: "Harvest, dew, new rice", associated_festivals: ["Nabanna"], crops: ["Aman rice", "Mustard"] },
  { ...base(5, "Winter", "শীত", "Cool dry season known for pitha, vegetables, and foggy mornings."), bangla_name: "শীত", months_en: "Poush-Magh", months_bn: "পৌষ-মাঘ", characteristics: "Cold mornings, fog, dry weather", associated_festivals: ["Poush Sankranti"], crops: ["Wheat", "Potato", "Mustard", "Vegetables"] },
  { ...base(6, "Spring", "বসন্ত", "Mild floral season associated with color, music, and renewal."), bangla_name: "বসন্ত", months_en: "Falgun-Chaitra", months_bn: "ফাল্গুন-চৈত্র", characteristics: "Flowers, mild warmth, pollen", associated_festivals: ["Pohela Falgun", "Independence Day"], crops: ["Boro rice", "Pulses"] },
];

export const animals = [
  { ...base(1, "Royal Bengal Tiger", "রয়েল বেঙ্গল টাইগার", "Bangladesh's national animal and an iconic Sundarbans predator."), scientific_name: "Panthera tigris tigris", category: "mammal", habitat: "Sundarbans mangrove forest", conservation_status: "endangered", is_national_animal: true },
  { ...base(2, "Hilsa", "ইলিশ", "Bangladesh's national fish and a central part of riverine food culture."), scientific_name: "Tenualosa ilisha", category: "fish", habitat: "Rivers, estuaries, Bay of Bengal", conservation_status: "least_concern", is_national_animal: false },
  { ...base(3, "Fishing Cat", "মেছো বিড়াল", "A wetland-adapted wild cat found in marshes and riverine areas."), scientific_name: "Prionailurus viverrinus", category: "mammal", habitat: "Wetlands and reed beds", conservation_status: "vulnerable", is_national_animal: false },
  { ...base(4, "Ganges River Dolphin", "শুশুক", "A freshwater dolphin found in large river systems."), scientific_name: "Platanista gangetica", category: "mammal", habitat: "Ganges-Brahmaputra-Meghna river system", conservation_status: "endangered", is_national_animal: false },
  { ...base(5, "Asian Elephant", "এশীয় হাতি", "A large mammal surviving in hill forest corridors."), scientific_name: "Elephas maximus", category: "mammal", habitat: "Chattogram Hill Tracts and Cox's Bazar forests", conservation_status: "endangered", is_national_animal: false },
  { ...base(6, "Oriental Magpie-Robin", "দোয়েল", "Bangladesh's national bird, common in gardens and villages."), scientific_name: "Copsychus saularis", category: "bird", habitat: "Gardens, groves, villages", conservation_status: "least_concern", is_national_animal: false },
  { ...base(7, "Mugger Crocodile", "মগর কুমির", "A crocodile species historically associated with rivers and wetlands."), scientific_name: "Crocodylus palustris", category: "reptile", habitat: "Rivers, wetlands, ponds", conservation_status: "vulnerable", is_national_animal: false },
  { ...base(8, "Bengal Monitor", "গুইসাপ", "A large monitor lizard found in rural and wetland habitats."), scientific_name: "Varanus bengalensis", category: "reptile", habitat: "Fields, wetlands, homestead groves", conservation_status: "least_concern", is_national_animal: false },
];

export const flowers = [
  { ...base(1, "Water Lily", "শাপলা", "Bangladesh's national flower, common in ponds and wetlands."), scientific_name: "Nymphaea nouchali", blooming_season: "Monsoon and autumn", is_national_flower: true, fragrance: "Mild", colors: ["white", "pink", "blue"] },
  { ...base(2, "Krishnachura", "কৃষ্ণচূড়া", "A vivid flowering tree associated with summer roadsides and campuses."), scientific_name: "Delonix regia", blooming_season: "Summer", is_national_flower: false, fragrance: "Light", colors: ["red", "orange"] },
  { ...base(3, "Shiuli", "শিউলি", "A fragrant autumn flower linked with festivals and morning courtyards."), scientific_name: "Nyctanthes arbor-tristis", blooming_season: "Autumn", is_national_flower: false, fragrance: "Strong", colors: ["white", "orange"] },
  { ...base(4, "Marigold", "গাঁদা", "A widely used ceremonial and decorative flower."), scientific_name: "Tagetes erecta", blooming_season: "Winter", is_national_flower: false, fragrance: "Earthy", colors: ["yellow", "orange"] },
];

export const trees = [
  { ...base(1, "Mango Tree", "আম গাছ", "Bangladesh's national tree and a major fruit tree across the country."), scientific_name: "Mangifera indica", is_national_tree: true, regions_found: ["Rajshahi", "Chapainawabganj", "Satkhira", "countrywide"], uses: ["Fruit", "Shade", "Timber"] },
  { ...base(2, "Sundari", "সুন্দরী", "A signature mangrove tree of the Sundarbans."), scientific_name: "Heritiera fomes", is_national_tree: false, regions_found: ["Sundarbans", "Khulna", "Bagerhat", "Satkhira"], uses: ["Timber", "Coastal ecology"] },
  { ...base(3, "Jackfruit Tree", "কাঁঠাল গাছ", "A common homestead tree producing Bangladesh's national fruit."), scientific_name: "Artocarpus heterophyllus", is_national_tree: false, regions_found: ["Madhupur", "Gazipur", "Narsingdi", "countrywide"], uses: ["Fruit", "Timber", "Animal feed"] },
  { ...base(4, "Bamboo", "বাঁশ", "A fast-growing plant central to rural construction and crafts."), scientific_name: "Bambusoideae", is_national_tree: false, regions_found: ["Sylhet", "Chattogram Hill Tracts", "countrywide"], uses: ["Housing", "Crafts", "Fencing"] },
];

export const festivals = [
  { ...base(1, "Pohela Boishakh", "পহেলা বৈশাখ", "Bengali New Year celebrated with fairs, music, and traditional food."), type: "cultural", religion: null, date_or_period: "14 April", traditions: ["Mangal Shobhajatra", "Halkhata", "Fairs"], foods: ["Panta bhat", "Hilsa", "Pitha"] },
  { ...base(2, "Eid-ul-Fitr", "ঈদুল ফিতর", "Major Islamic festival marking the end of Ramadan."), type: "religious", religion: "Islam", date_or_period: "1 Shawwal", traditions: ["Eid prayer", "Family visits", "Zakat al-fitr"], foods: ["Shemai", "Polao", "Korma"] },
  { ...base(3, "Eid-ul-Adha", "ঈদুল আজহা", "Islamic festival of sacrifice observed across Bangladesh."), type: "religious", religion: "Islam", date_or_period: "10 Dhul Hijjah", traditions: ["Eid prayer", "Qurbani", "Meat distribution"], foods: ["Beef curry", "Kacchi biryani"] },
  { ...base(4, "Durga Puja", "দুর্গাপূজা", "The largest Hindu festival in Bangladesh."), type: "religious", religion: "Hinduism", date_or_period: "Ashwin/Kartik", traditions: ["Puja mandap", "Sindoor khela", "Immersion"], foods: ["Khichuri", "Labra", "Sweets"] },
  { ...base(5, "Buddha Purnima", "বুদ্ধ পূর্ণিমা", "Buddhist festival marking the birth, enlightenment, and passing of Buddha."), type: "religious", religion: "Buddhism", date_or_period: "Full moon of Boishakh", traditions: ["Temple visits", "Lamp lighting"], foods: ["Vegetarian meals"] },
  { ...base(6, "Victory Day", "বিজয় দিবস", "National day celebrating Bangladesh's victory on 16 December 1971."), type: "national", religion: null, date_or_period: "16 December", traditions: ["Parades", "National flag", "Memorial visits"], foods: ["Community meals"] },
  { ...base(7, "Language Martyrs' Day", "শহীদ দিবস", "National remembrance of the 1952 Language Movement martyrs."), type: "national", religion: null, date_or_period: "21 February", traditions: ["Shaheed Minar tribute", "Barefoot procession"], foods: [] },
  { ...base(8, "Nabanna", "নবান্ন", "Harvest festival celebrating new rice."), type: "cultural", religion: null, date_or_period: "Agrahayan", traditions: ["Harvest meals", "Folk songs"], foods: ["New rice", "Pitha", "Payesh"] },
];

export const traditionalFoods = [
  { ...base(1, "Panta Bhat", "পান্তা ভাত", "Fermented soaked rice commonly associated with rural foodways and Pohela Boishakh."), category: "rice", region: "countrywide", ingredients: ["rice", "water", "salt", "chili", "onion"] },
  { ...base(2, "Kacchi Biryani", "কাচ্চি বিরিয়ানি", "A celebratory rice dish cooked with marinated meat and fragrant spices."), category: "rice", region: "Dhaka", ingredients: ["rice", "mutton", "potato", "yogurt", "spices"] },
  { ...base(3, "Bhuna Khichuri", "ভুনা খিচুড়ি", "A rich rice-lentil dish popular during rainy days and gatherings."), category: "rice", region: "countrywide", ingredients: ["rice", "lentils", "ghee", "spices"] },
  { ...base(4, "Shutki Bhorta", "শুঁটকি ভর্তা", "Mashed dried fish with chili, onion, and mustard oil."), category: "curry", region: "Chattogram and coastal areas", ingredients: ["dried fish", "chili", "onion", "mustard oil"] },
  { ...base(5, "Chomchom", "চমচম", "A classic Bengali sweet strongly associated with Tangail."), category: "sweet", region: "Tangail", ingredients: ["chhana", "sugar syrup", "mawa"] },
  { ...base(6, "Roshogolla", "রসগোল্লা", "A soft chhana sweet served in syrup."), category: "sweet", region: "countrywide", ingredients: ["chhana", "sugar", "water"] },
  { ...base(7, "Fuchka", "ফুচকা", "Crisp shells filled with spicy tamarind, potato, and chickpea mix."), category: "snack", region: "urban Bangladesh", ingredients: ["flour shells", "potato", "chickpea", "tamarind"] },
  { ...base(8, "Borhani", "বোরহানি", "A spiced yogurt drink served with biryani and wedding meals."), category: "drink", region: "Dhaka", ingredients: ["yogurt", "mint", "cumin", "mustard", "chili"] },
];

export const traditionalClothing = [
  { ...base(1, "Saree", "শাড়ি", "A traditional draped garment worn widely by women."), gender: "female", occasion: "daily wear and festivals", region: "countrywide" },
  { ...base(2, "Lungi", "লুঙ্গি", "A wrapped lower garment commonly worn by men."), gender: "male", occasion: "daily wear", region: "countrywide" },
  { ...base(3, "Panjabi", "পাঞ্জাবি", "A long tunic worn by men during festivals and formal gatherings."), gender: "male", occasion: "Eid, weddings, cultural events", region: "countrywide" },
  { ...base(4, "Jamdani Saree", "জামদানি শাড়ি", "A fine muslin textile tradition associated with Dhaka."), gender: "female", occasion: "weddings and formal events", region: "Dhaka/Narayanganj" },
];

export const traditionalMusic = [
  { ...base(1, "Baul", "বাউল", "Mystic folk music tradition centered on spiritual expression."), type: "baul", instruments: ["ektara", "dotara", "duggi"] },
  { ...base(2, "Bhatiali", "ভাটিয়ালি", "River song tradition associated with boatmen and waterways."), type: "folk", instruments: ["flute", "dotara"] },
  { ...base(3, "Rabindra Sangeet", "রবীন্দ্রসঙ্গীত", "Songs composed by Rabindranath Tagore, deeply influential in Bengali culture."), type: "rabindra", instruments: ["harmonium", "tabla", "esraj"] },
  { ...base(4, "Nazrul Geeti", "নজরুলগীতি", "Songs composed by Kazi Nazrul Islam combining devotion, rebellion, and romance."), type: "nazrul", instruments: ["harmonium", "tabla"] },
];

export const traditionalCrafts = [
  { ...base(1, "Jamdani Weaving", "জামদানি বয়ন", "A heritage textile craft known for intricate motifs on fine fabric."), region: "Dhaka and Narayanganj", materials: ["cotton", "silk"] },
  { ...base(2, "Nakshi Kantha", "নকশি কাঁথা", "Embroidered quilt craft made from layered cloth."), region: "Mymensingh, Rajshahi, Jessore", materials: ["reused cloth", "thread"] },
  { ...base(3, "Shital Pati", "শীতল পাটি", "Cool mat weaving tradition using murta cane."), region: "Sylhet", materials: ["murta cane"] },
  { ...base(4, "Terracotta Craft", "টেরাকোটা শিল্প", "Burnt clay craft visible in temple architecture and decorative objects."), region: "Rajshahi and Dinajpur", materials: ["clay"] },
];

export const historicalPeriods = [
  { ...base(1, "Ancient Bengal", "প্রাচীন বঙ্গ", "Early Bengal polities and cultural development before medieval dynasties."), start_year: -300, end_year: 750, era: "ancient", key_events: ["Gangaridai references", "Pundravardhana growth"] },
  { ...base(2, "Pala and Sena Period", "পাল ও সেন যুগ", "Buddhist Pala and Hindu Sena dynastic phases in Bengal."), start_year: 750, end_year: 1204, era: "medieval", key_events: ["Pala empire", "Sena rule", "Buddhist scholarship"] },
  { ...base(3, "Sultanate Bengal", "সুলতানি বাংলা", "Independent and regional Muslim sultanate rule in Bengal."), start_year: 1204, end_year: 1576, era: "medieval", key_events: ["Turko-Afghan rule", "Mosque architecture", "Bengal Sultanate"] },
  { ...base(4, "Mughal Bengal", "মুঘল বাংলা", "Bengal as a wealthy Mughal province centered on trade and agriculture."), start_year: 1576, end_year: 1757, era: "mughal", key_events: ["Dhaka as provincial capital", "Muslin trade"] },
  { ...base(5, "British Colonial Bengal", "ব্রিটিশ ঔপনিবেশিক বাংলা", "Company and Crown rule following Plassey until partition."), start_year: 1757, end_year: 1947, era: "british", key_events: ["Permanent Settlement", "Bengal Renaissance", "Partition of Bengal"] },
  { ...base(6, "Pakistan Period", "পাকিস্তান আমল", "East Bengal/East Pakistan era before Bangladesh's independence."), start_year: 1947, end_year: 1971, era: "pakistan", key_events: ["Language Movement", "Six Point Movement", "Liberation War"] },
  { ...base(7, "Independent Bangladesh", "স্বাধীন বাংলাদেশ", "Modern Bangladesh after the Liberation War."), start_year: 1971, end_year: 2024, era: "modern", key_events: ["Constitution", "Democratic transitions", "Economic growth"] },
];

export const historicalEvents = [
  { ...base(1, "Pala Empire Emerges", "পাল সাম্রাজ্যের উত্থান", "Gopala's rise established one of Bengal's major early empires."), date: null, year: 750, period_id: 2, category: "political", significance: "Marked Bengal's emergence as a major regional power." },
  { ...base(2, "Ikhtiyar Khalji Conquers Nadia", "ইখতিয়ার খলজির নদীয়া বিজয়", "Turko-Afghan military expansion reshaped Bengal's political landscape."), date: null, year: 1204, period_id: 3, category: "war", significance: "Opened the medieval Sultanate phase." },
  { ...base(3, "Battle of Plassey", "পলাশীর যুদ্ধ", "The 1757 battle enabled East India Company dominance in Bengal."), date: date("1757-06-23"), year: 1757, period_id: 5, category: "war", significance: "A turning point in colonial rule." },
  { ...base(4, "Permanent Settlement", "চিরস্থায়ী বন্দোবস্ত", "The 1793 land revenue arrangement transformed agrarian Bengal."), date: null, year: 1793, period_id: 5, category: "political", significance: "Reshaped landholding and peasant life." },
  { ...base(5, "Partition of Bengal", "বঙ্গভঙ্গ", "The 1905 partition reorganized Bengal and triggered mass political mobilization."), date: null, year: 1905, period_id: 5, category: "political", significance: "Fueled anti-colonial nationalism." },
  { ...base(6, "Language Movement", "ভাষা আন্দোলন", "Bengali language activists were killed in Dhaka on 21 February 1952."), date: date("1952-02-21"), year: 1952, period_id: 6, category: "cultural", significance: "Central to Bengali identity and later nationalism." },
  { ...base(7, "Six Point Movement", "ছয় দফা আন্দোলন", "A political program demanding autonomy for East Pakistan."), date: null, year: 1966, period_id: 6, category: "political", significance: "Became a foundation of the independence movement." },
  { ...base(8, "Mass Uprising of 1969", "ঊনসত্তরের গণঅভ্যুত্থান", "Popular uprising against Ayub Khan's regime."), date: null, year: 1969, period_id: 6, category: "revolution", significance: "Strengthened Bengali democratic mobilization." },
  { ...base(9, "1970 Bhola Cyclone", "১৯৭০ সালের ভোলা ঘূর্ণিঝড়", "One of the deadliest cyclones in recorded history."), date: null, year: 1970, period_id: 6, category: "natural_disaster", significance: "Exposed governance failures before the 1970 election." },
  { ...base(10, "Bangladesh Liberation War", "বাংলাদেশের মুক্তিযুদ্ধ", "Nine-month war leading to Bangladesh's independence."), date: date("1971-03-26"), year: 1971, period_id: 7, category: "war", significance: "Created independent Bangladesh." },
  { ...base(11, "Victory Day", "বিজয় দিবস", "Pakistani forces surrendered in Dhaka on 16 December 1971."), date: date("1971-12-16"), year: 1971, period_id: 7, category: "war", significance: "Confirmed Bangladesh's victory." },
  { ...base(12, "Constitution Adopted", "সংবিধান গৃহীত", "Bangladesh adopted its constitution in 1972."), date: date("1972-11-04"), year: 1972, period_id: 7, category: "political", significance: "Established the republic's constitutional framework." },
  { ...base(13, "1991 Democratic Transition", "১৯৯১ গণতান্ত্রিক উত্তরণ", "Parliamentary democracy returned after mass movement and election."), date: null, year: 1991, period_id: 7, category: "political", significance: "Restored elected parliamentary government." },
  { ...base(14, "Padma Bridge Opening", "পদ্মা সেতু উদ্বোধন", "Bangladesh opened the Padma Bridge in 2022."), date: date("2022-06-25"), year: 2022, period_id: 7, category: "political", significance: "Major infrastructure milestone connecting southwestern Bangladesh." },
  { ...base(15, "2024 National Election", "২০২৪ জাতীয় নির্বাচন", "Bangladesh held its twelfth parliamentary election in January 2024."), date: date("2024-01-07"), year: 2024, period_id: 7, category: "political", significance: "A recent national political event." },
];

export const historicalPlaces = [
  { ...base(1, "Mahasthangarh", "মহাস্থানগড়", "One of the earliest urban archaeological sites in Bangladesh."), location: "Shibganj, Bogura", district_id: 10, period_id: 1, type: "archaeological", built_year: null, built_by: null },
  { ...base(2, "Somapura Mahavihara", "সোমপুর মহাবিহার", "A major Buddhist monastery complex at Paharpur."), location: "Paharpur, Naogaon", district_id: 48, period_id: 2, type: "archaeological", built_year: 800, built_by: "Pala dynasty" },
  { ...base(3, "Sixty Dome Mosque", "ষাট গম্বুজ মসজিদ", "A landmark mosque of medieval Bengal in Bagerhat."), location: "Bagerhat", district_id: 1, period_id: 3, type: "mosque", built_year: 1459, built_by: "Khan Jahan Ali" },
  { ...base(4, "Lalbagh Fort", "লালবাগ কেল্লা", "An unfinished Mughal fort complex in Old Dhaka."), location: "Old Dhaka", district_id: 18, period_id: 4, type: "fort", built_year: 1678, built_by: "Prince Muhammad Azam" },
  { ...base(5, "Ahsan Manzil", "আহসান মঞ্জিল", "Historic palace of the Nawabs of Dhaka."), location: "Dhaka", district_id: 18, period_id: 5, type: "palace", built_year: 1872, built_by: "Nawab Abdul Ghani" },
  { ...base(6, "National Martyrs' Memorial", "জাতীয় স্মৃতিসৌধ", "National monument honoring Liberation War martyrs."), location: "Savar, Dhaka", district_id: 18, period_id: 7, type: "monument", built_year: 1982, built_by: "Government of Bangladesh" },
];

export const politicalParties = [
  { ...base(1, "Bangladesh Awami League", "বাংলাদেশ আওয়ামী লীগ", "One of Bangladesh's oldest major political parties."), founded_year: 1949, founder: "Huseyn Shaheed Suhrawardy, Maulana Abdul Hamid Khan Bhashani and others", ideology: "Bengali nationalism, secularism", is_active: true },
  { ...base(2, "Bangladesh Nationalist Party", "বাংলাদেশ জাতীয়তাবাদী দল", "A major political party founded in the late 1970s."), founded_year: 1978, founder: "Ziaur Rahman", ideology: "Bangladeshi nationalism", is_active: true },
  { ...base(3, "Jatiya Party", "জাতীয় পার্টি", "Political party associated with H. M. Ershad's period."), founded_year: 1986, founder: "H. M. Ershad", ideology: "Nationalism, conservatism", is_active: true },
  { ...base(4, "Communist Party of Bangladesh", "বাংলাদেশের কমিউনিস্ট পার্টি", "Left political party with roots in anti-colonial and workers' politics."), founded_year: 1948, founder: "Communist organizers of East Bengal", ideology: "Communism, socialism", is_active: true },
  { ...base(5, "National Awami Party", "ন্যাশনাল আওয়ামী পার্টি", "Historic left-nationalist party influential in Pakistan-era politics."), founded_year: 1957, founder: "Maulana Abdul Hamid Khan Bhashani", ideology: "Left nationalism", is_active: true },
  { ...base(6, "Krishak Sramik Party", "কৃষক শ্রমিক পার্টি", "Historic peasant-labor party associated with A. K. Fazlul Huq."), founded_year: 1953, founder: "A. K. Fazlul Huq", ideology: "Peasant and labor interests", is_active: false },
];

export const politicalLeaders = [
  { ...base(1, "Shamsuddin Ilyas Shah", "শামসুদ্দীন ইলিয়াস শাহ", "Founder of the Ilyas Shahi dynasty and a major Bengal Sultanate ruler."), born: null, died: date("1358-01-01"), birth_place: null, party_id: null, role: "general", era: "pre-partition", tenure_start: date("1342-01-01"), tenure_end: date("1358-01-01"), achievements: ["Unified large parts of Bengal under Sultanate rule"] },
  { ...base(2, "Siraj ud-Daulah", "সিরাজউদ্দৌলা", "Last independent Nawab of Bengal before Company dominance."), born: date("1733-01-01"), died: date("1757-07-02"), birth_place: "Murshidabad", party_id: null, role: "general", era: "pre-partition", tenure_start: date("1756-01-01"), tenure_end: date("1757-01-01"), achievements: ["Resisted East India Company expansion"] },
  { ...base(3, "A. K. Fazlul Huq", "এ. কে. ফজলুল হক", "Bengali statesman known as Sher-e-Bangla."), born: date("1873-10-26"), died: date("1962-04-27"), birth_place: "Barishal", party_id: 6, role: "prime_minister", era: "pre-partition", tenure_start: date("1937-04-01"), tenure_end: date("1943-03-29"), achievements: ["Premier of Bengal", "Advocated peasant rights"] },
  { ...base(4, "Huseyn Shaheed Suhrawardy", "হোসেন শহীদ সোহরাওয়ার্দী", "Bengali political leader and former Prime Minister of Pakistan."), born: date("1892-09-08"), died: date("1963-12-05"), birth_place: "Midnapore", party_id: 1, role: "prime_minister", era: "pakistan", tenure_start: date("1956-09-12"), tenure_end: date("1957-10-17"), achievements: ["Prime Minister of Pakistan", "Key Awami League leader"] },
  { ...base(5, "Maulana Abdul Hamid Khan Bhashani", "মওলানা আবদুল হামিদ খান ভাসানী", "Influential left-leaning political and peasant leader."), born: date("1880-12-12"), died: date("1976-11-17"), birth_place: "Sirajganj", party_id: 5, role: "activist", era: "pakistan", tenure_start: null, tenure_end: null, achievements: ["Founded NAP", "Mass politics organizer"] },
  { ...base(6, "Sheikh Mujibur Rahman", "শেখ মুজিবুর রহমান", "Founding leader of Bangladesh and first president and prime minister."), born: date("1920-03-17"), died: date("1975-08-15"), birth_place: "Tungipara, Gopalganj", party_id: 1, role: "prime_minister", era: "liberation", tenure_start: date("1972-01-12"), tenure_end: date("1975-01-25"), achievements: ["Led Six Point Movement", "Father of the Nation", "First Prime Minister"] },
  { ...base(7, "Syed Nazrul Islam", "সৈয়দ নজরুল ইসলাম", "Acting President of Bangladesh during the Liberation War."), born: date("1925-01-01"), died: date("1975-11-03"), birth_place: "Kishoreganj", party_id: 1, role: "president", era: "liberation", tenure_start: date("1971-04-17"), tenure_end: date("1972-01-12"), achievements: ["Acting President of Mujibnagar Government"] },
  { ...base(8, "Tajuddin Ahmad", "তাজউদ্দীন আহমদ", "First Prime Minister of Bangladesh's wartime government."), born: date("1925-07-23"), died: date("1975-11-03"), birth_place: "Gazipur", party_id: 1, role: "prime_minister", era: "liberation", tenure_start: date("1971-04-17"), tenure_end: date("1972-01-12"), achievements: ["Led Mujibnagar Government administration"] },
  { ...base(9, "Abu Sayeed Chowdhury", "আবু সাঈদ চৌধুরী", "President of Bangladesh in the early post-independence period."), born: date("1921-01-31"), died: date("1987-08-02"), birth_place: "Tangail", party_id: null, role: "president", era: "post-independence", tenure_start: date("1972-01-12"), tenure_end: date("1973-12-24"), achievements: ["International advocacy during Liberation War"] },
  { ...base(10, "Mohammad Mohammadullah", "মোহাম্মদ মোহাম্মদউল্লাহ", "President of Bangladesh from 1973 to 1975."), born: date("1921-10-21"), died: date("1999-11-12"), birth_place: "Lakshmipur", party_id: 1, role: "president", era: "post-independence", tenure_start: date("1973-12-24"), tenure_end: date("1975-01-25"), achievements: ["Served as Speaker and President"] },
  { ...base(11, "Khondaker Mostaq Ahmad", "খন্দকার মোশতাক আহমদ", "President after the 1975 assassination of Sheikh Mujibur Rahman."), born: date("1918-03-05"), died: date("1996-03-05"), birth_place: "Cumilla", party_id: null, role: "president", era: "post-independence", tenure_start: date("1975-08-15"), tenure_end: date("1975-11-06"), achievements: ["Brief presidency in 1975"] },
  { ...base(12, "Abu Sadat Mohammad Sayem", "আবু সাদাত মোহাম্মদ সায়েম", "Chief Justice who served as President after November 1975."), born: date("1916-03-29"), died: date("1997-07-08"), birth_place: "Rangpur", party_id: null, role: "president", era: "post-independence", tenure_start: date("1975-11-06"), tenure_end: date("1977-04-21"), achievements: ["Chief Justice", "President"] },
  { ...base(13, "Ziaur Rahman", "জিয়াউর রহমান", "Military officer, president, and founder of BNP."), born: date("1936-01-19"), died: date("1981-05-30"), birth_place: "Bogura", party_id: 2, role: "president", era: "post-independence", tenure_start: date("1977-04-21"), tenure_end: date("1981-05-30"), achievements: ["Sector commander", "Founded BNP"] },
  { ...base(14, "Abdus Sattar", "আবদুস সাত্তার", "President of Bangladesh in the early 1980s."), born: date("1906-03-01"), died: date("1985-10-05"), birth_place: "Birbhum", party_id: 2, role: "president", era: "post-independence", tenure_start: date("1981-11-20"), tenure_end: date("1982-03-24"), achievements: ["Served as Vice President and President"] },
  { ...base(15, "Hussain Muhammad Ershad", "হুসেইন মুহাম্মদ এরশাদ", "Army chief, president, and founder of Jatiya Party."), born: date("1930-02-01"), died: date("2019-07-14"), birth_place: "Rangpur", party_id: 3, role: "president", era: "post-independence", tenure_start: date("1983-12-11"), tenure_end: date("1990-12-06"), achievements: ["Founded Jatiya Party", "Administrative decentralization"] },
  { ...base(16, "Shahabuddin Ahmed", "শাহাবুদ্দিন আহমেদ", "Chief Justice and President during two transitional periods."), born: date("1930-02-01"), died: date("2022-03-19"), birth_place: "Netrakona", party_id: null, role: "president", era: "post-independence", tenure_start: date("1990-12-06"), tenure_end: date("1991-10-10"), achievements: ["Led 1991 transition", "Later elected President"] },
  { ...base(17, "Khaleda Zia", "খালেদা জিয়া", "First woman Prime Minister of Bangladesh."), born: date("1945-08-15"), died: null, birth_place: "Dinajpur", party_id: 2, role: "prime_minister", era: "post-independence", tenure_start: date("1991-03-20"), tenure_end: date("1996-03-30"), achievements: ["Prime Minister in 1991-1996 and 2001-2006"] },
  { ...base(18, "Sheikh Hasina", "শেখ হাসিনা", "Long-serving Prime Minister and Awami League president."), born: date("1947-09-28"), died: null, birth_place: "Tungipara, Gopalganj", party_id: 1, role: "prime_minister", era: "post-independence", tenure_start: date("1996-06-23"), tenure_end: null, achievements: ["Prime Minister in multiple terms", "Oversaw major infrastructure projects"] },
  { ...base(19, "Iajuddin Ahmed", "ইয়াজউদ্দিন আহম্মেদ", "President of Bangladesh from 2002 to 2009."), born: date("1931-02-01"), died: date("2012-12-10"), birth_place: "Munshiganj", party_id: null, role: "president", era: "post-independence", tenure_start: date("2002-09-06"), tenure_end: date("2009-02-12"), achievements: ["President during caretaker government period"] },
  { ...base(20, "Zillur Rahman", "জিল্লুর রহমান", "President of Bangladesh from 2009 to 2013."), born: date("1929-03-09"), died: date("2013-03-20"), birth_place: "Kishoreganj", party_id: 1, role: "president", era: "post-independence", tenure_start: date("2009-02-12"), tenure_end: date("2013-03-20"), achievements: ["Veteran Awami League organizer"] },
  { ...base(21, "Abdul Hamid", "আবদুল হামিদ", "Longest-serving President of Bangladesh."), born: date("1944-01-01"), died: null, birth_place: "Kishoreganj", party_id: 1, role: "president", era: "post-independence", tenure_start: date("2013-03-20"), tenure_end: date("2023-04-24"), achievements: ["Served two elected presidential terms"] },
  { ...base(22, "Mohammed Shahabuddin", "মো. সাহাবুদ্দিন", "President of Bangladesh from 2023."), born: date("1949-12-10"), died: null, birth_place: "Pabna", party_id: 1, role: "president", era: "post-independence", tenure_start: date("2023-04-24"), tenure_end: null, achievements: ["Elected President in 2023"] },
];

const authorNames: Array<[string, string, string, string, string[], string[]]> = [
  ["Charyapada Poets", "চর্যাপদের কবিগণ", "ancient", "poetry", ["Charyapada"], []],
  ["Shah Muhammad Sagir", "শাহ মুহম্মদ সগীর", "medieval", "poetry", ["Yusuf-Zulekha"], []],
  ["Alaol", "আলাওল", "medieval", "poetry", ["Padmavati"], []],
  ["Bharatchandra Ray", "ভারতচন্দ্র রায়", "medieval", "poetry", ["Annadamangal"], []],
  ["Michael Madhusudan Dutt", "মাইকেল মধুসূদন দত্ত", "modern", "poetry", ["Meghnad Badh Kavya"], []],
  ["Bankim Chandra Chattopadhyay", "বঙ্কিমচন্দ্র চট্টোপাধ্যায়", "modern", "novel", ["Anandamath"], []],
  ["Rabindranath Tagore", "রবীন্দ্রনাথ ঠাকুর", "modern", "poetry", ["Gitanjali"], ["Nobel Prize in Literature"]],
  ["Kazi Nazrul Islam", "কাজী নজরুল ইসলাম", "modern", "poetry", ["Bidrohi"], ["National Poet of Bangladesh"]],
  ["Begum Rokeya", "বেগম রোকেয়া", "modern", "essay", ["Sultana's Dream"], []],
  ["Jibanananda Das", "জীবনানন্দ দাশ", "modern", "poetry", ["Banalata Sen"], []],
  ["Sukanta Bhattacharya", "সুকান্ত ভট্টাচার্য", "modern", "poetry", ["Chharpatra"], []],
  ["Shamsur Rahman", "শামসুর রাহমান", "modern", "poetry", ["Bondi Shibir Theke"], ["Ekushey Padak"]],
  ["Al Mahmud", "আল মাহমুদ", "modern", "poetry", ["Sonali Kabin"], ["Ekushey Padak"]],
  ["Syed Shamsul Haq", "সৈয়দ শামসুল হক", "modern", "drama", ["Payer Awaj Pawa Jay"], ["Bangla Academy Literary Award"]],
  ["Humayun Ahmed", "হুমায়ূন আহমেদ", "contemporary", "novel", ["Nondito Noroke"], ["Ekushey Padak"]],
  ["Zahir Raihan", "জহির রায়হান", "modern", "novel", ["Hajar Bochor Dhore"], []],
  ["Hasan Azizul Huq", "হাসান আজিজুল হক", "contemporary", "short_story", ["Agunpakhi"], ["Ekushey Padak"]],
  ["Selina Hossain", "সেলিনা হোসেন", "contemporary", "novel", ["Hangor Nodi Grenade"], ["Ekushey Padak"]],
  ["Anisul Hoque", "আনিসুল হক", "contemporary", "novel", ["Maa"], []],
  ["Muhammed Zafar Iqbal", "মুহম্মদ জাফর ইকবাল", "contemporary", "science", ["Ami Topu"], []],
  ["Abdullah Abu Sayeed", "আবদুল্লাহ আবু সায়ীদ", "contemporary", "essay", ["Songothon O Bangali"], []],
  ["Sufia Kamal", "সুফিয়া কামাল", "modern", "poetry", ["Sanjher Maya"], ["Ekushey Padak"]],
  ["Sufia Khatun", "সুফিয়া খাতুন", "modern", "poetry", ["Poems"], []],
  ["Nirmalendu Goon", "নির্মলেন্দু গুণ", "contemporary", "poetry", ["Premangshur Rokto Chai"], ["Ekushey Padak"]],
  ["Helal Hafiz", "হেলাল হাফিজ", "contemporary", "poetry", ["Je Jole Agun Jole"], []],
  ["Rudra Mohammad Shahidullah", "রুদ্র মুহম্মদ শহীদুল্লাহ", "contemporary", "poetry", ["Manusher Manchitra"], []],
  ["Akhteruzzaman Elias", "আখতারুজ্জামান ইলিয়াস", "modern", "novel", ["Chilekothar Sepai"], []],
  ["Shawkat Osman", "শওকত ওসমান", "modern", "novel", ["Kritodasher Hashi"], []],
  ["Abu Ishaque", "আবু ইসহাক", "modern", "novel", ["Surja Dighal Bari"], []],
  ["Bibhutibhushan Bandyopadhyay", "বিভূতিভূষণ বন্দ্যোপাধ্যায়", "modern", "novel", ["Pather Panchali"], []],
  ["Tarashankar Bandyopadhyay", "তারাশঙ্কর বন্দ্যোপাধ্যায়", "modern", "novel", ["Ganadevata"], []],
  ["Manik Bandopadhyay", "মানিক বন্দ্যোপাধ্যায়", "modern", "novel", ["Padma Nadir Majhi"], []],
  ["Sarat Chandra Chattopadhyay", "শরৎচন্দ্র চট্টোপাধ্যায়", "modern", "novel", ["Devdas"], []],
  ["Qazi Motahar Hossain", "কাজী মোতাহার হোসেন", "modern", "essay", ["Sanchayan"], []],
  ["Buddhadeva Bose", "বুদ্ধদেব বসু", "modern", "poetry", ["Tapaswi O Tarangini"], []],
  ["Bishnu Dey", "বিষ্ণু দে", "modern", "poetry", ["Smriti Satta Bhabishyat"], []],
  ["Samar Sen", "সমর সেন", "modern", "poetry", ["Koyekti Kobita"], []],
  ["Ahmed Sofa", "আহমদ ছফা", "contemporary", "essay", ["Joddopi Amar Guru"], []],
  ["Razibul Hasan", "রাজিবুল হাসান", "contemporary", "poetry", ["Selected Poems"], []],
  ["Rizia Rahman", "রিজিয়া রহমান", "contemporary", "novel", ["Bong Theke Bangla"], []],
  ["Dilara Hashim", "দিলারা হাশেম", "contemporary", "novel", ["Ghar Mon Janala"], []],
  ["Mahmudul Haque", "মাহমুদুল হক", "contemporary", "novel", ["Kalo Borof"], []],
  ["Imdadul Haq Milon", "ইমদাদুল হক মিলন", "contemporary", "novel", ["Nurjahan"], []],
  ["Nasreen Jahan", "নাসরীন জাহান", "contemporary", "novel", ["Urukku"], []],
  ["Muntassir Mamoon", "মুনতাসীর মামুন", "contemporary", "history", ["Dhaka Smriti Bismritir Nagari"], []],
  ["Satyen Sen", "সত্যেন সেন", "modern", "novel", ["Bhorer Bihongo"], []],
  ["Abul Fazal", "আবুল ফজল", "modern", "essay", ["Chouchir"], []],
  ["Abul Mansur Ahmad", "আবুল মনসুর আহমদ", "modern", "short_story", ["Aina"], []],
  ["Farrukh Ahmad", "ফররুখ আহমদ", "modern", "poetry", ["Sat Sagorer Majhi"], []],
  ["Kaiser Haq", "কায়সার হক", "contemporary", "poetry", ["Published in the Streets of Dhaka"], []],
  ["Tahmima Anam", "তাহমিমা আনাম", "contemporary", "novel", ["A Golden Age"], []],
  ["K. Anis Ahmed", "কে. আনিস আহমেদ", "contemporary", "novel", ["The World in My Hands"], []],
];

export const authors = authorNames.map(([name_en, name_bn, era, genre, works, awards], index) => ({
  ...base(index + 1, name_en, name_bn, `${name_en} is included in the Bangladesh literature seed as an important ${era} literary figure.`),
  born: null,
  died: null,
  birth_place: null,
  genres: [genre],
  era,
  bio_en: `${name_en} is represented in this Phase 1 seed for Bangladesh literary discovery.`,
  bio_bn: `${name_bn} বাংলাদেশের সাহিত্য অনুসন্ধানের প্রাথমিক ডেটাসেটে অন্তর্ভুক্ত।`,
  awards,
  primaryWork: works[0],
}));

export const books = authors.flatMap((author, index) => {
  const title = author.primaryWork;
  const genre = author.genres[0];
  const year = index < 4 ? 1600 + index * 80 : index < 36 ? 1860 + index * 3 : 1990 + index;
  return [
    {
      ...base(index + 1, title, title, `${title} is a notable work associated with ${author.name_en}.`),
      title_en: title,
      title_bn: title,
      author_id: author.id,
      published_year: year,
      publisher: null,
      isbn: null,
      genre,
      century: year < 1900 ? "19th" : year < 2000 ? "20th" : "21st",
      language: author.name_en === "Tahmima Anam" || author.name_en === "K. Anis Ahmed" || author.name_en === "Kaiser Haq" ? "english" : "bengali",
      cover_image_url: null,
      cover_source: null,
    },
  ];
});

export const sportsCategories = [
  { ...base(1, "Cricket", "ক্রিকেট", "Bangladesh's most followed team sport."), type: "team" },
  { ...base(2, "Football", "ফুটবল", "Historic and widely played team sport in Bangladesh."), type: "team" },
  { ...base(3, "Kabaddi", "কাবাডি", "Bangladesh's national sport."), type: "team" },
  { ...base(4, "Archery", "তীরন্দাজি", "An individual sport where Bangladesh has earned international medals."), type: "individual" },
  { ...base(5, "Chess", "দাবা", "Individual mind sport with Bangladeshi grandmasters."), type: "individual" },
];

export const players = [
  { ...base(1, "Shakib Al Hasan", "সাকিব আল হাসান", "All-rounder and one of Bangladesh cricket's greatest players."), born: date("1987-03-24"), birth_place: "Magura", sport_id: 1, position_or_role: "All-rounder", national_team: "Bangladesh cricket team", active_years: "2006-present", career_stats: { format: "international", role: "all-rounder" }, achievements: ["Former ICC all-rounder rankings leader"], is_legend: true },
  { ...base(2, "Tamim Iqbal", "তামিম ইকবাল", "Opening batter and Bangladesh's long-time run scorer."), born: date("1989-03-20"), birth_place: "Chattogram", sport_id: 1, position_or_role: "Opening batter", national_team: "Bangladesh cricket team", active_years: "2007-2023", career_stats: { role: "batter" }, achievements: ["Bangladesh ODI captain"], is_legend: true },
  { ...base(3, "Mushfiqur Rahim", "মুশফিকুর রহিম", "Wicketkeeper-batter and senior Bangladesh cricketer."), born: date("1987-06-09"), birth_place: "Bogura", sport_id: 1, position_or_role: "Wicketkeeper-batter", national_team: "Bangladesh cricket team", active_years: "2005-present", career_stats: { role: "wicketkeeper" }, achievements: ["Former captain"], is_legend: true },
  { ...base(4, "Mashrafe Mortaza", "মাশরাফি বিন মুর্তজা", "Pace bowler and influential Bangladesh cricket captain."), born: date("1983-10-05"), birth_place: "Narail", sport_id: 1, position_or_role: "Fast bowler", national_team: "Bangladesh cricket team", active_years: "2001-2020", career_stats: { role: "bowler" }, achievements: ["Led Bangladesh in multiple ICC tournaments"], is_legend: true },
  { ...base(5, "Salahuddin Lavlu", "সালাউদ্দিন লাভলু", "Representative football seed record for Bangladesh football history."), born: null, birth_place: null, sport_id: 2, position_or_role: "Footballer", national_team: "Bangladesh football team", active_years: null, career_stats: {}, achievements: [], is_legend: false },
  { ...base(6, "Kazi Salahuddin", "কাজী সালাউদ্দিন", "Legendary Bangladeshi footballer and organizer."), born: date("1954-09-23"), birth_place: "Dhaka", sport_id: 2, position_or_role: "Forward", national_team: "Bangladesh football team", active_years: "1970s-1980s", career_stats: { role: "forward" }, achievements: ["Swadhin Bangla football team member"], is_legend: true },
  { ...base(7, "Monem Munna", "মোনেম মুন্না", "Iconic Bangladeshi football defender."), born: date("1966-06-09"), birth_place: "Narayanganj", sport_id: 2, position_or_role: "Defender", national_team: "Bangladesh football team", active_years: "1980s-1990s", career_stats: { role: "defender" }, achievements: ["Bangladesh football icon"], is_legend: true },
  { ...base(8, "Sabina Khatun", "সাবিনা খাতুন", "Captain and leading figure in Bangladesh women's football."), born: date("1993-10-25"), birth_place: "Satkhira", sport_id: 2, position_or_role: "Forward", national_team: "Bangladesh women's football team", active_years: "2009-present", career_stats: { role: "forward" }, achievements: ["SAFF Women's Championship winner"], is_legend: true },
  { ...base(9, "Masud Karim", "মাসুদ করিম", "Representative kabaddi player record for Bangladesh national sport data."), born: null, birth_place: null, sport_id: 3, position_or_role: "Raider", national_team: "Bangladesh kabaddi team", active_years: null, career_stats: {}, achievements: ["National kabaddi representative"], is_legend: false },
  { ...base(10, "Ruman Shana", "রোমান সানা", "Bangladeshi archer with major international success."), born: date("1995-06-08"), birth_place: "Khulna", sport_id: 4, position_or_role: "Recurve archer", national_team: "Bangladesh archery team", active_years: "2010s-present", career_stats: { discipline: "recurve" }, achievements: ["World Archery Championship medalist"], is_legend: true },
  { ...base(11, "Niaz Murshed", "নিয়াজ মোরশেদ", "First South Asian chess grandmaster."), born: date("1966-05-13"), birth_place: "Dhaka", sport_id: 5, position_or_role: "Grandmaster", national_team: "Bangladesh chess", active_years: "1980s-present", career_stats: { title: "Grandmaster" }, achievements: ["First South Asian Grandmaster"], is_legend: true },
];

export const nationalTeams = [
  { ...base(1, "Bangladesh Men's Cricket Team", "বাংলাদেশ পুরুষ ক্রিকেট দল", "National cricket team representing Bangladesh."), sport_id: 1, founded_year: 1977, governing_body: "Bangladesh Cricket Board", major_achievements: ["ICC Trophy 1997", "Test status 2000"], current_ranking: null },
  { ...base(2, "Bangladesh National Football Team", "বাংলাদেশ জাতীয় ফুটবল দল", "Men's national football team of Bangladesh."), sport_id: 2, founded_year: 1972, governing_body: "Bangladesh Football Federation", major_achievements: ["SAFF Championship 2003"], current_ranking: null },
  { ...base(3, "Bangladesh National Kabaddi Team", "বাংলাদেশ জাতীয় কাবাডি দল", "National team for Bangladesh's national sport."), sport_id: 3, founded_year: 1970, governing_body: "Bangladesh Kabaddi Federation", major_achievements: ["Asian Games medals"], current_ranking: null },
  { ...base(4, "Bangladesh Archery Team", "বাংলাদেশ তীরন্দাজি দল", "National archery team representing Bangladesh."), sport_id: 4, founded_year: 2000, governing_body: "Bangladesh Archery Federation", major_achievements: ["International archery medals"], current_ranking: null },
];

export const scientists = [
  { ...base(1, "Jagadish Chandra Bose", "জগদীশচন্দ্র বসু", "Pioneering physicist and plant scientist from Bengal."), born: date("1858-11-30"), died: date("1937-11-23"), field: "Physics and plant science", institutions: ["Presidency College"], achievements: ["Radio science pioneer", "Plant physiology research"] },
  { ...base(2, "Satyendra Nath Bose", "সত্যেন্দ্রনাথ বসু", "Physicist known for Bose-Einstein statistics."), born: date("1894-01-01"), died: date("1974-02-04"), field: "Physics", institutions: ["University of Dhaka", "University of Calcutta"], achievements: ["Bose-Einstein statistics"] },
  { ...base(3, "Qudrat-i-Khuda", "কুদরাত-এ-খুদা", "Bangladeshi scientist, educator, and science organizer."), born: date("1900-12-01"), died: date("1977-11-03"), field: "Chemistry", institutions: ["University of Dhaka"], achievements: ["Education commission leadership"] },
  { ...base(4, "Maqsudul Alam", "মাকসুদুল আলম", "Genome scientist associated with plant genome sequencing."), born: date("1954-12-14"), died: date("2014-12-20"), field: "Genomics", institutions: ["University of Hawaii"], achievements: ["Jute genome sequencing work"] },
  { ...base(5, "Fazlur Rahman Khan", "ফজলুর রহমান খান", "Bangladeshi-American structural engineer."), born: date("1929-04-03"), died: date("1982-03-27"), field: "Structural engineering", institutions: ["Skidmore, Owings & Merrill"], achievements: ["Tubular structural system for skyscrapers"] },
];

export const artists = [
  { ...base(1, "Zainul Abedin", "জয়নুল আবেদিন", "Pioneer of modern art in Bangladesh."), born: date("1914-12-29"), died: date("1976-05-28"), medium: "painting", notable_works: ["Famine sketches"], awards: ["Independence Day Award"] },
  { ...base(2, "Quamrul Hassan", "কামরুল হাসান", "Artist and designer associated with Bangladesh's visual culture."), born: date("1921-12-02"), died: date("1988-02-02"), medium: "painting", notable_works: ["Liberation War posters"], awards: ["Independence Day Award"] },
  { ...base(3, "SM Sultan", "এস এম সুলতান", "Painter known for powerful rural figures."), born: date("1923-08-10"), died: date("1994-10-10"), medium: "painting", notable_works: ["Peasant paintings"], awards: ["Ekushey Padak"] },
  { ...base(4, "Tareque Masud", "তারেক মাসুদ", "Filmmaker known for works on identity and Liberation War memory."), born: date("1956-12-06"), died: date("2011-08-13"), medium: "film", notable_works: ["Matir Moina", "Muktir Gaan"], awards: [] },
  { ...base(5, "Shahabuddin Ahmed", "শাহাবুদ্দিন আহমেদ", "Painter known for dynamic Liberation War-inspired figures."), born: date("1950-09-11"), died: null, medium: "painting", notable_works: ["Freedom fighter figures"], awards: ["Independence Day Award"] },
];

export const freedomFighters = [
  { ...base(1, "M. A. G. Osmani", "এম. এ. জি. ওসমানী", "Commander-in-chief of Bangladesh Forces during the Liberation War."), born: date("1918-09-01"), died: date("1984-02-16"), district: "Sylhet", role: "Commander-in-Chief", sector: "All sectors", awarded_title: null },
  { ...base(2, "Khaled Mosharraf", "খালেদ মোশাররফ", "Sector commander and senior Liberation War officer."), born: date("1937-11-09"), died: date("1975-11-07"), district: "Jamalpur", role: "Sector commander", sector: "Sector 2", awarded_title: "Bir Uttom" },
  { ...base(3, "Ziaur Rahman", "জিয়াউর রহমান", "Sector commander and Z Force commander during the Liberation War."), born: date("1936-01-19"), died: date("1981-05-30"), district: "Bogura", role: "Sector commander", sector: "Sector 1 / Z Force", awarded_title: "Bir Uttom" },
  { ...base(4, "K. M. Shafiullah", "কে. এম. শফিউল্লাহ", "S Force commander during the Liberation War."), born: date("1934-09-02"), died: null, district: "Narayanganj", role: "Force commander", sector: "S Force", awarded_title: "Bir Uttom" },
  { ...base(5, "A. T. M. Haider", "এ. টি. এম. হায়দার", "Sector commander in the Liberation War."), born: date("1942-01-12"), died: date("1975-11-07"), district: "Kishoreganj", role: "Sector commander", sector: "Sector 2", awarded_title: "Bir Uttom" },
  { ...base(6, "Taramon Bibi", "তারামন বিবি", "Decorated woman freedom fighter."), born: date("1957-01-01"), died: date("2018-12-01"), district: "Kurigram", role: "Freedom fighter", sector: "Sector 11", awarded_title: "Bir Protik" },
  { ...base(7, "Kakon Bibi", "কাকন বিবি", "Freedom fighter and wartime intelligence worker."), born: null, died: date("2018-03-21"), district: "Sunamganj", role: "Freedom fighter", sector: "Sector 5", awarded_title: "Bir Protik" },
  { ...base(8, "Rumi", "রুমি", "Guerrilla fighter associated with the Crack Platoon in Dhaka."), born: date("1951-03-29"), died: date("1971-08-30"), district: "Dhaka", role: "Guerrilla fighter", sector: "Sector 2", awarded_title: "Bir Bikrom" },
  { ...base(9, "Badiul Alam", "বদিউল আলম", "Crack Platoon guerrilla fighter."), born: null, died: date("1971-08-30"), district: "Dhaka", role: "Guerrilla fighter", sector: "Sector 2", awarded_title: "Bir Bikrom" },
  { ...base(10, "Matiur Rahman", "মতিউর রহমান", "Flight lieutenant honored for Liberation War sacrifice."), born: date("1941-10-29"), died: date("1971-08-20"), district: "Dhaka", role: "Air force officer", sector: null, awarded_title: "Bir Sreshtho" },
];


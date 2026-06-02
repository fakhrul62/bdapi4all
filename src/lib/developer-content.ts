import { encyclopediaEndpointDefinitions } from "@/lib/encyclopedia-content";

export type EndpointParameter = {
  name: string;
  label: string;
  type: "string" | "integer" | "number";
  location: "path" | "query";
  required: boolean;
  description: string;
  example: string;
};

export type EndpointDefinition = {
  slug: string;
  group: string;
  title: string;
  method: "GET";
  path: string;
  summary: string;
  description: string;
  cacheTtl: string;
  parameters: EndpointParameter[];
  sampleResponse: unknown;
  recipes: string[];
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://bdapi4all.vercel.app/api/v1";

const coreEndpointDefinitions: EndpointDefinition[] = [
  {
    slug: "divisions",
    group: "Geo & Location",
    title: "Divisions",
    method: "GET",
    path: "/divisions",
    summary: "List all 8 divisions.",
    description: "Returns every administrative division in Bangladesh with English/Bengali names and coordinates.",
    cacheTtl: "24 hours",
    parameters: [],
    sampleResponse: [{ id: 6, name_en: "Dhaka", name_bn: "ঢাকা", lat: 23.8103, lng: 90.4125 }],
    recipes: ["Build a division dropdown", "Browse Bangladesh administrative hierarchy"],
  },
  {
    slug: "division",
    group: "Geo & Location",
    title: "Single Division",
    method: "GET",
    path: "/divisions/{id}",
    summary: "Get one division with districts.",
    description: "Returns one division and the districts under it.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "id", label: "Division ID", type: "integer", location: "path", required: true, description: "Division id.", example: "6" },
    ],
    sampleResponse: { id: 6, name_en: "Dhaka", name_bn: "ঢাকা", districts: [] },
    recipes: ["Load districts after a division is selected"],
  },
  {
    slug: "districts",
    group: "Geo & Location",
    title: "Districts",
    method: "GET",
    path: "/districts",
    summary: "List all 64 districts.",
    description: "Returns districts, optionally filtered by division_id.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "division_id", label: "Division ID", type: "integer", location: "query", required: false, description: "Filter districts by division.", example: "6" },
    ],
    sampleResponse: [{ id: 47, division_id: 6, name_en: "Dhaka", name_bn: "ঢাকা", lat: 23.7115253, lng: 90.4111451 }],
    recipes: ["Build a district dropdown", "Find district ids for prayer-time requests"],
  },
  {
    slug: "district",
    group: "Geo & Location",
    title: "Single District",
    method: "GET",
    path: "/districts/{id}",
    summary: "Get one district with upazilas.",
    description: "Returns one district, its division, and all upazilas under it.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "id", label: "District ID", type: "integer", location: "path", required: true, description: "District id.", example: "47" },
    ],
    sampleResponse: { id: 47, name_en: "Dhaka", name_bn: "ঢাকা", upazilas: [] },
    recipes: ["Load upazilas after district selection"],
  },
  {
    slug: "upazilas",
    group: "Geo & Location",
    title: "Upazilas",
    method: "GET",
    path: "/upazilas",
    summary: "List upazilas.",
    description: "Returns all upazilas or only upazilas under a district.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "district_id", label: "District ID", type: "integer", location: "query", required: false, description: "Filter by district.", example: "47" },
    ],
    sampleResponse: [{ id: 302, district_id: 47, name_en: "Dhamrai", name_bn: "ধামরাই" }],
    recipes: ["Build dependent district/upazila selects"],
  },
  {
    slug: "upazila",
    group: "Geo & Location",
    title: "Single Upazila",
    method: "GET",
    path: "/upazilas/{id}",
    summary: "Get one upazila with unions.",
    description: "Returns one upazila, its district, and unions under it.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "id", label: "Upazila ID", type: "integer", location: "path", required: true, description: "Upazila id.", example: "302" },
    ],
    sampleResponse: { id: 302, name_en: "Dhamrai", name_bn: "ধামরাই", unions: [] },
    recipes: ["Load unions after upazila selection"],
  },
  {
    slug: "unions",
    group: "Geo & Location",
    title: "Unions",
    method: "GET",
    path: "/unions",
    summary: "List unions.",
    description: "Returns unions, optionally filtered by upazila_id. Unfiltered requests are capped for performance.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "upazila_id", label: "Upazila ID", type: "integer", location: "query", required: false, description: "Filter by upazila.", example: "302" },
    ],
    sampleResponse: [{ id: 2794, upazila_id: 302, name_en: "Dhamrai", name_bn: "ধামরাই" }],
    recipes: ["Build full Bangladesh address forms"],
  },
  {
    slug: "postcodes",
    group: "Geo & Location",
    title: "Postcodes",
    method: "GET",
    path: "/postcodes",
    summary: "Search postcodes.",
    description: "Search postcode records by district_id, upazila_id, or postcode. Data expansion is planned after a stable dataset is added.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "district_id", label: "District ID", type: "integer", location: "query", required: false, description: "Filter by district.", example: "47" },
      { name: "upazila_id", label: "Upazila ID", type: "integer", location: "query", required: false, description: "Filter by upazila.", example: "302" },
      { name: "postcode", label: "Postcode", type: "string", location: "query", required: false, description: "Four-digit postcode.", example: "1350" },
    ],
    sampleResponse: [],
    recipes: ["Validate postcode input"],
  },
  {
    slug: "geocode",
    group: "Geo & Location",
    title: "Geocode",
    method: "GET",
    path: "/geocode",
    summary: "Get coordinates for a district or upazila.",
    description: "Finds a district or upazila by English name and returns latitude/longitude.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "district", label: "District", type: "string", location: "query", required: false, description: "District English name.", example: "Dhaka" },
      { name: "upazila", label: "Upazila", type: "string", location: "query", required: false, description: "Upazila English name.", example: "Dhamrai" },
    ],
    sampleResponse: { id: 47, name_en: "Dhaka", name_bn: "ঢাকা", lat: 23.7115253, lng: 90.4111451 },
    recipes: ["Map a district center", "Find coordinates for prayer-time calculation"],
  },
  {
    slug: "prayer-times",
    group: "Prayer Times",
    title: "Daily Prayer Times",
    method: "GET",
    path: "/prayer-times",
    summary: "Calculate daily prayer times.",
    description: "Calculates prayer times using adhan-js from a district id or coordinates.",
    cacheTtl: "1 hour",
    parameters: [
      { name: "district_id", label: "District ID", type: "integer", location: "query", required: false, description: "District id. Required unless coordinates are supplied.", example: "47" },
      { name: "lat", label: "Latitude", type: "number", location: "query", required: false, description: "Latitude in Bangladesh bounds.", example: "23.7115" },
      { name: "lng", label: "Longitude", type: "number", location: "query", required: false, description: "Longitude in Bangladesh bounds.", example: "90.4111" },
      { name: "date", label: "Date", type: "string", location: "query", required: false, description: "YYYY-MM-DD date.", example: "2026-06-02" },
    ],
    sampleResponse: { date: "2026-06-02", timezone: "Asia/Dhaka", times: { fajr: "03:46 AM", sunrise: "05:12 AM", dhuhr: "11:58 AM", asr: "04:42 PM", maghrib: "06:44 PM", isha: "08:10 PM" } },
    recipes: ["Show today prayer times by district"],
  },
  {
    slug: "prayer-times-monthly",
    group: "Prayer Times",
    title: "Monthly Prayer Times",
    method: "GET",
    path: "/prayer-times/monthly",
    summary: "Calculate a full month prayer schedule.",
    description: "Returns daily prayer times for every day in a requested month.",
    cacheTtl: "1 hour",
    parameters: [
      { name: "district_id", label: "District ID", type: "integer", location: "query", required: false, description: "District id. Required unless coordinates are supplied.", example: "47" },
      { name: "year", label: "Year", type: "integer", location: "query", required: true, description: "Gregorian year.", example: "2026" },
      { name: "month", label: "Month", type: "integer", location: "query", required: true, description: "Month number.", example: "6" },
      { name: "lat", label: "Latitude", type: "number", location: "query", required: false, description: "Latitude in Bangladesh bounds.", example: "23.7115" },
      { name: "lng", label: "Longitude", type: "number", location: "query", required: false, description: "Longitude in Bangladesh bounds.", example: "90.4111" },
    ],
    sampleResponse: { year: 2026, month: 6, timezone: "Asia/Dhaka", days: [{ date: "2026-06-01", times: {} }] },
    recipes: ["Render a Ramadan or monthly prayer calendar"],
  },
  {
    slug: "holidays",
    group: "Holidays",
    title: "Holidays",
    method: "GET",
    path: "/holidays",
    summary: "List holidays by year.",
    description: "Returns curated Bangladesh holiday records for a year.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "year", label: "Year", type: "integer", location: "query", required: false, description: "Holiday year.", example: "2026" },
    ],
    sampleResponse: { year: 2026, holidays: [{ date: "2026-02-21T00:00:00.000Z", name_en: "Shaheed Day and International Mother Language Day", name_bn: "শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস", type: "national" }] },
    recipes: ["Check office calendar holidays"],
  },
  {
    slug: "holiday-date",
    group: "Holidays",
    title: "Holiday by Date",
    method: "GET",
    path: "/holidays/{date}",
    summary: "Check whether a date is a holiday.",
    description: "Returns a boolean and holiday details when a date is a known holiday.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "date", label: "Date", type: "string", location: "path", required: true, description: "YYYY-MM-DD date.", example: "2026-02-21" },
    ],
    sampleResponse: { date: "2026-02-21", is_holiday: true, holiday: {} },
    recipes: ["Disable date picker holidays"],
  },
  {
    slug: "holiday-next",
    group: "Holidays",
    title: "Next Holiday",
    method: "GET",
    path: "/holidays/next",
    summary: "Get the next upcoming holiday.",
    description: "Returns the next holiday from today.",
    cacheTtl: "24 hours",
    parameters: [],
    sampleResponse: { date: "2026-12-16T00:00:00.000Z", name_en: "Victory Day", name_bn: "বিজয় দিবস", type: "national" },
    recipes: ["Show upcoming holiday badges"],
  },
  {
    slug: "exchange-rates",
    group: "Exchange Rates",
    title: "Exchange Rates",
    method: "GET",
    path: "/exchange-rates",
    summary: "List latest exchange rates.",
    description: "Returns latest rates imported from Bangladesh Bank or fallback maintained values.",
    cacheTtl: "1 hour",
    parameters: [],
    sampleResponse: { source: "Bangladesh Bank", rates: [{ currency_code: "USD", buying_rate: 117.5, selling_rate: 118.2 }] },
    recipes: ["Show BDT exchange-rate widgets"],
  },
  {
    slug: "exchange-rate-currency",
    group: "Exchange Rates",
    title: "Exchange Rate by Currency",
    method: "GET",
    path: "/exchange-rates/{currency}",
    summary: "Get latest rate for one currency.",
    description: "Returns latest exchange-rate row for a currency code such as USD.",
    cacheTtl: "1 hour",
    parameters: [
      { name: "currency", label: "Currency", type: "string", location: "path", required: true, description: "Three-letter currency code.", example: "USD" },
    ],
    sampleResponse: { currency_code: "USD", currency_name: "US Dollar", buying_rate: 117.5, selling_rate: 118.2 },
    recipes: ["Convert USD display values to BDT"],
  },
  {
    slug: "exchange-rate-history",
    group: "Exchange Rates",
    title: "Exchange Rate History",
    method: "GET",
    path: "/exchange-rates/history",
    summary: "Get rate history for a currency.",
    description: "Returns stored rate rows between from/to dates.",
    cacheTtl: "1 hour",
    parameters: [
      { name: "currency", label: "Currency", type: "string", location: "query", required: true, description: "Three-letter currency code.", example: "USD" },
      { name: "from", label: "From", type: "string", location: "query", required: true, description: "YYYY-MM-DD start date.", example: "2026-06-01" },
      { name: "to", label: "To", type: "string", location: "query", required: true, description: "YYYY-MM-DD end date.", example: "2026-06-02" },
    ],
    sampleResponse: { currency: "USD", from: "2026-06-01", to: "2026-06-02", rates: [] },
    recipes: ["Draw a currency history chart"],
  },
  {
    slug: "mobile-operator",
    group: "Mobile",
    title: "Mobile Operator",
    method: "GET",
    path: "/mobile/operator",
    summary: "Detect operator from a Bangladeshi mobile number.",
    description: "Normalizes a Bangladesh mobile number and returns its operator prefix.",
    cacheTtl: "10 minutes",
    parameters: [
      { name: "number", label: "Mobile Number", type: "string", location: "query", required: true, description: "Bangladesh mobile number.", example: "01712345678" },
    ],
    sampleResponse: { number: "01712345678", normalized: "01712345678", operator: { prefix: "017", operator: "Grameenphone" } },
    recipes: ["Show operator during phone signup"],
  },
  {
    slug: "mobile-operators",
    group: "Mobile",
    title: "Mobile Operators",
    method: "GET",
    path: "/mobile/operators",
    summary: "List all mobile operator prefixes.",
    description: "Returns the maintained Bangladesh mobile operator prefix list.",
    cacheTtl: "24 hours",
    parameters: [],
    sampleResponse: [{ prefix: "017", operator: "Grameenphone", brand: "Grameenphone" }],
    recipes: ["Validate phone prefixes locally"],
  },
  {
    slug: "validate-nid",
    group: "Validators",
    title: "Validate NID",
    method: "GET",
    path: "/validate/nid",
    summary: "Validate NID format.",
    description: "Checks whether an NID matches 10, 13, or 17 digit formats.",
    cacheTtl: "10 minutes",
    parameters: [
      { name: "nid", label: "NID", type: "string", location: "query", required: true, description: "NID number.", example: "1234567890" },
    ],
    sampleResponse: { nid: "1234567890", valid: true, format: "smart-card" },
    recipes: ["Pre-check NID form input"],
  },
  {
    slug: "validate-tin",
    group: "Validators",
    title: "Validate TIN",
    method: "GET",
    path: "/validate/tin",
    summary: "Validate TIN format.",
    description: "Checks whether a TIN matches the 12 digit e-TIN format.",
    cacheTtl: "10 minutes",
    parameters: [
      { name: "tin", label: "TIN", type: "string", location: "query", required: true, description: "TIN number.", example: "123456789012" },
    ],
    sampleResponse: { tin: "123456789012", valid: true, format: "12-digit-e-tin" },
    recipes: ["Validate business profile forms"],
  },
  {
    slug: "validate-mobile",
    group: "Validators",
    title: "Validate Mobile",
    method: "GET",
    path: "/validate/mobile",
    summary: "Validate Bangladesh mobile numbers.",
    description: "Checks mobile number format and returns detected operator.",
    cacheTtl: "10 minutes",
    parameters: [
      { name: "number", label: "Mobile Number", type: "string", location: "query", required: true, description: "Bangladesh mobile number.", example: "01712345678" },
    ],
    sampleResponse: { number: "01712345678", normalized: "01712345678", valid: true, operator: {} },
    recipes: ["Normalize phone registration input"],
  },
  {
    slug: "validate-postcode",
    group: "Validators",
    title: "Validate Postcode",
    method: "GET",
    path: "/validate/postcode",
    summary: "Validate postcode format.",
    description: "Checks Bangladesh four digit postcode format.",
    cacheTtl: "10 minutes",
    parameters: [
      { name: "postcode", label: "Postcode", type: "string", location: "query", required: true, description: "Four digit postcode.", example: "1350" },
    ],
    sampleResponse: { postcode: "1350", valid: true, format: "4-digit" },
    recipes: ["Pre-check shipping address forms"],
  },
  {
    slug: "bn-to-bengali",
    group: "Bengali Utilities",
    title: "English to Bengali Digits",
    method: "GET",
    path: "/bn/to-bengali",
    summary: "Convert English digits to Bengali digits.",
    description: "Converts 0-9 to Bengali numeral characters.",
    cacheTtl: "1 hour",
    parameters: [
      { name: "text", label: "Text", type: "string", location: "query", required: true, description: "Text containing English digits.", example: "2026" },
    ],
    sampleResponse: { original: "2026", converted: "২০২৬" },
    recipes: ["Render Bengali numerals in UI"],
  },
  {
    slug: "bn-to-english",
    group: "Bengali Utilities",
    title: "Bengali to English Digits",
    method: "GET",
    path: "/bn/to-english",
    summary: "Convert Bengali digits to English digits.",
    description: "Converts Bengali numeral characters to 0-9.",
    cacheTtl: "1 hour",
    parameters: [
      { name: "text", label: "Text", type: "string", location: "query", required: true, description: "Text containing Bengali digits.", example: "২০২৬" },
    ],
    sampleResponse: { original: "২০২৬", converted: "2026" },
    recipes: ["Normalize localized number input"],
  },
  {
    slug: "bn-transliterate",
    group: "Bengali Utilities",
    title: "Basic Transliteration",
    method: "GET",
    path: "/bn/transliterate",
    summary: "Basic English to Bengali transliteration.",
    description: "A lightweight transliteration helper for simple text experiments.",
    cacheTtl: "1 hour",
    parameters: [
      { name: "text", label: "Text", type: "string", location: "query", required: true, description: "English text.", example: "bangladesh" },
    ],
    sampleResponse: { original: "bangladesh", transliterated: "বাংলাদেশ" },
    recipes: ["Prototype Bengali text input helpers"],
  },
];

export const endpointDefinitions: EndpointDefinition[] = [
  ...coreEndpointDefinitions,
  ...encyclopediaEndpointDefinitions,
];

export const endpointGroups = Array.from(
  new Set(endpointDefinitions.map((endpoint) => endpoint.group)),
);

export function findEndpoint(slug: string) {
  return endpointDefinitions.find((endpoint) => endpoint.slug === slug);
}

export function buildUrl(endpoint: EndpointDefinition, values: Record<string, string>) {
  let path = endpoint.path;
  for (const parameter of endpoint.parameters.filter((item) => item.location === "path")) {
    path = path.replace(`{${parameter.name}}`, values[parameter.name] || parameter.example);
  }

  const search = new URLSearchParams();
  for (const parameter of endpoint.parameters.filter((item) => item.location === "query")) {
    const value = values[parameter.name];
    if (value) search.set(parameter.name, value);
  }

  return `${API_BASE_URL}${path}${search.toString() ? `?${search.toString()}` : ""}`;
}

export function codeSamples(endpoint: EndpointDefinition) {
  const values = Object.fromEntries(endpoint.parameters.map((param) => [param.name, param.example]));
  const url = buildUrl(endpoint, values);

  return {
    curl: `curl "${url}"`,
    javascript: `const response = await fetch("${url}");\nconst payload = await response.json();\nconsole.log(payload.data);`,
    python: `import requests\n\nresponse = requests.get("${url}")\nprint(response.json()["data"])`,
    php: `$response = file_get_contents("${url}");\n$data = json_decode($response, true);\nprint_r($data["data"]);`,
    laravel: `$response = Http::get("${url}");\n$data = $response->json("data");`,
    nextjs: `export default async function Page() {\n  const res = await fetch("${url}", { next: { revalidate: 3600 } });\n  const payload = await res.json();\n  return <pre>{JSON.stringify(payload.data, null, 2)}</pre>;\n}`,
  };
}

import type { EndpointDefinition } from "@/lib/developer-content";

const categories = [
  { slug: "rivers", title: "Rivers", group: "Nature", description: "Rivers and waterways of Bangladesh.", sample: { id: 1, name_en: "Padma", name_bn: "পদ্মা", length_km: 120, outflow: "Meghna" } },
  { slug: "seasons", title: "Seasons", group: "Nature", description: "The six Bangla seasons and their characteristics.", sample: { id: 1, name_en: "Summer", bangla_name: "গ্রীষ্ম", months_en: "Baishakh-Jaishtha" } },
  { slug: "animals", title: "Animals", group: "Nature", description: "Animals, birds, reptiles, fish, and insects of Bangladesh.", filters: ["category", "conservation_status"], sample: { id: 1, name_en: "Royal Bengal Tiger", category: "mammal", is_national_animal: true } },
  { slug: "flowers", title: "Flowers", group: "Nature", description: "Flowers and flowering plants associated with Bangladesh.", sample: { id: 1, name_en: "Water Lily", is_national_flower: true } },
  { slug: "trees", title: "Trees", group: "Nature", description: "Trees and plants important to Bangladesh.", sample: { id: 1, name_en: "Mango Tree", is_national_tree: true } },
  { slug: "festivals", title: "Festivals", group: "Culture", description: "Religious, cultural, and national festivals.", sample: { id: 1, name_en: "Pohela Boishakh", type: "cultural" } },
  { slug: "traditional-foods", title: "Traditional Foods", group: "Culture", description: "Traditional foods, sweets, snacks, and drinks.", sample: { id: 1, name_en: "Panta Bhat", category: "rice" } },
  { slug: "traditional-clothing", title: "Traditional Clothing", group: "Culture", description: "Traditional garments and textile items.", sample: { id: 1, name_en: "Saree", gender: "female" } },
  { slug: "traditional-music", title: "Traditional Music", group: "Culture", description: "Folk, Baul, Rabindra, Nazrul, and classical music categories.", sample: { id: 1, name_en: "Baul", type: "baul" } },
  { slug: "traditional-crafts", title: "Traditional Crafts", group: "Culture", description: "Craft traditions and regional materials.", sample: { id: 1, name_en: "Jamdani Weaving", region: "Dhaka and Narayanganj" } },
  { slug: "historical-periods", title: "Historical Periods", group: "History", description: "Major historical eras in Bengal and Bangladesh.", sample: { id: 7, name_en: "Independent Bangladesh", era: "modern" } },
  { slug: "historical-events", title: "Historical Events", group: "History", description: "Major historical events from ancient Bengal to modern Bangladesh.", filters: ["year", "category", "period_id"], sample: { id: 10, name_en: "Bangladesh Liberation War", year: 1971, category: "war" } },
  { slug: "historical-places", title: "Historical Places", group: "History", description: "Important monuments, archaeological sites, and heritage places.", sample: { id: 4, name_en: "Lalbagh Fort", type: "fort" } },
  { slug: "political-leaders", title: "Political Leaders", group: "Politics", description: "Political leaders from Bengal's historical phases to modern Bangladesh.", filters: ["role", "party_id", "era"], sample: { id: 18, name_en: "Sheikh Hasina", role: "prime_minister", era: "post-independence" } },
  { slug: "political-parties", title: "Political Parties", group: "Politics", description: "Major political parties and organizations.", sample: { id: 1, name_en: "Bangladesh Awami League", is_active: true } },
  { slug: "authors", title: "Authors", group: "Literature", description: "Bangladeshi and Bengali literary figures.", filters: ["genre", "era"], sample: { id: 8, name_en: "Kazi Nazrul Islam", genres: ["poetry"], era: "modern" } },
  { slug: "books", title: "All Books", group: "Literature", description: "Returns all books by default. Use the separate book endpoints when you want author or category filtering.", sample: { id: 8, title_en: "Bidrohi", title_bn: "Bidrohi", author_id: 8, genre: "poetry", language: "bengali" }, primaryOnly: true },
  { slug: "sports-categories", title: "Sports Categories", group: "Sports", description: "Sports represented in Bangladesh data.", sample: { id: 1, name_en: "Cricket", type: "team" } },
  { slug: "players", title: "Players", group: "Sports", description: "Major players from cricket, football, kabaddi, archery, and chess.", filters: ["sport", "is_legend"], sample: { id: 1, name_en: "Shakib Al Hasan", sport_id: 1, is_legend: true } },
  { slug: "national-teams", title: "National Teams", group: "Sports", description: "Bangladesh national teams by sport.", sample: { id: 1, name_en: "Bangladesh Men's Cricket Team", sport_id: 1 } },
  { slug: "scientists", title: "Scientists", group: "Notable People", description: "Scientists, engineers, and researchers connected to Bangladesh.", sample: { id: 2, name_en: "Satyendra Nath Bose", field: "Physics" } },
  { slug: "artists", title: "Artists", group: "Notable People", description: "Artists and filmmakers connected to Bangladesh.", sample: { id: 1, name_en: "Zainul Abedin", medium: "painting" } },
  { slug: "freedom-fighters", title: "Freedom Fighters", group: "Notable People", description: "Freedom fighters and Liberation War figures.", sample: { id: 1, name_en: "M. A. G. Osmani", role: "Commander-in-Chief" } },
];

const filterDescriptions: Record<string, string> = {
  author_id: "Filter by author id.",
  category: "Book category such as poetry, novel, essay, or history.",
  century: "Filter by century such as 20th.",
  conservation_status: "Filter by conservation status.",
  era: "Filter by historical or literary era.",
  genre: "Filter by genre.",
  is_legend: "Use true or false.",
  language: "Filter by bengali, english, or both.",
  party_id: "Filter by political party id.",
  period_id: "Filter by historical period id.",
  role: "Filter by role.",
  sport: "Filter by sport id or sport name.",
  year: "Filter by event year.",
  q: "Search by book title or Bengali title.",
};

const filterExamples: Record<string, string> = {
  author_id: "8",
  category: "mammal",
  century: "20th",
  conservation_status: "endangered",
  era: "modern",
  genre: "poetry",
  is_legend: "true",
  language: "bengali",
  party_id: "1",
  period_id: "7",
  role: "prime_minister",
  sport: "cricket",
  year: "1971",
  q: "Bidrohi",
};

const bookEndpoints: EndpointDefinition[] = [
  {
    slug: "books-by-author",
    group: "Literature",
    title: "Books by Author",
    method: "GET",
    path: "/books/by-author",
    summary: "List books for one author.",
    description: "Returns books by author_id. Use /api/v1/authors first if you need to find an author's id.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "author_id", label: "Author ID", type: "integer", location: "query", required: true, description: "Author id.", example: "8" },
      { name: "page", label: "Page", type: "integer", location: "query", required: false, description: "Page number. Defaults to 1.", example: "1" },
      { name: "limit", label: "Limit", type: "integer", location: "query", required: false, description: "Records per page. Defaults to 20 and maxes at 100.", example: "20" },
    ],
    sampleResponse: [{ id: 8, title_en: "Bidrohi", author_id: 8, genre: "poetry", language: "bengali" }],
    recipes: ["Show all works for a selected author"],
  },
  {
    slug: "books-by-category",
    group: "Literature",
    title: "Books by Category",
    method: "GET",
    path: "/books/by-category",
    summary: "List books in one category.",
    description: "Returns books by category. Category maps to the book genre field, for example poetry, novel, essay, history, children, or science.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "category", label: "Category", type: "string", location: "query", required: true, description: "Book category or genre.", example: "poetry" },
      { name: "page", label: "Page", type: "integer", location: "query", required: false, description: "Page number. Defaults to 1.", example: "1" },
      { name: "limit", label: "Limit", type: "integer", location: "query", required: false, description: "Records per page. Defaults to 20 and maxes at 100.", example: "20" },
    ],
    sampleResponse: [{ id: 8, title_en: "Bidrohi", author_id: 8, genre: "poetry", language: "bengali" }],
    recipes: ["Browse poetry, novels, essays, history books, and children's books"],
  },
  {
    slug: "author-books",
    group: "Literature",
    title: "Author Books",
    method: "GET",
    path: "/authors/{id}/books",
    summary: "List books for one author id.",
    description: "A clean author-specific route for fetching books after selecting an author.",
    cacheTtl: "24 hours",
    parameters: [
      { name: "id", label: "Author ID", type: "integer", location: "path", required: true, description: "Author id.", example: "8" },
      { name: "page", label: "Page", type: "integer", location: "query", required: false, description: "Page number. Defaults to 1.", example: "1" },
      { name: "limit", label: "Limit", type: "integer", location: "query", required: false, description: "Records per page. Defaults to 20 and maxes at 100.", example: "20" },
    ],
    sampleResponse: [{ id: 8, title_en: "Bidrohi", author_id: 8, genre: "poetry", language: "bengali" }],
    recipes: ["Build an author profile page with that author's books"],
  },
];

function filterParam(name: string) {
  return {
    name,
    label: name.replaceAll("_", " "),
    type: name === "year" || name.endsWith("_id") ? "integer" as const : "string" as const,
    location: "query" as const,
    required: false,
    description: filterDescriptions[name] ?? `Filter by ${name}.`,
    example: filterExamples[name] ?? "",
  };
}

export const encyclopediaEndpointDefinitions: EndpointDefinition[] = categories.flatMap((category) => {
  const listParams = [
    { name: "page", label: "Page", type: "integer" as const, location: "query" as const, required: false, description: "Page number. Defaults to 1.", example: "1" },
    { name: "limit", label: "Limit", type: "integer" as const, location: "query" as const, required: false, description: "Records per page. Defaults to 20 and maxes at 100.", example: "20" },
    ...(category.filters ?? []).map(filterParam),
  ];

  const primaryEndpoint: EndpointDefinition = {
    slug: category.slug,
    group: category.group,
    title: category.title,
    method: "GET",
    path: `/${category.slug}`,
    summary: category.slug === "books" ? "List all books." : `List ${category.title.toLowerCase()}.`,
    description: category.description,
    cacheTtl: "24 hours",
    parameters: listParams,
    sampleResponse: [category.sample],
    recipes: category.slug === "books"
      ? ["Load all books by default", "Use Books by Author or Books by Category for focused filtering"]
      : [`Browse ${category.title.toLowerCase()}`, `Search by name with /${category.slug}/search?q=`],
  };

  if (category.primaryOnly) {
    return [primaryEndpoint];
  }

  return [
    primaryEndpoint,
    {
      slug: `${category.slug}-detail`,
      group: category.group,
      title: `${category.title} Detail`,
      method: "GET",
      path: `/${category.slug}/{id}`,
      summary: `Get one ${category.title.toLowerCase()} record.`,
      description: `Returns the full ${category.title.toLowerCase()} record with all available Phase 1 fields.`,
      cacheTtl: "24 hours",
      parameters: [
        { name: "id", label: "ID", type: "integer", location: "path", required: true, description: "Record id.", example: String(category.sample.id) },
      ],
      sampleResponse: category.sample,
      recipes: [`Show a ${category.title.toLowerCase()} detail page`],
    },
    {
      slug: `${category.slug}-search`,
      group: category.group,
      title: `${category.title} Search`,
      method: "GET",
      path: `/${category.slug}/search`,
      summary: `Search ${category.title.toLowerCase()}.`,
      description: `Searches ${category.title.toLowerCase()} by name_en and name_bn.`,
      cacheTtl: "24 hours",
      parameters: [
        { name: "q", label: "Search query", type: "string", location: "query", required: true, description: "Search text.", example: String(category.sample.name_en ?? category.sample.title_en ?? "Bangladesh") },
        { name: "page", label: "Page", type: "integer", location: "query", required: false, description: "Page number. Defaults to 1.", example: "1" },
        { name: "limit", label: "Limit", type: "integer", location: "query", required: false, description: "Records per page. Defaults to 20 and maxes at 100.", example: "20" },
      ],
      sampleResponse: [category.sample],
      recipes: [`Autocomplete ${category.title.toLowerCase()} by English or Bengali name`],
    },
  ];
});

encyclopediaEndpointDefinitions.push(...bookEndpoints);

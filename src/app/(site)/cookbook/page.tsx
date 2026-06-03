import Link from "next/link";
import { endpointDefinitions, codeSamples } from "@/lib/developer-content";

const recipes = [
  {
    title: "Build cascading division, district, upazila selects",
    endpoint: "districts",
    steps: ["Load /divisions once", "Call /districts?division_id=6 after division selection", "Call /upazilas?district_id=47 after district selection", "Call /unions?upazila_id=302 when union data is needed"],
  },
  {
    title: "Show today prayer times for a selected district",
    endpoint: "prayer-times",
    steps: ["Ask the user for district_id", "Call /prayer-times?district_id=47", "Cache the result in your UI for the day", "Render the Asia/Dhaka times as returned"],
  },
  {
    title: "Detect a mobile operator during signup",
    endpoint: "mobile-operator",
    steps: ["Normalize user phone input", "Call /mobile/operator?number=01712345678", "Display the operator name beside the phone field", "Reject invalid numbers with the API error message"],
  },
  {
    title: "Check whether a date is a public holiday",
    endpoint: "holiday-date",
    steps: ["Format the date as YYYY-MM-DD", "Call /holidays/{date}", "Use is_holiday to disable bookings or show holiday details"],
  },
  {
    title: "Normalize Bengali numerals before form submit",
    endpoint: "bn-to-english",
    steps: ["Pass localized input to /bn/to-english", "Store the converted field in your database", "Keep the original text if your app needs audit history"],
  },
  {
    title: "Build one search box for Bangladesh facts",
    endpoint: "search",
    steps: ["Send the user's text to /search?q=", "Show the category label with every result", "Open the matching /docs/{category} endpoint when users need full records"],
  },
  {
    title: "Show books and author pages",
    endpoint: "books-search",
    steps: ["Use /books for the default list", "Use /books/search?q= when the user types a title", "Use /authors/{id}/books after the user opens an author"],
  },
  {
    title: "Build district heritage pages",
    endpoint: "historical-places-by-district",
    steps: ["Start with a district id or English district name", "Call /historical-places/by-district", "Render monuments, archaeological places, and source links"],
  },
  {
    title: "Find regional foods",
    endpoint: "foods-by-region",
    steps: ["Pass the region or district name", "Group results by category such as sweet, snack, rice, or curry", "Use source_url when a user wants attribution"],
  },
  {
    title: "Import BDApi4All into Postman or Insomnia",
    endpoint: "divisions",
    steps: ["Download /collections/postman.json or /collections/insomnia.json", "Import into your API client", "Run requests against the production base URL"],
  },
];

const frameworkExamples = [
  {
    title: "React",
    code: `import { useEffect, useState } from "react";

export function DistrictSelect() {
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetch("https://bdapi4all.vercel.app/api/v1/districts?division_id=6")
      .then((res) => res.json())
      .then((payload) => setDistricts(payload.data));
  }, []);

  return (
    <select>
      {districts.map((district) => (
        <option key={district.id} value={district.id}>
          {district.name_en}
        </option>
      ))}
    </select>
  );
}`,
  },
  {
    title: "Next.js",
    code: `export default async function Page() {
  const res = await fetch("https://bdapi4all.vercel.app/api/v1/search?q=Padma", {
    next: { revalidate: 86400 },
  });
  const payload = await res.json();

  return <pre>{JSON.stringify(payload.data, null, 2)}</pre>;
}`,
  },
  {
    title: "Laravel",
    code: `use Illuminate\\Support\\Facades\\Http;

$response = Http::get('https://bdapi4all.vercel.app/api/v1/people/search', [
    'q' => 'Shakib',
    'limit' => 5,
]);

$people = $response->json('data');`,
  },
  {
    title: "Flutter",
    code: `import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> loadBooks() async {
  final uri = Uri.parse('https://bdapi4all.vercel.app/api/v1/books?limit=20');
  final response = await http.get(uri);
  final payload = jsonDecode(response.body) as Map<String, dynamic>;
  return payload['data'] as List<dynamic>;
}`,
  },
];

export default function CookbookPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-3xl">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">API Cookbook</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Practical implementation patterns for Bangladesh-focused apps.
        </p>
      </div>

      <div className="space-y-6">
        {recipes.map((recipe) => {
          const endpoint = endpointDefinitions.find((item) => item.slug === recipe.endpoint) ?? endpointDefinitions[0];
          const samples = codeSamples(endpoint);
          return (
            <section key={recipe.title} className="rounded-lg border border-border/50 bg-card">
              <div className="border-b border-border/50 p-5">
                <h2 className="font-heading text-2xl font-bold">{recipe.title}</h2>
                <Link href={`/docs/${endpoint.slug}`} className="mt-2 inline-block font-mono text-sm text-primary">
                  GET {endpoint.path}
                </Link>
              </div>
              <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
                <ol className="space-y-3 p-5 text-sm text-muted-foreground">
                  {recipe.steps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <pre className="overflow-auto bg-[#0d1117] p-5 text-sm text-green-300">
                  <code>{samples.javascript}</code>
                </pre>
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-10">
        <div className="mb-5">
          <h2 className="font-heading text-3xl font-bold tracking-tight">Framework Examples</h2>
          <p className="mt-2 text-muted-foreground">Copy-ready patterns for common frontend and backend stacks.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {frameworkExamples.map((example) => (
            <article key={example.title} className="overflow-hidden rounded-lg border border-border/50 bg-card">
              <div className="border-b border-border/50 px-4 py-3 font-semibold">{example.title}</div>
              <pre className="overflow-auto bg-[#0d1117] p-4 text-sm text-green-300">
                <code>{example.code}</code>
              </pre>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

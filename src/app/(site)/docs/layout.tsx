import { DocsNavigation } from "@/components/developer/docs-navigation"

const navGroups = [
  {
    title: "Getting Started",
    links: [
      { title: "Introduction", href: "/docs" },
      { title: "API Explorer", href: "/playground" },
      { title: "Data Browser", href: "/data" },
      { title: "Cookbook", href: "/cookbook" },
      { title: "Authentication", href: "/docs/authentication" },
      { title: "Errors", href: "/docs/errors" },
      { title: "Rate Limits", href: "/limits" },
      { title: "Collections", href: "/collections" },
      { title: "Sources", href: "/sources" },
    ],
  },
  {
    title: "Geo & Location",
    links: [
      { title: "Divisions", href: "/docs/divisions" },
      { title: "Districts", href: "/docs/districts" },
      { title: "Upazilas", href: "/docs/upazilas" },
      { title: "Unions", href: "/docs/unions" },
      { title: "Postcodes", href: "/docs/postcodes" },
      { title: "Geocode", href: "/docs/geocode" },
    ],
  },
  {
    title: "Discovery",
    links: [
      { title: "Global Search", href: "/docs/search" },
      { title: "People Search", href: "/docs/people-search" },
      { title: "Places by District", href: "/docs/historical-places-by-district" },
      { title: "Rivers by District", href: "/docs/rivers-by-district" },
      { title: "Foods by Region", href: "/docs/foods-by-region" },
    ],
  },
  {
    title: "Services",
    links: [
      { title: "Prayer Times", href: "/docs/prayer-times" },
      { title: "Holidays", href: "/docs/holidays" },
      { title: "Exchange Rates", href: "/docs/exchange-rates" },
      { title: "Mobile Operators", href: "/docs/mobile" },
      { title: "Exchange History", href: "/docs/exchange-rate-history" },
    ],
  },
  {
    title: "Validators & Utils",
    links: [
      { title: "Validators", href: "/docs/validators" },
      { title: "Bangla Utils", href: "/docs/bn-utils" },
      { title: "Developer Tools", href: "/tools" },
    ],
  },
  {
    title: "Nature",
    links: [
      { title: "Rivers", href: "/docs/rivers" },
      { title: "Canals", href: "/docs/canals" },
      { title: "Haors", href: "/docs/haors" },
      { title: "Forests", href: "/docs/forests" },
      { title: "Islands", href: "/docs/islands" },
      { title: "Seasons", href: "/docs/seasons" },
      { title: "Animals", href: "/docs/animals" },
      { title: "Flowers", href: "/docs/flowers" },
      { title: "Trees", href: "/docs/trees" },
    ],
  },
  {
    title: "Culture",
    links: [
      { title: "Festivals", href: "/docs/festivals" },
      { title: "Traditional Foods", href: "/docs/traditional-foods" },
      { title: "Spices & Masala", href: "/docs/spices" },
      { title: "Traditional Clothing", href: "/docs/traditional-clothing" },
      { title: "Traditional Music", href: "/docs/traditional-music" },
      { title: "Traditional Crafts", href: "/docs/traditional-crafts" },
    ],
  },
  {
    title: "History",
    links: [
      { title: "Historical Periods", href: "/docs/historical-periods" },
      { title: "Historical Events", href: "/docs/historical-events" },
      { title: "Historical Places", href: "/docs/historical-places" },
    ],
  },
  {
    title: "Politics",
    links: [
      { title: "Political Leaders", href: "/docs/political-leaders" },
      { title: "Political Parties", href: "/docs/political-parties" },
    ],
  },
  {
    title: "Literature",
    links: [
      { title: "Authors", href: "/docs/authors" },
      { title: "All Books", href: "/docs/books" },
      { title: "Book Search", href: "/docs/books-search" },
      { title: "Books by Author", href: "/docs/books-by-author" },
      { title: "Books by Category", href: "/docs/books-by-category" },
      { title: "Author Books", href: "/docs/author-books" },
    ],
  },
  {
    title: "Sports",
    links: [
      { title: "Sports Categories", href: "/docs/sports-categories" },
      { title: "Players", href: "/docs/players" },
      { title: "National Teams", href: "/docs/national-teams" },
    ],
  },
  {
    title: "Notable People",
    links: [
      { title: "Scientists", href: "/docs/scientists" },
      { title: "Artists", href: "/docs/artists" },
      { title: "Freedom Fighters", href: "/docs/freedom-fighters" },
    ],
  },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <DocsNavigation groups={navGroups} />
      <div className="relative min-w-0 py-6 lg:gap-10 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}

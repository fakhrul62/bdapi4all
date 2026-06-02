import Link from "next/link"

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
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block overflow-y-auto py-6 pr-6">
        <div className="w-full">
          {navGroups.map((group, index) => (
            <div key={index} className="pb-4">
              <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold font-heading">
                {group.title}
              </h4>
              <div className="grid grid-flow-row auto-rows-max text-sm">
                {group.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
      <main className="relative py-6 lg:gap-10 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  )
}

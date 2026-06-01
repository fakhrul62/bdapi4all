import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-heading font-bold text-primary text-xl inline-block">
              BDApi4All
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/docs"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Docs
            </Link>
            <Link
              href="/playground"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Playground
            </Link>
            <Link
              href="/status"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Status
            </Link>
            <Link
              href="/changelog"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Changelog
            </Link>
          </nav>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="https://github.com/fakhrul62/bdapi4all" target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" className="hidden md:flex font-medium">
                Star on GitHub
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

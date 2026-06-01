import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built for the developers of Bangladesh. Open source and free forever.
        </p>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          <Link
            href="https://github.com/fakhrul62/bdapi4all"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            GitHub
          </Link>
          {" "}•{" "}
          <Link
            href="/docs"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Docs
          </Link>
        </p>
      </div>
    </footer>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-16 px-4">
      <div className="text-center max-w-3xl space-y-8">
        <h1 className="font-heading text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          The Comprehensive REST API for <span className="text-primary">Bangladesh</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Free, open-source, and lightning fast. Get data for districts, prayer times, holidays, exchange rates, and more with zero authentication required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/docs">
            <Button size="lg" className="w-full sm:w-auto font-medium text-primary-foreground">
              Read the Docs
            </Button>
          </Link>
          <Link href="/playground">
            <Button variant="outline" size="lg" className="w-full sm:w-auto font-medium">
              Try the API
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Quick stats or features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full text-center">
        <div className="space-y-2 p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
          <h3 className="text-4xl font-bold font-heading text-primary">20+</h3>
          <p className="text-muted-foreground font-medium">API Endpoints</p>
        </div>
        <div className="space-y-2 p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
          <h3 className="text-4xl font-bold font-heading text-primary">100%</h3>
          <p className="text-muted-foreground font-medium">Free & Open Source</p>
        </div>
        <div className="space-y-2 p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
          <h3 className="text-4xl font-bold font-heading text-primary">Zero</h3>
          <p className="text-muted-foreground font-medium">Auth Required</p>
        </div>
      </div>
      
      <div className="mt-24 max-w-4xl w-full">
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-muted/50 px-4 py-2 border-b border-border/50 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-xs text-muted-foreground ml-2 font-mono">GET /api/v1/divisions</span>
          </div>
          <div className="p-4 overflow-x-auto bg-[#0d1117]">
            <pre className="text-sm font-mono text-gray-300">
              <code>{`{
  "success": true,
  "version": "v1",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": [
    {
      "id": 1,
      "name_en": "Dhaka",
      "name_bn": "ঢাকা"
    },
    ...
  ]
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

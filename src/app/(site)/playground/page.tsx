"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function PlaygroundPage() {
  const [endpoint, setEndpoint] = useState("/api/v1/divisions")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<number | null>(null)
  const [time, setTime] = useState<number | null>(null)

  const handleSend = async () => {
    setLoading(true)
    setStatus(null)
    setTime(null)
    setResponse("")
    
    // Simulate network delay for the playground (500ms)
    const start = Date.now()
    
    try {
      const res = await fetch(endpoint)
      const data = await res.json()
      
      // Artificial delay
      await new Promise(r => setTimeout(r, 500))
      
      setStatus(res.status)
      setTime(Date.now() - start + 500)
      setResponse(JSON.stringify(data, null, 2))
    } catch (err: unknown) {
      setStatus(500)
      setTime(Date.now() - start)
      setResponse(
        JSON.stringify(
          { error: err instanceof Error ? err.message : "Request failed" },
          null,
          2,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-4 mb-8">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">API Playground</h1>
        <p className="text-lg text-muted-foreground">
          Test the BDApi4All endpoints directly from your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Endpoint URL
            </label>
            <div className="flex gap-2">
              <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background flex-1 overflow-hidden">
                <span className="text-muted-foreground mr-1 select-none flex items-center">GET</span>
                <input
                  type="text"
                  className="flex-1 bg-transparent outline-none border-none text-foreground w-full font-mono"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                />
              </div>
              <Button onClick={handleSend} disabled={loading} className="w-24 font-medium">
                {loading ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Quick Select
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["/api/v1/divisions", "/api/v1/districts", "/api/v1/prayer-times?district_id=1", "/api/v1/holidays", "/api/v1/exchange-rates"].map((url) => (
                <button
                  key={url}
                  onClick={() => setEndpoint(url)}
                  className="text-xs font-mono bg-muted/50 hover:bg-muted border border-border/50 rounded p-2 text-left truncate transition-colors"
                  title={url}
                >
                  {url.split("?")[0].replace("/api/v1/", "")}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col h-[500px] border border-border/50 rounded-xl overflow-hidden shadow-sm bg-card">
          <div className="bg-muted/50 px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <div className="font-semibold text-sm">Response</div>
            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
              {status !== null && (
                <div className="flex items-center gap-1">
                  <span className={status === 200 ? "text-green-500" : "text-red-500"}>
                    {status}
                  </span>
                  <span>{status === 200 ? "OK" : "Error"}</span>
                </div>
              )}
              {time !== null && (
                <div>{time} ms</div>
              )}
            </div>
          </div>
          <div className="p-4 overflow-auto flex-1 bg-[#0d1117]">
            {response ? (
              <pre className="text-sm font-mono text-green-300">
                <code>{response}</code>
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
                Click &quot;Send&quot; to execute request
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

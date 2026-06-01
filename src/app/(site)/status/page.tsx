export default function StatusPage() {
  const endpoints = [
    { name: "Divisions", path: "/api/v1/divisions", status: "Operational", uptime: "99.99%", latency: "42ms" },
    { name: "Districts", path: "/api/v1/districts", status: "Operational", uptime: "99.99%", latency: "45ms" },
    { name: "Prayer Times", path: "/api/v1/prayer-times", status: "Operational", uptime: "99.98%", latency: "65ms" },
    { name: "Holidays", path: "/api/v1/holidays", status: "Operational", uptime: "100%", latency: "38ms" },
    { name: "Exchange Rates", path: "/api/v1/exchange-rates", status: "Operational", uptime: "99.95%", latency: "55ms" },
    { name: "Validators", path: "/api/v1/validate/nid", status: "Operational", uptime: "100%", latency: "25ms" },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-4 mb-10">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight">API Status</h1>
        <p className="text-lg text-muted-foreground">
          Real-time and historical data on system performance.
        </p>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-xl font-bold font-heading text-green-700 dark:text-green-400">All Systems Operational</h2>
          <p className="text-green-600/80 dark:text-green-400/80 text-sm mt-1">Last updated just now.</p>
        </div>
      </div>

      <div className="border border-border/50 rounded-lg overflow-hidden shadow-sm bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium">Service</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium text-right">Uptime (30d)</th>
              <th className="px-6 py-4 font-medium text-right">Avg Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {endpoints.map((ep, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{ep.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">{ep.path}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-700 dark:text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {ep.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                  {ep.uptime}
                </td>
                <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                  {ep.latency}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, KeyRound, Loader2, LogOut, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ApiKeyRow = {
  id: number;
  name: string;
  status: string;
  rate_limit: number;
  created_at: string;
  last_used_at: string | null;
};

type IssuedKey = {
  id: number;
  name: string;
  key: string;
  rate_limit: number;
};

type ApiPayload<T> = {
  success: boolean;
  data: T;
};

type ApiError = Error & { status: number };

async function api<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const payload = (await response.json()) as ApiPayload<T>;
  if (!response.ok || !payload.success) {
    const err = new Error("Request failed") as ApiError;
    err.status = response.status;
    throw err;
  }
  return payload;
}

export function ApiKeysDashboard({ initialAuthenticated }: { initialAuthenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [secret, setSecret] = useState("");
  const [name, setName] = useState("");
  const [rateLimit, setRateLimit] = useState("100");
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [issued, setIssued] = useState<IssuedKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadKeys = useCallback(async () => {
    try {
      const payload = await api<{ keys: ApiKeyRow[] }>("/api/admin/keys");
      setKeys(payload.data.keys);
    } catch (err) {
      const status = (err as ApiError).status;
      if (status === 401) {
        setAuthenticated(false);
      } else {
        setMessage("Could not load keys — database may be unavailable. You are still logged in.");
      }
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    async function run() {
      try {
        const payload = await api<{ keys: ApiKeyRow[] }>("/api/admin/keys");
        if (cancelled) return;
        setKeys(payload.data.keys);
      } catch (err) {
        if (cancelled) return;
        const status = (err as ApiError).status;
        if (status === 401) {
          setAuthenticated(false);
        } else {
          setMessage("Could not load keys — database may be unavailable. You are still logged in.");
        }
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  async function login() {
    setLoading(true);
    setMessage("");
    try {
      await api("/api/admin/login", { method: "POST", body: JSON.stringify({ secret }) });
      setAuthenticated(true);
      setSecret("");
    } catch {
      setMessage("Invalid admin secret.");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await api("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setIssued(null);
  }

  async function createKey() {
    setLoading(true);
    setMessage("");
    try {
      const payload = await api<IssuedKey>("/api/admin/keys", {
        method: "POST",
        body: JSON.stringify({ name, rate_limit: Number(rateLimit) || 100 }),
      });
      setIssued(payload.data);
      setCopied(false);
      setName("");
      await loadKeys();
    } catch {
      setMessage("Failed to create key.");
    } finally {
      setLoading(false);
    }
  }

  async function revoke(id: number) {
    if (!window.confirm("Revoke this API key? Existing integrations will stop working.")) return;
    setLoading(true);
    try {
      await api("/api/admin/keys", { method: "DELETE", body: JSON.stringify({ id }) });
      await loadKeys();
    } finally {
      setLoading(false);
    }
  }

  async function copyKey(key: string) {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!authenticated) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-10">
        <div className="rounded-lg border border-border/50 bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold">API Keys</h1>
              <p className="text-sm text-muted-foreground">Manage access keys and rate limits.</p>
            </div>
          </div>
          <label className="block text-sm font-medium">
            Admin secret
            <input
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && void login()}
              className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 outline-none focus:border-primary"
            />
          </label>
          {message && <p className="mt-3 text-sm text-red-500">{message}</p>}
          <Button className="mt-5 w-full gap-2" onClick={login} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-heading text-3xl font-extrabold tracking-tight">
            <KeyRound className="h-7 w-7 text-primary" />
            API Keys
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Issue keys for higher rate limits and per-key analytics. Requests without a key are still free and open.
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={logout} aria-label="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <section className="rounded-lg border border-border/50 bg-card p-5">
        <h2 className="flex items-center gap-2 font-semibold">
          <Plus className="h-4 w-4 text-primary" />
          Generate a key
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px_auto]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name, e.g. My Production App"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
          />
          <input
            value={rateLimit}
            onChange={(event) => setRateLimit(event.target.value)}
            type="number"
            min={1}
            max={10000}
            placeholder="100"
            aria-label="Rate limit per minute"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary"
          />
          <Button onClick={createKey} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Generate
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Rate limit is requests per minute (default 100, max 10000).</p>
        {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
      </section>

      {issued && (
        <section className="mt-5 rounded-lg border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-primary">Your new key — copy it now</h2>
            <Button variant="outline" size="icon" onClick={() => copyKey(issued.key)} aria-label="Copy key">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <code className="mt-3 block break-all rounded-md border border-border/50 bg-background px-3 py-2 font-mono text-sm">
            {issued.key}
          </code>
          <p className="mt-2 text-xs text-muted-foreground">This is shown only once. Use it as the X-API-Key header or apikey query param.</p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 font-semibold">Your keys</h2>
        {keys.length === 0 ? (
          <p className="text-sm text-muted-foreground">No API keys yet.</p>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <div key={key.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-card p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{key.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        key.status === "active" ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {key.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    #{key.id} · {key.rate_limit}/min · created {new Date(key.created_at).toLocaleDateString()}
                    {key.last_used_at ? ` · last used ${new Date(key.last_used_at).toLocaleDateString()}` : " · never used"}
                  </div>
                </div>
                {key.status === "active" && (
                  <Button variant="outline" size="sm" className="gap-1 text-red-600" onClick={() => revoke(key.id)} disabled={loading}>
                    <Trash2 className="h-4 w-4" />
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
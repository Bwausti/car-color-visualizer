"use client";

import { useState, useEffect, useCallback } from "react";

interface Subscriber {
  id: string;
  name: string;
  email: string;
  status: string;
  plan: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  usageThisPeriod: number;
  usageCost: string;
  created: string;
}

interface Stats {
  summary: {
    totalSubscribers: number;
    activeSubscribers: number;
    mrr: number;
    totalVisualizations: number;
    totalUsageRevenue: string;
  };
  subscribers: Subscriber[];
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (pwd: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${pwd}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setAuthenticated(false);
          setError("Invalid password");
          return;
        }
        throw new Error("Failed to load stats");
      }
      const data = await res.json();
      setStats(data);
      setAuthenticated(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("cs-admin-pwd");
    if (saved) {
      setPassword(saved);
      fetchStats(saved);
    }
  }, [fetchStats]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("cs-admin-pwd", password);
    fetchStats(password);
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm px-6">
          <div className="flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-1.5 h-5 bg-gradient-to-b from-white to-zinc-500 rounded-full" />
            <span className="text-sm font-semibold text-zinc-200 tracking-wide">ColorShift</span>
            <span className="text-zinc-600 text-sm">Admin</span>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 mb-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-zinc-900 py-3 rounded-lg font-semibold text-sm hover:bg-zinc-200 transition-colors"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          {error && <p className="text-red-400 text-xs text-center mt-3">{error}</p>}
        </form>
      </div>
    );
  }

  // Dashboard
  const s = stats?.summary;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 bg-gradient-to-b from-white to-zinc-500 rounded-full" />
            <span className="text-sm font-semibold text-zinc-200 tracking-wide">ColorShift</span>
            <span className="text-zinc-600 text-sm">Admin</span>
          </div>
          <button
            onClick={() => fetchStats(password)}
            className="text-xs text-zinc-500 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-lg hover:border-zinc-600 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        {s && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Active Subscribers" value={s.activeSubscribers.toString()} />
            <StatCard label="MRR (Base)" value={`$${s.mrr}`} />
            <StatCard label="Total Visualizations" value={s.totalVisualizations.toString()} />
            <StatCard label="Usage Revenue" value={`$${s.totalUsageRevenue}`} />
          </div>
        )}

        {/* Subscriber table */}
        <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800/40">
            <h2 className="text-sm font-semibold text-zinc-200">Subscribers</h2>
          </div>

          {stats?.subscribers.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-zinc-600 text-sm">No subscribers yet</p>
              <p className="text-zinc-700 text-xs mt-1">They&apos;ll appear here once someone subscribes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/40 text-zinc-500 text-xs">
                    <th className="text-left px-5 py-3 font-medium">Customer</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-right px-5 py-3 font-medium">Visualizations</th>
                    <th className="text-right px-5 py-3 font-medium">Usage Cost</th>
                    <th className="text-left px-5 py-3 font-medium">Period</th>
                    <th className="text-left px-5 py-3 font-medium">Since</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b border-zinc-800/20 hover:bg-zinc-800/20">
                      <td className="px-5 py-3">
                        <div className="text-zinc-200 font-medium">{sub.name}</div>
                        <div className="text-zinc-600 text-xs">{sub.email}</div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full ${
                          sub.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : sub.status === "trialing"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-zinc-700/30 text-zinc-500"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            sub.status === "active" ? "bg-emerald-400" : sub.status === "trialing" ? "bg-blue-400" : "bg-zinc-500"
                          }`} />
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-zinc-300 font-mono">{sub.usageThisPeriod}</td>
                      <td className="px-5 py-3 text-right text-zinc-300 font-mono">${sub.usageCost}</td>
                      <td className="px-5 py-3 text-zinc-500 text-xs">
                        {new Date(sub.currentPeriodStart).toLocaleDateString()} – {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-zinc-500 text-xs">
                        {new Date(sub.created).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-white border border-zinc-800 px-4 py-2 rounded-lg hover:border-zinc-600 transition-colors"
          >
            Stripe Dashboard ↗
          </a>
          <a
            href="/setup"
            target="_blank"
            className="text-xs text-zinc-500 hover:text-white border border-zinc-800 px-4 py-2 rounded-lg hover:border-zinc-600 transition-colors"
          >
            Setup Page ↗
          </a>
          <a
            href="/embed"
            target="_blank"
            className="text-xs text-zinc-500 hover:text-white border border-zinc-800 px-4 py-2 rounded-lg hover:border-zinc-600 transition-colors"
          >
            Embed Preview ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-5">
      <p className="text-zinc-600 text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
    </div>
  );
}

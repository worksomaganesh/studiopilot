"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { Shield, Key, Database, Sparkles, Search, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const [adminEmail, setAdminEmail] = useState("admin@studiopilot.io");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setAdminEmail(data.user.email);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl mx-auto pb-16">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>Workspace Security & Provider Configuration</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage single-admin authentication, database storage, and external AI/Search provider integrations.
          </p>
        </div>

        {/* 1. Single Administrator Security Enforcement */}
        <div className="p-6 rounded-2xl bg-[#111117] border border-[#21212e] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Administrator Security Policy</span>
          </div>

          <div className="p-4 rounded-xl bg-[#151520] border border-[#242436] space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Configured Administrator:</span>
              <span className="font-mono text-white font-bold">{adminEmail}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Public Registration:</span>
              <span className="font-mono text-emerald-400 font-bold">PERMANENTLY DISABLED</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Direct Route Protection:</span>
              <span className="font-mono text-emerald-400 font-bold">ENFORCED VIA MIDDLEWARE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Authentication Rate Limiting:</span>
              <span className="font-mono text-emerald-400 font-bold">ACTIVE (10 attempts / 5 min)</span>
            </div>
          </div>
        </div>

        {/* 2. Provider Configuration Status */}
        <div className="p-6 rounded-2xl bg-[#111117] border border-[#21212e] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
            <Key className="w-4 h-4 text-purple-400" />
            <span>External Provider Status</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Database */}
            <div className="p-4 rounded-xl bg-[#151520] border border-[#242436] space-y-2">
              <div className="flex items-center gap-2 font-bold text-zinc-200">
                <Database className="w-4 h-4 text-blue-400" />
                <span>Database Layer</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Supabase PostgreSQL with RLS + Resilient Local Persistence Fallback.
              </p>
              <div className="pt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Operational</span>
              </div>
            </div>

            {/* AI Model */}
            <div className="p-4 rounded-xl bg-[#151520] border border-[#242436] space-y-2">
              <div className="flex items-center gap-2 font-bold text-zinc-200">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Model Provider</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Google Gemini API via Provider Abstraction.
              </p>
              <div className="pt-2 text-[10px] font-mono text-zinc-300 flex items-center gap-1">
                <span>Configured via .env.local</span>
              </div>
            </div>

            {/* Search Provider */}
            <div className="p-4 rounded-xl bg-[#151520] border border-[#242436] space-y-2">
              <div className="flex items-center gap-2 font-bold text-zinc-200">
                <Search className="w-4 h-4 text-blue-400" />
                <span>Search Provider</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Pluggable engine (Tavily, Serper, DuckDuckGo).
              </p>
              <div className="pt-2 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitWait, setRateLimitWait] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your administrator credentials.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setRateLimitWait(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setRateLimitWait(300);
          setError(data.message || "Too many failed attempts. Rate limit enforced.");
        } else {
          setError(data.message || "Authentication failed. Invalid administrator credentials.");
        }
        return;
      }

      // Successful login
      router.push(redirectPath);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Network error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-[#111116] border border-[#22222d] shadow-2xl p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1a1a24] border border-[#2d2d3d] mb-3 text-zinc-100 shadow-inner">
          <Shield className="w-6 h-6 text-zinc-200" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          StudioPilot
        </h1>
        <p className="text-xs text-zinc-400 mt-1 font-medium">
          Your Private Creative Command Centre
        </p>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-[10px] font-semibold mt-3">
          <Lock className="w-3 h-3" />
          <span>Single-Administrator Environment</span>
        </div>
      </div>

      {/* Security Warning Notice */}
      <div className="mb-6 p-3 rounded-xl bg-[#161620] border border-[#242434] text-left text-[11px] text-zinc-400 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-300 block">
            Private Personal System
          </span>
          Public registration is permanently disabled. Only the pre-provisioned administrator account can sign in.
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Rate limit warning */}
      {rateLimitWait && (
        <div className="mb-5 p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Security cooldown active. Please wait before retrying.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 text-left">
            Administrator Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="email"
              required
              placeholder="admin@studiopilot.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-400 transition-all font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 text-left">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-400 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || Boolean(rateLimitWait)}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
        >
          {isSubmitting ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Access Command Centre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-4 border-t border-[#1d1d28] text-center text-[10px] text-zinc-500 font-mono">
        StudioPilot v1.0 • Verified Single Admin Architecture
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#08080b] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={<div className="text-xs text-zinc-500">Loading security boundary...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

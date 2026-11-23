"use client";

import React, { useState } from "react";
import { BrandSelector } from "./BrandSelector";
import { useBrand } from "@/brands/context";
import { Plus, LogOut, User, Sparkles, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header({
  onNewProjectClick,
}: {
  onNewProjectClick?: () => void;
}) {
  const router = useRouter();
  const { activeBrand } = useBrand();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="h-16 border-b border-[#1e1e26] bg-[#0c0c10]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Brand Switcher & Workspace Context */}
      <div className="flex items-center gap-4">
        <BrandSelector />
        <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 border-l border-[#22222d] pl-4">
          <span>Editorial:</span>
          <span className="text-zinc-300 font-medium truncate max-w-sm">
            {activeBrand.editorialPurpose}
          </span>
        </div>
      </div>

      {/* Right: Quick Action, Admin Profile, Logout */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNewProjectClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-black transition-all shadow-sm hover:brightness-110"
          style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>New Project</span>
        </button>

        <div className="h-4 w-px bg-[#262633]" />

        {/* Administrator Profile Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#14141c] border border-[#232330] text-xs">
          <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-200">
            <User className="w-3 h-3" />
          </div>
          <span className="text-zinc-300 font-medium hidden sm:inline">Admin</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Sign Out"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-[#1a1a24] transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/router";
import { usePathname } from "next/navigation";
import { useBrand } from "@/brands/context";
import {
  LayoutDashboard,
  FolderKanban,
  Compass,
  Eye,
  FileText,
  Film,
  Layers,
  HardDrive,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Research Studio", href: "/research", icon: Compass },
  { label: "Creative Intelligence", href: "/creative-intelligence", icon: Eye },
  { label: "Script Studio", href: "/scripts", icon: FileText },
  { label: "Editing Studio", href: "/editing", icon: Film },
  { label: "Brand Library", href: "/brands", icon: Layers },
  { label: "Assets", href: "/assets", icon: HardDrive },
  { label: "History", href: "/history", icon: History },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeBrand } = useBrand();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col justify-between border-r border-[#1e1e26] bg-[#0c0c10] transition-all duration-300 z-30 shrink-0 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand & Studio Title */}
      <div>
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#1e1e26]">
          {!isCollapsed ? (
            <a href="/dashboard" className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-black"
                style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
              >
                SP
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white block">
                  StudioPilot
                </span>
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase block">
                  Private Workspace
                </span>
              </div>
            </a>
          ) : (
            <div
              className="w-7 h-7 mx-auto rounded-lg flex items-center justify-center font-black text-xs text-black"
              style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
            >
              SP
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-[#1a1a24] transition-all"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Active Brand Capsule */}
        {!isCollapsed && (
          <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-[#14141c] border border-[#232330]">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">
              Active Brand Workspace
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
              />
              <span className="text-xs font-semibold text-zinc-200 truncate">
                {activeBrand.name}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="px-2 space-y-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            const Icon = item.icon;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#1f1f2c] text-white shadow-sm border-l-2"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-[#15151e]"
                }`}
                style={
                  isActive
                    ? {
                        borderLeftColor: activeBrand.editingIdentity.colorPalette.primary,
                      }
                    : undefined
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={
                    isActive
                      ? { color: activeBrand.editingIdentity.colorPalette.primary }
                      : undefined
                  }
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Admin Security Tag */}
      <div className="p-3 border-t border-[#1e1e26]">
        {!isCollapsed ? (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-[#13131a] text-zinc-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="text-zinc-300 font-medium block truncate">Single-Admin Mode</span>
              <span className="text-[10px] text-zinc-500 block truncate">Protected & Enforced</span>
            </div>
          </div>
        ) : (
          <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
        )}
      </div>
    </aside>
  );
}

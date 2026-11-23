"use client";

import React from "react";
import { AppShell } from "@/components/shell/AppShell";
import { BRAND_LIST } from "@/brands/config";
import { useBrand } from "@/brands/context";
import { Layers, Palette, Type, Sliders, CheckCircle2, Tv } from "lucide-react";

export default function BrandLibraryPage() {
  const { setBrandId, activeBrand } = useBrand();

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-zinc-400" />
            <span>Brand Library & Editorial Standards</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Architectural reference for StudioPilot&apos;s three independent media brands.
          </p>
        </div>

        <div className="space-y-8">
          {BRAND_LIST.map((brand) => (
            <div
              key={brand.id}
              className={`rounded-2xl border p-6 space-y-6 transition-all ${
                activeBrand.id === brand.id
                  ? "bg-[#14141d] border-zinc-500 shadow-xl"
                  : "bg-[#111117] border-[#21212e]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222230]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: brand.editingIdentity.colorPalette.primary }}
                    />
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1e1e2d] text-white font-bold border border-[#2d2d40]">
                      {brand.prefix}
                    </span>
                    <h2 className="text-lg font-black text-white">{brand.name}</h2>
                  </div>
                  <p className="text-xs text-zinc-400">{brand.editorialPurpose}</p>
                </div>

                <button
                  onClick={() => setBrandId(brand.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md self-start sm:self-auto ${
                    activeBrand.id === brand.id
                      ? "bg-white text-black"
                      : "bg-[#1d1d2b] text-zinc-300 hover:text-white"
                  }`}
                >
                  {activeBrand.id === brand.id ? "Active Workspace" : "Switch to Brand"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* 1. Research & Script Methodology */}
                <div className="p-4 rounded-xl bg-[#161622] border border-[#242436] space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">
                    Research & Script Systems
                  </span>
                  <div>
                    <span className="font-bold text-zinc-200 block">{brand.researchMode.name}</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{brand.researchMode.primaryMethodology}</p>
                  </div>
                  <div className="pt-2 border-t border-[#222232]">
                    <span className="font-bold text-zinc-200 block">{brand.scriptSystem.name}</span>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">Tone: {brand.scriptSystem.tone}</span>
                  </div>
                </div>

                {/* 2. Visual Palette & Character */}
                <div className="p-4 rounded-xl bg-[#161622] border border-[#242436] space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">
                    Visual Character & Palette
                  </span>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {brand.editingIdentity.visualCharacter.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e1e2d] text-zinc-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-[#222232]">
                    {Object.entries(brand.editingIdentity.colorPalette).map(([k, hex]) => (
                      <div key={k} className="flex items-center gap-1 font-mono text-[10px] text-zinc-400">
                        <span className="w-3 h-3 rounded-full border border-black/50" style={{ backgroundColor: hex }} />
                        <span>{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Production Specs */}
                <div className="p-4 rounded-xl bg-[#161622] border border-[#242436] space-y-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block font-semibold">
                    Production & Resolve Specifications
                  </span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Aspect Ratio:</span>
                      <span className="font-mono text-zinc-200 font-semibold">
                        {brand.editingIdentity.exportSpecs.aspectRatio}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Framerate:</span>
                      <span className="font-mono text-zinc-200 font-semibold">
                        {brand.editingIdentity.exportSpecs.frameRate} fps
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">DaVinci Template:</span>
                      <span className="font-mono text-zinc-300 truncate max-w-[140px]">
                        {brand.editingIdentity.davinciTemplateReference}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

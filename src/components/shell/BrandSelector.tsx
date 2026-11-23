"use client";

import React from "react";
import { useBrand } from "@/brands/context";
import { BRAND_LIST } from "@/brands/config";
import { BrandId } from "@/types/brand";
import { ChevronDown, Sparkles } from "lucide-react";

export function BrandSelector() {
  const { activeBrand, setBrandId } = useBrand();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#141418] border border-[#27272a] hover:border-[#3f3f46] transition-all text-xs font-medium text-zinc-200"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shadow-sm"
          style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
        />
        <span className="font-semibold tracking-wide">{activeBrand.name}</span>
        <span className="text-[10px] text-zinc-500 font-mono">({activeBrand.prefix})</span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#14141a] border border-[#272732] shadow-2xl z-50 p-2 space-y-1">
            <div className="px-2.5 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-zinc-400" /> Switch Active Brand
            </div>
            {BRAND_LIST.map((brand) => {
              const isActive = brand.id === activeBrand.id;
              return (
                <button
                  key={brand.id}
                  onClick={() => {
                    setBrandId(brand.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-start gap-2.5 ${
                    isActive
                      ? "bg-[#22222d] text-white border border-[#3f3f50]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1a22]"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: brand.editingIdentity.colorPalette.primary }}
                  />
                  <div>
                    <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
                      {brand.name}
                      <span className="text-[10px] text-zinc-500 font-mono">
                        [{brand.prefix}]
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                      {brand.editorialPurpose}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

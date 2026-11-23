"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { BrandConfig, BrandId } from "@/types/brand";
import { BRANDS, getBrandConfig } from "./config";

interface BrandContextType {
  activeBrand: BrandConfig;
  brandId: BrandId;
  setBrandId: (id: BrandId) => void;
  brandAccentColor: string;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brandId, setBrandIdState] = useState<BrandId>("TECHENIGMASTUDIOS");

  useEffect(() => {
    // Check localStorage for persisted brand selection
    const saved = localStorage.getItem("studiopilot_active_brand") as BrandId;
    if (saved && BRANDS[saved]) {
      setBrandIdState(saved);
    }
  }, []);

  const setBrandId = (id: BrandId) => {
    if (BRANDS[id]) {
      setBrandIdState(id);
      localStorage.setItem("studiopilot_active_brand", id);
    }
  };

  const activeBrand = getBrandConfig(brandId);

  return (
    <BrandContext.Provider
      value={{
        activeBrand,
        brandId,
        setBrandId,
        brandAccentColor: activeBrand.editingIdentity.colorPalette.primary,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
}

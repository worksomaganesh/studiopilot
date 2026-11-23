"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { AssetRecord } from "@/types/project";
import { HardDrive, Plus, Tag, ExternalLink } from "lucide-react";

export default function AssetsPage() {
  const [assets, setAssets] = useState<AssetRecord[]>([]);

  useEffect(() => {
    // Collect all project assets
    fetch("/api/projects")
      .then((r) => r.json())
      .then(async (data) => {
        if (data.success && data.projects) {
          const allAssets: AssetRecord[] = [];
          for (const p of data.projects.slice(0, 5)) {
            const res = await fetch(`/api/projects/${p.id}`).then((r) => r.json());
            if (res.assets) allAssets.push(...res.assets);
          }
          setAssets(allAssets);
        }
      });
  }, []);

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-zinc-400" />
            <span>Creative Assets & Media Register</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Licensing manifests, voiceover masters, B-roll registers, and motion graphic assets.
          </p>
        </div>

        <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#21212e]">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Asset Manifest Records ({assets.length} items)
              </span>
            </div>

            {assets.length === 0 ? (
              <div className="p-12 text-center">
                <HardDrive className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400 font-semibold">No assets logged in current projects.</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Assets generated during editing planning will register here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {assets.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl bg-[#161622] border border-[#252536] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-zinc-200">{a.title}</span>
                      <span className="font-mono text-[10px] text-zinc-500 ml-2">[{a.type}]</span>
                    </div>
                    <span className="text-[11px] text-zinc-400">{a.license}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

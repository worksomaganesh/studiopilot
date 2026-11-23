"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { useBrand } from "@/brands/context";
import { BRAND_LIST, getBrandConfig } from "@/brands/config";
import { BrandId } from "@/types/brand";
import { EditingPlan } from "@/types/editing";
import { ScriptDocument } from "@/types/script";
import { ContentProject } from "@/types/project";
import {
  Film,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  Palette,
  Type,
  Sliders,
  Volume2,
  Tv,
  FileCode,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function EditingStudioPage() {
  const { activeBrand, setBrandId } = useBrand();

  const [brandId, setSelectedBrandId] = useState<BrandId>(activeBrand.id);
  const [plans, setPlans] = useState<EditingPlan[]>([]);
  const [scripts, setScripts] = useState<ScriptDocument[]>([]);
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<EditingPlan | null>(null);

  // Generation State
  const [selectedScriptId, setSelectedScriptId] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const brandConfig = getBrandConfig(brandId);

  useEffect(() => {
    async function loadData() {
      try {
        const [planRes, scrRes, prjRes] = await Promise.all([
          fetch("/api/editing").then((r) => r.json()),
          fetch("/api/scripts").then((r) => r.json()),
          fetch("/api/projects").then((r) => r.json()),
        ]);

        if (planRes.success) {
          setPlans(planRes.editingPlans || []);
          if (planRes.editingPlans?.length > 0 && !selectedPlan) {
            setSelectedPlan(planRes.editingPlans[0]);
          }
        }
        if (scrRes.success) {
          setScripts(scrRes.scripts || []);
          if (scrRes.scripts?.length > 0 && !selectedScriptId) {
            setSelectedScriptId(scrRes.scripts[0].id);
          }
        }
        if (prjRes.success) setProjects(prjRes.projects || []);
      } catch (err) {
        console.error("Failed to load editing studio data", err);
      }
    }

    loadData();
  }, []);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScriptId) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/editing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scriptId: selectedScriptId,
          projectId: selectedProjectId || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPlans((prev) => [data.editingPlan, ...prev]);
        setSelectedPlan(data.editingPlan);
      }
    } catch (err) {
      console.error("Failed to generate editing plan", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 font-bold border border-emerald-800/40">
                SYSTEM 4
              </span>
              <span className="text-xs font-semibold text-zinc-400">
                Brand-Specific Creative Production Planning
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Film className="w-6 h-6 text-emerald-400" />
              <span>Editing Studio</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
              Defines and enforces independent visual identities, translates approved scripts into scene-by-scene editing plans, and prepares DaVinci Resolve EDL manifests & Remotion templates.
            </p>
          </div>
        </div>

        {/* Brand Selector for Editing Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {BRAND_LIST.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBrandId(b.id);
                setBrandId(b.id);
              }}
              className={`p-4 rounded-2xl text-left border transition-all text-xs space-y-1.5 ${
                brandId === b.id
                  ? "bg-[#181826] border-zinc-400 text-white shadow-xl"
                  : "bg-[#111117] border-[#21212e] text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: b.editingIdentity.colorPalette.primary }}
                />
                <span className="text-sm text-zinc-100">{b.name}</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">
                {b.editingIdentity.visualCharacter.join(" • ")}
              </div>
            </button>
          ))}
        </div>

        {/* Brand Editing Identity Specifications Card */}
        <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#21212e]">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>{brandConfig.name} — Visual Identity & Guidelines</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {brandConfig.editingIdentity.editingPhilosophy}
              </p>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#181824] text-zinc-300 border border-[#262638]">
              {brandConfig.editingIdentity.exportSpecs.aspectRatio} • {brandConfig.editingIdentity.exportSpecs.frameRate}fps
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Color Palette */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <Palette className="w-4 h-4 text-zinc-400" />
                <span>Established Palette</span>
              </div>
              <div className="space-y-2">
                {Object.entries(brandConfig.editingIdentity.colorPalette).map(([name, hex]) => (
                  <button
                    key={name}
                    onClick={() => copyToClipboard(hex, name)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#151520] border border-[#242436] hover:border-zinc-400 transition-all text-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-black/40"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-zinc-300 font-medium capitalize">{name}</span>
                    </div>
                    <span className="font-mono text-zinc-400 group-hover:text-white flex items-center gap-1 text-[11px]">
                      {copiedLabel === name ? <Check className="w-3 h-3 text-emerald-400" /> : hex}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Motion Design & Transitions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <Tv className="w-4 h-4 text-zinc-400" />
                <span>Motion & Transitions</span>
              </div>
              <div className="p-4 rounded-xl bg-[#151520] border border-[#242436] text-xs space-y-3">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                    Motion Design Principles
                  </span>
                  <ul className="list-disc list-inside text-zinc-300 text-[11px] space-y-1">
                    {brandConfig.editingIdentity.motionPrinciples.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#222232]">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                    Signature Transitions
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {brandConfig.editingIdentity.transitions.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1c2a] text-zinc-300 border border-[#2c2c40]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Typography & Captions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <Type className="w-4 h-4 text-zinc-400" />
                <span>Typography & Sound</span>
              </div>
              <div className="p-4 rounded-xl bg-[#151520] border border-[#242436] text-xs space-y-3">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">
                    Heading Font
                  </span>
                  <span className="font-semibold text-zinc-200 font-mono">
                    {brandConfig.editingIdentity.typography.headingFont}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">
                    Caption Style
                  </span>
                  <span className="text-zinc-300 text-[11px]">
                    {brandConfig.editingIdentity.captionStyle.font} ({brandConfig.editingIdentity.captionStyle.case}) with{" "}
                    <span
                      className="font-bold font-mono"
                      style={{ color: brandConfig.editingIdentity.captionStyle.highlightColor }}
                    >
                      {brandConfig.editingIdentity.captionStyle.highlightColor}
                    </span>{" "}
                    highlight
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-0.5">
                    Sound Design Atmosphere
                  </span>
                  <span className="text-zinc-400 text-[11px] leading-relaxed">
                    {brandConfig.editingIdentity.soundDesign}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Editing Plan from Script Form */}
        <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-emerald-400" />
            <span>Generate Production Scene Plan</span>
          </h2>

          <form onSubmit={handleGeneratePlan} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Select Approved Script
              </label>
              <select
                value={selectedScriptId}
                onChange={(e) => setSelectedScriptId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none"
              >
                {scripts.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.brandId}] {s.title} ({s.scenes.length} scenes) {s.isApproved ? "★ Approved" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={isGenerating || !selectedScriptId}
                className="w-full py-2 px-4 rounded-xl text-xs font-bold text-black transition-all shadow-md hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: brandConfig.editingIdentity.colorPalette.primary }}
              >
                {isGenerating ? "Building Manifest..." : "Generate Scene Plan"}
              </button>
            </div>
          </form>
        </div>

        {/* Active Production Editing Plan */}
        {selectedPlan && (
          <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#21212e]">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mb-1">
                  <span>PLAN ID: {selectedPlan.id}</span>
                  <span>•</span>
                  <span>{selectedPlan.aspectRatio}</span>
                  <span>•</span>
                  <span>{selectedPlan.frameRate} FPS</span>
                </div>
                <h2 className="text-lg font-black text-white">{selectedPlan.title}</h2>
              </div>

              {/* Download Buttons for DaVinci Resolve */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    downloadFile(
                      selectedPlan.davinciResolveExport.edlText,
                      `${selectedPlan.id}_Timeline.edl`,
                      "text/plain"
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#1a1a26] hover:bg-[#252536] text-xs font-semibold text-zinc-200 border border-[#2d2d40] flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .EDL</span>
                </button>

                <button
                  onClick={() =>
                    downloadFile(
                      selectedPlan.davinciResolveExport.csvManifest,
                      `${selectedPlan.id}_Manifest.csv`,
                      "text/csv"
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#1a1a26] hover:bg-[#252536] text-xs font-semibold text-zinc-200 border border-[#2d2d40] flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .CSV</span>
                </button>
              </div>
            </div>

            {/* Scene Manifest Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Scene-by-Scene Production Plan ({selectedPlan.scenes.length} Scenes)
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#232334] bg-[#14141f]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#232334] text-zinc-500 font-mono text-[10px] uppercase bg-[#161624]">
                      <th className="py-2.5 px-3">Scene</th>
                      <th className="py-2.5 px-3">Narration</th>
                      <th className="py-2.5 px-3">Visual Direction</th>
                      <th className="py-2.5 px-3">Motion</th>
                      <th className="py-2.5 px-3">Required Assets</th>
                      <th className="py-2.5 px-3">Sound Cue</th>
                      <th className="py-2.5 px-3">DaVinci Tracks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e2d]">
                    {selectedPlan.scenes.map((s) => (
                      <tr key={s.sceneNumber} className="hover:bg-[#181826] transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-zinc-300">#{s.sceneNumber}</td>
                        <td className="py-3 px-3 font-medium text-zinc-100 max-w-xs">{s.narration}</td>
                        <td className="py-3 px-3 text-zinc-300 max-w-xs">{s.visualDirection}</td>
                        <td className="py-3 px-3 text-zinc-400 text-[11px]">{s.motion}</td>
                        <td className="py-3 px-3 text-zinc-400 text-[10px]">
                          {s.requiredAssets.join(", ")}
                        </td>
                        <td className="py-3 px-3 font-mono text-[10px] text-emerald-400">{s.soundCue}</td>
                        <td className="py-3 px-3 font-mono text-[9px] text-zinc-500 max-w-[120px]">
                          {s.davinciTrackSuggestion.videoTrack1}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Remotion Scaffolding Configuration */}
            <div className="p-4 rounded-xl bg-[#14141e] border border-[#232334] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-blue-400" />
                  <span>Remotion Composition Scaffolding</span>
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(selectedPlan.remotionScaffold.jsonSceneConfig, "remotion")
                  }
                  className="px-2.5 py-1 rounded bg-[#1e1e2c] text-[10px] font-semibold text-zinc-300 hover:text-white"
                >
                  {copiedLabel === "remotion" ? "Copied" : "Copy Remotion Config"}
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-[#0e0e14] text-[11px] font-mono text-zinc-400 overflow-x-auto max-h-48 border border-[#1e1e2a]">
                {selectedPlan.remotionScaffold.jsonSceneConfig}
              </pre>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { useBrand } from "@/brands/context";
import { BRAND_LIST, getBrandConfig } from "@/brands/config";
import { BrandId } from "@/types/brand";
import { ScriptDocument } from "@/types/script";
import { ResearchDossier } from "@/types/research";
import { CreativePattern } from "@/types/creative-intelligence";
import { ContentProject } from "@/types/project";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Play,
  Copy,
  Check,
  AlertCircle,
  Plus,
  Compass,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

function ScriptStudioContent() {
  const { activeBrand, setBrandId } = useBrand();
  const searchParams = useSearchParams();
  const paramProjectId = searchParams.get("projectId") || "";

  const [scripts, setScripts] = useState<ScriptDocument[]>([]);
  const [dossiers, setDossiers] = useState<ResearchDossier[]>([]);
  const [patterns, setPatterns] = useState<CreativePattern[]>([]);
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [selectedScript, setSelectedScript] = useState<ScriptDocument | null>(null);

  // Script Generator Form State
  const [brandId, setSelectedBrandId] = useState<BrandId>(activeBrand.id);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(paramProjectId);
  const [selectedDossierId, setSelectedDossierId] = useState<string>("");
  const [selectedPatternIds, setSelectedPatternIds] = useState<string[]>([]);
  const [targetPlatform, setTargetPlatform] = useState("YouTube Shorts");
  const [targetDurationSeconds, setTargetDurationSeconds] = useState(60);
  const [audienceLevel, setAudienceLevel] = useState("Intermediate");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationWarning, setGenerationWarning] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const brandConfig = getBrandConfig(brandId);

  useEffect(() => {
    async function loadData() {
      try {
        const [scrRes, dosRes, patRes, prjRes] = await Promise.all([
          fetch("/api/scripts").then((r) => r.json()),
          fetch("/api/research").then((r) => r.json()),
          fetch("/api/creative-intelligence?type=patterns").then((r) => r.json()),
          fetch("/api/projects").then((r) => r.json()),
        ]);

        if (scrRes.success) {
          setScripts(scrRes.scripts || []);
          if (scrRes.scripts?.length > 0 && !selectedScript) {
            setSelectedScript(scrRes.scripts[0]);
          }
        }
        if (dosRes.success) {
          setDossiers(dosRes.researchRuns || []);
          if (dosRes.researchRuns?.length > 0 && !selectedDossierId) {
            setSelectedDossierId(dosRes.researchRuns[0].id);
          }
        }
        if (patRes.success) setPatterns(patRes.patterns || []);
        if (prjRes.success) setProjects(prjRes.projects || []);
      } catch (err) {
        console.error("Failed to load script studio data", err);
      }
    }

    loadData();
  }, []);

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDossierId) {
      setGenerationError("Please select a verified Research Dossier to ground the script in truth.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationWarning(null);

    try {
      const res = await fetch("/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId,
          projectId: selectedProjectId || undefined,
          researchDossierId: selectedDossierId,
          patternIds: selectedPatternIds,
          targetPlatform,
          targetDurationSeconds: Number(targetDurationSeconds),
          audienceLevel,
          additionalInstructions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to generate script");
      }

      setScripts((prev) => [data.script, ...prev]);
      setSelectedScript(data.script);
      if (data.warning) {
        setGenerationWarning(data.warning);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setGenerationError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedScript) return;
    try {
      const res = await fetch("/api/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", scriptId: selectedScript.id }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedScript(data.script);
        setScripts((prev) => prev.map((s) => (s.id === data.script.id ? data.script : s)));
      }
    } catch (err) {
      console.error("Failed to approve script", err);
    }
  };

  const copyNarration = () => {
    if (!selectedScript) return;
    navigator.clipboard.writeText(selectedScript.fullNarration);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 font-bold border border-amber-800/40">
              SYSTEM 3
            </span>
            <span className="text-xs font-semibold text-zinc-400">
              {brandConfig.scriptSystem.name} ({brandConfig.name})
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            <span>Script Studio</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
            Synthesizing verified research dossiers and creative viral patterns into original, high-retention, scene-level production scripts.
          </p>
        </div>
      </div>

      {generationWarning && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{generationWarning}</span>
        </div>
      )}

      {generationError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{generationError}</span>
        </div>
      )}

      {/* Script Generation Input Form */}
      <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-6 space-y-5">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Configure Script Architecture</span>
        </h2>

        <form onSubmit={handleGenerateScript} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {BRAND_LIST.map((b) => (
              <button
                type="button"
                key={b.id}
                onClick={() => {
                  setSelectedBrandId(b.id);
                  setBrandId(b.id);
                }}
                className={`p-3 rounded-xl text-left border transition-all text-xs ${
                  brandId === b.id
                    ? "bg-[#1f1f2e] border-amber-500 text-white shadow-md"
                    : "bg-[#14141e] border-[#252536] text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: b.editingIdentity.colorPalette.primary }}
                  />
                  <span>{b.name}</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-300">{b.scriptSystem.name}</div>
                <div className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                  {b.scriptSystem.tone}
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                1. Grounding Research Dossier *
              </label>
              <select
                value={selectedDossierId}
                onChange={(e) => setSelectedDossierId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none"
              >
                {dossiers.map((d) => (
                  <option key={d.id} value={d.id}>
                    [{d.brandId}] {d.conceptName} — {d.exactTopic}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                2. Link to Content Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none"
              >
                <option value="">Standalone Script (No Project Link)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.id}] {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pattern Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              3. Selected Creative Patterns (Incorporate into Script)
            </label>
            <div className="flex flex-wrap gap-2">
              {patterns.slice(0, 6).map((pat) => {
                const isChecked = selectedPatternIds.includes(pat.id);
                return (
                  <button
                    type="button"
                    key={pat.id}
                    onClick={() => {
                      if (isChecked) {
                        setSelectedPatternIds(selectedPatternIds.filter((id) => id !== pat.id));
                      } else {
                        setSelectedPatternIds([...selectedPatternIds, pat.id]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isChecked
                        ? "bg-purple-950/80 border-purple-400 text-purple-200 font-semibold"
                        : "bg-[#161622] border-[#252536] text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {pat.name} ({pat.category})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-black flex items-center gap-2 transition-all shadow-xl hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: brandConfig.editingIdentity.colorPalette.primary }}
            >
              {isGenerating ? "Writing Brand Script..." : "Generate Production Script"}
            </button>
          </div>
        </form>
      </div>

      {/* Saved Scripts Selector */}
      {scripts.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
            Saved Scripts:
          </span>
          {scripts.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedScript(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 border flex items-center gap-1.5 ${
                selectedScript?.id === s.id
                  ? "bg-[#222232] text-white border-amber-400"
                  : "bg-[#14141d] text-zinc-400 border-[#252538] hover:text-zinc-200"
              }`}
            >
              {s.isApproved ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <Clock className="w-3 h-3 text-amber-400" />
              )}
              <span className="truncate max-w-[180px]">{s.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Selected Script Detail View */}
      {selectedScript && (
        <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-6 space-y-8 animate-in fade-in duration-200">
          {/* Header with Approval Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#21212e]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mb-1">
                <span>ID: {selectedScript.id}</span>
                <span>•</span>
                <span>{selectedScript.targetPlatform} ({selectedScript.targetDurationSeconds}s)</span>
                <span>•</span>
                <span>Brand: {selectedScript.brandId}</span>
              </div>
              <h2 className="text-xl font-black text-white">{selectedScript.title}</h2>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={copyNarration}
                className="px-3 py-1.5 rounded-xl bg-[#1a1a26] text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5"
              >
                {copiedStatus ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedStatus ? "Copied" : "Copy Narration"}</span>
              </button>

              {!selectedScript.isApproved ? (
                <button
                  onClick={handleApprove}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Script</span>
                </button>
              ) : (
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved for Editing</span>
                </div>
              )}
            </div>
          </div>

          {/* Hook Alternatives */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Hook Alternatives ({selectedScript.hookAlternatives.length} Tested Variations)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedScript.hookAlternatives.map((h) => (
                <div
                  key={h.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    h.isRecommended
                      ? "bg-[#181826] border-amber-400"
                      : "bg-[#14141e] border-[#242436]"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-zinc-300">
                    <span>{h.technique}</span>
                    {h.isRecommended && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white font-medium">&ldquo;{h.hookText}&rdquo;</p>
                  <p className="text-[11px] text-zinc-500">{h.reasoning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Narration Voiceover */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Complete Narration Voiceover (Continuous Audio Track)
            </h3>
            <div className="p-4 rounded-xl bg-[#14141e] border border-[#232334] text-xs text-zinc-200 leading-relaxed font-mono">
              {selectedScript.fullNarration}
            </div>
          </div>

          {/* Scene-by-Scene Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Scene Breakdown Table ({selectedScript.scenes.length} Scenes)
            </h3>
            <div className="overflow-x-auto rounded-xl border border-[#232334] bg-[#14141f]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#232334] text-zinc-500 font-mono text-[10px] uppercase bg-[#161624]">
                    <th className="py-2.5 px-3">Scene</th>
                    <th className="py-2.5 px-3">Narration (Voiceover)</th>
                    <th className="py-2.5 px-3">Visual Direction</th>
                    <th className="py-2.5 px-3">Motion / Graphic</th>
                    <th className="py-2.5 px-3">On-Screen Text</th>
                    <th className="py-2.5 px-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e2d]">
                  {selectedScript.scenes.map((sc) => (
                    <tr key={sc.sceneNumber} className="hover:bg-[#181826] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-zinc-300">#{sc.sceneNumber}</td>
                      <td className="py-3 px-3 font-medium text-zinc-100 max-w-xs">{sc.narration}</td>
                      <td className="py-3 px-3 text-zinc-300 max-w-xs">{sc.visualDirection}</td>
                      <td className="py-3 px-3 text-zinc-400 text-[11px]">{sc.motionDirection}</td>
                      <td className="py-3 px-3 font-mono text-[10px] text-yellow-400">{sc.onScreenText}</td>
                      <td className="py-3 px-3 font-mono text-zinc-400">{sc.estimatedDurationSeconds}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Editorial Evaluation Score */}
          {selectedScript.evaluation && (
            <div className="p-5 rounded-xl bg-[#14141e] border border-[#232334] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Editorial Quality Evaluation
                  </h3>
                  <p className="text-[10px] text-zinc-500 italic mt-0.5">
                    {selectedScript.evaluation.disclaimer}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1e1e2d] border border-[#2e2e42] font-mono font-black text-emerald-400 text-sm">
                  <span>{selectedScript.evaluation.overallScore}</span>
                  <span className="text-[10px] text-zinc-500">/100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                {Object.entries(selectedScript.evaluation.criteria || {}).map(([key, val]) => (
                  <div key={key} className="p-2.5 rounded-lg bg-[#181824] border border-[#242436]">
                    <span className="text-[10px] text-zinc-500 block truncate uppercase">{key}</span>
                    <span className="font-bold text-white text-xs">{val.score}/100</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ScriptStudioPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-500">Loading Script Studio...</div>}>
        <ScriptStudioContent />
      </Suspense>
    </AppShell>
  );
}

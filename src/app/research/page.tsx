"use client";

import React, { useState, useEffect, Suspense } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { useBrand } from "@/brands/context";
import { BRAND_LIST, getBrandConfig } from "@/brands/config";
import { BrandId } from "@/types/brand";
import { ResearchDossier, ResearchRequest } from "@/types/research";
import { ContentProject } from "@/types/project";
import {
  Compass,
  Search,
  Sparkles,
  ExternalLink,
  Copy,
  Download,
  Check,
  AlertCircle,
  FileText,
  Layers,
  ChevronRight,
  Info,
  Clock,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

function ResearchStudioContent() {
  const { activeBrand, setBrandId } = useBrand();
  const searchParams = useSearchParams();

  const paramProjectId = searchParams.get("projectId") || "";
  const paramBrandId = (searchParams.get("brandId") as BrandId) || activeBrand.id;
  const paramConcept = searchParams.get("concept") || "";
  const paramTopic = searchParams.get("topic") || "";

  // Form State
  const [brandId, setSelectedBrandId] = useState<BrandId>(paramBrandId);
  const [conceptName, setConceptName] = useState(paramConcept);
  const [exactTopic, setExactTopic] = useState(paramTopic);
  const [subtopicsText, setSubtopicsText] = useState(
    "1. Fundamental mechanisms\n2. Real-world examples\n3. Common misconceptions & limitations"
  );
  const [targetAudience, setTargetAudience] = useState("Practicing engineers & tech professionals");
  const [knowledgeLevel, setKnowledgeLevel] = useState<"Beginner" | "Intermediate" | "Advanced" | "Executive">("Intermediate");
  const [targetPlatform, setTargetPlatform] = useState("YouTube Shorts");
  const [desiredDuration, setDesiredDuration] = useState("60 seconds");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(paramProjectId);

  // Workflow State
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeDossier, setActiveDossier] = useState<ResearchDossier | null>(null);
  const [savedDossiers, setSavedDossiers] = useState<ResearchDossier[]>([]);
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const brandConfig = getBrandConfig(brandId);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [resDossiers, resProjects] = await Promise.all([
          fetch("/api/research").then((r) => r.json()),
          fetch("/api/projects").then((r) => r.json()),
        ]);

        if (resDossiers.success) {
          setSavedDossiers(resDossiers.researchRuns || []);
          if (resDossiers.researchRuns?.length > 0 && !activeDossier) {
            setActiveDossier(resDossiers.researchRuns[0]);
          }
        }
        if (resProjects.success) {
          setProjects(resProjects.projects || []);
        }
      } catch (err) {
        console.error("Failed to load research data", err);
      }
    }

    loadInitialData();
  }, []);

  const handleLaunchResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptName.trim() || !exactTopic.trim()) {
      setErrorMessage("Concept name and exact topic title are required.");
      return;
    }

    setIsExecuting(true);
    setErrorMessage(null);
    setWarningMessage(null);

    const subtopics = subtopicsText
      .split("\n")
      .map((s) => s.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter(Boolean);

    const requestPayload: ResearchRequest = {
      projectId: selectedProjectId || undefined,
      brandId,
      conceptName: conceptName.trim(),
      exactTopic: exactTopic.trim(),
      subtopics: subtopics.length > 0 ? subtopics : ["Fundamental principles", "Architecture", "Limitations"],
      targetAudience,
      knowledgeLevel,
      targetPlatform,
      desiredDuration,
      additionalInstructions,
    };

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Research synthesis failed");
      }

      setActiveDossier(data.dossier);
      setSavedDossiers((prev) => [data.dossier, ...prev]);
      if (data.warning) {
        setWarningMessage(data.warning);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsExecuting(false);
    }
  };

  const copyMarkdown = () => {
    if (!activeDossier) return;
    navigator.clipboard.writeText(activeDossier.rawMarkdown || activeDossier.executiveOverview);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const downloadMarkdown = () => {
    if (!activeDossier) return;
    const blob = new Blob([activeDossier.rawMarkdown || activeDossier.executiveOverview], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Research_${activeDossier.conceptName.replace(/\s+/g, "_")}.md`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 font-bold border border-blue-800/40">
              SYSTEM 1
            </span>
            <span className="text-xs font-semibold text-zinc-400">
              {brandConfig.name} • {brandConfig.researchMode.name}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-400" />
            <span>Research Studio</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
            Deep, genuine web research producing structured dossiers with verified Claim-Evidence matrices and persistent source citations.
          </p>
        </div>
      </div>

      {/* Warning / Error Banners */}
      {warningMessage && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-200 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Search Notice</span>
            {warningMessage}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Execution Error</span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Research Input Form */}
      <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-6">
        <form onSubmit={handleLaunchResearch} className="space-y-5">
          {/* Brand Methodology Switcher */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Brand Research Methodology
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {BRAND_LIST.map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => {
                    setSelectedBrandId(b.id);
                    setBrandId(b.id);
                  }}
                  className={`p-3.5 rounded-xl text-left border transition-all text-xs ${
                    brandId === b.id
                      ? "bg-[#1d1d2b] border-zinc-400 text-white shadow-md"
                      : "bg-[#14141e] border-[#252536] text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: b.editingIdentity.colorPalette.primary }}
                    />
                    <span>{b.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-300 mb-1">
                    {b.researchMode.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 line-clamp-2">
                    {b.researchMode.primaryMethodology}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Link to Project & Concept Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Link to Content Project (Optional)
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none focus:border-zinc-400"
              >
                <option value="">Standalone Research (No Project Link)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.id}] {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Concept Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Machine Learning Feature Engineering"
                value={conceptName}
                onChange={(e) => setConceptName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          {/* Exact Topic / Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Exact Topic / Research Question *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. What is Feature Engineering and why does it matter in Machine Learning?"
              value={exactTopic}
              onChange={(e) => setExactTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Deep-Dive Subtopics */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Deep-Dive Subtopics or Specific Questions (One per line)
            </label>
            <textarea
              rows={3}
              value={subtopicsText}
              onChange={(e) => setSubtopicsText(e.target.value)}
              placeholder="1. What is feature engineering?&#10;2. How are raw columns transformed?&#10;3. Why can poor engineering affect accuracy?"
              className="w-full px-3 py-2.5 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 font-mono focus:outline-none focus:border-zinc-400 leading-relaxed"
            />
          </div>

          {/* Optional Specifications */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Knowledge Level
              </label>
              <select
                value={knowledgeLevel}
                onChange={(e) => setKnowledgeLevel(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-300 focus:outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Platform
              </label>
              <input
                type="text"
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Desired Duration
              </label>
              <input
                type="text"
                value={desiredDuration}
                onChange={(e) => setDesiredDuration(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isExecuting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-black flex items-center gap-2 transition-all shadow-xl hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: brandConfig.editingIdentity.colorPalette.primary }}
            >
              {isExecuting ? (
                <>
                  <Search className="w-4 h-4 animate-spin" />
                  <span>Searching Web & Synthesizing Claims...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4 stroke-[2.5]" />
                  <span>Execute Brand Research</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Saved Research Dossiers History Selector */}
      {savedDossiers.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
            Saved Dossiers:
          </span>
          {savedDossiers.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDossier(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 border flex items-center gap-1.5 ${
                activeDossier?.id === d.id
                  ? "bg-[#222232] text-white border-zinc-400"
                  : "bg-[#14141d] text-zinc-400 border-[#252538] hover:text-zinc-200"
              }`}
            >
              <span className="font-mono text-[10px] text-zinc-500">v{d.version}</span>
              <span className="truncate max-w-[160px]">{d.exactTopic}</span>
            </button>
          ))}
        </div>
      )}

      {/* Active Research Dossier Output */}
      {activeDossier && (
        <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-6 space-y-8 animate-in fade-in duration-200">
          {/* Dossier Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#21212e]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mb-1">
                <span>ID: {activeDossier.id}</span>
                <span>•</span>
                <span>VERSION {activeDossier.version}</span>
                <span>•</span>
                <span>{new Date(activeDossier.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-black text-white">
                {activeDossier.exactTopic}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-zinc-400">
                  Concept: {activeDossier.conceptName}
                </span>
                {activeDossier.projectId && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e1e2d] text-zinc-300 border border-[#2d2d40]">
                    Project: {activeDossier.projectId}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyMarkdown}
                className="px-3 py-1.5 rounded-xl bg-[#181824] hover:bg-[#222232] text-zinc-300 border border-[#2c2c40] text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copiedStatus ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedStatus ? "Copied" : "Copy Markdown"}</span>
              </button>
              <button
                onClick={downloadMarkdown}
                className="px-3 py-1.5 rounded-xl bg-[#181824] hover:bg-[#222232] text-zinc-300 border border-[#2c2c40] text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .MD</span>
              </button>
            </div>
          </div>

          {/* 1. Executive Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              1. Executive Overview
            </h3>
            <p className="text-xs text-zinc-200 leading-relaxed bg-[#14141e] p-4 rounded-xl border border-[#232334]">
              {activeDossier.executiveOverview}
            </p>
          </div>

          {/* 2. Concept Definition & Fundamentals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                2. Concept Definition
              </h3>
              <p className="text-xs text-zinc-300 bg-[#14141e] p-4 rounded-xl border border-[#232334] h-full">
                {activeDossier.conceptDefinition}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                3. Background & Fundamentals
              </h3>
              <p className="text-xs text-zinc-300 bg-[#14141e] p-4 rounded-xl border border-[#232334] h-full">
                {activeDossier.backgroundAndFundamentals}
              </p>
            </div>
          </div>

          {/* 4. Subtopic Deep-Dives */}
          {activeDossier.subtopics.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                4. Subtopic Deep-Dives ({activeDossier.subtopics.length} Sections)
              </h3>
              <div className="space-y-3">
                {activeDossier.subtopics.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#14141e] border border-[#232334] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-zinc-100">
                      <span>4.{idx + 1} {sub.title}</span>
                    </div>
                    <p className="text-zinc-300 italic">{sub.question}</p>
                    <p className="text-zinc-300">{sub.explanation}</p>

                    {sub.mechanisms.length > 0 && (
                      <div className="pt-1">
                        <span className="font-semibold text-zinc-400 block text-[11px] mb-0.5">
                          Key Mechanisms:
                        </span>
                        <ul className="list-disc list-inside text-zinc-400 space-y-0.5 text-[11px]">
                          {sub.mechanisms.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Claim-Evidence Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                5. Claim-Evidence Matrix ({activeDossier.claimEvidenceMatrix.length} Verified Claims)
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                Traceable to underlying sources
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#222232] bg-[#14141f]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#222232] text-zinc-500 font-mono text-[10px] uppercase bg-[#161624]">
                    <th className="py-2.5 px-3">Claim ID</th>
                    <th className="py-2.5 px-3">Factual Claim</th>
                    <th className="py-2.5 px-3">Supporting Source</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Evidence / Quote</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e2d]">
                  {activeDossier.claimEvidenceMatrix.map((c) => (
                    <tr key={c.id} className="hover:bg-[#181826] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-zinc-400">{c.id}</td>
                      <td className="py-3 px-3 font-medium text-zinc-200 max-w-xs">{c.claim}</td>
                      <td className="py-3 px-3">
                        <a
                          href={c.supportingSourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span className="truncate max-w-[140px]">{c.supportingSourceTitle}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            c.verificationStatus === "VERIFIED"
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                              : "bg-blue-950/60 text-blue-400 border border-blue-800/40"
                          }`}
                        >
                          {c.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400 text-[11px] italic max-w-sm">
                        &ldquo;{c.quoteOrEvidence}&rdquo;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Source Citation Register */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              6. Source Citation Register ({activeDossier.sourceRegister.length} Verified Documents)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeDossier.sourceRegister.map((s, idx) => (
                <a
                  key={s.id || idx}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-[#14141e] border border-[#232334] hover:border-zinc-400 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-zinc-200 group-hover:text-white truncate max-w-[220px]">
                      {s.title}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white shrink-0" />
                  </div>
                  <span className="text-[10px] text-zinc-500 block truncate">{s.url}</span>
                  {s.snippet && (
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                      {s.snippet}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* 7. Research Gaps & Follow-Up Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#14141e] border border-[#232334] text-xs space-y-2">
              <h4 className="font-bold text-zinc-300">Research Gaps & Uncertainty</h4>
              <ul className="list-disc list-inside text-zinc-400 text-[11px] space-y-1">
                {activeDossier.researchGapsAndUncertainty.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#14141e] border border-[#232334] text-xs space-y-2">
              <h4 className="font-bold text-zinc-300">Suggested Follow-Up Inquiries</h4>
              <ul className="list-disc list-inside text-zinc-400 text-[11px] space-y-1">
                {activeDossier.suggestedFollowUpQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResearchStudioPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-500">Loading Research Studio...</div>}>
        <ResearchStudioContent />
      </Suspense>
    </AppShell>
  );
}

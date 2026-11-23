"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { useBrand } from "@/brands/context";
import { CreativePattern, CreativeReel, ReelAnalysis } from "@/types/creative-intelligence";
import { BRAND_LIST } from "@/brands/config";
import { BrandId } from "@/types/brand";
import {
  Sparkles,
  Search,
  Plus,
  Play,
  TrendingUp,
  BarChart,
  Eye,
  Film,
  Layers,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function CreativeIntelligencePage() {
  const { activeBrand } = useBrand();

  const [activeTab, setActiveTab] = useState<"database" | "submit_analyze" | "patterns">("database");
  const [reels, setReels] = useState<CreativeReel[]>([]);
  const [patterns, setPatterns] = useState<CreativePattern[]>([]);
  const [selectedPatternCategory, setSelectedPatternCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReel, setSelectedReel] = useState<CreativeReel | null>(null);

  // Submit / Analysis Form State
  const [publicUrl, setPublicUrl] = useState("");
  const [platform, setPlatform] = useState<"YouTube Shorts" | "Instagram Reels" | "TikTok">("YouTube Shorts");
  const [creatorHandle, setCreatorHandle] = useState("");
  const [creatorFollowerCount, setCreatorFollowerCount] = useState("50000");
  const [viewCount, setViewCount] = useState("450000");
  const [likeCount, setLikeCount] = useState("32000");
  const [commentCount, setCommentCount] = useState("1200");
  const [titleOrCaption, setTitleOrCaption] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisWarning, setAnalysisWarning] = useState<string | null>(null);

  const fetchCreativeData = async () => {
    try {
      const res = await fetch("/api/creative-intelligence");
      const data = await res.json();
      if (data.success) {
        setReels(data.reels || []);
        setPatterns(data.patterns || []);
        if (data.reels?.length > 0 && !selectedReel) {
          setSelectedReel(data.reels[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load creative intelligence data", err);
    }
  };

  useEffect(() => {
    fetchCreativeData();
  }, []);

  const handleAnalyzeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcriptText.trim() || !publicUrl.trim() || !creatorHandle.trim()) {
      setAnalysisError("Public URL, creator handle, and transcript text are required.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisWarning(null);

    try {
      const res = await fetch("/api/creative-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze",
          publicUrl: publicUrl.trim(),
          platform,
          creatorHandle: creatorHandle.trim().replace(/^@/, ""),
          creatorFollowerCount: Number(creatorFollowerCount),
          viewCount: Number(viewCount),
          likeCount: Number(likeCount),
          commentCount: Number(commentCount),
          titleOrCaption: titleOrCaption.trim(),
          transcriptText: transcriptText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to analyze reference reel");
      }

      setReels((prev) => [data.reel, ...prev]);
      setSelectedReel(data.reel);
      if (data.extractedPatterns?.length > 0) {
        setPatterns((prev) => [...data.extractedPatterns, ...prev]);
      }
      if (data.warning) {
        setAnalysisWarning(data.warning);
      }
      setActiveTab("database");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setAnalysisError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Filter Patterns
  const filteredPatterns = patterns.filter((p) => {
    if (selectedPatternCategory !== "ALL" && p.category !== selectedPatternCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.whyItWorks.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 font-bold border border-purple-800/40">
                SYSTEM 2
              </span>
              <span className="text-xs font-semibold text-zinc-400">
                Viral Storytelling & Retention Architecture
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span>Creative Intelligence</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
              Deconstruct high-performing short-form video references, analyze metric snapshots with time stamps, and extract reusable creative blueprints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("submit_analyze")}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 transition-all shadow-md hover:brightness-110"
              style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Analyze Reference</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#21212e] pb-1">
          <button
            onClick={() => setActiveTab("database")}
            className={`px-4 py-2 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
              activeTab === "database"
                ? "bg-[#161622] text-white border-purple-400"
                : "text-zinc-500 hover:text-zinc-300 border-transparent"
            }`}
          >
            Reference Reels & Snapshots ({reels.length})
          </button>
          <button
            onClick={() => setActiveTab("patterns")}
            className={`px-4 py-2 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
              activeTab === "patterns"
                ? "bg-[#161622] text-white border-purple-400"
                : "text-zinc-500 hover:text-zinc-300 border-transparent"
            }`}
          >
            Creative Pattern Knowledge Base ({patterns.length})
          </button>
          <button
            onClick={() => setActiveTab("submit_analyze")}
            className={`px-4 py-2 rounded-t-xl text-xs font-semibold transition-all border-b-2 ${
              activeTab === "submit_analyze"
                ? "bg-[#161622] text-white border-purple-400"
                : "text-zinc-500 hover:text-zinc-300 border-transparent"
            }`}
          >
            Submit & Deconstruct Video
          </button>
        </div>

        {/* TAB 1: REELS DATABASE & ANALYSIS */}
        {activeTab === "database" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Reference Reels List */}
            <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Observed Reference Videos
              </h3>

              <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
                {reels.map((reel) => {
                  const isSelected = selectedReel?.id === reel.id;
                  const ratio = reel.latestMetrics?.viewToFollowerRatio || 1;
                  return (
                    <button
                      key={reel.id}
                      onClick={() => setSelectedReel(reel)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs space-y-1.5 ${
                        isSelected
                          ? "bg-[#1e1e2d] border-purple-500 text-white shadow-md"
                          : "bg-[#151520] border-[#252536] text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="font-bold text-zinc-300">@{reel.creatorHandle}</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#252536] text-purple-400 font-bold">
                          {ratio}x Ratio
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-zinc-200 line-clamp-1">
                        {reel.titleOrCaption}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                        <span>{reel.latestMetrics?.viewCount?.toLocaleString()} Views</span>
                        <span>{reel.platform}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Deep Analysis Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              {selectedReel ? (
                <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-6 space-y-6">
                  {/* Reel Header & Verified Metrics */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#21212e]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-purple-400 font-bold">
                          @{selectedReel.creatorHandle}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-xs text-zinc-400 font-medium">
                          {selectedReel.platform}
                        </span>
                      </div>
                      <h2 className="text-lg font-black text-white">
                        {selectedReel.titleOrCaption}
                      </h2>
                    </div>

                    <a
                      href={selectedReel.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#1a1a26] hover:bg-[#252536] text-xs font-semibold text-zinc-300 flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Metric Snapshot Provenance Card */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#161622] border border-[#242436] text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">OBSERVED VIEWS</span>
                      <span className="font-bold text-white text-sm">
                        {selectedReel.latestMetrics?.viewCount?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">CREATOR FOLLOWERS</span>
                      <span className="font-bold text-white text-sm">
                        {selectedReel.latestMetrics?.creatorFollowersAtObservation?.toLocaleString() || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">VIEW-TO-FOLLOWER</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {selectedReel.latestMetrics?.viewToFollowerRatio || 1}x
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block">DATA PROVENANCE</span>
                      <span className="text-[10px] text-zinc-400 font-semibold block truncate">
                        {selectedReel.latestMetrics?.dataSource}
                      </span>
                    </div>
                  </div>

                  {/* Transcript Viewer */}
                  {selectedReel.transcriptText && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Full Spoken Transcript
                      </span>
                      <div className="p-3.5 rounded-xl bg-[#14141e] border border-[#242436] text-xs text-zinc-300 leading-relaxed font-mono">
                        {selectedReel.transcriptText}
                      </div>
                    </div>
                  )}

                  {/* Analysis Breakdown */}
                  {selectedReel.analysis && (
                    <div className="space-y-4 pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                        Psychological & Cinematic Deconstruction
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Hook Analysis */}
                        <div className="p-4 rounded-xl bg-[#151520] border border-[#242436] space-y-2">
                          <span className="font-bold text-zinc-200 block text-xs border-b border-[#242436] pb-1">
                            Hook Mechanics (First 3s)
                          </span>
                          <div>
                            <span className="text-[10px] text-zinc-500 block">First Spoken Sentence</span>
                            <span className="text-white font-medium">
                              &ldquo;{selectedReel.analysis.hookAnalysis.firstSpokenSentence}&rdquo;
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 block">Curiosity Gap</span>
                            <span className="text-zinc-300">
                              {selectedReel.analysis.hookAnalysis.curiosityGap}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 block">Opening Technique</span>
                            <span className="text-purple-300 font-semibold">
                              {selectedReel.analysis.hookAnalysis.openingTechnique}
                            </span>
                          </div>
                        </div>

                        {/* Retention Patterns */}
                        <div className="p-4 rounded-xl bg-[#151520] border border-[#242436] space-y-2">
                          <span className="font-bold text-zinc-200 block text-xs border-b border-[#242436] pb-1">
                            Retention & Pacing
                          </span>
                          <div>
                            <span className="text-[10px] text-zinc-500 block">Pacing Assessment</span>
                            <span className="text-zinc-200">
                              {selectedReel.analysis.retentionPatterns.pacingAssessment}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 block">Open Loops</span>
                            <ul className="list-disc list-inside text-zinc-400 text-[11px]">
                              {selectedReel.analysis.retentionPatterns.openLoops.map((l, i) => (
                                <li key={i}>{l}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Editing Characteristics */}
                      <div className="p-4 rounded-xl bg-[#151520] border border-[#242436] space-y-2 text-xs">
                        <span className="font-bold text-zinc-200 block text-xs border-b border-[#242436] pb-1">
                          Editing & Visual Dynamics
                        </span>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                          <div>
                            <span className="text-zinc-500 block">Cut Frequency</span>
                            <span className="text-zinc-200 font-semibold">
                              ~{selectedReel.analysis.editingCharacteristics.shotChangesPerMinute} cuts/min
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">Text Animation</span>
                            <span className="text-zinc-200 font-semibold">
                              {selectedReel.analysis.editingCharacteristics.textAnimation}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">Sound Design</span>
                            <span className="text-zinc-200 font-semibold">
                              {selectedReel.analysis.editingCharacteristics.soundEffectsRole}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">Music Style</span>
                            <span className="text-zinc-200 font-semibold">
                              {selectedReel.analysis.editingCharacteristics.musicStyle}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center rounded-2xl bg-[#111117] border border-dashed border-[#262638]">
                  <p className="text-xs text-zinc-500">Select a reference video from the left to view deep analysis.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PATTERNS KNOWLEDGE BASE */}
        {activeTab === "patterns" && (
          <div className="space-y-6">
            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl bg-[#111117] border border-[#21212e]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search pattern name, description, why it works..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#161622] border border-[#252536] text-xs text-zinc-200 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <select
                value={selectedPatternCategory}
                onChange={(e) => setSelectedPatternCategory(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#161622] border border-[#252536] text-xs text-zinc-300 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="HOOK">Hook Techniques</option>
                <option value="STORY_STRUCTURE">Story Structures</option>
                <option value="RETENTION_LOOP">Retention Loops</option>
                <option value="PAYOFF">Evidence Payoffs</option>
                <option value="PACING">Pacing Patterns</option>
              </select>
            </div>

            {/* Patterns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatterns.map((pat) => (
                <div
                  key={pat.id}
                  className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] hover:border-zinc-500 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1e1e2d] text-zinc-400 font-bold border border-[#2d2d40]">
                        {pat.id}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 font-semibold border border-purple-800/40">
                        {pat.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{pat.name}</h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">{pat.description}</p>

                    <div className="p-3 rounded-xl bg-[#151520] border border-[#232332] text-xs space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                        Psychological Mechanism:
                      </span>
                      <p className="text-[11px] text-zinc-300 italic">{pat.whyItWorks}</p>
                    </div>

                    <div className="text-xs space-y-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                        Example Hook Snippet:
                      </span>
                      <p className="text-xs text-yellow-300 font-medium font-mono bg-[#14141e] p-2.5 rounded-lg border border-[#222230]">
                        &ldquo;{pat.exampleHookOrSnippet}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1d1d28] flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Suitable: {pat.brandSuitability.join(", ") || "All Brands"}</span>
                    <span>{pat.suitableFormats.join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SUBMIT REFERENCE FORM */}
        {activeTab === "submit_analyze" && (
          <div className="max-w-2xl mx-auto rounded-2xl bg-[#111117] border border-[#21212e] p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-white">Submit Reference Reel for Deconstruction</h2>
              <p className="text-xs text-zinc-400">
                Provide public video metadata and accessible transcript to extract structural hooks, retention patterns, and creative blueprints.
              </p>
            </div>

            {analysisError && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs">
                {analysisError}
              </div>
            )}

            <form onSubmit={handleAnalyzeSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none"
                  >
                    <option value="YouTube Shorts">YouTube Shorts</option>
                    <option value="Instagram Reels">Instagram Reels</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Creator Handle</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. tech_lead"
                    value={creatorHandle}
                    onChange={(e) => setCreatorHandle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Public Video URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/shorts/..."
                  value={publicUrl}
                  onChange={(e) => setPublicUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Observed Views</label>
                  <input
                    type="number"
                    value={viewCount}
                    onChange={(e) => setViewCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Creator Followers</label>
                  <input
                    type="number"
                    value={creatorFollowerCount}
                    onChange={(e) => setCreatorFollowerCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Likes</label>
                  <input
                    type="number"
                    value={likeCount}
                    onChange={(e) => setLikeCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Title or Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Why vector databases hallucinate"
                  value={titleOrCaption}
                  onChange={(e) => setTitleOrCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Full Video Spoken Transcript *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Paste complete spoken narration or transcript..."
                  value={transcriptText}
                  onChange={(e) => setTranscriptText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#262638] text-xs text-zinc-200 font-mono focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("database")}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-black transition-all shadow-md hover:brightness-110 disabled:opacity-50"
                  style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
                >
                  {isAnalyzing ? "Extracting Story Mechanics..." : "Deconstruct Reference"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}

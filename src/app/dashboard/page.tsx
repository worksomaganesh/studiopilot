"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { useBrand } from "@/brands/context";
import { ContentProject } from "@/types/project";
import { ResearchDossier } from "@/types/research";
import { CreativePattern } from "@/types/creative-intelligence";
import {
  FolderKanban,
  Compass,
  FileText,
  Film,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { activeBrand } = useBrand();
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [researchRuns, setResearchRuns] = useState<ResearchDossier[]>([]);
  const [patterns, setPatterns] = useState<CreativePattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [projRes, resRes, patRes] = await Promise.all([
          fetch("/api/projects").then((r) => r.json()),
          fetch("/api/research").then((r) => r.json()),
          fetch("/api/creative-intelligence?type=patterns").then((r) => r.json()),
        ]);

        if (projRes.success) setProjects(projRes.projects || []);
        if (resRes.success) setResearchRuns(resRes.researchRuns || []);
        if (patRes.success) setPatterns(patRes.patterns || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Filter projects by active brand
  const brandProjects = projects.filter((p) => p.brandId === activeBrand.id);
  const brandResearch = researchRuns.filter((r) => r.brandId === activeBrand.id);
  const brandPatterns = patterns.filter(
    (p) => !p.brandSuitability.length || p.brandSuitability.includes(activeBrand.id)
  );

  const scriptDraftsCount = brandProjects.filter(
    (p) => p.status === "SCRIPT_DRAFT" || p.status === "SCRIPT_REVIEW"
  ).length;
  const productionCount = brandProjects.filter(
    (p) => p.status === "PRODUCTION_PLANNING" || p.status === "EDITING"
  ).length;

  return (
    <AppShell>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Top Hero Banner with Active Brand Identity */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#14141c] to-[#121218] border border-[#232332] relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-80 h-full opacity-10 pointer-events-none blur-3xl"
            style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
                />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-400">
                  {activeBrand.name} Workspace
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                StudioPilot Command Centre
              </h1>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                {activeBrand.editorialPurpose}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/research"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 transition-all shadow-md hover:brightness-110"
                style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Launch Research</span>
              </a>
              <a
                href="/projects"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-[#1e1e2c] hover:bg-[#28283a] border border-[#2f2f44] flex items-center gap-1.5 transition-all"
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>All Projects</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Systems Pipeline Flow Visualizer */}
        <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-5">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Connected Production Architecture</span>
            <span className="font-mono text-zinc-400">4 Interconnected Systems</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* System 1 */}
            <a
              href="/research"
              className="p-4 rounded-xl bg-[#161622] border border-[#272738] hover:border-zinc-500 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 font-bold border border-blue-800/40">
                  SYSTEM 1
                </span>
                <Compass className="w-4 h-4 text-blue-400 group-hover:rotate-45 transition-transform" />
              </div>
              <h3 className="text-xs font-bold text-zinc-100 group-hover:text-white">
                Research Studio
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                Deep topic investigation with verified Claim-Evidence Matrix & Source Register.
              </p>
              <div className="mt-3 text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                <span>{brandResearch.length} Saved Dossiers</span>
                <ChevronRight className="w-3 h-3 ml-auto text-zinc-600 group-hover:text-white" />
              </div>
            </a>

            {/* System 2 */}
            <a
              href="/creative-intelligence"
              className="p-4 rounded-xl bg-[#161622] border border-[#272738] hover:border-zinc-500 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 font-bold border border-purple-800/40">
                  SYSTEM 2
                </span>
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xs font-bold text-zinc-100 group-hover:text-white">
                Creative Intelligence
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                Shorts/Reels viral pattern extraction, metric snapshots & psychology deconstruction.
              </p>
              <div className="mt-3 text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                <span>{brandPatterns.length} Patterns Active</span>
                <ChevronRight className="w-3 h-3 ml-auto text-zinc-600 group-hover:text-white" />
              </div>
            </a>

            {/* System 3 */}
            <a
              href="/scripts"
              className="p-4 rounded-xl bg-[#161622] border border-[#272738] hover:border-zinc-500 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 font-bold border border-amber-800/40">
                  SYSTEM 3
                </span>
                <FileText className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <h3 className="text-xs font-bold text-zinc-100 group-hover:text-white">
                Script Studio
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                {activeBrand.scriptSystem.name} synthesizing dossiers & patterns into scene scripts.
              </p>
              <div className="mt-3 text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                <span>{scriptDraftsCount} In Review</span>
                <ChevronRight className="w-3 h-3 ml-auto text-zinc-600 group-hover:text-white" />
              </div>
            </a>

            {/* System 4 */}
            <a
              href="/editing"
              className="p-4 rounded-xl bg-[#161622] border border-[#272738] hover:border-zinc-500 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 font-bold border border-emerald-800/40">
                  SYSTEM 4
                </span>
                <Film className="w-4 h-4 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
              </div>
              <h3 className="text-xs font-bold text-zinc-100 group-hover:text-white">
                Editing Studio
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                Production scene plan, DaVinci Resolve EDL manifest & Remotion graphic templates.
              </p>
              <div className="mt-3 text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                <span>{productionCount} In Production</span>
                <ChevronRight className="w-3 h-3 ml-auto text-zinc-600 group-hover:text-white" />
              </div>
            </a>
          </div>
        </div>

        {/* Dashboard Grid: Recent Projects & Creative Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Left: Recent Content Projects */}
          <div className="lg:col-span-2 rounded-2xl bg-[#111117] border border-[#21212e] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-100">
                  Recent Projects — {activeBrand.prefix}
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Shared project management backbone tracking status across systems
                </p>
              </div>
              <a
                href="/projects"
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {brandProjects.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[#151520] border border-dashed border-[#28283a]">
                <FolderKanban className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400 font-medium">No projects created for this brand yet.</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Click &quot;New Project&quot; in the header to create your first content project.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {brandProjects.slice(0, 5).map((project) => (
                  <a
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#161622] border border-[#242436] hover:border-zinc-500 transition-all group"
                  >
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#20202d] text-zinc-300 font-semibold border border-[#313146]">
                          {project.id}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium">
                          {project.targetPlatform} • {project.targetDurationSeconds}s
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white truncate">
                        {project.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#1e1e2c] text-zinc-300 border border-[#2e2e42]">
                        {project.status.replace(/_/g, " ")}
                      </span>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Creative Patterns & Active Research */}
          <div className="space-y-6">
            {/* Creative Patterns Snapshot */}
            <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-zinc-100">
                    Creative Patterns
                  </h3>
                </div>
                <a
                  href="/creative-intelligence"
                  className="text-[11px] text-zinc-400 hover:text-white"
                >
                  Explore
                </a>
              </div>

              <div className="space-y-2">
                {brandPatterns.slice(0, 3).map((pat) => (
                  <div
                    key={pat.id}
                    className="p-2.5 rounded-xl bg-[#161622] border border-[#252536] text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-zinc-200">{pat.name}</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#222230] text-zinc-400">
                        {pat.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">
                      {pat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Editing Identity Quick Specs */}
            <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-zinc-100">
                    Visual Identity
                  </h3>
                </div>
                <a
                  href="/editing"
                  className="text-[11px] text-zinc-400 hover:text-white"
                >
                  Guidelines
                </a>
              </div>

              <div className="p-3 rounded-xl bg-[#161622] border border-[#252536] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-400">Signature Palette:</span>
                  <div className="flex items-center gap-1">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/40"
                      style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
                      title="Primary"
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/40"
                      style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.background }}
                      title="Background"
                    />
                    {activeBrand.editingIdentity.colorPalette.secondary && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/40"
                        style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.secondary }}
                        title="Secondary"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">Export Specs:</span>
                  <span className="font-mono font-semibold text-zinc-200">
                    {activeBrand.editingIdentity.exportSpecs.aspectRatio} • {activeBrand.editingIdentity.exportSpecs.frameRate}fps
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">DaVinci Template:</span>
                  <span className="font-mono text-[10px] text-zinc-300 truncate max-w-[150px]">
                    {activeBrand.editingIdentity.davinciTemplateReference}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

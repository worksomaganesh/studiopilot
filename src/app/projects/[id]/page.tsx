"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { ContentProject, ProjectActivity, ProjectStatus, AssetRecord, PublishingRecord, PerformanceSnapshot } from "@/types/project";
import { ResearchDossier } from "@/types/research";
import { ScriptDocument } from "@/types/script";
import { EditingPlan } from "@/types/editing";
import { getBrandConfig } from "@/brands/config";
import {
  FolderKanban,
  Compass,
  FileText,
  Film,
  Sparkles,
  HardDrive,
  Share2,
  BarChart3,
  History,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Download,
  Copy,
  ExternalLink,
  Plus,
  Play,
  Layers,
  Check,
} from "lucide-react";

type TabKey =
  | "overview"
  | "research"
  | "creative_refs"
  | "scripts"
  | "editing"
  | "assets"
  | "publishing"
  | "analytics"
  | "activity";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [project, setProject] = useState<ContentProject | null>(null);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [researchRuns, setResearchRuns] = useState<ResearchDossier[]>([]);
  const [scripts, setScripts] = useState<ScriptDocument[]>([]);
  const [editingPlans, setEditingPlans] = useState<EditingPlan[]>([]);
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [publishingRecords, setPublishingRecords] = useState<PublishingRecord[]>([]);
  const [performanceSnapshots, setPerformanceSnapshots] = useState<PerformanceSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchProjectDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
        setActivities(data.activities || []);
        setResearchRuns(data.researchRuns || []);
        setScripts(data.scripts || []);
        setEditingPlans(data.editingPlans || []);
        setAssets(data.assets || []);
        setPublishingRecords(data.publishingRecords || []);
        setPerformanceSnapshots(data.performanceSnapshots || []);
      }
    } catch (err) {
      console.error("Failed to load project", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-12 text-center text-xs text-zinc-500">
          Loading project workspace {id}...
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell>
        <div className="p-12 text-center">
          <p className="text-xs text-red-400 font-semibold">Project not found: {id}</p>
          <a
            href="/projects"
            className="mt-4 inline-block px-4 py-2 rounded-xl bg-[#1e1e2c] text-xs font-semibold text-zinc-300"
          >
            Back to Projects
          </a>
        </div>
      </AppShell>
    );
  }

  const brandConfig = getBrandConfig(project.brandId);
  const activeResearch = researchRuns[0];
  const activeScript = scripts.find((s) => s.isApproved) || scripts[0];
  const activeEditingPlan = editingPlans[0];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Top Navigation & Status Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121219] border border-[#21212e]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <a
                href="/projects"
                className="text-zinc-500 hover:text-zinc-200 transition-colors p-1"
                title="Back to Projects"
              >
                <ArrowLeft className="w-4 h-4" />
              </a>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#1e1e2c] text-white font-bold border border-[#2e2e42]">
                {project.id}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 px-2 py-0.5 rounded bg-[#181824] border border-[#282838]">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: brandConfig.editingIdentity.colorPalette.primary }}
                />
                <span>{brandConfig.name}</span>
              </span>
              <span className="text-xs text-zinc-500 font-medium">
                • {project.targetPlatform} ({project.targetDurationSeconds}s)
              </span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              {project.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-[#1e1e2d] text-zinc-200 border border-[#313146]">
              {project.status.replace(/_/g, " ")}
            </span>
            <select
              value={project.status}
              onChange={async (e) => {
                const newStatus = e.target.value as ProjectStatus;
                await fetch(`/api/projects/${project.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status: newStatus }),
                });
                fetchProjectDetails();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#171724] border border-[#2a2a3e] text-xs text-zinc-300 focus:outline-none"
            >
              <option value="INBOX">Inbox</option>
              <option value="RESEARCHING">Researching</option>
              <option value="RESEARCH_COMPLETE">Research Complete</option>
              <option value="SCRIPT_DRAFT">Script Draft</option>
              <option value="SCRIPT_REVIEW">Script Review</option>
              <option value="SCRIPT_APPROVED">Script Approved</option>
              <option value="PRODUCTION_PLANNING">Production Planning</option>
              <option value="EDITING">Editing</option>
              <option value="REVIEW">Review</option>
              <option value="READY_TO_PUBLISH">Ready to Publish</option>
              <option value="PUBLISHED">Published</option>
              <option value="ANALYSED">Analysed</option>
            </select>
          </div>
        </div>

        {/* 9 Tabs Header Navigation */}
        <div className="flex items-center gap-1.5 border-b border-[#21212e] pb-1 overflow-x-auto">
          {[
            { key: "overview", label: "Overview", icon: FolderKanban },
            { key: "research", label: `Research (${researchRuns.length})`, icon: Compass },
            { key: "creative_refs", label: "Creative References", icon: Sparkles },
            { key: "scripts", label: `Scripts (${scripts.length})`, icon: FileText },
            { key: "editing", label: `Editing (${editingPlans.length})`, icon: Film },
            { key: "assets", label: `Assets (${assets.length})`, icon: HardDrive },
            { key: "publishing", label: `Publishing (${publishingRecords.length})`, icon: Share2 },
            { key: "analytics", label: `Analytics (${performanceSnapshots.length})`, icon: BarChart3 },
            { key: "activity", label: `Activity (${activities.length})`, icon: History },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-semibold transition-all shrink-0 border-b-2 ${
                  isActive
                    ? "bg-[#161622] text-white border-zinc-200"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-[#121219] border-transparent"
                }`}
                style={
                  isActive
                    ? { borderBottomColor: brandConfig.editingIdentity.colorPalette.primary }
                    : undefined
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Concept & Platform Specs */}
              <div className="md:col-span-2 p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Concept Metadata
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Concept Name</span>
                    <span className="text-zinc-200 font-semibold">{project.conceptName}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Target Audience</span>
                    <span className="text-zinc-200 font-semibold">{project.targetAudienceLevel}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Target Platform</span>
                    <span className="text-zinc-200 font-semibold">{project.targetPlatform}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Target Duration</span>
                    <span className="text-zinc-200 font-semibold">{project.targetDurationSeconds} seconds</span>
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 text-xs block mb-1">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181824] text-zinc-300 border border-[#28283a]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Brand Guidelines Quick View */}
              <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Brand Editorial Directives
                </h3>
                <div className="text-xs space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#151520] border border-[#242436]">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Research Mode</span>
                    <span className="font-semibold text-zinc-200">{brandConfig.researchMode.name}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#151520] border border-[#242436]">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Script System</span>
                    <span className="font-semibold text-zinc-200">{brandConfig.scriptSystem.name}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#151520] border border-[#242436]">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Tone & Pacing</span>
                    <span className="text-zinc-300">{brandConfig.scriptSystem.tone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions to trigger next stage */}
            <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Pipeline Progression
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setActiveTab("research")}
                  className="p-3.5 rounded-xl bg-[#161622] border border-[#272738] hover:border-zinc-400 text-left transition-all"
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-zinc-200 mb-1">
                    <Compass className="w-4 h-4 text-blue-400" />
                    <span>Research Dossier</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {activeResearch ? "View verified claims and sources" : "Execute deep web research"}
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab("scripts")}
                  className="p-3.5 rounded-xl bg-[#161622] border border-[#272738] hover:border-zinc-400 text-left transition-all"
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-zinc-200 mb-1">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Script Development</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {activeScript ? `v${activeScript.version} ready for review` : "Generate brand-specific script"}
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab("editing")}
                  className="p-3.5 rounded-xl bg-[#161622] border border-[#272738] hover:border-zinc-400 text-left transition-all"
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-zinc-200 mb-1">
                    <Film className="w-4 h-4 text-emerald-400" />
                    <span>Editing Plan & DaVinci</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {activeEditingPlan ? "Export EDL & Remotion manifests" : "Generate scene editing plan"}
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESEARCH */}
        {activeTab === "research" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Research Dossier & Verification</h2>
                <p className="text-xs text-zinc-400">
                  Brand-aligned web research with verified Claim-Evidence Matrix
                </p>
              </div>

              <a
                href={`/research?projectId=${project.id}&brandId=${project.brandId}&concept=${encodeURIComponent(project.conceptName)}&topic=${encodeURIComponent(project.title)}`}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 transition-all shadow-md hover:brightness-110"
                style={{ backgroundColor: brandConfig.editingIdentity.colorPalette.primary }}
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>New Research Run</span>
              </a>
            </div>

            {!activeResearch ? (
              <div className="p-12 text-center rounded-2xl bg-[#111117] border border-dashed border-[#262638]">
                <Compass className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-xs text-zinc-300 font-semibold">No research dossier linked yet</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Launch a research run using the button above to perform genuine web search and build the Claim-Evidence matrix.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Executive Overview Card */}
                <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Executive Overview
                    </h3>
                    <button
                      onClick={() => copyToClipboard(activeResearch.rawMarkdown || activeResearch.executiveOverview, "dossier")}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1a1a26] text-[11px] text-zinc-300 hover:text-white"
                    >
                      {copiedText === "dossier" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === "dossier" ? "Copied" : "Copy Markdown"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {activeResearch.executiveOverview}
                  </p>
                </div>

                {/* Claim-Evidence Matrix */}
                <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Claim-Evidence Matrix ({activeResearch.claimEvidenceMatrix.length} Verified Claims)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#21212e] text-zinc-500 font-mono text-[10px] uppercase">
                          <th className="py-2.5 px-3">Claim ID</th>
                          <th className="py-2.5 px-3">Claim</th>
                          <th className="py-2.5 px-3">Supporting Source</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Evidence / Quote</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1c1c28]">
                        {activeResearch.claimEvidenceMatrix.map((c) => (
                          <tr key={c.id} className="hover:bg-[#14141e] transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-zinc-400">{c.id}</td>
                            <td className="py-2.5 px-3 font-medium text-zinc-200 max-w-xs">{c.claim}</td>
                            <td className="py-2.5 px-3">
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
                            <td className="py-2.5 px-3">
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
                            <td className="py-2.5 px-3 text-zinc-400 text-[11px] italic max-w-sm">
                              &ldquo;{c.quoteOrEvidence}&rdquo;
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Source Register */}
                <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Source Citation Register ({activeResearch.sourceRegister.length} Primary Documents)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeResearch.sourceRegister.map((s, idx) => (
                      <a
                        key={s.id || idx}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl bg-[#161622] border border-[#252536] hover:border-zinc-400 transition-all text-xs group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-zinc-200 group-hover:text-white truncate max-w-[200px]">
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
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CREATIVE REFERENCES */}
        {activeTab === "creative_refs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Creative References & Patterns</h2>
                <p className="text-xs text-zinc-400">
                  Viral short-form blueprints informing this project&apos;s pacing and retention
                </p>
              </div>
              <a
                href="/creative-intelligence"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-300 bg-[#1e1e2c] hover:bg-[#28283a] border border-[#2f2f44] flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Pattern Library</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Applicable Storytelling Patterns
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#161622] border border-[#252536]">
                    <div className="flex items-center justify-between font-bold text-zinc-200 mb-1">
                      <span>Contrarian Opening (CP-001)</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-400">
                        HOOK
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Directly confronts baseline assumption in first 3 seconds, triggering immediate cognitive pause.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#161622] border border-[#252536]">
                    <div className="flex items-center justify-between font-bold text-zinc-200 mb-1">
                      <span>Evidence-Led Payoff (CP-010)</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400">
                        PAYOFF
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Concludes with verified research citation or blueprint rather than generic advice.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Target Platform Dynamics
                </h3>
                <div className="p-3 rounded-xl bg-[#161622] border border-[#252536] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Format:</span>
                    <span className="font-semibold text-zinc-200">{project.targetPlatform} (9:16)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Target Duration:</span>
                    <span className="font-semibold text-zinc-200">{project.targetDurationSeconds} seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Retention Threshold:</span>
                    <span className="font-semibold text-emerald-400">Aim for &gt;70% completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SCRIPTS */}
        {activeTab === "scripts" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Script Development & Scene Breakdown</h2>
                <p className="text-xs text-zinc-400">
                  {brandConfig.scriptSystem.name} adhering to {brandConfig.name} guidelines
                </p>
              </div>

              <a
                href={`/scripts?projectId=${project.id}`}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 transition-all shadow-md hover:brightness-110"
                style={{ backgroundColor: brandConfig.editingIdentity.colorPalette.primary }}
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Generate Script Draft</span>
              </a>
            </div>

            {!activeScript ? (
              <div className="p-12 text-center rounded-2xl bg-[#111117] border border-dashed border-[#262638]">
                <FileText className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-xs text-zinc-300 font-semibold">No script generated yet</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Ensure research is completed, then generate a script draft adhering to brand writing rules.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Script Approval Banner */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#161622] border border-[#272738]">
                  <div className="flex items-center gap-2">
                    {activeScript.isApproved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-400" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-zinc-100 block">
                        {activeScript.isApproved ? "Approved Script v1" : "Script Draft in Review"}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        {activeScript.isApproved
                          ? "Approved for Production & Editing Studio"
                          : "Review narration, hook alternatives, and scene timings"}
                      </span>
                    </div>
                  </div>

                  {!activeScript.isApproved && (
                    <button
                      onClick={async () => {
                        await fetch("/api/scripts", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "approve", scriptId: activeScript.id }),
                        });
                        fetchProjectDetails();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-md"
                    >
                      Approve Script
                    </button>
                  )}
                </div>

                {/* Hook Alternatives */}
                <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Hook Alternatives ({activeScript.hookAlternatives.length} Angles)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {activeScript.hookAlternatives.map((h) => (
                      <div
                        key={h.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                          h.isRecommended
                            ? "bg-[#181826] border-zinc-400"
                            : "bg-[#14141e] border-[#242436]"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-zinc-300">
                          <span>{h.technique}</span>
                          {h.isRecommended && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white font-medium">&ldquo;{h.hookText}&rdquo;</p>
                        <p className="text-[10px] text-zinc-500">{h.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scene-by-Scene Breakdown */}
                <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Scene Breakdown & Production Directions
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#21212e] text-zinc-500 font-mono text-[10px] uppercase">
                          <th className="py-2.5 px-3">Scene</th>
                          <th className="py-2.5 px-3">Narration (Voiceover)</th>
                          <th className="py-2.5 px-3">Visual Direction</th>
                          <th className="py-2.5 px-3">Motion / Graphics</th>
                          <th className="py-2.5 px-3">On-Screen Text</th>
                          <th className="py-2.5 px-3">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1c1c28]">
                        {activeScript.scenes.map((sc) => (
                          <tr key={sc.sceneNumber} className="hover:bg-[#14141e] transition-colors">
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
              </div>
            )}
          </div>
        )}

        {/* TAB 5: EDITING */}
        {activeTab === "editing" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Production Editing Studio</h2>
                <p className="text-xs text-zinc-400">
                  Scene editing plans, DaVinci Resolve EDL export, and Remotion visual templates
                </p>
              </div>

              {activeScript && (
                <button
                  onClick={async () => {
                    await fetch("/api/editing", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ scriptId: activeScript.id, projectId: project.id }),
                    });
                    fetchProjectDetails();
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 transition-all shadow-md hover:brightness-110"
                  style={{ backgroundColor: brandConfig.editingIdentity.colorPalette.primary }}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Generate Editing Plan</span>
                </button>
              )}
            </div>

            {!activeEditingPlan ? (
              <div className="p-12 text-center rounded-2xl bg-[#111117] border border-dashed border-[#262638]">
                <Film className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-xs text-zinc-300 font-semibold">No production editing plan generated</p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Ensure a script is generated and click &quot;Generate Editing Plan&quot; to build the DaVinci timeline manifest.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Export Action Card */}
                <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">
                      DaVinci Resolve & Remotion Production Manifest
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Export CMX 3600 EDL, timeline CSV, or Remotion scene configuration
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const blob = new Blob([activeEditingPlan.davinciResolveExport.edlText], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${project.id}_Timeline.edl`;
                        a.click();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#1d1d2b] hover:bg-[#28283a] text-zinc-200 border border-[#313146] text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .EDL</span>
                    </button>

                    <button
                      onClick={() => {
                        const blob = new Blob([activeEditingPlan.davinciResolveExport.csvManifest], { type: "text/csv" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${project.id}_Manifest.csv`;
                        a.click();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#1d1d2b] hover:bg-[#28283a] text-zinc-200 border border-[#313146] text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .CSV</span>
                    </button>
                  </div>
                </div>

                {/* Scene Editing Plan Table */}
                <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Scene Production Manifest
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#21212e] text-zinc-500 font-mono text-[10px] uppercase">
                          <th className="py-2.5 px-3">Scene</th>
                          <th className="py-2.5 px-3">Narration</th>
                          <th className="py-2.5 px-3">Visual Direction</th>
                          <th className="py-2.5 px-3">Motion</th>
                          <th className="py-2.5 px-3">Required Assets</th>
                          <th className="py-2.5 px-3">Sound Cue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1c1c28]">
                        {activeEditingPlan.scenes.map((s) => (
                          <tr key={s.sceneNumber} className="hover:bg-[#14141e] transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-zinc-300">#{s.sceneNumber}</td>
                            <td className="py-3 px-3 font-medium text-zinc-100 max-w-xs">{s.narration}</td>
                            <td className="py-3 px-3 text-zinc-300 max-w-xs">{s.visualDirection}</td>
                            <td className="py-3 px-3 text-zinc-400 text-[11px]">{s.motion}</td>
                            <td className="py-3 px-3 text-zinc-400 text-[10px]">
                              {s.requiredAssets.join(", ")}
                            </td>
                            <td className="py-3 px-3 font-mono text-[10px] text-emerald-400">{s.soundCue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: ASSETS */}
        {activeTab === "assets" && (
          <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Project Asset Manifest ({assets.length} items)
            </h3>
            {assets.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4">No dedicated media assets uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {assets.map((a) => (
                  <div key={a.id} className="p-3 rounded-xl bg-[#161622] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-zinc-200">{a.title}</span>
                      <span className="text-zinc-500 ml-2 font-mono text-[10px]">[{a.type}]</span>
                    </div>
                    <span className="text-zinc-400 text-[11px]">{a.license}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: PUBLISHING */}
        {activeTab === "publishing" && (
          <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Distribution & Publishing Records
            </h3>
            <p className="text-xs text-zinc-400">
              Track platform schedules, captions, hashtags, and published URLs.
            </p>
          </div>
        )}

        {/* TAB 8: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Post-Production Performance Review
            </h3>
            <p className="text-xs text-zinc-400">
              Track historical view retention, 3-second hook conversion, and audience engagement over time.
            </p>
          </div>
        )}

        {/* TAB 9: ACTIVITY */}
        {activeTab === "activity" && (
          <div className="p-5 rounded-2xl bg-[#111117] border border-[#21212e] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Project Audit History ({activities.length} Entries)
            </h3>
            <div className="space-y-2">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl bg-[#151520] border border-[#232332] text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold text-zinc-400 block mb-0.5">
                      {act.action}
                    </span>
                    <span className="text-zinc-200">{act.description}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                    {new Date(act.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

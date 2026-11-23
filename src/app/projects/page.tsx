"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { useBrand } from "@/brands/context";
import { ContentProject, ProjectStatus } from "@/types/project";
import { BRAND_LIST } from "@/brands/config";
import { BrandId } from "@/types/brand";
import {
  FolderKanban,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { NewProjectModal } from "@/components/projects/NewProjectModal";

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Inbox", value: "INBOX" },
  { label: "Researching", value: "RESEARCHING" },
  { label: "Research Complete", value: "RESEARCH_COMPLETE" },
  { label: "Script Draft", value: "SCRIPT_DRAFT" },
  { label: "Script Approved", value: "SCRIPT_APPROVED" },
  { label: "Production Planning", value: "PRODUCTION_PLANNING" },
  { label: "Editing", value: "EDITING" },
  { label: "Ready to Publish", value: "READY_TO_PUBLISH" },
  { label: "Published", value: "PUBLISHED" },
];

export default function ProjectsPage() {
  const { activeBrand } = useBrand();
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    if (selectedBrandFilter !== "ALL" && p.brandId !== selectedBrandFilter) {
      return false;
    }
    if (selectedStatusFilter !== "ALL" && p.status !== selectedStatusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(query);
      const matchConcept = p.conceptName.toLowerCase().includes(query);
      const matchId = p.id.toLowerCase().includes(query);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(query));
      if (!matchTitle && !matchConcept && !matchId && !matchTags) {
        return false;
      }
    }
    return true;
  });

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-zinc-400" />
              <span>Content Projects</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Central creative project registry connecting Research, Creative Intelligence, Scripts, and Editing.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 transition-all shadow-md hover:brightness-110 self-start sm:self-auto"
            style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Project</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-[#111117] border border-[#21212e]">
          {/* Search input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, ID, concept, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#161622] border border-[#252536] text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
            />
          </div>

          {/* Brand Filter */}
          <div>
            <select
              value={selectedBrandFilter}
              onChange={(e) => setSelectedBrandFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#252536] text-xs text-zinc-300 focus:outline-none focus:border-zinc-400"
            >
              <option value="ALL">All Brands</option>
              {BRAND_LIST.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.prefix})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#252536] text-xs text-zinc-300 focus:outline-none focus:border-zinc-400"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Records Table / Cards */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-zinc-500">
            Loading project registry...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#111117] border border-dashed border-[#262638]">
            <FolderKanban className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-xs text-zinc-300 font-semibold">No content projects match criteria</p>
            <p className="text-[11px] text-zinc-500 mt-1">
              Adjust your filters or initialize a new project using the button above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project) => {
              const brand = BRAND_LIST.find((b) => b.id === project.brandId);
              return (
                <a
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-[#121219] border border-[#222230] hover:border-zinc-500 transition-all group gap-4"
                >
                  <div className="space-y-1.5 min-w-0 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1e1e2c] text-white font-bold border border-[#2e2e42]">
                        {project.id}
                      </span>
                      {brand && (
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 px-2 py-0.5 rounded bg-[#181824] border border-[#282838]">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: brand.editingIdentity.colorPalette.primary }}
                          />
                          <span>{brand.prefix}</span>
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {project.targetPlatform} • {project.targetDurationSeconds}s • {project.targetAudienceLevel}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-100 group-hover:text-white truncate">
                      {project.title}
                    </h3>

                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#181822] text-zinc-400 border border-[#232332]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1f1f2c]">
                    <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#1b1b28] text-zinc-200 border border-[#2d2d40]">
                      {project.status.replace(/_/g, " ")}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <NewProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onProjectCreated={() => fetchProjects()}
        />
      </div>
    </AppShell>
  );
}

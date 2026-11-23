"use client";

import React, { useState } from "react";
import { useBrand } from "@/brands/context";
import { BRAND_LIST } from "@/brands/config";
import { BrandId } from "@/types/brand";
import { X, Sparkles, FolderPlus } from "lucide-react";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (project: any) => void;
}

export function NewProjectModal({ isOpen, onClose, onProjectCreated }: NewProjectModalProps) {
  const { activeBrand } = useBrand();
  const [brandId, setBrandId] = useState<BrandId>(activeBrand.id);
  const [conceptName, setConceptName] = useState("");
  const [title, setTitle] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("YouTube Shorts");
  const [targetDurationSeconds, setTargetDurationSeconds] = useState(60);
  const [targetAudienceLevel, setTargetAudienceLevel] = useState("Intermediate");
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !conceptName.trim()) {
      setError("Concept name and project title are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId,
          conceptName: conceptName.trim(),
          title: title.trim(),
          targetPlatform,
          targetDurationSeconds: Number(targetDurationSeconds),
          targetAudienceLevel,
          tags,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      if (onProjectCreated) {
        onProjectCreated(data.project);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-[#111117] border border-[#262636] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222230] bg-[#14141d]">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-zinc-300" />
            <h3 className="text-sm font-bold text-zinc-100">Create Content Project</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-[#20202d] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          {/* Brand Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
              Brand Workspace
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BRAND_LIST.map((b) => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setBrandId(b.id)}
                  className={`px-3 py-2 rounded-xl text-left border transition-all text-xs ${
                    brandId === b.id
                      ? "border-zinc-400 bg-[#222230] text-white shadow-sm"
                      : "border-[#252535] bg-[#15151e] text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-0.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: b.editingIdentity.colorPalette.primary }}
                    />
                    <span className="truncate">{b.prefix}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">{b.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Concept Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Concept Name
            </label>
            <input
              type="text"
              placeholder="e.g. Feature Engineering, Multi-Agent Customer Support"
              value={conceptName}
              onChange={(e) => setConceptName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#272738] text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all"
            />
          </div>

          {/* Exact Project Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Exact Topic / Working Title
            </label>
            <input
              type="text"
              placeholder="e.g. What is Feature Engineering and why does it make or break ML?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#272738] text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-all"
            />
          </div>

          {/* Platform & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Target Platform
              </label>
              <select
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#272738] text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
              >
                <option value="YouTube Shorts">YouTube Shorts (9:16)</option>
                <option value="Instagram Reels">Instagram Reels (9:16)</option>
                <option value="TikTok">TikTok (9:16)</option>
                <option value="Cross-Platform">Cross-Platform Vertical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Target Duration (Seconds)
              </label>
              <input
                type="number"
                min={15}
                max={180}
                value={targetDurationSeconds}
                onChange={(e) => setTargetDurationSeconds(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#272738] text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          {/* Audience Level */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Audience Knowledge Level
            </label>
            <select
              value={targetAudienceLevel}
              onChange={(e) => setTargetAudienceLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#272738] text-xs text-zinc-200 focus:outline-none focus:border-zinc-500"
            >
              <option value="Beginner">Beginner (Foundational & Relatable)</option>
              <option value="Intermediate">Intermediate (Practicing Engineers / Founders)</option>
              <option value="Advanced">Advanced (Deep Technical / Mathematical)</option>
              <option value="Executive / General">Executive / Strategic General Audience</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Tags (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. AI, Python, Agents, Enterprise"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#161622] border border-[#272738] text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#222230]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-[#1a1a24] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-black transition-all hover:brightness-110 shadow-lg disabled:opacity-50"
              style={{ backgroundColor: activeBrand.editingIdentity.colorPalette.primary }}
            >
              {isSubmitting ? "Creating Project..." : "Initialize Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

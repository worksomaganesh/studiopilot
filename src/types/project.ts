import { BrandId } from "./brand";

export type ProjectStatus =
  | "INBOX"
  | "RESEARCHING"
  | "RESEARCH_COMPLETE"
  | "SCRIPT_DRAFT"
  | "SCRIPT_REVIEW"
  | "SCRIPT_APPROVED"
  | "PRODUCTION_PLANNING"
  | "EDITING"
  | "REVIEW"
  | "READY_TO_PUBLISH"
  | "PUBLISHED"
  | "ANALYSED";

export interface ContentProject {
  id: string; // e.g. "TES-2026-001"
  brandId: BrandId;
  title: string;
  conceptName: string;
  status: ProjectStatus;
  targetPlatform: "YouTube Shorts" | "Instagram Reels" | "TikTok" | "Cross-Platform";
  targetDurationSeconds: number; // e.g. 60
  targetAudienceLevel: "Beginner" | "Intermediate" | "Advanced" | "Executive / General";
  createdAt: string;
  updatedAt: string;
  approvedScriptId?: string;
  activeResearchRunId?: string;
  activeEditingPlanId?: string;
  tags: string[];
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  action: string;
  description: string;
  previousStatus?: ProjectStatus;
  newStatus?: ProjectStatus;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface AssetRecord {
  id: string;
  projectId: string;
  title: string;
  type: "B_ROLL" | "VOICEOVER" | "MUSIC" | "SFX" | "GRAPHIC" | "SCREEN_RECORDING" | "CODE_SNIPPET";
  fileUrl?: string;
  storagePath?: string;
  license: string;
  sourceUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface PublishingRecord {
  id: string;
  projectId: string;
  platform: "YouTube" | "Instagram" | "TikTok" | "LinkedIn" | "Twitter/X";
  publishedUrl?: string;
  scheduledTime?: string;
  publishedTime?: string;
  captionText: string;
  hashtags: string[];
  thumbnailUrl?: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "FAILED";
}

export interface PerformanceSnapshot {
  id: string;
  projectId: string;
  platform: string;
  observedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  retentionAt3sPercent?: number;
  averageWatchPercent?: number;
  dataSource: "Official API" | "Publicly observed" | "Manually submitted" | "Estimated";
  notes?: string;
}

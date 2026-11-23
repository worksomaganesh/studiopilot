import { BrandId } from "./brand";

export type MetricDataSource =
  | "Official API data"
  | "Publicly observed data"
  | "Manually submitted data"
  | "Estimated or unavailable data";

export interface ReelMetricSnapshot {
  id: string;
  reelId: string;
  observedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount?: number;
  creatorFollowersAtObservation?: number;
  viewToFollowerRatio?: number;
  dataSource: MetricDataSource;
}

export interface CreativePattern {
  id: string; // e.g. "CP-001"
  name: string;
  category: "HOOK" | "STORY_STRUCTURE" | "RETENTION_LOOP" | "PAYOFF" | "PACING";
  description: string;
  whyItWorks: string;
  bestUseCases: string[];
  suitableFormats: ("Shorts" | "Reels" | "TikTok" | "Long-Form")[];
  potentialLimitations: string[];
  brandSuitability: BrandId[];
  exampleHookOrSnippet: string;
  sourceReferenceIds: string[];
  createdAt: string;
}

export interface CreativeReel {
  id: string;
  platform: "YouTube Shorts" | "Instagram Reels" | "TikTok";
  publicUrl: string;
  creatorHandle: string;
  creatorName?: string;
  creatorFollowerCount?: number;
  titleOrCaption: string;
  videoDurationSeconds: number;
  publishedDate?: string;
  niche: string;
  transcriptText?: string;
  transcriptLanguage?: string;
  notes?: string;
  tags: string[];
  latestMetrics: ReelMetricSnapshot;
  metricHistory: ReelMetricSnapshot[];
  analysis?: ReelAnalysis;
  linkedPatternIds: string[];
  createdAt: string;
}

export interface ReelAnalysis {
  id: string;
  reelId: string;
  analyzedAt: string;
  hookAnalysis: {
    firstSpokenSentence: string;
    firstVisual: string;
    onScreenText: string;
    curiosityGap: string;
    openingTechnique: string;
    hookCategory: string;
  };
  scriptStructure: {
    introduction: string;
    problemOrQuestion: string;
    context: string;
    informationProgression: string;
    storytellingPattern: string;
    payoff: string;
    callToAction: string;
  };
  retentionPatterns: {
    openLoops: string[];
    curiosityResets: string[];
    patternInterrupts: string[];
    pacingAssessment: string;
    informationDensity: "High" | "Medium" | "Low";
    sceneTransitions: string[];
  };
  editingCharacteristics: {
    shotChangesPerMinute: number;
    textAnimation: string;
    typographyStyle: string;
    visualMetaphors: string[];
    bRollUsage: string;
    screenRecordings: boolean;
    soundEffectsRole: string;
    musicStyle: string;
    transitionBehavior: string;
  };
  performanceContext: {
    viewCount: number;
    followerCount?: number;
    viewToFollowerRatio?: number;
    engagementRatePercent?: number;
    relativePerformanceAssessment: string;
  };
  extractedPatternSuggestions: string[];
}

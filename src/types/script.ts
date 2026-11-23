import { BrandId } from "./brand";

export interface ScriptScene {
  sceneNumber: number;
  narration: string;
  visualDirection: string;
  motionDirection: string;
  onScreenText: string;
  estimatedDurationSeconds: number;
  bRollSuggestions: string[];
  motionGraphicSuggestions: string[];
  referencedClaimIds: string[];
}

export interface HookAlternative {
  id: string;
  hookText: string;
  technique: string;
  reasoning: string;
  targetEmotion: string;
  isRecommended: boolean;
}

export interface ScriptQualityEvaluation {
  overallScore: number; // 1-100
  disclaimer: string; // "Editorial assistance only. Not a predictive guarantee of platform performance."
  criteria: {
    hookClarity: { score: number; feedback: string };
    audienceRelevance: { score: number; feedback: string };
    narrativeProgression: { score: number; feedback: string };
    informationClarity: { score: number; feedback: string };
    originality: { score: number; feedback: string };
    retentionPotential: { score: number; feedback: string };
    researchAccuracy: { score: number; feedback: string };
    brandAlignment: { score: number; feedback: string };
    payoffQuality: { score: number; feedback: string };
    durationSuitability: { score: number; feedback: string };
  };
  keyStrengths: string[];
  suggestedImprovements: string[];
}

export interface ScriptDocument {
  id: string;
  projectId?: string;
  brandId: BrandId;
  researchDossierId?: string;
  title: string;
  version: number;
  isApproved: boolean;
  approvedAt?: string;
  targetPlatform: string;
  targetDurationSeconds: number;
  selectedPatternIds: string[];
  hookAlternatives: HookAlternative[];
  selectedHookId: string;
  fullNarration: string;
  scenes: ScriptScene[];
  evaluation: ScriptQualityEvaluation;
  createdAt: string;
  updatedAt: string;
}

export interface ScriptVersionHistory {
  id: string;
  scriptDocumentId: string;
  versionNumber: number;
  summaryOfChanges: string;
  snapshot: ScriptDocument;
  createdAt: string;
}

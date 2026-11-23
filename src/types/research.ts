import { BrandId } from "./brand";

export interface ResearchRequest {
  id?: string;
  projectId?: string;
  brandId: BrandId;
  conceptName: string;
  exactTopic: string;
  subtopics: string[];
  targetAudience?: string;
  knowledgeLevel?: "Beginner" | "Intermediate" | "Advanced" | "Executive";
  targetPlatform?: string;
  desiredDuration?: string;
  additionalInstructions?: string;
  preferredSourceTypes?: string[];
}

export interface ResearchSource {
  id: string;
  runId: string;
  title: string;
  url: string;
  publisher?: string;
  publishedDate?: string;
  snippet?: string;
  credibilityScore?: number; // 1-10
  isPrimarySource: boolean;
  retrievedAt: string;
}

export interface ResearchClaim {
  id: string; // e.g. "CLM-001"
  runId: string;
  claim: string;
  subtopicIndex: number;
  subtopicTitle: string;
  supportingSourceId: string;
  supportingSourceUrl: string;
  supportingSourceTitle: string;
  verificationStatus: "VERIFIED" | "CORROBORATED" | "UNCONFIRMED" | "DISPUTED";
  quoteOrEvidence: string;
}

export interface SubtopicInvestigation {
  title: string;
  question: string;
  explanation: string;
  mechanisms: string[];
  practicalExamples: string[];
  visualOpportunities: string[];
  misconceptions: string[];
  limitations: string[];
}

export interface ResearchDossier {
  id: string;
  projectId?: string;
  brandId: BrandId;
  version: number;
  conceptName: string;
  exactTopic: string;
  createdAt: string;
  executiveOverview: string;
  conceptDefinition: string;
  backgroundAndFundamentals: string;
  subtopics: SubtopicInvestigation[];
  stepByStepMechanisms: string[];
  examplesAndUseCases: string[];
  importantTechnicalDetails: string[];
  comparisons: { subject: string; points: string[] }[];
  visualisationOpportunities: string[];
  misconceptions: string[];
  limitations: string[];
  claimEvidenceMatrix: ResearchClaim[];
  sourceRegister: ResearchSource[];
  researchGapsAndUncertainty: string[];
  suggestedFollowUpQuestions: string[];
  rawMarkdown?: string;
}

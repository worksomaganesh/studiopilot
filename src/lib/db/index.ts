import fs from "fs";
import path from "path";
import { ContentProject, ProjectActivity, ProjectStatus, AssetRecord, PublishingRecord, PerformanceSnapshot } from "@/types/project";
import { ResearchDossier } from "@/types/research";
import { CreativePattern, CreativeReel } from "@/types/creative-intelligence";
import { ScriptDocument, ScriptVersionHistory } from "@/types/script";
import { EditingPlan } from "@/types/editing";
import { BrandId } from "@/types/brand";
import { BRANDS } from "@/brands/config";

// Local storage path for offline / dev resilience
const DATA_DIR = path.join(process.cwd(), "data");
const STORAGE_FILE = path.join(DATA_DIR, "storage.json");
const EXAMPLE_STORAGE_FILE = path.join(DATA_DIR, "storage.example.json");

interface StorageSchema {
  projects: ContentProject[];
  activities: ProjectActivity[];
  researchRuns: ResearchDossier[];
  patterns: CreativePattern[];
  reels: CreativeReel[];
  scripts: ScriptDocument[];
  scriptVersions: ScriptVersionHistory[];
  editingPlans: EditingPlan[];
  assets: AssetRecord[];
  publishingRecords: PublishingRecord[];
  performanceSnapshots: PerformanceSnapshot[];
}

function ensureDataFile(): StorageSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORAGE_FILE)) {
    if (fs.existsSync(EXAMPLE_STORAGE_FILE)) {
      try {
        const exampleRaw = fs.readFileSync(EXAMPLE_STORAGE_FILE, "utf8");
        const parsed = JSON.parse(exampleRaw);
        fs.writeFileSync(STORAGE_FILE, JSON.stringify(parsed, null, 2), "utf8");
        return parsed;
      } catch {
        // Fall back to built-in seed state below
      }
    }

    // Initial sample seed state
    const initialData: StorageSchema = {
      projects: [
        {
          id: "TES-2026-001",
          brandId: "TECHENIGMASTUDIOS",
          title: "What is Feature Engineering and Why Does It Make or Break Machine Learning?",
          conceptName: "Feature Engineering",
          status: "RESEARCH_COMPLETE",
          targetPlatform: "YouTube Shorts",
          targetDurationSeconds: 60,
          targetAudienceLevel: "Intermediate",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ["Machine Learning", "Data Science", "Feature Engineering"],
        },
        {
          id: "ATW-2026-001",
          brandId: "AI_THAT_WORKS",
          title: "Automating Customer Support Triage with Local Multi-Agent LLMs",
          conceptName: "Customer Support Agent Workflow",
          status: "INBOX",
          targetPlatform: "Instagram Reels",
          targetDurationSeconds: 60,
          targetAudienceLevel: "Intermediate",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ["Customer Support", "Agents", "Enterprise AI"],
        },
        {
          id: "CA-2026-001",
          brandId: "CONTXT_AHEAD",
          title: "The High-NA EUV Foundry War: ASML, TSMC, and the $400M Scanner",
          conceptName: "High-NA EUV Lithography",
          status: "SCRIPT_DRAFT",
          targetPlatform: "YouTube Shorts",
          targetDurationSeconds: 60,
          targetAudienceLevel: "Executive / General",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ["Semiconductors", "ASML", "TSMC", "Geopolitics"],
        },
      ],
      activities: [
        {
          id: "act-1",
          projectId: "TES-2026-001",
          action: "PROJECT_CREATED",
          description: "Project initialized in TECHENIGMASTUDIOS brand workspace.",
          newStatus: "INBOX",
          timestamp: new Date().toISOString(),
        },
        {
          id: "act-2",
          projectId: "TES-2026-001",
          action: "RESEARCH_COMPLETED",
          description: "Technical Deep-Dive Dossier generated with verified Claim-Evidence matrix.",
          previousStatus: "RESEARCHING",
          newStatus: "RESEARCH_COMPLETE",
          timestamp: new Date().toISOString(),
        },
      ],
      researchRuns: [
        {
          id: "res-tes-001",
          projectId: "TES-2026-001",
          brandId: "TECHENIGMASTUDIOS",
          version: 1,
          conceptName: "Feature Engineering",
          exactTopic: "What is Feature Engineering and why does it matter in Machine Learning?",
          createdAt: new Date().toISOString(),
          executiveOverview:
            "Feature engineering is the process of using domain knowledge to extract, transform, and select variables from raw tabular, text, or sensor data to maximise model performance and represent underlying physical or business realities.",
          conceptDefinition:
            "The transformation of raw input data columns into high-signal numerical representations that enable mathematical learning algorithms to discern patterns without overfitting.",
          backgroundAndFundamentals:
            "Even the most advanced deep learning architectures cannot learn patterns that are algebraically obscured in raw inputs. While deep neural networks perform automatic feature representation on perceptual data (images, audio), tabular and structured enterprise data continues to rely heavily on explicit, domain-guided feature engineering.",
          subtopics: [
            {
              title: "What exactly is feature engineering?",
              question: "How does it differ from raw data preprocessing?",
              explanation:
                "Feature engineering goes beyond mere missing-value imputation or normalization; it crafts new dimensions that isolate specific interactions.",
              mechanisms: [
                "Domain-specific aggregation (e.g. 7-day rolling transaction average)",
                "Cyclical temporal transformations (sine/cosine hour encoding)",
                "Interaction terms (Ratio of Debt to Monthly Income)",
              ],
              practicalExamples: [
                "Encoding timestamps as sine/cosine waves so 23:59 and 00:01 are mathematically adjacent.",
              ],
              visualOpportunities: [
                "2D scatter plot showing inseparable raw data vs cleanly separable engineered feature axes.",
              ],
              misconceptions: [
                "Deep learning models eliminate the need for tabular feature engineering.",
              ],
              limitations: [
                "High cardinality one-hot encoding can explode feature dimensionality and memory usage.",
              ],
            },
          ],
          stepByStepMechanisms: [
            "1. Raw Data Ingestion & Schema Type Inference",
            "2. Non-linear interaction feature synthesis",
            "3. Outlier and variance threshold filtering",
            "4. Mutual information gain scoring against target",
          ],
          examplesAndUseCases: [
            "Credit risk prediction: Debt-to-income ratio predicts default 4x better than either raw variable alone.",
          ],
          importantTechnicalDetails: [
            "Feature leakage during train/test split: Transformations must be fit strictly on training splits.",
          ],
          comparisons: [
            {
              subject: "Manual Engineering vs Automatic Latent Embeddings",
              points: [
                "Manual features provide full regulatory explainability.",
                "Latent embeddings require 100x more compute and lack direct feature attribution.",
              ],
            },
          ],
          visualisationOpportunities: [
            "TensorBoard embedding projection showing cluster separation after polynomial feature crossing.",
          ],
          misconceptions: [
            "More features always equal better model accuracy.",
          ],
          limitations: [
            "Curse of dimensionality leads to severe model variance if not regularized.",
          ],
          claimEvidenceMatrix: [
            {
              id: "CLM-001",
              runId: "res-tes-001",
              claim:
                "Feature engineering accounts for up to 80% of practical data science project cycle time.",
              subtopicIndex: 0,
              subtopicTitle: "Feature Engineering Overview",
              supportingSourceId: "src-1",
              supportingSourceUrl: "https://www.forbes.com/sites/gilpress/2016/03/23/data-preparation-most-time-consuming-least-enjoyable-data-science-task/",
              supportingSourceTitle: "Forbes: Data Preparation Study",
              verificationStatus: "VERIFIED",
              quoteOrEvidence:
                "Surveys of working data scientists consistently report 80% of effort is spent cleaning and engineering data.",
            },
            {
              id: "CLM-002",
              runId: "res-tes-001",
              claim:
                "Tree-based models (XGBoost, LightGBM) still outperform deep networks on structured tabular datasets when engineered features are present.",
              subtopicIndex: 0,
              subtopicTitle: "Model Architectures & Tabular Data",
              supportingSourceId: "src-2",
              supportingSourceUrl: "https://arxiv.org/abs/2207.08815",
              supportingSourceTitle: "Why do tree-based models still outperform deep learning on tabular data? (NeurIPS 2022)",
              verificationStatus: "CORROBORATED",
              quoteOrEvidence:
                "Benchmark of 45 datasets demonstrates gradient-boosted decision trees maintain superior sample efficiency over tabular neural networks.",
            },
          ],
          sourceRegister: [
            {
              id: "src-1",
              runId: "res-tes-001",
              title: "Forbes: Data Preparation Study",
              url: "https://www.forbes.com/sites/gilpress/2016/03/23/data-preparation-most-time-consuming-least-enjoyable-data-science-task/",
              publisher: "Forbes Media",
              publishedDate: "2016",
              credibilityScore: 8,
              isPrimarySource: false,
              retrievedAt: new Date().toISOString(),
            },
            {
              id: "src-2",
              runId: "res-tes-001",
              title: "Why do tree-based models still outperform deep learning on tabular data? (NeurIPS 2022)",
              url: "https://arxiv.org/abs/2207.08815",
              publisher: "arXiv / NeurIPS",
              publishedDate: "2022-07",
              credibilityScore: 10,
              isPrimarySource: true,
              retrievedAt: new Date().toISOString(),
            },
          ],
          researchGapsAndUncertainty: [
            "Empirical limits of Foundation Models for Tabular Data (e.g. TabPFN v2).",
          ],
          suggestedFollowUpQuestions: [
            "How does TabPFN handle in-context tabular feature learning?",
          ],
        },
      ],
      patterns: [
        {
          id: "CP-001",
          name: "Contrarian Opening",
          category: "HOOK",
          description:
            "Directly confronts and dismantles a widely accepted belief within the first 3 seconds.",
          whyItWorks:
            "Triggers an immediate cognitive dissonance and pattern interrupt in the viewer feed, forcing them to pause to resolve the contradiction.",
          bestUseCases: [
            "Debunking popular AI buzzwords",
            "Challenging bloated cloud architecture",
            "Re-evaluating legacy software practices",
          ],
          suitableFormats: ["Shorts", "Reels", "TikTok"],
          potentialLimitations: [
            "Requires immediate irrefutable proof; without evidence it appears as cheap rage-bait.",
          ],
          brandSuitability: ["TECHENIGMASTUDIOS", "CONTXT_AHEAD"],
          exampleHookOrSnippet:
            "Everything you were taught about gradient descent is wrong when training at scale.",
          sourceReferenceIds: ["REF-001"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "CP-002",
          name: "Curiosity-Driven Question",
          category: "HOOK",
          description:
            "Poses an intriguing, high-stakes question whose answer has immediate practical or strategic value.",
          whyItWorks:
            "Creates an instant open cognitive loop in the viewers working memory that demands closure.",
          bestUseCases: [
            "Technical deep-dives",
            "Market analysis",
            "Architectural comparisons",
          ],
          suitableFormats: ["Shorts", "Reels", "TikTok"],
          potentialLimitations: [
            "The payoff at the end must completely answer the question or viewer retention on future videos drops.",
          ],
          brandSuitability: ["TECHENIGMASTUDIOS", "AI_THAT_WORKS", "CONTXT_AHEAD"],
          exampleHookOrSnippet:
            "Why did NVIDIA spend $500M buying this obscure optical interconnect startup?",
          sourceReferenceIds: ["REF-002"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "CP-003",
          name: "Problem-First Hook",
          category: "HOOK",
          description:
            "Simulates or highlights an acute, visceral operational pain point in the first 2 seconds.",
          whyItWorks:
            "Viewers experiencing this exact friction identify immediately with the narrator and stay for the solution.",
          bestUseCases: [
            "Enterprise workflow automation",
            "Debugging nightmare sessions",
            "Cost reduction tutorials",
          ],
          suitableFormats: ["Shorts", "Reels"],
          potentialLimitations: [
            "Must resonate with the exact target demographic or general audiences will swipe past.",
          ],
          brandSuitability: ["AI_THAT_WORKS"],
          exampleHookOrSnippet:
            "Stop manually copying Stripe invoices into QuickBooks. Your operations team is burning 14 hours a week.",
          sourceReferenceIds: ["REF-003"],
          createdAt: new Date().toISOString(),
        },
      ],
      reels: [
        {
          id: "reel-001",
          platform: "YouTube Shorts",
          publicUrl: "https://www.youtube.com/shorts/sample1",
          creatorHandle: "ai_architect",
          creatorName: "AI Systems Engineering",
          creatorFollowerCount: 45000,
          titleOrCaption: "Why your Vector DB is hallucinating responses",
          videoDurationSeconds: 58,
          publishedDate: "2026-10-15",
          niche: "AI Engineering",
          transcriptText:
            "Stop blaming the LLM for hallucinations. In 90% of production RAG failures, the vector search returned chunks that were semantically close but factually irrelevant...",
          transcriptLanguage: "en",
          tags: ["RAG", "Vector Search", "LLMs"],
          linkedPatternIds: ["CP-001"],
          latestMetrics: {
            id: "met-1",
            reelId: "reel-001",
            observedAt: new Date().toISOString(),
            viewCount: 420000,
            likeCount: 38000,
            commentCount: 1250,
            creatorFollowersAtObservation: 45000,
            viewToFollowerRatio: 9.33,
            dataSource: "Publicly observed data",
          },
          metricHistory: [],
          createdAt: new Date().toISOString(),
        },
      ],
      scripts: [],
      scriptVersions: [],
      editingPlans: [],
      assets: [],
      publishingRecords: [],
      performanceSnapshots: [],
    };

    fs.writeFileSync(STORAGE_FILE, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(STORAGE_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return {
      projects: [],
      activities: [],
      researchRuns: [],
      patterns: [],
      reels: [],
      scripts: [],
      scriptVersions: [],
      editingPlans: [],
      assets: [],
      publishingRecords: [],
      performanceSnapshots: [],
    };
  }
}

function saveStore(data: StorageSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), "utf8");
}

export const db = {
  // --- Projects ---
  getProjects(brandId?: BrandId): ContentProject[] {
    const store = ensureDataFile();
    if (!brandId) return store.projects;
    return store.projects.filter((p) => p.brandId === brandId);
  },

  getProject(id: string): ContentProject | null {
    const store = ensureDataFile();
    return store.projects.find((p) => p.id === id) || null;
  },

  generateProjectId(brandId: BrandId): string {
    const prefix = BRANDS[brandId]?.prefix || "SP";
    const year = new Date().getFullYear();
    const store = ensureDataFile();
    const existing = store.projects.filter(
      (p) => p.id.startsWith(`${prefix}-${year}-`)
    );
    const nextNumber = existing.length + 1;
    return `${prefix}-${year}-${String(nextNumber).padStart(3, "0")}`;
  },

  createProject(
    project: Omit<ContentProject, "id" | "createdAt" | "updatedAt">
  ): ContentProject {
    const store = ensureDataFile();
    const id = this.generateProjectId(project.brandId);
    const newProject: ContentProject = {
      ...project,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.projects.unshift(newProject);
    saveStore(store);

    this.logActivity({
      projectId: id,
      action: "PROJECT_CREATED",
      description: `Created project "${newProject.title}" for brand ${newProject.brandId}`,
      newStatus: newProject.status,
    });

    return newProject;
  },

  updateProject(
    id: string,
    updates: Partial<Omit<ContentProject, "id" | "createdAt">>
  ): ContentProject | null {
    const store = ensureDataFile();
    const index = store.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const previous = store.projects[index];
    const updated: ContentProject = {
      ...previous,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    store.projects[index] = updated;
    saveStore(store);

    if (updates.status && updates.status !== previous.status) {
      this.logActivity({
        projectId: id,
        action: "STATUS_CHANGED",
        description: `Project status updated from ${previous.status} to ${updates.status}`,
        previousStatus: previous.status,
        newStatus: updates.status,
      });
    }

    return updated;
  },

  deleteProject(id: string): boolean {
    const store = ensureDataFile();
    const initialLen = store.projects.length;
    store.projects = store.projects.filter((p) => p.id !== id);
    if (store.projects.length !== initialLen) {
      saveStore(store);
      return true;
    }
    return false;
  },

  // --- Project Activities ---
  getActivities(projectId?: string): ProjectActivity[] {
    const store = ensureDataFile();
    if (!projectId) return store.activities;
    return store.activities.filter((a) => a.projectId === projectId);
  },

  logActivity(activity: Omit<ProjectActivity, "id" | "timestamp">): ProjectActivity {
    const store = ensureDataFile();
    const newActivity: ProjectActivity = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
    };
    store.activities.unshift(newActivity);
    saveStore(store);
    return newActivity;
  },

  // --- Research Dossiers ---
  getResearchRuns(projectId?: string): ResearchDossier[] {
    const store = ensureDataFile();
    if (!projectId) return store.researchRuns;
    return store.researchRuns.filter((r) => r.projectId === projectId);
  },

  getResearchRun(id: string): ResearchDossier | null {
    const store = ensureDataFile();
    return store.researchRuns.find((r) => r.id === id) || null;
  },

  saveResearchRun(dossier: ResearchDossier): ResearchDossier {
    const store = ensureDataFile();
    const index = store.researchRuns.findIndex((r) => r.id === dossier.id);
    if (index >= 0) {
      store.researchRuns[index] = dossier;
    } else {
      store.researchRuns.unshift(dossier);
    }
    saveStore(store);

    if (dossier.projectId) {
      this.updateProject(dossier.projectId, {
        activeResearchRunId: dossier.id,
        status: "RESEARCH_COMPLETE",
      });
      this.logActivity({
        projectId: dossier.projectId,
        action: "RESEARCH_SAVED",
        description: `Saved research dossier v${dossier.version}: "${dossier.exactTopic}"`,
        newStatus: "RESEARCH_COMPLETE",
      });
    }

    return dossier;
  },

  // --- Creative Intelligence ---
  getReels(platform?: string): CreativeReel[] {
    const store = ensureDataFile();
    if (!platform) return store.reels;
    return store.reels.filter((r) => r.platform === platform);
  },

  getReel(id: string): CreativeReel | null {
    const store = ensureDataFile();
    return store.reels.find((r) => r.id === id) || null;
  },

  saveReel(reel: CreativeReel): CreativeReel {
    const store = ensureDataFile();
    const index = store.reels.findIndex((r) => r.id === reel.id);
    if (index >= 0) {
      store.reels[index] = reel;
    } else {
      store.reels.unshift(reel);
    }
    saveStore(store);
    return reel;
  },

  getPatterns(brandId?: BrandId): CreativePattern[] {
    const store = ensureDataFile();
    if (!brandId) return store.patterns;
    return store.patterns.filter(
      (p) => !p.brandSuitability.length || p.brandSuitability.includes(brandId)
    );
  },

  getPattern(id: string): CreativePattern | null {
    const store = ensureDataFile();
    return store.patterns.find((p) => p.id === id) || null;
  },

  savePattern(pattern: CreativePattern): CreativePattern {
    const store = ensureDataFile();
    const index = store.patterns.findIndex((p) => p.id === pattern.id);
    if (index >= 0) {
      store.patterns[index] = pattern;
    } else {
      store.patterns.unshift(pattern);
    }
    saveStore(store);
    return pattern;
  },

  // --- Scripts ---
  getScripts(projectId?: string): ScriptDocument[] {
    const store = ensureDataFile();
    if (!projectId) return store.scripts;
    return store.scripts.filter((s) => s.projectId === projectId);
  },

  getScript(id: string): ScriptDocument | null {
    const store = ensureDataFile();
    return store.scripts.find((s) => s.id === id) || null;
  },

  saveScript(script: ScriptDocument): ScriptDocument {
    const store = ensureDataFile();
    const index = store.scripts.findIndex((s) => s.id === script.id);
    if (index >= 0) {
      store.scripts[index] = script;
    } else {
      store.scripts.unshift(script);
    }
    saveStore(store);

    if (script.projectId) {
      const currentProject = this.getProject(script.projectId);
      if (script.isApproved) {
        this.updateProject(script.projectId, {
          status: "SCRIPT_APPROVED",
          approvedScriptId: script.id,
        });
        this.logActivity({
          projectId: script.projectId,
          action: "SCRIPT_APPROVED",
          description: `Approved script document v${script.version}`,
          newStatus: "SCRIPT_APPROVED",
        });
      } else {
        // When saving an unapproved draft or new version, do not clear existing approvedScriptId
        // and do not downgrade status if project is already SCRIPT_APPROVED or in PRODUCTION_PLANNING
        const shouldUpdateStatus =
          !currentProject?.approvedScriptId &&
          currentProject?.status !== "PRODUCTION_PLANNING" &&
          currentProject?.status !== "EDITING" &&
          currentProject?.status !== "SCRIPT_APPROVED";

        if (shouldUpdateStatus) {
          this.updateProject(script.projectId, {
            status: "SCRIPT_DRAFT",
          });
        }
        this.logActivity({
          projectId: script.projectId,
          action: "SCRIPT_UPDATED",
          description: `Saved script draft v${script.version}`,
          newStatus: shouldUpdateStatus ? "SCRIPT_DRAFT" : currentProject?.status,
        });
      }
    }

    return script;
  },

  getScriptVersions(scriptDocumentId?: string): ScriptVersionHistory[] {
    const store = ensureDataFile();
    if (!scriptDocumentId) return store.scriptVersions;
    return store.scriptVersions.filter((v) => v.scriptDocumentId === scriptDocumentId);
  },

  saveScriptVersion(version: ScriptVersionHistory): ScriptVersionHistory {
    const store = ensureDataFile();
    const index = store.scriptVersions.findIndex((v) => v.id === version.id);
    if (index >= 0) {
      store.scriptVersions[index] = version;
    } else {
      store.scriptVersions.unshift(version);
    }
    saveStore(store);
    return version;
  },

  // --- Editing Plans ---
  getEditingPlans(projectId?: string): EditingPlan[] {
    const store = ensureDataFile();
    if (!projectId) return store.editingPlans;
    return store.editingPlans.filter((e) => e.projectId === projectId);
  },

  getEditingPlan(id: string): EditingPlan | null {
    const store = ensureDataFile();
    return store.editingPlans.find((e) => e.id === id) || null;
  },

  saveEditingPlan(plan: EditingPlan): EditingPlan {
    const store = ensureDataFile();
    const index = store.editingPlans.findIndex((e) => e.id === plan.id);
    if (index >= 0) {
      store.editingPlans[index] = plan;
    } else {
      store.editingPlans.unshift(plan);
    }
    saveStore(store);

    if (plan.projectId) {
      this.updateProject(plan.projectId, {
        activeEditingPlanId: plan.id,
        status: "PRODUCTION_PLANNING",
      });
      this.logActivity({
        projectId: plan.projectId,
        action: "EDITING_PLAN_GENERATED",
        description: `Generated production editing plan for Resolve/Remotion with ${plan.scenes.length} scenes`,
        newStatus: "PRODUCTION_PLANNING",
      });
    }

    return plan;
  },

  // --- Assets ---
  getAssets(projectId?: string): AssetRecord[] {
    const store = ensureDataFile();
    if (!projectId) return store.assets;
    return store.assets.filter((a) => a.projectId === projectId);
  },

  saveAsset(asset: AssetRecord): AssetRecord {
    const store = ensureDataFile();
    const index = store.assets.findIndex((a) => a.id === asset.id);
    if (index >= 0) {
      store.assets[index] = asset;
    } else {
      store.assets.unshift(asset);
    }
    saveStore(store);
    return asset;
  },

  // --- Publishing ---
  getPublishingRecords(projectId?: string): PublishingRecord[] {
    const store = ensureDataFile();
    if (!projectId) return store.publishingRecords;
    return store.publishingRecords.filter((p) => p.projectId === projectId);
  },

  savePublishingRecord(record: PublishingRecord): PublishingRecord {
    const store = ensureDataFile();
    const index = store.publishingRecords.findIndex((p) => p.id === record.id);
    if (index >= 0) {
      store.publishingRecords[index] = record;
    } else {
      store.publishingRecords.unshift(record);
    }
    saveStore(store);
    return record;
  },

  // --- Performance ---
  getPerformanceSnapshots(projectId?: string): PerformanceSnapshot[] {
    const store = ensureDataFile();
    if (!projectId) return store.performanceSnapshots;
    return store.performanceSnapshots.filter((p) => p.projectId === projectId);
  },

  savePerformanceSnapshot(snapshot: PerformanceSnapshot): PerformanceSnapshot {
    const store = ensureDataFile();
    const index = store.performanceSnapshots.findIndex((p) => p.id === snapshot.id);
    if (index >= 0) {
      store.performanceSnapshots[index] = snapshot;
    } else {
      store.performanceSnapshots.unshift(snapshot);
    }
    saveStore(store);
    return snapshot;
  },
};

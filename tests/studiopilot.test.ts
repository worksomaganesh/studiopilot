import { describe, it, expect, beforeEach } from "vitest";
import { signSession, verifySessionToken, checkRateLimit, resetRateLimit, getAdminEmail } from "../src/lib/auth/session";
import { BRANDS, getBrandConfig, BRAND_LIST } from "../src/brands/config";
import { db } from "../src/lib/db";
import { runResearchWorkflow, formatDossierMarkdown } from "../src/features/research/engine";
import { generateBrandScript } from "../src/features/scripts/engine";
import { generateEditingPlanFromScript } from "../src/features/editing/engine";
import { ResearchDossier } from "../src/types/research";
import { ScriptDocument } from "../src/types/script";

describe("StudioPilot Single-Admin Security & Authentication", () => {
  const adminEmail = getAdminEmail();

  it("should sign and verify valid administrator session tokens", () => {
    const token = signSession(adminEmail);
    expect(token).toBeDefined();
    expect(token).toContain(".");

    const session = verifySessionToken(token);
    expect(session).not.toBeNull();
    expect(session?.email).toBe(adminEmail.toLowerCase().trim());
    expect(session?.role).toBe("admin");
  });

  it("should reject session tokens for non-admin email addresses", () => {
    const intruderToken = signSession("intruder@random.com");
    const session = verifySessionToken(intruderToken);
    expect(session).toBeNull();
  });

  it("should reject tampered session tokens", () => {
    const token = signSession(adminEmail);
    const tampered = token.slice(0, -4) + "XXXX";
    const session = verifySessionToken(tampered);
    expect(session).toBeNull();
  });

  it("should enforce rate limiting on rapid repeated login attempts", () => {
    const testIp = "192.168.1.100";
    resetRateLimit(testIp);

    // Perform 10 allowed attempts
    for (let i = 0; i < 10; i++) {
      const check = checkRateLimit(testIp);
      expect(check.allowed).toBe(true);
    }

    // 11th attempt must be blocked
    const blockedCheck = checkRateLimit(testIp);
    expect(blockedCheck.allowed).toBe(false);
    expect(blockedCheck.waitSeconds).toBeGreaterThan(0);

    resetRateLimit(testIp);
    expect(checkRateLimit(testIp).allowed).toBe(true);
  });
});

describe("StudioPilot Brand Architecture & Guidelines", () => {
  it("should contain all three required independent brands", () => {
    expect(BRAND_LIST.length).toBe(3);
    expect(BRANDS.TECHENIGMASTUDIOS).toBeDefined();
    expect(BRANDS.AI_THAT_WORKS).toBeDefined();
    expect(BRANDS.CONTXT_AHEAD).toBeDefined();
  });

  it("should have correct signature palettes and prefixes", () => {
    // TECHENIGMASTUDIOS: Yellow #FFD400, Black #080808, prefix TES
    expect(BRANDS.TECHENIGMASTUDIOS.prefix).toBe("TES");
    expect(BRANDS.TECHENIGMASTUDIOS.editingIdentity.colorPalette.primary.toUpperCase()).toBe("#FFD400");
    expect(BRANDS.TECHENIGMASTUDIOS.editingIdentity.colorPalette.background).toBe("#080808");

    // AI That Works: Orange #FF5722, Midnight Navy #111827, prefix ATW
    expect(BRANDS.AI_THAT_WORKS.prefix).toBe("ATW");
    expect(BRANDS.AI_THAT_WORKS.editingIdentity.colorPalette.primary.toUpperCase()).toBe("#FF5722");
    expect(BRANDS.AI_THAT_WORKS.editingIdentity.colorPalette.background).toBe("#111827");

    // CONTXT AHEAD: Violet #7657FF, Midnight #151426, prefix CA
    expect(BRANDS.CONTXT_AHEAD.prefix).toBe("CA");
    expect(BRANDS.CONTXT_AHEAD.editingIdentity.colorPalette.primary.toUpperCase()).toBe("#7657FF");
    expect(BRANDS.CONTXT_AHEAD.editingIdentity.colorPalette.background).toBe("#151426");
  });

  it("should have distinct research methodologies and script systems", () => {
    expect(BRANDS.TECHENIGMASTUDIOS.researchMode.name).toContain("Technical");
    expect(BRANDS.AI_THAT_WORKS.researchMode.name).toContain("Applied");
    expect(BRANDS.CONTXT_AHEAD.researchMode.name).toContain("Contextual");

    expect(BRANDS.TECHENIGMASTUDIOS.scriptSystem.name).toContain("Educational");
    expect(BRANDS.AI_THAT_WORKS.scriptSystem.name).toContain("Practical Demonstration");
    expect(BRANDS.CONTXT_AHEAD.scriptSystem.name).toContain("Contextual Editorial");
  });
});

describe("StudioPilot Content Project Repository", () => {
  it("should generate standardized project IDs with brand prefix and year", () => {
    const tesId = db.generateProjectId("TECHENIGMASTUDIOS");
    const year = new Date().getFullYear();
    expect(tesId).toMatch(new RegExp(`^TES-${year}-\\d{3}$`));

    const atwId = db.generateProjectId("AI_THAT_WORKS");
    expect(atwId).toMatch(new RegExp(`^ATW-${year}-\\d{3}$`));

    const caId = db.generateProjectId("CONTXT_AHEAD");
    expect(caId).toMatch(new RegExp(`^CA-${year}-\\d{3}$`));
  });

  it("should create and retrieve content projects with activity logging", () => {
    const newProj = db.createProject({
      brandId: "TECHENIGMASTUDIOS",
      title: "Test Transformers Architecture Project",
      conceptName: "Transformers",
      status: "INBOX",
      targetPlatform: "YouTube Shorts",
      targetDurationSeconds: 60,
      targetAudienceLevel: "Intermediate",
      tags: ["Transformers", "Deep Learning"],
    });

    expect(newProj.id).toBeDefined();
    const retrieved = db.getProject(newProj.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.title).toBe("Test Transformers Architecture Project");

    // Verify activity was logged
    const activities = db.getActivities(newProj.id);
    expect(activities.length).toBeGreaterThan(0);
    expect(activities[0].action).toBe("PROJECT_CREATED");
  });
});

describe("StudioPilot Research Studio & Claim-Evidence Matrix", () => {
  it("should format markdown dossiers with explicit claim-evidence table and sources", () => {
    const sampleDossier: ResearchDossier = {
      id: "res-test-01",
      brandId: "TECHENIGMASTUDIOS",
      version: 1,
      conceptName: "Feature Engineering",
      exactTopic: "Why Feature Engineering Matters in ML",
      createdAt: new Date().toISOString(),
      executiveOverview: "Overview text",
      conceptDefinition: "Definition text",
      backgroundAndFundamentals: "Fundamentals text",
      subtopics: [],
      stepByStepMechanisms: ["Mechanism 1"],
      examplesAndUseCases: ["Example 1"],
      importantTechnicalDetails: ["Detail 1"],
      comparisons: [],
      visualisationOpportunities: ["Visual 1"],
      misconceptions: ["Misconception 1"],
      limitations: ["Limitation 1"],
      claimEvidenceMatrix: [
        {
          id: "CLM-001",
          runId: "res-test-01",
          claim: "Feature engineering improves model convergence rate.",
          subtopicIndex: 0,
          subtopicTitle: "Overview",
          supportingSourceId: "src-1",
          supportingSourceUrl: "https://arxiv.org/abs/sample",
          supportingSourceTitle: "ML Foundations Paper",
          verificationStatus: "VERIFIED",
          quoteOrEvidence: "Empirical results show 2.4x convergence speedup.",
        },
      ],
      sourceRegister: [
        {
          id: "src-1",
          runId: "res-test-01",
          title: "ML Foundations Paper",
          url: "https://arxiv.org/abs/sample",
          publisher: "arXiv",
          publishedDate: "2024",
          credibilityScore: 9,
          isPrimarySource: true,
          retrievedAt: new Date().toISOString(),
        },
      ],
      researchGapsAndUncertainty: ["Latency benchmarks"],
      suggestedFollowUpQuestions: ["How does it scale?"],
    };

    const markdown = formatDossierMarkdown(sampleDossier);
    expect(markdown).toContain("# Research Dossier: Why Feature Engineering Matters in ML");
    expect(markdown).toContain("## 11. Claim-Evidence Matrix");
    expect(markdown).toContain("| CLM-001 |");
    expect(markdown).toContain("https://arxiv.org/abs/sample");
    expect(markdown).toContain("## 12. Source Register");
  });
});

describe("StudioPilot Script Studio & Editing Studio Pipeline", () => {
  const sampleDossier: ResearchDossier = {
    id: "res-test-02",
    brandId: "TECHENIGMASTUDIOS",
    version: 1,
    conceptName: "Attention Mechanisms",
    exactTopic: "How Scaled Dot-Product Attention Works",
    createdAt: new Date().toISOString(),
    executiveOverview: "Detailed overview",
    conceptDefinition: "Attention definition",
    backgroundAndFundamentals: "Fundamentals",
    subtopics: [],
    stepByStepMechanisms: ["Matrix multiplication of Q and K^T", "Softmax scaling", "Value weighting"],
    examplesAndUseCases: ["GPT-4", "Gemini 2.5"],
    importantTechnicalDetails: ["O(N^2) memory complexity"],
    comparisons: [],
    visualisationOpportunities: ["Attention heat map"],
    misconceptions: ["Linear attention has zero information loss"],
    limitations: ["Quadratic context window penalty"],
    claimEvidenceMatrix: [
      {
        id: "CLM-001",
        runId: "res-test-02",
        claim: "Scaled dot-product attention scales quadratically with sequence length.",
        subtopicIndex: 0,
        subtopicTitle: "Mechanisms",
        supportingSourceId: "src-1",
        supportingSourceUrl: "https://arxiv.org/abs/1706.03762",
        supportingSourceTitle: "Attention Is All You Need",
        verificationStatus: "VERIFIED",
        quoteOrEvidence: "Complexity per layer is O(n^2 * d).",
      },
    ],
    sourceRegister: [],
    researchGapsAndUncertainty: [],
    suggestedFollowUpQuestions: [],
  };

  it("should generate grounded brand script with hook alternatives and scene breakdowns", async () => {
    const result = await generateBrandScript({
      brandId: "TECHENIGMASTUDIOS",
      researchDossier: sampleDossier,
      selectedPatterns: [],
      targetPlatform: "YouTube Shorts",
      targetDurationSeconds: 60,
      audienceLevel: "Intermediate",
    });

    expect(result.script).toBeDefined();
    expect(result.script.hookAlternatives.length).toBeGreaterThanOrEqual(3);
    expect(result.script.scenes.length).toBeGreaterThan(0);
    expect(result.script.evaluation.overallScore).toBeGreaterThan(0);
    expect(result.script.evaluation.disclaimer).toContain("Editorial assistance only");
  });

  it("should generate production editing plan with DaVinci Resolve EDL and CSV manifest", () => {
    const sampleScript: ScriptDocument = {
      id: "scr-test-01",
      brandId: "TECHENIGMASTUDIOS",
      title: "How Scaled Dot-Product Attention Works",
      version: 1,
      isApproved: true,
      targetPlatform: "YouTube Shorts",
      targetDurationSeconds: 60,
      selectedPatternIds: ["CP-001"],
      hookAlternatives: [],
      selectedHookId: "hook-1",
      fullNarration: "Attention mechanism explained.",
      scenes: [
        {
          sceneNumber: 1,
          narration: "Here is why attention is O(N^2).",
          visualDirection: "Terminal screen zoom with glowing electric yellow code highlight",
          motionDirection: "Fast snap zoom (200ms)",
          onScreenText: "ATTENTION MATRIX",
          estimatedDurationSeconds: 10,
          bRollSuggestions: ["Code screen"],
          motionGraphicSuggestions: ["Word-by-word yellow caption bounce"],
          referencedClaimIds: ["CLM-001"],
        },
      ],
      evaluation: {
        overallScore: 85,
        disclaimer: "Editorial assistance only.",
        criteria: {} as any,
        keyStrengths: [],
        suggestedImprovements: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const plan = generateEditingPlanFromScript(sampleScript, "TES-2026-999");
    expect(plan).toBeDefined();
    expect(plan.scenes.length).toBe(1);
    expect(plan.davinciResolveExport.edlText).toContain("TITLE: HOW SCALED DOT-PRODUCT ATTENTION WORKS");
    expect(plan.davinciResolveExport.edlText).toContain("AX       V     C");
    expect(plan.davinciResolveExport.csvManifest).toContain("Scene,DurationSeconds,Narration");
    expect(plan.remotionScaffold.jsonSceneConfig).toContain("TESTechnicalDiagram");
  });
});

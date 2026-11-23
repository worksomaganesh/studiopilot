import { describe, it, expect } from "vitest";
import {
  generateBrandScript,
  detectTechnicalDomain,
  resolveClaimForScene,
} from "../src/features/scripts/engine";
import { ResearchDossier } from "../src/types/research";

describe("Script Engine — Topic-Aware Template Selection & Anti-Contamination", () => {
  const aiAgentsDossier: ResearchDossier = {
    id: "res-agents-01",
    brandId: "TECHENIGMASTUDIOS",
    version: 1,
    conceptName: "Autonomous AI Agents",
    exactTopic: "How AI Agents Actually Work: From LLMs to Tool-Using Autonomous Systems",
    createdAt: new Date().toISOString(),
    executiveOverview: "Investigation into autonomous AI agents, tool use, and reasoning loops.",
    conceptDefinition: "An autonomous system combining foundation models with iterative reasoning, tool calling, and memory.",
    backgroundAndFundamentals: "LLMs provide next-token prediction, while agents wrap the model in an execution loop.",
    subtopics: [],
    stepByStepMechanisms: ["The ReAct Thought-Action-Observation cycle", "JSON schema validation for tool calls"],
    examplesAndUseCases: ["Code generation agents", "DevOps automated incident response"],
    importantTechnicalDetails: ["JSON schema validation", "Sandbox isolation"],
    comparisons: [],
    visualisationOpportunities: ["Execution loop diagram"],
    misconceptions: ["AI agents are just chatbots with system prompts"],
    limitations: ["Iteration limits and execution budget bounds required"],
    claimEvidenceMatrix: [
      {
        id: "CLM-001",
        runId: "res-agents-01",
        claim: "LLMs serve as core reasoning engines augmented with tool use and memory.",
        subtopicIndex: 0,
        subtopicTitle: "Core Architecture",
        supportingSourceId: "src-1",
        supportingSourceUrl: "https://arxiv.org/abs/2503.12687",
        supportingSourceTitle: "AI Agents Evolution",
        verificationStatus: "VERIFIED",
        quoteOrEvidence: "Modern AI agents leverage foundation models as core components.",
      },
      {
        id: "CLM-012",
        runId: "res-agents-01",
        claim: "A ReAct agent runs an interleaved loop producing thought, action, and observation.",
        subtopicIndex: 1,
        subtopicTitle: "Execution Loop",
        supportingSourceId: "src-12",
        supportingSourceUrl: "https://www.jetbrains.com/pages/ai-agents/architecture/react-agents/",
        supportingSourceTitle: "ReAct Agents Explained",
        verificationStatus: "VERIFIED",
        quoteOrEvidence: "Each pass produces a thought, an action, and an observation that feeds the next thought.",
      },
      {
        id: "CLM-004",
        runId: "res-agents-01",
        claim: "Production agents require structured JSON schemas and sandbox execution boundaries.",
        subtopicIndex: 2,
        subtopicTitle: "Tool Design",
        supportingSourceId: "src-4",
        supportingSourceUrl: "https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/",
        supportingSourceTitle: "OpenAI Guide",
        verificationStatus: "VERIFIED",
        quoteOrEvidence: "Strict tool schemas and runtime guardrails.",
      },
      {
        id: "CLM-009",
        runId: "res-agents-01",
        claim: "Agent loops consume significant tokens and require iteration termination limits.",
        subtopicIndex: 3,
        subtopicTitle: "Constraints",
        supportingSourceId: "src-9",
        supportingSourceUrl: "https://blogs.oracle.com/developers/what-is-the-ai-agent-loop-the-core-architecture-behind-autonomous-ai-systems",
        supportingSourceTitle: "Oracle Developers",
        verificationStatus: "VERIFIED",
        quoteOrEvidence: "Building agent loops requires engineering for cost and observability constraints.",
      },
    ],
    sourceRegister: [],
    researchGapsAndUncertainty: [],
    suggestedFollowUpQuestions: [],
  };

  const featureEngineeringDossier: ResearchDossier = {
    id: "res-fe-01",
    brandId: "TECHENIGMASTUDIOS",
    version: 1,
    conceptName: "Feature Engineering",
    exactTopic: "Why Feature Engineering Makes or Breaks Machine Learning",
    createdAt: new Date().toISOString(),
    executiveOverview: "Transforming tabular variables to maximize mathematical model performance.",
    conceptDefinition: "The transformation of raw input variables into high-signal numerical representations.",
    backgroundAndFundamentals: "Deep learning does not eliminate the need for domain-guided tabular features.",
    subtopics: [],
    stepByStepMechanisms: ["Non-linear feature synthesis", "Target encoding", "Variance filtering"],
    examplesAndUseCases: ["Fraud detection", "Credit scoring"],
    importantTechnicalDetails: ["Dimensionality regularization"],
    comparisons: [],
    visualisationOpportunities: ["Scatter plot of engineered features"],
    misconceptions: ["Deep learning models eliminate the need for tabular feature engineering"],
    limitations: ["High cardinality features risk dimension explosion and target leakage"],
    claimEvidenceMatrix: [
      {
        id: "CLM-101",
        runId: "res-fe-01",
        claim: "Domain-guided feature engineering provides significant tabular model accuracy improvements.",
        subtopicIndex: 0,
        subtopicTitle: "Foundations",
        supportingSourceId: "src-101",
        supportingSourceUrl: "https://arxiv.org/abs/sample-fe",
        supportingSourceTitle: "Tabular ML Foundations",
        verificationStatus: "VERIFIED",
        quoteOrEvidence: "Feature representations dominate raw tabular benchmarks.",
      },
      {
        id: "CLM-102",
        runId: "res-fe-01",
        claim: "Target leakage occurs when future information contaminates feature transformations.",
        subtopicIndex: 1,
        subtopicTitle: "Pitfalls",
        supportingSourceId: "src-102",
        supportingSourceUrl: "https://arxiv.org/abs/sample-leakage",
        supportingSourceTitle: "ML Leakage Survey",
        verificationStatus: "VERIFIED",
        quoteOrEvidence: "Leakage creates false positive evaluation metrics.",
      },
    ],
    sourceRegister: [],
    researchGapsAndUncertainty: [],
    suggestedFollowUpQuestions: [],
  };

  const quantumDossier: ResearchDossier = {
    id: "res-qkd-01",
    brandId: "TECHENIGMASTUDIOS",
    version: 1,
    conceptName: "Quantum Key Distribution",
    exactTopic: "How BB84 Quantum Key Distribution Prevents Eavesdropping",
    createdAt: new Date().toISOString(),
    executiveOverview: "Quantum mechanics principles ensuring information-theoretic cryptographic key exchange.",
    conceptDefinition: "A secure communication method that uses quantum mechanics to detect interception of shared encryption keys.",
    backgroundAndFundamentals: "Heisenberg uncertainty and the no-cloning theorem guarantee eavesdropper detection.",
    subtopics: [],
    stepByStepMechanisms: ["Polarized photon transmission across random non-orthogonal bases", "Public basis reconciliation"],
    examplesAndUseCases: ["Satellite quantum communication", "Financial fiber networks"],
    importantTechnicalDetails: ["Dark count rate", "Quantum bit error rate (QBER) threshold"],
    comparisons: [],
    visualisationOpportunities: ["Photon polarization angles"],
    misconceptions: ["Quantum cryptography transmits messages faster than light"],
    limitations: ["Fiber attenuation limits metropolitan transmission distance without quantum repeaters"],
    claimEvidenceMatrix: [
      {
        id: "CLM-201",
        runId: "res-qkd-01",
        claim: "Measuring a quantum state irrevocably alters its polarization, exposing unauthorized eavesdropping.",
        subtopicIndex: 0,
        subtopicTitle: "Physics Foundations",
        supportingSourceId: "src-201",
        supportingSourceUrl: "https://arxiv.org/abs/sample-qkd",
        supportingSourceTitle: "BB84 Protocol Review",
        verificationStatus: "VERIFIED",
        quoteOrEvidence: "Any measurement in a non-orthogonal basis introduces detectable perturbation.",
      },
    ],
    sourceRegister: [],
    researchGapsAndUncertainty: [],
    suggestedFollowUpQuestions: [],
  };

  it("should accurately detect the technical domain", () => {
    expect(detectTechnicalDomain("Autonomous AI Agents", "How AI Agents Actually Work")).toBe("AI_AGENTS");
    expect(detectTechnicalDomain("Feature Engineering", "Why Feature Engineering Matters")).toBe("FEATURE_ENGINEERING");
    expect(detectTechnicalDomain("Scaled Dot-Product Attention", "How Attention Works")).toBe("NEURAL_ARCHITECTURES");
    expect(detectTechnicalDomain("FlashAttention Hopper GPU", "Tensor Core Optimization")).toBe("SYSTEMS_AND_INFRASTRUCTURE");
    expect(detectTechnicalDomain("Quantum Key Distribution", "BB84 Protocol Mechanics")).toBe("GENERIC_TECHNICAL");
  });

  it("should generate clean AI Agents script without any Feature Engineering contamination", async () => {
    const result = await generateBrandScript({
      brandId: "TECHENIGMASTUDIOS",
      researchDossier: aiAgentsDossier,
      selectedPatterns: [],
      targetPlatform: "YouTube Shorts",
      targetDurationSeconds: 60,
      audienceLevel: "Intermediate",
    });

    const script = result.script;
    const combinedScriptText = `${script.fullNarration} ${script.scenes.map((s) => s.visualDirection).join(" ")} ${script.scenes.map((s) => s.onScreenText).join(" ")}`.toLowerCase();

    // Verify ZERO Feature Engineering template contamination
    expect(combinedScriptText).not.toContain("input columns");
    expect(combinedScriptText).not.toContain("engineered output features");
    expect(combinedScriptText).not.toContain("40% accuracy");
    expect(combinedScriptText).not.toContain("basic preprocessing");
    expect(combinedScriptText).not.toContain("feature synthesis");

    // Verify presence of accurate AI Agent concepts
    expect(combinedScriptText).toContain("agent");
    expect(combinedScriptText).toContain("tool");
    expect(combinedScriptText).toContain("loop");

    // Verify scene on-screen texts
    expect(script.scenes[0].onScreenText).toBe("LLM VS AGENT");
    expect(script.scenes[1].onScreenText).toBe("THE EXECUTION LOOP");
    expect(script.scenes[2].onScreenText).toBe("STRUCTURED TOOL EXECUTION");
    expect(script.scenes[3].onScreenText).toBe("RUNTIME SAFEGUARDS");
  });

  it("should generate Feature Engineering script with appropriate tabular preprocessing language", async () => {
    const result = await generateBrandScript({
      brandId: "TECHENIGMASTUDIOS",
      researchDossier: featureEngineeringDossier,
      selectedPatterns: [],
      targetPlatform: "YouTube Shorts",
      targetDurationSeconds: 60,
      audienceLevel: "Intermediate",
    });

    const script = result.script;
    const combinedScriptText = `${script.fullNarration} ${script.scenes.map((s) => s.visualDirection).join(" ")}`.toLowerCase();

    // Verify domain-appropriate terminology
    expect(combinedScriptText).toContain("feature");
    expect(combinedScriptText).toContain("tabular");
    expect(combinedScriptText).toContain("leakage");

    // Verify AI Agent terms do NOT contaminate Feature Engineering
    expect(combinedScriptText).not.toContain("react execution loop");
    expect(combinedScriptText).not.toContain("stateless token predictor");
  });

  it("should generate a third unrelated technical topic without cross-topic contamination", async () => {
    const result = await generateBrandScript({
      brandId: "TECHENIGMASTUDIOS",
      researchDossier: quantumDossier,
      selectedPatterns: [],
      targetPlatform: "YouTube Shorts",
      targetDurationSeconds: 60,
      audienceLevel: "Intermediate",
    });

    const script = result.script;
    const combinedScriptText = `${script.fullNarration} ${script.scenes.map((s) => s.visualDirection).join(" ")}`.toLowerCase();

    // Must NOT contain Feature Engineering phrases
    expect(combinedScriptText).not.toContain("input columns");
    expect(combinedScriptText).not.toContain("engineered output features");
    expect(combinedScriptText).not.toContain("40% accuracy");
    expect(combinedScriptText).not.toContain("basic preprocessing");

    // Must NOT contain AI Agent phrases
    expect(combinedScriptText).not.toContain("react execution loop");
    expect(combinedScriptText).not.toContain("stateless token predictor");

    // Must correctly reflect the topic
    expect(script.title).toContain("Quantum Key Distribution");
    expect(script.scenes.length).toBe(4);
  });

  it("should handle missing or sparse research evidence with a clear warning and structural fallback", async () => {
    const sparseDossier: ResearchDossier = {
      ...quantumDossier,
      claimEvidenceMatrix: [],
      stepByStepMechanisms: [],
      limitations: [],
    };

    const result = await generateBrandScript({
      brandId: "TECHENIGMASTUDIOS",
      researchDossier: sparseDossier,
      selectedPatterns: [],
      targetPlatform: "YouTube Shorts",
      targetDurationSeconds: 60,
      audienceLevel: "Intermediate",
    });

    expect(result.script).toBeDefined();
    expect(result.script.scenes.length).toBe(4);
    expect(result.warning).toBeDefined();
    expect(result.warning).toContain("Research evidence is sparse");
  });

  it("should map distinct relevant claims across scenes instead of repeating a single claim ID", async () => {
    const result = await generateBrandScript({
      brandId: "TECHENIGMASTUDIOS",
      researchDossier: aiAgentsDossier,
      selectedPatterns: [],
      targetPlatform: "YouTube Shorts",
      targetDurationSeconds: 60,
      audienceLevel: "Intermediate",
    });

    const scenes = result.script.scenes;
    const referencedIds = scenes.map((s) => s.referencedClaimIds[0]);

    // Ensure not all scenes refer to only CLM-001
    const uniqueIds = new Set(referencedIds);
    expect(uniqueIds.size).toBeGreaterThan(1);
    expect(scenes[1].referencedClaimIds).toContain("CLM-012"); // Mechanism scene matches ReAct loop claim
    expect(scenes[2].referencedClaimIds).toContain("CLM-004"); // Implementation scene matches tool design claim
  });

  it("should clearly identify deterministic fallback when Gemini credentials are unconfigured", async () => {
    const result = await generateBrandScript({
      brandId: "TECHENIGMASTUDIOS",
      researchDossier: aiAgentsDossier,
      selectedPatterns: [],
      targetPlatform: "YouTube Shorts",
      targetDurationSeconds: 60,
      audienceLevel: "Intermediate",
    });

    expect(result.warning).toBeDefined();
    expect(result.warning).toContain("StudioPilot Grounded Heuristic Engine v2.0");
    expect(result.script.evaluation.disclaimer).toContain("Editorial assistance only");
  });
});

import { BrandConfig, BrandId } from "@/types/brand";

export const BRANDS: Record<BrandId, BrandConfig> = {
  TECHENIGMASTUDIOS: {
    id: "TECHENIGMASTUDIOS",
    name: "TECHENIGMASTUDIOS",
    tagline: "High-Calibre Technical & Machine Learning Education",
    editorialPurpose: "Technology, AI and ML education with mathematical and architectural rigour.",
    prefix: "TES",
    researchMode: {
      name: "Technical Deep-Dive Methodology",
      primaryMethodology:
        "Investigates definitions, fundamental concepts, technical mechanisms, internal architecture, step-by-step algorithms, prerequisite dependencies, common misconceptions, and visualisation opportunities.",
      focusAreas: [
        "Core definitions and mathematical fundamentals",
        "Internal mechanisms and component dataflow",
        "Step-by-step execution algorithms",
        "Practical code and dataset examples",
        "Limitations, edge cases and trade-offs",
        "Prerequisite concepts and mental models",
        "Prevalent industry misconceptions",
        "Opportunities for 2D/3D technical animations and architectural diagrams",
        "Authoritative documentation, RFCs and research paper citations",
      ],
      preferredSources: [
        "Official technical documentation (PyTorch, TensorFlow, Python docs)",
        "Peer-reviewed research papers (arXiv, IEEE, NeurIPS, ICML)",
        "Engineering blogs from leading AI labs (Google DeepMind, OpenAI, Anthropic, Meta AI)",
        "Authoritative academic textbooks and university lectures",
      ],
    },
    scriptSystem: {
      name: "Educational Script System",
      purpose: "Teach intricate technical concepts clearly without dumbing down the core mechanism.",
      tone: "Authoritative, intellectually rigorous, lucid, engaging and precise.",
      pacing: "Deliberate and rhythmic; gives complex terms room to land before advancing.",
      keyCharacteristics: [
        "Zero fluff or clickbait hyperbole",
        "Hook introduces a compelling technical question or mind-bending counter-intuitive reality",
        "Immediate conceptual anchor before diving into mechanics",
        "Technical jargon is unpacked using concrete visual analogies",
        "Explicit on-screen code snippet or architecture diagram callouts",
        "Climactic practical takeaway empowering the engineer to apply it",
      ],
      structureTemplate: [
        "1. Hook: The Technical Mystery or Counter-intuitive Constraint (0-5s)",
        "2. Core Concept: Ground Definition & Concrete Mental Model (5-18s)",
        "3. Internal Mechanism: How the Engine Actually Works (18-38s)",
        "4. Practical Example: Code, Dataset or Real Architecture (38-50s)",
        "5. The Gotcha / Trade-off & Engineering Takeaway (50-60s)",
      ],
    },
    editingIdentity: {
      visualCharacter: [
        "Bold",
        "Technical",
        "High Contrast",
        "Educational",
        "Precise",
        "Premium Studio Feel",
      ],
      editingPhilosophy:
        "Every cut, graphic, and caption must illuminate a technical truth. Visuals are not decorative filler; they are visual proofs and mental models that make abstract computing visible.",
      editingStyle: [
        "Animated technical diagrams with directional glowing traces",
        "Neural network activation and tensor flow visualisations",
        "Matrix and data-flow animations with smooth mathematical transitions",
        "Kinetic monospace typography for code highlights",
        "High-definition terminal and IDE screen recordings with zoom callouts",
        "Clean razor-sharp cuts without disorienting whip-pans",
        "Structured information reveals synchronised to speech cadence",
      ],
      colorPalette: {
        primary: "#FFD400", // Signature Electric Yellow
        secondary: "#FFE14D",
        background: "#080808", // Pure Deep Black
        surface: "#141414",
        accent: "#FFD400",
        textPrimary: "#FFFFFF",
        textSecondary: "#A1A1AA",
        border: "#27272A",
      },
      typography: {
        headingFont: "JetBrains Mono, Inter, sans-serif",
        bodyFont: "Inter, sans-serif",
        codeFont: "JetBrains Mono, monospace",
        weightHierarchy: {
          hero: "font-black tracking-tight",
          section: "font-bold tracking-normal",
          body: "font-medium leading-relaxed",
        },
      },
      motionPrinciples: [
        "Linear velocity with cubic bezier easing for data packets (ease-out)",
        "Snap zooms on terminal commands (200ms)",
        "Subtle 10-degree grid perspective overlay in background",
        "Zero floaty bounce; mechanical precision only",
      ],
      transitions: [
        "Instant hard cut on beat",
        "Horizontal wipe synced with directional terminal arrow",
        "Grid scanline transition for scene changes",
      ],
      captionStyle: {
        font: "JetBrains Mono",
        case: "uppercase",
        highlightColor: "#FFD400",
        animation: "per-word bounce-in with solid black pill backdrop",
      },
      soundDesign:
        "Tactile mechanical keyboard clicks, subtle electronic bass hums, laser tick marks on data points, muted cinematic sub-boom on core revelation.",
      sceneArchetypes: [
        "Architectural Blueprint View",
        "Split Screen: Problem vs Optimization",
        "Interactive Terminal / IDE Focus",
        "Memory / Latent Space Graph",
        "Summary Checkpoint Matrix",
      ],
      lowerThirdsStyle:
        "Monospace black tag with #FFD400 left edge border, timestamp marker and source citation.",
      thumbnailRules: [
        "High-contrast Yellow (#FFD400) on Deep Black (#080808)",
        "Maximum 4-5 large bold words in JetBrains Mono / Impact weight",
        "One central clean 3D/2D technical schematic or code block",
        "No exaggerated facial expressions; high-signal technical badge",
      ],
      davinciTemplateReference: "TES_TechExplainer_Vertical_v2.drp",
      remotionComponentReference: "TESGraphicComposition",
      exportSpecs: {
        aspectRatio: "9:16",
        resolution: "1080x1920",
        frameRate: 60,
        colorSpace: "Rec.709",
      },
    },
  },

  AI_THAT_WORKS: {
    id: "AI_THAT_WORKS",
    name: "AI That Works",
    tagline: "Practical AI Implementations & Enterprise Workflows",
    editorialPurpose:
      "Transforming abstract AI capabilities into deployed, profitable, and reliable business workflows.",
    prefix: "ATW",
    researchMode: {
      name: "Applied Workflow Methodology",
      primaryMethodology:
        "Investigates tangible business friction, existing human workflows, tool ecosystems, step-by-step implementation costs, enterprise security considerations, failure modes, and verified ROI case studies.",
      focusAreas: [
        "Existing manual workflows and baseline labor bottlenecks",
        "Practical AI tools, APIs, frameworks, and low-code integrations",
        "Step-by-step deployment architecture and integration schemas",
        "Failure cases, guardrail implementations, and human-in-the-loop fallback",
        "Security, enterprise privacy compliance, and data residency",
        "Verified economic ROI, latency metrics, and operational cost breakdown",
        "Competitor software evaluation and real-world adoption hurdles",
      ],
      preferredSources: [
        "Developer documentation & API specs (Stripe, Zapier, Supabase, LangChain, n8n)",
        "Enterprise case studies with concrete dollar/hour benchmarks",
        "GitHub repositories containing production reference architectures",
        "Security audits, SOC2 guidelines, and cloud deployment guides",
      ],
    },
    scriptSystem: {
      name: "Practical Demonstration Script System",
      purpose: "Show exactly how an AI solution solves a specific operational workflow pain point.",
      tone: "Direct, energetic, pragmatic, commercial, and actionable.",
      pacing: "Fast-paced and execution-oriented; rapid progression from problem to live demo.",
      keyCharacteristics: [
        "Open with real operational frustration or costly enterprise inefficiency",
        "Skip theory; get to the working system within 8 seconds",
        "Show real UI: cursor movement, tool interaction, prompt setup",
        "Highlight the exact pipeline (Input -> Trigger -> AI Agent -> Output)",
        "Address reliability and limitations honestly",
        "Provide an immediate downloadable or copy-paste workflow blueprint",
      ],
      structureTemplate: [
        "1. Hook: The Costly Manual Pain Point or Broken Workflow (0-6s)",
        "2. The Solution: Introducing the Automated Pipeline (6-15s)",
        "3. Live Execution: Step-by-Step UI & Agent Workflow (15-38s)",
        "4. The Guardrails: How We Prevent Hallucinations & Errors (38-48s)",
        "5. ROI & Blueprint Action Step (48-60s)",
      ],
    },
    editingIdentity: {
      visualCharacter: [
        "Practical",
        "Modern",
        "Energetic",
        "Commercially Credible",
        "Execution-Oriented",
      ],
      editingPhilosophy:
        "Prioritise real software execution over hypothetical motion graphics. Build undeniable credibility by showing the software working, before-and-after metrics, and tactile UI interactions.",
      editingStyle: [
        "Product and UI screencasts framed in elegant glassmorphic browser mockups",
        "Smooth kinetic cursor tracking with ambient orange spotlight glow",
        "Automated workflow node diagrams (e.g. n8n / Make style visual graphs)",
        "Split-screen Before-and-After operational time comparisons",
        "Callout bubbles pointing to prompt inputs and API responses",
        "High-energy pacing with snappy jump cuts between UI stages",
        "Clean overlay metrics highlighting time saved and dollar ROI",
      ],
      colorPalette: {
        primary: "#FF5722", // Vibrant Execution Orange
        secondary: "#FFB088", // Soft Peach
        background: "#111827", // Midnight Navy
        surface: "#1F2937",
        accent: "#FF5722",
        textPrimary: "#F5F3EE", // Warm White
        textSecondary: "#9CA3AF",
        border: "#374151",
      },
      typography: {
        headingFont: "Plus Jakarta Sans, Inter, sans-serif",
        bodyFont: "Inter, sans-serif",
        codeFont: "JetBrains Mono, monospace",
        weightHierarchy: {
          hero: "font-extrabold tracking-tight",
          section: "font-bold tracking-tight",
          body: "font-normal leading-normal",
        },
      },
      motionPrinciples: [
        "Dynamic cursor springs (mass: 0.8, damping: 20)",
        "Card pop-ins with slight 3D perspective tilt (5 degrees)",
        "Pulse ripples on button clicks and API trigger points",
        "Fast horizontal slide transitions for multi-step workflows",
      ],
      transitions: [
        "Smooth camera pan to next UI section",
        "Clean sliding card push",
        "Subtle glow flash on workflow completion",
      ],
      captionStyle: {
        font: "Plus Jakarta Sans",
        case: "sentencecase",
        highlightColor: "#FF5722",
        animation: "bold word pop with peach underline highlight",
      },
      soundDesign:
        "Modern digital UI chimes, crisp mouse clicks, swift wooshes, upbeat future-tech lo-fi rhythm in background.",
      sceneArchetypes: [
        "Pain Point Frustration Screen",
        "Workflow Architecture Graph",
        "Live Browser / Tool Screencast",
        "Before vs After Stopwatch Comparison",
        "Implementation Checklist & Download Card",
      ],
      lowerThirdsStyle:
        "Rounded modern pill with #FF5722 badge, tool icon, and live action step.",
      thumbnailRules: [
        "Bold Orange (#FF5722) and Midnight Navy (#111827) color blocking",
        "Visible UI element: Node workflow, prompt box, or dollar metric",
        "High-contrast headline: 'Automate X in 5 Minutes'",
        "Arrow pointing to tangible output result",
      ],
      davinciTemplateReference: "ATW_WorkflowShowcase_Vertical_v1.drp",
      remotionComponentReference: "ATWWorkflowComposition",
      exportSpecs: {
        aspectRatio: "9:16",
        resolution: "1080x1920",
        frameRate: 60,
        colorSpace: "Rec.709",
      },
    },
  },

  CONTXT_AHEAD: {
    id: "CONTXT_AHEAD",
    name: "CONTXT AHEAD",
    tagline: "Technology Intelligence, Industry Context & Strategic Implications",
    editorialPurpose:
      "Deep geopolitical, macroeconomic, and industrial analysis of technological shifts.",
    prefix: "CA",
    researchMode: {
      name: "Strategic Contextual Methodology",
      primaryMethodology:
        "Investigates the historical timeline, corporate incentives, geopolitical chessboard, semiconductor supply chains, capital allocation, and competing strategic scenarios.",
      focusAreas: [
        "Chronological timeline of events and predecessor technologies",
        "Corporate stakeholders, board maneuvers, and executive incentives",
        "Macroeconomic stakes, semiconductor capex, and datacenter energy demands",
        "Regulatory antitrust actions, patents, and geopolitical sanctions",
        "Competing counter-narratives and dissenting expert opinions",
        "Secondary and tertiary order consequences for society and industry",
        "Plausible 3-to-5 year strategic scenarios with identified uncertainties",
      ],
      preferredSources: [
        "Financial filings (SEC 10-K, 10-Q, earnings transcripts)",
        "Government regulatory filings, antitrust proceedings, and court exhibits",
        "Specialist industry newsletters (SemiAnalysis, Stratechery, The Information)",
        "Macro research reports (Goldman Sachs, Morgan Stanley, TSMC disclosures)",
      ],
    },
    scriptSystem: {
      name: "Contextual Editorial Script System",
      purpose:
        "Unpack the geopolitical or market chess game behind today's biggest tech headlines.",
      tone: "Intellectual, narrative-driven, composed, analytical, and visionary.",
      pacing: "Measured and suspenseful; builds a documentary-style intellectual narrative.",
      keyCharacteristics: [
        "Open with a high-stakes question framing a massive industry conflict",
        "Provide immediate historical grounding: how we reached this precipice",
        "Follow the money: reveal corporate incentives and hidden balance sheet pressures",
        "Interrogate conflicting perspectives rather than taking press releases at face value",
        "Highlight second-order geopolitical or economic ripples",
        "Leave the audience with a penetrating strategic insight and forward question",
      ],
      structureTemplate: [
        "1. Hook: The Unseen Chess Move or High-Stakes Clash (0-7s)",
        "2. The Context: The Timeline & How We Got Here (7-20s)",
        "3. The Conflict: Incentives, Capital & Geopolitics (20-38s)",
        "4. The Critical Counter-Perspective: What Others Are Missing (38-48s)",
        "5. The Forward Horizon: Plausible Scenarios & Strategic Takeaway (48-60s)",
      ],
    },
    editingIdentity: {
      visualCharacter: [
        "Analytical",
        "Editorial",
        "Intelligent",
        "Composed",
        "Forward-Looking",
      ],
      editingPhilosophy:
        "Cinematic journalism meets technology intelligence. Every asset should convey scope, historical weight, and strategic gravity without resorting to sensationalist hyperbole.",
      editingStyle: [
        "Documentary-inspired storytelling with layered archival visual assets",
        "Animated geographic maps, trade corridors, and foundry supply lines",
        "Interactive timelines sweeping through key historical inflections",
        "Data visualisations with glowing violet curves and supply-demand bands",
        "Desaturated cinematic B-roll with rich grain and anamorphic flares",
        "Editorial serif-accented typography for key quotes and corporate names",
        "Measured, suspenseful pacing that allows profound insights to resonate",
      ],
      colorPalette: {
        primary: "#7657FF", // Deep Strategic Violet
        secondary: "#8DDCFF", // Icy Blue
        background: "#151426", // Deep Editorial Midnight
        surface: "#1F1D36",
        accent: "#7657FF",
        textPrimary: "#EDE9FF", // Pale Lavender
        textSecondary: "#A5A0C8",
        border: "#2F2B52",
      },
      typography: {
        headingFont: "Inter, Playfair Display, sans-serif",
        bodyFont: "Inter, sans-serif",
        codeFont: "JetBrains Mono, monospace",
        weightHierarchy: {
          hero: "font-bold tracking-tight",
          section: "font-semibold tracking-normal",
          body: "font-normal leading-relaxed",
        },
      },
      motionPrinciples: [
        "Slow cinematic zooms and parallax drifts (1500ms)",
        "Smooth luminous map line animations",
        "Subtle film grain texture and vignette",
        "Deliberate, contemplative ease-in-out pacing",
      ],
      transitions: [
        "Deep exposure dip or cross-dissolve",
        "Light leak or subtle anamorphic streak",
        "Timeline marker slide",
      ],
      captionStyle: {
        font: "Inter",
        case: "sentencecase",
        highlightColor: "#8DDCFF",
        animation: "soft luminous fade-in with pale lavender text",
      },
      soundDesign:
        "Deep cinematic braams, subtle ticking clock motifs, atmospheric ambient drones, orchestral pulse that builds tension toward the conclusion.",
      sceneArchetypes: [
        "Geopolitical Chessboard Map",
        "Historical Timeline Inflection",
        "Financial Capital Flow / Balance Sheet Breakdown",
        "Corporate Rivalry Matrix",
        "Strategic Horizon Scenario Radar",
      ],
      lowerThirdsStyle:
        "Refined minimalist line with #7657FF accent, company logo silhouette, and date stamp.",
      thumbnailRules: [
        "Deep Midnight (#151426) with striking Violet (#7657FF) and Icy Blue (#8DDCFF) accents",
        "Cinematic portrait of key protagonist or hardware component",
        "Editorial question that challenges the status quo",
        "High-production documentary visual tone",
      ],
      davinciTemplateReference: "CA_IntelligenceReport_Vertical_v1.drp",
      remotionComponentReference: "CAIntelligenceComposition",
      exportSpecs: {
        aspectRatio: "9:16",
        resolution: "1080x1920",
        frameRate: 30,
        colorSpace: "Rec.709",
      },
    },
  },
};

export const BRAND_LIST: BrandConfig[] = Object.values(BRANDS);

export function getBrandConfig(brandId: BrandId): BrandConfig {
  return BRANDS[brandId] ?? BRANDS.TECHENIGMASTUDIOS;
}

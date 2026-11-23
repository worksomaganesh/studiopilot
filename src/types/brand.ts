export type BrandId = "TECHENIGMASTUDIOS" | "AI_THAT_WORKS" | "CONTXT_AHEAD";

export interface BrandColorPalette {
  primary: string;
  secondary?: string;
  background: string;
  surface: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
}

export interface BrandTypography {
  headingFont: string;
  bodyFont: string;
  codeFont?: string;
  weightHierarchy: {
    hero: string;
    section: string;
    body: string;
  };
}

export interface BrandEditingIdentity {
  visualCharacter: string[];
  editingPhilosophy: string;
  editingStyle: string[];
  colorPalette: BrandColorPalette;
  typography: BrandTypography;
  motionPrinciples: string[];
  transitions: string[];
  captionStyle: {
    font: string;
    case: "uppercase" | "titlecase" | "sentencecase";
    highlightColor: string;
    animation: string;
  };
  soundDesign: string;
  sceneArchetypes: string[];
  lowerThirdsStyle: string;
  thumbnailRules: string[];
  davinciTemplateReference: string;
  remotionComponentReference: string;
  exportSpecs: {
    aspectRatio: string;
    resolution: string;
    frameRate: number;
    colorSpace: string;
  };
}

export interface BrandConfig {
  id: BrandId;
  name: string;
  tagline: string;
  editorialPurpose: string;
  prefix: string; // e.g. "TES", "ATW", "CA"
  researchMode: {
    name: string;
    focusAreas: string[];
    primaryMethodology: string;
    preferredSources: string[];
  };
  scriptSystem: {
    name: string;
    purpose: string;
    tone: string;
    pacing: string;
    keyCharacteristics: string[];
    structureTemplate: string[];
  };
  editingIdentity: BrandEditingIdentity;
}

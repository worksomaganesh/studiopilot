import { BrandId } from "./brand";

export interface EditingPlanScene {
  sceneNumber: number;
  narration: string;
  visualDirection: string;
  motion: string;
  requiredAssets: string[];
  captionStyle: string;
  soundCue?: string;
  davinciTrackSuggestion: {
    videoTrack1: string; // e.g. "A-Roll / Main Presenter or Code screen"
    videoTrack2?: string; // e.g. "B-Roll / Overlay diagram"
    videoTrack3?: string; // e.g. "Kinetic Typography / Callout"
    audioTrack1: string; // e.g. "Narration Voiceover"
    audioTrack2: string; // e.g. "Sound Effects (whoosh, pop, click)"
    audioTrack3: string; // e.g. "Ambient / Bed Music"
  };
  remotionComponentKey?: string;
  remotionProps?: Record<string, unknown>;
}

export interface EditingPlan {
  id: string;
  projectId: string;
  brandId: BrandId;
  scriptDocumentId: string;
  title: string;
  version: number;
  scenes: EditingPlanScene[];
  aspectRatio: "9:16" | "16:9" | "1:1";
  resolution: "1080x1920" | "2160x3840" | "1920x1080";
  frameRate: 30 | 60;
  brandGuidelineSummary: {
    visualCharacter: string[];
    colorPalette: Record<string, string>;
    motionPrinciples: string[];
    transitions: string[];
  };
  davinciResolveExport: {
    edlText: string;
    csvManifest: string;
    importInstructions: string;
  };
  remotionScaffold: {
    entryComponent: string;
    jsonSceneConfig: string;
  };
  createdAt: string;
  updatedAt: string;
}

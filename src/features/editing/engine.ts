import { BrandId } from "@/types/brand";
import { ScriptDocument } from "@/types/script";
import { EditingPlan, EditingPlanScene } from "@/types/editing";
import { getBrandConfig } from "@/brands/config";

export function generateEditingPlanFromScript(
  script: ScriptDocument,
  projectId: string
): EditingPlan {
  const brandConfig = getBrandConfig(script.brandId);
  const planId = `edp-${Date.now()}`;

  const scenes: EditingPlanScene[] = script.scenes.map((s, idx) => {
    let requiredAssets: string[] = [];
    let soundCue = "";
    let remotionKey = "";

    if (script.brandId === "TECHENIGMASTUDIOS") {
      requiredAssets = [
        "1080x1920 Terminal Screen Recording (4K 60fps)",
        "Animated Neural Network / Tensor Visualizer Overlay",
        "Kinetic Code Snippet Callout Card",
      ];
      soundCue = idx === 0 ? "Mechanical keyboard click + Sub-bass hit" : "Laser tick on code highlight";
      remotionKey = "TESTechnicalDiagram";
    } else if (script.brandId === "AI_THAT_WORKS") {
      requiredAssets = [
        "Product Screencast framed in Glassmorphic Browser (1080x1920)",
        "Kinetic Cursor Trail Asset",
        "Workflow Node Graph Animation",
      ];
      soundCue = idx === 0 ? "Digital UI chime + Mouse click" : "Snappy whoosh on slide transition";
      remotionKey = "ATWWorkflowGraph";
    } else {
      requiredAssets = [
        "Cinematic 4K Archival B-Roll (Rec.709)",
        "Geopolitical Map Asset with Glowing Foundry Routes",
        "Editorial Serif Typography Card",
      ];
      soundCue = idx === 0 ? "Deep cinematic braam drone" : "Atmospheric pulse build";
      remotionKey = "CAHistoricalTimeline";
    }

    return {
      sceneNumber: s.sceneNumber,
      narration: s.narration,
      visualDirection: s.visualDirection,
      motion: s.motionDirection,
      requiredAssets,
      captionStyle: `${brandConfig.editingIdentity.captionStyle.font} (${brandConfig.editingIdentity.captionStyle.case}) with ${brandConfig.editingIdentity.captionStyle.highlightColor} highlight`,
      soundCue,
      davinciTrackSuggestion: {
        videoTrack1: "V1: Main Presenter / Screen Recording Base",
        videoTrack2: "V2: B-Roll & Visual Schematic Overlay",
        videoTrack3: "V3: Kinetic Typography & Caption Layer",
        audioTrack1: "A1: Narration Voiceover (Mono / Leveled to -14 LUFS)",
        audioTrack2: `A2: Sound Design (${soundCue})`,
        audioTrack3: "A3: Ambient Bed Music (Ducked -18dB under speech)",
      },
      remotionComponentKey: remotionKey,
      remotionProps: {
        brandId: script.brandId,
        sceneNumber: s.sceneNumber,
        headlineText: s.onScreenText,
        durationInFrames: s.estimatedDurationSeconds * 60,
      },
    };
  });

  // Generate DaVinci Resolve EDL (CMX 3600 Standard format)
  let currentFrame = 0;
  const fps = 60;
  let edlText = `TITLE: ${script.title.toUpperCase()}\nFCM: NON-DROP FRAME\n\n`;

  scenes.forEach((sc, i) => {
    const durationFrames = (script.scenes[i]?.estimatedDurationSeconds || 10) * fps;
    const startFrame = currentFrame;
    const endFrame = currentFrame + durationFrames;

    const formatTC = (f: number) => {
      const h = String(Math.floor(f / (fps * 3600))).padStart(2, "0");
      const m = String(Math.floor((f % (fps * 3600)) / (fps * 60))).padStart(2, "0");
      const s = String(Math.floor((f % (fps * 60)) / fps)).padStart(2, "0");
      const fr = String(f % fps).padStart(2, "0");
      return `${h}:${m}:${s}:${fr}`;
    };

    const editIndex = String(i + 1).padStart(3, "0");
    edlText += `${editIndex}  AX       V     C        00:00:00:00 ${formatTC(durationFrames)} ${formatTC(startFrame)} ${formatTC(endFrame)}\n`;
    edlText += `* FROM CLIP NAME: SCENE_${sc.sceneNumber}_VISUAL\n`;
    edlText += `* COMMENT: ${sc.visualDirection.slice(0, 60)}\n\n`;

    currentFrame = endFrame;
  });

  // Generate DaVinci Resolve Timeline CSV Manifest
  const csvHeaders = "Scene,DurationSeconds,Narration,VisualDirection,MotionDirection,Captions,Assets,SoundDesign\n";
  const csvRows = scenes
    .map(
      (s) =>
        `"${s.sceneNumber}","${script.scenes[s.sceneNumber - 1]?.estimatedDurationSeconds || 10}","${s.narration.replace(/"/g, '""')}","${s.visualDirection.replace(/"/g, '""')}","${s.motion.replace(/"/g, '""')}","${s.captionStyle.replace(/"/g, '""')}","${s.requiredAssets.join("; ")}","${s.soundCue}"`
    )
    .join("\n");
  const csvManifest = csvHeaders + csvRows;

  // Remotion Scaffold Configuration
  const remotionScaffold = {
    entryComponent: brandConfig.editingIdentity.remotionComponentReference,
    jsonSceneConfig: JSON.stringify(
      {
        composition: {
          id: `Composition_${script.brandId}`,
          fps: 60,
          width: 1080,
          height: 1920,
          durationInFrames: currentFrame,
        },
        brandColors: brandConfig.editingIdentity.colorPalette,
        scenes: scenes.map((s) => ({
          sceneNumber: s.sceneNumber,
          component: s.remotionComponentKey,
          props: s.remotionProps,
        })),
      },
      null,
      2
    ),
  };

  return {
    id: planId,
    projectId,
    brandId: script.brandId,
    scriptDocumentId: script.id,
    title: `Production Plan: ${script.title}`,
    version: 1,
    scenes,
    aspectRatio: "9:16",
    resolution: "1080x1920",
    frameRate: 60,
    brandGuidelineSummary: {
      visualCharacter: brandConfig.editingIdentity.visualCharacter,
      colorPalette: {
        primary: brandConfig.editingIdentity.colorPalette.primary,
        background: brandConfig.editingIdentity.colorPalette.background,
        accent: brandConfig.editingIdentity.colorPalette.accent,
      },
      motionPrinciples: brandConfig.editingIdentity.motionPrinciples,
      transitions: brandConfig.editingIdentity.transitions,
    },
    davinciResolveExport: {
      edlText,
      csvManifest,
      importInstructions:
        "1. Open DaVinci Resolve Studio -> File -> Import -> Timeline...\n2. Select this .edl file, set Frame Rate to 60 fps.\n3. Media pool clips matching SCENE_X will automatically conform to the generated timeline.\n4. Apply the brand color grade LUT from the StudioPilot Assets folder.",
    },
    remotionScaffold,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

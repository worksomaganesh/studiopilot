import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateBrandScript } from "@/features/scripts/engine";
import { BrandId } from "@/types/brand";
import { ScriptDocument } from "@/types/script";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") || undefined;
  const scripts = db.getScripts(projectId);
  return NextResponse.json({ success: true, scripts });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action || "generate";

    if (action === "approve") {
      const { scriptId } = body;
      const existing = db.getScript(scriptId);
      if (!existing) {
        return NextResponse.json({ error: "Not Found", message: "Script not found" }, { status: 404 });
      }

      existing.isApproved = true;
      existing.approvedAt = new Date().toISOString();
      db.saveScript(existing);

      return NextResponse.json({ success: true, script: existing });
    }

    if (action === "save_direct") {
      const script: ScriptDocument = body.script;
      if (!script || !script.id) {
        return NextResponse.json({ error: "Validation Error", message: "Invalid script payload" }, { status: 400 });
      }
      const saved = db.saveScript(script);
      return NextResponse.json({ success: true, script: saved });
    }

    // Default action: generate
    const { brandId, projectId, researchDossierId, patternIds, targetPlatform, targetDurationSeconds, audienceLevel, additionalInstructions } = body;

    let researchDossier = null;
    if (researchDossierId) {
      researchDossier = db.getResearchRun(researchDossierId);
    } else if (projectId) {
      const projectDossiers = db.getResearchRuns(projectId);
      researchDossier = projectDossiers[0] || null;
    }

    if (!researchDossier) {
      return NextResponse.json(
        { error: "Validation Error", message: "A valid Research Dossier is required to generate grounded scripts." },
        { status: 400 }
      );
    }

    const allPatterns = db.getPatterns();
    const selectedPatterns = Array.isArray(patternIds)
      ? allPatterns.filter((p) => patternIds.includes(p.id))
      : allPatterns.slice(0, 2);

    const result = await generateBrandScript({
      brandId: (brandId || researchDossier.brandId) as BrandId,
      projectId,
      researchDossier,
      selectedPatterns,
      targetPlatform: targetPlatform || "YouTube Shorts",
      targetDurationSeconds: Number(targetDurationSeconds) || 60,
      audienceLevel: audienceLevel || "Intermediate",
      additionalInstructions,
    });

    if (result.error) {
      return NextResponse.json({ error: "Generation Error", message: result.error }, { status: 422 });
    }

    db.saveScript(result.script);

    return NextResponse.json({
      success: true,
      script: result.script,
      warning: result.warning,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Server Error", message: msg }, { status: 500 });
  }
}

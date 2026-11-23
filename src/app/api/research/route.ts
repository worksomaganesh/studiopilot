import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runResearchWorkflow } from "@/features/research/engine";
import { ResearchRequest } from "@/types/research";
import { BRANDS } from "@/brands/config";
import { BrandId } from "@/types/brand";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") || undefined;
  const runs = db.getResearchRuns(projectId);
  return NextResponse.json({ success: true, researchRuns: runs });
}

export async function POST(request: Request) {
  try {
    const body: ResearchRequest = await request.json();

    if (!body.brandId || !body.conceptName || !body.exactTopic) {
      return NextResponse.json(
        { error: "Validation Error", message: "brandId, conceptName, and exactTopic are required." },
        { status: 400 }
      );
    }

    if (!BRANDS[body.brandId as BrandId]) {
      return NextResponse.json(
        { error: "Validation Error", message: `Invalid brandId: ${body.brandId}` },
        { status: 400 }
      );
    }

    const result = await runResearchWorkflow({
      ...body,
      subtopics: Array.isArray(body.subtopics) && body.subtopics.length > 0 ? body.subtopics : ["Fundamental mechanics", "Practical applications", "Common misconceptions"],
    });

    if (result.error) {
      return NextResponse.json({ error: "Research Error", message: result.error }, { status: 422 });
    }

    if (!result.dossier) {
      return NextResponse.json({ error: "Research Error", message: "Failed to generate research dossier." }, { status: 500 });
    }

    // Persist dossier
    db.saveResearchRun(result.dossier);

    return NextResponse.json({
      success: true,
      dossier: result.dossier,
      warning: result.warning,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Server Error", message: msg }, { status: 500 });
  }
}

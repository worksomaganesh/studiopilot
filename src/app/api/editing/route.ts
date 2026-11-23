import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateEditingPlanFromScript } from "@/features/editing/engine";
import { BrandId } from "@/types/brand";
import { getBrandConfig } from "@/brands/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") || undefined;
  const brandId = searchParams.get("brandId") as BrandId | null;

  if (brandId && !projectId) {
    const brandConfig = getBrandConfig(brandId);
    return NextResponse.json({
      success: true,
      editingProfile: brandConfig.editingIdentity,
    });
  }

  const plans = db.getEditingPlans(projectId);
  return NextResponse.json({ success: true, editingPlans: plans });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scriptId, projectId } = body;

    if (!scriptId) {
      return NextResponse.json(
        { error: "Validation Error", message: "scriptId is required to generate an editing plan." },
        { status: 400 }
      );
    }

    const script = db.getScript(scriptId);
    if (!script) {
      return NextResponse.json({ error: "Not Found", message: "Script not found." }, { status: 404 });
    }

    const resolvedProjectId = projectId || script.projectId || "PROJ-DEFAULT";
    const editingPlan = generateEditingPlanFromScript(script, resolvedProjectId);

    db.saveEditingPlan(editingPlan);

    return NextResponse.json({
      success: true,
      editingPlan,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Server Error", message: msg }, { status: 500 });
  }
}

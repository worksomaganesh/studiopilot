import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = db.getProject(id);

  if (!project) {
    return NextResponse.json({ error: "Not Found", message: `Project ${id} not found` }, { status: 404 });
  }

  const activities = db.getActivities(id);
  const researchRuns = db.getResearchRuns(id);
  const scripts = db.getScripts(id);
  const editingPlans = db.getEditingPlans(id);
  const assets = db.getAssets(id);
  const publishingRecords = db.getPublishingRecords(id);
  const performanceSnapshots = db.getPerformanceSnapshots(id);

  return NextResponse.json({
    success: true,
    project,
    activities,
    researchRuns,
    scripts,
    editingPlans,
    assets,
    publishingRecords,
    performanceSnapshots,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = db.updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Not Found", message: `Project ${id} not found` }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Server Error", message: msg }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = db.deleteProject(id);

  if (!deleted) {
    return NextResponse.json({ error: "Not Found", message: `Project ${id} not found` }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: `Project ${id} deleted` });
}

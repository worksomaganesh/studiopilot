import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BrandId } from "@/types/brand";
import { BRANDS } from "@/brands/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId") as BrandId | null;

  const projects = db.getProjects(brandId || undefined);
  return NextResponse.json({ success: true, projects });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brandId, title, conceptName, targetPlatform, targetDurationSeconds, targetAudienceLevel, tags } = body;

    if (!brandId || !title || !conceptName) {
      return NextResponse.json(
        { error: "Validation Error", message: "brandId, title, and conceptName are required." },
        { status: 400 }
      );
    }

    if (!BRANDS[brandId as BrandId]) {
      return NextResponse.json(
        { error: "Validation Error", message: `Invalid brandId '${brandId}'` },
        { status: 400 }
      );
    }

    const newProject = db.createProject({
      brandId: brandId as BrandId,
      title,
      conceptName,
      status: "INBOX",
      targetPlatform: targetPlatform || "YouTube Shorts",
      targetDurationSeconds: targetDurationSeconds || 60,
      targetAudienceLevel: targetAudienceLevel || "Intermediate",
      tags: Array.isArray(tags) ? tags : [],
    });

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Server Error", message: msg }, { status: 500 });
  }
}

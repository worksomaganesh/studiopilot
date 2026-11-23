import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzeReelReference } from "@/features/creative-intelligence/engine";
import { CreativePattern, CreativeReel } from "@/types/creative-intelligence";
import { BrandId } from "@/types/brand";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'reels' | 'patterns'
  const brandId = searchParams.get("brandId") as BrandId | null;

  if (type === "patterns") {
    const patterns = db.getPatterns(brandId || undefined);
    return NextResponse.json({ success: true, patterns });
  }

  const reels = db.getReels();
  const patterns = db.getPatterns(brandId || undefined);
  return NextResponse.json({ success: true, reels, patterns });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action || "save_reel";

    if (action === "analyze") {
      const { transcriptText, publicUrl, platform, creatorHandle, creatorFollowerCount, viewCount, likeCount, commentCount, titleOrCaption, niche, tags } = body;

      if (!transcriptText || !publicUrl || !creatorHandle) {
        return NextResponse.json(
          { error: "Validation Error", message: "transcriptText, publicUrl, and creatorHandle are required for analysis." },
          { status: 400 }
        );
      }

      const result = await analyzeReelReference({
        transcriptText,
        publicUrl,
        platform: platform || "YouTube Shorts",
        creatorHandle,
        creatorFollowerCount: Number(creatorFollowerCount) || 10000,
        viewCount: Number(viewCount) || 50000,
        likeCount: Number(likeCount) || 2500,
        commentCount: Number(commentCount) || 120,
        titleOrCaption: titleOrCaption || "Reference reel",
      });

      const reelId = `reel-${Date.now()}`;
      const newReel: CreativeReel = {
        id: reelId,
        platform: platform || "YouTube Shorts",
        publicUrl,
        creatorHandle,
        creatorFollowerCount: Number(creatorFollowerCount) || 10000,
        titleOrCaption: titleOrCaption || "Observed reference",
        videoDurationSeconds: 60,
        niche: niche || "AI & Tech",
        transcriptText,
        tags: Array.isArray(tags) ? tags : ["Shorts"],
        linkedPatternIds: [],
        latestMetrics: {
          id: `met-${Date.now()}`,
          reelId,
          observedAt: new Date().toISOString(),
          viewCount: Number(viewCount) || 50000,
          likeCount: Number(likeCount) || 2500,
          commentCount: Number(commentCount) || 120,
          creatorFollowersAtObservation: Number(creatorFollowerCount) || 10000,
          viewToFollowerRatio: Number(((Number(viewCount) || 50000) / Math.max(1, Number(creatorFollowerCount) || 10000)).toFixed(2)),
          dataSource: "Manually submitted data",
        },
        metricHistory: [],
        analysis: result.analysis,
        createdAt: new Date().toISOString(),
      };

      db.saveReel(newReel);

      // Save any newly extracted patterns
      for (const pat of result.extractedPatterns) {
        if (pat.id && pat.name) {
          db.savePattern(pat as CreativePattern);
        }
      }

      return NextResponse.json({
        success: true,
        reel: newReel,
        analysis: result.analysis,
        extractedPatterns: result.extractedPatterns,
        warning: result.warning,
      });
    }

    if (action === "save_pattern") {
      const pattern: CreativePattern = body.pattern;
      if (!pattern || !pattern.name || !pattern.whyItWorks) {
        return NextResponse.json(
          { error: "Validation Error", message: "Pattern name and whyItWorks are required." },
          { status: 400 }
        );
      }
      const saved = db.savePattern(pattern);
      return NextResponse.json({ success: true, pattern: saved });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Server Error", message: msg }, { status: 500 });
  }
}

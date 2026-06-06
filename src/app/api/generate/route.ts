import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_MAX_CHARS,
  DEFAULT_MAX_LINES,
  DEFAULT_TAB_SIZE,
  normalizeAa,
  ValidationError,
} from "@/lib/aa/normalize";
import { renderSvg } from "@/lib/aa/renderSvg";
import { AA_METRICS } from "@/lib/aa/metrics";
import { getArtifactCollection, getFirestoreDb } from "@/lib/firestore/client";
import { createShortId } from "@/lib/id";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-vercel-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const payload = (await request.json()) as { text?: string; tabSize?: number };
    const originalText = payload.text ?? "";
    const tabSize = payload.tabSize ?? Number(process.env.TAB_WIDTH ?? DEFAULT_TAB_SIZE);

    const normalized = normalizeAa(originalText, {
      tabSize,
      maxChars: Number(process.env.MAX_INPUT_CHARS ?? DEFAULT_MAX_CHARS),
      maxLines: Number(process.env.MAX_INPUT_LINES ?? DEFAULT_MAX_LINES),
    });

    const svg = renderSvg(normalized.normalized);
    const id = createShortId();

    const doc = {
      id,
      originalText,
      normalizedText: normalized.normalized,
      svg,
      tabSize,
      createdAt: new Date().toISOString(),
      metadata: {
        metrics: AA_METRICS,
        maxChars: Number(process.env.MAX_INPUT_CHARS ?? DEFAULT_MAX_CHARS),
        maxLines: Number(process.env.MAX_INPUT_LINES ?? DEFAULT_MAX_LINES),
      },
    };

    const db = getFirestoreDb();
    await db.collection(getArtifactCollection()).doc(id).set(doc);

    const origin = request.nextUrl.origin;
    const svgUrl = `${origin}/api/svg/${id}`;

    return NextResponse.json({
      id,
      svgUrl,
      permalinkUrl: `${origin}/a/${id}`,
      markdown: `![aa](${svgUrl})`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate SVG";
    const status = error instanceof ValidationError ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

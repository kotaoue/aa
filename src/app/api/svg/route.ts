import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import {
    AA_METRICS,
    calculateSvgDimensions,
    FONT_SIZE_PX,
} from "@/lib/aa/metrics";
import {
    DEFAULT_MAX_CHARS,
    DEFAULT_MAX_LINES,
    DEFAULT_TAB_SIZE,
    ValidationError,
    normalizeAa,
} from "@/lib/aa/normalize";

export const runtime = "nodejs";

let fontRegistered = false;

function ensureTextarFontRegistered(): void {
    if (fontRegistered) {
        return;
    }

    const fontPath = path.join(process.cwd(), "public", "fonts", "textar.ttf");
    const registered = GlobalFonts.registerFromPath(fontPath, "Textar");
    if (!registered) {
        throw new Error("Failed to register Textar font");
    }

    fontRegistered = true;
}

type SvgRequestBody = {
    text?: string;
};

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as SvgRequestBody;
        const normalized = normalizeAa(body.text ?? "", {
            tabSize: DEFAULT_TAB_SIZE,
            maxChars: DEFAULT_MAX_CHARS,
            maxLines: DEFAULT_MAX_LINES,
        });

        ensureTextarFontRegistered();

        const lines = normalized.normalized.split("\n");
        const dimensions = calculateSvgDimensions(lines);
        const outerPadding = 4;
        const canvas = createCanvas(
            dimensions.width + outerPadding * 2,
            dimensions.height + outerPadding * 2,
        );
        const context = canvas.getContext("2d");

        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "#111";
        context.textBaseline = "top";
        context.font = `${FONT_SIZE_PX}px Textar`;

        lines.forEach((line, index) => {
            context.fillText(
                line,
                outerPadding + AA_METRICS.paddingX,
                outerPadding + AA_METRICS.paddingY + AA_METRICS.lineHeight * index,
            );
        });

        const png = canvas.toBuffer("image/png");
        const pngBody = new Uint8Array(png);

        return new NextResponse(pngBody, {
            headers: {
                "content-type": "image/png",
                "content-disposition": 'attachment; filename="aa.png"',
                "cache-control": "no-store",
            },
        });
    } catch (error) {
        const message =
            error instanceof ValidationError
                ? error.message
                : error instanceof Error
                    ? error.message
                    : "Failed to generate PNG";

        return NextResponse.json({ error: message }, { status: 400 });
    }
}

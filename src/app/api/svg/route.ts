import { NextRequest, NextResponse } from "next/server";
import {
    DEFAULT_MAX_CHARS,
    DEFAULT_MAX_LINES,
    DEFAULT_TAB_SIZE,
    ValidationError,
    normalizeAa,
} from "@/lib/aa/normalize";
import { renderOutlinedSvg } from "@/lib/aa/renderOutlinedSvg";

export const runtime = "nodejs";

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
        const svg = await renderOutlinedSvg(normalized.normalized);

        return new NextResponse(svg, {
            headers: {
                "content-type": "image/svg+xml; charset=utf-8",
                "content-disposition": 'attachment; filename="aa.svg"',
                "cache-control": "no-store",
            },
        });
    } catch (error) {
        const message =
            error instanceof ValidationError
                ? error.message
                : error instanceof Error
                    ? error.message
                    : "Failed to generate outlined SVG";

        return NextResponse.json({ error: message }, { status: 400 });
    }
}

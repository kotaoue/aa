import { NextRequest, NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
    DEFAULT_MAX_CHARS,
    DEFAULT_MAX_LINES,
    DEFAULT_TAB_SIZE,
    ValidationError,
    normalizeAa,
} from "@/lib/aa/normalize";
import { renderSvg } from "@/lib/aa/renderSvg";
import sharp from "sharp";

export const runtime = "nodejs";

let cachedFontFaceCss: string | null = null;

async function getInlineTextarFontFaceCss(): Promise<string> {
    if (cachedFontFaceCss) {
        return cachedFontFaceCss;
    }

    const fontPath = path.join(process.cwd(), "public", "fonts", "textar.ttf");
    const fontBuffer = await readFile(fontPath);
    const fontBase64 = fontBuffer.toString("base64");

    cachedFontFaceCss = [
        "@font-face {",
        "  font-family: 'Textar';",
        "  font-style: normal;",
        "  font-weight: normal;",
        "  src: url('data:font/ttf;base64," + fontBase64 + "') format('truetype');",
        "}",
    ].join("\n");

    return cachedFontFaceCss;
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
        const svg = renderSvg(normalized.normalized, {
            fontFaceCss: await getInlineTextarFontFaceCss(),
        });
        const png = await sharp(Buffer.from(svg)).png().toBuffer();
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

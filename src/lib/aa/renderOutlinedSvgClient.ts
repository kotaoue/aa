import * as opentype from "opentype.js";
import {
    OutlineFont,
    RenderOutlinedSvgOptions,
    renderOutlinedSvgWithFont,
} from "@/lib/aa/renderOutlinedSvgShared";

const OUTLINE_FONT_URL = "/fonts/m-plus-1-code-japanese-400-normal.woff";

let fontPromise: Promise<OutlineFont> | null = null;

async function loadOutlineFontInBrowser(): Promise<OutlineFont> {
    if (!fontPromise) {
        fontPromise = fetch(OUTLINE_FONT_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load outline font");
                }

                return response.arrayBuffer();
            })
            .then((buffer) => opentype.parse(buffer) as OutlineFont);
    }

    return fontPromise;
}

export async function renderOutlinedSvgInBrowser(
    normalizedText: string,
    options: RenderOutlinedSvgOptions = {},
): Promise<string> {
    const font = await loadOutlineFontInBrowser();
    return renderOutlinedSvgWithFont(font, normalizedText, options);
}

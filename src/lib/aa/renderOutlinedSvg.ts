import { readFile } from "node:fs/promises";
import path from "node:path";
import * as opentype from "opentype.js";
import {
    OutlineFont,
    RenderOutlinedSvgOptions,
    renderOutlinedSvgWithFont,
} from "@/lib/aa/renderOutlinedSvgShared";

const OUTLINE_FONT_PATH = path.join(
    process.cwd(),
    "public",
    "fonts",
    "m-plus-1-code-japanese-400-normal.woff",
);

let fontPromise: Promise<OutlineFont> | null = null;

async function loadOutlineFont(): Promise<OutlineFont> {
    if (!fontPromise) {
        fontPromise = readFile(OUTLINE_FONT_PATH).then((buffer) => {
            const arrayBuffer = buffer.buffer.slice(
                buffer.byteOffset,
                buffer.byteOffset + buffer.byteLength,
            );
            return opentype.parse(arrayBuffer) as OutlineFont;
        });
    }

    return fontPromise;
}

export async function renderOutlinedSvg(
    normalizedText: string,
    options: RenderOutlinedSvgOptions = {},
): Promise<string> {
    const font = await loadOutlineFont();
    return renderOutlinedSvgWithFont(font, normalizedText, options);
}

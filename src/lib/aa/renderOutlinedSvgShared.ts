import { AA_METRICS, FONT_SIZE_PX } from "@/lib/aa/metrics";

export type RenderOutlinedSvgOptions = {
    width?: number;
    height?: number;
    lineHeight?: number;
    paddingX?: number;
    paddingY?: number;
    fill?: string;
    background?: string;
};

export type OutlineFont = {
    unitsPerEm: number;
    ascender: number;
    getAdvanceWidth(text: string, fontSize: number): number;
    getPath(text: string, x: number, y: number, fontSize: number): { toPathData(precision?: number): string };
};

function calculateOutlinedDimensions(
    font: OutlineFont,
    lines: string[],
    fontSize: number,
    lineHeight: number,
    paddingX: number,
    paddingY: number,
) {
    const safeLines = lines.length > 0 ? lines : [""];
    const maxWidth = safeLines.reduce(
        (currentMax, line) => Math.max(currentMax, font.getAdvanceWidth(line, fontSize)),
        0,
    );

    return {
        width: Math.max(1, Math.ceil(maxWidth + paddingX * 2)),
        height: Math.max(1, Math.ceil(safeLines.length * lineHeight + paddingY * 2)),
    };
}

export function renderOutlinedSvgWithFont(
    font: OutlineFont,
    normalizedText: string,
    options: RenderOutlinedSvgOptions = {},
): string {
    const lines = normalizedText.split("\n");
    const lineHeight = options.lineHeight ?? AA_METRICS.lineHeight;
    const paddingX = options.paddingX ?? AA_METRICS.paddingX;
    const paddingY = options.paddingY ?? AA_METRICS.paddingY;
    const fill = options.fill ?? "#111";
    const background = options.background ?? "#fff";
    const dimensions = calculateOutlinedDimensions(
        font,
        lines,
        FONT_SIZE_PX,
        lineHeight,
        paddingX,
        paddingY,
    );
    const width = options.width ?? dimensions.width;
    const height = options.height ?? dimensions.height;
    const ascender = (font.ascender / font.unitsPerEm) * FONT_SIZE_PX;

    const paths = lines
        .map((line, index) => {
            const baselineY = paddingY + lineHeight * index + ascender;
            const pathData = font.getPath(line, paddingX, baselineY, FONT_SIZE_PX).toPathData(2);
            return pathData.length > 0 ? `<path d="${pathData}" />` : "";
        })
        .join("");

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="ASCII art">`,
        `<rect width="100%" height="100%" fill="${background}" />`,
        `<g fill="${fill}">${paths}</g>`,
        "</svg>",
    ].join("");
}

export const FONT_SIZE_PX = 16;
export const LINE_HEIGHT_RATIO = 1.1;
export const FONT_FAMILY = "'ＭＳ Ｐゴシック', 'MS PGothic', '梅Pゴシック', Textar, sans-serif";

export const AA_METRICS = {
  // Fallback metrics used when browser-side text measurement is unavailable.
  charWidth: 8.8,
  lineHeight: FONT_SIZE_PX * LINE_HEIGHT_RATIO,
  paddingX: 0,
  paddingY: 0,
} as const;

export type SvgDimensions = {
  width: number;
  height: number;
};

export function calculateSvgDimensions(lines: string[]): SvgDimensions {
  const safeLines = lines.length > 0 ? lines : [""];
  const maxChars = safeLines.reduce(
    (max, line) => Math.max(max, [...line].length),
    0,
  );

  const width = Math.ceil(maxChars * AA_METRICS.charWidth + AA_METRICS.paddingX * 2);
  const height = Math.ceil(
    safeLines.length * AA_METRICS.lineHeight + AA_METRICS.paddingY * 2,
  );

  return { width, height };
}

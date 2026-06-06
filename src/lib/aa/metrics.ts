export const FONT_SIZE_PT = 16;
export const FONT_FAMILY = "'MS PGothic', 'ＭＳ Ｐゴシック', monospace";

export const AA_METRICS = {
  charWidth: 9.6,
  lineHeight: 20,
  paddingX: 12,
  paddingY: 12,
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

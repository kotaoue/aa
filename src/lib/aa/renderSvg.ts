import {
  AA_METRICS,
  calculateSvgDimensions,
  FONT_FAMILY,
  FONT_SIZE_PT,
} from "@/lib/aa/metrics";

export function escapeXml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderSvg(normalizedText: string): string {
  const lines = normalizedText.split("\n");
  const { width, height } = calculateSvgDimensions(lines);

  const tspans = lines
    .map((line, index) => {
      const y = AA_METRICS.paddingY + AA_METRICS.lineHeight * (index + 1);
      return `<tspan x="${AA_METRICS.paddingX}" y="${y}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="ASCII art">`,
    `<rect width="100%" height="100%" fill="#fff" />`,
    `<text xml:space="preserve" font-family="${FONT_FAMILY}" font-size="${FONT_SIZE_PT}pt" fill="#111">${tspans}</text>`,
    "</svg>",
  ].join("");
}

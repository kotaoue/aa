import {
  AA_METRICS,
  calculateSvgDimensions,
  FONT_FAMILY,
  FONT_SIZE_PX,
} from "@/lib/aa/metrics";

type RenderSvgOptions = {
  width?: number;
  height?: number;
  lineHeight?: number;
  paddingX?: number;
  paddingY?: number;
  fontFaceCss?: string;
};

export function escapeXml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderSvg(normalizedText: string, options: RenderSvgOptions = {}): string {
  const lines = normalizedText.split("\n");
  const fallbackDimensions = calculateSvgDimensions(lines);
  const width = options.width ?? fallbackDimensions.width;
  const height = options.height ?? fallbackDimensions.height;
  const lineHeight = options.lineHeight ?? AA_METRICS.lineHeight;
  const paddingX = options.paddingX ?? AA_METRICS.paddingX;
  const paddingY = options.paddingY ?? AA_METRICS.paddingY;

  const tspans = lines
    .map((line, index) => {
      const y = paddingY + lineHeight * index;
      return `<tspan x="${paddingX}" y="${y}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  const embeddedFontCss = [
    "@font-face {",
    "  font-family: 'Textar';",
    "  font-style: normal;",
    "  font-weight: normal;",
    "  src: local('Textar'),",
    "    url('https://marmooo.github.io/fonts/textar-light.woff2') format('woff2'),",
    "    url('https://marmooo.github.io/fonts/textar-light.woff') format('woff'),",
    "    url('https://marmooo.github.io/fonts/textar-light.ttf') format('truetype');",
    "}",
  ].join("\n");
  const fontFaceCss = options.fontFaceCss ?? embeddedFontCss;

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="ASCII art">`,
    `<style>${fontFaceCss}</style>`,
    `<rect width="100%" height="100%" fill="#fff" />`,
    `<text xml:space="preserve" dominant-baseline="text-before-edge" font-family="${FONT_FAMILY}" font-size="${FONT_SIZE_PX}px" fill="#111">${tspans}</text>`,
    "</svg>",
  ].join("");
}

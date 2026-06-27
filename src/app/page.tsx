"use client";

import { FormEvent, useState } from "react";
import {
  DEFAULT_MAX_CHARS,
  DEFAULT_MAX_LINES,
  DEFAULT_TAB_SIZE,
  normalizeAa,
  ValidationError,
} from "@/lib/aa/normalize";
import { AA_METRICS, FONT_FAMILY, FONT_SIZE_PX, LINE_HEIGHT_RATIO } from "@/lib/aa/metrics";
import { renderSvg } from "@/lib/aa/renderSvg";

const sample = `　 ∧＿∧
　(　・ω・)
　( つ旦O
　と＿)_)
`;

type MeasuredSvgDimensions = {
  width: number;
  height: number;
  lineHeight: number;
};

function measureSvgDimensions(lines: string[]): MeasuredSvgDimensions {
  const safeLines = lines.length > 0 ? lines : [""];
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    const maxChars = safeLines.reduce((max, line) => Math.max(max, [...line].length), 0);
    return {
      width: Math.ceil(maxChars * AA_METRICS.charWidth + AA_METRICS.paddingX * 2),
      height: Math.ceil(safeLines.length * AA_METRICS.lineHeight + AA_METRICS.paddingY * 2),
      lineHeight: AA_METRICS.lineHeight,
    };
  }

  context.font = `${FONT_SIZE_PX}px ${FONT_FAMILY}`;

  const sampleMetrics = context.measureText("あA");
  const measuredGlyphHeight =
    sampleMetrics.actualBoundingBoxAscent + sampleMetrics.actualBoundingBoxDescent;
  const lineHeight = Math.max(
    FONT_SIZE_PX * LINE_HEIGHT_RATIO,
    measuredGlyphHeight * LINE_HEIGHT_RATIO,
  );

  const maxWidth = safeLines.reduce(
    (max, line) => Math.max(max, context.measureText(line).width),
    0,
  );

  return {
    width: Math.max(1, Math.ceil(maxWidth + AA_METRICS.paddingX * 2)),
    height: Math.max(1, Math.ceil(safeLines.length * lineHeight + AA_METRICS.paddingY * 2)),
    lineHeight,
  };
}

export default function Home() {
  const [text, setText] = useState(sample);
  const [error, setError] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const hasText = text.length > 0;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setDownloaded(false);

    try {
      const normalized = normalizeAa(text, {
        tabSize: DEFAULT_TAB_SIZE,
        maxChars: DEFAULT_MAX_CHARS,
        maxLines: DEFAULT_MAX_LINES,
      });
      const dimensions = measureSvgDimensions(normalized.lines);
      const svg = renderSvg(normalized.normalized, {
        width: dimensions.width,
        height: dimensions.height,
        lineHeight: dimensions.lineHeight,
      });

      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "aa.svg";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
      setDownloaded(true);
    } catch (err) {
      const message =
        err instanceof ValidationError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to generate";
      setError(message);
      setDownloaded(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold">【悲報】最近のブラウザだとAAがずれるンゴ</h1>
      <div className="space-y-1 text-sm text-zinc-600">
        <p>
          1: <span className="font-bold text-green-600">名無しさん</span> 2026/06/19(金) 14:08:55 ID:D54j
        </p>
        <p className="mb-6">最近の若い子との会話もズレるンゴ</p>
        <p>
          2: <span className="font-bold text-green-600">名無しさん</span> 2026/06/19(金) 14:08:55 ID:D54j
        </p>
        <p>昔からズレてるだろ</p>
      </div>

      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <textarea
          className="min-h-64 w-full rounded border border-zinc-300 p-3"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste Japanese ASCII art"
          spellCheck={false}
          style={{
            fontFamily: "'ＭＳ Ｐゴシック', 'MS PGothic', '梅Pゴシック', Textar, sans-serif",
            fontSize: "16px",
            lineHeight: "1.1",
            whiteSpace: "pre",
            overflowWrap: "normal",
          }}
        />
        <button
          type="submit"
          disabled={!hasText}
          className="w-fit rounded bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Generate & Download SVG
        </button>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {downloaded ? <p className="text-sm text-zinc-700">Downloaded aa.svg</p> : null}
    </main>
  );
}

"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import {
  DEFAULT_MAX_CHARS,
  DEFAULT_MAX_LINES,
  DEFAULT_TAB_SIZE,
  normalizeAa,
  ValidationError,
} from "@/lib/aa/normalize";
import { renderSvg } from "@/lib/aa/renderSvg";

const sample = `　 ∧＿∧
　(　・ω・)
　( つ旦O
　と＿)_)
`;

type GenerateResponse = {
  normalizedText: string;
  svg: string;
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="rounded border border-zinc-300 px-2 py-1 text-xs"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function Home() {
  const [text, setText] = useState(sample);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [svgObjectUrl, setSvgObjectUrl] = useState<string | null>(null);

  const hasText = text.length > 0;

  useEffect(() => {
    return () => {
      if (svgObjectUrl) {
        URL.revokeObjectURL(svgObjectUrl);
      }
    };
  }, [svgObjectUrl]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const normalized = normalizeAa(text, {
        tabSize: DEFAULT_TAB_SIZE,
        maxChars: DEFAULT_MAX_CHARS,
        maxLines: DEFAULT_MAX_LINES,
      });
      const svg = renderSvg(normalized.normalized);

      if (svgObjectUrl) {
        URL.revokeObjectURL(svgObjectUrl);
      }

      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      setSvgObjectUrl(URL.createObjectURL(blob));
      setResult({ normalizedText: normalized.normalized, svg });
    } catch (err) {
      const message =
        err instanceof ValidationError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to generate";
      setError(message);
      setResult(null);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold">aa2svg</h1>
      <p className="text-sm text-zinc-600">Paste AA, generate stable SVG, and copy embed-ready links.</p>

      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <textarea
          className="min-h-64 w-full rounded border border-zinc-300 p-3 font-mono text-sm"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste Japanese ASCII art"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={!hasText}
          className="w-fit rounded bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Generate SVG
        </button>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {result ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Output</h2>
          {svgObjectUrl ? (
            <Image
              src={svgObjectUrl}
              alt="Generated AA"
              className="max-w-full border border-zinc-200"
              width={1200}
              height={600}
              unoptimized
            />
          ) : null}

          <div className="flex items-center gap-3">
            {svgObjectUrl ? (
              <a
                href={svgObjectUrl}
                download="aa.svg"
                className="rounded bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
              >
                Download SVG
              </a>
            ) : null}
            <CopyButton value={result.svg} />
          </div>

          <div className="rounded border border-zinc-200 p-3 text-sm">
            <p className="mb-2 font-medium">Normalized text preview</p>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-zinc-700">
              {result.normalizedText}
            </pre>
          </div>
        </section>
      ) : null}
    </main>
  );
}

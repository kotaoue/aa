"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

const sample = `　 ∧＿∧
　(　・ω・)
　( つ旦O
　と＿)_)
`;

type GenerateResponse = {
  id: string;
  svgUrl: string;
  permalinkUrl: string;
  markdown: string;
  error?: string;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const hasText = useMemo(() => text.length > 0, [text]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = (await response.json()) as GenerateResponse;

    if (!response.ok || data.error) {
      setError(data.error ?? "Failed to generate");
      setResult(null);
      setLoading(false);
      return;
    }

    setResult(data);
    setLoading(false);
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
          disabled={!hasText || loading}
          className="w-fit rounded bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate SVG"}
        </button>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {result ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Output</h2>
          <Image
            src={result.svgUrl}
            alt="Generated AA"
            className="max-w-full border border-zinc-200"
            width={1200}
            height={600}
            unoptimized
          />

          <div className="rounded border border-zinc-200 p-3 text-sm">
            <p className="mb-2 font-medium">Raw SVG URL</p>
            <div className="flex items-start justify-between gap-3">
              <code className="break-all">{result.svgUrl}</code>
              <CopyButton value={result.svgUrl} />
            </div>
          </div>

          <div className="rounded border border-zinc-200 p-3 text-sm">
            <p className="mb-2 font-medium">Markdown embed snippet</p>
            <div className="flex items-start justify-between gap-3">
              <code className="break-all">{result.markdown}</code>
              <CopyButton value={result.markdown} />
            </div>
          </div>

          <a className="text-sm underline" href={result.permalinkUrl}>
            Open permalink preview
          </a>
        </section>
      ) : null}
    </main>
  );
}

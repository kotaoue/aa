"use client";

import { FormEvent, useState } from "react";
import {
  DEFAULT_MAX_CHARS,
  DEFAULT_MAX_LINES,
  DEFAULT_TAB_SIZE,
  normalizeAa,
  ValidationError,
} from "@/lib/aa/normalize";
import { renderOutlinedSvgInBrowser } from "@/lib/aa/renderOutlinedSvgClient";

const sample = `　 ∧＿∧
　(　・ω・)
　( つ旦O
　と＿)_)
`;

const WEEKDAYS_JA = ["日", "月", "火", "水", "木", "金", "土"];

function formatDateWithWeekday(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = WEEKDAYS_JA[date.getDay()];
  return `${year}/${month}/${day}(${weekday})`;
}

function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function generateThreadId(seed: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let value = seed >>> 0;
  let id = "";

  for (let i = 0; i < 8; i += 1) {
    value = (value * 1664525 + 1013904223) >>> 0;
    id += chars[value % chars.length];
  }

  return id;
}

function generateDistinctThreadIds(seed: number, count: number): string[] {
  const ids: string[] = [];
  let value = seed >>> 0;

  while (ids.length < count) {
    value = (value * 1664525 + 1013904223) >>> 0;
    const candidate = generateThreadId(value ^ ((ids.length + 1) * 0x9e3779b9));
    if (!ids.includes(candidate)) {
      ids.push(candidate);
    }
  }

  return ids;
}

export default function Home() {
  const [text, setText] = useState(sample);
  const [error, setError] = useState<string | null>(null);
  const [threadMeta] = useState(() => {
    const now = new Date();
    const post1At = new Date(now.getTime() - 60 * 60 * 1000);
    const seed = now.getTime() >>> 0;

    const post2DeltaSeconds = seed % (5 * 60 + 1);
    const post2At = new Date(post1At.getTime() + post2DeltaSeconds * 1000);

    const nowMinusFiveMin = new Date(now.getTime() - 5 * 60 * 1000);
    const maxPost3GapSeconds = Math.max(
      1,
      Math.floor((nowMinusFiveMin.getTime() - post2At.getTime()) / 1000),
    );
    const post3DeltaSeconds = ((seed * 1103515245 + 12345) >>> 0) % maxPost3GapSeconds;
    const post3At = new Date(post2At.getTime() + (post3DeltaSeconds + 1) * 1000);

    const post4DeltaSeconds = (((seed ^ 0xa5a5a5a5) * 2246822519) >>> 0) % 60;
    const post4At = new Date(post3At.getTime() + (post4DeltaSeconds + 1) * 1000);

    const [threadId1, threadId2, threadId3, threadId4] = generateDistinctThreadIds(seed, 4);

    return {
      post1Date: formatDateWithWeekday(post1At),
      post1Time: formatTime(post1At),
      post2Date: formatDateWithWeekday(post2At),
      post2Time: formatTime(post2At),
      post3Date: formatDateWithWeekday(post3At),
      post3Time: formatTime(post3At),
      post4Date: formatDateWithWeekday(post4At),
      post4Time: formatTime(post4At),
      threadId1,
      threadId2,
      threadId3,
      threadId4,
    };
  });

  const hasText = text.length > 0;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const normalized = normalizeAa(text, {
        tabSize: DEFAULT_TAB_SIZE,
        maxChars: DEFAULT_MAX_CHARS,
        maxLines: DEFAULT_MAX_LINES,
      });
      const svg = await renderOutlinedSvgInBrowser(normalized.normalized);
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "aa.svg";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      const message =
        err instanceof ValidationError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to generate";
      setError(message);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold">【悲報】最近のブラウザだとAAがずれるンゴ</h1>
      <div className="space-y-1 text-sm text-zinc-600">
        <p>
          1: <span className="font-bold text-green-600">名無しさん</span> {threadMeta.post1Date}{" "}
          {threadMeta.post1Time} ID:{threadMeta.threadId1}
        </p>
        <p className="mb-6">最近の若い子との会話もズレるンゴ</p>
        <p>
          2: <span className="font-bold text-green-600">名無しさん</span> {threadMeta.post2Date}{" "}
          {threadMeta.post2Time} ID:{threadMeta.threadId2}
        </p>
        <p>昔からズレてるだろ</p>
      </div>

      <div className="space-y-1 text-sm text-zinc-600">
        <p>
          3: <span className="font-bold text-green-600">名無しさん</span> {threadMeta.post3Date}{" "}
          {threadMeta.post3Time} ID:{threadMeta.threadId3}
        </p>
        <p>下のテキストボックスにAA入力したらいい感じに変換してやんよ</p>
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
          dat落ちする前に画像はDLしておいてクレメンス
        </button>
      </form>

      <div className="space-y-1 text-sm text-zinc-600">
        <p>
          4: <span className="font-bold text-green-600">名無しさん</span> {threadMeta.post4Date}{" "}
          {threadMeta.post4Time} ID:{threadMeta.threadId4}
        </p>
        <p>誰得</p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </main>
  );
}

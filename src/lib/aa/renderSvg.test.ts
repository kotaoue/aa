import test from "node:test";
import assert from "node:assert/strict";
import { calculateSvgDimensions } from "@/lib/aa/metrics";
import { renderOutlinedSvg } from "@/lib/aa/renderOutlinedSvg";
import { escapeXml, renderSvg } from "@/lib/aa/renderSvg";

test("escapeXml escapes XML special chars", () => {
  assert.equal(escapeXml(`<tag attr=\"a&b\">'x'</tag>`), "&lt;tag attr=&quot;a&amp;b&quot;&gt;&apos;x&apos;&lt;/tag&gt;");
});

test("calculateSvgDimensions uses deterministic cell metrics", () => {
  const dims = calculateSvgDimensions(["abcd", "xy"]);
  assert.deepEqual(dims, { width: 36, height: 36 });
});

test("renderSvg includes preserve-space and tspans", () => {
  const svg = renderSvg(" a\n b");
  assert.match(svg, /xml:space="preserve"/);
  assert.match(svg, /<tspan/);
});

test("renderOutlinedSvg converts text into paths", async () => {
  const svg = await renderOutlinedSvg("　∧＿∧\n(　・ω・)");
  assert.doesNotMatch(svg, /<text/);
  assert.match(svg, /<path d="/);
});

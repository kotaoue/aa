import test from "node:test";
import assert from "node:assert/strict";
import { normalizeAa } from "@/lib/aa/normalize";

test("normalizeAa converts line breaks and tabs", () => {
  const result = normalizeAa("a\r\n\tb\rc", { tabSize: 2 });
  assert.equal(result.normalized, "a\n  b\nc");
});

test("normalizeAa preserves surrounding and full-width spaces", () => {
  const result = normalizeAa(" 　x　 ");
  assert.equal(result.normalized, " 　x　 ");
});

test("normalizeAa enforces max lines", () => {
  assert.throws(() => normalizeAa("a\nb", { maxLines: 1 }));
});

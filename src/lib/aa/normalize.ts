export type NormalizeOptions = {
  tabSize?: number;
  maxChars?: number;
  maxLines?: number;
};

export type NormalizedAA = {
  original: string;
  normalized: string;
  lines: string[];
};

export const DEFAULT_TAB_SIZE = 2;
export const DEFAULT_MAX_CHARS = 12000;
export const DEFAULT_MAX_LINES = 400;

export class ValidationError extends Error {}

export function normalizeAa(
  input: string,
  options: NormalizeOptions = {},
): NormalizedAA {
  const tabSize = options.tabSize ?? DEFAULT_TAB_SIZE;
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS;
  const maxLines = options.maxLines ?? DEFAULT_MAX_LINES;

  if (tabSize < 1 || !Number.isInteger(tabSize)) {
    throw new ValidationError("tabSize must be a positive integer");
  }

  if (input.length > maxChars) {
    throw new ValidationError(`Input exceeds max characters (${maxChars})`);
  }

  const normalizedBreaks = input.replace(/\r\n?/g, "\n");
  const lines = normalizedBreaks.split("\n");

  if (lines.length > maxLines) {
    throw new ValidationError(`Input exceeds max lines (${maxLines})`);
  }

  const tabSpaces = " ".repeat(tabSize);
  const normalizedLines = lines.map((line) => line.replace(/\t/g, tabSpaces));

  return {
    original: input,
    normalized: normalizedLines.join("\n"),
    lines: normalizedLines,
  };
}

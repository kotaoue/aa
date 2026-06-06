# Rendering rules

- Normalize line endings to `\n`.
- Convert tabs to spaces with a fixed tab width (default: 2).
- Keep leading/trailing spaces and full-width spaces.
- Render with `<text>` and one `<tspan>` per line.
- Always set `xml:space="preserve"`.
- Use deterministic metrics:
  - char width: `9.6`
  - line height: `20`
  - padding: `12x12`
- Escape XML-sensitive characters before embedding text into SVG.

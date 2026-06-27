# aa2svg

aa2svg is a small web service that converts Japanese ASCII art (AA) into stable SVG images.

## Why SVG for AA in Markdown?

AA often collapses in Markdown/README rendering because proportional fonts and whitespace handling vary by platform. SVG with fixed metrics and `xml:space="preserve"` keeps line alignment stable, so embeds remain faithful.

## Features

- Single-page AA input + instant output section
- Normalization for line endings and tabs
- SVG rendering with:
  - `font-family: 'MS PGothic', 'ＭＳ Ｐゴシック', monospace;`
  - `font-size: 16pt`
  - deterministic dimensions from fixed cell metrics
- Client-side generation (no backend persistence)
- Direct SVG download from the browser

## Local startup

```bash
npm install
npm run dev
```

Then open:

- <http://localhost:3000>

At this stage, Firestore setup is not required.

- You can start the app and open the UI.
- SVG is generated in the browser and can be downloaded directly.

## Deployment

Deploy as a standard Next.js App Router app.

No runtime environment variables are required for the current client-side-only mode.

## Usage

1. Paste AA into the textarea.
2. Click `Generate SVG`.
3. Click `Download SVG` to save the rendered image.

## Links

- [](https://aahub.org/)

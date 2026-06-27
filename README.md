# aa2svg

aa2svg is a small web service that converts Japanese ASCII art (AA) into stable SVG images.

Downloaded SVGs embed the Textar font via @font-face, with MS PGothic-compatible font-family fallbacks. GitHub and other Markdown renderers can display them correctly without external font dependencies.

## Why SVG for AA in Markdown?

AA often collapses in Markdown/README rendering because proportional fonts and whitespace handling vary by platform. SVG with fixed metrics and `xml:space="preserve"` keeps line alignment stable, so embeds remain faithful.

## Features

- Single-page AA input + instant output section
- Normalization for line endings and tabs
- SVG rendering with:
  - Textar web font (@font-face embedded) with MS PGothic fallbacks: `'ＭＳ Ｐゴシック', 'MS PGothic', '梅Pゴシック', Textar, sans-serif`
  - `font-size: 16px`
  - deterministic cell-based dimensions
  - Textar font licensed under IPA Font License Agreement v1.0
- SVG generation via server-side API endpoint
- no backend persistence beyond the request/response cycle

## Local startup

```bash
npm install
npm run dev
```

Then open:

- <http://localhost:3000>

At this stage, Firestore setup is not required.

- You can start the app and open the UI.
- Enter AA, press the button, and the server returns an SVG with embedded Textar font for direct download.

## Deployment

Deploy as a standard Next.js App Router app.

No runtime environment variables are required.

## Usage

1. Paste AA into the textarea.
2. Click `Generate SVG`.
3. Click `Download SVG` to save the rendered image.

## Links

- [AAhub](https://aahub.org/)
- [Textar Font(temporary)](https://yamacraft.github.io/textar-font/)

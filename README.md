# aa2svg

aa2svg is a small web service that converts Japanese ASCII art (AA) into stable SVG images.

Downloaded SVGs are outlined on the server before export so README embeds do not depend on GitHub loading a specific web font.

## Why SVG for AA in Markdown?

AA often collapses in Markdown/README rendering because proportional fonts and whitespace handling vary by platform. SVG with fixed metrics and `xml:space="preserve"` keeps line alignment stable, so embeds remain faithful.

## Features

- Single-page AA input + instant output section
- Normalization for line endings and tabs
- SVG rendering with:
  - `font-family: 'MS PGothic', 'ＭＳ Ｐゴシック', monospace;`
  - `font-size: 16pt`
  - deterministic dimensions from fixed cell metrics
- outlined SVG download through a server-side export route
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
- Enter AA, press the button, and the server returns an outlined SVG for direct download.

## Deployment

Deploy as a standard Next.js App Router app.

No runtime environment variables are required.

## Usage

1. Paste AA into the textarea.
2. Click `Generate SVG`.
3. Click `Download SVG` to save the rendered image.

## Links

- [AAhub](https://aahub.org/)

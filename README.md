# aa2svg

aa2svg is a small web service that converts Japanese ASCII art (AA) into stable PNG images.

The server renders AA with a bundled Textar font and returns a PNG, so GitHub README embedding stays visually stable without depending on the viewer's font behavior.

## Why PNG for AA in Markdown?

AA often collapses in Markdown/README rendering because proportional fonts and whitespace handling vary by platform. PNG freezes the final rendered result, so embeds remain faithful regardless of the reader environment.

## Features

- Single-page AA input + instant output section
- Normalization for line endings and tabs
- Server-side rendering with:
  - bundled `public/fonts/textar.ttf` loaded on the server
  - `font-size: 16px`
  - deterministic cell-based dimensions
  - small outer padding to avoid edge clipping
  - Textar font licensed under IPA Font License Agreement v1.0
- PNG generation via server-side API endpoint (`/api/svg`, legacy path name)
- no backend persistence beyond the request/response cycle

## Local startup

```bash
npm install
npm run dev
```

Then open:

- <http://localhost:3000>

- You can start the app and open the UI.
- Enter AA, press the button, and the server returns a PNG for direct download.

## Deployment

Deploy as a standard Next.js App Router app.

No runtime environment variables are required.

## Usage

1. Paste AA into the textarea.
2. Click the download button.
3. Save the rendered PNG image.

## Links

- [AAhub](https://aahub.org/)
- [Textar Font(temporary)](https://yamacraft.github.io/textar-font/)
- [IPA Font License Agreement v1.0](https://moji.or.jp/ipafont/license/)

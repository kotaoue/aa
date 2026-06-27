# aa2svg

aa2svg is a Next.js app that converts Japanese ASCII art (AA) into stable PNG images.

To avoid AA breakage caused by font differences across browsers and platforms, rendering is done on the server and returned as PNG. This keeps visual output stable when embedding in README files and other documents.

## Features

- One-page UI to input AA and download PNG directly
- Line-ending normalization (CRLF/CR -> LF)
- Tab expansion (tab size: 2)
- Server-side rendering (Node.js runtime)
- Rendering with Textar font from `public/fonts/textar.ttf`
- Small outer padding to reduce edge clipping

## Technical Overview

- Framework: Next.js (App Router)
- API: `POST /api/svg` (legacy path name remains svg)
- Output: `image/png` (downloaded as `aa.png`)
- Rendering library: `@napi-rs/canvas`
- Persistence: none (request/response only)

## Input Limits

- Max characters: 12000
- Max lines: 400
- Tab size: 2

If limits are exceeded, the API returns a 400 error in JSON format.

## Local Setup

```bash
npm install
npm run dev
```

Then open:

- http://localhost:3000

## Usage

1. Paste AA into the textarea.
2. Click the download button.
3. Save the generated `aa.png`.

## API Spec (Quick)

### Request

- Method: `POST`
- Path: `/api/svg`
- Content-Type: `application/json`
- Body:

```json
{
  "text": "(AA string here)"
}
```

### Response

- Success: `200 image/png`
- Error: `400 application/json`

```json
{
  "error": "Input exceeds max characters (12000)"
}
```

## スクリプト

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests

## Deployment

Deploy as a standard Next.js App Router app.

No required runtime environment variables.

## License and Font

- Textar Font (temporary): https://yamacraft.github.io/textar-font/
- IPA Font License Agreement v1.0: https://moji.or.jp/ipafont/license/

## References

- AAhub: https://aahub.org/

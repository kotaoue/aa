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
- Firestore persistence and short permalink IDs
- Permalink page: `/a/[id]`
- Raw SVG API: `/api/svg/[id]`
- Copy-friendly URL and Markdown snippet output
- Basic payload limits and per-IP rate limiting

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Firestore setup

Set these values in `.env.local`:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (escaped newlines as `\n`)
- `FIRESTORE_COLLECTION` (optional)

## Deployment notes

- Deploy as a standard Next.js App Router app.
- Ensure environment variables for Firebase Admin SDK are available at runtime.
- Keep `RATE_LIMIT_*` and `MAX_INPUT_*` tuned for your traffic profile.

## API usage examples

Generate and persist SVG:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H 'content-type: application/json' \
  -d '{"text":"　 ∧＿∧\n　(　・ω・)"}'
```

Fetch raw SVG by ID:

```bash
curl http://localhost:3000/api/svg/abc123XY
```

Markdown embed snippet format:

```md
![aa](https://your-domain.example/api/svg/<id>)
```

# HUST Quiz

Static local-first quiz app built with Vite + React + TypeScript.

## Features

- Built-in quizzes from `public/quizzes/*.json`
- Import quiz by paste JSON or upload `.json`
- Schema validation with Zod
- Local persistence with Dexie/IndexedDB
- Practice mode and exam mode
- Timed mode with auto-submit
- Single choice, multiple choice, fill gap
- Attempt history + review
- Backup export/import JSON
- PWA support (offline-ready app shell)

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## JSON format

Top-level schema:

```json
{
  "schemaVersion": 1,
  "quiz": {
    "id": "string",
    "title": "string",
    "questions": []
  }
}
```

Question types:

- `single_choice`
- `multiple_choice`
- `fill_gap`

See samples in `public/quizzes/sample-networking.json` and `public/quizzes/sample-database.json`.

## Deploy

- GitHub Actions workflow included: `.github/workflows/deploy-gh-pages.yml`
- For GitHub Pages, keep repo name aligned with `repoName` in `vite.config.ts`.
# hust_quiz_maker

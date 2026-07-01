# HUST Quiz

Static local-first quiz app built with Vite + React + TypeScript.

## Features

- Import quiz JSON by paste or file upload
- Load every bundled quiz from `public/quizzes/*.json`
- Schema validation with detailed field-level errors
- Local persistence with Dexie / IndexedDB
- Practice mode and exam mode
- Timed mode with resume support
- Single choice, multiple choice, and fill gap questions
- Markdown, LaTeX, code blocks, ASCII diagrams, SVG media
- Attempt history, review, backup export/import
- PWA support

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

## Quiz JSON Specification

This section documents the actual JSON format accepted by the app.

The import pipeline does four things:

1. Parses raw JSON.
2. Validates structure with Zod.
3. Normalizes media and default settings.
4. Checks cross-references such as duplicate IDs and invalid `correctChoiceIds`.

If a file does not match this specification, the app will reject it and show field-level errors.

### Top-level shape

Every quiz file must be a JSON object in this exact top-level shape:

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

### Top-level fields

`schemaVersion`

- Required.
- Must be exactly `1`.

`quiz`

- Required.
- Object containing all quiz metadata, settings, and questions.

### Quiz object

```json
{
  "id": "ai-on-tap-tong-hop",
  "title": "Trí tuệ nhân tạo - Ôn tập tổng hợp",
  "description": "Optional description",
  "language": "vi",
  "source": {
    "type": "merged",
    "notes": "Optional free-form note"
  },
  "settings": {
    "shuffleQuestions": true,
    "shuffleChoices": true,
    "showExplanationAfterAnswer": true
  },
  "questions": []
}
```

#### Quiz fields

`id`

- Required string.
- Should be unique across quizzes stored on the same device.
- Recommended format: kebab-case.

`title`

- Required string.
- Human-readable quiz title.

`description`

- Optional string.

`language`

- Optional string.
- Examples: `"en"`, `"vi"`.

`source`

- Optional object.
- Useful for tracking where the quiz came from.

`source.type`

- Required if `source` is present.
- Any non-empty string is accepted.

`source.notes`

- Optional string.

`settings`

- Optional object.
- If omitted, the app normalizes all three values to `true`.

`settings.shuffleQuestions`

- Optional boolean.
- Default after normalization: `true`.

`settings.shuffleChoices`

- Optional boolean.
- Default after normalization: `true`.

`settings.showExplanationAfterAnswer`

- Optional boolean.
- Default after normalization: `true`.

`questions`

- Required array.
- Must contain at least 1 question.

## Question Types

Supported question `type` values:

- `single_choice`
- `multiple_choice`
- `fill_gap`

Every question must contain these common fields:

```json
{
  "id": "q001",
  "type": "single_choice",
  "question": {
    "text": "Question text",
    "images": []
  },
  "explanation": {
    "text": "Explanation text",
    "images": []
  },
  "tags": ["optional", "tags"],
  "difficulty": "easy"
}
```

### Common question fields

`id`

- Required string.
- Must be unique within the quiz.

`type`

- Required string.
- Must be one of the 3 supported values above.

`question`

- Required content block.

`explanation`

- Required content block.

`tags`

- Optional array of strings.

`difficulty`

- Optional string.
- Must be one of:
  - `easy`
  - `medium`
  - `hard`

## Content Blocks

Both `question` and `explanation` use the same shape:

```json
{
  "text": "Markdown / LaTeX / normal text",
  "images": []
}
```

### Content block fields

`text`

- Required string.
- May contain:
  - plain text
  - Markdown
  - fenced code blocks
  - GitHub-flavored Markdown tables/lists
  - LaTeX math via `$...$` or `$$...$$`

`images`

- Optional in practice because the app normalizes missing arrays to `[]`.
- Best practice: always include it explicitly.
- Must be an array of media items.

## Media Specification

The app supports 4 authoring styles for media:

1. External or bundled raster/vector path via `src`
2. Raw ASCII diagram via `ascii`
3. Raw SVG markup via `svg`
4. Bare string shorthand, which is normalized as ASCII

### Media form 1: `src`

```json
{
  "id": "img-1",
  "src": "images/diagram.png",
  "alt": "Constraint graph"
}
```

Use `src` for:

- relative files under `public/`
- absolute paths already hosted by the site
- external URLs
- `data:` URLs

### Media form 2: `ascii`

```json
{
  "id": "diagram-1",
  "ascii": "A --- B\\n|     |\\nC --- D",
  "alt": "Simple graph"
}
```

Use this for:

- tree diagrams
- search graphs
- CSP maps
- grid layouts
- OCR-recovered diagrams that are easier to maintain as text

### Media form 3: `svg`

```json
{
  "id": "svg-1",
  "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 240 120\"><rect width=\"240\" height=\"120\" fill=\"white\" stroke=\"black\"/><text x=\"20\" y=\"60\">Diagram</text></svg>",
  "alt": "Rendered SVG diagram"
}
```

Use this when:

- AI can generate a clean vector diagram
- ASCII would be too messy
- you want deterministic offline rendering without external image hosting

The app renders SVG as an object URL image, not inline DOM SVG.

### Media form 4: bare string shorthand

```json
{
  "images": [
    "A --- B\\n|     |\\nC --- D"
  ]
}
```

This is accepted and automatically normalized to:

```json
{
  "id": "ascii-1",
  "ascii": "A --- B\\n|     |\\nC --- D"
}
```

### Media rules

For object-style media, exactly one of these must exist:

- `src`
- `ascii`
- `svg`

This is invalid:

```json
{
  "src": "a.png",
  "ascii": "also a diagram"
}
```

This is also invalid:

```json
{
  "alt": "Missing actual media"
}
```

### Media IDs

`id` is optional for media objects.

If omitted, the app auto-generates:

- `img-<n>` for `src`
- `svg-<n>` for `svg`
- `ascii-<n>` for `ascii` or string shorthand

## Single Choice Questions

```json
{
  "id": "q001",
  "type": "single_choice",
  "question": {
    "text": "Which protocol resolves domain names to IP addresses?",
    "images": []
  },
  "choices": [
    { "id": "A", "text": "HTTP" },
    { "id": "B", "text": "DNS" },
    { "id": "C", "text": "FTP" },
    { "id": "D", "text": "SMTP" }
  ],
  "answer": {
    "correctChoiceIds": ["B"]
  },
  "explanation": {
    "text": "DNS resolves domain names to IP addresses.",
    "images": []
  },
  "tags": ["networking"],
  "difficulty": "easy"
}
```

Rules:

- `choices` is required.
- Must contain at least 2 choices.
- `answer.correctChoiceIds` is required.
- Must contain exactly 1 choice ID.

## Multiple Choice Questions

```json
{
  "id": "q002",
  "type": "multiple_choice",
  "question": {
    "text": "Which are transport layer protocols?",
    "images": []
  },
  "choices": [
    { "id": "A", "text": "TCP" },
    { "id": "B", "text": "UDP" },
    { "id": "C", "text": "IP" },
    { "id": "D", "text": "Ethernet" }
  ],
  "answer": {
    "correctChoiceIds": ["A", "B"]
  },
  "explanation": {
    "text": "TCP and UDP are transport-layer protocols.",
    "images": []
  }
}
```

Rules:

- `choices` is required.
- Must contain at least 2 choices.
- `answer.correctChoiceIds` is required.
- Must contain at least 1 choice ID.

## Fill Gap Questions

```json
{
  "id": "q003",
  "type": "fill_gap",
  "question": {
    "text": "The SQL keyword used to remove duplicate rows is ____.",
    "images": []
  },
  "answer": {
    "acceptedAnswers": ["DISTINCT"],
    "caseSensitive": false,
    "trimWhitespace": true
  },
  "explanation": {
    "text": "DISTINCT returns only unique rows.",
    "images": []
  }
}
```

Rules:

- `answer.acceptedAnswers` is required.
- Must contain at least 1 non-empty string.

### Fill gap comparison behavior

`caseSensitive`

- Optional boolean.
- If omitted, treated as `false`.

`trimWhitespace`

- Optional boolean.
- If omitted, treated as `true`.

That means this answer block:

```json
{
  "acceptedAnswers": ["DISTINCT"]
}
```

behaves like:

```json
{
  "acceptedAnswers": ["DISTINCT"],
  "caseSensitive": false,
  "trimWhitespace": true
}
```

## Choice Text

Choice text is a required non-empty string:

```json
{ "id": "A", "text": "TCP" }
```

Choice `text` may also contain Markdown / LaTeX if needed.

Choice IDs are used as the answer key. The app does not use array positions for correctness.

This is correct:

```json
"correctChoiceIds": ["B"]
```

This is not supported:

```json
"correctIndex": 1
```

## Validation Rules

The app validates both structure and references.

### Structural validation

The import will fail if any of the following are true:

- invalid JSON syntax
- missing `schemaVersion`
- `schemaVersion` is not `1`
- missing `quiz`
- missing `quiz.id`
- missing `quiz.title`
- missing `quiz.questions`
- `quiz.questions` is empty
- unsupported `type`
- missing `question.text`
- missing `explanation.text`
- empty strings where non-empty strings are required
- single/multiple choice question without enough choices
- fill gap question without `acceptedAnswers`
- invalid `difficulty`
- invalid media object with multiple media payload fields

### Cross-reference validation

The import also fails if:

- two questions share the same `id`
- two choices in the same question share the same `id`
- `correctChoiceIds` references a choice ID that does not exist

Example of a cross-reference error:

```txt
quiz.questions[11] (q012).answer.correctChoiceIds[0]: references "E", but no choice with that id exists.
```

## Normalization Behavior

The app makes a few predictable transformations after validation:

### Missing settings are defaulted

If omitted:

- `shuffleQuestions` becomes `true`
- `shuffleChoices` becomes `true`
- `showExplanationAfterAnswer` becomes `true`

### Missing media arrays become `[]`

If `question.images` or `explanation.images` is omitted, the app normalizes it to an empty array.

### Media shorthand is normalized

- string items become ASCII media
- object media without `id` get generated IDs

## Authoring Guidance

### Recommended authoring rules

- Keep question IDs stable and unique.
- Use short deterministic choice IDs like `A`, `B`, `C`, `D`.
- Put diagrams in `images[].ascii` instead of embedding them awkwardly in Markdown text.
- Use `svg` for AI-generated diagrams when ASCII becomes unreadable.
- Keep explanations present for every question, even in exam-oriented quizzes.
- Prefer Markdown tables/code blocks only when they materially improve readability.

### When to use `ascii` vs `svg`

Use `ascii` when:

- the shape is small
- it is basically a tree, grid, or graph
- you want something easy to diff and edit by hand

Use `svg` when:

- the diagram is dense
- alignment matters
- AI is generating the diagram and can output valid SVG reliably

## Full Example

```json
{
  "schemaVersion": 1,
  "quiz": {
    "id": "ai-csp-demo",
    "title": "AI CSP Demo Quiz",
    "description": "Example showing all major supported fields.",
    "language": "en",
    "source": {
      "type": "manual",
      "notes": "Written as documentation example"
    },
    "settings": {
      "shuffleQuestions": true,
      "shuffleChoices": true,
      "showExplanationAfterAnswer": true
    },
    "questions": [
      {
        "id": "q001",
        "type": "single_choice",
        "question": {
          "text": "Which algorithm uses `f(n) = g(n) + h(n)`?",
          "images": [
            {
              "ascii": "A --1--> B --2--> Goal",
              "alt": "Simple path diagram"
            }
          ]
        },
        "choices": [
          { "id": "A", "text": "DFS" },
          { "id": "B", "text": "BFS" },
          { "id": "C", "text": "A*" },
          { "id": "D", "text": "Greedy best-first" }
        ],
        "answer": {
          "correctChoiceIds": ["C"]
        },
        "explanation": {
          "text": "A* evaluates nodes using `$f(n)=g(n)+h(n)$`.",
          "images": []
        },
        "tags": ["ai", "search"],
        "difficulty": "easy"
      },
      {
        "id": "q002",
        "type": "fill_gap",
        "question": {
          "text": "The CSP heuristic MRV stands for **Minimum Remaining Values**.",
          "images": []
        },
        "answer": {
          "acceptedAnswers": ["Minimum Remaining Values", "MRV"],
          "caseSensitive": false,
          "trimWhitespace": true
        },
        "explanation": {
          "text": "MRV chooses the variable with the fewest legal values left.",
          "images": []
        },
        "tags": ["ai", "csp"],
        "difficulty": "medium"
      }
    ]
  }
}
```

## Bundled Quizzes

Every `.json` file inside `public/quizzes/` is discovered automatically at build time and can be imported by the `Load All Quizzes` button.

Because this is a static site, discovery happens during the Vite build, not by runtime directory listing in the browser. If you add or remove quiz files in `public/quizzes/`, rebuild the app.

## Deploy

- GitHub Actions workflow included: `.github/workflows/deploy-gh-pages.yml`
- GitHub Pages base path is derived automatically from `GITHUB_REPOSITORY`

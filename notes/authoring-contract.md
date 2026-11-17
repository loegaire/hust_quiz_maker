# Authoring contract — HUST quiz packs

Read `README.md` section "Quiz JSON Specification" (the accepted format) and `notes.md` (corpus recon)
before writing anything. This file is binding.

## 1. Deliverables (exact paths)
- `public/quizzes/<slug>.json` — the quiz pack, `schemaVersion: 1`.
- `notes/evidence-<subject>.jsonl` — one JSON object per included question:
  `{"id":"...","source_file":"...","page":N,"marker":"<verbatim marker text or '[100]'/>","quote":"<source stem snippet>","confidence":"high|medium"}`.
- `notes/review-<subject>.md` — every excluded/uncertain item: source, page, why it is uncertain,
  what a stronger model should decide. Groups: (a) ambiguous marker, (b) marker contradicts
  authoritative knowledge, (c) unreadable scan, (d) question type not representable in the schema.

## 2. Inclusion rule (hard)
Include a question **only** when the source explicitly marks the correct answer with an
authoritative marker:
- `The correct answer is: X` / `The correct answers are: X, Y` (Moodle / LMS attempt reviews),
- `Key = <answer>` (official answer keys),
- MS Forms green correct-option mark, Google-quiz `radio_button_checked` / `check_box_checked`,
- `[100]` option prefix in the Android question bank.

**Never** treat these as an answer: handwritten circles/ink, colored highlights drawn by a student,
"Corrected"/"Đáp án" header words, or a reasoned guess. Exam papers without a key contribute nothing.

Every question must be independently correct: if well-established knowledge contradicts the marked
answer, exclude it and record it in the review file.

## 3. Faithfulness
- Copy stems and choices verbatim from the source (fix only obvious PDF spacing/soft-hyphen artefacts).
- Do not invent, translate away, or "improve" choices. Keep "Tất cả các đáp án trên"-style options.
- Do not merge two questions, do not split one. Deduplicate only byte-identical duplicates
  (record dropped duplicates in the evidence file as comments? no — just count them in the review file).
- `single_choice` unless the source says "chọn nhiều / select all / Chọn 2 phương án" or the marker
  lists more than one correct answer → then `multiple_choice`.
- `fill_gap` only when the source asks to fill a blank/short-answer field AND the key gives the literal string.
- Image-only option sets (e.g. "a." with a UML figure): keep choices as `A/B/C/D` labels, put the four
  option figures into `question.images` (extracted raster via `src`, or faithful re-drawn `svg`), and
  state in the stem what the image shows. If the figures cannot be reproduced faithfully, exclude.

## 4. Explanations (required, Vietnamese)
Sections, in this order, using `###` headings:
1. `### Đáp án` — bold the chosen option id(s) + full text of the correct option(s).
2. `### Lời giải từng bước` — 2–6 sentences of real reasoning.
3. `### Phân tích từng lựa chọn` — one bullet per choice with Đúng/Sai and why.
4. `### Điểm dễ nhầm` — the trap / mnemonic.
5. `### Nguồn` — bullet list: `- **<file> trang N:** <what it shows>` for the source, plus at least one
   authoritative reference: official docs / textbook chapter, with URL when online.

Rules: LaTeX `$...$` for maths; Markdown tables/lists allowed; no HTML; no placeholders; never write
"theo slide" unless citing a real file/page you actually inspected. Any online URL must be opened with
the `read` tool (or verified through `web_search`) before being cited — never cite from memory.

## 5. Media (mandatory — this is graded)
- Every quiz must contain many figures (target ≥25% of questions with at least one media item, and ≥8
  per quiz), matching where the source had a figure.
- Prefer inline `svg`: self-contained, `xmlns`, `viewBox`, white background `<rect>`, explicit colours
  (`#111`, `#e8f2ff`, `#fff`), `font:16px sans-serif`, width ≤ 900. No `<foreignObject>`, no scripts,
  no external `href`, no `var()`/`currentColor`.
- `ascii` for trees/graphs/timelines that are clearer as text.
- `src` (raster) only when extracted from the source PDF: save under `public/images/<subject>/`,
  reference as `images/<subject>/<name>.png` (relative, no leading slash), always set `alt`.
  Extraction: `scratch/venv/bin/python` + pymupdf (`page.get_images()` / `page.get_pixmap(clip=...)`).
- Always give each media object an `id` and an `alt`.

## 6. Question shape
```json
{"id":"<slug>-q001","type":"single_choice",
 "question":{"text":"...","images":[]},
 "choices":[{"id":"A","text":"..."}],
 "answer":{"correctChoiceIds":["B"]},
 "explanation":{"text":"...","images":[]},
 "tags":["<subject-slug>","<source-slug>","<topic-slug>"],"difficulty":"easy|medium|hard"}
```
- Unique ids within the file; prefixes per source, zero-padded.
- `tags` on every question; `difficulty` on every question.
- Quiz object: `id` unique kebab-case `<subject>-on-tap-tong-hop` (confirm it does not collide with
  `node scratch/kit/validate.mjs public/quizzes/*.json`), `title`, `description` (counts + method),
  `language: "vi"`, `source: {"type":"...","notes":"<exact source files + marker method>"}`,
  `settings` all `true`.

## 7. Gates you must run and report
1. `node scratch/kit/validate.mjs public/quizzes/*.json` → your file must show `OK` with zero `ERR`.
2. Duplicate sweep: no question duplicated elsewhere in your own file (semantic, not only id).
3. Answer audit: for **every** question, re-open the source (text layer and/or `pdftoppm` render read
   with the `read` tool) and confirm (i) the stem/choices transcription and (ii) the marker. At minimum
   a 25% random sample plus all questions you had any doubt about; log sample ids in the review file.
4. Media audit: every `svg` parses (validator checks the wrapper); open one rendered page of your quiz
   in the browser later — at least confirm each `src` file exists on disk.
5. Report at the end: counts by type/difficulty, number of images, number of excluded items with reasons.

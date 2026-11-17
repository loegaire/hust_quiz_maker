# Reviewer contract — independent audit of a quiz pack

You are the independent auditor. The author's `notes/evidence-*.jsonl` and `notes/review-*.md` are
**not** evidence: re-derive everything from the source PDFs yourself. Assume every claim is wrong until
you reproduce it.

## Inputs
- Quiz under audit: `public/quizzes/<slug>.json`
- Author's claim files: `notes/evidence-<subject>.jsonl`, `notes/review-<subject>.md`
- Sources: `extracted/<subject>/*.pdf`, text dumps `extracted/<subject>/txt/*.txt`
- Toolchain: `/home/thinh/proj/Hust_quiz/scratch/venv/bin/python`, `scratch/kit/marks.py`,
  `scratch/kit/spans.py`, `pdftoppm` + the `read` tool (you CAN see rendered pages), `node scratch/kit/validate.mjs`.

## Method — per question
1. Locate the question in the named source (text dump and/or rendered page via `read`).
2. Re-derive the marked answer **from the raw marker** (`The correct answer is:`, `Key =`, `[100]`,
   checked option glyph, MS-Forms green fill) — not from the author's claim.
3. Compare stem + every choice against the source, verbatim. Record any paraphrase, dropped option,
   added option, or reordered/renumbered choice.
4. Judge the explanation on domain grounds: is the chosen option actually correct for the stated stem,
   is the per-choice analysis accurate, is the "Nguồn" citation real (open each URL with `read`; check
   that the cited file/page exists and shows what is claimed).
5. Check media: `svg` is self-contained (no external `href`, no scripts, no `var()`/`currentColor`,
   has `xmlns`), `src` file exists under `public/`, `ascii` is legible, `alt` present and accurate.

## Severity
- `BLOCKER` — wrong marked answer; marker absent/not authoritative; fabricated citation; media that
  cannot render; duplicate question id; schema failure.
- `MAJOR` — stem/choice infidelity; missing explanation section; wrong per-choice analysis; misleading
  diagram; `difficulty`/`tags` missing.
- `MINOR` — typo, spacing, wording polish.

## Required coverage
- 100% of questions: re-derive the marker, and check schema + media programmatically.
- ≥25% of questions (and 100% of any flagged by the author): full line-by-line comparison against the
  rendered source page.

## Deliverables
- `notes/review-<subject>-report.md` — summary (counts per severity), the coverage statement, then a
  table: `id | verdict (ok/BLOCKER/MAJOR/MINOR) | evidence (file+page+marker) | issue`.
- `notes/review-<subject>-issues.jsonl` — one JSON object per non-ok finding:
  `{"id":null|"<qid>","severity":"...","source_file":"...","page":N,"claim":"...","found":"...","fix":"..."}`.
- Do not edit the quiz JSON. The integrator applies fixes.

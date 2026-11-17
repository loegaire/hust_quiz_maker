# Independent audit — `public/quizzes/nmcnpm_on_tap_tong_hop.json`

Auditor: fresh re-derivation from the source PDFs (author's `notes/evidence-nmcnpm.jsonl` and
`notes/review-nmcnpm.md` were used only as a question index, never as evidence).
Pack: 424 questions (`lms-*` 324, `fmt-*` 81, `gk20242-*` 19), types: 397 `single_choice`, 27 `multiple_choice`.

## Summary (counts per severity)

| Severity | Findings | Affected questions |
|---|---|---|
| BLOCKER | 3 | `lms-192`, `gk20242-003`, `fmt-056` (all: a referenced figure/symbol is missing and an unrelated diagram is attached) |
| MAJOR | 1 (systemic) | explanation prose across the pack (affects the large majority of items) |
| MINOR | 2 (1 systemic) | `lms-294`; decorative image reuse |
| **ok** | — | 421 of 424 have a correct marker, correct choices and answer; the 3 BLOCKERs still have the **correct answer** but broken/misleading media |

**No wrong marked answers were found.** Every one of the 424 answers was re-derived from the raw source
marker and matches the pack.

## Coverage statement

* **Programmatic marker re-derivation: 424 / 424 = 100 %.**
  * `lms-*` (324): parsed the 275-page “quiz LMS.pdf” directly (pdftotext `-layout` dump + `pymupdf`
    glyph scan) → 485 question blocks, 461 with a derivable answer. Marker = the `The correct answer is:`
    / `The correct answers are:` line (comma-joined option texts, matched back to the choices by exact
    string partition). Every `U+F00C` (check) / `U+F00D` (cross) glyph was cross-checked: **check ⊆ correct
    set and cross ∩ correct set = ∅ for all 461 records — 0 violations.** (Note: the check glyph marks the
    *student's* pick when it is correct and the cross marks the wrong pick; it is NOT itself the full answer
    set, which is why the answer *text* was used as the authority and the glyphs as corroboration.)
  * `gk20242-*` (19): “giữa kì 20242.pdf” parsed the same way (30 source questions, 11 legitimate duplicates
    dropped). Marker = `The correct answer is:` line.
  * `fmt-*` (81): MS-Forms radio reconstruction via `scratch/kit/msforms.py` (100 questions), independently
    re-run and diffed cell-by-cell against `scratch/gt/msforms_questions.json` — **identical stems, options
    and selected radio for all 100**.
  * Stem + every choice compared **verbatim** (whitespace/quote-normalised, `$`-escape aside) for all 424:
    **0 option differences, 0 stem differences**.
  * Source⇄pack mapping checked: all 424 matched a source stem exactly except `lms-294` (matches after
    the `\$` escape). No duplicate ids, no duplicate stems. All `gk` and `fmt` unique source stems are
    present in the pack (as `gk20242-*`/`lms-*`).
* **Visual line-by-line comparison: 82 / 424 = 19.3 %** (`pdftoppm -r110/120` + reading the rendered pages):
  * **all 19 `gk20242-*`** (source pp. 1–12, all 30 source questions),
  * 31 `lms-*` — source pp. 18, 108, 118, 127, 153, 224, 225, 227, 228, 231, 232, 236, 237
    (covers all 27 `multiple_choice`, incl. the 6 “every choice correct” items, and the T/F items),
  * 32 `fmt-*` — source pp. 2, 3, 4, 5, 6, 13, 14, 20, 24, 25, 26, 34, 37, 39, 42, 43
    (incl. the page-continuation “fix” items: `fmt-016`→Delivery Manager p.14, `fmt-034`→include p.25).
* **Explanation / citation check:** all 424 explanations contain the five sections
  (`### Đáp án`, `### Lời giải từng bước`, `### Phân tích từng lựa chọn`, `### Điểm dễ nhầm`, `### Nguồn`);
  the bolded “Đáp án” always equals `answer.correctChoiceIds` and the only `— **Đúng**` line is on the
  correct choices (0 inconsistencies). All 6 `### Nguồn` URLs were opened and resolve to the claimed
  resource (see below).
* **Media:** 424 SVGs (1/question), 0 `src`, 0 `ascii`; every item has `alt`.

## Marker verdict totals

| Group | Questions | Marker re-derived | Answer matches pack | Option/stem verbatim |
|---|---|---|---|---|
| `lms-*` | 324 | 324 (text marker; glyph-corroborated) | 324 | 323 exact (+1 `\$` escape) |
| `gk20242-*` | 19 | 19 (text marker) | 19 | 19 |
| `fmt-*` | 81 | 81 (selected radio) | 81 | 81 |
| **total** | **424** | **424 / 424** | **424 / 424** | **424 / 424** |

Glyph-consistency audit of the source: 485 blocks parsed, 461 with a derivable answer, **0** with a
check-marked option outside the answer set or a cross-marked option inside it.

### The 6 “every choice marked correct” `multiple_choice` items
`lms-249, lms-257, lms-261, lms-269, lms-270, lms-271`. All six are **genuinely all-correct in the source**:
the `The correct answers are:` line in each lists exactly the 4 choices (and for 5 of the 6 the student's
4 check glyphs also cover all options). Confirmed visually on LMS pp. 225, 231, 232, 236, 237.
(`lms-249` is a Partially-correct attempt — 3 of 4 boxes ticked — but the answer line lists all 4.)

## Non-ok findings (full table)

| id | verdict | evidence (file + page + marker) | issue |
|---|---|---|---|
| `lms-192` | **BLOCKER** | quiz LMS.pdf p.153 (Quiz 0704 Q1) — source figure: `Teacher 2 ──teaches▷── 0..3 Course`; marker `The correct answer is: Một giáo viên chỉ dạy hai khóa học` | Stem needs that class diagram; pack attaches `svg-sdlc` (SDLC life-cycle, alt “Vòng đời phát triển phần mềm (SDLC)”). Diagram missing → question unanswerable/misleading. Fix: supply the class-diagram SVG or drop the item. |
| `gk20242-003` | **BLOCKER** | giữa kì 20242.pdf p.3 (Q5) — source figure: class diagram A ◇── B (aggregation); marker `The correct answer is: Nếu một thể hiện của A bị xoá, thể hiện của B … không bị ảnh hưởng` | Stem “biểu đồ class sau” refers to that diagram; pack attaches `svg-sdlc` (unrelated SDLC diagram, wrong alt). Fix: supply the class-diagram SVG (or exclude) + accurate alt. |
| `fmt-056` | **BLOCKER** | 100 câu.pdf p.37 (MS-Forms Q81) — stem `Ký hiệu sau được sử dụng trong biểu đồ UML nào?`; the symbol is absent from the print (no image/vector on the page; only the generic per-question MS-Forms icon), source radio = `Biểu đồ hoạt động` | Stem refers to a symbol that is not present in the source or the pack; pack attaches `svg-uml-overview` (generic UML overview) instead. Question unanswerable as written. Fix: exclude (like the other figure items) or recover the symbol from the live form. |
| `null` (systemic) | MAJOR | all explanations | Per-choice analysis is boilerplate in ~88 % of the 1635 per-choice lines; the per-tag “Lời giải”/“Điểm dễ nhầm” blurbs are frequently off-topic for the stem (gk20242-003, lms-008, lms-031, lms-270 …). Marked answers are correct; the prose is not substantive. Fix: derive distractor analysis from the actual choices and pick the blurb from the real stem topic. |
| `lms-294` | MINOR | quiz LMS.pdf p.250 — source `{$ git branch dev}` vs pack `{\$ git branch dev}` | Deliberate `$` escaping (renders as `$`). Only stem deviation in the pack. Fix: leave as-is or use a code span. |
| `null` (systemic) | MINOR | all images | 31 topic SVGs heavily re-used (`svg-sdlc` ×97 …); some are unrelated to the stem (decorative). Self-contained/well-formed/alt present. Fix: optional — hide decorative image when unrelated. |

All other 421 questions (424 − 3 BLOCKERs): **ok** (marker re-derived, choices verbatim, answer matches, media self-contained).

## `### Nguồn` URL check (all opened, all real)

| URL | used by | verdict |
|---|---|---|
| `https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F` | 44 | real; covers snapshots/three states |
| `https://refactoring.com/` | 29 | real (Martin Fowler, definition of refactoring) |
| `https://scrumguides.org/scrum-guide.html` | 25 | real (Scrum Guide 2020) |
| `https://agilemanifesto.org/` | 25 | real (4 Agile values) |
| `https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/` | 34 | real (CTFL v4.0, test techniques) |
| `https://www.omg.org/uml/` | 34 | real (OMG UML) |

Textbook citations (Pressman & Maxim; Sommerville; SWEBOK v4; ISTQB CTFL) appear without page numbers, so
only the works’ existence/relevance is asserted — plausible and standard, not page-verifiable.

## Validators (re-run on the pack)

* `node scratch/kit/validate.mjs public/quizzes/nmcnpm_on_tap_tong_hop.json` →
  `OK … n=424 types {"single_choice":397,"multiple_choice":27} images=424 tagged=424 source=merged`;
  **all files valid, 6 warnings** (the 6 “every choice marked correct” warnings — verified genuine);
  exit 0.
* `python scratch/kit/svgcheck.py public/quizzes/nmcnpm_on_tap_tong_hop.json` →
  `media totals {'svg': 424, 'ascii': 0, 'src': 0}; all media OK`; exit 0.

## Could not verify / limits

* **Not every one of the 108 author-“medium confidence” items was inspected visually** — visual coverage
  was 82 questions (weighted to all `gk20242-*`, all `multiple_choice`, the T/F items, the page-continuation
  MS-Forms fixes). All 108 (and all 424) were still re-derived programmatically and verbatim-diffed.
* Textbook citations carry no page/edition locators, so the specific page-level claims cannot be checked.
* `scratch/kit/spans.py` named in the task does not exist; glyph work was done directly with `pymupdf`.
* The two source media PDFs render with harmless `MuPDF … ICCBased color space` warnings.
* `fmt-056`’s original “Ký hiệu” could not be recovered from the print (the page has no image/vector for it;
  the small book-with-audio glyph that appears next to every MS-Forms question is a generic
  immersive-reader icon, identical on all 100 questions — checked by pixel-comparison), so its content
  could only be judged as “figure missing”, not verified.
* Source anomaly (not a pack defect): `lms-173`/quiz 0609-Q5 is labelled “Select one:” yet its marker reads
  `The correct answers are: Mượn sách, Trả sách`. The pack follows the authoritative answer line
  (multiple_choice, 2 correct) — consistent with the source marker.
* The author’s `notes/evidence-nmcnpm.jsonl` pages/markers were compared to my parse: **0 page mismatches**
  and 0 marker-payload mismatches (`fmt-*` markers are descriptive strings, as expected).

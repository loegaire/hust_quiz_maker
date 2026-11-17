# Notes — HUST_quiz / OneDrive 2026-11-09 corpus

## Task
Extract `OneDrive_2026-11-09.zip` (740 MB, 441 entries, all under `Ôn thi cuối kì/`) and build one
large quiz per subject for 4 subjects, including only questions whose answer is **explicitly marked
in the source PDF**. Follow `schemaVersion: 1` (see README "Quiz JSON Specification") and mirror the
style of `public/quizzes/mang_may_tinh_on_tap_day_du.json`.

## Subject → file mapping (verified by file name prefix)
| subject key | Vietnamese subject | zip prefix | files |
|---|---|---|---|
| `pttkht` | Phân tích thiết kế hệ thống (IT3120) | `Phân tích thiết kế hệ thống - ` | 20 |
| `android` | Lập trình Android | `Android - ` | 11 |
| `hpt` | Hệ phân tán (Distributed Systems) | `Hệ phân tán - ` | 6 |
| `nmcnpm` | Nhập môn công nghệ phần mềm (IT3180) | `Công nghệ phần mềm - ` | 16 |

`Nhập môn công nghệ phần mềm` has no file literally named that; the corpus only carries
`Công nghệ phần mềm - *` for this course. `Công nghệ phần mềm - quiz LMS.pdf` is literally a
`BL-IT3180-157489 - Nhập môn công nghệ phần mềm` LMS export, which confirms the mapping.
Neighbouring but different subjects (excluded): `Thiết kế xây dựng phần mềm`, `Đảm bảo chất lượng
phần mềm`, `ITSS`, `Đa nền tảng`, `UI,UX`, `Web`, `Đa phương tiện`.

## Extracted layout
- `extracted/<subject>/*.pdf` — extracted source PDFs (originals preserved in the zip).
- `extracted/<subject>/txt/*.txt` — `pdftotext -layout` dumps (only meaningful for PDFs with a text layer).
- `scratch/` — disposable toolchain: `scratch/venv` (pymupdf, pdfplumber), `scratch/kit/*` helpers,
  `scratch/squashfs-root` (tesseract AppImage), `scratch/probe` renders. Not for commit.

## Toolchain (verified)
- Text layer: `pdftotext -layout in.pdf out.txt`.
- Per-span font/color/geometry: `scratch/venv/bin/python scratch/kit/spans.py <pdf> <p0> <p1>`.
- Color usage census: `scratch/venv/bin/python scratch/kit/colors.py <pdf...>`.
- Marked-answer overlay detection (colored fills + PDF annotations): `scratch/kit/marks.py <pdf> [p0] [p1]`.
- Page render for vision reads: `pdftoppm -r 150 -f N -l N -png <pdf> <outprefix>` then `read <png>`.
- `tesseract 5.5.4` (AppImage, `vie` traineddata) is installed but **OCR quality on these phone
  scans is unusable** (perspective + low contrast). Vision transcription via `read <png>` is reliable.
- Schema/quality validator: `node scratch/kit/validate.mjs <file.json>...` (mirrors
  `src/lib/quizSchema.ts` + cross-reference and media/LaTeX gates). Passes all existing quizzes.

## Answer-marking inventory (verified, not assumed)
Machine-readable markers:
- `Công nghệ phần mềm - quiz LMS.pdf` (275 p): LMS attempt reviews, text contains `The correct answer is: <option>`. 453 occurrences.
- `Công nghệ phần mềm - quiz 100 câu.pdf` (103 p): MS Forms export; correct option carries a green fill
  `#13a10e` (`0.07,0.63,0.05`) + green text — map by geometry.
- `Công nghệ phần mềm - giữa kì 20242.pdf` (12 p): 30 × `The correct answer is:`.
- `Android - ngân hàng câu hỏi trắc nghiệm.pdf` (57 p): each option prefixed `[100]` (correct) or `[0]`. 165 `Câu` blocks.
- `Android - quiz Google.pdf` (108 p): Android Developers pathway quizzes, `radio_button_checked` / `check_box_checked` mark correct options.
- `Hệ phân tán - đáp án đề kì 20212.pdf` (5 p): answer key, `Key = <answer>` lines (40).
- `Phân tích thiết kế hệ thống - tổng ôn 1.pdf`: Moodle attempt review, `The correct answers are: ...` (multi-correct supported).

Geometric/annotation markers (need `marks.py` + vision cross-check):
- `Hệ phân tán - cuối kì 20221.pdf`: red `#fe5252` fill over the correct option.
- `Hệ phân tán - cuối kì 20241.pdf`: yellow + red fills.
- `Phân tích thiết kế hệ thống - giữa kì 20242.pdf`: yellow `#ffff00` fill over correct option(s).
- `Phân tích thiết kế hệ thống - cuối kì 20222.pdf`: 42 `Highlight` annotations.
- `Phân tích thiết kế hệ thống - cuối kì 20242.pdf`: 60 × `The correct answer is: a.` but option bodies are images.
- Scans with handwritten ink circles (`Ink` annots or drawn on the raster): PTTKHT cuối kì 20221 (48),
  thi thử 20221 (25), Android giữa kì 20231 (57), Android giữa kì 20201 (red rects) — vision only.

Scanned/image-only PDFs (no text layer, vision only): PTTKHT cuối kì 20211, Android cuối kì
20221/20231/20241, Android giữa kì 20201/20211/20221/20241, Android thi thử kì 20212, Hệ phân tán
cuối kì 20212/20232/20241/20242, NMCNPM ôn tập cuối kì 20252, phần tự luận cuối kì 20231, đáp án
phần tự luận cuối kì 20251.

Sources with **no** answer marking (excluded as answer sources): all plain exam papers without keys
(`đề mẫu`, `thi thử` without highlights, `ôn tập trắc nghiệm` "Corrected" copy has no visible
per-option mark, `quiz cô Mai Anh`, `Android - giữa kì 20231`).

## Failed attempts / dead ends
- `unzip -l` mojibakes the names; the archive sets the UTF-8 flag, so Python `zipfile.orig_filename` decodes correctly.
- tesseract AppImage segfaults when calling `squashfs-root/usr/bin/tesseract` directly; use `squashfs-root/AppRun` (sets `LD_LIBRARY_PATH`/loader).
- `pypdf`/`fitz` module absent; installed `pymupdf` + `pdfplumber` in `scratch/venv`.
- No root (`sudo` needs a password) → no `dnf`; all tooling is user-space.

## QA harness (all verified working)
| gate | command |
|---|---|
| schema + cross-refs + media shape | `node scratch/kit/validate.mjs public/quizzes/*.json` |
| media well-formedness / src existence | `scratch/venv/bin/python scratch/kit/svgcheck.py <quiz.json>` |
| cross-quiz duplicate stems | `node scratch/kit/dupes.mjs` |
| real app import pipeline (browser) | dev server `npm run dev` → `/import` → upload file → Validate |
| rendered media check (browser) | `scratch/venv/bin/python scratch/kit/gallery.py scratch/gallery_all.html <quiz.json…>` → open `http://localhost:5173/scratch/gallery_all.html` and assert every `<img>` has `naturalWidth>0` |
| independent answer ground truth | `scratch/gt/*.json` (see below) |

Independent ground truth built here (separate code path from the authors'):
`android_bank.json` (164 bank questions, `[100]` marker), `android_google.json` (146 Google-quiz
questions, glyph markers), `nmcnpm_lms.json` (426 LMS questions, `U+F00C` check glyph + stated answer
text; `U+F00D` = the student's wrong pick), `msforms_questions.json` (100 MS-Forms questions with the
selected radio resolved geometrically — this is what caught the fmt-* defects),
`pttkht_rev1.json` (20 Moodle-review questions, glyph + stated text), `hpt_key.json` (40 `Key =` lines).
Helper: `scratch/kit/msforms.py` (top-anchored radio bands with page-global y; validated).

## Verified results so far
- `android_on_tap_tong_hop.json` — 184 q. Answers independently reproduced: 147/147 bank + 37/37 Google, 0 mismatches. Validator OK, 180 images all render.
- `he_phan_tan_on_tap_tong_hop.json` — 57 q. 37/37 official `Key =` answers match (differences vs the key were diacritic/typographic only). Validator OK.
- `pttkht_on_tap_tong_hop.json` — 80 q. 13/14 independently reproducible `rev1-*` answers match (the 14th was my matcher's error), 14:10. Validator OK.
- `nmcnpm_on_tap_tong_hop.json` — 414 q. 251/324 LMS questions independently reproduced with 0 answer mismatches; 68/71 MS-Forms answers confirmed geometrically, **but 13 `fmt-*` questions had truncated stems/choices or a missing option** → sent back to the author for repair (see `notes/review-nmcnpm.md` fix pass).
- App import pipeline (real Zod path in the browser) accepts all packs.

## Final deliverables
| file | questions | answers | media |
|---|---|---|---|
| `public/quizzes/android_on_tap_tong_hop.json` | 184 (177 sc / 7 mc) | 147 bank `[100]` + 37 Google glyph | 173 (112 svg / 61 ascii) |
| `public/quizzes/nmcnpm_on_tap_tong_hop.json` | 422 (395 sc / 27 mc) | 324 LMS + 79 MS-Forms radio + 19 gk `The correct answer` | 319 (317 svg / 2 source raster) |
| `public/quizzes/pttkht_on_tap_tong_hop.json` | 80 (44 sc / 36 mc) | 20 Moodle review + 60 blearning review | 53 (28 svg / 1 ascii / 24 source raster) |
| `public/quizzes/he_phan_tan_on_tap_tong_hop.json` | 56 (56 sc) | 37 official `Key =` + 19 red-fill key | 38 (27 svg / 11 ascii) |

Supporting: `notes/subject-file-manifest.md` (which zip files belong to which subject + answer-source
verdict), `notes/evidence-<subject>.jsonl` (per-question provenance), `notes/review-<subject>.md`
(author exclusions), `notes/review-<subject>-report.md` + `-issues.jsonl` (independent auditor),
`notes/flagged-for-review.md` (uncertain items for a stronger model), `notes/authoring-contract.md`,
`notes/reviewer-contract.md`.

## Final gate results (all green)
- `validate.mjs` over all 23 quizzes: all valid, 0 ERR (12 warnings, all "every choice marked correct"
  or odd `$` on faithful source content).
- `svgcheck.py` on the 4 packs: 484 svg + 73 ascii + 26 raster src, 26/26 src files present, all media OK.
- `dupes.mjs`: 1 remaining stem collision — `pttkht ck20242-025/045`, different options + different
  answers (different exam kíp) → intentional.
- `boilerplate.py`: median per-question boilerplate 0.18–0.23; only section headings and citation lines
  repeat.
- Real app import pipeline (browser, Zod path): all 4 packs `Ready …` and `Quiz imported successfully`.
- In-app rendering: quiz runs, grading + 5-section explanation render, `svg` (blob URL) and raster `src`
  (`/images/pttkht/…png`) both load; 583-item media gallery renders with 0 broken images.
- Independent answer reproduction (my own extractors, separate from the authors' code):
  android 147/147 + 37/37; nmcnpm LMS 252-reproduced/0 mismatch + MS-Forms 68/71 confirmed (3 repaired);
  pttkht 13/14 (the 14th was my matcher's over-match); hpt 37/37 keys.
- Independent auditor passes: android 0 BLOCKER / 3 MAJOR / 21 MINOR; hpt 0 BLOCKER / 2 MAJOR / 8 MINOR;
  pttkht 0 BLOCKER / 13 MAJOR / 6 MINOR; nmcnpm 3 BLOCKER / 1 systemic MAJOR / 2 MINOR — every finding
  fixed and re-verified (answers were verified correct in all four audits before the fixes).

## Next steps (only if wanted)
1. Get the course lecture slides; then explanations can cite slide pages instead of online docs.
2. Settle the `notes/flagged-for-review.md` items with a stronger model.
3. Some answer sources are scans whose marks are a compiler's key (`hpt 20221` red fills measured 24/25):
   a second human read would upgrade them from "measured" to "certain".

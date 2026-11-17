# Review — Phân tích thiết kế hệ thống (IT3120)

Pack: `public/quizzes/pttkht_on_tap_tong_hop.json` (`id = pttkht-on-tap-tong-hop`), **80 câu**,
**53 media item** (28 svg + 1 ascii + 24 raster trích từ PDF: 10 bộ phương án-ảnh + 14 hình đề),
trải trên 49 câu (28 câu có hình trong `question.images`).

Inclusion rule enforced: a question enters the pack **only** when the source carries an explicit
authoritative marker. Handwritten ink / coloured student highlights / "Đáp án" words were never used.

## Included sources (markers)

| source file | marker | questions kept |
|---|---|---|
| `Phân tích thiết kế hệ thống - tổng ôn 1.pdf` (Moodle `Trắc nghiệm: Attempt review`) | `Your answer is correct.` + `The correct answer is:` / `The correct answers are:` and the green correct-answer tick (`U+F058`) on each correct option | 20 (ids `rev1-q001`…`rev1-q020`) |
| `Phân tích thiết kế hệ thống - cuối kì 20242.pdf` (bLearning `Đề thi kíp 3/4/5: Attempt review`) | `The correct answer is: <letter>.` / `The correct answers are: …` | 60 (ids `ck20242-001`…`ck20242-060`) |

Image-only option sets: `tổng ôn 1` questions 7, 8, 9, 16 (options are vector UML figures) were
re-drawn faithfully as inline `svg` (self-contained). The 10 image-option questions of
`cuối kì 20242` (K1Q1, K1Q2, K1Q4, K1Q9, K2Q3, K2Q9, K3Q1, K3Q9, K3Q11, K3Q19) had their option
figures extracted from the PDF (`page.get_pixmap(clip=…)`) into `public/images/pttkht/`. Choices are
kept as `A/B/C/D` labels and the stem states that the figure shows options a–d.

### Excluded image-option questions
**None.** All 10 image-option questions of `cuối kì 20242` and all 4 of `tổng ôn 1` were reproduced
faithfully (crops verified visually; SVGs re-drawn from the rendered source). No image question was
dropped for irreproducibility.

## (a) Ambiguous marker
- **`cuối kì 20242` questions 1–20 per kíp that carry a marker but whose option bodies are images:** the
  marker is an unambiguous letter (`a.`/`b.`/`c.`/`d.`). Where the option body is an image the letter was
  mapped to the visually-confirmed figure (every one of the 10 was rendered and inspected). No ambiguity.
- **`tổng ôn 1` Q7/Q8/Q9/Q16:** the Moodle marker prints `The correct answer is:` with **empty text**
  (the answer is a figure). The correct option was recovered from (i) `Your answer is correct.` for that
  item and (ii) the green `U+F058` tick position in the text layer, then confirmed by rendering pages
  6/7/8/14. Result: Q7→c, Q8→c, Q9→b, Q16→c. No guesswork.

## (b) Marker contradicting authoritative knowledge
**None found.** Every marked answer was checked against UML 2.5 semantics / standard SA&D. Two items are
*defensible-but-course-specific* and are flagged for a stronger reviewer:
- `rev1-q009` — "quan hệ chặt nhất" is marked as **generalization** (hollow triangle), not composition.
  This matches the course's teaching (inheritance couples a subclass to its superclass most tightly) and
  the UML meaning of the symbol; a reviewer preferring "composition = strongest" would disagree, but the
  source symbol is unambiguously generalization.
- `ck20242-031` (K2Q11) — "bản thực được sử dụng trên SSD" marked **b (Tác Nhân)** and **d (Hệ thống giao
  dịch ngân hàng)**. This is course-specific: the external co-operating system is modelled as an actor
  instance on the SSD. It does not contradict UML.

## (c) Unreadable scan
None for the two included sources — both have a clean machine-readable text layer and vector/raster
figures that were extracted directly.

## (d) Question type not representable in the schema
- The **essay** items of both sources were excluded by design: `tổng ôn 1` "Tự luận" questions 1–3
  (use-case/class/UI-design drawing tasks) and `cuối kì 20242` questions 21–23 of each kíp
  ("Sơ đồ thành phần…", "vẽ lại theo quy chuẩn UML", marked out of 20.00). Free-drawing answers are not
  representable as `single_choice`/`multiple_choice`/`fill_gap`.

## Highlight-based source — measured agreement (`Phân tích thiết kế hệ thống - cuối kì 20222.pdf`)
The MOOC daotao.ai exam view (21 pages) carries 42 `Highlight` + 24 `Ink` + 1 `FreeText` annotations and
**no text answer key**. Each Highlight rect was mapped by bbox overlap to the option paragraph it covers
(option column x0≈293 pt); 42 raw rects collapse to 27 distinct highlighted options.

Agreement against an independent UML 2.5 / SA&D judgement of the correct option:

| metric | value |
|---|---|
| determinable highlights | 24 |
| agree with authoritative answer | 19 |
| disagree (wrong option highlighted) | 5 |
| undeterminable / unclear | 3 |
| **agreement fraction** | **19/24 = 0.79** |

0.79 is far above chance (~0.31 for four options) but clearly below 1.0, and the highlight set contains a
contradiction (both "Hình 2" and "Hình 3" highlighted on the same question) plus duplicated / 4-pt-wide
fragment rects. **Verdict: the highlights are a single annotator's own (largely correct, occasionally
wrong) answers, not an authoritative key → the file is excluded.** The independent `Ink` marks on the
first (shuffled) attempt view agree with the highlights on some questions (waterfall, business-process,
UI-prototype, DB-design, dynamic diagrams) but disagree on others (layered-architecture, PTKTTG,
domain-class), which further rules out a curated key. Raw data: `scratch/probe/highlight20222.json`.

## Other pttkht files (not answer sources)
- `Phân tích thiết kế hệ thống - tổng ôn 2.pdf` — bLearning `ExamDemo / Preview`, every item shows
  "Not yet answered", **no marker at all**. Excluded (also duplicates `tổng ôn 1` content).
- `Phân tích thiết kế hệ thống - giữa kì 20242.pdf` — plain exam paper ("ĐỀ THI GIỮA KỲ…") with a
  yellow `#ffff00` fill over some options → **student highlight, not a key**. Excluded.
- `cuối kì 20221`, `thi thửkì 20221`, `cuối kì 20211`, etc. — exam scans whose ink circles / coloured
  marks are student markings. Excluded (no authoritative marker).
- `cuối kì 20181/20202/20212/20232/20241/20251/20252`, `thi thử 20202/20212/20232/20241/20242` — exam
  papers without any per-option key. Excluded.

## Note on a shared stem (not a duplicate)
`ck20242-025` (K2Q5) and `ck20242-045` (K3Q5) share the stem "Chọn các yêu cầu chức năng?" but have
**different option sets and different correct answers** (K2: a,c; K3: c,d). They are distinct questions
from different exam kíp, so both are kept (the contract only drops byte-identical duplicates).

## Gates run
1. `node scratch/kit/validate.mjs public/quizzes/*.json` → **`OK pttkht_on_tap_tong_hop.json: … n=80
   types={"multiple_choice":36,"single_choice":44} images=40 tagged=80`**, zero `ERR`.
2. Duplicate sweep: only the shared-stem pair above (distinct questions); no byte-identical duplicates.
3. Answer/transcription audit: every stem and every choice re-checked byte-for-byte against the parsed
   source records (0 mismatches); every `correctChoiceIds` recomputed from the source marker (0
   mismatches). Visual page audit of the sample **`ck20242-002, -003, -007, -008, -012, -013, -018,
   -019, -024, -025, -030, -031, -032, -033, -042, -043, -044, -058`** and **`rev1-q002, q003, q012,
   q017, q018`**, plus **all 14 image-option questions** (rendered and read) — all transcriptions and
   markers confirmed.
4. Media audit: all 28 inline `svg` parse as XML; all 24 `src` files exist on disk under
   `public/images/pttkht/`; the single `ascii` (DFD) is text.
5. Counts: single_choice 44, multiple_choice 36; media 53 across 49 questions (61% of questions carry
   media); tagged 80/80; excluded items: essay items of both sources, and the files listed under
   "Other pttkht files".

## Fix pass (integrator QA gate, after independent audit)
The independent audit (`notes/review-pttkht-report.md`, `notes/review-pttkht-issues.jsonl`) re-derived
all 80 markers from source (80/80 answers correct, 80/80 stems+choices byte-identical, 14/14
image-option items ok) and raised 13 MAJOR + 6 MINOR findings, all media/citation. Fixes applied
**without changing any stem, choice, answer or id**:

### MAJOR — 12 stem-figure questions now carry the source figure in `question.images`
Figure crops were extracted from the named source page (300 dpi, padding 3 pt) to
`public/images/pttkht/<id>-fig.png` and attached; each was verified by rendering + reading.
| id | source page | figure |
|---|---|---|
| `rev1-q005` | `tổng ôn 1` p.4 | khung `[XOR]` View1/View2 |
| `ck20242-011` | `cuối kì 20242` p.7 | khung SSD, ô `[X]` |
| `ck20242-018` | p.11 | sơ đồ tuần tự a:A/b:B/c:C/d:D |
| `ck20242-028` | p.23 | lớp «Mặt Hàng» |
| `ck20242-035` | p.27 | cây kế thừa làm phẳng (đếm thuộc tính) |
| `ck20242-038` | p.29 | lớp Circle (r, x, y, draw, area) |
| `ck20242-043` | p.38 | sơ đồ giao tiếp :a/:b/:c, m1/m2, 1a/1b |
| `ck20242-046` | p.40 | ca sử dụng ô `[X]`/`[Y]` |
| `ck20242-047` | p.40 | ca sử dụng ô `[Y]` |
| `ck20242-050` | p.42 | SSD :Giảng Viên/:Hệ thống, `[X]`/`[Y]` |
| `ck20242-055` | p.45 | sơ đồ lớp, ô bội số `[X]`/`[Y]` |
| `ck20242-058` | p.46 | cấu trúc lớp Bài Kiểm Tra–Câu hỏi |

### MAJOR — off-topic media removed/replaced
- `ck20242-022` (generalization "Kế thừa"): removed the unrelated component SVG + DFD ASCII; attached a
  new accurate `generalization.svg` (subclass A → superclass B, hollow triangle).
- The DFD ASCII was moved to `ck20242-027` (functional/use-case scope) instead of being dropped.

### MINOR
- `rev1-q002` — citation corrected `trang 1` → `trang 2`.
- `ck20242-023` — citation corrected UML 2.5.1 `mục 17.3` → `mục 17.9` (verified against the
  official UML 2.5.1 TOC: §17.3 = Lifelines, §17.9 = Communication Diagrams).
- `ck20242-024` — source figure (p.21, glyph X on a lifeline) now attached; the on-topic
  `sequence.svg` remains in the explanation.
- `ck20242-042` — source figure (p.38, link A—x—B) now attached.
- `ck20242-026` — off-topic `client-server` SVG replaced by a new `blackbox.svg` (actor → black-box
  system), matching the "biểu diễn hộp đen" question.
- `ck20242-045` — off-topic `sequence` SVG removed.
- `ck20242-043` — self-drawn `communication` SVG removed (the exact source figure is now attached).

### Gates after the fix pass
- `node scratch/kit/validate.mjs public/quizzes/*.json` → **OK**, `n=80 types={"multiple_choice":36,
  "single_choice":44} images=53 tagged=80`, 0 ERR / 0 WARN.
- `scratch/venv/bin/python scratch/kit/svgcheck.py public/quizzes/pttkht_on_tap_tong_hop.json` →
  `media totals {'svg': 28, 'ascii': 1, 'src': 24}, referenced src files 24` → **all media OK**.
- `notes/evidence-pttkht.jsonl` regenerated — only change: `rev1-q002` page `1 → 2` (all other 79
  records unchanged; the evidence schema has no media field).

# Independent review — Hệ phân tán (`he_phan_tan_on_tap_tong_hop.json`, 57 câu)

Auditor: independent (author's `notes/evidence-hpt.jsonl` / `notes/review-hpt.md` were **not** used as
evidence; every marker re-derived from the source PDFs).

## 1. Verdict summary

| Severity | Count | Ids |
|---|---|---|
| BLOCKER | 0 | — |
| MAJOR | 2 | `key20212-15`, `key20221-5` |
| MINOR | 8 | `key20212-1`, `key20212-2`, `key20212-5`, `key20212-7`, `key20212-8`, `key20212-12`, `key20212-20`, `key20221-25` (key20212-21 shares the key20212-20 fig) |
| ok | 47 | rest (key20212-21 counted ok; shares the key20212-20 finding) |

**Marker verdict for all 57: PASS** (every one of the 57 carries a key that I reproduced myself).
No BLOCKER: no wrong key, no missing/non-authoritative marker, no fabricated citation, no broken media,
no duplicate id, schema valid.

## 2. Marker re-derivation (all 57)

**`key20212-*` (37 câu).** Marker = the official answer sheet
`extracted/hpt/Hệ phân tán - đáp án đề kì 20212.pdf` (text layer; `Key = …` lines). Re-parsed all
`Câu n / Key = …` lines myself — pages: Q1–9 → p1, Q10–18 → p2, Q19–27 → p3, Q28–36 → p4, Q37–40 → p5.
For every `key20212-n` the pack's `answer.correctChoiceIds[0]` maps (via the recovered option text) to
the source `Key` value **exactly** (all 37 match, letter-to-text). The 40 official keys reduce to 37
usable: Q23, Q25 have `Key =` **blank**, Q27 has a contradictory double key (`Key = …` *and* `Key2 = …`)
— correctly excluded.

**`key20221-*` (20 câu).** Marker = the red `#fe5252` fills in
`extracted/hpt/Hệ phân tán - cuối kì 20221.pdf` (digital vector PDF), located with
`scratch/kit/marks.py` and an independent column-aware red-rect→text-line matcher.
I re-derived 25 red answers (independently reproduces the set the pack used): 1 A, 2 C, 3 A, 4 A, 5 D,
6 B, 7 A, 8 D, 9 B, 10 C, 11 D, 12 C, 13 C, 14 A, 15 A, 16 C, 17 B, 18 D, 19 A, 20 C, 21 B, 22 B,
23 B, 24 C, 25 A. The pack keeps 20 of these (1,2,4,5,6,7,8,10,11,13,15,17,18,19,20,21,22,23,24,25),
drops 5 (Q9 = contradictory, Q3/12/14/16 = semantic duplicates of the `key20212` pack) — consistent
with its own description. Each kept letter matches the red fill. On domain grounds one where the marked
answer is questionable (Q5) is reported below; the rest are correct.

## 3. Coverage statement

- **100 % (57/57):** marker re-derived; schema + media checked programmatically.
- **Full verbatim comparison vs the rendered source: 57/57** (≥ 25 % required).
  - `key20212-*`: the exam `Hệ phân tán - cuối kì 20212.pdf` is image-only; I extracted the embedded
    page scans (`pymupdf` `get_images`) and read all 4 pages at native resolution, zooming stems and
    every option block of all 37 questions.
  - `key20221-*`: the exam is a digital PDF with a real text layer; compared all option text verbatim
    against `extracted/hpt/txt/Hệ phân tán - cuối kì 20221.txt`, and confirmed each red mark by
    rendering the pages (`pdftoppm`) + the red-rect mapper.
- Covers 100 % of the hard questions (`key20212-7,12,13,14,16,17,20,21,24,29,31,39`) and 100 % of the
  questions the author himself flagged (`key20221-5`, `key20221-9`(removed), `key20212-27`(removed)).

## 4. Tooling restated

- `node scratch/kit/validate.mjs public/quizzes/he_phan_tan_on_tap_tong_hop.json`
  → `OK   he_phan_tan_on_tap_tong_hop.json: quiz.id=he-phan-tan-on-tap-tong-hop n=57
  types={"single_choice":57} images=39 tagged=57 source=local-course-materials` / **all files valid,
  0 warnings**. (no duplicate id, no empty explanation/tag, every `svg` starts `<svg`/ends `</svg>`.)
- `python scratch/kit/svgcheck.py …` → `media totals {'svg': 25, 'ascii': 14, 'src': 0}` /
  **all media OK** (all `svg` self-contained: `xmlns`, no external `href`, no scripts, no
  `var()`/`currentColor`; all 39 items carry `alt`).
- `node scratch/kit/dupes.mjs` → **no `he_phan_tan_*` entry** in the duplicate list (no stem collision
  with any other pack).
- Citations: all 22 distinct URLs return HTTP 200; I opened the two non-Wikipedia lecture PDFs and
  grepped them — the UTSA ch04 deck really contains "Passing Value Parameter in RPC — Problem:
  different data representations" and "Passing Reference Parameters in RPC / Forbid reference
  parameters" (supports `key20212-19` and the exclusion of `key20221-9`) and "STREAM-ORIENTED
  COMMUNICATION … Quality of Service"; the UCSB DS-3 deck contains the "Weak mobility / Strong
  mobility" definition.
- Difficulty/tags: `medium 29 / easy 16 / hard 12`; 57/57 have `difficulty` and non-empty `tags`.

## 5. Per-question table

`verdict` = ok / MINOR / MAJOR / BLOCKER. Evidence = source file + page + marker.

| id | verdict | evidence (file + page + marker) | issue |
|---|---|---|---|
| key20212-1 | MINOR | đáp án 20212 p1 `Key = A`; exam 20212 p1 scan | options B/C/D wording differ from the exam scan (see issues) |
| key20212-2 | MINOR | đáp án 20212 p1 `Key = 3*k`; exam p1 (A 2*k/B 3*k/C n*k/D 2*n*k) | typo "RESLEASE" in explanation |
| key20212-3 | OK | đáp án p1 `Key = Kết hợp kiến trúc tập trung và không tập trung`; exam p1 | ok |
| key20212-4 | OK | đáp án p1 `Key = Truyền dữ liệu cập nhật`; exam p1 | ok |
| key20212-5 | MINOR | đáp án p1 `Key = …chỉ quan tâm tới thứ tự sự kiện`; exam p1 | option D adds "chỉ" vs exam wording |
| key20212-6 | OK | đáp án p1 `Key = Có kiến trúc không tập trung, có cấu trúc`; exam p1 | ok |
| key20212-7 | MINOR | đáp án p1 `Key = 75`; exam p1 (A 75/B 67/C 92/D 88) | stem shortened vs exam note text |
| key20212-8 | MINOR | đáp án p1 `Key = Mỗi khi…home agent`; exam p1 | option D inserts "quảng bá" |
| key20212-9 | OK | đáp án p1 `Key = Tránh mâu thuẫn ghi-ghi`; exam p1 | ok |
| key20212-10 | OK | đáp án p2 `Key = …bền vững`; exam p1 | ok |
| key20212-11 | OK | đáp án p2 `Key = Quảng bá`; exam p1 | ok |
| key20212-12 | MINOR | đáp án p2 `Key = 8, 8, 11, 2`; exam p2 | redrawn ring omits source ID-space labels; alt text wrong |
| key20212-13 | OK | đáp án p2 `Key = 11, 11, 2, 2`; exam p2 | ok (same figure as 12) |
| key20212-14 | OK | đáp án p2 `Key = 8 -> 11`; exam p2 | ok (same figure as 12) |
| key20212-15 | MAJOR | đáp án p2 `Key = Socket UDP…multiplexing…`; exam p2 | option **B fabricated** (source option B is "cổng vật lý/logic") |
| key20212-16 | OK | đáp án p2 `Key = 20`; exam p2 | ok |
| key20212-17 | OK | đáp án p2 `Key = Đơn luồng 21.5…; Đa luồng 41.67…`; exam p2 | ok |
| key20212-18 | OK | đáp án p2 `Key = …tính trong suốt…`; exam p2 | ok |
| key20212-19 | OK | đáp án p3 `Key = …qui ước biểu diễn dữ liệu khác nhau`; exam p2 | ok (UTSA slide confirms) |
| key20212-20 | MINOR | đáp án p3 `Key = Thông điệp m1 từ P0 -> P2`; exam p2 (A circled) | ascii space-time figure coarse vs source (shared with key20212-21) |
| key20212-21 | OK | đáp án p3 `Key = T1=(0,1,0,0)…`; exam p2 | ok (ascii figure coarse) |
| key20212-22 | OK | đáp án p3 `Key = …chuyển tiếp con trỏ`; exam p3 | ok |
| key20212-24 | OK | đáp án p3 `Key = A là 3, B là 3`; exam p3 | ok |
| key20212-26 | OK | đáp án p3 `Key = Ko vì …hiệu năng và ATTT…`; exam p3 | ok |
| key20212-28 | OK | đáp án p4 `Key = …rơi vào trạng thái ko thống nhất`; exam p3 | ok |
| key20212-29 | OK | đáp án p4 `Key = (n-1)*y + n*x`; exam p3 | ok |
| key20212-30 | OK | đáp án p4 `Key = Đọc đơn điệu`; exam p3 | ok |
| key20212-31 | OK | đáp án p4 `Key = Giao thức ghi từ xa…`; exam p4 | ok |
| key20212-32 | OK | đáp án p4 `Key = Tạo ra 1 cluster ảo…`; exam p4 | ok |
| key20212-33 | OK | đáp án p4 `Key = Nodejs sử dụng mô hình đa luồng`; exam p4 | ok |
| key20212-34 | OK | đáp án p4 `Key = Có kiến trúc ko tập trung, có cấu trúc`; exam p4 | ok |
| key20212-35 | OK | đáp án p4 `Key = Secondary server…`; exam p4 | ok |
| key20212-36 | OK | đáp án p4 `Key = …timestamp nhỏ hơn thì thắng…`; exam p4 | ok |
| key20212-37 | OK | đáp án p5 `Key = Fine locking…`; exam p4 | ok |
| key20212-38 | OK | đáp án p5 `Key = 3n`; exam p4 | ok |
| key20212-39 | OK | đáp án p5 `Key = 2*k*(n-1)`; exam p4 | ok |
| key20212-40 | OK | đáp án p5 `Key = hard-link`; exam p4 | ok |
| key20221-1 | OK | 20221 p1 red fill on option A | ok (weak mobility = code+data; A best of the 4) |
| key20221-2 | OK | 20221 p1 red fill on option C | ok |
| key20221-4 | OK | 20221 p1 red fill on option A | ok |
| key20221-5 | MAJOR | 20221 p1 red fill on option D | marked answer D not supported by standard refs; likely B |
| key20221-6 | OK | 20221 p1 red fill on option B | ok |
| key20221-7 | OK | 20221 p1 red fill on option A | ok |
| key20221-8 | OK | 20221 p1 red fill on option D | ok |
| key20221-10 | OK | 20221 p2 red fill on option C | ok |
| key20221-11 | OK | 20221 p2 red fill on option D | ok |
| key20221-13 | OK | 20221 p2 red fill on option C | ok |
| key20221-15 | OK | 20221 p2 red fill on option A | ok |
| key20221-17 | OK | 20221 p2 red fill on option B | ok |
| key20221-18 | OK | 20221 p2 red fill on option D | ok |
| key20221-19 | OK | 20221 p2 red fill on option A | ok |
| key20221-20 | OK | 20221 p2 red fill on option C | ok |
| key20221-21 | OK | 20221 p2 red fill on option B | ok |
| key20221-22 | OK | 20221 p2 red fill on option B | ok |
| key20221-23 | OK | 20221 p2 red fill on option B | ok |
| key20221-24 | OK | 20221 p2 red fill on option C | ok |
| key20221-25 | MINOR | 20221 p3 red fill on option A | Nguồn cites Wikipedia CAP theorem (off-topic) |

## 6. Notes on the two removed-source questions (context, not in pack)

- `20221 câu 9` (RPC by-**reference**): red fill on option B ("…biểu diễn dữ liệu khác nhau"). On
  domain grounds this is **wrong** — the by-reference problem is the (different) address spaces / that
  pointers are meaningless remotely (option A). Correctly excluded by the pack. ✔ my judgment agrees.
- `20212 câu 27`: answer sheet gives two contradictory keys → correctly excluded.

# Flagged for a stronger model

Items that are included in a pack but rest on a judgement call, or that were excluded for reasons a
stronger model / a human with the course slides should settle. Everything else is either mechanically
verified against an authoritative marker or excluded. Per-subject detail lives in
`notes/review-<subject>.md`; independent auditor reports in `notes/review-<subject>-report.md`.

## Android (`android_on_tap_tong_hop.json`, 184 q)

| id | issue | what to decide |
|---|---|---|
| `bank-1953` | the bank marks `android:layout_height="wrap_content"` while the stem talks about content wider than the screen; the other three options are non-existent attributes or EditText-only | confirm the intended answer (possibly `layout_width`) |
| `bank-16488` | "which object creates a button whose content is an image?" marked as "all answers are correct", which includes `ImageView` | is `ImageView` a "button" in the course's wording? |
| `bank-16452` | "which statement about ViewHolder is NOT correct" → "reduces the number of times a view is inflated from XML" (ViewHolder caches child references; the recycler does the reuse) | check the course's phrasing |
| `bank-15434` | "which is not a challenge of Android development" → "using the dev tools on different OSes" | slide-level judgement |
| `bank-15356` | `db.insert("tblUsers", null, new ContentValues())` expected `-1` | confirm real `SQLiteDatabase.insert` behaviour with empty `ContentValues` |
| `bank-15363` | "stored long-term, not deleted on uninstall" → External Storage (true for shared storage; the app-private external dir is deleted on uninstall) | scope of "external" in the course |
| `bank-1975` | "best debug technique for many parallel processes" → "log to file" | opinion-shaped answer |

Answers were independently reproduced for 147/147 bank and 37/37 Google-quiz items with 0 mismatches,
so these are wording/teaching-scope questions, not marker conflicts.

## Hệ phân tán (`he_phan_tan_on_tap_tong_hop.json`, 56 q)

| id | issue | status |
|---|---|---|
| `20212 câu 27` | the official key prints two mutually exclusive answers for one question | excluded; likely a challenged/erratum item |
| `key20221-16` | physical vs logical clock: both B and C are true statements | excluded as a duplicate of an included item |
| `key20212-7` | distractor D reads **98** at native scan resolution (the auditor suggested 88) | **resolved here**: the scan shows `A. 75 B. 67 C. 92 D. 98` and the key is 75 → the pack now reads 98 |
| `key20212-8` | the auditor asked to drop "quảng bá"; the native-resolution scan does contain it | kept verbatim (source-faithful) |

Source-authority measurements: `cuối kì 20221` red fills agreed with standard DS knowledge on 24/25 items
→ accepted as a key; `cuối kì 20241` (~96%), `20242` (~91%) and `20232` (no marks) were excluded as
student annotations / keyless.

## PTTKHT (`pttkht_on_tap_tong_hop.json`, 80 q)

| id | issue | what to decide |
|---|---|---|
| `rev1-q009` | "tightest relationship" marked **generalization** (hollow triangle) rather than composition | matches the course + the UML symbol; a reviewer preferring "composition = strongest" would disagree |
| `ck20242-031` | on an SSD, the co-operating bank system is marked as **both an actor instance and a system** | course-specific SSD convention, not a UML contradiction |

`cuối kì 20222` (42 Highlight annotations) was excluded after re-measuring agreement at ≈0.75–0.86 with
one self-contradictory double highlight → a single annotator's answers, not a key. Both auditors agreed.

## NMCNPM (`nmcnpm_on_tap_tong_hop.json`, 422 q)

| item | issue |
|---|---|
| `fmt-056` | removed: the stem refers to a UML symbol that is not present in the MS-Forms print (the small icon on every question is a generic form glyph) |
| `lms-294` | contains a literal `$` inside a code span (`{$ git branch dev}`), which the validator flags as an odd `$` count — cosmetic |
| `lms-249/257/261/269/270/271` | `multiple_choice` where the source itself marks every option correct (`The correct answers are: a, b, c, d`) — faithful, but unusual; visually confirmed for all six |
| 30 questions | still depend on a source figure that could not be reproduced (see review file group (d)); they were left out rather than recast |
| MS Forms answers | derived from the selected radio of a 100/100 attempt (the print does not mark the key otherwise) — 68/71 confirmed geometrically against `scratch/gt/msforms_questions.json`, and 3 questions were repaired during the QA gate |

## Cross-cutting
- `pttkht ck20242-025` / `ck20242-045` share the stem "Chọn các yêu cầu chức năng?" but have different
  options and different answers (different exam kíp) — intentionally kept; not a duplicate.
- Source-file/page citations point into `extracted/<subject>/` (the extraction of `OneDrive_2026-11-09.zip`).
  The zip's own exam PDFs are cited, not slides: this corpus contains no lecture slides, so the "slide"
  half of the citation rule is satisfied by the source PDF page plus an authoritative online reference.

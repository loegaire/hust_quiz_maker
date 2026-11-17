# Independent review — Phân tích thiết kế hệ thống (IT3120)

Bộ đề kiểm: `public/quizzes/pttkht_on_tap_tong_hop.json` (`id = pttkht-on-tap-tong-hop`), **80 câu**.
Người kiểm độc lập; mọi dấu (marker) **được dựng lại từ PDF nguồn**, không dùng file bằng chứng của tác giả.

## Nguồn & marker (dựng lại độc lập)

| file | vị trí | marker dùng | số câu |
|---|---|---|---|
| `Phân tích thiết kế hệ thống - tổng ôn 1.pdf` | tr.1–17 (Moodle *Attempt review*) | `The correct answer(s) is/are:` + glyph tick `U+F058` trong lớp văn bản | 20 (`rev1-q001…q020`) |
| `Phân tích thiết kế hệ thống - cuối kì 20242.pdf` | tr.1–53 (bLearning, **3 kíp**: kíp 3 tr.1–18, kíp 4 tr.19–36, kíp 5 tr.37–53) | `The correct answer is: <letter>.` / `The correct answers are: …` | 60 (`ck20242-001…060`) |

Ánh xạ id → nguồn: `ck20242-001..020` = kíp 3 Q1..20; `ck20242-021..040` = kíp 4 Q1..20; `ck20242-041..060` = kíp 5 Q1..20.
Q21–23 mỗi kíp là câu tự luận (không marker) — không đưa vào pack.

## Kết quả tổng hợp

| hạng mục | kết quả |
|---|---|
| Marker dựng lại khớp `correctChoiceIds` | **80/80 ok** (0 lệch) |
| Stem + mọi lựa chọn đối chiếu nguồn, verbatim | **80/80 khớp** (sau chuẩn hóa khoảng trắng; 0 paraphrase/dropped/added/reordered) |
| Câu phương án là ảnh (image-option) | **14/14 ok** (4 ở `tổng ôn 1` = q7/8/9/16 vẽ lại bằng SVG; 10 ở `cuối kì 20242` trích PNG) |
| `node scratch/kit/validate.mjs` | **OK**: `n=80 types={"multiple_choice":36,"single_choice":44} images=41 tagged=80`, 0 ERR, 0 WARN |
| `scratch/kit/svgcheck.py` | **all media OK**: svg=30, ascii=1, src=10; 10 file `src` đều tồn tại |
| `dupes.mjs` | 79/80 stem phân biệt; 1 cặp trùng stem `ck20242-025`/`ck20242-045` (khác bộ lựa chọn & đáp án, khác kíp) — chấp nhận |
| **Tổng phát hiện** | **13 MAJOR + 6 MINOR = 19** (chi tiết ở `notes/review-pttkht-issues.jsonl`) |

## Độ phủ

- **100% số câu (80/80)**: dựng lại marker từ nhãn thô; kiểm schema + media bằng script.
- **Đối chiếu toàn văn với trang nguồn đã render (~30% = 24 câu)**:
  - `tổng ôn 1`: tr.4 (q5), tr.6 (q7), tr.7 (q8), tr.8 (q9), tr.14 (q16) — đọc bản render.
  - `cuối kì 20242`: tr.7 (q11), tr.11 (q18), tr.19 (q2), tr.21 (q4), tr.23 (q8), tr.27 (q15), tr.29 (q18), tr.38 (q2,q3), tr.40 (q6,q7), tr.42 (q10), tr.45 (q15), tr.46 (q18) — đọc bản render.
  - Toàn bộ 10 PNG image-option: so trực tiếp ảnh crop với trang nguồn tương ứng (tr.1,2,3,6 | 20,24 | 37,41,43,47).
- **Kiểm media**: 30 SVG tự chứa (đều có `xmlns`, không `href` ngoài, không script/`var()`/`currentColor`), 1 ASCII (DFD, đọc được), 10 PNG tồn tại; **tất cả media đều có `alt`**.

## Kết luận marker

- **`tổng ôn 1` (20 câu)**: marker dạng `The correct answer is:` khớp chữ cái/nhãn lựa chọn. Với 4 câu hình (q7,q8,q9,q16) marker **rỗng chữ**, đáp án lấy từ dòng `Your answer is correct.` + vị trí glyph `U+F058` (tọa độ y nằm trong ô đáp án) → q7→c, q8→c, q9→b, q16→c. **4/4 khớp** `correctChoiceIds` và **khớp hình nguồn sau khi render** (đọc trực tiếp các trang 6,7,8,14).
- **`cuối kì 20242` (60 câu)**: `The correct answer(s) is/are:` → chữ cái khớp **60/60** với `correctChoiceIds`.
- **Không có marker mơ hồ**; không câu nào có nhãn đáp án mâu thuẫn kiến thức UML.

## Câu phương án là ảnh — 14/14

SVG (4 câu `tổng ôn 1`): q7 (kim cương đặc phía Đơn hàng — hợp thành), q8 (tam giác rỗng — khái quát hóa), q9 (tam giác rỗng = quan hệ chặt nhất), q16 (mũi tên «Extend» từ Do B sang Do A) — **vẽ lại khớp hình nguồn, đáp án trùng nguồn** (q7→c, q8→c, q9→b, q16→c).

PNG (10 câu `cuối kì 20242`): mỗi file là **crop toàn câu (stem + cả 4 phương án a–d)**, khớp đúng câu nguồn và cho thấy đủ 4 phương án:
`ck20242-k1-q01/02/04/09, k2-q03/09, k3-q01/09/11/19` ↔ `ck20242-001,002,004,009,023,029,041,049,051,059`.
Đáp án nhìn thấy trên ảnh trùng marker nguồn: 001=a, 002=c, 004=b, 009=a, 023=c, 029=a, 041=a+b, 049=b, 051=a, 059=a+d. **10/10 ok**.

## Nguồn trích dẫn (UML 2.5 / Sommerville / GoF / IFML)

- Đã đối chiếu mục lục **UML 2.5.1 (formal/2017-12-05)**: §9 Classification (9.2 Classifiers, 9.5 Properties, 9.6 Operations, 9.8 Instances) ✔; §11 Structured Classifiers (11.5 Associations — chứa AggregationKind) ✔; §17 Interactions (17.4 Messages ✔, **17.9 Communication Diagrams** ✔); §18 UseCases (18.1 Use Cases, 18.2 Actor/Extend/Include) ✔.
- **Một sai mục**: `ck20242-023` ghi "mục 17.3 (Communication Diagrams)" nhưng §17.3 là *Lifelines*; sơ đồ giao tiếp là **§17.9** → MINOR.
- Sommerville *Software Engineering* (10th ed.) ch.2/4/5/6/7 khớp chủ đề từng câu ✔; GoF (Decorator/Builder/Adapter/Singleton/Proxy) ✔; IFML (OMG) ✔.
- **Trang PDF nguồn**: 79/80 đúng; `rev1-q002` ghi "trang 1" nhưng Question 2 ở **trang 2** → MINOR.

## Phán quyết về loại nguồn `cuối kì 20222` (highlight)

Nguồn `Phân tích thiết kế hệ thống - cuối kì 20222.pdf` là bài thi MOOC daotao.ai; không có khoá đáp án chữ, chỉ có annotation tô sáng (`Highlight` ~43, `Ink` ~23, `FreeText` 1). Tác giả đo đồng thuận **19/24 = 0.79** và loại nguồn.

Kiểm lại độc lập trên **mẫu 8 mục tô sáng** (đọc tô sáng ↔ ô lựa chọn phủ, đối chiếu kiến thức UML/SA&D):

| # | câu | lựa chọn được tô sáng | phán quyết |
|---|---|---|---|
| 1 | #b24174 (tr.12) | "…là một chuỗi hoạt động nghiệp vụ có thứ tự…" | agree |
| 2 | #5d038a (tr.12) | "Sơ đồ hoạt động (Activity Diagram)" (hỏi: hành vi nhiều đối tượng trong 1 ca SD) | **disagree** (đúng ra là sơ đồ tương tác/cộng tác) |
| 3 | #f14e28 (tr.13) | tô sáng **cả** "Thiết kế như Hình 2." **và** "Thiết kế như Hình 3." | **mâu thuẫn / không xác định** |
| 4 | #9508b4 (tr.14) | "…phải được thực hiện bằng các ngôn ngữ lập trình hướng đối tượng." | agree |
| 5 | #c7b102 (tr.15) | "Trình tự, Cộng tác, Trạng thái, Hoạt động" | agree |
| 6 | #2e0459 (tr.15) | "Thăm dò, thu thập ý kiến người dùng…" | agree |
| 7 | #11e60b (tr.16) | "…cùng một khối chức năng" + "…cùng một xu thế phát triển" | agree |
| 8 | #467fc8 (tr.18) | "Biểu diễn việc bố trí các thành phần… lên các nút tính toán…" | agree |

→ 6 agree / 1 disagree / 1 không xác định trên 8 mẫu ⇒ ~0.75–0.86, **nhất quán với 0.79 của tác giả**. Bằng chứng bổ sung: **mâu thuẫn nội tại** (tô sáng cả Hình 2 lẫn Hình 3 cùng câu) + các rect 3–4 pt rời rạc ⇒ đây là đáp án của **một người tự làm**, không phải khoá chuẩn.
**Đồng ý với tác giả: loại nguồn `cuối kì 20222` là đúng.**

## Phát hiện

Chi tiết máy đọc: `notes/review-pttkht-issues.jsonl` (19 dòng).
Nhóm chính:

1. **Thiếu hình của đề (stem dẫn hình nhưng pack không gắn media)** — 12 câu, MAJOR:
   `rev1-q005`; `ck20242-011, -018, -028, -035, -038, -043, -046, -047, -050, -055, -058`.
   Đây là hạn chế hệ thống: tác giả chỉ trích hình cho các câu **phương án là ảnh**, chưa trích các hình nằm trong **stem** (nhiều câu dùng "Vị trí X/Y" nên không trả lời được nếu thiếu hình).
   2 câu phụ (MAJOR nhưng stem tự mô tả phần nào): `ck20242-024`, `ck20242-042` xếp **MINOR**.
2. **Media không liên quan (`ck20242-022`, MAJOR)**: explanation gắn svg "kí hiệu thành phần/triển khai" + ascii DFD Đặt hàng cho câu hỏi về "tên gọi khác của quan hệ Kế thừa".
3. **MINOR**: trích dẫn sai trang (`rev1-q002`), sai mục UML (`ck20242-023`), minh họa lạc đề trong explanation (`ck20242-026`, `ck20242-045`), thiếu hình phụ (`ck20242-024`, `ck20242-042`).

## Bảng phán quyết từng câu (80)

| id | verdict | evidence (file · trang · marker) | issue |
|---|---|---|---|
| `rev1-q001` | ok | `tổng ôn 1` p.1 · The correct answers are: Kiểu dữ liệu, Giới hạn truy cập (tick ô 3,4) |  |
| `rev1-q002` | MINOR | `tổng ôn 1` p.2 · The correct answer is: Tính chất tuần tự... (tick c) | Nguồn ghi "trang 1", đúng là trang 2. |
| `rev1-q003` | ok | `tổng ôn 1` p.2 · The correct answer is: Tên thuộc tính... (tick b) |  |
| `rev1-q004` | ok | `tổng ôn 1` p.3 · The correct answer is: Phân tích (tick d) |  |
| `rev1-q005` | MAJOR | `tổng ôn 1` p.4 · The correct answer is: Ở 1 thời điểm chỉ có 1 khung nhìn... (tick b) | Câu hỏi dẫn hình vẽ nhưng pack không có media. |
| `rev1-q006` | ok | `tổng ôn 1` p.5 · The correct answer is: Trước khi thực hiện phương thức (tick a) |  |
| `rev1-q007` | ok | `tổng ôn 1` p.6 · The correct answer is: ∅ + tick ô c |  |
| `rev1-q008` | ok | `tổng ôn 1` p.7 · The correct answer is: ∅ + tick ô c |  |
| `rev1-q009` | ok | `tổng ôn 1` p.8 · The correct answer is: ∅ + tick ô b |  |
| `rev1-q010` | ok | `tổng ôn 1` p.9 · The correct answer is: Biên soạn quy chuẩn giao diện (tick c) |  |
| `rev1-q011` | ok | `tổng ôn 1` p.9 · The correct answer is: Khái quát hóa (tick a) |  |
| `rev1-q012` | ok | `tổng ôn 1` p.10 · The correct answers are: thông điệp tác nhân→hệ thống, hệ thống tự gửi (tick ô 1,4) |  |
| `rev1-q013` | ok | `tổng ôn 1` p.11 · The correct answer is: Phân tích (tick a) |  |
| `rev1-q014` | ok | `tổng ôn 1` p.12 · The correct answer is: Yêu cầu chức năng (tick b) |  |
| `rev1-q015` | ok | `tổng ôn 1` p.13 · The correct answers are: Phong cách thiết yếu, Biểu diễn hộp đen (tick ô 1,4) |  |
| `rev1-q016` | ok | `tổng ôn 1` p.14 · The correct answer is: ∅ + tick ô c |  |
| `rev1-q017` | ok | `tổng ôn 1` p.15 · The correct answer is: Thực tế, Chi tiết (tick d) |  |
| `rev1-q018` | ok | `tổng ôn 1` p.15 · The correct answer is: Giả lập kế thừa (tick d) |  |
| `rev1-q019` | ok | `tổng ôn 1` p.16 · The correct answer is: Chuyển giao (tick c) |  |
| `rev1-q020` | ok | `tổng ôn 1` p.17 · The correct answers are: Lựa chọn mô hình dữ liệu, Ánh xạ lớp lĩnh vực... (tick ô 1,2) |  |
| `ck20242-001` | ok | `cuối kì 20242` p.1 · The correct answer is: a |  |
| `ck20242-002` | ok | `cuối kì 20242` p.2 · The correct answer is: c |  |
| `ck20242-003` | ok | `cuối kì 20242` p.2 · The correct answer is: d |  |
| `ck20242-004` | ok | `cuối kì 20242` p.3 · The correct answer is: b |  |
| `ck20242-005` | ok | `cuối kì 20242` p.4 · The correct answers are: a+d |  |
| `ck20242-006` | ok | `cuối kì 20242` p.4 · The correct answer is: b |  |
| `ck20242-007` | ok | `cuối kì 20242` p.5 · The correct answer is: d |  |
| `ck20242-008` | ok | `cuối kì 20242` p.5 · The correct answers are: a+b |  |
| `ck20242-009` | ok | `cuối kì 20242` p.6 · The correct answer is: a |  |
| `ck20242-010` | ok | `cuối kì 20242` p.7 · The correct answers are: b+c |  |
| `ck20242-011` | MAJOR | `cuối kì 20242` p.7 · The correct answer is: a | Thiếu hình khung SSD (Vị trí X) — không có media. |
| `ck20242-012` | ok | `cuối kì 20242` p.8 · The correct answers are: a+d |  |
| `ck20242-013` | ok | `cuối kì 20242` p.8 · The correct answers are: a+b |  |
| `ck20242-014` | ok | `cuối kì 20242` p.9 · The correct answer is: a |  |
| `ck20242-015` | ok | `cuối kì 20242` p.9 · The correct answers are: a+d |  |
| `ck20242-016` | ok | `cuối kì 20242` p.10 · The correct answers are: b+d |  |
| `ck20242-017` | ok | `cuối kì 20242` p.10 · The correct answers are: c+d |  |
| `ck20242-018` | MAJOR | `cuối kì 20242` p.11 · The correct answers are: a+d | Thiếu hình sơ đồ tuần tự (quan hệ phụ thuộc). |
| `ck20242-019` | ok | `cuối kì 20242` p.11 · The correct answer is: a |  |
| `ck20242-020` | ok | `cuối kì 20242` p.12 · The correct answers are: b+c |  |
| `ck20242-021` | ok | `cuối kì 20242` p.19 · The correct answers are: b+c |  |
| `ck20242-022` | MAJOR | `cuối kì 20242` p.19 · The correct answer is: d | Explanation gắn component svg + DFD ascii không liên quan. |
| `ck20242-023` | MINOR | `cuối kì 20242` p.20 · The correct answer is: c | Trích dẫn UML sai mục (17.3 → 17.9). |
| `ck20242-024` | MINOR | `cuối kì 20242` p.21 · The correct answer is: a | Thiếu hình nguồn (ký tự X); chỉ có explanation svg. |
| `ck20242-025` | ok | `cuối kì 20242` p.21 · The correct answers are: a+c |  |
| `ck20242-026` | MINOR | `cuối kì 20242` p.22 · The correct answers are: b+d | Explanation svg client-server lạc đề. |
| `ck20242-027` | ok | `cuối kì 20242` p.22 · The correct answer is: a |  |
| `ck20242-028` | MAJOR | `cuối kì 20242` p.23 · The correct answer is: a | Thiếu hình lớp Mặt Hàng. |
| `ck20242-029` | ok | `cuối kì 20242` p.24 · The correct answer is: a |  |
| `ck20242-030` | ok | `cuối kì 20242` p.25 · The correct answer is: a |  |
| `ck20242-031` | ok | `cuối kì 20242` p.25 · The correct answers are: b+d |  |
| `ck20242-032` | ok | `cuối kì 20242` p.26 · The correct answers are: b+c |  |
| `ck20242-033` | ok | `cuối kì 20242` p.26 · The correct answers are: b+c |  |
| `ck20242-034` | ok | `cuối kì 20242` p.27 · The correct answers are: a+b |  |
| `ck20242-035` | MAJOR | `cuối kì 20242` p.27 · The correct answer is: c | Thiếu hình cây kế thừa làm phẳng (đếm thuộc tính). |
| `ck20242-036` | ok | `cuối kì 20242` p.28 · The correct answer is: b |  |
| `ck20242-037` | ok | `cuối kì 20242` p.28 · The correct answers are: a+b |  |
| `ck20242-038` | MAJOR | `cuối kì 20242` p.29 · The correct answer is: a | Thiếu hình lớp Circle. |
| `ck20242-039` | ok | `cuối kì 20242` p.29 · The correct answer is: a |  |
| `ck20242-040` | ok | `cuối kì 20242` p.30 · The correct answer is: a |  |
| `ck20242-041` | ok | `cuối kì 20242` p.37 · The correct answers are: a+b |  |
| `ck20242-042` | MINOR | `cuối kì 20242` p.38 · The correct answer is: d | Thiếu hình A—x—B (stem tự mô tả). |
| `ck20242-043` | MAJOR | `cuối kì 20242` p.38 · The correct answer is: a | Thiếu hình sơ đồ giao tiếp; explanation svg khác nội dung. |
| `ck20242-044` | ok | `cuối kì 20242` p.39 · The correct answer is: d |  |
| `ck20242-045` | MINOR | `cuối kì 20242` p.39 · The correct answers are: c+d | Explanation svg sequence lạc đề. |
| `ck20242-046` | MAJOR | `cuối kì 20242` p.40 · The correct answers are: a+d | Thiếu hình ca sử dụng [X]/[Y]. |
| `ck20242-047` | MAJOR | `cuối kì 20242` p.40 · The correct answers are: a+c | Thiếu hình ca sử dụng ô [Y]. |
| `ck20242-048` | ok | `cuối kì 20242` p.41 · The correct answers are: b+c |  |
| `ck20242-049` | ok | `cuối kì 20242` p.41 · The correct answer is: b |  |
| `ck20242-050` | MAJOR | `cuối kì 20242` p.42 · The correct answers are: b+d | Thiếu hình SSD ô [X]/[Y]. |
| `ck20242-051` | ok | `cuối kì 20242` p.43 · The correct answer is: a |  |
| `ck20242-052` | ok | `cuối kì 20242` p.43 · The correct answer is: d |  |
| `ck20242-053` | ok | `cuối kì 20242` p.44 · The correct answer is: a |  |
| `ck20242-054` | ok | `cuối kì 20242` p.44 · The correct answer is: c |  |
| `ck20242-055` | MAJOR | `cuối kì 20242` p.45 · The correct answers are: a+d | Thiếu hình lớp (ô bội số X/Y). |
| `ck20242-056` | ok | `cuối kì 20242` p.45 · The correct answer is: d |  |
| `ck20242-057` | ok | `cuối kì 20242` p.46 · The correct answers are: a+b |  |
| `ck20242-058` | MAJOR | `cuối kì 20242` p.46 · The correct answer is: c | Thiếu hình cấu trúc lớp Bài Kiểm tra. |
| `ck20242-059` | ok | `cuối kì 20242` p.47 · The correct answers are: a+d |  |
| `ck20242-060` | ok | `cuối kì 20242` p.47 · The correct answers are: c+d |  |

## Ghi chú
- Không sửa file JSON của bộ đề; bên tích hợp sẽ áp dụng bản vá.
- Ảnh render và dữ liệu thô dùng để dựng lại marker: `scratch/probe/` (`rev1_lines.txt`, `ck_lines.txt`, `ck_src.json`, `png/`, `svg/`).

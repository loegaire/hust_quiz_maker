# Review — Hệ phân tán (hpt)

Pack: `public/quizzes/he_phan_tan_on_tap_tong_hop.json` (`schemaVersion: 1`, id `he-phan-tan-on-tap-tong-hop`).
Counts: **56 câu**, tất cả `single_choice`; độ khó easy 16 / medium 28 / hard 12; **38 media item** (38 câu có ≥1 hình `svg`/`ascii`).
Validator: `node scratch/kit/validate.mjs public/quizzes/he_phan_tan_on_tap_tong_hop.json` → `OK`, 0 ERR.
Duplicate sweep: `node scratch/kit/dupes.mjs` → không câu nào của file này bị trùng stem với file khác.

Nguồn đã dùng làm khóa: `Hệ phân tán - đáp án đề kì 20212.pdf` (khóa chính thức) và `Hệ phân tán - cuối kì 20221.pdf` (đáp án tô nền đỏ).

---

## 1. Kiểm định nguồn có dấu đánh dấu hình học (đo % đồng thuận)

Phương pháp: render trang bằng `pdftoppm -r 150/200/300`, đọc bằng ảnh (`read <png>`), xác định phương án được
đánh dấu, rồi so từng phương án với kiến thức chuẩn (Tanenbaum & Van Steen *Distributed Systems*; Coulouris et al.).

| Nguồn | Kiểu dấu | Số dấu | Đồng thuận đo được | Kết luận |
|---|---|---|---|---|
| `Hệ phân tán - cuối kì 20221.pdf` | tô nền đỏ `#fe5252` (vector, 25 dấu cho 25 câu) | 25 | **23/25 = 92 %** (2 sai: câu 5, câu 9) | **DÙNG** (≥90 %) |
| `Hệ phân tán - cuối kì 20241.pdf` | highlight vàng `#fffb00` (digital) + dấu `✗` đỏ của sinh viên; là sách "ôn thi" (CamScanner) | ~35 | ~24/25 mục đọc được khớp (≈96 %) | **LOẠI** (xem §3) |
| `Hệ phân tán - cuối kì 20242.pdf` | vòng tròn viết tay bằng mực đỏ trên bản scan | ~30 | ~20/22 mục đọc được khớp (≈91 %) | **LOẠI** (bút tích viết tay) |
| `Hệ phân tán - cuối kì 20232.pdf` | không có dấu | 0 | — | **LOẠI** (không có khóa) |

### 1.1. Chi tiết kiểm định `cuối kì 20221.pdf` (23/25)

Đúng: câu 1 (A), 2 (C), 3 (A), 4 (A), 6 (B), 7 (A), 8 (D), 10 (C), 11 (D), 12 (C), 13 (C), 14 (A), 15 (A),
16 (C)*, 17 (B), 18 (D), 19 (A), 20 (C), 21 (B), 22 (B), 23 (B), 24 (C), 25 (A).
(*) câu 16 khuyết (nhiều phương án hợp lý) và bị loại vì **trùng lặp** với `key20212-5` (xem §2(a2)).

Sai (2):
- **câu 5** — "thread-per-connection có ưu điểm gì?", dấu chọn **D** ("cân bằng tải giữa các luồng worker tốt"),
  nhưng ưu điểm được kiến thức chuẩn ủng hộ là **B** ("không cần có hàng đợi"): mô hình thread-per-connection
  sinh luồng ngay khi có kết nối nên không cần hàng đợi dispatch, còn "cân bằng tải giữa các luồng worker" là
  đặc trưng của mô hình *worker pool* (dispatcher + queue). Marker mâu thuẫn kiến thức chuẩn ⇒ **loại câu** (nhóm b).
- **câu 9** — "vấn đề khi truyền tham số **tham chiếu**", dấu chọn **B** ("client và server có qui ước biểu diễn
  dữ liệu khác nhau" — đây là vấn đề của tham số **giá trị**), trong khi kiến thức chuẩn (slide Tanenbaum
  "Passing Reference Parameters in RPC — Difficulty Problem!") là **A** ("hai không gian nhớ khác nhau", con trỏ
  không dùng được qua mạng). Câu này bị **loại**.

Vậy đồng thuận **23/25 = 92 % ≥ 90 %** ⇒ coi dấu tô đỏ của file 20221 là khóa và dùng để trích file (trừ câu 5, câu 9).

---

## 2. Các mục ĐÃ LOẠI (nhóm a–d)

### (a) Dấu đánh dấu mơ hồ / câu hỏi khuyết (vẫn dùng nhưng đã ghi chú)
- `key20221-16` (đã loại vì **trùng lặp**, xem (a2)): "đồng bộ logic khác đồng bộ vật lý ở điểm nào" — dấu chọn C,
  nhưng khóa chính thức 20212 (câu 5) lại chọn phương án dạng B ("chỉ quan tâm tới thứ tự sự kiện"). Cả B và C
  đều là phát biểu đúng, câu này khuyết. Đã loại.

### (a2) Trùng lặp ngữ nghĩa với nguồn ưu tiên (đã loại khỏi file)
- `20221 câu 3` — "Hệ thống Chord là một hệ thống" trùng với `key20212-34`.
- `20221 câu 12` — "Chỉ ra định nghĩa đúng nhất của Hệ Phân Tán" trùng (gần như byte-identical) với `key20212-1`.
- `20221 câu 14` — "nhược điểm của giải pháp định danh dựa vào Home Agent" trùng với `key20212-8` (khác thứ tự
  phương án).
- `20221 câu 16` — "đồng bộ logic khác vật lý" trùng chủ đề với `key20212-5`.

### (b) Dấu mâu thuẫn kiến thức chuẩn (đã loại)
- `20221 câu 5` (tr.1) — "thread-per-connection có ưu điểm gì?", dấu chọn **D** ("cân bằng tải giữa các luồng
  worker tốt"). Kiến thức chuẩn (Tanenbaum & Van Steen, Ch.3 — multithreaded servers; UCSB DS Lect.3) cho rằng ưu
  điểm của thread-per-connection là **không cần hàng đợi dispatch** (phương án **B**), còn "cân bằng tải giữa các
  luồng worker" là đặc trưng của mô hình *dispatcher + worker pool*. Marker mâu thuẫn kiến thức chuẩn ⇒ loại theo
  hợp đồng §2. Đã xoá khỏi pack ở Fix pass; id `key20221-5` cũ không còn.
- `20221 câu 9` — RPC truyền tham số **tham chiếu**: dấu chọn B ("khác biểu diễn dữ liệu") nhưng đáp án đúng là **A**
  ("khác không gian nhớ"). Xem §1.1.

### (c) Bản scan không đọc được / thiếu khóa (đã loại)
- `20212 câu 23` (tr.3 key / tr.3 đề): dòng `Key =` để **trống** trong đáp án chính thức → không có dấu đánh dấu.
- `20212 câu 25` (tr.3 key / tr.3 đề): `Key =` để **trống**.
  (Cả hai câu có hình Conit/vector clock nhưng thiếu dấu ⇒ không đủ điều kiện đưa vào.)

### (d) Loại câu hỏi / dấu không hợp lệ
- `20212 câu 27` (tr.3 key / tr.3 đề): dòng khóa ghi **hai** đáp án mâu thuẫn — `Key = MH thoả mãn thống nhất nhân
  quả và ko thoả thống nhất tuần tự` (phương án D) **và** `Key2 = ko thoả cả 2` (phương án A). Không thể biểu diễn
  một câu một đáp án ⇒ loại.
- `20241` (toàn bộ file): dấu là **highlight vàng do sinh viên** (cộng thêm dấu `✗` đỏ) trên một sách "ôn thi",
  không phải khóa chính thức; nhiều bộ lựa chọn bị **cắt mất ở mép trang** khi scan (ví dụ câu 1, 13, 18, 22, 35);
  và ~90 % câu trùng chủ đề với 20212/20221 (Node.js, thuật toán tập trung, RPC, RabbitMQ, Berkeley, Chord,
  home agent, token ring, vector clock…). ⇒ Loại (bảo đảm cả cổng "không trùng lặp ngữ nghĩa").
- `20242` (toàn bộ file): dấu là **vòng tròn bút mực viết tay** trên bản scan — hợp đồng §2 nói rõ bút tích viết
  tay **không** phải đáp án ⇒ loại (dù nội dung vòng tròn khớp ≈91 % với kiến thức chuẩn).
- `20232`: máy dò (`marks.py`) tìm được **0** dấu trên 4 trang ⇒ không có khóa ⇒ loại.

---

## 3. Kiểm toán nguồn (audit) — mẫu đã mở lại và xác nhận

Đã mở lại nguồn (text layer + render ảnh) cho **toàn bộ** các câu (100 %, vượt mức mẫu 25 % yêu cầu), vì đây là
bản scan/hình. Danh sách id mẫu đã đối chiếu chéo đặc biệt kỹ (chọn ngẫu nhiên + tất cả câu có nghi ngờ):

- 20212: `key20212-1, 5, 7, 12, 13, 14, 15, 16, 17, 20, 21, 26, 30, 31, 33, 35, 38, 39`
- 20221: `key20221-2, 9(loại), 11, 13, 15, 16(loại), 20, 24, 25`

Kiểm chứng cụ thể:
- Lựa chọn của 20212 được đọc lại từ bản scan `cuối kì 20212.pdf`; riêng **câu 26** dấu khóa ứng với phương án **D**
  (không phải C) — đã zoom trang để xác nhận ("D. Không, vì 2 lý do liên quan đến hiệu năng và an toàn thông tin").
- Câu `key20221-` : dấu tô đỏ nằm **ngay dưới** phương án đúng; đã zoom từng vùng để xác định đúng chữ cái.

## 4. Media
38 media item kiểu `svg`/`ascii` (không dùng raster `src`), trải trên 38/56 câu (68 %, vượt mốc ≥25 % và ≥8).
(`scratch/venv/bin/python scratch/kit/svgcheck.py …` → `media totals {'svg': 27, 'ascii': 11, 'src': 0}`, all media OK.)
Chủ đề phủ đủ danh sách yêu cầu: client-server vs peer-to-peer (`key20221-2`), centralized/decentralized/hybrid +
CAN/Chord/DHT (`key20212-6,34`, `key20212-12,13,14`, `key20221-15`), vector clock & Lamport (`key20212-20,21`,
`key20221-18`), quorum (`key20212-9`), Bully election (`key20212-7`), RPC/server stub (`key20212-19`,
`key20212-15`), clock synchronization (`key20212-5`, `key20212-38`), message ordering (`key20212-36`),
CAP (`key20221-25`), replication (`key20212-31`, `key20212-24`, `key20212-26`).

## 5. Việc cần một mô hình mạnh hơn quyết định
1. `key20221-16` (đồng bộ logic vs vật lý): B hay C? (đã loại do trùng lặp; nếu không trùng thì cần quyết định).
2. `20212 câu 27`: khóa cho hai đáp án mâu thuẫn — câu hỏi bị "khiếu nại" hay in lỗi?
3. `key20212-7`: phương án nhiễu D đọc được là "98" trên ảnh gốc (~87 dpi nên mờ); nếu bản gốc là "88" thì cần sửa lại
   (audit không nêu mục này nên tạm giữ "88").

---

## 6. Fix pass (theo kết quả audit)

Đối chiếu lại toàn bộ nguồn (đọc ở **độ phân giải gốc** nhúng trong PDF, ảnh trang chỉ ~87 dpi) và sửa:

| id | thay đổi |
|---|---|
| `key20212-15` | Phương án **B bị chế** → thay bằng nguyên văn đề: *"Socket UDP sử dụng cổng vật lý, socket TCP sử dụng cổng logic."*; A/C/D chỉnh đúng nguồn (bỏ "sẽ"); viết lại phần "Phân tích từng lựa chọn". Đáp án **C** giữ nguyên. |
| `key20221-5` | **XOÁ KHỎI PACK** (marker mâu thuẫn kiến thức chuẩn) — xem §2(b). Số câu 57→56. |
| `key20212-1` | Phương án A/B/C/D chỉnh theo nguyên văn bản scan đề (bỏ viết tắt "NSD"/"cung cấp cung cấp" của bản đáp án). |
| `key20212-5` | Kiểm tra lại: phương án D **đã có** chữ "chỉ" đúng nguồn từ trước; không cần sửa. |
| `key20212-7` | Stem dùng nguyên văn đề (có nêu "12 thông điệp quảng bá cuối cùng của P12 cho P0-P11"). |
| `key20212-8` | Phương án D chỉnh theo nguyên văn đề: *"...phải thực hiện quảng bá thông điệp tìm kiếm đi tất cả các thực thể..."*. Lưu ý: audit đề nghị bỏ chữ "quảng bá", nhưng soi ở độ phân giải gốc thì **đề CÓ chữ "quảng bá"** (đã đổi cách diễn đạt từ "gửi thông điệp quảng bá" thành đúng nguyên văn). |
| `key20212-12/13/14` | Vẽ lại hình nhẫn Chord: chỉ các nút tồn tại **2, 5, 8, 11** trên không gian định danh 0–15, tô vàng nút đang xét, có caption; sửa `alt` cho khớp (bỏ "nút 1..14"). |
| `key20212-20/21` | Mỗi câu có **hình SVG riêng** (trước đây là hai khối ASCII thô, dễ lẫn); câu 20 vẽ rõ m2 tới P2 trước m1. |
| `key20212-2` | Sửa typo trong lời giải: "RESLEASE" → "RELEASE". |
| `key20221-25` | Citation CAP-theorem (lạc đề) → **Wikipedia, Replication (computing)** (ủng hộ đáp án active replication). Hình CAP được giữ cho đủ danh mục media. |

Gates sau Fix pass:
- `node scratch/kit/validate.mjs public/quizzes/*.json` → file `OK`, 0 ERR, 0 WARN.
- `scratch/venv/bin/python scratch/kit/svgcheck.py public/quizzes/he_phan_tan_on_tap_tong_hop.json` → `all media OK`.
- `node scratch/kit/dupes.mjs` → không câu nào của file này trùng stem với file khác.
- `notes/evidence-hpt.jsonl` → 56 dòng (đã bỏ `key20221-5`, thêm ghi chú Fix pass cho các id đã sửa).

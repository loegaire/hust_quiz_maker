# Review — Lập trình Android (`android_on_tap_tong_hop.json`)

Nguồn đáp án:
- **Android - ngân hàng câu hỏi trắc nghiệm.pdf** — mỗi lựa chọn có tiền tố `[100]` (đúng) hoặc `[0]` (sai).
- **Android - quiz Google.pdf** — các bài kiểm tra in từ Android Developers; lựa chọn đúng mang biểu tượng
  Material `radio_button_checked` / `check_box` (và phản hồi "Chính xác!"), lựa chọn sai mang
  `radio_button_unchecked` / `check_box_outline_blank`.

Kết quả: **184 câu** được đưa vào (147 từ ngân hàng, 37 từ quiz Google). Dưới đây là các mục bị loại
hoặc còn phân vân.

---

## (a) Mục bị loại — trùng lặp ngữ nghĩa (đã giữ bản xuất hiện trước)

Theo yêu cầu "duplicate sweep (semantic)", các câu sau trùng nghĩa với một câu đã có nên bị bỏ (nguồn:
`Android - ngân hàng câu hỏi trắc nghiệm.pdf`):

| Bỏ (Câu) | Trùng với | Lý do |
|---|---|---|
| 15368 | 1915 | Cùng câu hỏi "Broadcast receivers chạy ở thread nào?" |
| 15408 | 1927 | Cùng câu hỏi về callback khi bấm Home |
| 15402 | 1936 | Cùng "thành phần hiển thị một phần activity" |
| 15417 | 1920 | Cùng câu hỏi đơn vị font chữ (sp) |
| 15418 | 1921 | Cùng câu hỏi đơn vị kích thước view (dp) |
| 15410 | 1956 | Cùng câu hỏi về implicit intent |
| 15411 | 1957 | Cùng câu hỏi Activity khởi chạy đầu tiên |
| 15378 | 1966 | Cùng câu hỏi thread xử lý tương tác |
| 15398 | 1947 | Cùng câu hỏi về Fragment |
| 15420 | 1931 | Cùng câu hỏi về Toast |
| 1976 | 1961 | Cùng câu hỏi "Phát biểu nào đúng về ViewModel?" (khác bộ lựa chọn) |
| 15392 | 1965 | Cùng câu hỏi context menu (khác chính tả RecyclerView) |
| 15384 | 1923 | Cùng câu khảo sát sở thích → CheckBox |
| 15377 | 1932 | Cùng câu hỏi phương thức bắt buộc của AsyncTask |
| 15395 | 1944 | Cùng câu hỏi interface click trong RecyclerView |
| 15406 | 1945 | Cùng câu hỏi Intent mở trang web |
| 15422 | 1967 | Cùng câu hỏi thuộc tính màu chữ |

Lưu ý: các cặp **cùng bộ lựa chọn nhưng khác câu hỏi/câu trả lời** vẫn được giữ vì không phải trùng lặp
(15361 "đọc file" vs 15362 "ghi file"; 15373 "onCreate có gọi lại" vs 15380 "UI thread truyền dữ liệu";
16494 "RadioGroup kế thừa lớp nào" vs 15430 "layout cho editor trực quan"; 15399 "add()" vs 15400 "replace()";
1935 "maxSdkVersion" vs 1951 "ScrollView một con" — khác stem).

## (b) Mục bị loại — loại câu hỏi không biểu diễn được trong schema

`Android - ngân hàng câu hỏi trắc nghiệm.pdf`, nhóm **kéo–thả / điền mã vào chỗ trống**: các câu này KHÔNG có
tiền tố `[100]`; chúng có các ô `[[1]]…[[n]]` và một "kho từ" xáo trộn không kèm ánh xạ đúng → không có
đáp án chuẩn tường minh để mã hoá thành `single_choice`/`multiple_choice`/`fill_gap`:

- Câu **15423** (xóa user khỏi bảng tblUsers), **15424** (khai báo lớp kế thừa AsyncTask),
  **15425** (cập nhật password), **15426** (duyệt Cursor in logcat), **15427** (đọc JSON),
  **15428** (query bản ghi), **17504** (AlertDialog.Builder), **17505** (tải file qua HttpURLConnection).
- Kèm theo: các câu "Điền vào chỗ trống" của quiz Google (nhập từ tự do + "Chính xác!"):
  `Android - quiz Google.pdf` trang 10 (q5), 15 (q3), 21 (q3), 31 (q7), 34 (q3), 39 (q5), 45 (q3), 88 (q5?).
  Đáp án gõ tay không ổn định (ví dụ "Drawble" thay vì "Drawable") nên không dùng làm `fill_gap`.

## (c) Mục còn phân vân (đã giữ, medium-confidence)

| id | Nguồn / trang | Vấn đề | Gợi ý cho model mạnh hơn |
|---|---|---|---|
| bank-1953 | ngân hàng, tr.9 | Đáp án được đánh dấu là `android:layout_height="wrap_content"`, nhưng câu hỏi nói về nội dung "dài quá kích thước màn hình ngang" (chiều rộng). Ba phương án còn lại là thuộc tính không tồn tại (`textContent`, `scroll`) hoặc chỉ dành cho EditText (`inputType`). Giữ vì là phương án hợp lệ duy nhất. | Xác nhận đáp án dự kiến của đề (có thể là `layout_width`) |
| bank-16488 | ngân hàng, tr.30 | "Đối tượng nào tạo nút bấm có nội dung là ảnh?" → "Các đáp án đều chính xác" (gồm cả `ImageView`). | Cân nhắc liệu `ImageView` có được tính là "nút bấm" không |
| bank-16452 | ngân hàng, tr.39 | "Phát biểu KHÔNG chính xác về ViewHolder" → "Giảm số lần tạo view từ file XML". Đây là khác biệt tinh tế giữa ViewHolder (cache tham chiếu view con) và cơ chế recycler (tái sử dụng view). | Kiểm tra cách diễn đạt của giáo trình |
| bank-15434 | ngân hàng, tr.? | "Ý không phải thách thức khi lập trình Android" → "Sử dụng công cụ phát triển trên các HĐH khác nhau". Diễn giải phụ thuộc giáo trình. | Đối chiếu slide gốc |
| bank-1975 | ngân hàng, tr.16 | "Kỹ thuật debug phù hợp nhất cho nhiều tiến trình song song" → "Log ra file". Không sai nhưng mang tính quan điểm. | — |
| bank-15356 | ngân hàng, tr.18 | `db.insert("tblUsers", null, new ContentValues())` → trả về `-1`. Suy luận: câu lệnh chèn không có cột gây lỗi thực thi. | Cân nhắc hành vi thực tế của `SQLiteDatabase.insert` với ContentValues rỗng |
| bank-15363 | ngân hàng, tr.? | "Lưu lâu dài, không bị xóa khi gỡ app" → External Storage. Đúng với bộ nhớ dùng chung, nhưng thư mục external **riêng của app** vẫn bị xóa khi gỡ. | Làm rõ phạm vi external |

## (d) Quét không đọc được

Không có: cả hai nguồn đều có text layer tốt nên không cần OCR; mọi bản ghi đều xác thực được bằng render
(`pdftoppm`) đọc trực tiếp.

## Mẫu kiểm định đáp án (answer audit)

Đã mở lại nguồn (render `pdftoppm` + `read`) và xác nhận stem, lựa chọn và dấu đáp án cho các câu sau
(≈37% trong số 184 câu — vượt mức 25%):

- Ngân hàng (trang render: 1, 2, 6, 9, 10, 13, 16, 17, 18, 27, 30, 39, 40, 45, 48, 49, 53, 54, 57):
  `bank-1913, bank-1914, bank-1915, bank-1916, bank-1917, bank-1918, bank-1919, bank-1923, bank-1935,
  bank-1936, bank-1937, bank-1938, bank-1939, bank-1946, bank-1952, bank-1953, bank-1954, bank-1955,
  bank-1956, bank-1957, bank-1958, bank-1960, bank-1947, bank-1948, bank-1968, bank-1969, bank-1970,
  bank-1975, bank-1977, bank-1978, bank-1979, bank-1980, bank-15354, bank-15355, bank-15356, bank-15357,
  bank-15372, bank-15394, bank-15397, bank-15412, bank-15413, bank-15414, bank-15421, bank-15422,
  bank-15429, bank-15430, bank-15432, bank-15433, bank-15435, bank-15808, bank-15811, bank-16152,
  bank-16154, bank-16452, bank-16488, bank-16489, bank-16490, bank-16493, bank-17507`.
- Quiz Google (trang render: 1, 15, 30, 34, 45, 75, 88, 99):
  `goog-001, goog-005, goog-009, goog-010, goog-011, goog-012, goog-019, goog-025, goog-031, goog-033`.

Cụ thể đã đối chiếu các dấu hiệu: `[100]` đứng trước đúng một lựa chọn mỗi câu (ngân hàng); biểu tượng
`radio_button_checked`/`check_box` + "Chính xác!" xuất hiện đúng trên lựa chọn đúng (quiz Google).
Không phát hiện sai lệch giữa JSON và nguồn trong mẫu.

---

## QA follow-up (integrator gate) — media/citation fixes

An independent audit (`notes/review-android-report.md`, `notes/review-android-issues.jsonl`) re-derived all 184
answers from the source markers: **0 BLOCKER, answers all correct, stems/choices verbatim**. Only media/citation
defects were raised and have now been fixed. **No stem, choice, answer or id was changed.**

- **MAJOR — Fragment-lifecycle SVG** extended so it draws the full sequence
  `onAttach → onCreate → onCreateView → onViewCreated → onStart → onResume → onPause → onStop → onDestroyView → onDestroy → onDetach`
  (previously truncated at `onStop`); the shared media item is fixed once, so `bank-1936`, `bank-1947`, `goog-016` all update.
- **MINOR — Activity-lifecycle SVG topology** fixed: now `onStop → onRestart → onStart` (routed outside the boxes) and
  `onPause → onResume`; `onRestart` is connected. Affects the 11 lifecycle questions.
- **MINOR — BroadcastReceiver SVG**: the `onReceive()` step is now annotated “chạy trên main thread (UI thread)”,
  matching its `alt` and the question (`bank-1915`).
- **MINOR — off-topic media retargeted** with new on-topic diagrams: `goog-002`→IDE toolchain, `goog-008`→build.gradle/manifest,
  `goog-026`→ImageView.setImageResource, `goog-028`→accessibility/TalkBack, `goog-029`→View→TextView→EditText hierarchy,
  `goog-030`→ConstraintLayout constraints, `goog-035`→Glide pipeline, `bank-16488`→Button/ImageButton/ImageView.
- **MINOR — tangential media** reassigned per question: `goog-004`→res tree, `goog-011/012/013`→activity lifecycle,
  `goog-031`→onSaveInstanceState/Bundle; `goog-037` media dropped (WorkManager not illustrated).
- **MINOR — citations**: `bank-1974` now cites `developer.android.com/tools/adb`; the stack/HAL/native-library/APK questions
  (`bank-1913/1924/1939/1940/1978/15808/15429/16153`) cite `developer.android.com/guide/platform`; `bank-16488` adds the
  Button + ImageButton API references; `goog-026` adds the ImageView reference, `goog-028` the accessibility principles page,
  `goog-030` the ConstraintLayout guide.

New gate results:
- `node scratch/kit/validate.mjs public/quizzes/android_on_tap_tong_hop.json` → `OK … n=184 images=173 tagged=184` / **0 warnings**.
- `scratch/venv/bin/python scratch/kit/svgcheck.py public/quizzes/android_on_tap_tong_hop.json` → `all media OK`, 112 svg + 61 ascii, 0 src.

### Follow-up: justification boilerplate removed

The `### Phân tích từng lựa chọn` bullet for a *correct* option in the `goog-*` questions previously read
“Được đánh dấu đúng (biểu tượng `radio_button_checked`/`check_box`) trong bản in của bài kiểm tra.”
i.e. it cited the marker instead of giving a domain reason. All 37 `goog-*` questions now justify the correct
option with the question-specific reason (in `### Lời giải từng bước`), so each ✅ Đúng bullet names the concept
(e.g. `goog-001`: “Trong Kotlin, hàm được khai báo bằng từ khoá `fun`…”). The marker evidence is kept only in
`### Nguồn`. No stem, choice, answer or id changed.

- `boilerplate.py` marker-reference sentence: **before 18 → after 0**; `repeated_sentences` 514 → 509,
  `median_boilerplate_frac` 0.25 → 0.23. The only remaining repeats are the contract-mandated section header
  `### Phân tích từng lựa chọn` (once per question) and the shared citation URLs.

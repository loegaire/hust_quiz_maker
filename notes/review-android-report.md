# Independent audit — `android_on_tap_tong_hop.json`

Auditor: independent re-derivation from the source PDFs (method A of `notes/reviewer-contract.md`).
The author's `notes/evidence-android.jsonl` and `notes/review-android.md` were treated as claims only —
not evidence. All markers below were re-derived from the raw source.

## Summary (counts)

| severity | count |
|---|---|
| ok | **160** |
| BLOCKER | **0** |
| MAJOR | **3** (one media defect — the truncated Fragment‑lifecycle SVG — hitting 3 questions) |
| MINOR | **21** (11 activity‑lifecycle‑media + 1 BroadcastReceiver‑media + 8 media‑theme + 1 citation; per‑question) |

Total questions: **184** (147 `bank-*` + 37 `goog-*`). The `notes/review-android-issues.jsonl` file has **16 objects**
(3 MAJOR + 13 MINOR); three of them are grouped (apply to several questions / a URL) and are therefore not all
one‑to‑one with the 21 MINOR table rows.

## Coverage statement

- **Marker re-derivation: 184/184 (100 %).**
  - `bank-*` (147): re‑parsed `Android - ngân hàng câu hỏi trắc nghiệm.pdf` from scratch (option prefix `[100]`/`[0]`),
    independently of the author's parse (`scratch/gt/android_bank.json` used only as a cross‑check; my re‑parse agreed
    with it on 170/172 rows, the 2 differences being code‑block stem artifacts, not option/marker differences).
    In the pack, **every one of the 147 questions has its marked choice on exactly the option the PDF prefixes `[100]`**;
    each of those source questions has exactly one `[100]`.
  - `goog-*` (37): re‑parsed `Android - quiz Google.pdf`, reading the `radio_button_checked`/`check_box` glyph (single‑ vs
    multi‑select) and the `Chính xác!` note. **All 37 marked answers sit on the glyph‑checked option(s).**
- **Verbatim stem + choice comparison: 184/184 (programmatic, from the PDF text layer).**
  0 paraphrase, 0 dropped/added option, 0 reordering. One stem difference: `bank-1950` appends the inline Java code as a
  fenced code block; the same code is rendered as a figure in the PDF (page 14) and matches verbatim.
- **Full line‑by‑line visual comparison: 60/184 = 32.6 %** (≥ 25 % required), spread over 40 bank pages + 13 goog pages,
  including **all 7 questions the author flagged medium‑confidence** (`bank-1953, bank-16488, bank-16452, bank-15434,
  bank-1975, bank-15356, bank-15363`). Rendered with `pdftoppm -r 150` and inspected with the `read` tool.
- **Media: 176/176 items checked programmatically** (schema/self‑containment via `svgcheck.py`) plus a visual pass over
  all **45 unique** media payloads (30 SVGs rendered and inspected, 15 ASCII read). All have `alt`; 0 external `href`,
  0 scripts, `xmlns` present.
- **Citations: 184/184 `### Nguồn` sections present; all 44 unique URLs opened** (`read`/`web_search`): 44/44 HTTP‑200,
  all topically valid; 2 loose targets flagged below. All cited PDF page numbers verified against the actual pages
  (bank: 147/147 exact; goog: 37/37 exact).

## Validators (restated)

- `node scratch/kit/validate.mjs public/quizzes/android_on_tap_tong_hop.json`
  → `OK ... n=184 types={"single_choice":177,"multiple_choice":7} images=176 tagged=184 source=merged` / `all files valid, 0 warnings` (exit 0).
- `python3 scratch/kit/svgcheck.py public/quizzes/android_on_tap_tong_hop.json`
  → `media totals {'svg': 115, 'ascii': 61, 'src': 0}, referenced src files 0` / `all media OK` (exit 0).

## Key audit results

- **No BLOCKER**: every marked answer matches the authoritative source marker; no fabricated citation (all URLs live);
  no duplicate question id (validate.mjs); no unrenderable media (svgcheck.py); schema valid.
- all 7 `multiple_choice` items (`goog-006/008/010/013/017/033/034`) were confirmed against the multi‑select glyphs
  (`check_box`) and match the source's checked set exactly.
- 8 source bank questions were legitimately excluded by the author (no `[100]`: code‑whole‑block gaps
  `15423‑15428, 17504, 17505`), plus duplicates — not audited, not an issue.
- 8 goog questions have no media (allowed; media is optional).

## Findings (see `notes/review-android-issues.jsonl`)

MAJOR
- **Fragment‑lifecycle SVG truncated** (media `f63a867c`), attached to `bank-1936`, `bank-1947`, `goog-016`:
  rendered diagram stops at `onStop()` (dangling arrow) and omits `onDestroyView()/onDestroy()/onDetach()`, although the
  `alt` claims coverage “onAttach đến onDetach”. Fix: complete the diagram or correct the alt.

MINOR
- **Activity‑lifecycle SVG topology** (media `25c420a3`, attached to 11 lifecycle questions incl. `bank-1918/1927/1941/1942/1959/15407/15413/17506`, `goog-005/013/025`): `onRestart()` box is orphaned and the restart path is
  drawn `onStop→onStart` (skipping `onRestart`).
- **BroadcastReceiver SVG** (`31797bd2`, `bank-1915`): alt asserts “trên main thread” but the diagram never shows a thread.
- **Media theme mismatch** (off‑topic illustration): `goog-002, goog-008, goog-026, goog-028, goog-029, goog-030, goog-035, bank-16488`.
- **Tangential media**: `goog-004, goog-005, goog-011, goog-012, goog-031, goog-037`.
- **Citation targets**: `bank-1974` (adb port 5555 supported by neither cited page); the “Kiến trúc nền tảng Android”
  label points to `guide/components/fundamentals` for stack/HAL/native‑lib/APK questions (`bank-1913,1924,1939,1940,1978,15808,15429,16153,15431,15409`); `bank-16488` cites only the TextView reference.

## Per-question verdicts (184)

| id | verdict | evidence (source file + page + marker) | issue |
|---|---|---|---|
| bank-1913 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.1: [100] → “Android Package” | — |
| bank-1914 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.1: [100] → “Ngắt các lệnh đang thực thi (Breaks the exec” | — |
| bank-1915 | MINOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.1: [100] → “Main Thread” | media BroadcastReceiver (31797bd2): hình không thể hiện main thread dù alt khẳng định |
| bank-1916 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.1: [100] → “SQLite” | — |
| bank-1917 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.1: [100] → “Lưu trữ trong đối tượng shared data” | — |
| bank-1918 | MINOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.2: [100] → “onCreate(), onStart(), onResume(), onPause()” | media activity-lifecycle (25c420a3): onRestart() rời rạc; đường khởi động lại vẽ onStop→onStart bỏ qua onRestart |
| bank-1919 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.2: [100] → “True” | — |
| bank-1923 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.2: [100] → “CheckBox” | — |
| bank-1924 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.3: [100] → “Linux” | — |
| bank-1925 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.3: [100] → “Điều hướng từ màn hình cha sang màn hình con” | — |
| bank-1926 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.3: [100] → “Người dùng xoay màn hình hoặc đổi ngôn ngữ” | — |
| bank-15282 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.3: [100] → “AndroidManifest” | — |
| bank-1927 | MINOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.4: [100] → “onPause” | media activity-lifecycle (25c420a3): onRestart() rời rạc; đường khởi động lại vẽ onStop→onStart bỏ qua onRestart |
| bank-1928 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.4: [100] → “RESULT_OK hoặc RESULT_CANCEL” | — |
| bank-1929 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.4: [100] → “Linear layout” | — |
| bank-1930 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.4: [100] → “Sử dụng mô hình DAO, cung cấp cơ chế cho phé” | — |
| bank-1931 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.5: [100] → “Toast class” | — |
| bank-1932 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.5: [100] → “doInBackground()” | — |
| bank-1933 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.5: [100] → “View” | — |
| bank-1934 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.5: [100] → “android.view.ViewGroup” | — |
| bank-1935 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.6: [100] → “Đúng” | — |
| bank-1936 | MAJOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.6: [100] → “Fragment” | media Fragment-lifecycle (f63a867c) bị CỤT: dừng ở onStop, thiếu onDestroyView/onDestroy/onDetach (alt ghi “onAttach đến onDetach”) |
| bank-1937 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.6: [100] → “TableLayout” | — |
| bank-1938 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.6: [100] → “Permission that the application requires” | — |
| bank-1939 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.6: [100] → “Webkit” | — |
| bank-1922 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.7: [100] → “Trong file AndroidManifest.xml” | — |
| bank-1940 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.7: [100] → “Applications” | — |
| bank-1941 | MINOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.7: [100] → “onCreate, onStart, onResume” | media activity-lifecycle (25c420a3): onRestart() rời rạc; đường khởi động lại vẽ onStop→onStart bỏ qua onRestart |
| bank-1942 | MINOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.7: [100] → “Paused state” | media activity-lifecycle (25c420a3): onRestart() rời rạc; đường khởi động lại vẽ onStop→onStart bỏ qua onRestart |
| bank-1943 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.7: [100] → “Swiping Fragments” | — |
| bank-1920 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.8: [100] → “sp” | — |
| bank-1921 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.8: [100] → “dp” | — |
| bank-1944 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.8: [100] → “View.onClickListener” | — |
| bank-1945 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.8: [100] → “Intent.ACTION_VIEW” | — |
| bank-1946 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.9: [100] → “Thư mục config” | — |
| bank-1952 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.9: [100] → “strings.xml” | — |
| bank-1953 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.9: [100] → “Thiết lập thuộc tính android:layout_height="” | — |
| bank-1954 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.9: [100] → “RelativeLayout” | — |
| bank-1955 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.9: [100] → “R là lớp được Android tạo ra để quản lý cho ” | — |
| bank-1956 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.10: [100] → “Để gọi được implicit intent cần biết class n” | — |
| bank-1957 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.10: [100] → “Trong file AndroidManifest.xml” | — |
| bank-1958 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.10: [100] → “Navigation Drawer” | — |
| bank-1960 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.10: [100] → “Hệ điều hành Android sẽ quản lý các ứng dụng” | — |
| bank-1959 | MINOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.11: [100] → “onCreate được gọi khi ứng dụng khởi chạy từ ” | media activity-lifecycle (25c420a3): onRestart() rời rạc; đường khởi động lại vẽ onStop→onStart bỏ qua onRestart |
| bank-1961 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.11: [100] → “ViewModel vẫn được active ngay cả khi Activi” | — |
| bank-1962 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.11: [100] → “Dữ liệu vẫn tồn tại ngay cả khi thiết bị xoa” | — |
| bank-1963 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.11: [100] → “RoomDatabase sẽ tự tạo các bảng cơ sở dữ liệ” | — |
| bank-1964 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.12: [100] → “Lưu dữ liệu nhỏ dạng key/value trong các phi” | — |
| bank-1965 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.12: [100] → “RecycleView” | — |
| bank-1966 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.12: [100] → “Main thread hay UI thread” | — |
| bank-1967 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.12: [100] → “textColor” | — |
| bank-1947 | MAJOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.13: [100] → “Fragment có vòng đời riêng của mình” | media Fragment-lifecycle (f63a867c) bị CỤT (thiếu onDestroyView/onDestroy/onDetach) |
| bank-1948 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.13: [100] → “android:inputType =”textPassword”” | — |
| bank-1968 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.13: [100] → “Kiểu dữ liệu Bundle cho phép đóng gói nhiều ” | — |
| bank-1969 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.13: [100] → “android:autoLink="web"” | — |
| bank-1970 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.13: [100] → “16 ms” | — |
| bank-1949 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.14: [100] → “Debug hoặc Verbose” | — |
| bank-1950 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.14: [100] → “Đọc file menu_main.xml, tạo các đối tượng tr” | — |
| bank-1951 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.15: [100] → “Sai” | — |
| bank-1971 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.15: [100] → “Tạo ra một task chạy ngầm, hệ điều hành sẽ q” | — |
| bank-1972 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.15: [100] → “Logcat chỉ hiển thị các thông tin debug do l” | — |
| bank-1973 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.15: [100] → “Trong thư mục res, tạo thư mục layout-land” | — |
| bank-1974 | MINOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.15: [100] → “5555” | Nguồn (logcat, network-ops) không hỗ trợ dữ kiện port adb 5555 |
| bank-1975 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.16: [100] → “Log thông tin cần debug ra file lưu trên thi” | — |
| bank-1977 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.16: [100] → “<uses-permission android:name="android.permi” | — |
| bank-1978 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.16: [100] → “HAL xác định một giao diện tiêu chuẩn để các” | — |
| bank-1979 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.16: [100] → “Lưu dữ liệu của Activity vào thẻ nhớ trong t” | — |
| bank-1980 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.17: [100] → “Lưu trữ id của từng view trong danh sách” | — |
| bank-15354 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.17: [100] → “Có thể lưu trữ vào file ở thư mục cài đặt củ” | — |
| bank-15355 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.17: [100] → “Phương thức execSQL() không có giá trị trả v” | — |
| bank-15356 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.18: [100] → “Lệnh insert thực hiện không thành công, trả ” | — |
| bank-15357 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.18: [100] → “Cần phải kết nối đến server” | — |
| bank-15358 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.18: [100] → “SQLite” | — |
| bank-15359 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.19: [100] → “SQLite” | — |
| bank-15360 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.19: [100] → “External Storage” | — |
| bank-15363 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.20: [100] → “External Storage” | — |
| bank-15364 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.20: [100] → “Shared Preferences” | — |
| bank-15365 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.20: [100] → “Mở file trong thư mục cài đặt của ứng dụng đ” | — |
| bank-15366 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.21: [100] → “Truy nhập file từ bộ nhớ dùng chung giữa các” | — |
| bank-15367 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.21: [100] → “Android 6.0” | — |
| bank-15361 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.22: [100] → “InputStream” | — |
| bank-15362 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.22: [100] → “OutputStream” | — |
| bank-15369 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.23: [100] → “Main thread hoặc UI thread” | — |
| bank-15373 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.23: [100] → “Không” | — |
| bank-15374 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.23: [100] → “doInBackground()” | — |
| bank-15375 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.24: [100] → “File AndroidManifest.xml” | — |
| bank-15376 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.24: [100] → “Socket” | — |
| bank-15379 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.25: [100] → “getContentLength()” | — |
| bank-15370 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.26: [100] → “new SlowTask().execute("param1", "param2");” | — |
| bank-15380 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.26: [100] → “Không” | — |
| bank-15372 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.27: [100] → “InputStream” | — |
| bank-16493 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.27: [100] → “setImageResource(R.drawable.test)” | — |
| bank-17507 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.27: [100] → “Broadcast Receiver” | — |
| bank-15381 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.28: [100] → “android.widget.TextView” | — |
| bank-16492 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.28: [100] → “centerInside” | — |
| bank-15382 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.29: [100] → “Phân biệt dựa vào định danh của đối tượng” | — |
| bank-16393 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.29: [100] → “text và drawableLeft” | — |
| bank-16490 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.29: [100] → “setOnLongClickListener” | — |
| bank-16488 | MINOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.30: [100] → “Các đáp án đều chính xác” | media “scaleType ImageView” lệch chủ đề (câu hỏi nút bấm bằng ảnh); Nguồn chỉ dẫn TextView |
| bank-16494 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.31: [100] → “LinearLayout” | — |
| bank-16496 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.31: [100] → “TextWatcher” | — |
| bank-15385 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.32: [100] → “editText.getText().toString()” | — |
| bank-15386 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.32: [100] → “isChecked()” | — |
| bank-16495 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.32: [100] → “Các đáp án đều chính xác” | — |
| bank-15387 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.33: [100] → “setText()” | — |
| bank-15388 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.33: [100] → “ScrollView” | — |
| bank-15383 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.34: [100] → “textPassword” | — |
| bank-15389 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.34: [100] → “Context Menu” | — |
| bank-15390 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.34: [100] → “always” | — |
| bank-16497 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.35: [100] → “dismiss()” | — |
| bank-16498 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.35: [100] → “show()” | — |
| bank-15391 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.36: [100] → “ActionBar Menu” | — |
| bank-15393 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.36: [100] → “ScrollView” | — |
| bank-15396 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.37: [100] → “getItemViewType()” | — |
| bank-15397 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.38: [100] → “BaseAdapter” | — |
| bank-16440 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.38: [100] → “RecyclerView” | — |
| bank-16455 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.38: [100] → “Các đáp án đều chính xác” | — |
| bank-15394 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.39: [100] → “RadioButton” | — |
| bank-16452 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.39: [100] → “Giảm số lần tạo view từ file XML” | — |
| bank-15435 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.40: [100] → “Tất cả các đáp án đều đúng” | — |
| bank-15811 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.40: [100] → “Nếu bạn không gọi addToBackStack thì khi bạn” | — |
| bank-15399 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.41: [100] → “add()” | — |
| bank-15401 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.41: [100] → “onCreateView()” | — |
| bank-15400 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.42: [100] → “replace()” | — |
| bank-15405 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.42: [100] → “Mở một activity của ứng dụng khác” | — |
| bank-15407 | MINOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.43: [100] → “Người dùng xoay màn hình hoặc đổi ngôn ngữ c” | media activity-lifecycle (25c420a3): onRestart() rời rạc; đường khởi động lại vẽ onStop→onStart bỏ qua onRestart |
| bank-15409 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.43: [100] → “Fragment” | — |
| bank-15412 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.44: [100] → “onActivityResult” | — |
| bank-15413 | MINOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.45: [100] → “startAcitivity()” | media activity-lifecycle (25c420a3): onRestart() rời rạc; đường khởi động lại vẽ onStop→onStart bỏ qua onRestart |
| bank-15414 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.45: [100] → “setContentView” | — |
| bank-15415 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.46: [100] → “setResult” | — |
| bank-15416 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.46: [100] → “Thiết lập trong file AndroidManifest.xml” | — |
| bank-17506 | MINOR | ngân hàng câu hỏi trắc nghiệm.pdf tr.46: [100] → “finish()” | media activity-lifecycle (25c420a3): onRestart() rời rạc; đường khởi động lại vẽ onStop→onStart bỏ qua onRestart |
| bank-15403 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.47: [100] → “Intent.ACTION_SENDTO” | — |
| bank-15404 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.47: [100] → “Uri” | — |
| bank-16489 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.48: [100] → “Cho phép cuộn cả theo chiều dọc và chiều nga” | — |
| bank-15421 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.49: [100] → “android.view.ViewGroup” | — |
| bank-15429 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.53: [100] → “Linux” | — |
| bank-15430 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.53: [100] → “ConstraintLayout” | — |
| bank-15432 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.54: [100] → “File cấu hình các thư viện sử dụng trong pro” | — |
| bank-15433 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.54: [100] → “10” | — |
| bank-15808 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.54: [100] → “1,2,3” | — |
| bank-15434 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.55: [100] → “Sử dụng công cụ phát triển ứng dụng trên các” | — |
| bank-15431 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.56: [100] → “Android Studio” | — |
| bank-16153 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.56: [100] → “Có thể cài đặt các phần mềm không phải từ ch” | — |
| bank-16154 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.56: [100] → “Tất cả các đáp án đều chính xác” | — |
| bank-16152 | ok | ngân hàng câu hỏi trắc nghiệm.pdf tr.57: [100] → “Tất cả các đáp án đều đúng” | — |
| goog-001 | ok | quiz Google.pdf tr.1: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-002 | MINOR | quiz Google.pdf tr.5: glyph đã đánh dấu khớp đáp án JSON | media “Cấu trúc APK” lệch chủ đề (câu hỏi về nghĩa của IDE) |
| goog-003 | ok | quiz Google.pdf tr.6: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-004 | ok | quiz Google.pdf tr.11: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-005 | MINOR | quiz Google.pdf tr.15: glyph đã đánh dấu khớp đáp án JSON | media activity-lifecycle (25c420a3): onRestart() rời rạc; đường khởi động lại vẽ onStop→onStart bỏ qua onRestart |
| goog-006 | ok | quiz Google.pdf tr.17: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-007 | ok | quiz Google.pdf tr.21: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-008 | MINOR | quiz Google.pdf tr.24: glyph đã đánh dấu khớp đáp án JSON | media “Cấu trúc APK” lệch chủ đề (câu hỏi về Gradle) |
| goog-009 | ok | quiz Google.pdf tr.30: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-010 | ok | quiz Google.pdf tr.30: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-011 | ok | quiz Google.pdf tr.34: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-012 | ok | quiz Google.pdf tr.34: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-013 | MINOR | quiz Google.pdf tr.35: glyph đã đánh dấu khớp đáp án JSON | media activity-lifecycle (25c420a3): onRestart() rời rạc; đường khởi động lại vẽ onStop→onStart bỏ qua onRestart |
| goog-014 | ok | quiz Google.pdf tr.36: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-015 | ok | quiz Google.pdf tr.38: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-016 | MAJOR | quiz Google.pdf tr.38: glyph đã đánh dấu khớp đáp án JSON | media Fragment-lifecycle (f63a867c) bị CỤT (thiếu onDestroyView/onDestroy/onDetach) |
| goog-017 | ok | quiz Google.pdf tr.42: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-018 | ok | quiz Google.pdf tr.42: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-019 | ok | quiz Google.pdf tr.45: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-020 | ok | quiz Google.pdf tr.66: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-021 | ok | quiz Google.pdf tr.69: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-022 | ok | quiz Google.pdf tr.70: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-023 | ok | quiz Google.pdf tr.72: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-024 | ok | quiz Google.pdf tr.73: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-025 | MINOR | quiz Google.pdf tr.75: glyph đã đánh dấu khớp đáp án JSON | media activity-lifecycle (25c420a3): onRestart() rời rạc; đường khởi động lại vẽ onStop→onStart bỏ qua onRestart |
| goog-026 | MINOR | quiz Google.pdf tr.76: glyph đã đánh dấu khớp đáp án JSON | media “Cây kế thừa View” lệch chủ đề (câu hỏi về setImageResource) |
| goog-027 | ok | quiz Google.pdf tr.76: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-028 | MINOR | quiz Google.pdf tr.77: glyph đã đánh dấu khớp đáp án JSON | media “Logcat & mức log” lệch chủ đề (câu hỏi về TalkBack) |
| goog-029 | MINOR | quiz Google.pdf tr.79: glyph đã đánh dấu khớp đáp án JSON | media “scaleType ImageView” lệch chủ đề (câu hỏi về lớp cha EditText) |
| goog-030 | MINOR | quiz Google.pdf tr.80: glyph đã đánh dấu khớp đáp án JSON | media “LinearLayout” lệch chủ đề (câu hỏi về ConstraintLayout) |
| goog-031 | ok | quiz Google.pdf tr.88: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-032 | ok | quiz Google.pdf tr.92: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-033 | ok | quiz Google.pdf tr.99: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-034 | ok | quiz Google.pdf tr.100: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-035 | MINOR | quiz Google.pdf tr.103: glyph đã đánh dấu khớp đáp án JSON | media “HttpURLConnection tải file” lệch chủ đề (câu hỏi về Glide) |
| goog-036 | ok | quiz Google.pdf tr.None: glyph đã đánh dấu khớp đáp án JSON | — |
| goog-037 | ok | quiz Google.pdf tr.107: glyph đã đánh dấu khớp đáp án JSON | — |

# ĐẶC TẢ NÂNG CẤP WEBSITE TÌM VIỆC PART-TIME CHO SINH VIÊN

> **Tài liệu giao cho AI Coding Agent (Codex / Claude Code / Cursor / Copilot Agent, v.v.)**  
> **Mục đích:** Rà soát dự án hiện tại, so sánh với các thực hành UX/chức năng phổ biến của VietnamWorks và TopCV, xác định điểm thiếu, sau đó **chỉnh sửa trực tiếp trong repository** theo thứ tự ưu tiên, bảo đảm không phá vỡ tính năng đang hoạt động.  
> **Ngày lập:** 06/11/2026  
> **Phạm vi:** Website tuyển dụng việc làm bán thời gian tại Việt Nam, ưu tiên sinh viên và nhà tuyển dụng có nhu cầu tuyển ca.

---

## 0. CHỈ THỊ CHO AGENT — ĐỌC TRƯỚC KHI LÀM

Bạn là **Senior Full-stack Engineer + Business Analyst + UI/UX Designer + QA Engineer** được giao cải tiến **dự án website tìm việc part-time cho sinh viên hiện có**. Đây là đặc tả **mục tiêu và tiêu chí đánh giá**, **không có nghĩa mọi tính năng đều chưa được xây dựng**.

### Quy tắc bắt buộc

1. **Khảo sát codebase trước:** đọc `README`, cấu trúc dự án, package/dependencies, routes, components, database schema, migration, API, auth, tests, cấu hình triển khai. Xác định stack thật của dự án; **không tự giả định** React, Spring Boot, Next.js, Flask, v.v.
2. **Kiểm kê hiện trạng:** đối chiếu từng hạng mục trong tài liệu với code thực tế; ghi rõ `Đã có / Có nhưng thiếu hoặc lỗi / Chưa có / Chưa kiểm chứng`, kèm vị trí file, route hoặc bằng chứng cụ thể. **Không được kết luận “thiếu” chỉ vì không thấy trên trang chủ**.
3. **Tận dụng chức năng có sẵn**, sửa lỗi và hoàn thiện trước khi thêm mới. Giữ nguyên stack, kiến trúc, quy ước đặt tên, design system và cấu trúc dự án hiện tại nếu không có lý do kỹ thuật chính đáng để thay đổi.
4. **Không xóa, đổi tên, phá vỡ API, database, dữ liệu hoặc UI đang hoạt động** nếu không có kế hoạch tương thích/migration rõ ràng. Không ghi đè file bí mật hoặc dữ liệu của người dùng. Trước mỗi migration phải xem xét dữ liệu cũ.
5. **Không sao chép giao diện, logo, hình ảnh, CSS hoặc nội dung có bản quyền** của TopCV/VietnamWorks. Chỉ tham khảo **mẫu hành trình người dùng, tính năng và nguyên tắc UX**; thiết kế nhận diện riêng.
6. **Triển khai theo mức ưu tiên P0 → P1 → P2.** Ưu tiên hoàn thiện luồng nghiệp vụ end-to-end thay vì làm nhiều màn hình giả (mock) không lưu được dữ liệu.
7. UI ngôn ngữ chính **tiếng Việt**, responsive trên điện thoại, tablet, desktop; trang tìm việc công khai không bắt buộc đăng nhập.
8. **Bảo mật và quyền riêng tư ngay từ đầu:** kiểm tra phân quyền ở backend, validate đầu vào, bảo vệ CV và dữ liệu cá nhân, giới hạn upload, chống lạm dụng. Không hardcode mật khẩu, khóa API hoặc thông tin thật.
9. **Dữ liệu giả chỉ dành cho seed/demo/test**, không hiển thị như việc đang tuyển thực tế nếu chưa được phê duyệt. Không tự đánh dấu doanh nghiệp “đã xác minh”.
10. Khi hoàn thành mỗi nhóm công việc, chạy build/lint/test phù hợp với project; báo cáo các bước kiểm tra đã chạy, kết quả và hạn chế. **Không tự tuyên bố đã kiểm thử chức năng khi chưa có bằng chứng.**
11. Nếu gặp phạm vi quá lớn, làm **P0 ổn định trước** và ghi các phần còn lại vào backlog; đừng tạo nửa chừng một hệ thống quá phức tạp.
12. Tất cả quyết định triển khai phải dựa trên thực tế codebase. Phần định nghĩa route, entity, API dưới đây là **gợi ý thiết kế**, không phải chỉ thị phải thay thế hệ thống hiện có.

### Kết quả bàn giao bắt buộc

- `docs/FEATURE_AUDIT.md` — bảng đối chiếu yêu cầu ↔ hiện trạng ↔ bằng chứng (file/route) ↔ phương án sửa ↔ ưu tiên ↔ kết quả.
- `docs/IMPLEMENTATION_PLAN.md` — thứ tự triển khai, thay đổi liên quan UI/API/DB, phụ thuộc và rủi ro.
- Mã nguồn đã chỉnh sửa **thực sự chạy được**, migration hoặc cập nhật schema phù hợp nếu cần.
- `docs/CHANGELOG_PARTTIME.md` — danh sách file đã sửa, chức năng đã hoàn thiện, chưa làm, cách chạy thử, kiểm tra thủ công.
- Bộ test tối thiểu cho các luồng P0 cốt lõi hoặc mô tả rõ vì sao test tự động chưa thể chạy trong môi trường hiện tại.

---

## 1. MỤC TIÊU SẢN PHẨM

### 1.1. Đối tượng sử dụng

1. **Sinh viên / Ứng viên:** người cần việc làm thêm ít giờ, gần trường/nơi ở, phù hợp lịch học, có thể chưa có kinh nghiệm.
2. **Nhà tuyển dụng:** cửa hàng, quán cà phê, doanh nghiệp dịch vụ, trung tâm, tổ chức có nhu cầu tuyển bán thời gian.
3. **Quản trị viên (Admin):** xác minh thông tin, duyệt tin, xử lý phản ánh, quản lý hệ thống.

### 1.2. Giá trị khác biệt cần ưu tiên

- **Phù hợp lịch học:** lọc theo ca sáng/chiều/tối và ngày trong tuần, tiến tới so khớp lịch rảnh.
- **Minh bạch thu nhập:** nêu rõ lương theo giờ/ca/tháng, khoảng lương, kỳ thanh toán, phụ cấp/khấu trừ.
- **Thuận tiện di chuyển:** tìm theo quận/khu vực/trường; nếu đủ tọa độ thì tìm theo bán kính.
- **Ứng tuyển đơn giản:** hồ sơ sinh viên ngắn gọn, CV là tùy chọn trừ khi từng tin yêu cầu.
- **Tăng độ an toàn:** kiểm duyệt tin, xác minh nhà tuyển dụng, cơ chế phản ánh và cảnh báo lừa đảo.
- **Quản lý tiến trình rõ ràng:** đã nộp → đang xem xét → mời phỏng vấn → nhận việc/từ chối.

### 1.3. Phạm vi phiên bản đầu (MVP)

Một bản MVP đạt yêu cầu khi cả **ba vai trò** sử dụng được một chu trình hoàn chỉnh:

**Nhà tuyển dụng** tạo hồ sơ → tạo tin → **Admin** duyệt tin → **Sinh viên** tìm và xem tin → gửi ứng tuyển → **Nhà tuyển dụng** xem và cập nhật trạng thái → **Sinh viên** theo dõi kết quả. Tất cả phải lưu vào cơ sở dữ liệu, kiểm tra quyền bằng backend và hiển thị đúng sau khi tải lại trang.

---

## 2. THAM KHẢO VIETNAMWORKS VÀ TOPCV

> Những mục bên dưới là **tổng hợp các nhóm tính năng và nguyên tắc sản phẩm** đã bàn luận, dùng làm định hướng thiết kế, **không phải bảng kiểm chứng thời gian thực rằng mọi nút/UI đều hiện diện trên phiên bản hôm nay**. Một số khả năng có thể chỉ có trên ứng dụng, sau đăng nhập hoặc thuộc gói tuyển dụng. Hãy tập trung vào giá trị cần xây dựng cho website này.

| Nhóm | Điểm nên học từ TopCV | Điểm nên học từ VietnamWorks | Điều chỉnh cho part-time sinh viên |
|---|---|---|---|
| Trang chủ | Search nổi bật, card việc, danh mục, hướng nghiệp | Điều hướng tìm kiếm công việc chuyên nghiệp | Search ngay đầu trang; gợi ý theo lịch, lương/giờ, khu vực |
| Danh sách việc | Lọc rõ ràng, thông tin card ngắn gọn | Tìm kiếm và phân loại sâu | Thêm lọc ca, ngày làm, thời lượng, trả lương |
| Hồ sơ | Tạo và quản lý CV | Hồ sơ nghề nghiệp, kỹ năng, học vấn | Profile tối giản, không bắt buộc kinh nghiệm |
| Ứng tuyển | Chọn hồ sơ/CV, theo dõi | Gửi hồ sơ và lịch sử ứng tuyển | Ứng tuyển nhanh, status minh bạch |
| Gợi ý/nhắc việc | Gợi ý, job alert | Việc quan tâm, cảnh báo tin sắp hết hạn | Ưu tiên lịch phù hợp, khu vực gần và điều kiện lương |
| Doanh nghiệp | Trang công ty, công cụ sàng lọc | Quản trị hồ sơ, quy trình tuyển dụng | Dashboard đăng ca/tin và xử lý ứng viên gọn nhẹ |
| Độ tin cậy | Cơ chế phản ánh tin | Thông tin nhà tuyển dụng, quy trình chuyên nghiệp | Quy trình duyệt + xác minh + cảnh báo rủi ro |

**Điểm chung cần kế thừa:** đăng nhập, tìm việc, bộ lọc, danh sách và chi tiết tin, hồ sơ ứng viên, ứng tuyển, theo dõi, lưu việc, thông báo, quản lý tin và ứng viên của nhà tuyển dụng.

**Điểm không nên sao chép máy móc:** hồ sơ nghề nghiệp quá dài, quy trình tuyển dụng nhiều vòng, bộ lọc cấp quản lý hoặc tính năng AI phức tạp khi chưa cần thiết cho một hệ thống part-time.

---

## 3. DANH SÁCH TÍNH NĂNG VÀ TIÊU CHÍ NGHIỆM THU

**Quy ước:** `P0` = bắt buộc cho MVP; `P1` = nâng cao thiết thực; `P2` = mở rộng. Agent phải đánh dấu trạng thái hiện có trước khi thực hiện.

### 3.1. Sinh viên / Ứng viên

| ID | Ưu tiên | Chức năng | Yêu cầu thực thi và nghiệm thu |
|---|---|---|---|
| ST-01 | P0 | Đăng ký, đăng nhập, đăng xuất, quên mật khẩu | Validate form, báo lỗi rõ, session/token an toàn, không tiết lộ email có tồn tại qua luồng reset |
| ST-02 | P0 | Duyệt việc công khai | Trang `/jobs` và `/jobs/:id` (hoặc route tương đương) xem được không cần tài khoản; chỉ thấy tin đã duyệt còn hiệu lực |
| ST-03 | P0 | Tìm kiếm việc | Từ khóa tiêu đề/công ty; hỗ trợ trường hợp rỗng, không kết quả, phân trang hoặc load more |
| ST-04 | P0 | Bộ lọc | Khu vực, loại việc, mức lương/đơn vị lương, ca/ngày làm; có xóa tất cả lọc và giữ được trạng thái lọc hợp lý |
| ST-05 | P0 | Chi tiết việc làm | Hiện rõ tiêu đề, doanh nghiệp, địa điểm, mô tả, yêu cầu, số lượng, lương, lịch, quyền lợi, hạn nộp, ngày đăng |
| ST-06 | P0 | Hồ sơ sinh viên | Xem/sửa tên, liên hệ, trường, ngành (nếu có), kỹ năng, giới thiệu, lịch rảnh căn bản |
| ST-07 | P0 | Ứng tuyển online | Chỉ ứng tuyển khi đăng nhập vai trò sinh viên, tin đang tuyển, hợp lệ, không vô tình nộp trùng; lưu DB |
| ST-08 | P0 | Theo dõi ứng tuyển | Danh sách đơn theo thời gian với trạng thái `submitted/reviewing/interview/accepted/rejected/withdrawn` hoặc mapping tương đương |
| ST-09 | P1 | Lưu/bỏ lưu việc | Danh sách yêu thích theo người dùng, không tạo bản ghi lặp |
| ST-10 | P1 | Thông báo | Khi nộp đơn, đổi trạng thái, tin lưu sắp hết hạn (nếu có scheduler); có trạng thái đã đọc |
| ST-11 | P1 | CV | Tải lên hoặc tạo CV cơ bản, validate loại file/dung lượng, link tải có kiểm soát quyền |
| ST-12 | P1 | Lịch phỏng vấn | Xem đề xuất lịch, xác nhận/từ chối, lưu lịch và gửi thông báo |
| ST-13 | P2 | Gợi ý việc thông minh | Ban đầu theo quy tắc và giải thích được; chỉ thêm AI khi có dữ liệu, kiểm thử và nhu cầu rõ |

### 3.2. Nhà tuyển dụng

| ID | Ưu tiên | Chức năng | Yêu cầu thực thi và nghiệm thu |
|---|---|---|---|
| EM-01 | P0 | Tài khoản nhà tuyển dụng | Phân quyền tách ứng viên; chỉ truy cập dữ liệu doanh nghiệp sở hữu |
| EM-02 | P0 | Hồ sơ doanh nghiệp | Tên, liên hệ, mô tả, khu vực/địa điểm, website (nếu có); trạng thái xác minh chỉ do admin cập nhật |
| EM-03 | P0 | Đăng tin tuyển dụng | Có form cấu trúc, validate bắt buộc, trạng thái nháp/chờ duyệt/đã duyệt/đóng/hết hạn |
| EM-04 | P0 | Quản lý tin | Xem tin thuộc doanh nghiệp, sửa, đóng, mở lại theo quy tắc duyệt; phân quyền sở hữu |
| EM-05 | P0 | Xem ứng viên ứng tuyển | Danh sách theo từng tin, chỉ lộ thông tin khi ứng viên đã nộp và đã đồng ý chia sẻ |
| EM-06 | P0 | Cập nhật trạng thái | Chuyển `reviewing/interview/accepted/rejected`; ghi thời gian, thông báo đến ứng viên; chặn trạng thái bất hợp lý nếu cần |
| EM-07 | P1 | Lọc/tìm ứng viên đã nộp | Lọc theo tin, trạng thái, kỹ năng và thời gian, không mở kho CV trái quyền |
| EM-08 | P1 | Báo cáo cơ bản | Lượt xem tin (nếu có đo lường), số ứng tuyển, số đang duyệt, số nhận việc; không giả số liệu |
| EM-09 | P2 | Nhắn tin trực tiếp | Chat được phân quyền, chống spam, lưu lịch sử, có tính năng báo cáo |

### 3.3. Quản trị viên

| ID | Ưu tiên | Chức năng | Yêu cầu thực thi và nghiệm thu |
|---|---|---|---|
| AD-01 | P0 | Phân quyền RBAC | Bảo vệ cả UI lẫn API; tài khoản không được truy cập tài nguyên người khác bằng cách sửa ID |
| AD-02 | P0 | Duyệt tin | Có hàng chờ, duyệt/từ chối, ghi lý do và người thao tác; chỉ tin được duyệt mới xuất hiện công khai |
| AD-03 | P0 | Xác minh nhà tuyển dụng | Lưu bằng chứng/quy trình; admin cấp hoặc thu hồi trạng thái; không tự gắn huy hiệu |
| AD-04 | P0 | Xử lý phản ánh | Tiếp nhận báo cáo tin/doanh nghiệp, xem lý do, điều tra, xử lý và lưu lịch sử |
| AD-05 | P0 | Ẩn/khóa tin vi phạm | Tin bị ẩn không nhận ứng tuyển mới; phản hồi phù hợp cho ứng viên có ứng tuyển cũ |
| AD-06 | P0 | Bảo vệ dữ liệu | Giới hạn dữ liệu nhạy cảm trả về qua API, cơ chế xóa/ẩn và quyền truy cập hợp lý |
| AD-07 | P1 | Dashboard | Thống kê số tin theo trạng thái, người dùng, đơn ứng tuyển, phản ánh chưa xử lý |
| AD-08 | P1 | Nhật ký hoạt động | Ghi các thao tác nhạy cảm: duyệt, xác minh, ẩn, đổi vai trò; có giới hạn quyền xem log |

### 3.4. Điểm đặc thù sinh viên

| ID | Ưu tiên | Chức năng | Yêu cầu thực thi và nghiệm thu |
|---|---|---|---|
| PT-01 | P0 | Loại công việc theo ca | Cho phép một tin khai báo ca sáng/chiều/tối, giờ thực tế và ngày làm cụ thể |
| PT-02 | P0 | Mức lương rõ đơn vị | Mô hình dữ liệu lưu min/max, tiền tệ, `hour/shift/month`; phân biệt thỏa thuận nếu không có con số |
| PT-03 | P0 | Lịch sinh viên | Cho phép nhập ngày và khoảng thời gian rảnh hoặc ít nhất lọc lịch theo ngày/ca |
| PT-04 | P0 | Cảnh báo tuyển dụng đáng ngờ | Form báo cáo và nội dung hướng dẫn; không khuyến khích nộp phí/đặt cọc để nhận việc |
| PT-05 | P1 | So khớp ca với lịch rảnh | So giờ bắt đầu/kết thúc và thứ trong tuần, chỉ tính điểm khi có dữ liệu lịch đủ tin cậy |
| PT-06 | P1 | Việc gần trường/khu vực | Lọc khu vực trước; tính bán kính chỉ khi có tọa độ đáng tin và quyền truy cập vị trí phù hợp |
| PT-07 | P1 | Số giờ/số ca mong muốn | Lọc số ca/tuần và tổng giờ; hiển thị rõ việc có lịch cố định hay linh hoạt |
| PT-08 | P1 | Lời mời phỏng vấn | Nhà tuyển dụng đề xuất lịch; sinh viên xác nhận hoặc từ chối |
| PT-09 | P2 | Đề xuất theo kỹ năng/sở thích | Kết hợp lịch, địa điểm, kỹ năng, mức lương; giải thích tiêu chí gợi ý |

---

## 4. YÊU CẦU UI/UX CHI TIẾT

### 4.1. Nguyên tắc thiết kế

- **Mobile-first:** ưu tiên trải nghiệm điện thoại (nhiều sinh viên tìm việc bằng điện thoại).
- **Phong cách riêng:** hiện đại, gọn, đáng tin cậy; giữ màu và logo hiện có nếu đã có nhận diện.
- **Điều hướng rõ:** tách trang công khai, khu vực sinh viên, nhà tuyển dụng và admin.
- **Khả năng sử dụng:** nhãn rõ, thông báo lỗi gần input, trạng thái loading/empty/error, thao tác bàn phím, focus visible và tương phản đủ đọc.
- **Không dùng dữ liệu giả đánh lừa:** đánh dấu bản demo, không hiện số công việc/người dùng “ảo” như dữ liệu thực.
- **Tốc độ:** phân trang, lazy load đúng chỗ, tránh gọi API dư thừa, tối ưu ảnh/logo, hạn chế các animation nặng.

### 4.2. Header / Navigation

- Trang công khai: logo, `Tìm việc`, `Công ty`, mục hướng dẫn (nếu có), đăng nhập/đăng ký, link `Đăng tuyển`.
- Đã đăng nhập sinh viên: profile, `Đơn ứng tuyển`, `Việc đã lưu`, thông báo, đăng xuất.
- Đã đăng nhập nhà tuyển dụng: dashboard, `Tin tuyển dụng`, `Ứng viên`, doanh nghiệp, đăng xuất.
- Mobile: menu gọn, tìm kiếm dễ mở, không để menu che chức năng chính.

### 4.3. Trang chủ (`/` hoặc route hiện tại)

**Thứ tự khuyến nghị:**

1. Hero: tiêu đề rõ: **“Tìm việc part-time phù hợp với lịch học của bạn”**.
2. Search: ô từ khóa, vị trí, lọc nhanh theo ca, nút `Tìm việc`.
3. Chip lọc nhanh: `Ca tối`, `Cuối tuần`, `Gần trường`, `Không yêu cầu kinh nghiệm`, `Lương theo giờ`.
4. Việc mới / việc phù hợp: card đơn giản, chỉ các tin đang hoạt động.
5. Danh mục: phục vụ, bán hàng, gia sư, sự kiện, thực tập, chăm sóc khách hàng, việc online... (chỉ hiện danh mục có dữ liệu hoặc được cấu hình).
6. Khối hướng dẫn: cách ứng tuyển an toàn và quy trình sử dụng.
7. Footer: liên hệ, chính sách quyền riêng tư, điều khoản, hỗ trợ, báo cáo vi phạm.

### 4.4. Trang danh sách việc (`/jobs`)

- Desktop: vùng lọc bên trái, danh sách kết quả bên phải; Mobile: filter drawer/sheet.
- Bộ lọc: từ khóa, khu vực, ngành, loại part-time, lương, đơn vị lương, ca, ngày trong tuần, kinh nghiệm.
- Nút `Xóa bộ lọc`, tổng kết số kết quả (nếu API trả đúng), sắp xếp mới nhất/phù hợp.
- Trang/danh sách phải có trạng thái: loading, không có kết quả, lỗi mạng, tải thêm.
- Nếu có query parameters, cho phép chia sẻ URL với trạng thái tìm kiếm.

### 4.5. Thiết kế Job Card

Mỗi card nên hiển thị thông tin theo thứ tự thị giác:

1. **Tên công việc** và **tên nhà tuyển dụng**.
2. **Lương + đơn vị**: ví dụ `28.000–35.000đ/giờ` (dữ liệu ví dụ).
3. **Ca**: ví dụ `18:00–22:00, Thứ 2/4/6`.
4. **Địa điểm**: quận/phường hoặc khu vực; chỉ hiện khoảng cách khi tính được từ tọa độ thực.
5. **Loại việc / yêu cầu**: part-time, không yêu cầu kinh nghiệm nếu đúng.
6. **Trạng thái xác minh** nếu doanh nghiệp thật sự đã được kiểm duyệt.
7. **Ngày đăng, hạn ứng tuyển**, nút xem chi tiết, lưu việc.

**Không** nhồi toàn bộ mô tả vào card. Ưu tiên các thông tin giúp sinh viên quyết định có bấm xem hay không.

### 4.6. Trang chi tiết việc (`/jobs/:id`)

Phải có: tiêu đề, doanh nghiệp, địa điểm làm, mức lương/đơn vị, lịch, trách nhiệm, yêu cầu, quyền lợi, số lượng cần tuyển, hình thức, hạn ứng tuyển, chính sách thanh toán nếu có, thông tin xác minh, CTA `Ứng tuyển ngay`, `Lưu việc`, `Báo cáo tin`.

Trạng thái CTA:
- Chưa đăng nhập → điều hướng đăng nhập và quay lại việc.
- Đã ứng tuyển → `Đã ứng tuyển`, không gửi bản trùng.
- Tin hết hạn/đã đóng/chưa duyệt → khóa ứng tuyển và nêu lý do.
- Không phải tài khoản sinh viên → hiển thị trạng thái phù hợp, không cho gửi qua API.

### 4.7. Dashboard theo vai trò

**Sinh viên:** profile completion (nếu tính được), đơn ứng tuyển, việc đã lưu, lịch rảnh, thông báo.

**Nhà tuyển dụng:** tổng quan tin, số đơn, tin chờ duyệt, danh sách ứng viên, thao tác đăng tin nhanh.

**Admin:** hàng chờ duyệt, doanh nghiệp chờ xác minh, báo cáo vi phạm và thống kê hệ thống.

---

## 5. ROUTES ĐỀ XUẤT — CHỈ THAM KHẢO

> Nếu repo đã có routing hợp lý, **giữ route hiện tại** và điều chỉnh chỉ khi thật sự cần. Không tự ý đổi route làm hỏng bookmark/deep link.

| Vai trò | Route đề xuất | Chức năng |
|---|---|---|
| Public | `/` | Trang chủ |
| Public | `/jobs` | Tìm kiếm và danh sách |
| Public | `/jobs/:id` | Chi tiết tuyển dụng |
| Public | `/companies/:id` | Trang doanh nghiệp |
| Public | `/login`, `/register` | Xác thực |
| Sinh viên | `/student/profile` | Hồ sơ và lịch rảnh |
| Sinh viên | `/student/applications` | Đơn đã nộp |
| Sinh viên | `/student/saved` | Việc đã lưu |
| Nhà tuyển dụng | `/employer/dashboard` | Tổng quan |
| Nhà tuyển dụng | `/employer/jobs` | Quản lý tin |
| Nhà tuyển dụng | `/employer/jobs/new` | Đăng tin |
| Nhà tuyển dụng | `/employer/applicants` | Quản lý ứng viên |
| Admin | `/admin` | Tổng quan |
| Admin | `/admin/jobs` | Duyệt/ẩn tin |
| Admin | `/admin/companies` | Xác minh doanh nghiệp |
| Admin | `/admin/reports` | Quản lý phản ánh |

---

## 6. MÔ HÌNH DỮ LIỆU GỢI Ý

> **Không tạo bảng trùng nếu đã có entity tương đương.** Agent cần đối chiếu schema và chỉ thêm cột/bảng cần thiết bằng migration an toàn.

| Entity | Trường dữ liệu chủ đạo |
|---|---|
| `users` | `id`, `email`, `password_hash`/auth provider id, `role`, `status`, timestamps |
| `student_profiles` | `user_id`, `full_name`, `school_id` hoặc trường text, ngành, kỹ năng, mô tả, liên hệ |
| `companies` | `id`, `owner_user_id`, tên, mô tả, địa chỉ, liên hệ, `verification_status` |
| `jobs` | `id`, `company_id`, title, description, requirements, benefits, `salary_min`, `salary_max`, `salary_unit`, currency, location, job_type, vacancies, deadline, status, timestamps |
| `job_shifts` | `id`, `job_id`, `weekday`, `start_time`, `end_time`, timezone, linh hoạt/cố định |
| `student_availability` | `id`, `student_id`, `weekday`, `start_time`, `end_time`, timezone |
| `applications` | `id`, `job_id`, `student_id`, `cv_reference` nullable, note, status, timestamps |
| `saved_jobs` | `student_id`, `job_id`, `created_at` với unique constraint |
| `notifications` | `id`, `recipient_user_id`, type, payload an toàn, `read_at`, `created_at` |
| `reports` | `id`, `reporter_user_id`, target type/id, reason, description, status, resolution |
| `verification_requests` | `id`, `company_id`, evidence reference, status, reviewer, reviewed_at |
| `audit_logs` | actor, action, target, timestamp; không lưu mật khẩu/token/PII không cần thiết |

### Quy tắc DB quan trọng

- Thiết lập **foreign key, index và constraint** cho những mối quan hệ chính.
- `applications(job_id, student_id)` có **unique constraint** nếu chính sách không cho ứng tuyển trùng; xử lý retry/idempotency hợp lý.
- Dùng trạng thái tin rõ nghĩa: `draft`, `pending_review`, `published`, `rejected`, `closed`, `expired` (hoặc mapping với enum hiện có).
- Khi `deadline` qua ngày, API phải ngừng cho nộp đơn kể cả nếu cron job chưa kịp đổi status.
- Dữ liệu về vị trí nên lưu cấu trúc địa chỉ; tọa độ chỉ có khi xác minh được, không bịa vị trí.
- Không đưa chứng từ xác minh hoặc dữ liệu ứng viên nhạy cảm ra URL công khai.

---

## 7. API / BACKEND — NGUYÊN TẮC

Các endpoint dưới đây chỉ là **ví dụ REST**, hãy thích nghi với API hiện tại:

```text
GET    /api/jobs                 # Public, chỉ tin được phép công khai
GET    /api/jobs/:id             # Public chi tiết tin
GET    /api/companies/:id        # Public thông tin được phép công khai
GET    /api/me                   # User hiện tại
GET    /api/student/profile      # Sinh viên
PATCH  /api/student/profile      # Sinh viên, owner-only
GET    /api/student/applications # Danh sách ứng tuyển của bản thân
POST   /api/jobs/:id/apply       # Sinh viên, chống trùng, tin phải active
GET    /api/student/saved        # Việc lưu
POST   /api/student/saved        # Lưu việc
DELETE /api/student/saved/:jobId # Bỏ lưu
GET    /api/employer/jobs        # Nhà tuyển dụng, chỉ tin của mình
POST   /api/employer/jobs        # Đăng tin/chờ duyệt
PATCH  /api/employer/jobs/:id    # Owner-only, kiểm tra trạng thái
GET    /api/employer/jobs/:id/applications
PATCH  /api/employer/applications/:id/status
GET    /api/admin/jobs/pending   # Admin-only
PATCH  /api/admin/jobs/:id/review
GET    /api/admin/reports        # Admin-only
POST   /api/reports              # Người dùng được phép gửi báo cáo
PATCH  /api/admin/reports/:id    # Admin-only
```

**Bắt buộc kiểm tra:**
- Authentication và authorization ở **server**, không chỉ ẩn nút trên UI.
- Cấm sửa ID để truy xuất hồ sơ ứng viên hoặc tin của doanh nghiệp khác (IDOR).
- Chống mass assignment: chỉ cho phép update những trường được liệt kê.
- Validate dữ liệu, lọc file upload, giới hạn kích thước, phân biệt lỗi 400/401/403/404/409/422 phù hợp.
- API danh sách có phân trang, giới hạn page size, sắp xếp ổn định.
- Tránh N+1 queries, không truy vấn toàn bộ DB để lọc khi có thể dùng database.
- Chống spam đăng tin/ứng tuyển/đăng nhập bằng rate limit hoặc biện pháp tương đương.
- Nếu dùng cookie auth, cấu hình an toàn và bảo vệ CSRF; nếu dùng token, không log token.
- Khi gửi email/thông báo, không chặn toàn bộ nghiệp vụ nếu dịch vụ gửi ngoài lỗi; cần ghi nhận trạng thái gửi phù hợp.

---

## 8. LOGIC NGHIỆP VỤ ĐẶC THÙ

### 8.1. Tính phù hợp lịch làm (P1)

**Input:** danh sách khoảng thời gian rảnh của sinh viên và danh sách ca làm của công việc.

**Quy tắc MVP đề xuất:**
1. Chuẩn hóa thứ trong tuần, timezone (`Asia/Ho_Chi_Minh` nếu hệ thống phục vụ VN), định dạng giờ.
2. Với ca cố định, xem là **khớp** khi khoảng giờ ca làm nằm **trọn trong** một hoặc các khoảng rảnh hợp lệ của sinh viên trong cùng ngày.
3. Nếu tin có nhiều ca lựa chọn, phân biệt `chỉ cần chọn một ca` và `phải làm mọi ca` (không suy đoán khi dữ liệu thiếu).
4. Nếu một trong hai bên chưa có lịch, hiển thị **“Chưa đủ dữ liệu để đối chiếu lịch”**, không cho điểm phù hợp tuyệt đối.
5. Ca qua nửa đêm phải được xử lý rõ thay vì so giờ sai.
6. Cho phép người dùng tự lọc thủ công dù chưa nhập lịch.

**Không bắt buộc AI/ML** cho tính năng này. Logic quy tắc minh bạch tốt hơn ở phiên bản đầu.

### 8.2. Tìm theo khoảng cách (P1)

- Tìm theo quận/khu vực/trường trước, không bắt buộc định vị chính xác.
- Nếu có tọa độ điểm bắt đầu và địa điểm làm đáng tin, tính khoảng cách theo công thức địa lý thích hợp; ghi rõ **“khoảng cách ước tính”** nếu là đường chim bay.
- Không tự nhận là quãng đường đi thực tế hoặc thời gian di chuyển khi chưa có dịch vụ routing.
- Không bắt buộc người dùng chia sẻ vị trí; lưu ý quyền riêng tư và quyền truy cập location.

### 8.3. Mức lương và tính minh bạch

- Lưu đơn vị `hour` / `shift` / `month` (và có thể `negotiable`).
- `salary_min <= salary_max` nếu đều có; số phải không âm và phù hợp kiểu dữ liệu tiền tệ.
- Phân biệt **lương cơ bản, thưởng, phụ cấp, khấu trừ và kỳ trả** nếu nhà tuyển dụng cung cấp.
- Không hứa “thu nhập ước tính” dựa trên số giờ làm nếu chưa có lịch rõ ràng.

### 8.4. Kiểm duyệt / xác minh / báo cáo

- Tin mới hoặc tin chỉnh sửa nội dung quan trọng nên được xem xét lại theo chính sách duyệt.
- Huy hiệu `Đã xác minh` chỉ xuất hiện khi trạng thái do admin phê duyệt.
- Báo cáo phải lưu lý do, nguồn, người xử lý, quyết định; cho phép người dùng báo cáo mà không lộ danh tính cho nhà tuyển dụng.
- Hạn chế thông tin dễ làm lộ dữ liệu nhạy cảm; không công khai chứng từ doanh nghiệp.
- Cảnh báo người tìm việc trước yêu cầu chuyển tiền, đặt cọc hoặc giao thông tin nhạy cảm không phù hợp.

---

## 9. LUỒNG NGHIỆP VỤ BẮT BUỘC

### 9.1. Tuyển dụng end-to-end

1. Nhà tuyển dụng đăng ký/đăng nhập.
2. Tạo hoặc cập nhật hồ sơ doanh nghiệp.
3. Tạo tin với vị trí, mô tả, lịch, lương/đơn vị và hạn tuyển.
4. Tin được đưa vào trạng thái chờ duyệt nếu cần.
5. Admin duyệt tin; tin xuất hiện trong kết quả công khai.
6. Sinh viên tìm kiếm/lọc, xem chi tiết và ứng tuyển.
7. Backend kiểm tra login, vai trò, hạn tuyển, trùng đơn và quyền truy cập.
8. Nhà tuyển dụng xem danh sách đơn của tin mình sở hữu, cập nhật trạng thái.
9. Sinh viên xem trạng thái thay đổi, nhận thông báo nếu hệ thống có hỗ trợ.
10. Admin có thể ẩn tin sau phản ánh; hệ thống ngừng nhận đơn mới.

### 9.2. Ma trận quyền tối thiểu

| Hành động | Khách | Sinh viên | Nhà tuyển dụng | Admin |
|---|---:|---:|---:|---:|
| Xem tin đã duyệt | Có | Có | Có | Có |
| Ứng tuyển | Không | Có | Không | Không (mặc định) |
| Xem đơn ứng tuyển của mình | Không | Có | Không | Theo phạm vi kiểm soát |
| Đăng/sửa tin của doanh nghiệp mình | Không | Không | Có | Theo nghiệp vụ quản trị |
| Xem đơn vào tin của mình | Không | Không | Có | Theo phạm vi kiểm soát |
| Duyệt tin/xác minh | Không | Không | Không | Có |
| Xử lý báo cáo vi phạm | Không | Không | Không | Có |

---

## 10. TEST CASES / ACCEPTANCE CRITERIA TỐI THIỂU

Mỗi luồng P0 cần test tự động nếu hạ tầng cho phép và test thủ công thực tế:

| Test ID | Tình huống | Kết quả mong đợi |
|---|---|---|
| T-01 | Khách chưa đăng nhập truy cập `/jobs` | Xem được tin đã duyệt còn hạn |
| T-02 | Tin ở trạng thái nháp/chờ duyệt | Không xuất hiện trong tìm kiếm công khai |
| T-03 | Tìm bằng từ khóa và lọc ca tối | Chỉ trả kết quả đúng điều kiện; kết quả rỗng không làm hỏng giao diện |
| T-04 | Sinh viên đăng nhập ứng tuyển tin hợp lệ | Tạo một đơn ứng tuyển trong DB, hiện trạng thái đã nộp |
| T-05 | Sinh viên bấm ứng tuyển hai lần / gửi lại request | Không tạo hai đơn trùng, thông báo rõ |
| T-06 | Nhà tuyển dụng A truy cập đơn của tin doanh nghiệp B | API trả lỗi không đủ quyền, không lộ dữ liệu |
| T-07 | Người dùng chưa đăng nhập gửi request tạo tin | API từ chối |
| T-08 | Tin hết hạn nhưng chưa có job tự cập nhật status | API không nhận đơn mới |
| T-09 | Nhà tuyển dụng đổi trạng thái đơn | Sinh viên nhìn thấy trạng thái mới sau reload |
| T-10 | Admin ẩn tin vi phạm | Tin biến mất khỏi danh sách công khai, không cho nộp đơn mới |
| T-11 | Không có thông tin tọa độ | Không bịa khoảng cách/km trên UI |
| T-12 | Chưa có lịch rảnh | Không hiện “100% phù hợp lịch” |
| T-13 | Nhà tuyển dụng tự sửa `verification_status` qua API | Bị từ chối, trạng thái không đổi |
| T-14 | Upload CV không hợp lệ/quá dung lượng | Từ chối an toàn, thông báo dễ hiểu |
| T-15 | Hiển thị trên điện thoại | Menu, bộ lọc, nút ứng tuyển, form hoạt động và không tràn ngang |
| T-16 | API lỗi hoặc mạng chậm | UI có loading/error/retry, không trắng trang vô cớ |
| T-17 | Reset password/đăng nhập sai | Không rò rỉ thông tin nhạy cảm qua lỗi hoặc log |

**Definition of Done (DoD):**
- Có chức năng backend + frontend + persistence đúng nhu cầu.
- Kiểm tra quyền truy cập server-side và validate dữ liệu.
- Có loading/empty/error và responsive nếu là màn hình UI.
- Build/lint/test chạy thành công (hoặc có ghi nhận chính xác lỗi môi trường).
- Cập nhật docs và không phát sinh lỗi regression đáng kể.
- Tránh tạo API/component bỏ không, mock UI khiến người dùng tưởng chức năng đã chạy.

---

## 11. LỘ TRÌNH TRIỂN KHAI

### Phase 0 — Audit (bắt buộc trước khi sửa)

- Tìm tất cả màn hình/routes/endpoint/schema có sẵn.
- Chạy ứng dụng và test hiện tại nếu môi trường hỗ trợ.
- Ghi bảng trạng thái từng ID trong phần 3.
- Phân loại: lỗi cần sửa ngay, tính năng thiếu, phần có thể tái sử dụng, thay đổi DB cần migration.

**Đầu ra:** `docs/FEATURE_AUDIT.md` và `docs/IMPLEMENTATION_PLAN.md`.

### Phase 1 — P0: end-to-end MVP

1. Auth và phân quyền các vai trò.
2. Danh sách việc, tìm kiếm, lọc, chi tiết việc.
3. Form đăng tin và quy trình admin duyệt.
4. Profile sinh viên và ứng tuyển có chống trùng.
5. Nhà tuyển dụng xử lý đơn và sinh viên theo dõi trạng thái.
6. Dữ liệu lịch, lương có đơn vị rõ và thông tin tuyển dụng chính xác.
7. Báo cáo vi phạm, khóa tin, bảo vệ thông tin nhạy cảm.
8. Kiểm thử toàn bộ hành trình, sửa lỗi responsive, empty/loading/error.

### Phase 2 — P1: điểm khác biệt và trải nghiệm

1. Lưu việc, thông báo.
2. Chỉnh sửa lịch rảnh và so khớp ca thực tế.
3. Tìm việc gần trường/khu vực.
4. CV tùy chọn, lời mời phỏng vấn.
5. Dashboard/thống kê thực và audit log.

### Phase 3 — P2: nâng cao

1. Đề xuất công việc theo sở thích/kỹ năng (bắt đầu rule-based).
2. Chat có quyền truy cập và chống spam nếu có nhu cầu thật.
3. Công cụ tạo CV nâng cao và phân tích tuyển dụng.
4. Tối ưu SEO, hiệu năng nâng cao, cache và monitoring khi lượng người dùng tăng.

---

## 12. TIÊU CHUẨN KỸ THUẬT VÀ CHẤT LƯỢNG

### Frontend

- Reusable UI components, trạng thái form rõ ràng, không duplicate logic.
- Responsive mobile-first; input và button dễ thao tác, định dạng VND/ngày giờ theo Việt Nam.
- Xử lý debounce search nếu cần, tránh race conditions khi đổi bộ lọc nhanh.
- Semantic HTML, nhãn form, focus styles, điều hướng bàn phím.
- Không để placeholder/mẫu demo lẫn với dữ liệu thật.

### Backend

- Service/business layer rõ ràng theo stack hiện có.
- Validation nhất quán; kiểm tra quyền tài nguyên server-side.
- Transaction khi cập nhật nghiệp vụ quan trọng, ràng buộc DB hỗ trợ chống race condition.
- Không trả password hash, token, giấy tờ hoặc thông tin cá nhân ngoài phạm vi cho phép.
- Log đủ cho debug nhưng không log bí mật hoặc thông tin nhạy cảm không cần thiết.

### Database

- Migration có khả năng áp dụng an toàn trên dữ liệu đang tồn tại.
- Xem xét nullable/default khi thêm cột, không xóa dữ liệu thật.
- Index tìm kiếm/phân trang, uniqueness theo nghiệp vụ.
- Seed data chỉ dùng cho phát triển/test, không tự động chèn vào production.

### Vận hành

- Cập nhật `.env.example` thay vì tạo `.env` chứa secrets.
- README có lệnh cài/chạy/test/migrate theo đúng stack.
- Kiểm thử bản build production nếu môi trường cho phép.

---

## 13. MẪU BÁO CÁO AUDIT MÀ AGENT PHẢI TẠO

Tạo `docs/FEATURE_AUDIT.md` dạng sau và **điền bằng bằng chứng thực tế từ repo**, không sao chép nguyên ví dụ:

| ID | Trạng thái | Bằng chứng trong repo | Vấn đề | Hành động | Ưu tiên |
|---|---|---|---|---|---|
| ST-03 | Đã có / Thiếu / Lỗi / Chưa kiểm chứng | `path/to/file`, route, test | Mô tả đúng vấn đề | Giữ nguyên / Sửa / Bổ sung | P0 |

Nên bổ sung các mục:
- **Current architecture:** frontend/backend/database/auth/deployment.
- **Đã hoạt động:** tính năng nào được kiểm thử, bằng chứng.
- **Khoảng trống:** chức năng chưa có hoặc đang lỗi.
- **Thay đổi đã làm:** path, commit hoặc diff tóm tắt.
- **Migration:** cần/không cần; cách áp dụng và rollback.
- **Kiểm thử:** lệnh đã chạy, pass/fail, nguyên nhân lỗi còn lại.
- **Backlog:** phần P1/P2 chưa triển khai và lý do.

---

## 14. PROMPT NGẮN ĐỂ DÁN CHO CODING AGENT

Sao chép khối bên dưới nếu bạn muốn ra lệnh trực tiếp cho Agent sau khi đặt file này tại root repo:

```text
Hãy đọc toàn bộ file AGENT_SPEC_WEBSITE_VIEC_LAM_PARTTIME_SINH_VIEN.md.
Bạn được giao audit và cải tiến trực tiếp dự án website tìm việc part-time cho sinh viên này.

Yêu cầu:
1) Khảo sát repository và chạy dự án/test hiện có nếu khả thi; không đoán stack.
2) Lập docs/FEATURE_AUDIT.md, đối chiếu từng yêu cầu ST/EM/AD/PT với code thực tế:
   Đã có / Có nhưng chưa đủ hoặc bị lỗi / Chưa có / Chưa kiểm chứng.
   Mỗi nhận xét phải có bằng chứng file, route, schema hoặc kết quả chạy.
3) Lập docs/IMPLEMENTATION_PLAN.md, ưu tiên P0, giữ chức năng đã đúng.
4) Tiến hành sửa/bổ sung P0 thành luồng hoàn chỉnh:
   nhà tuyển dụng tạo tin -> admin duyệt -> sinh viên tìm và ứng tuyển
   -> nhà tuyển dụng xử lý -> sinh viên theo dõi kết quả.
5) Ưu tiên bộ lọc ca/ngày làm, lương/giờ, hồ sơ sinh viên đơn giản,
   phân quyền server-side, báo cáo tin và xác minh nhà tuyển dụng.
6) Nếu cần thay đổi DB thì viết migration an toàn cho dữ liệu cũ.
7) UI tiếng Việt, responsive, có loading/error/empty states và thiết kế riêng;
   không sao chép tài sản của VietnamWorks/TopCV.
8) Chạy test/build/lint phù hợp; sửa các lỗi mới phát sinh và ghi kết quả thật.
9) Tạo docs/CHANGELOG_PARTTIME.md ghi file đã sửa, cách chạy, tính năng
   hoàn thành, tồn đọng P1/P2, các hạn chế và kết quả kiểm thử.

Không phá hủy dữ liệu, không xóa chức năng đang chạy, không hardcode secrets,
không khẳng định hoàn thành nếu chưa kiểm chứng. Nếu không thể làm hết,
ưu tiên hoàn thành và kiểm thử P0 thay vì làm dở nhiều mục.
Bắt đầu bằng audit repo, sau đó triển khai những mục P0 còn thiếu hoặc bị lỗi.
```

---

## 15. LƯU Ý VỀ PHẠM VI VÀ THẨM ĐỊNH

- **Không có mã nguồn hoặc link dự án đi kèm tài liệu này**, nên đây là **bản đặc tả mục tiêu**, chưa phải danh sách lỗi đã xác nhận của ứng dụng.
- Agent phải tự đọc repo để biết tính năng nào thực sự còn thiếu. **Không tự tạo lại toàn bộ ứng dụng** nếu dự án đang có nền tảng hoạt động tốt.
- Những nhóm chức năng TopCV/VietnamWorks được dùng làm nguồn cảm hứng UX/product, không cam kết tính năng hoặc bố cục cụ thể của họ vẫn y nguyên tại thời điểm Agent chạy.
- Các mẫu route, status, database, endpoint trong tài liệu chỉ là mô hình tham khảo; tương thích với code hiện hữu quan trọng hơn việc dùng đúng tên minh họa.
- Khi sản phẩm có người dùng thực, cần kiểm tra chính sách dữ liệu cá nhân, điều khoản sử dụng và quy định lao động có liên quan tại Việt Nam trước khi triển khai công khai.

---

**TIÊU CHÍ THÀNH CÔNG CUỐI CÙNG:** Sinh viên có thể tìm việc part-time phù hợp lịch và lương, ứng tuyển an toàn, theo dõi kết quả; doanh nghiệp có thể đăng tin, tuyển người; admin kiểm soát được tin và phản ánh; website hoạt động ổn định, có phân quyền, lưu dữ liệu thật và không phá hỏng những tính năng vốn đã có.

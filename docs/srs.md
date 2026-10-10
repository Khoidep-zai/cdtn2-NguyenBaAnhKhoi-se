# ĐẶC TẢ YÊU CẦU PHẦN MỀM (SOFTWARE REQUIREMENTS SPECIFICATION - SRS)

**Dự án:** Nền tảng quản lý freelance & marketplace việc làm part-time cho sinh viên  
**Học phần:** Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường Đại học Văn Lang  
**Nhóm thực hiện:** Nhóm 8 (261_71ITGR40303_04)  
**Phiên bản:** v1.2 (Cập nhật nghiệm thu đồ án)  

---

## 1. GIỚI THIỆU VÀ CÁC TÁC NHÂN (ACTORS)

### 1.1. Mục đích tài liệu
Tài liệu xác định đầy đủ, súc tích các yêu cầu chức năng (FR), yêu cầu phi chức năng (NFR) và quy tắc nghiệp vụ (BR) của hệ thống sàn việc làm sinh viên. Đây là căn cứ kỹ thuật chuẩn hóa để phát triển, kiểm thử và nghiệm thu sản phẩm.

### 1.2. Danh sách các tác nhân (Actors)

| Tác nhân | Mã vai trò | Quyền hạn và phạm vi hoạt động |
|---|---|---|
| **Khách vãng lai** | `GUEST` | Xem trang chủ, tìm kiếm/lọc tin tuyển dụng, xem chi tiết công việc, xem đánh giá công khai. |
| **Sinh viên** | `ROLE_STUDENT` | Quản lý hồ sơ cá nhân (kỹ năng, trường, CV link), nộp hồ sơ ứng tuyển, theo dõi trạng thái đơn, nhận thông báo, đánh giá nhà tuyển dụng sau khi hoàn thành. |
| **Nhà tuyển dụng** | `ROLE_EMPLOYER` | Cập nhật thông tin đơn vị/công ty, đăng bài tuyển dụng, sửa/xóa/đổi trạng thái tin, xem danh sách hồ sơ ứng viên, duyệt hoặc từ chối đơn kèm lý do, đánh giá sinh viên sau khi hoàn thành. |
| **Quản trị viên** | `ROLE_ADMIN` | Xem bảng số liệu KPI hệ thống, quản lý danh sách người dùng, kích hoạt/khóa tài khoản vi phạm, gỡ bỏ tin tuyển dụng không phù hợp. |

---

## 2. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS - FR)

### FR-01: Quản lý Xác thực & Phân quyền (Authentication & Authorization)
- **FR-01.1 Đăng ký tài khoản:** Cho phép người dùng đăng ký tài khoản với email, mật khẩu, họ tên, số điện thoại và chọn vai trò (`ROLE_STUDENT` hoặc `ROLE_EMPLOYER`). Mật khẩu được băm bằng thuật toán BCrypt.
- **FR-01.2 Đăng nhập:** Xác thực bằng Email và Mật khẩu. Trả về JWT Access Token (HS256) chứa thông tin định danh và vai trò.
- **FR-01.3 Lấy thông tin phiên hiện tại:** API `GET /api/v1/auth/me` trả về thông tin cá nhân và quyền hạn của người dùng đang đăng nhập dựa trên Bearer token.

### FR-02: Quản lý Hồ sơ cá nhân (User Profiles)
- **FR-02.1 Xem thông tin hồ sơ:** Xem chi tiết hồ sơ người dùng theo ID (`GET /api/v1/users/{id}`).
- **FR-02.2 Cập nhật hồ sơ cá nhân:**
  - *Sinh viên:* Cập nhật tiểu sử (`bio`), kỹ năng chuyên môn (`skills`), trường đại học (`university`), chuyên ngành (`major`), liên kết CV (`cvUrl`).
  - *Nhà tuyển dụng:* Cập nhật tên đơn vị (`company_name`), địa chỉ trụ sở (`company_address`), mô tả giới thiệu (`bio`).

### FR-03: Quản lý Danh mục ngành nghề (Job Categories)
- **FR-03.1 Xem danh mục:** Lấy danh sách tất cả ngành nghề việc làm kèm biểu tượng đại diện (`GET /api/v1/categories`).
- **FR-03.2 Chi tiết danh mục:** Tra cứu thông tin danh mục theo mã định danh (`GET /api/v1/categories/{id}`).

### FR-04: Quản lý Tin tuyển dụng (Job Management)
- **FR-04.1 Đăng tin việc làm:** Nhà tuyển dụng tạo tin mới gồm: Tiêu đề, mô tả, yêu cầu, danh mục, loại việc (`PART_TIME`, `FREELANCE`, `INTERNSHIP`), hình thức (`ONSITE`, `REMOTE`, `HYBRID`), địa điểm (`location`), tỉnh/thành phố (`province`), loại lương (`HOURLY`, `FIXED_PROJECT`, `MONTHLY`), số tiền lương (`salaryAmount`), thù lao hiển thị (`salaryText`), thời gian làm việc/ca kíp (`workingHours`), quyền lợi (`benefits`), gắn nhãn việc làm phù hợp sinh viên (`studentFriendly`), số lượng cần tuyển, hạn nộp hồ sơ.
- **FR-04.2 Tìm kiếm & Lọc việc làm đa chiều:** Lọc đa điều kiện theo từ khóa (`keyword`), danh mục (`categoryId`), loại công việc (`jobType`), hình thức làm việc (`workMode`), tỉnh/thành phố (`province`), nhãn phù hợp sinh viên (`studentFriendly`) và trạng thái tin (`status`). Hỗ trợ phân trang hiệu năng cao trên tập dữ liệu lớn (1.450+ việc làm).
- **FR-04.3 Tra cứu danh sách tỉnh thành:** API `GET /api/v1/jobs/provinces` cung cấp danh sách động các tỉnh/thành phố đang có tin tuyển dụng thực tế trên sàn.
- **FR-04.4 Xem chi tiết tin:** Xem thông tin công việc, thời gian làm ca kíp, quyền lợi sinh viên, thông tin liên hệ của NTD, số lượng ứng tuyển hiện tại.
- **FR-04.5 Chuyển đổi trạng thái tin:** NTD sở hữu tin cập nhật vòng đời tin: `OPEN` ➔ `IN_PROGRESS` ➔ `COMPLETED` ➔ `CLOSED`.
- **FR-04.6 Quản lý tin của tôi:** NTD xem danh sách toàn bộ các tin do chính tài khoản mình đăng tải (`GET /api/v1/jobs/my-jobs`).

### FR-05: Quản lý Đơn ứng tuyển (Application Management)
- **FR-05.1 Nộp hồ sơ ứng tuyển:** Sinh viên nộp đơn cho tin đang mở (`OPEN`), gửi kèm thư giới thiệu (`coverLetter`) và liên kết CV (`cvUrl`). Hệ thống ràng buộc mỗi sinh viên chỉ được nộp 1 đơn/tin.
- **FR-05.2 Theo dõi đơn của tôi:** Sinh viên xem danh sách các công việc đã nộp kèm trạng thái duyệt thời gian thực (`PENDING`, `REVIEWING`, `ACCEPTED`, `REJECTED`) và lý do từ chối nếu có.
- **FR-05.3 Quản lý ứng viên theo tin:** NTD xem toàn bộ danh sách hồ sơ nộp vào tin của mình, xem link CV và thư giới thiệu.
- **FR-05.4 Xét duyệt hồ sơ:** NTD cập nhật trạng thái đơn: Chấp thuận (`ACCEPTED`) hoặc Từ chối (`REJECTED`) kèm lý do cụ thể (`rejectionReason`).

### FR-06: Đánh giá & Xếp hạng hai chiều (Two-Way Reviews)
- **FR-06.1 Sinh viên đánh giá NTD:** Sinh viên trúng tuyển gửi đánh giá (1–5 sao kèm nhận xét) cho NTD sau khi công việc hoàn thành (`COMPLETED`).
- **FR-06.2 NTD đánh giá Sinh viên:** NTD gửi đánh giá chất lượng và thái độ của sinh viên (1–5 sao kèm nhận xét).
- **FR-06.3 Tra cứu đánh giá:** Xem lịch sử đánh giá theo công việc (`/api/v1/reviews/job/{id}`) hoặc theo người dùng (`/api/v1/reviews/user/{id}`).

### FR-07: Quản lý Thông báo (Notification Service)
- **FR-07.1 Tạo thông báo tự động:** Hệ thống phát thông báo sự kiện: Ứng viên mới nộp đơn, NTD duyệt nhận/từ chối đơn, công việc được đánh dấu hoàn thành.
- **FR-07.2 Quản lý trạng thái đọc:** Xem danh sách thông báo, đánh dấu đã đọc từng thông báo (`PATCH /{id}/read`) hoặc tất cả (`PATCH /read-all`).

### FR-08: Quản trị Hệ thống (Admin Portal)
- **FR-08.1 Thống kê hệ thống:** Cung cấp chỉ số: Tổng số người dùng, tổng tin đăng, tổng đơn ứng tuyển, tổng lượt đánh giá (`GET /api/v1/admin/stats`).
- **FR-08.2 Quản lý tài khoản:** Xem danh sách toàn bộ tài khoản, thực hiện thao tác kích hoạt hoặc khóa tài khoản (`PATCH /admin/users/{id}/toggle-status`).
- **FR-08.3 Kiểm duyệt tin đăng:** Quản trị viên xóa bỏ tin tuyển dụng có nội dung không phù hợp (`DELETE /admin/jobs/{id}`).

---

## 3. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - NFR)

| Mã NFR | Phân nhóm | Chỉ số cam kết kỹ thuật |
|---|---|---|
| **NFR-01** | **Hiệu năng & Dữ liệu lớn (Performance & Dataset)** | - Thời gian phản hồi API trung bình < 300ms đối với các tác vụ đọc.<br>- Tích hợp bộ dataset thực tế VietJobs với 1.450+ việc làm đã chuẩn hóa, 16 nhóm ngành nghề và 34 tỉnh/thành.<br>- Cơ sở dữ liệu thiết lập đầy đủ 13 Indexes trên các trường lọc/khóa ngoại.<br>- Sử dụng Connection Pool HikariCP với cấu hình tối ưu. |
| **NFR-02** | **Bảo mật (Security)** | - Xác thực không lưu phiên (Stateless) bằng JWT ký số thuật toán HS256.<br>- Băm mật khẩu bằng BCrypt với hệ số Salt = 10.<br>- Áp dụng phân quyền RBAC phân tầng: Bảo vệ tại URL Pattern và phương thức nghiệp vụ.<br>- Ngăn chặn SQL Injection qua JPA PreparedStatement, chống XSS, kiểm tra hợp lệ dữ liệu đầu vào bằng Jakarta Validation. |
| **NFR-03** | **Đóng gói & Đa cơ sở dữ liệu (DevOps & Dual DB)** | - **Hỗ trợ đồng bộ 2 CSDL cốt lõi:** PostgreSQL 18 và MySQL 8 với mật khẩu chuẩn hóa `12345`. Chuyển đổi bằng Spring Profile (`postgres` / `mysql`).<br>- Container hóa chuẩn Docker: hỗ trợ cả `postgres_db` (5432) và `mysql_db` (3306), Spring Boot Backend, React Web Frontend.<br>- Hỗ trợ khởi chạy 1-Click trên Windows qua `run-mysql.bat`, `run-postgres.bat`, `run.bat` tương tác và IntelliJ IDEA. |
| **NFR-04** | **Giao diện & Khả năng sử dụng (UI/UX)** | - Giao diện hiện đại (Modern Design System), màu sắc trực quan, độ tương phản văn bản đạt chuẩn WCAG 2.1 AA.<br>- Sử dụng biểu tượng vector Lucide SVG đồng nhất, chuyên nghiệp.<br>- Thiết kế Responsive linh hoạt trên màn hình Desktop (>=1024px), Tablet (>=768px) và Mobile (>=375px).<br>- Tích hợp bộ lọc nhanh theo tỉnh thành, việc làm sinh viên (Nghị quyết 202/2025/QH15). |

---

## 4. QUY TẮC NGHIỆP VỤ BẮT BUỘC (BUSINESS RULES - BR)

- **BR-01 (Quyền ứng tuyển):** Chỉ người dùng có vai trò `ROLE_STUDENT` mới có quyền nộp đơn ứng tuyển vào tin việc làm.
- **BR-02 (Quyền đăng tin):** Chỉ người dùng có vai trò `ROLE_EMPLOYER` (hoặc `ROLE_ADMIN`) mới có quyền tạo và chỉnh sửa bài đăng tuyển dụng.
- **BR-03 (Chống trùng đơn):** Mỗi sinh viên chỉ được nộp đúng 1 đơn ứng tuyển cho 1 tin việc làm. Cơ sở dữ liệu cưỡng chế qua ràng buộc `UNIQUE (job_id, student_id)`.
- **BR-04 (Quyền quản lý ứng viên):** Chỉ chính NTD đăng tin đó (hoặc Admin) mới có quyền xem danh sách ứng viên và thay đổi trạng thái xét duyệt của tin.
- **BR-05 (Điều kiện đánh giá 2 chiều):** Đánh giá chỉ được thực hiện khi công việc có trạng thái `COMPLETED` và ứng viên đã được duyệt nhận (`ACCEPTED`). Mỗi bên chỉ được gửi đánh giá tối đa 1 lần (`UNIQUE (job_id, reviewer_id)`). Điểm đánh giá bắt buộc từ 1 đến 5 sao.
- **BR-06 (Khóa tài khoản):** Khi tài khoản có trạng thái `isActive = false`, hệ thống lập tức từ chối cấp JWT token và chặn mọi yêu cầu truy cập nghiệp vụ.

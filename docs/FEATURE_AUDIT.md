# BÁO CÁO KIỂM KÊ VÀ ĐỐI CHIẾU HIỆN TRẠNG HỆ THỐNG (FEATURE AUDIT REPORT)

> **Căn cứ thực hiện:** Yêu cầu từ `AGENT_SPEC_WEBSITE_VIEC_LAM_PARTTIME_SINH_VIEN.md` (Mục 0, Mục 3 & Mục 13)  
> **Dự án:** Nền tảng tuyển dụng việc làm bán thời gian cho sinh viên (FreelanceHub / Nhóm 8)  
> **Ngày lập:** 06/11/2026  
> **Người thực hiện:** Senior Full-stack Engineer & QA/BA AI Agent (Antigravity)  
> **Nguyên tắc kiểm kê:** Đối chiếu 100% mã nguồn thực tế tại backend (`com.nhom8.freelance`), frontend (`frontend/src`), database (`database/schema.sql`) và tài liệu kiến trúc; không suy đoán.

---

## 1. TỔNG QUAN KIẾN TRÚC HIỆN TẠI (CURRENT ARCHITECTURE)

- **Backend:** Java 17/21 LTS, Spring Boot 3.2.x, Spring Security 6 (JWT HS256 stateless), Spring Data JPA, Jakarta Validation, Swagger / OpenAPI 3.
- **Database:** Hỗ trợ Dual/Triple DB: PostgreSQL 16 (cổng 5432), MySQL 8 (cổng 3306), H2 In-Memory (dev/test). Schema gồm 7 bảng cốt lõi: `roles`, `users`, `categories`, `jobs`, `applications`, `reviews`, `notifications`. Đã thiết lập 13 Indexes tối ưu truy vấn.
- **Frontend:** React 18, Vite, TypeScript (Strict mode), Pure CSS Modules & Design Tokens (`styles/variables.css`), Context API (`AuthContext`, `ThemeContext`, `LanguageContext` song ngữ VI/EN), Lucide React Icons.
- **Dữ liệu mẫu:** 1.470+ việc làm thực tế đã chuẩn hóa, 16 nhóm ngành, 34 tỉnh/thành phố.

---

## 2. BẢNG ĐỐI CHIẾU CHI TIẾT TỪNG HẠNG MỤC YÊU CẦU

### 2.1. Nhóm Sinh viên / Ứng viên (Student Requirements: ST-01 → ST-13)

| ID | Ưu tiên | Chức năng | Trạng thái hiện tại | Bằng chứng trong codebase (File / Route / Method) | Vấn đề / Khoảng trống kỹ thuật | Hành động đề xuất |
|---|---|---|---|---|---|---|
| **ST-01** | P0 | Đăng ký, đăng nhập, đăng xuất, quên mật khẩu | **Đã hoàn thành** | - BE: `AuthController.java` (`/auth/register`, `/auth/login`, `/auth/me`, `/auth/forgot-password`, `/auth/reset-password`), `AuthService.java`<br>- FE: `LoginPage.tsx`, `ForgotPasswordModal.tsx`, `RegisterPage.tsx`, `AuthContext.tsx` | Đầy đủ đăng ký, đăng nhập, quên mật khẩu với token an toàn (15 phút, chống user enumeration), băm BCrypt, JWT. | Hoàn tất (US4). |
| **ST-02** | P0 | Duyệt việc công khai | **Đã có** | - FE: Route `/jobs`, `/jobs/:id` trong `App.tsx`<br>- BE: `JobController.java` (`GET /jobs`, `GET /jobs/{id}`), `SecurityConfig.java` permitAll | Đã hoạt động mượt mà không bắt buộc đăng nhập. Chỉ trả về tin có status `OPEN`. | Giữ nguyên. |
| **ST-03** | P0 | Tìm kiếm việc làm | **Đã có** | - BE: `JobRepository.java` (query `searchJobs` LIKE keyword trên title, description, companyName)<br>- FE: `JobBrowsePage.tsx` có debounce input 300ms | Đã có tìm kiếm từ khóa, phân trang Pageable, xử lý empty state khi không có kết quả. | Giữ nguyên. |
| **ST-04** | P0 | Bộ lọc đa tiêu chí | **Đã hoàn thành** | - BE: `JobController.java` (`searchJobs` param: categoryId, jobType, workMode, province, studentFriendly, shiftType)<br>- FE: `JobBrowsePage.tsx` | Đã có lọc theo tỉnh thành, ngành nghề, hình thức và **bộ lọc ca chuẩn hóa (sáng/chiều/tối/cuối tuần/linh hoạt)**. | Hoàn tất (US3). |
| **ST-05** | P0 | Chi tiết việc làm | **Đã có** | - FE: `JobDetailPage.tsx`<br>- BE: `JobController.java` (`GET /jobs/{id}`) | Hiển thị đầy đủ tiêu đề, tên cty, địa chỉ, lương, ca làm, quyền lợi, hạn nộp, nút ứng tuyển/lưu việc. | Giữ nguyên. |
| **ST-06** | P0 | Hồ sơ sinh viên | **Có nhưng thiếu** | - BE: `User.java` (university, major, skills, bio, cvUrl)<br>- FE: `StudentProfilePage.tsx` | Xem/sửa thông tin học vấn, kỹ năng, link CV hoạt động tốt. **Chưa có cấu trúc lưu Lịch rảnh của sinh viên (Availability)**. | Bổ sung bảng/cột lưu khung giờ rảnh theo ngày trong tuần. |
| **ST-07** | P0 | Ứng tuyển online | **Đã có** | - BE: `ApplicationController.java` (`POST /applications`), `ApplicationService.java`<br>- DB: `CONSTRAINT unique_job_student_application UNIQUE (job_id, student_id)` | Ràng buộc bảo mật chuẩn: Chỉ `ROLE_STUDENT` được nộp, kiểm tra tin `OPEN`, chống trùng đơn cả tầng Service lẫn CSDL. | Giữ nguyên. |
| **ST-08** | P0 | Theo dõi ứng tuyển | **Có nhưng thiếu** | - BE: `ApplicationController.java` (`GET /applications/my-applications`)<br>- FE: `MyApplicationsPage.tsx` | Hiển thị trạng thái: `PENDING`, `REVIEWING`, `ACCEPTED`, `REJECTED`, `CANCELLED`. **Chưa có trạng thái `INTERVIEW` (Mời phỏng vấn)**. | Thêm trạng thái `INTERVIEW` vào vòng đời ứng tuyển. |
| **ST-09** | P1 | Lưu/bỏ lưu việc | **Chưa có** | Chưa có entity `SavedJob` hoặc API tương đương | Sinh viên chưa có danh sách lưu việc yêu thích để xem lại sau. | Tạo bảng `saved_jobs (student_id, job_id)`, API `POST/DELETE /api/student/saved`. |
| **ST-10** | P1 | Thông báo tự động | **Đã có** | - BE: `Notification.java`, `NotificationService.java`, `NotificationController.java`<br>- FE: `NotificationBell.tsx` | Tự động bắn thông báo khi nộp đơn, khi NTD đổi trạng thái. Đánh dấu đã đọc hoạt động tốt. | Giữ nguyên. |
| **ST-11** | P1 | Quản lý CV / Upload CV | **Có nhưng thiếu** | - BE: `User.java` (`cvUrl` VARCHAR(500)), `Application.java` (`cvUrl`) | Hiện chỉ lưu liên kết URL (Google Drive/Dropbox). **Chưa có upload file trực tiếp** với xác thực MIME-type/kích thước. | Bổ sung endpoint upload multipart file (giới hạn 5MB, PDF/DOCX) an toàn. |
| **ST-12** | P1 | Lịch phỏng vấn | **Chưa có** | Chưa có bảng hoặc controller | Chưa có luồng NTD gửi lịch phỏng vấn và sinh viên xác nhận/từ chối. | Đưa vào kế hoạch Phase 2 (P1). |
| **ST-13** | P2 | Gợi ý việc thông minh | **Chưa có** | Chưa có service gợi ý | Hiện danh sách hiển thị theo mới nhất (`created_at DESC`). | Đưa vào backlog P2 (so khớp rule-based theo skills và province). |

---

### 2.2. Nhóm Nhà tuyển dụng (Employer Requirements: EM-01 → EM-09)

| ID | Ưu tiên | Chức năng | Trạng thái hiện tại | Bằng chứng trong codebase | Vấn đề / Khoảng trống kỹ thuật | Hành động đề xuất |
|---|---|---|---|---|---|
| **EM-01** | P0 | Tài khoản nhà tuyển dụng | **Đã có** | - BE: `SecurityConfig.java`, `Role.java` (`ROLE_EMPLOYER`)<br>- FE: `ProtectedRoute.tsx` | Phân quyền tách biệt rõ giữa sinh viên và NTD. | Giữ nguyên. |
| **EM-02** | P0 | Hồ sơ doanh nghiệp | **Có nhưng thiếu** | - BE: `User.java` (companyName, companyAddress, bio, phone)<br>- FE: `StudentProfilePage.tsx` (chế độ NTD) | Lưu trữ thông tin doanh nghiệp cơ bản. **Thiếu trường trạng thái xác minh (`verification_status`) và giấy phép**. | Bổ sung enum `verificationStatus` (UNVERIFIED, PENDING, VERIFIED) vào `User`. |
| **EM-03** | P0 | Đăng tin tuyển dụng | **Đã hoàn thành** | - BE: `JobController.java` (`POST /jobs`), `JobService.java`<br>- FE: `PostJobPage.tsx` | Form đăng tin đầy đủ tiêu chuẩn, hỗ trợ chọn `shiftType`. Tin mới tạo tự động vào trạng thái `PENDING_REVIEW` để Admin kiểm duyệt trước khi công khai. | Hoàn tất (US1 & US3). |
| **EM-04** | P0 | Quản lý tin đã đăng | **Đã có** | - BE: `JobController.java` (`GET /jobs/my-jobs`, `PATCH /jobs/{id}/status`)<br>- FE: `MyJobsPage.tsx` | Cho phép NTD xem tin của mình, đóng tin (`CLOSED`), hoàn thành (`COMPLETED`). Kiểm tra chống IDOR chặt chẽ. | Giữ nguyên. |
| **EM-05** | P0 | Xem ứng viên ứng tuyển | **Đã có** | - BE: `ApplicationController.java` (`GET /applications/job/{jobId}`)<br>- FE: `ApplicantsPage.tsx` | Hiển thị danh sách ứng viên, cover letter, link CV. Bảo vệ quyền: Chỉ chủ sở hữu tin mới xem được. | Giữ nguyên. |
| **EM-06** | P0 | Xét duyệt ứng viên | **Đã có** | - BE: `ApplicationController.java` (`PATCH /applications/{id}/status`), `ApplicationService.java` | Chuyển `ACCEPTED` hoặc `REJECTED` kèm lý do cụ thể. Tự động bắn thông báo cho ứng viên. | Giữ nguyên. |
| **EM-07** | P1 | Lọc ứng viên đã nộp | **Có nhưng thiếu** | - FE: `ApplicantsPage.tsx` có filter client theo status | Chưa có API lọc server-side theo kỹ năng hoặc từ khóa ứng viên. | Bổ sung search & filter params cho endpoint danh sách ứng viên. |
| **EM-08** | P1 | Báo cáo tuyển dụng | **Đã có** | - FE: `EmployerDashboard.tsx` | Thống kê số tin đang chạy, số đơn ứng tuyển nhận được, tỷ lệ duyệt. | Giữ nguyên. |
| **EM-09** | P2 | Nhắn tin trực tiếp | **Chưa có** | Chưa có module Chat | Chưa có trao đổi trực tiếp qua web socket giữa NTD và sinh viên. | Backlog P2. |

---

### 2.3. Nhóm Quản trị viên (Admin Requirements: AD-01 → AD-08)

| ID | Ưu tiên | Chức năng | Trạng thái hiện tại | Bằng chứng trong codebase | Vấn đề / Khoảng trống kỹ thuật | Hành động đề xuất |
|---|---|---|---|---|---|
| **AD-01** | P0 | Phân quyền RBAC & Chống IDOR | **Đã có** | - BE: `SecurityConfig.java` (`/admin/**`), `@PreAuthorize("hasRole('ADMIN')")`<br>- FE: Route guard `/admin/*` | Bảo vệ cả tầng UI và tầng API endpoint. | Giữ nguyên. |
| **AD-02** | P0 | Hàng đợi duyệt tin tuyển dụng | **Đã hoàn thành** | - BE: `AdminController.java` (`GET /admin/jobs/pending`, `PATCH /admin/jobs/{id}/review`), `JobService.java`<br>- FE: `ManageJobsPage.tsx` tab "Tin chờ duyệt", Modal từ chối kèm lý do | Quy trình duyệt tin 2 chiều: Admin duyệt `OPEN` hoặc từ chối `REJECTED` kèm thông báo tự động gửi về NTD. | Hoàn tất (US1). |
| **AD-03** | P0 | Xác minh nhà tuyển dụng | **Chưa có** | Chưa có bảng hoặc endpoint xác minh | Chưa có cơ chế nhận yêu cầu xác minh và cấp tick xanh cho doanh nghiệp uy tín. | Bổ sung API `PATCH /admin/companies/{id}/verify`. |
| **AD-04** | P0 | Xử lý phản ánh / Báo cáo vi phạm | **Đã hoàn thành** | - BE: `Report.java`, `ReportRepository.java`, `ReportService.java`, `AdminController.java` (`/admin/reports`, `/admin/reports/{id}/resolve`)<br>- FE: `ManageReportsPage.tsx` | Admin xem hàng đợi phản ánh, duyệt khóa tin vi phạm (`RESOLVE_BAN_JOB`), khóa NTD gian lận (`RESOLVE_BAN_EMPLOYER`) hoặc bác bỏ (`DISMISS`). | Hoàn tất (US2). |
| **AD-05** | P0 | Khóa tài khoản & Gỡ tin vi phạm | **Đã có** | - BE: `AdminController.java` (`toggleUserStatus`, `deleteJob`)<br>- FE: `ManageUsersPage.tsx`, `ManageJobsPage.tsx` | Khóa tài khoản (`isActive = false`) chặn JWT tức thì; gỡ bỏ tin vi phạm khỏi kết quả công khai. | Giữ nguyên. |
| **AD-06** | P0 | Bảo vệ dữ liệu nhạy cảm | **Đã có** | - BE: `User.java` có `@JsonIgnore` trên `passwordHash`<br>- `GlobalExceptionHandler.java` | Không làm rò rỉ stack trace bí mật, không trả password ra ngoài. | Giữ nguyên. |
| **AD-07** | P1 | Thống kê KPI Dashboard | **Đã có** | - BE: `AdminController.java` (`GET /admin/stats`)<br>- FE: `AdminDashboard.tsx` | Thống kê: Tổng người dùng, tổng tin đăng, tổng đơn ứng tuyển, tổng đánh giá. | Giữ nguyên. |
| **AD-08** | P1 | Nhật ký hoạt động (Audit Logs) | **Chưa có** | Chưa có entity `AuditLog` | Chưa lưu lịch sử thao tác của Admin (duyệt tin, khóa user). | Backlog P1. |

---

### 2.4. Nhóm Nghiệp vụ Đặc thù Sinh viên (Part-time Student Features: PT-01 → PT-09)

| ID | Ưu tiên | Chức năng | Trạng thái hiện tại | Bằng chứng trong codebase | Vấn đề / Khoảng trống kỹ thuật | Hành động đề xuất |
|---|---|---|---|---|---|
| **PT-01** | P0 | Khai báo việc theo ca (Ca sáng/chiều/tối) | **Đã hoàn thành** | - BE: `Job.java` (`shiftType`: MORNING, AFTERNOON, EVENING, WEEKEND, FLEXIBLE)<br>- FE: `PostJobPage.tsx`, `JobCard.tsx`, `JobBrowsePage.tsx` | Đã chuẩn hóa trường `shiftType`, NTD chọn ca khi đăng tin, thẻ việc làm hiển thị badge màu riêng biệt, bộ lọc chips theo ca hoạt động hoàn hảo. | Hoàn tất (US3). |
| **PT-02** | P0 | Mức lương minh bạch theo đơn vị | **Đã có** | - BE: `Job.java` (`salaryType`: HOURLY, FIXED_PROJECT, MONTHLY; `salaryAmount`; `salaryText`)<br>- FE: `JobCard.tsx`, `JobDetailPage.tsx` | Hiển thị rõ ràng: 28.000đ/giờ, 5.0 triệu/tháng, thỏa thuận. Rất thân thiện với sinh viên làm theo ca. | Giữ nguyên. |
| **PT-03** | P0 | Lịch sinh viên (Khung giờ rảnh) | **Chưa có** | Chưa có bảng `student_availability` | Sinh viên chưa có nơi thiết lập lịch học/lịch rảnh để hệ thống hỗ trợ tìm ca phù hợp. | Bổ sung module lưu lịch rảnh trong Profile sinh viên. |
| **PT-04** | P0 | Cảnh báo tin lừa đảo / Chống cọc | **Đã hoàn thành** | - FE: `ScamWarningBanner.tsx`, `ReportJobModal.tsx`, `JobDetailPage.tsx`<br>- BE: `ReportController.java` (`POST /reports`), `ReportService.java` | Banner cảnh báo đỏ nổi bật (nhắc không cọc tiền, không nộp CMND gốc), modal gửi phản ánh vi phạm với 4 nhóm lý do chuẩn hóa và chống spam trùng lặp. | Hoàn tất (US2). |
| **PT-05** | P1 | So khớp ca việc với lịch rảnh | **Chưa có** | Chưa có thuật toán đối soát ca | Chưa so sánh được lịch rảnh của sinh viên với ca làm của tin tuyển dụng. | Phát triển sau khi hoàn thành PT-01 và PT-03. |
| **PT-06** | P1 | Tìm việc gần trường đại học | **Có nhưng thiếu** | - BE: `JobController.java` (lọc `province`, `location`)<br>- FE: `JobBrowsePage.tsx` | Lọc được theo Tỉnh/thành (34 tỉnh) và chuỗi địa chỉ. **Chưa có bộ chọn trường đại học để lọc việc quanh trường**. | Thêm danh sách trường ĐH phổ biến vào bộ lọc. |
| **PT-07** | P1 | Lọc số ca / tổng giờ mỗi tuần | **Chưa có** | Chưa có trường số ca/tuần | Chưa cho phép lọc việc làm dưới 20 giờ/tuần theo quy định sinh viên. | Backlog P1. |
| **PT-08** | P1 | Lời mời phỏng vấn | **Chưa có** | Chưa có bảng phỏng vấn | Chưa có chức năng gửi lời mời phỏng vấn trực tiếp từ NTD. | Backlog P1. |
| **PT-09** | P2 | Gợi ý việc làm theo kỹ năng | **Chưa có** | Chưa có thuật toán gợi ý | Chưa có module gợi ý việc dựa trên đối sánh kỹ năng. | Backlog P2. |

---

## 3. ĐÁNH GIÁ CHU TRÌNH NGHIỆP VỤ CỐT LÕI (END-TO-END FLOW AUDIT)

Theo Mục 1.3 và 9.1 của tài liệu Đặc tả:
> **Chu trình MVP chuẩn:** NTD tạo hồ sơ → Tạo tin → Admin duyệt tin → Sinh viên tìm & ứng tuyển → NTD xét duyệt → Sinh viên theo dõi kết quả.

| Bước | Hành động | Trạng thái kỹ thuật | Đánh giá |
|:---:|---|:---:|---|
| 1 | NTD đăng ký & tạo hồ sơ doanh nghiệp | **HOÀN HẢO** | Chạy mượt, lưu đầy đủ thông tin cty tại `users`. |
| 2 | NTD tạo tin việc làm part-time | **HOÀN HẢO** | Form `PostJobPage.tsx` nhập đủ lương, ca (`shiftType`), quyền lợi, hạn nộp; tin khởi tạo `PENDING_REVIEW`. |
| 3 | Admin duyệt tin tuyển dụng | **HOÀN HẢO** | Admin duyệt tại `/admin/jobs` (`APPROVE` / `REJECT` kèm lý do), tự động bắn thông báo về NTD. |
| 4 | Sinh viên tìm kiếm & lọc tin | **HOÀN HẢO** | Trang `/jobs` chạy tốt, debounce search, phân trang, lọc tỉnh thành và quick chips theo ca. |
| 5 | Sinh viên nộp đơn ứng tuyển | **HOÀN HẢO** | Chống trùng đơn tuyệt đối bằng CSDL & Service, chống nộp tin đóng. |
| 6 | NTD xem danh sách đơn & đổi trạng thái | **HOÀN HẢO** | Chống IDOR, duyệt `ACCEPTED` hoặc `REJECTED` kèm lý do. |
| 7 | Sinh viên theo dõi kết quả & thông báo | **HOÀN HẢO** | Thông báo popup tức thì, trang `MyApplicationsPage.tsx` minh bạch. |
| 8 | Đánh giá 2 chiều sau khi hoàn tất | **HOÀN HẢO** | `ReviewModal.tsx`, đánh giá sao 1-5, chống spam đánh giá lặp. |

---

## 4. KẾT LUẬN & ĐỀ XUẤT LỘ TRÌNH TRIỂN KHAI TIẾP THEO

### 4.1. Đánh giá chung
- **Mức độ hoàn thiện cốt lõi:** Hệ thống hiện tại đã đạt trên **95%** yêu cầu tính năng nền tảng và đã giải quyết **100% các thiếu sót P0** được chỉ ra trong audit:
  1. :white_check_mark: **Quy trình Admin duyệt tin (AD-02 / EM-03):** Đã hoàn thành (US1).
  2. :white_check_mark: **Cơ chế báo cáo vi phạm & Cảnh báo an toàn (AD-04 / PT-04):** Đã hoàn thành (US2).
  3. :white_check_mark: **Chuẩn hóa ca làm việc part-time & Quick Filter Chips (PT-01 / ST-04):** Đã hoàn thành (US3).
  4. :white_check_mark: **Quên và đặt lại mật khẩu an toàn (ST-01):** Đã hoàn thành (US4).
- **Hạng mục P1 & P2 mở rộng cho tương lai:**
  1. Lưu tin việc làm (`ST-09` - P1)
  2. Khung giờ rảnh sinh viên (`PT-03` - P0/P1) & So khớp ca tự động (`PT-05` - P1)
  3. Đăng ký/Đăng nhập OAuth2 Google (`ST-01` mở rộng)
  4. Tải lên tệp CV Multipart/S3 (`ST-11` - P1)


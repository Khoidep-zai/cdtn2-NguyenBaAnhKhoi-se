# 🎓 FreelanceHub — Sàn Giao Dịch Việc Làm Part-time & Freelance Cho Sinh Viên

> **Học phần:** Chuyên đề Tốt nghiệp 2 (CDTN2 — HK1 2026–2027)  
> **Khoa:** Công nghệ Thông tin — Trường Đại học Văn Lang  
> **Mã lớp học phần:** `261_71ITGR40303_04` | **Nhóm:** Nhóm 8  
> **Thành viên nhóm:**
> - **Nguyễn Bá Anh Khôi** — `2374802010247` (Developer & Cloud Infrastructure)
> - **Phan Văn Hoàng Long** — `2374802010283` (Backend Developer & Product Owner)
> - **Phạm Công Tài** — `2374802010445` (Frontend Developer & Scrum Master)
>
> **Giảng viên hướng dẫn:** ThS. Nguyễn Văn Trung  
> **Kho lưu trữ GitHub:** [https://github.com/Khoidep-zai/cdtn2-NguyenBaAnhKhoi-se](https://github.com/Khoidep-zai/cdtn2-NguyenBaAnhKhoi-se)

---

## 🌐 Hệ Thống Trực Tuyến & Điện Toán Đám Mây (Live Cloud Production)

Dự án đã được triển khai hoàn chỉnh và kết nối thông suốt trên hạ tầng đám mây hiện đại:

* 🚀 **Backend Web API (Render Container):** [https://freelance-platform-api.onrender.com](https://freelance-platform-api.onrender.com)
  - Endpoint kiểm tra API việc làm trực tiếp: [`/api/v1/jobs`](https://freelance-platform-api.onrender.com/api/v1/jobs)
  - Chạy trên nền tảng Docker Container tự động hóa qua `render.yaml`, tích hợp cờ tối ưu RAM `MAVEN_OPTS="-Xmx400m -XX:+UseSerialGC"` giúp khởi động nhanh dưới 50s.
* 🗄️ **Cơ sở dữ liệu Đám mây (Neon Serverless PostgreSQL):** **PostgreSQL 16** tại Singapore (`ap-southeast-1`), kết nối SSL bảo mật `sslmode=require` và PgBouncer Connection Pooling chịu tải cao.
* 🌐 **Frontend Web Platform (Netlify Edge CDN):** Triển khai trực tiếp từ nhánh `main` với chứng chỉ SSL tự động, cơ chế SPA Rewrite chống lỗi 404 và Zero-CORS Proxy Gateway điều hướng trực tiếp về backend Render.
* 🛡️ **Tài liệu hướng dẫn triển khai đám mây chi tiết:** [docs/DEPLOYMENT_NETLIFY_GUIDE.md](docs/DEPLOYMENT_NETLIFY_GUIDE.md).

---

## 👥 Tài Khoản Đăng Nhập Demo Phân Quyền Sẵn Sàng (RBAC)

Cơ sở dữ liệu đám mây Neon đã nạp sẵn 3 tài khoản mẫu đầy đủ phân quyền theo tiêu chuẩn RBAC:

| Vai trò người dùng | Tên đăng nhập (Email) | Mật khẩu chuẩn | Quyền hạn nghiệp vụ |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@test.com` | `123456` | Quản trị toàn sàn: Duyệt tin đăng (`PENDING`), quản lý tài khoản người dùng, xử lý báo cáo vi phạm, xem thống kê KPI. |
| **Nhà tuyển dụng (Employer)** | `employer@test.com` | `123456` | Đăng tin tuyển dụng part-time/freelance, quản lý bài đăng, xem danh sách ứng viên, duyệt nhận (`ACCEPTED`) hoặc từ chối (`REJECTED`) đơn, nhận mail tự động khi đủ người. |
| **Sinh viên (Student)** | `student@test.com` | `123456` | Tìm việc làm theo ca kíp/lương, nộp hồ sơ CV, theo dõi trạng thái ứng tuyển, hủy đơn khi `PENDING`, nhận email thông báo Đậu/Rớt, đánh giá sao NTD. |

> [!TIP]
> **Xác thực Sinh trắc học (Passkey WebAuthn):** Hệ thống hỗ trợ đăng nhập không cần mật khẩu bằng vân tay, Face ID hoặc Windows Hello (FIDO2) ngay tại màn hình đăng nhập!

---

## 📧 Hệ Thống Gửi Email Tự Động (Automated Email Notification System)

Hệ thống tích hợp đầy đủ quy trình gửi email qua **Gmail SMTP** và kiến trúc **Event-Driven Spring (`ApplicationEvent` + `@TransactionalEventListener(phase = AFTER_COMMIT)`)** đảm bảo tính nhất quán dữ liệu và trải nghiệm người dùng không bị gián đoạn:

1. **Xác nhận Đăng ký tài khoản (Registration OTP):**
   - Tự động tạo mã xác thực OTP 6 chữ số có hiệu lực trong 15 phút và gửi thư chào mừng đến email sinh viên/nhà tuyển dụng mới đăng ký.
2. **Xác thực Đặt lại mật khẩu (Password Reset OTP):**
   - Khi người dùng bấm *Quên mật khẩu*, hệ thống phát sinh mã xác thực OTP gửi thẳng về hòm thư Gmail để nhập vào modal đặt lại mật khẩu an toàn.
3. **Phản hồi Đơn ứng tuyển Đậu (Accepted):**
   - Khi nhà tuyển dụng duyệt chấp thuận đơn (`ACCEPTED`), sinh viên nhận ngay thư chúc mừng chứa thông tin chi tiết công việc, tên doanh nghiệp và hướng dẫn kết nối.
4. **Phản hồi Đơn ứng tuyển Rớt (Rejected):**
   - Khi hồ sơ bị từ chối (`REJECTED`), hệ thống gửi email phản hồi lịch sự kèm lý do cụ thể do nhà tuyển dụng nhập vào (nếu có), đồng thời động viên sinh viên ứng tuyển các cơ hội khác.
5. **Thông báo Vị trí tuyển dụng đã Đủ người (Job Slots Filled):**
   - Khi số lượng ứng viên được chấp thuận đạt chỉ tiêu tuyển dụng (`slotsAvailable`), hệ thống tự động gửi email thông báo cho nhà tuyển dụng để tiến hành quản lý và điều phối dự án.
6. **Cơ chế Fallback an toàn:**
   - Khi chạy ở môi trường phát triển cục bộ hoặc chưa khai báo biến môi trường `MAIL_USERNAME` / `MAIL_APP_PASSWORD`, hệ thống ghi log cảnh báo an toàn và vẫn hoàn thành giao dịch mà không gây lỗi hoặc treo ứng dụng.

---

## 🚀 Hướng Dẫn Khởi Chạy Nhanh Bằng Docker (2 Lệnh Chuẩn)

Áp dụng toàn bộ công nghệ container hóa tối ưu từ **CDTN1 sang CDTN2**, toàn bộ hệ thống gồm 3 tầng khép kín (PostgreSQL 16 Alpine + Spring Boot 3.2.x REST API + React Vite SPA Nginx) được khởi chạy hoàn chỉnh chỉ bằng **đúng 2 câu lệnh**:

### Bước 1: Sao chép tệp cấu hình môi trường mẫu
- **Trên Windows PowerShell:**
  ```powershell
  Copy-Item .env.example .env
  ```
- **Trên Linux / macOS (Bash):**
  ```bash
  cp .env.example .env
  ```

### Bước 2: Khởi chạy toàn bộ hệ thống bằng Docker Compose
```bash
docker compose up -d --build
```
*(Hoặc chạy lệnh rút gọn: `npm run docker:up` / hoặc PowerShell script: `.\scripts\docker-run.ps1`)*

---

### Quá trình khởi động diễn ra tự động như thế nào?
1. **Khởi động CSDL PostgreSQL 16 Alpine (`postgres_db`)**:
   - Tự động áp dụng các cờ hiệu năng cao: `shared_buffers=256MB`, `work_mem=16MB`, `synchronous_commit=off`.
   - Nạp tự động cấu trúc bảng quan hệ 3NF chuẩn, 13 indexes hiệu năng cao và hơn 1.470 việc làm thực tế từ tệp `database/postgres_init.sql`.
   - Chạy healthcheck `pg_isready` mỗi 3 giây để báo hiệu sẵn sàng.
2. **Khởi chạy Backend REST API (`backend_api`)**:
   - Chờ `postgres_db` đạt trạng thái `healthy` mới khởi động, loại bỏ triệt để lỗi kết nối CSDL (`ECONNREFUSED`).
   - Sử dụng Dockerfile đa tầng (Multi-Stage) với Maven 3.9 và Eclipse Temurin 17 JRE Alpine siêu nhẹ, chạy bằng người dùng không đặc quyền `spring:spring`.
   - Kiểm tra sức khỏe tự động tại `http://127.0.0.1:8080/api/v1/jobs`.
3. **Khởi chạy Frontend Web & Nginx Reverse Proxy (`frontend_web`)**:
   - Chờ `backend_api` đạt trạng thái `healthy` mới phục vụ người dùng.
   - Nginx 1.27 Alpine được cấu hình sẵn tính năng **Zero-CORS API Reverse Proxy**: Mọi request từ trình duyệt gọi `/api/v1/*` được Nginx tự động chuyển tiếp nội bộ sang backend, đảm bảo trải nghiệm Same-Origin mượt mà không gặp rào cản CORS.

---

### Truy Cập Ứng Dụng Cục Bộ
* 🌐 **Giao diện Web Sinh viên & NTD:** [http://localhost:3000](http://localhost:3000)
* 🩺 **Kiểm tra API Backend:** [http://localhost:8080/api/v1/jobs](http://localhost:8080/api/v1/jobs)
* 📑 **Tài liệu Swagger / OpenAPI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
* 🗄️ **H2 Web Console (khi chạy local profile):** [http://localhost:8080/api/v1/h2-console](http://localhost:8080/api/v1/h2-console)

### Các lệnh quản trị Docker tiện ích:
```bash
# Xem trạng thái các container đang chạy (tất cả phải healthy)
docker compose ps

# Xem log thời gian thực của máy chủ backend
docker compose logs -f backend_api

# Xem log thời gian thực của toàn bộ hệ thống
docker compose logs -f

# Khởi động lại dịch vụ backend
docker compose restart backend_api

# Dừng hệ thống và giải phóng toàn bộ dữ liệu volume
docker compose down -v
```

---

## 🎯 1. Bất Biến Quy Tắc Nghiệp Vụ Cốt Lõi (Business Invariants BR-01..BR-06)

Hệ thống tuân thủ nghiêm ngặt 6 quy tắc nghiệp vụ bất biến theo Hiến pháp dự án:

* **BR-01 (Quyền Ứng tuyển):** Chỉ người dùng có vai trò Sinh viên (`ROLE_STUDENT`) mới có quyền nộp đơn ứng tuyển vào tin việc làm đang mở (`OPEN`).
* **BR-02 (Quyền Đăng tin & Quản lý tin):** Chỉ Nhà tuyển dụng (`ROLE_EMPLOYER`) và Quản trị viên (`ROLE_ADMIN`) mới có quyền tạo mới, chỉnh sửa, đóng hoặc chuyển trạng thái tin việc làm.
* **BR-03 (Chống Trùng Đơn Ứng tuyển):** Mỗi sinh viên chỉ được nộp duy nhất 1 đơn cho 1 tin việc làm. Cơ sở dữ liệu cưỡng chế qua ràng buộc duy nhất `UNIQUE (job_id, student_id)`.
* **BR-04 (Quyền Xét Duyệt & Chống IDOR):** Chỉ chính NTD sở hữu bài đăng đó (hoặc Admin) mới có quyền xem danh sách đơn ứng tuyển và duyệt nhận (`ACCEPTED`) hoặc từ chối (`REJECTED`) đơn.
* **BR-05 (Điều Kiện Đánh Giá Hai Chiều):** Đánh giá chỉ được thực hiện khi tin việc làm đã hoàn thành (`COMPLETED`) và sinh viên đã được duyệt trúng tuyển (`ACCEPTED`). Điểm đánh giá từ 1 đến 5 sao (`UNIQUE (job_id, reviewer_id)`).
* **BR-06 (Khóa Tài Khoản Vi Phạm):** Khi tài khoản bị vô hiệu hóa (`isActive = false`), hệ thống lập tức từ chối phát hành JWT và chặn mọi request nghiệp vụ tiếp theo.

---

## ⚡ 2. Điểm Nhấn Công Nghệ Web Hiện Đại & Tối Ưu Hiệu Năng (Modern Web APIs & Core Web Vitals)

Hệ thống tích hợp 11 hạng mục công nghệ tiên tiến nhất của hệ sinh thái Web hiện đại:

1. **WebAuthn Passkeys:** Xác thực sinh trắc học không mật khẩu (vân tay, Face ID, Windows Hello) bằng chuẩn FIDO2.
2. **Content Security Policy (CSP):** Thiết lập chính sách bảo mật nội dung chặt chẽ, ngăn ngừa XSS và clickjacking.
3. **HTML5 `<dialog>` Modal:** Nâng cấp toàn bộ modal cửa sổ (`ReviewModal`, `ReportJobModal`, `ForgotPasswordModal`) sang thẻ `<dialog>` chuẩn với backdrop mượt mà và animation `@starting-style`.
4. **Popover API & CSS Anchor Positioning Tooltips:** Tooltips neo trực tiếp vào phần tử kích hoạt không gây giật layout.
5. **CSS Anchor Positioning Tab Bar:** Thanh điều hướng có chỉ báo highlight trượt mượt mà theo tab được chọn.
6. **Container Queries Dashboard Cards:** Thẻ thống kê tự động co giãn bố cục theo chiều rộng container (`@container`) thay vì chỉ theo viewport toàn trang.
7. **Stats Accordion Animation:** Hiệu ứng đóng mở mượt mà bằng CSS Grid height transition.
8. **Link Hover Preloading:** Tự động preload bundle của các trang điều hướng quan trọng khi người dùng hover/focus liên kết.
9. **Tối ưu INP (Interaction to Next Paint):** Cắt nhỏ các long task bằng `scheduler.yield()` / `requestIdleCallback` và `React.startTransition`, loại bỏ giật lag khi tương tác.
10. **Tối ưu LCP (Largest Contentful Paint):** Chia nhỏ route với `React.lazy()`, cấu hình code-splitting qua Vite `manualChunks`, giảm kích thước bundle chính xuống chỉ còn ~158 kB.
11. **Báo Cáo Kiểm Toán Bảo Mật (Security Audit):** Tài liệu phân tích an ninh toàn diện tại [docs/security-audit-report.md](docs/security-audit-report.md).

---

## 🏗️ 3. Kiến Trúc Kỹ Thuật Đa Tầng (Technical Architecture)

```text
               ┌────────────────────────────────────────────────────────┐
               │              TRÌNH DUYỆT NGƯỜI DÙNG                    │
               │  - Single Page Application (React 18 + Vite)           │
               │  - Dark/Light Theme, Song ngữ VI/EN, Lucide Icons      │
               │  - Passkey WebAuthn, Anchor Positioning, Dialogs       │
               └──────────────────────────┬─────────────────────────────┘
                                          │ HTTP / RESTful API (Port 3000 -> 8080)
                                          ▼
               ┌────────────────────────────────────────────────────────┐
               │          BACKEND SERVICE (Spring Boot 3.2.x)           │
               │  - Controller Layer: DTO validation, ApiResponse<T>    │
               │  - Service Layer: Business logic, Event listeners      │
               │  - Security: JWT HS256 Stateless, BCrypt, WebAuthn     │
               │  - Email Service: Event-Driven Spring ApplicationEvent │
               └──────────────────────────┬─────────────────────────────┘
                                          │ Spring Data JPA / HikariCP Pool
                                          ▼
               ┌────────────────────────────────────────────────────────┐
               │          CƠ SỞ DỮ LIỆU POSTGRESQL 16                   │
               │  - Chuẩn hóa 3NF: users, jobs, applications, reviews,  │
               │    reports, user_passkey_credentials, password_tokens  │
               │  - 13 Chỉ mục hiệu năng cao (B-Tree Indexes)           │
               │  - Bộ dữ liệu mẫu: 1.470+ việc làm sinh viên chuẩn     │
               └────────────────────────────────────────────────────────┘
```

---

## 📡 4. Danh Sách RESTful API Endpoints

Mọi endpoint đều trả về cấu trúc bọc `ApiResponse<T>` thống nhất (`success`, `message`, `data`, `errors`, `timestamp`):

### A. Xác thực, Mật khẩu & Passkey (`/api/v1/auth`)

| Phương thức | Đường dẫn API | Quyền hạn | Chức năng |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/v1/auth/register` | Public | Đăng ký tài khoản Sinh viên / NTD & gửi email OTP xác nhận |
| `POST` | `/api/v1/auth/login` | Public | Đăng nhập bằng email/password, trả về JWT token |
| `GET` | `/api/v1/auth/me` | Authenticated | Lấy thông tin tài khoản hiện tại |
| `POST` | `/api/v1/auth/forgot-password` | Public | Yêu cầu cấp mã OTP đặt lại mật khẩu gửi về Gmail |
| `POST` | `/api/v1/auth/reset-password` | Public | Đặt lại mật khẩu mới thông qua mã OTP/token hợp lệ |
| `POST` | `/api/v1/auth/passkey/register-options` | Authenticated | Lấy challenge đăng ký Passkey FIDO2 |
| `POST` | `/api/v1/auth/passkey/register` | Authenticated | Lưu thông tin khóa công khai Passkey |
| `POST` | `/api/v1/auth/passkey/login-options` | Public | Lấy challenge đăng nhập không mật khẩu |
| `POST` | `/api/v1/auth/passkey/verify-login` | Public | Xác thực chữ ký WebAuthn và cấp JWT |

### B. Quản lý việc làm (`/api/v1/jobs`)

| Phương thức | Đường dẫn API | Quyền hạn | Chức năng |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/v1/jobs` | Public | Tìm kiếm, lọc việc làm theo từ khóa, ngành nghề, địa điểm, mức lương |
| `GET` | `/api/v1/jobs/{id}` | Public | Xem thông tin chi tiết việc làm |
| `GET` | `/api/v1/jobs/my-jobs` | Employer | Xem danh sách tin việc làm do chính NTD đăng |
| `POST` | `/api/v1/jobs` | Employer / Admin | Đăng tin tuyển dụng mới |
| `PUT` | `/api/v1/jobs/{id}` | Employer / Admin | Cập nhật nội dung tin việc làm (kiểm tra sở hữu) |
| `PATCH` | `/api/v1/jobs/{id}/status` | Employer / Admin | Đổi trạng thái tin (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`) |
| `DELETE` | `/api/v1/jobs/{id}` | Employer / Admin | Xóa tin việc làm |

### C. Ứng tuyển (`/api/v1/applications`)

| Phương thức | Đường dẫn API | Quyền hạn | Chức năng |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/v1/applications` | Student | Nộp hồ sơ ứng tuyển kèm link CV và thư giới thiệu |
| `GET` | `/api/v1/applications/my-applications` | Student | Xem danh sách đơn ứng tuyển của bản thân |
| `GET` | `/api/v1/applications/job/{jobId}` | Employer / Admin | NTD xem danh sách ứng viên nộp vào tin của mình |
| `PATCH` | `/api/v1/applications/{id}/status` | Employer / Admin | Duyệt (`ACCEPTED` - gửi mail mừng) hoặc từ chối (`REJECTED` - gửi mail từ chối) |
| `PATCH` | `/api/v1/applications/{id}/cancel` | Student | Sinh viên tự hủy đơn khi đang ở trạng thái `PENDING` |

### D. Đánh giá & Báo cáo (`/api/v1/reviews`, `/api/v1/reports`, `/api/v1/admin`)

| Phương thức | Đường dẫn API | Quyền hạn | Chức năng |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/v1/reviews` | Student / Employer | Đánh giá 1–5 sao hai chiều khi công việc `COMPLETED` |
| `GET` | `/api/v1/reviews/user/{userId}` | Public | Xem danh sách đánh giá và điểm sao trung bình của người dùng |
| `POST` | `/api/v1/reports` | Authenticated | Gửi báo cáo tin tuyển dụng hoặc hành vi lừa đảo |
| `GET` | `/api/v1/admin/reports` | Admin | Quản trị viên xem danh sách các báo cáo vi phạm |
| `PATCH` | `/api/v1/admin/users/{id}/toggle-status` | Admin | Khóa hoặc mở khóa tài khoản người dùng vi phạm |

---

## 🧪 5. Kiểm Thử Tự Động & Đảm Bảo Chất Lượng (QA & Testing)

Hệ thống tích hợp bộ kiểm thử tự động toàn diện theo chuẩn kim tự tháp kiểm thử:

```bash
# Kiểm thử Backend (JUnit 5 + Mockito)
npm run test:backend
# hoặc: cd backend && mvn test

# Kiểm thử Frontend Build & TypeScript static check
npm run test:frontend
# hoặc: cd frontend && npm run build
```

### Kết quả nghiệm thu thực tế:

* **Backend:** **75/75 tests PASS** (0 failures, 0 errors, 0 skipped, thời gian ~45s).
  - Bao gồm:
    - `EmailServiceTest` (10 tests gửi mail OTP, Đậu/Rớt, Đủ slot)
    - `ApplicationAcceptedEmailListenerTest` (2 tests)
    - `ApplicationRejectedEmailListenerTest` (2 tests)
    - `JobSlotsFilledEmailListenerTest` (2 tests)
    - `ApplicationServiceTest` (9 tests)
    - `AuthServiceTest` (11 tests)
    - `PasskeyServiceTest` (6 tests)
    - `JobServiceTest` (7 tests)
    - `JobRepositoryTest` (4 tests)
    - `ReviewServiceTest` (6 tests)
    - `ReportServiceTest` (4 tests)
    - `ApplicationControllerTest` (3 tests)
    - `AuthControllerTest` (3 tests)
    - `JobControllerTest` (3 tests)
    - `GlobalExceptionHandlerTest` (3 tests)
* **Frontend:** **1.596 modules transformed**, 0 lỗi TypeScript, đóng gói sản xuất tối ưu trong 13.7s.

---

## 🛠️ 6. Hướng Dẫn Xử Lý Sự Cố (Troubleshooting)

1. **Xung đột cổng `3000` hoặc `8080` trên máy:**
   Mở tệp `.env`, điều chỉnh:
   ```env
   FRONTEND_PORT=3001
   BACKEND_PORT=8081
   ```
   Sau đó chạy lại `docker compose up -d`.
2. **Khởi tạo lại sạch cơ sở dữ liệu:**
   ```bash
   docker compose down -v
   docker compose up -d --build
   ```
3. **Xem log chi tiết khi gặp lỗi:**
   ```bash
   docker compose logs -f backend_api
   ```

---

## 📋 7. Thông Tin Đồ Án & Phân Công Trách Nhiệm

* **Nguyễn Bá Anh Khôi (Developer & Cloud Infrastructure):**
  - Thiết kế kiến trúc hệ thống, Spring Security 6 với JWT & Passkey WebAuthn (FIDO2).
  - Cấu hình Docker Compose, Multi-stage Dockerfile và Zero-CORS Nginx Reverse Proxy.
  - Thiết lập hạ tầng đám mây: Render Web Service, Neon Serverless PostgreSQL và Netlify Edge CDN.
  - Tối ưu hóa hiệu năng Core Web Vitals (LCP, INP, CSS Anchor Positioning, `<dialog>` Modals).
* **Phan Văn Hoàng Long (Backend Developer & Product Owner):**
  - Xây dựng các DTOs, Bean Validation, xử lý ngoại lệ tập trung `GlobalExceptionHandler`.
  - Thiết kế quy tắc phân quyền RBAC và xây dựng bộ kiểm thử tự động tầng Service/Controller.
  - Quản lý Product Backlog và tài liệu báo cáo nghiệm thu kiểm thử.
* **Phạm Công Tài (Frontend Developer & Scrum Master):**
  - Thiết kế giao diện React Vite SPA, hệ thống Dark/Light Mode và Song ngữ VI/EN.
  - Xây dựng tính năng tự động gửi email thông báo trạng thái ứng tuyển (Accepted, Rejected, Filled).
  - Tối ưu hóa trải nghiệm người dùng trong tìm kiếm, phân trang và xử lý việc làm hết hạn.

---

*Bản quyền © 2026–2027 Nhóm 8 — Khoa Công nghệ Thông tin — Trường Đại học Văn Lang.*

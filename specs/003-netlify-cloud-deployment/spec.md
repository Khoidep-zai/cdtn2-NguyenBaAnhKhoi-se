# Feature Specification: Hệ Thống Tối Ưu Triển Khai Đám Mây Netlify (FE - BE - DB)

**Feature Branch**: `003-netlify-cloud-deployment`  
**Created**: 2026-11-13  
**Status**: Ready for Technical Planning  
**Input**: Yêu cầu tối ưu hóa hệ thống nhánh `main` sao cho Frontend (FE), Backend (BE) và Database (DB) đều chạy hoàn hảo và tương thích với hệ sinh thái Netlify, đồng bộ mã nguồn lên Git và cung cấp tài liệu hướng dẫn triển khai (Deployment Guide) chi tiết cho người dùng.

---

## 1. User Scenarios & Acceptance Criteria

### User Story 1 - Tối Ưu & Triển Khai Frontend Trên Netlify Edge CDN (Priority: P1)
Là một người dùng cuối hoặc sinh viên/nhà tuyển dụng truy cập trang web qua tên miền Netlify, tôi muốn giao diện tải nhanh chóng, mọi đường dẫn định tuyến (SPA Routing) hoạt động trơn tru không bị lỗi 404 khi tải lại trang, và tất cả API calls được thực thi mượt mà không gặp rào cản CORS.

**Key Deliverables:**
1. **Cấu hình `netlify.toml` chuẩn hóa:**
   - Base directory: `frontend`, build command: `npm run build`, publish directory: `dist`.
   - Cấu hình môi trường Node: `NODE_VERSION = "20"`.
2. **SPA Client-Side Routing Rewrite:**
   - Quy tắc chuyển hướng `/* /index.html 200` để React Router DOM xử lý điều hướng mượt mà trên mọi trang con (`/jobs`, `/login`, `/dashboard`, `/my-applications`, v.v.).
3. **Zero-CORS API Reverse Proxy Gateway:**
   - Netlify Redirects Proxy định tuyến toàn bộ `/api/v1/*` sang Backend Service URL tương ứng (`https://<backend-cloud-url>/api/v1/:splat` với status 200). Trình duyệt gọi API theo kiểu Same-Origin, loại bỏ 100% rủi ro CORS và rò rỉ endpoint nội bộ.
4. **Header An Ninh & Bộ Nhớ Đệm Tối Ưu:**
   - Tệp `_headers` và cấu hình `[[headers]]` khai báo: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`.
   - Chiến lược bộ nhớ đệm: `Cache-Control: public, max-age=31536000, immutable` cho các file tĩnh đã băm tên (`/assets/*`), và `no-cache, no-store, must-revalidate` cho `index.html`.

**Acceptance Scenarios:**
- Given một người dùng refresh trang tại `https://freelancehub.netlify.app/jobs/123`, trang web hiển thị nội dung chính xác thay vì trang lỗi 404 của Netlify.
- Given Frontend gọi request `/api/v1/jobs`, Netlify reverse proxy chuyển tiếp thành công đến Backend và trả về dữ liệu `ApiResponse` với status 200 mà không phát sinh lỗi CORS.

---

### User Story 2 - Cơ Sở Dữ Liệu Đám Mây Tương Thích Netlify DB & Neon Postgres (Priority: P1)
Là kỹ sư vận hành hệ thống, tôi muốn cơ sở dữ liệu hoạt động ổn định trên nền tảng Cloud Postgres Serverless (Netlify DB / Neon PostgreSQL), hỗ trợ tự động mở rộng kết nối thông qua connection pooler (PgBouncer) và đồng bộ cấu trúc bảng tự động.

**Key Deliverables:**
1. **Cấu hình Spring Boot Datasource Cho Cloud Postgres:**
   - Tinh chỉnh `application-prod.yml` và `application-postgres.yml` với HikariCP tối ưu cho serverless: `maximum-pool-size: 5-10`, `minimum-idle: 2`, `idle-timeout: 30000`, `connection-timeout: 20000`, `max-lifetime: 600000`, `leak-detection-threshold: 20000`.
   - Hỗ trợ tham số bắt buộc `sslmode=require` kết nối tới Neon / Netlify DB.
2. **Bộ Kịch Bản Di Trú CSDL (Database Migrations):**
   - Đóng gói trọn vẹn tệp cấu trúc `database/postgres_init.sql` và các tệp di trú `database/migrations/V1..V4` tương thích Flyway và PostgreSQL 16.
   - Thư mục `netlify/database/migrations/` phục vụ tính năng Netlify DB CLI (`@netlify/database`).

**Acceptance Scenarios:**
- Given một chuỗi kết nối Neon Postgres dạng `postgresql://user:pass@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`, Spring Boot khởi động thành công và tự động áp dụng schema/seed dữ liệu mà không bị treo connection pool.

---

### User Story 3 - Đóng Gói Backend Container & Cấu Hình Môi Trường Đám Mây (Priority: P1)
Là nhà phát triển, tôi muốn Spring Boot backend được đóng gói thành container Docker chuẩn sản xuất, cấu hình linh hoạt qua biến môi trường để sẵn sàng triển khai trên bất kỳ dịch vụ Cloud Container PaaS miễn phí/tin cậy nào (như Render, Railway, Fly.io, Koyeb, hoặc Docker VPS) kết nối trực tiếp với Netlify Frontend và Neon Database.

**Key Deliverables:**
1. **Multi-Stage Dockerfile Chuẩn Sản Xuất (`backend/Dockerfile`):**
   - Stage 1: Build với Maven 3.9 & Eclipse Temurin 17.
   - Stage 2: Runtime với Eclipse Temurin 17 JRE Alpine siêu nhẹ (~150MB), non-root user `spring:spring`, gắn cờ JVM `-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0`.
2. **Cấu hình Spring Security & CORS Linh Hoạt:**
   - Cập nhật `CorsConfig.java` cho phép các nguồn hợp lệ từ `http://localhost:3000`, `http://localhost:5173`, `https://*.netlify.app` và domain tùy chỉnh.
   - Cập nhật `SecurityConfig.java` CSP cho phép kết nối từ Netlify domains.
3. **Tệp Blueprint Triển Khai Backend (`render.yaml` & Docker Compose Prod):**
   - Cung cấp blueprint 1-click deploy cho dịch vụ backend container.

**Acceptance Scenarios:**
- Given container backend được kích hoạt với biến môi trường `SPRING_PROFILES_ACTIVE=postgres` và `SPRING_DATASOURCE_URL`, ứng dụng vượt qua health check tại `/api/v1/jobs` hoặc `/h2-console` / `/swagger-ui.html`.

---

### User Story 4 - Tài Liệu Hướng Dẫn Triển Khai Trực Quan Từng Bước (Priority: P1)
Là người dùng, sau khi mã nguồn đã được tối ưu và đẩy lên Git, tôi cần một tài liệu hướng dẫn từng bước rõ ràng, dễ hiểu (bằng tiếng Việt) để tự mình triển khai hệ thống lên Netlify và dịch vụ đám mây đi kèm chỉ trong vài phút.

**Key Deliverables:**
1. **Tài liệu `docs/DEPLOYMENT_NETLIFY_GUIDE.md`:**
   - Bước 1: Khởi tạo CSDL đám mây miễn phí trên Neon / Netlify DB (lấy connection string SSL).
   - Bước 2: Triển khai Backend container lên Render / Railway (kết nối DB và lấy URL backend).
   - Bước 3: Triển khai Frontend lên Netlify bằng Git Continuous Deployment (cấu hình biến môi trường và kích hoạt proxy).
   - Bước 4: Kiểm tra nghiệm thu (Passkey, Login, Job Browsing, SPA refresh).

---

## 2. Ràng Buộc & Tiêu Chuẩn Kỹ Thuật (Constraints)
- **Hiến pháp dự án:** Tuân thủ Nguyên tắc IX trong Hiến pháp phiên bản 2.2.0.
- **Tính tương thích ngược:** Không làm hỏng môi trường phát triển cục bộ (`localhost:8080`, `localhost:3000`).
- **An toàn mã nguồn:** Không hardcode mật khẩu, token hay private keys vào kho mã nguồn Git. Mọi thông tin nhạy cảm được cấu hình thông qua biến môi trường.


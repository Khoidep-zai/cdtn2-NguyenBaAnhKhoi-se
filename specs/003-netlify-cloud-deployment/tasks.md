# Implementation Tasks: Tối Ưu Triển Khai Đám Mây Netlify (FE - BE - DB)

**Feature Branch**: `003-netlify-cloud-deployment`  
**Parent Plan**: `specs/003-netlify-cloud-deployment/plan.md`  
**Status**: Ready for Execution  

---

## Task Checklist

### Phase 1: Frontend & Netlify Gateway Configuration
- [x] **Task 1.1**: Khởi tạo tệp `netlify.toml` tại gốc dự án cấu hình Build settings (`base = "frontend"`, `publish = "dist"`, `command = "npm run build"`), SPA redirect (`/* /index.html 200`), API Reverse Proxy (`/api/v1/* -> backend 200!`), và Security Headers.
- [x] **Task 1.2**: Tạo tệp `frontend/public/_redirects` và `frontend/public/_headers` đảm bảo tương thích 100% khi deploy publish directory độc lập.
- [x] **Task 1.3**: Tinh chỉnh `frontend/src/services/apiClient.ts` để sử dụng mặc định `/api/v1` (relative) trên production, tự động routing qua Netlify Proxy không phát sinh lỗi CORS.

### Phase 2: Backend Cloud & HikariCP Serverless Optimization
- [x] **Task 2.1**: Cập nhật `backend/src/main/resources/application-prod.yml` và `application-postgres.yml` với cấu hình HikariCP tối ưu cho serverless database (Neon/Netlify DB) và tham số SSL.
- [x] **Task 2.2**: Cập nhật `backend/src/main/java/com/nhom8/freelance/config/CorsConfig.java` cho phép domain `https://*.netlify.app` và dynamic origins.
- [x] **Task 2.3**: Cập nhật CSP trong `backend/src/main/java/com/nhom8/freelance/config/SecurityConfig.java` cho phép kết nối an toàn từ Netlify.
- [x] **Task 2.4**: Tối ưu hóa `backend/Dockerfile` multi-stage (Maven build + Temurin 17 JRE Alpine siêu nhẹ, non-root user, cờ JVM RAM container).

### Phase 3: Cloud Database & Blueprint Triển Khai
- [x] **Task 3.1**: Chuẩn bị tệp khởi tạo schema CSDL `database/postgres_init.sql` và `netlify/database/migrations/` tương thích Neon/Netlify DB.
- [x] **Task 3.2**: Khởi tạo `render.yaml` blueprint định nghĩa cấu hình deploy 1-click cho Spring Boot backend container kết nối Neon.
- [x] **Task 3.3**: Soạn thảo tài liệu hướng dẫn triển khai chi tiết `docs/DEPLOYMENT_NETLIFY_GUIDE.md` bằng tiếng Việt với các bước cụ thể: DB -> BE -> FE Netlify -> Kiểm thử.

### Phase 4: Verification, Git Push & Delivery
- [x] **Task 4.1**: Chạy kiểm thử Backend toàn diện với Maven (xác nhận 57/57 tests PASS).
- [x] **Task 4.2**: Chạy kiểm thử Frontend static typing & packaging (`tsc && vite build`).
- [x] **Task 4.3**: Commit toàn bộ thay đổi với thông điệp chuẩn mực và push lên nhánh `main` trên GitHub remote `origin/main`.
- [x] **Task 4.4**: Hướng dẫn người dùng các bước thực tế để deploy lên Netlify và Neon.


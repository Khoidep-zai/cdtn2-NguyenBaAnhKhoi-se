# 🚀 TỐI ƯU HÓA TOÀN DIỆN HỆ THỐNG TRIỂN KHAI ĐÁM MÂY NETLIFY (ZERO-CORS REVERSE PROXY & NEON DATABASE)

## 📌 THÔNG TIN CHUNG
- **Người thực hiện**: Nguyễn Bá Anh Khôi (Team Lead & DevOps)
- **Học phần**: Chuyên đề tốt nghiệp 2 (CDTN2) — Khoa CNTT — Trường Đại học Văn Lang
- **Dự án**: Sàn Giao dịch Việc làm Part-time & Freelance cho Sinh viên (FreelanceHub)
- **Phân hệ**: DevOps / Cloud Deployment / Architecture Optimization (FE - BE - DB)
- **Tập tin liên quan**:
  - `netlify.toml`
  - `frontend/public/_redirects` & `frontend/public/_headers`
  - `frontend/src/services/apiClient.ts`
  - `backend/src/main/resources/application-prod.yml` & `application-postgres.yml`
  - `backend/src/main/java/com/nhom8/freelance/config/CorsConfig.java` & `SecurityConfig.java`
  - `backend/Dockerfile`
  - `render.yaml`
  - `docs/DEPLOYMENT_NETLIFY_GUIDE.md`
  - `specs/003-netlify-cloud-deployment/` (`spec.md`, `plan.md`, `tasks.md`)

---

## 🎯 1. BỐI CẢNH VÀ MỤC TIÊU KỸ THUẬT
Sau khi hoàn thiện 11 tính năng Modern Web APIs, Passkey WebAuthn và Core Web Vitals, hệ thống cần được cấu hình tối ưu để triển khai lên môi trường sản xuất đám mây miễn phí và tin cậy cao:
- **Frontend**: Triển khai trực tiếp lên Netlify Edge CDN với hiệu năng cao, chứng chỉ SSL tự động và cơ chế Rewrite SPA chống lỗi 404 khi người dùng refresh hoặc truy cập sâu vào các đường dẫn con.
- **Backend**: Đóng gói container Docker đa tầng (Multi-Stage) siêu nhẹ, cấu hình biến môi trường linh hoạt sẵn sàng chạy trên Cloud Container PaaS (Render / Railway / Fly.io).
- **Database**: Kết nối an toàn qua giao thức SSL (`sslmode=require`) tới Serverless PostgreSQL (Netlify DB / Neon.tech) với connection pooler PgBouncer và HikariCP tối ưu.
- **Zero-CORS Gateway**: Sử dụng Netlify Reverse Proxy (`/api/v1/* -> backend`) để toàn bộ các request từ trình duyệt trở thành Same-Origin, loại bỏ 100% rủi ro CORS và giấu kín địa chỉ IP/domain nội bộ của backend.

---

## 🛠️ 2. CÁC HẠNG MỤC TỐI ƯU CHI TIẾT

### A. Frontend & Netlify Edge Gateway
1. **`netlify.toml`**:
   - Cấu hình Build: `base = "frontend"`, `publish = "dist"`, `command = "npm run build"`, `NODE_VERSION = "20"`.
   - Reverse Proxy Gateway:
     ```toml
     [[redirects]]
       from = "/api/v1/*"
       to = "https://freelance-platform-api.onrender.com/api/v1/:splat"
       status = 200
       force = true
       headers = {X-From = "Netlify-Proxy"}
     ```
   - SPA Fallback Rewrite: `/* /index.html 200`.
   - Security Headers: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Permissions-Policy`.
   - Immutable Cache Headers: 1 năm cho `/assets/*` (`max-age=31536000, immutable`).
2. **`frontend/src/services/apiClient.ts`**:
   - Tối ưu `API_BASE_URL` mặc định sử dụng `/api/v1` (relative path) trong production để gọi tự động qua Netlify Proxy, đồng thời giữ fallback `VITE_API_BASE_URL` cho môi trường cục bộ.

### B. Backend Spring Boot & HikariCP Serverless
1. **`application-prod.yml` & `application-postgres.yml`**:
   - Tinh chỉnh HikariCP serverless pooling:
     - `maximum-pool-size: 10`, `minimum-idle: 2`.
     - `idle-timeout: 30000`, `connection-timeout: 20000`, `max-lifetime: 600000`.
     - `leak-detection-threshold: 20000`, `keepalive-time: 30000`.
   - Hỗ trợ SSL mode `prefer`/`require` khi kết nối Neon Postgres.
2. **`CorsConfig.java` & `SecurityConfig.java`**:
   - Cập nhật pattern cho phép: `https://*.netlify.app`, `http://localhost:*`, `https://*.onrender.com`.
   - CSP directive mở rộng `connect-src` hỗ trợ các domain đám mây an toàn.
3. **`backend/Dockerfile`**:
   - Multi-stage build (Maven 3.9 + Temurin 17 JRE Alpine).
   - Thiết lập JVM memory parameters: `-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0`.
   - Non-root user `spring:spring` tăng cường bảo mật container.

### C. Cloud Database & Hướng Dẫn Vận Hành
1. **`database/postgres_init.sql` & `database/schema.sql`**:
   - Đảm bảo đầy đủ bảng `user_passkey_credentials`, 13 indexes tối ưu và bộ dữ liệu mẫu 1,470+ tin việc làm.
2. **`render.yaml`**:
   - Blueprint 1-click deploy web service Docker trên Render kết nối Neon.
3. **`docs/DEPLOYMENT_NETLIFY_GUIDE.md`**:
   - Cẩm nang triển khai 4 bước chi tiết bằng tiếng Việt kèm sơ đồ kiến trúc và hướng dẫn khắc phục sự cố (Cold Start, SSL, CORS).

---

## 🧪 3. KẾT QUẢ KIỂM THỬ NGHIỆM THU (VERIFICATION)
1. **Backend Testing (JUnit 5 + Mockito + Spring Security)**:
   - Tổng cộng: **57/57 tests PASS** (0 failures, 0 errors, 0 skipped).
   - Thời gian thực thi: 30.378s.
   - Toàn bộ tính năng Passkey, Authentication, Jobs, Applications, Reports, Reviews đều vượt qua 100%.
2. **Frontend Production Packaging (TypeScript + Vite)**:
   - TypeScript strict check: **0 lỗi typing**.
   - Build time: 16.39s, **1,596 modules transformed**.
   - Output dist gồm index bundle 158 kB, vendor chunk 162 kB, 16 code-split route chunks.


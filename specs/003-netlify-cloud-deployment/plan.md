# Technical Architecture Plan: Triển Khai Đám Mây Netlify (FE - BE - DB)

**Feature Branch**: `003-netlify-cloud-deployment`  
**Parent Spec**: `specs/003-netlify-cloud-deployment/spec.md`  
**Status**: Approved for Task Breakdown  

---

## 1. Tổng Quan Kiến Trúc Đám Mây (Cloud Architecture Overview)

Hệ thống FreelanceHub được tối ưu hóa theo mô hình kiến trúc đám mây phân tán nhưng thống nhất về trải nghiệm người dùng (Unified Experience via Netlify Gateway):

```text
               ┌────────────────────────────────────────────────────────┐
               │              TRÌNH DUYỆT NGƯỜI DÙNG                   │
               │   (https://freelancehub.netlify.app - HTTPS & WebAuthn)│
               └──────────────────────────┬─────────────────────────────┘
                                          │
                                          ▼
               ┌────────────────────────────────────────────────────────┐
               │                 NETLIFY EDGE PLATFORM                  │
               ├──────────────────────────┬─────────────────────────────┤
               │   1. STATIC ASSETS (CDN) │ 2. REVERSE PROXY GATEWAY    │
               │   - React 18 + Vite SPA  │    (Zero-CORS Architecture) │
               │   - Caching (Immutable)  │    Rule: /api/v1/*          │
               │   - SPA Rewrite:         │      ──► https://<backend>  │
               │     /* -> /index.html    │      (status 200, force)    │
               └──────────────────────────┴───────────────┬─────────────┘
                                                          │
                                         Proxying Request │ (Same-Origin)
                                                          ▼
               ┌────────────────────────────────────────────────────────┐
               │          BACKEND SERVICE (Cloud Container)             │
               │  - Platform: Render / Railway / Fly.io / Docker VPS    │
               │  - Runtime: Eclipse Temurin 17 JRE Alpine              │
               │  - Framework: Spring Boot 3.2.x REST API               │
               │  - Context Path: /api/v1                               │
               └──────────────────────────┬─────────────────────────────┘
                                          │
                            JDBC with SSL │ (HikariCP Serverless Pool)
                                          ▼
               ┌────────────────────────────────────────────────────────┐
               │       DATABASE SERVICE (Netlify DB / Neon Postgres)    │
               │  - Managed PostgreSQL 16 Serverless                   │
               │  - PgBouncer Connection Pooler                         │
               │  - Auto-Migration: database/postgres_init.sql          │
               └────────────────────────────────────────────────────────┘
```

---

## 2. Thiết Kế Chi Tiết Từng Thành Phần

### A. Frontend Netlify Configuration (`netlify.toml`, `_redirects`, `_headers`)
1. **`netlify.toml`**:
   - `[build]`:
     - `base = "frontend"`
     - `publish = "dist"`
     - `command = "npm run build"`
     - `environment = { NODE_VERSION = "20" }`
   - `[[redirects]]`:
     - Proxy rule:
       ```toml
       [[redirects]]
         from = "/api/v1/*"
         to = "https://freelance-platform-api.onrender.com/api/v1/:splat"
         status = 200
         force = true
       ```
     - SPA fallback rule:
       ```toml
       [[redirects]]
         from = "/*"
         to = "/index.html"
         status = 200
       ```
   - `[[headers]]`:
     - Thiết lập cache headers tối ưu cho `/assets/*` (1 năm immutable).
     - Thiết lập Security Headers cho `/*` (HSTS, nosniff, SAMEORIGIN, CSP).
2. **`frontend/src/services/apiClient.ts`**:
   - Tối ưu `API_BASE_URL`:
     ```ts
     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
     ```
     Trong môi trường production trên Netlify, gọi trực tiếp `/api/v1` thông qua Netlify Proxy giúp loại bỏ hoàn toàn lỗi CORS và không cần hardcode domain backend trong bundle phía client.

### B. Backend Spring Boot Configuration & Security Updates
1. **`backend/src/main/resources/application-prod.yml` & `application-postgres.yml`**:
   - Tinh chỉnh cấu hình HikariCP tối ưu cho serverless/cloud database:
     - `maximum-pool-size: 10`
     - `minimum-idle: 2`
     - `idle-timeout: 30000` (30 giây)
     - `connection-timeout: 20000` (20 giây)
     - `max-lifetime: 600000` (10 phút)
     - `keepalive-time: 30000`
     - `leak-detection-threshold: 20000`
   - Đảm bảo tham số SSL `sslmode=require` khi kết nối Neon Postgres.
2. **`backend/src/main/java/com/nhom8/freelance/config/CorsConfig.java`**:
   - Mở rộng danh sách origins hỗ trợ Netlify domains (`https://*.netlify.app`), `http://localhost:3000`, `http://localhost:5173`, `http://localhost:8888`.
3. **`backend/src/main/java/com/nhom8/freelance/config/SecurityConfig.java`**:
   - Cập nhật CSP directive `connect-src` bổ sung `'self' https: http://localhost:8080 http://localhost:5173 ws://localhost:5173;`.
4. **`backend/Dockerfile`**:
   - Multi-stage build (Maven 3.9 + Temurin 17 JRE Alpine).
   - Thiết lập JVM memory parameters: `-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0`.
   - Khởi tạo non-root group & user `spring:spring` vì lý do bảo mật.

### C. Cloud Database (Neon / Netlify DB)
1. **Schema Initialization**:
   - Cung cấp tệp `database/postgres_init.sql` và `database/schema.sql` đã được kiểm duyệt chuẩn PostgreSQL 16.
   - Thư mục `netlify/database/migrations/` phục vụ Netlify DB CLI nếu người dùng muốn dùng `@netlify/database`.
2. **Tính Năng Bất Biến**:
   - 13 Indexes phục vụ tìm kiếm việc làm, lọc địa điểm, ngành nghề và người dùng.
   - Bảng Passkey WebAuthn `user_passkey_credentials` đồng bộ.

### D. Blueprint Triển Khai Backend (`render.yaml`)
- Cung cấp blueprint định nghĩa dịch vụ Web Service trên Render kết nối với Neon PostgreSQL để người dùng có thể deploy chỉ bằng 1 cú nhấp chuột hoặc kết nối Git repo.

---

## 3. Kế Hoạch Kiểm Thử Nghiệm Thu (Verification Plan)
1. **Kiểm thử cục bộ (Local Build & Test)**:
   - Backend Maven tests: Chạy toàn bộ 57 tests đảm bảo không có bất kỳ regression nào.
   - Frontend Build: Chạy `npm run build` trên thư mục `frontend/` kiểm tra static typing và output `dist/`.
2. **Kiểm thử Netlify Build Simulation**:
   - Kiểm tra cú pháp `netlify.toml` hợp lệ.
3. **Kiểm thử Git Sync**:
   - Commit và push sạch sẽ lên GitHub `origin/main`.


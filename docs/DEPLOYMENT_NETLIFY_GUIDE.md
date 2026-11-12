# Hướng Dẫn Chi Tiết Triển Khai Hệ Thống FreelanceHub Lên Đám Mây Netlify & Render & Neon

> **Dự án**: Sàn Giao Dịch Việc Làm Sinh Viên (Student Freelance & Part-time Job Marketplace)  
> **Nhóm thực hiện**: Nhóm 8 (Chuyên đề tốt nghiệp 2)  
> **Kiến trúc**: Fullstack Cloud (Netlify Edge CDN + Render Cloud Container + Neon Serverless PostgreSQL)

---

## 1. Tổng Quan Kiến Trúc Đám Mây (Cloud Architecture)

Hệ sinh thái FreelanceHub được thiết kế theo mô hình **Zero-CORS Reverse Proxy Architecture** nhằm tối ưu hóa hiệu năng, bảo mật và tính khả dụng cao trên nền tảng đám mây:

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
               │   - Caching (1 năm imm.) │    Rule: /api/v1/*          │
               │   - SPA Rewrite:         │      ──► https://<backend>  │
               │     /* -> /index.html    │      (status 200, force)    │
               └──────────────────────────┴───────────────┬─────────────┘
                                                          │
                                         Proxying Request │ (Same-Origin)
                                                          ▼
               ┌────────────────────────────────────────────────────────┐
               │          BACKEND SERVICE (Cloud Container)             │
               │  - Nền tảng: Render Web Service (Docker Runtime)       │
               │  - Runtime: Eclipse Temurin 17 JRE Alpine              │
               │  - Framework: Spring Boot 3.2.x REST API               │
               │  - Context Path: /api/v1                               │
               └──────────────────────────┬─────────────────────────────┘
                                          │
                            JDBC with SSL │ (HikariCP Serverless Pool)
                                          ▼
               ┌────────────────────────────────────────────────────────┐
               │       DATABASE SERVICE (Neon Serverless Postgres 16)   │
               │  - Managed PostgreSQL 16 Serverless                   │
               │  - PgBouncer Connection Pooler (sslmode=require)       │
               │  - Bộ dữ liệu mẫu: 1,470+ việc làm sinh viên chuẩn     │
               └────────────────────────────────────────────────────────┘
```

### Ưu điểm vượt trội của kiến trúc này:
1. **Loại bỏ hoàn toàn lỗi CORS**: Frontend gọi relative path `/api/v1/...`, Netlify Edge đứng ra làm proxy chuyển tiếp sang Backend.
2. **Hỗ trợ trọn vẹn WebAuthn Passkey**: Tiêu chuẩn FIDO2/WebAuthn yêu cầu giao thức `https://` bảo mật, Netlify tự động cấp chứng chỉ SSL Let's Encrypt miễn phí.
3. **Tiết kiệm tài nguyên**: Cấu hình HikariCP tối ưu hóa cho serverless database tự động ngắt kết nối khi idle và tái sử dụng connection qua PgBouncer.

---

## 2. Chuẩn Bị Tài Khoản

Trước khi bắt đầu, bạn cần chuẩn bị các tài khoản miễn phí sau:
- **GitHub**: Lưu trữ mã nguồn dự án.
- **Neon.tech**: Dịch vụ Serverless PostgreSQL miễn phí (0.5 GiB dung lượng, tự động scale-to-zero).
- **Render.com**: Nền tảng Cloud Application Hosting chạy container Docker (750 giờ miễn phí/tháng).
- **Netlify.com**: Nền tảng Edge CDN Hosting cho ứng dụng React Vite SPA (100GB băng thông/tháng).

---

## 3. Bước 1: Khởi Tạo Cơ Sở Dữ Liệu PostgreSQL Trên Neon

1. Truy cập [https://neon.tech](https://neon.tech) và đăng nhập bằng tài khoản GitHub.
2. Nhấn **Create a project**:
   - **Project name**: `freelancehub-db`
   - **Postgres version**: `16` (mặc định)
   - **Region**: `Singapore (ap-southeast-1)` (chọn vị trí gần Việt Nam để giảm độ trễ).
3. Sau khi tạo xong, màn hình hiển thị thông tin kết nối **Connection Details**:
   - Chọn tab **Pooled connection** (khuyến nghị cho Spring Boot).
   - Chọn định dạng: **Java** hoặc **JDBC**:
     ```text
     jdbc:postgresql://ep-silent-sea-a1b2c3d4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
     ```
   - Ghi lại các thông số:
     - `Host`: `ep-silent-sea-a1b2c3d4-pooler.ap-southeast-1.aws.neon.tech`
     - `Database`: `neondb` (hoặc tạo database `freelance_db`)
     - `User`: `neondb_owner` (hoặc tương tự)
     - `Password`: `<mật khẩu được cấp>`
4. Nạp cấu trúc bảng và dữ liệu mẫu:
   - Truy cập mục **SQL Editor** trên thanh menu trái của Neon console.
   - Mở tệp `database/postgres_init.sql` trong mã nguồn dự án (hoặc tệp `database/schema.sql` nếu chỉ cần bảng trống).
   - Sao chép toàn bộ nội dung và dán vào SQL Editor, sau đó nhấn **Run Selection / Execute**.
   - Toàn bộ 8 bảng chính, bảng WebAuthn passkey `user_passkey_credentials`, 13 indexes tối ưu và hơn 1,470 việc làm sinh viên sẽ được tạo thành công!

---

## 4. Bước 2: Triển Khai Backend Spring Boot Container Lên Render

### Cách 1: Triển khai 1-Click thông qua `render.yaml` Blueprint (Khuyến nghị)
1. Đảm bảo mã nguồn dự án đã được push lên repository GitHub của bạn (bao gồm tệp `render.yaml` ở thư mục gốc).
2. Đăng nhập [https://dashboard.render.com](https://dashboard.render.com).
3. Nhấn **New +** -> Chọn **Blueprint**.
4. Chọn repository GitHub của dự án và nhấn **Connect**.
5. Render sẽ tự động đọc tệp `render.yaml` và phát hiện Web Service `freelance-platform-api`.
6. Điền các giá trị bí mật (Secret Environment Variables) khi Render yêu cầu:
   - `SPRING_DATASOURCE_URL`: Dán chuỗi JDBC từ Bước 1 (ví dụ: `jdbc:postgresql://<neon-host>/neondb?sslmode=require`).
   - `SPRING_DATASOURCE_USERNAME`: Tên user Neon (ví dụ: `neondb_owner`).
   - `SPRING_DATASOURCE_PASSWORD`: Mật khẩu Neon database của bạn.
7. Nhấn **Apply**. Render sẽ tự động kích hoạt multi-stage Docker build, biên dịch Maven và khởi chạy container.

### Cách 2: Triển khai Web Service thủ công trên Render
Nếu không sử dụng Blueprint:
1. Vào Render Dashboard -> **New +** -> **Web Service**.
2. Chọn repository dự án.
3. Cấu hình thông số:
   - **Name**: `freelance-platform-api`
   - **Region**: `Singapore (Southeast Asia)`
   - **Branch**: `main`
   - **Root Directory**: (để trống - gốc repo)
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Docker Context**: `./backend`
   - **Instance Type**: `Free`
4. Cấu hình mục **Environment Variables**:
   | Key | Value | Ghi chú |
   | :--- | :--- | :--- |
   | `SERVER_PORT` | `8080` | Port container |
   | `SPRING_PROFILES_ACTIVE` | `prod` | Kích hoạt profile production HikariCP |
   | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<neon-host>/neondb?sslmode=require` | Chuỗi JDBC Neon |
   | `SPRING_DATASOURCE_USERNAME` | `<neon-user>` | Username database |
   | `SPRING_DATASOURCE_PASSWORD` | `<neon-password>` | Password database |
   | `JWT_SECRET` | `9a7f8e3b2c1d0f5e4a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f` | Chuỗi bí mật tối thiểu 256 bits |
   | `JWT_EXPIRATION_MS` | `86400000` | 24 giờ |
   | `APP_CORS_ALLOWED_ORIGINS` | `https://*.netlify.app,http://localhost:3000,http://localhost:5173,*` | Hỗ trợ Netlify origins |
5. Nhấn **Create Web Service**.
6. Đợi 2-4 phút cho quá trình build hoàn tất. Khi log xuất hiện `Started FreelancePlatformApplication in X seconds`, backend đã live!
7. Ghi lại URL của backend, ví dụ: `https://freelance-platform-api.onrender.com`.
8. Kiểm tra endpoint bằng cách mở trình duyệt truy cập:
   `https://freelance-platform-api.onrender.com/api/v1/jobs?page=0&size=5`
   -> Nhận được JSON danh sách việc làm trả về tức là backend đã kết nối Neon DB thành công!

---

## 5. Bước 3: Triển Khai Frontend Lên Netlify

1. Đăng nhập [https://app.netlify.com](https://app.netlify.com) bằng tài khoản GitHub.
2. Cập nhật domain backend trong mã nguồn trước khi deploy:
   - Mở tệp `netlify.toml` tại gốc dự án.
   - Kiểm tra rule `[[redirects]]`:
     ```toml
     [[redirects]]
       from = "/api/v1/*"
       to = "https://<URL-BACKEND-RENDER-CUA-BAN>.onrender.com/api/v1/:splat"
       status = 200
       force = true
     ```
   - Đồng thời cập nhật tệp `frontend/public/_redirects`:
     ```text
     /api/v1/*  https://<URL-BACKEND-RENDER-CUA-BAN>.onrender.com/api/v1/:splat  200!
     /*         /index.html                                                     200
     ```
   - Commit và push thay đổi lên GitHub.
3. Trên giao diện Netlify:
   - Nhấn **Add new site** -> **Import an existing project** -> Chọn **GitHub**.
   - Chọn repository chứa dự án FreelanceHub.
4. Cấu hình thông số Build & Deploy:
   - **Base directory**: `frontend` (hoặc để trống nếu dùng `netlify.toml` ở root)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Cấu hình biến môi trường trên Netlify (Mục **Site configuration** -> **Environment variables**):
   - `NODE_VERSION`: `20`
   - `VITE_API_BASE_URL`: (Tùy chọn) Nếu để trống, code frontend sẽ tự động dùng relative path `/api/v1`, chạy qua Netlify Reverse Proxy với độ trễ tối ưu và không dính lỗi CORS!
6. Nhấn **Deploy freelancehub**.
7. Netlify sẽ tiến hành chạy `npm run build` (kiểm tra TypeScript và đóng gói Vite) trong khoảng 1-2 phút.
8. Sau khi hoàn tất, Netlify sẽ cấp cho bạn một domain HTTPS miễn phí dạng:
   `https://freelancehub-nhom8.netlify.app`
   (Bạn có thể đổi tên subdomain trong mục **Domain management** -> **Options** -> **Edit site name**).

---

## 6. Bước 4: Kiểm Thử và Nghiệm Thu Toàn Diện (End-to-End Testing)

Sau khi deploy thành công cả 3 tầng, hãy thực hiện kiểm thử theo kịch bản:

1. **Kiểm tra giao diện & LCP**:
   - Truy cập `https://freelancehub-nhom8.netlify.app`.
   - Trang chủ hiển thị ngay lập tức với đầy đủ danh mục, danh sách việc làm nổi bật, hero section.
2. **Kiểm tra Reverse Proxy & Zero-CORS**:
   - Mở DevTools (F12) -> tab **Network**.
   - Thấy các request gửi đến `https://freelancehub-nhom8.netlify.app/api/v1/jobs` trả về mã trạng thái `200 OK` với header `X-From: Netlify-Proxy`. Không có bất kỳ cảnh báo CORS nào trong Console!
3. **Kiểm tra xác thực WebAuthn Passkey (Sinh trắc học)**:
   - Truy cập trang `/login`.
   - Nhập email và nhấn **Đăng nhập bằng Passkey (Vân tay / FaceID / Windows Hello)**.
   - Trình duyệt bật hộp thoại xác thực sinh trắc học FIDO2. Xác thực thành công và được cấp JWT token.
4. **Kiểm tra các luồng nghiệp vụ**:
   - **Tìm kiếm & Lọc việc làm**: Tìm việc part-time theo mức lương, địa điểm (Hà Nội, TP.HCM), ca làm việc.
   - **Nộp đơn ứng tuyển (Student)**: Tải file CV hoặc nhập thư giới thiệu.
   - **Đăng tin tuyển dụng (Employer)**: Nhập thông tin việc làm mới, hệ thống tự động kiểm duyệt hoặc lưu trữ.
   - **Quản trị hệ thống (Admin)**: Quản lý người dùng, duyệt tin tuyển dụng, xử lý báo cáo vi phạm.

---

## 7. Hướng Dẫn Xử Lý Sự Cố Thường Gặp (Troubleshooting)

### A. Backend trên Render bị sleep sau 15 phút không hoạt động (Cold Start)
- **Hiện tượng**: Gói Free của Render sẽ tạm dừng container sau 15 phút không có request. Request đầu tiên sau khi sleep có thể mất 30-50 giây để khởi động lại container.
- **Giải pháp**:
  1. Đăng ký tài khoản miễn phí tại [https://cron-job.org](https://cron-job.org) hoặc [https://uptimerobot.com](https://uptimerobot.com).
  2. Tạo một HTTP monitor ping đến endpoint: `https://<backend-render-domain>/api/v1/jobs?page=0&size=1` định kỳ mỗi 10 phút.
  3. Container sẽ luôn ở trạng thái warm, phản hồi ngay lập tức cho người dùng!

### B. Lỗi `Connection to database failed: sslmode=require`
- **Nguyên nhân**: Neon PostgreSQL bắt buộc mã hóa SSL cho toàn bộ kết nối từ xa.
- **Giải pháp**: Đảm bảo chuỗi `SPRING_DATASOURCE_URL` trên Render có tham số `?sslmode=require` ở cuối.

### C. Lỗi 404 khi tải lại trang con (F5 trên Netlify)
- **Hiện tượng**: Truy cập trực tiếp link `https://freelancehub.netlify.app/jobs` hoặc F5 bị lỗi `Page Not Found 404`.
- **Giải pháp**: Đã được xử lý hoàn toàn bởi rule `/* /index.html 200` trong cả `netlify.toml` và `frontend/public/_redirects`.

### D. Cần cấu hình tên miền riêng (Custom Domain)
- Vào Netlify **Domain management** -> **Add a domain** -> Nhập domain bạn sở hữu (ví dụ: `freelancehub.vn`).
- Trỏ bản ghi CNAME hoặc ALIAS của tên miền về Netlify theo hướng dẫn. Netlify sẽ tự động cấp chứng chỉ SSL Let's Encrypt trong vòng 5 phút!

---

*Tài liệu được biên soạn và kiểm duyệt bởi Nhóm 8 - Chuyên đề tốt nghiệp 2.*

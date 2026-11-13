# Hướng Dẫn Vận Hành & Khởi Chạy Hệ Thống Bằng Docker (CDTN2 - Nhóm 8)

> **Học phần:** Chuyên đề Tốt nghiệp 2 (CDTN2 — HK1 2026–2027)  
> **Khoa:** Công nghệ Thông tin — Trường Đại học Văn Lang  
> **Dự án:** Sàn Giao dịch Việc làm Sinh viên Freelance & Part-time (FreelanceHub)  
> **Nhóm thực hiện:** Nhóm 8 (Nguyễn Bá Anh Khôi, Phan Văn Hoàng Long, Phạm Công Tài)  
> **Tiêu chuẩn áp dụng:** Kiến trúc Container hóa đa tầng theo chuẩn SE CDTN1 & CDTN2  

---

## 1. Yêu Cầu Môi Trường (System Prerequisites)

| Thành phần | Yêu cầu tối thiểu | Khuyến nghị môi trường SE |
|---|---|---|
| **Hệ điều hành** | Windows 10/11 (WSL2), Linux Ubuntu 20.04+, macOS | Windows 11 với Docker Desktop hoặc Ubuntu 22.04 LTS |
| **Container Engine** | Docker Engine 24.0+ hoặc Docker Desktop 4.25+ | Docker Desktop kèm Docker Compose v2 (`docker compose`) |
| **Phần cứng** | 2 CPU cores, 4 GB RAM, 6 GB dung lượng ổ đĩa | 4 CPU cores, 8 GB RAM, ổ cứng SSD |
| **Cổng mạng (Ports)** | Cổng `3000` (Frontend) và `8080` (Backend API) khả dụng | Tùy biến linh hoạt qua tệp cấu hình `.env` |

---

## 2. Hướng Dẫn Khởi Chạy Nhanh (2 Lệnh Chuẩn Duy Nhất)

Toàn bộ hệ thống gồm 3 tầng khép kín (CSDL PostgreSQL 16 Alpine + Backend Spring Boot 3.2.x + Frontend React Vite Nginx) được khởi chạy hoàn chỉnh chỉ bằng **đúng 2 câu lệnh**:

### Trên Windows (PowerShell):
```powershell
Copy-Item .env.example .env
docker compose up -d --build
```
*(Hoặc chạy script tự động: `.\scripts\docker-run.ps1`)*

### Trên Linux / macOS (Bash):
```bash
cp .env.example .env
docker compose up -d --build
```
*(Hoặc chạy script tự động: `bash ./scripts/docker-run.sh`)*

### Lệnh rút gọn qua npm (nếu đã cài Node.js):
```bash
npm run docker:up
```

---

## 3. Sơ Đồ Kiến Trúc Container & Cơ Chế Khởi Động Tuần Tự

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        DOCKER COMPOSE ORCHESTRATION                   │
│                                                                        │
│   ┌────────────────────────┐  depends_on   ┌────────────────────────┐  │
│   │  service: postgres_db  │ ────────────► │  service: backend_api  │  │
│   │  (PostgreSQL 16)       │  (service_    │  (Spring Boot 3.2.x)   │  │
│   │  - Port 5432           │   healthy)    │  - Port 8080           │  │
│   │  - Shared buffers: 256M│               │  - User: spring        │  │
│   │  - Sync commit: off    │               │  - Context: /api/v1    │  │
│   └────────────────────────┘               └───────────┬────────────┘  │
│                                                        │               │
│                                                        │ depends_on    │
│                                                        │ (service_     │
│                                                        │  healthy)     │
│                                                        ▼               │
│                       ┌────────────────────────────────┴────────────┐  │
│                       │           service: frontend_web             │  │
│                       │  (React Vite SPA + Nginx 1.27 Alpine)       │  │
│                       │  - Port 3000 -> 80                          │  │
│                       │  - Gzip Compression & Static Cache          │  │
│                       │  - Zero-CORS Gateway: /api/v1/* -> backend  │  │
│                       └─────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Các công nghệ và kỹ thuật tối ưu nổi bật (Kế thừa từ CDTN1):
1. **Tinh chỉnh PostgreSQL cho hiệu năng cao**:
   - `shared_buffers=256MB`, `work_mem=16MB`, `wal_buffers=16MB`.
   - `synchronous_commit=off`: Giúp tăng tốc độ nạp dữ liệu khởi tạo 1.470+ việc làm mẫu lên gấp **4 lần** trên Windows WSL2.
2. **Khởi động tuần tự có điều kiện (`depends_on: condition: service_healthy`)**:
   - `backend_api` chỉ bắt đầu khởi động khi `postgres_db` đã hoàn tất healthcheck `pg_isready`, chống triệt để lỗi sập do `Connection Refused`.
   - `frontend_web` chỉ mở phục vụ người dùng khi `backend_api` đã sẵn sàng nhận request tại `/api/v1/jobs`.
3. **Cơ chế Reverse Proxy nội bộ Zero-CORS**:
   - Nginx trong `frontend_web` đóng vai trò reverse proxy chuyển tiếp các request `/api/v1/*` sang `backend_api:8080/api/v1/*`.
   - Người dùng truy cập `http://localhost:3000` được hưởng trải nghiệm Same-Origin, miễn nhiễm 100% lỗi CORS trên trình duyệt.
4. **Tối ưu hóa Build Context với `.dockerignore`**:
   - Loại bỏ các thư mục nặng (`target/`, `node_modules/`, `.git/`, `dataset/`), giúp Docker truyền context cực nhanh (< 20MB).

---

## 4. Tài Khoản Đăng Nhập Demo Phân Quyền Sẵn Sàng

Cơ sở dữ liệu tự động nạp sẵn 3 tài khoản demo đầy đủ 3 vai trò:

| Tài khoản (Email) | Mật khẩu chuẩn | Vai trò (Role) | Quyền hạn nghiệp vụ |
|---|---|---|---|
| `admin@test.com` | `123456` | `ROLE_ADMIN` | Quản trị toàn sàn: Duyệt tin đăng, quản lý người dùng, xử lý báo cáo vi phạm |
| `employer@test.com` | `123456` | `ROLE_EMPLOYER` | Nhà tuyển dụng: Đăng tin tuyển dụng, xem danh sách ứng viên, duyệt/từ chối đơn ứng tuyển |
| `student@test.com` | `123456` | `ROLE_STUDENT` | Sinh viên: Tìm việc làm thêm, nộp hồ sơ CV, hủy đơn, đánh giá nhà tuyển dụng |

---

## 5. Truy Cập Hệ Thống & Kiểm Tra Sức Khỏe

- 🌐 **Giao diện Web Sinh viên & NTD:** [http://localhost:3000](http://localhost:3000)
- 🩺 **Kiểm tra API Backend:** [http://localhost:8080/api/v1/jobs](http://localhost:8080/api/v1/jobs)
- 📑 **Tài liệu Swagger / OpenAPI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- 🗄️ **H2 Web Console (nếu dùng profile dev):** [http://localhost:8080/api/v1/h2-console](http://localhost:8080/api/v1/h2-console)

---

## 6. Các Lệnh Quản Trị Thường Dùng

```bash
# Xem trạng thái các container đang chạy (tất cả phải healthy)
docker compose ps

# Xem log thời gian thực của backend
docker compose logs -f backend_api

# Xem log thời gian thực của toàn bộ hệ thống
docker compose logs -f

# Khởi động lại dịch vụ backend
docker compose restart backend_api

# Dừng hệ thống và giải phóng toàn bộ dữ liệu volume
docker compose down -v
```

---

## 7. Hướng Dẫn Xử Lý Sự Cố (Troubleshooting)

1. **Xung đột cổng `3000` hoặc `8080`:**
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


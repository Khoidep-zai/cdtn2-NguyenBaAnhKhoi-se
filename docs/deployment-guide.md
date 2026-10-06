# HƯỚNG DẪN TRIỂN KHAI VÀ VẬN HÀNH (DEPLOYMENT GUIDE)

**Đề tài:** Nền tảng quản lý freelance & marketplace việc làm part-time cho sinh viên  
**Nhóm:** Nhóm 8 (261_71ITGR40303_04)  

---

## 1. YÊU CẦU MÔI TRƯỜNG (PREREQUISITES)

### Lựa chọn 1: Chạy tự động qua Docker (Khuyến nghị)
- Docker Engine >= 24.0.0
- Docker Compose >= 2.20.0

### Lựa chọn 2: Chạy trực tiếp trên máy cục bộ (Local Development)
- Java OpenJDK >= 17 (hoặc Java 21)
- Apache Maven >= 3.8.x
- Node.js >= 18.x (khuyến nghị v20+) & npm
- PostgreSQL >= 15.x đang chạy trên cổng mặc định 5432

---

## 2. TRIỂN KHAI NHANH BẰNG DOCKER COMPOSE

### Bước 1: Chuẩn bị tệp cấu hình biến môi trường
Tạo bản sao từ tệp mẫu:
```bash
cp .env.example .env
```
Nội dung file `.env` chuẩn mẫu:
```env
DB_NAME=freelance_db
DB_USER=freelance_user
DB_PASSWORD=SecretPassword2026!
DB_PORT=5432

JWT_SECRET=9a7f8e3b2c1d0f5e4a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f
JWT_EXPIRATION_MS=86400000

BACKEND_PORT=8080
FRONTEND_PORT=3000
```

### Bước 2: Khởi động toàn bộ hệ thống
Chạy lệnh biên dịch và khởi chạy 3 container:
```bash
docker-compose up -d --build
```

### Bước 3: Kiểm tra trạng thái các container
```bash
docker-compose ps
```

### Bước 4: Truy cập ứng dụng
- **Giao diện Web (Frontend):** `http://localhost:3000`
- **REST API Backend:** `http://localhost:8080/api/v1`
- **Swagger UI API Docs:** `http://localhost:8080/swagger-ui.html`
- **Cơ sở dữ liệu PostgreSQL:** `localhost:5432`

---

## 3. TRIỂN KHAI THỦ CÔNG (LOCAL DEVELOPMENT)

### 3.1. Khởi động Cơ sở dữ liệu PostgreSQL
Tạo cơ sở dữ liệu và nạp dữ liệu khởi tạo:
```bash
# Đăng nhập psql và chạy script
psql -U postgres -c "CREATE DATABASE freelance_db;"
psql -U postgres -d freelance_db -f database/schema.sql
psql -U postgres -d freelance_db -f database/seed.sql
```

### 3.2. Khởi động Backend (Spring Boot)
```bash
cd backend
mvn clean spring-boot:run
```
Ứng dụng sẽ khởi động tại `http://localhost:8080`.

### 3.3. Khởi động Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Giao diện phát triển sẽ chạy tại `http://localhost:5173` (hoặc `http://localhost:3000`).

---

## 4. TÀI KHOẢN MẪU KIỂM THỬ (TEST CREDENTIALS)
Mật khẩu chung cho tất cả tài khoản mẫu: `Password123@`

| Vai trò | Email đăng nhập | Quyền hạn & Chức năng kiểm thử |
|---|---|---|
| **Admin** | `admin@freelancehub.vn` | Quản trị người dùng, khóa tài khoản, xem thống kê |
| **Employer** | `recruiter@thecoffee.vn` | Đăng tin, duyệt ứng viên, đánh giá sinh viên |
| **Employer** | `techlead@innovate.vn` | Đăng tin freelance, chấp nhận ứng viên |
| **Student** | `sinhvien.tai@vanlanguni.vn` | Nộp đơn, xem đơn trúng tuyển, đánh giá NTD |
| **Student** | `sinhvien.khoi@vanlanguni.vn` | Tìm việc, lọc tin, nộp đơn ứng tuyển mới |
| **Student** | `sinhvien.long@vanlanguni.vn` | Cập nhật hồ sơ sinh viên, theo dõi đơn |

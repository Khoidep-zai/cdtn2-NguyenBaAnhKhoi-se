# TÀI LIỆU QUẢN TRỊ CƠ SỞ DỮ LIỆU (DATABASE GUIDE)

**Học phần:** Chuyên đề tốt nghiệp 2 — Nhóm 8  
**Hỗ trợ:** Cả 2 hệ quản trị cơ sở dữ liệu **MySQL** và **PostgreSQL**  

---

## 1. DANH MỤC FILE KỊCH BẢN SQL

### A. Dành cho MySQL (Port 3306)
- [mysql_init.sql](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/database/mysql_init.sql): Kịch bản hoàn chỉnh (tạo database `freelance_db`, tạo bảng UTF-8 mb4, thiết lập chỉ mục Index, nạp dữ liệu mẫu).
- [mysql_schema.sql](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/database/mysql_schema.sql): Chỉ tạo cấu trúc 7 bảng dữ liệu và khóa ngoại.
- [mysql_seed.sql](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/database/mysql_seed.sql): Nạp tài khoản Admin, Nhà tuyển dụng, Sinh viên và bài đăng tuyển dụng mẫu.

### B. Dành cho PostgreSQL (Port 5433 / 5432)
- [postgres_init.sql](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/database/postgres_init.sql): Kịch bản khởi tạo toàn diện cho PostgreSQL.
- [schema.sql](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/database/schema.sql): Định nghĩa schema cho PostgreSQL.
- [seed.sql](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/database/seed.sql): Dữ liệu mẫu cho PostgreSQL.

---

## 2. THÔNG TIN KẾT NỐI VÀ MẬT KHẨU (PASSWORD: 12345)

### 🗄️ MySQL (Khuyến nghị)
- **Host:** `localhost`
- **Port:** `3306`
- **Database:** `freelance_db`
- **User:** `root` (hoặc `freelance_user`)
- **Password:** `12345`
- **Lệnh import nhanh CLI:**
  ```bash
  mysql -u root -p12345 freelance_db < database/mysql_init.sql
  ```

### 🐘 PostgreSQL
- **Host:** `localhost`
- **Port:** `5433` (hoặc `5432` trên Docker)
- **Database:** `freelance_db`
- **User:** `postgres`
- **Password:** `12345`
- **Lệnh import nhanh CLI:**
  ```bash
  psql -U postgres -p 5433 -d freelance_db -f database/postgres_init.sql
  ```

---

## 3. CÁCH CHUYỂN ĐỔI GIỮA MYSQL VÀ POSTGRESQL

### Cách 1: Sử dụng File chạy nhanh (Windows)
- Chạy với MySQL: Nhấp đúp vào [run-mysql.bat](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/run-mysql.bat)
- Chạy với PostgreSQL: Nhấp đúp vào [run-postgres.bat](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/run-postgres.bat)
- Menu tương tác: Nhấp đúp vào [run.bat](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/run.bat)

### Cách 2: Cấu hình qua file [.env](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/.env)
Chỉ cần đổi biến `SPRING_PROFILES_ACTIVE`:
- Dùng MySQL: `SPRING_PROFILES_ACTIVE=mysql` (DB_PORT=3306, DB_USER=root, DB_PASSWORD=12345)
- Dùng PostgreSQL: `SPRING_PROFILES_ACTIVE=postgres` (DB_PORT=5433, DB_USER=postgres, DB_PASSWORD=12345)

### Cách 3: Docker Compose
```bash
# Khởi động toàn bộ container
docker-compose up -d --build
```
Hệ thống Docker Compose đã tích hợp sẵn cả 2 service `mysql_db` (port 3306) và `postgres_db` (port 5432) với mật khẩu `12345`.

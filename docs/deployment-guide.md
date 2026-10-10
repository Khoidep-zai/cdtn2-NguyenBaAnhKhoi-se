# HƯỚNG DẪN TRIỂN KHAI VÀ VẬN HÀNH (DEPLOYMENT & RUN GUIDE)

**Dự án:** Student Freelance & Part-time Job Marketplace  
**Nhóm thực hiện:** Nhóm 8 (261_71ITGR40303_04) — Chuyên đề tốt nghiệp 2  
**Phiên bản:** v1.2  

---

## 1. YÊU CẦU MÔI TRƯỜNG (PREREQUISITES)

Tùy theo phương án chạy, máy tính cần đáp ứng một trong các điều kiện sau:
- **Phương án Docker:** Đã cài đặt Docker Desktop (hoặc Docker Engine >= 24.x + Docker Compose >= 2.20).
- **Phương án Cục bộ (Local):**
  - Java JDK >= 17 (khuyến nghị JDK 17 hoặc 21).
  - Node.js >= 18.x và npm.
  - Cơ sở dữ liệu: **MySQL >= 8.x** (Port 3306) hoặc **PostgreSQL >= 15.x/18.x** (Port 5433/5432) với mật khẩu chuẩn hóa `12345`.

---

## 2. CÁC PHƯƠNG ÁN KHỞI CHẠY HỆ THỐNG

### Phương án 1: Khởi chạy 1-Click bằng file Batch (Khuyên dùng cho Windows)
Hệ thống cung cấp sẵn các kịch bản 1-click chuyên biệt cho từng loại cơ sở dữ liệu:
1. **Chạy với MySQL:** Nhấp đúp vào `run-mysql.bat`. Hệ thống kết nối MySQL port 3306 (user `root`, pass `12345`), nạp 1.470+ việc làm và tự bật trình duyệt web.
2. **Chạy với PostgreSQL:** Nhấp đúp vào `run-postgres.bat`. Hệ thống kết nối PostgreSQL port 5433 (user `postgres`, pass `12345`), nạp 1.470+ việc làm và tự bật trình duyệt web.
3. **Menu lựa chọn tương tác:** Nhấp đúp vào `run.bat` để chọn nhanh chế độ khởi chạy mong muốn.

### Phương án 2: Khởi chạy 1-Click trên IntelliJ IDEA
Dự án đã thiết lập sẵn Run Configuration tại `.idea/runConfigurations/`:
1. Mở thư mục dự án bằng **IntelliJ IDEA**.
2. Trên thanh công cụ trên cùng, chọn cấu hình mong muốn:
   - **`🚀 Run Project with MySQL`**: Khởi chạy đồng thời BE (MySQL) + FE.
   - **`🚀 Run Project with PostgreSQL`**: Khởi chạy đồng thời BE (PostgreSQL) + FE.
   - **`🚀 Run Full Project (BE + FE)`**: Cấu hình khởi chạy mặc định.
3. Nhấp nút **Run (▶)** (hoặc nhấn `Shift + F10`). Cả Backend và Frontend sẽ tự động khởi động và mở trình duyệt web.

### Phương án 3: Khởi chạy trọn gói bằng Docker Compose
Dành cho môi trường đóng gói độc lập:
1. Sao chép file cấu hình môi trường:
   ```bash
   cp .env.example .env
   ```
2. Khởi chạy toàn bộ cụm container (hỗ trợ đồng thời cả `mysql_db` port 3306 và `postgres_db` port 5432):
   ```bash
   docker-compose up -d --build
   ```
3. Kiểm tra trạng thái hoạt động:
   ```bash
   docker-compose ps
   ```

### Phương án 4: Khởi chạy thủ công từng dịch vụ (Manual CLI)
1. **Khởi động Backend:**
   - Với MySQL:
     ```bash
     cd backend
     mvn spring-boot:run -Dspring-boot.run.profiles=mysql
     ```
   - Với PostgreSQL:
     ```bash
     cd backend
     mvn spring-boot:run -Dspring-boot.run.profiles=postgres
     ```
   *Backend chạy tại:* `http://localhost:8080/api/v1`
2. **Khởi động Frontend:**
   ```bash
   cd frontend
   npm.cmd install
   npm.cmd run dev
   ```
   *Frontend chạy tại:* `http://localhost:3000`

---

## 3. ĐỊA CHỈ TRUY CẬP VÀ CỔNG KẾT NỐI (NETWORK PORTS)

| Dịch vụ | Địa chỉ truy cập | Ghi chú |
|---|---|---|
| **Giao diện Web (Frontend)** | `http://localhost:3000` | Trang giao diện chính thức cho người dùng |
| **REST API (Backend)** | `http://localhost:8080/api/v1` | Cổng API gốc phục vụ trao đổi dữ liệu |
| **Tài liệu Swagger UI** | `http://localhost:8080/swagger-ui.html` | Giao diện tra cứu và tương tác API trực quan |
| **Cơ sở dữ liệu MySQL** | `localhost:3306` | DB: `freelance_db`, User: `root`, Pass: `12345` (1.470 jobs) |
| **Cơ sở dữ liệu PostgreSQL** | `localhost:5433` (Local) / `5432` (Docker) | DB: `freelance_db`, User: `postgres`, Pass: `12345` (1.470 jobs) |

---

## 4. TÀI KHOẢN MẪU DÙNG THỬ (DEMO CREDENTIALS)

> **Mật khẩu chung cho tất cả các tài khoản mẫu:** `Password123@`

| Vai trò | Email đăng nhập | Tên người dùng | Kịch bản kiểm thử đề xuất |
|---|---|---|---|
| **Quản trị viên** | `admin@freelancehub.vn` | Quản Trị Viên Nhóm 8 | Xem thống kê KPI, khóa/mở khóa tài khoản, xóa tin vi phạm |
| **Nhà tuyển dụng** | `recruiter@thecoffee.vn` | Nguyễn Thị Tuyết (The Coffee House) | Đăng tin part-time, quản lý tin của tôi, đổi trạng thái tin |
| **Nhà tuyển dụng** | `techlead@innovate.vn` | Trần Văn Minh (Innovate Studio) | Xem danh sách ứng viên, duyệt/từ chối đơn, đánh giá sinh viên |
| **Sinh viên** | `sinhvien.tai@vanlanguni.vn` | Nguyễn Tấn Tài | Xem đơn đã được duyệt, thực hiện đánh giá NTD sau hoàn thành |
| **Sinh viên** | `sinhvien.khoi@vanlanguni.vn` | Nguyễn Bá Anh Khôi | Tìm kiếm/lọc tin, nộp hồ sơ ứng tuyển mới kèm link CV |
| **Sinh viên** | `sinhvien.long@vanlanguni.vn` | Hoàng Bảo Long | Cập nhật hồ sơ kỹ năng, xem danh sách thông báo hệ thống |

---

## 5. XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

1. **Lỗi cổng 8080 hoặc 3000 bị chiếm dụng:**
   - Kiểm tra tiến trình đang chạy trên Windows: `netstat -ano | findstr :8080`
   - Đóng tiến trình chiếm cổng: `taskkill /F /PID <PID>`
2. **Không kết nối được PostgreSQL khi chạy cục bộ:**
   - Backend được cấu hình tự động dự phòng: Nếu không phát hiện PostgreSQL chạy tại cổng 5432, Spring Boot sẽ tự kích hoạt CSDL H2 In-Memory và nạp dữ liệu mẫu để việc demo không bị gián đoạn.
3. **Dọn dẹp cụm Docker khi muốn chạy lại từ đầu:**
   ```bash
   docker-compose down -v
   docker-compose up -d --build
   ```

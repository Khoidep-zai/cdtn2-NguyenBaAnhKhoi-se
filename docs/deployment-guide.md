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
  - PostgreSQL >= 15.x (hoặc hệ thống sẽ tự động dùng H2 In-Memory nếu chưa cài PostgreSQL).

---

## 2. CÁC PHƯƠNG ÁN KHỞI CHẠY HỆ THỐNG

### Phương án 1: Khởi chạy 1-Click bằng `run.bat` (Khuyên dùng cho Windows)
Đây là cách nhanh nhất và thuận tiện nhất để demo chấm bài trên máy tính Windows:
1. Mở thư mục gốc của dự án: `cdtn2-NguyenBaAnhKhoi-se`.
2. **Nhấp đúp chuột vào file `run.bat`** (hoặc mở PowerShell/CMD và gõ `./run.bat`).
3. Kịch bản sẽ tự động:
   - Khởi động Backend Spring Boot tại `http://localhost:8080/api/v1`.
   - Khởi động Frontend React Vite tại `http://localhost:3000`.
   - **Tự động mở trình duyệt Web** tại trang chủ `http://localhost:3000`.

### Phương án 2: Khởi chạy 1-Click trên IntelliJ IDEA
Dự án đã thiết lập sẵn Run Configuration tại `.idea/runConfigurations/`:
1. Mở thư mục dự án bằng **IntelliJ IDEA**.
2. Trên thanh công cụ trên cùng, chọn cấu hình: **`🚀 Run Full Project (BE + FE)`**.
3. Nhấp nút **Run (▶)** (hoặc nhấn `Shift + F10`).
4. IntelliJ sẽ khởi động đồng thời Backend và Frontend, sau đó tự động bật trình duyệt web. Khi bấm **Stop (■)**, cả hai dịch vụ sẽ tự động tắt an toàn.

### Phương án 3: Khởi chạy trọn gói bằng Docker Compose
Dành cho môi trường đóng gói độc lập:
1. Sao chép file cấu hình môi trường:
   ```bash
   cp .env.example .env
   ```
2. Khởi chạy toàn bộ cụm 3 container (Database, Backend, Frontend):
   ```bash
   docker-compose up -d --build
   ```
3. Kiểm tra trạng thái hoạt động:
   ```bash
   docker-compose ps
   ```

### Phương án 4: Khởi chạy thủ công từng dịch vụ (Manual CLI)
1. **Khởi động Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   *Backend chạy tại:* `http://localhost:8080/api/v1`
2. **Khởi động Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend chạy tại:* `http://localhost:3000`

---

## 3. ĐỊA CHỈ TRUY CẬP VÀ CỔNG KẾT NỐI (NETWORK PORTS)

| Dịch vụ | Địa chỉ truy cập | Ghi chú |
|---|---|---|
| **Giao diện Web (Frontend)** | `http://localhost:3000` | Trang giao diện chính thức cho người dùng |
| **REST API (Backend)** | `http://localhost:8080/api/v1` | Cổng API gốc phục vụ trao đổi dữ liệu |
| **Tài liệu Swagger UI** | `http://localhost:8080/swagger-ui.html` | Giao diện tra cứu và tương tác API trực quan |
| **Cơ sở dữ liệu PostgreSQL** | `localhost:5432` | DB: `freelance_db`, User: `freelance_user` |

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

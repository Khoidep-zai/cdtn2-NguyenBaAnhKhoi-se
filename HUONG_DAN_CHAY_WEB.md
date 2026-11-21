# 📖 HƯỚNG DẪN KHỞI CHẠY VÀ NGHIỆM THU DỰ ÁN FREELANCEHUB

> **Dự án:** Sàn giao dịch việc làm bán thời gian và việc làm linh hoạt cho sinh viên (`FreelanceHub`)  
> **Học phần:** Chuyên Đề Tốt Nghiệp 2 - Nhóm 8 - Trường Đại học Văn Lang  
> **Thư mục làm việc độc lập:** `C:\Users\windows\Downloads\FreelanceHub_Tai`  
> **Thời điểm nghiệm thu:** Tháng 11/2026

---

## 🚀 1. CÁCH KHỞI ĐỘNG HỆ THỐNG (1-CLICK DUY NHẤT)

Tại thư mục gốc của project `C:\Users\windows\Downloads\FreelanceHub_Tai`:

1. **Nhấp đúp chuột vào file:**
   ```
   CHAY_FREELANCEHUB.bat
   ```
2. **Kịch bản tự động thực hiện:**
   - 🔍 Tự kiểm tra MySQL XAMPP trên cổng `3306` (nếu chưa chạy sẽ tự kích hoạt ngầm).
   - 🔌 Tự kiểm tra Backend Spring Boot trên cổng `8080` (nếu chưa chạy sẽ khởi động từ file JAR tối ưu hóa).
   - ⏳ Chờ Backend sẵn sàng và phản hồi dữ liệu API.
   - ⚛️ Tự kiểm tra Frontend React + Vite trên cổng `3000` (nếu chưa chạy sẽ kích hoạt dev server).
   - 🌐 Tự động mở trình duyệt mặc định truy cập thẳng vào trang chủ:
     👉 **`http://localhost:3000`**
   - 🛡️ **Cơ chế chống mở trùng:** Nếu dịch vụ nào đã chạy trước đó, file bat sẽ giữ nguyên dịch vụ đó, không tắt đột ngột và không mở chồng lấn tiến trình mới.

---

## 🛠️ 2. CÁCH KHỞI ĐỘNG THỦ CÔNG (TÙY CHỌN CHO DEVELOPER)

Nếu muốn khởi động hoặc kiểm tra từng thành phần độc lập trong các terminal riêng biệt:

### Bước 1: Khởi động MySQL (XAMPP)
- Mở **XAMPP Control Panel** ➔ Bấm **Start** tại mục **MySQL** (cổng `3306`).
- Hoặc chạy qua dòng lệnh PowerShell:
  ```powershell
  Start-Process "C:\xampp\mysql\bin\mysqld.exe" "--defaults-file=C:\xampp\mysql\bin\my.ini --standalone" -WindowStyle Hidden
  ```

### Bước 2: Khởi động Backend (Spring Boot 3.2.x, Java 21)
- Chạy trực tiếp từ file JAR đã đóng gói sẵn:
  ```powershell
  & "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot\bin\java.exe" -jar backend/target/freelance-platform-1.0.0.jar --spring.profiles.active=mysql
  ```
- Hoặc chạy qua file script: `1_CHAY_BACKEND.bat`
- Cổng Backend API: **`http://localhost:8080/api/v1`**
- Tài liệu Swagger UI: **`http://localhost:8080/api/v1/swagger-ui.html`**

### Bước 3: Khởi động Frontend (React 18 + Vite + TypeScript)
- Mở terminal tại thư mục `frontend`:
  ```powershell
  cd frontend
  npm run dev
  ```
- Hoặc chạy qua file script: `2_CHAY_FRONTEND.bat`
- Cổng giao diện Web: **`http://localhost:3000`**

---

## 🔑 3. DANH SÁCH TÀI KHOẢN MẪU ĐỂ NGHIỆM THU

> **Mật khẩu chung cho tất cả tài khoản mẫu:** `Password123@`

| Vai trò (Role) | Email đăng nhập | Tên người dùng | Mục đích kiểm thử / Nghiệm thu |
|---|---|---|---|
| 🎓 **Sinh viên 1** | `sinhvien.khoi@vanlanguni.vn` | Nguyễn Bá Anh Khôi | Nghiệm thu Hồ sơ 12 khu vực, Ứng tuyển việc làm, Tab Lịch sử việc làm, Xác nhận hoàn thành 2 chiều |
| 🎓 **Sinh viên 2** | `sinhvien.tai@vanlanguni.vn` | Phạm Công Tài | Kiểm thử ứng tuyển chéo, đa tài khoản sinh viên |
| 🏢 **Nhà tuyển dụng 1** | `recruiter@thecoffee.vn` | Nguyễn Thị Tuyết (The Coffee House) | Đăng tin có ca/thứ, Duyệt ứng viên, Xem hồ sơ sinh viên 12 khu vực, Xác nhận hoàn thành việc làm |
| 🏢 **Nhà tuyển dụng 2** | `techlead@innovate.vn` | Trần Văn Minh (Innovate Studio) | Kiểm thử đăng việc Freelance dự án, duyệt ứng viên |
| 👑 **Quản trị viên** | `admin@freelancehub.vn` | Quản Trị Viên Nhóm 8 | Quản trị toàn quyền, xem báo cáo, kiểm duyệt tin |

---

## 🎯 4. HƯỚNG DẪN NGHIỆM THU CHI TIẾT 5 TÍNH NĂNG MỚI

### Tính năng 1: Hồ sơ sinh viên chuyên nghiệp 12 khu vực (`StudentProfilePage`)
1. Đăng nhập bằng tài khoản sinh viên: `sinhvien.khoi@vanlanguni.vn` / `Password123@`.
2. Bấm vào Avatar góc trên bên phải ➔ Chọn **"Hồ sơ sinh viên"** (hoặc truy cập URL: `http://localhost:3000/profile`).
3. **Kiểm tra 12 khu vực dữ liệu:**
   - 1️⃣ Thông tin định danh & Avatar cá nhân
   - 2️⃣ Mục tiêu nghề nghiệp (Career Objective)
   - 3️⃣ Trình độ học vấn & Niên khóa (Education Level)
   - 4️⃣ Trường đại học & Chuyên ngành đào tạo
   - 5️⃣ Điểm trung bình tích lũy GPA
   - 6️⃣ Kỹ năng chuyên môn & Kỹ năng mềm (Tags linh hoạt)
   - 7️⃣ Trình độ ngoại ngữ (Languages - IELTS, TOEIC, v.v.)
   - 8️⃣ Kinh nghiệm làm việc thực tế (Work Experiences)
   - 9️⃣ Lịch sử công việc đã được xác thực (Verified Work History từ NTD)
   - 🔟 Dự án cá nhân & Portfolio tiêu biểu (Portfolio Projects có link đính kèm)
   - 1️⃣1️⃣ Chứng chỉ & Giải thưởng (Certificates & Awards)
   - 1️⃣2️⃣ Lịch rảnh trong tuần có thể nhận việc (Available Schedule theo ma trận Thứ & Buổi)
4. Thử chỉnh sửa thông tin, thêm mục mới và bấm **"Lưu hồ sơ"** ➔ Thông báo cập nhật thành công, thanh % hoàn thiện hồ sơ tự động tính toán tăng lên.
5. **Chế độ xem công khai (Read-only cho NTD):**
   - Đăng nhập tài khoản NTD (`recruiter@thecoffee.vn`).
   - Vào xem hồ sơ sinh viên tại đường dẫn: `http://localhost:3000/students/5`.
   - Kiểm tra: Hiển thị banner bảo mật màu xanh lam xác thực chế độ NTD xem hồ sơ ứng viên, toàn bộ form bị khóa chống can thiệp (disabled inputs), số điện thoại và email hiển thị rõ ràng.

---

### Tính năng 2: Đăng tuyển việc làm với Ca và Thứ trong tuần (`PostJobPage`)
1. Đăng nhập tài khoản Nhà tuyển dụng: `recruiter@thecoffee.vn` / `Password123@`.
2. Bấm nút **"Đăng tin tuyển dụng"** trên thanh điều hướng (hoặc truy cập `http://localhost:3000/post-job`).
3. Điền thông tin cơ bản: Tiêu đề công việc, danh mục, hình thức, mức lương, địa điểm.
4. Cuộn xuống khu vực **"Lịch làm việc & Ca trực chi tiết"**:
   - Chọn các thứ trong tuần (Thứ 2, Thứ 4, Thứ 6...).
   - Đặt giờ bắt đầu (VD: `08:00`) và giờ kết thúc (VD: `12:00`) hoặc chọn "Linh hoạt theo lịch học của sinh viên".
   - Thêm nhiều ca làm việc khác nhau cho công việc.
5. Bấm **"Đăng tin ngay"** ➔ Tin tuyển dụng lưu vào MySQL với các bản ghi liên kết trong bảng `job_shifts`.

---

### Tính năng 3: Tìm kiếm và Lọc việc làm theo Thứ và Khung giờ (`JobBrowsePage`)
1. Mở trang tìm việc: `http://localhost:3000/jobs`.
2. Kiểm tra bộ lọc tại thanh bên trái / phía trên danh sách:
   - **Lọc theo Thứ trong tuần:** Chọn Thứ 2, Thứ 3, Thứ 7, Chủ Nhật...
   - **Lọc theo Khung giờ làm việc:** Chọn Ca sáng (06h-12h), Ca chiều (12h-18h), Ca tối (18h-23h), hoặc Linh hoạt.
3. Bấm Lọc ➔ Kết quả lọc tức thời, bảo toàn danh sách việc làm và không làm ảnh hưởng đến các tin việc làm cũ (tin cũ không có ca làm việc vẫn được bảo lưu nguyên vẹn).

---

### Tính năng 4: Quản lý ứng viên & Xác nhận hoàn thành việc làm (`ApplicantsPage`)
1. Đăng nhập tài khoản NTD: `recruiter@thecoffee.vn` / `Password123@`.
2. Vào trang **"Quản lý tuyển dụng"** hoặc **"Danh sách ứng viên"** (`http://localhost:3000/manage-jobs` hoặc `http://localhost:3000/applicants`).
3. Đối với mỗi ứng viên đã được chấp thuận (`ACCEPTED`):
   - Có nút **"Xem hồ sơ 12 khu vực"** ➔ Mở modal hoặc chuyển trang xem toàn bộ chi tiết năng lực ứng viên.
   - Có nút **"Xác nhận hoàn thành việc"**: Bấm vào sẽ hiện popup:
     - Chọn ngày hoàn thành thực tế.
     - Đánh giá sao (1 ⭐ đến 5 ⭐).
     - Viết nhận xét năng lực, thái độ của sinh viên.
     - Xác nhận ➔ Backend tạo bản ghi snapshot trong bảng `work_histories` với trạng thái `PENDING_STUDENT_CONFIRM`.

---

### Tính năng 5: Sinh viên theo dõi đơn & Lịch sử việc làm 2 chiều (`MyApplicationsPage`)
1. Đăng nhập tài khoản sinh viên: `sinhvien.khoi@vanlanguni.vn` / `Password123@`.
2. Vào trang **"Đơn ứng tuyển của tôi"** (`http://localhost:3000/my-applications`).
3. **Bộ chuyển Tab 2 cấp độ:**
   - **Tab 1: "Đơn ứng tuyển":** Xem danh sách các công việc đã nộp hồ sơ và trạng thái xử lý (Đang chờ, Đã duyệt, Đã hoàn thành).
   - **Tab 2: "Lịch sử việc làm & Đánh giá":** Hiển thị những công việc sinh viên đã làm việc thực tế.
4. **Xác nhận 2 chiều:**
   - Khi NTD đã xác nhận hoàn thành, sinh viên thấy công việc hiển thị số sao và nhận xét của NTD.
   - Sinh viên có nút **"Xác nhận hoàn thành"** hoặc **"Khiếu nại nếu có sai sót"**.
   - Khi sinh viên xác nhận ➔ Công việc chuyển sang trạng thái `COMPLETED` và tự động gắn kết vào hồ sơ năng lực 12 khu vực của sinh viên.

---

## 📊 5. TỔNG KẾT THÔNG SỐ VÀ KẾT QUẢ KIỂM THỬ THỰC TẾ

| Hạng mục kiểm tra | Kết quả thực tế | Ghi chú kỹ thuật |
|---|---|---|
| **Cơ sở dữ liệu MySQL** | `freelance_db` trên port `3306` | Kết nối thành công qua HikariCP Connection Pool |
| **Bảo toàn dữ liệu cũ** | **1.472 Jobs** & **16 Categories** | Bảo lưu 100% dữ liệu gốc, không bị mất hoặc sai lệch |
| **Cấu trúc bảng mới** | `job_shifts`, `student_profiles`, `work_histories` | Đã khởi tạo đầy đủ cột và index tối ưu hóa |
| **Backend Unit & Integration Tests** | **75/75 PASS (100%)** | 0 Failures, 0 Errors, 0 Skipped |
| **Frontend Production Build** | **Vite build PASS (100%)** | 0 lỗi TypeScript, 0 cảnh báo linting |
| **REST API Status** | HTTP 200 OK trên mọi endpoints | Đã kiểm thử live Login, Jobs, Categories, Profile |
| **Giao diện Web** | HTTP 200 OK trên `http://localhost:3000` | Tự động mở trình duyệt, hỗ trợ Dark/Light & VI/EN |

---
*FreelanceHub System - Developed independently in FreelanceHub_Tai - All tests passed.*

# 🚀 FREELANCEHUB - BẢN CẬP NHẬT TÍNH NĂNG & DỮ LIỆU KIỂM THỬ (21/11/2026 PHẠM CÔNG TÀI)

> **Người thực hiện:** Phạm Công Tài (Tech Lead & Frontend Engineer - Nhóm 8)  
> **Ngày cập nhật:** 21/11/2026  
> **Nhánh Git triển khai:** `Test` (Repository: `cdtn2-NguyenBaAnhKhoi-se`)  
> **Dự án:** Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường Đại học Văn Lang  
> **Stack công nghệ:** Spring Boot 3.2.x (Java 17/21) + React 18 (TypeScript, Vite) + MySQL 8 / PostgreSQL 16  

---

## 📌 1. TỔNG QUAN ĐỢT ĐẨY MÃ NGUỒN & DỮ LIỆU (CHANGELOG)

Bản cập nhật này bổ sung và hoàn thiện toàn bộ **giao diện người dùng (Frontend)**, **hệ thống API nghiệp vụ (Backend)** và **cấu trúc cơ sở dữ liệu (Database)** để bạn Khôi và Long có thể trực tiếp kiểm thử nghiệm thu trên nhánh `Test`:

1. **Tìm kiếm & Lọc việc làm theo Lịch làm việc (`JobBrowsePage`):** Lọc theo thứ trong tuần, ca sáng/chiều/tối/linh hoạt, giờ tùy chỉnh và ca qua đêm. Bảo toàn 100% 1.472 jobs gốc.
2. **Đăng tin tuyển dụng kèm Ca làm việc (`PostJobPage`):** Nhà tuyển dụng thiết lập thứ, ca làm và khung giờ làm việc linh hoạt; lưu trữ chuẩn quan hệ vào bảng `job_shifts`.
3. **Hồ sơ sinh viên chuyên nghiệp 12 khu vực (`StudentProfilePage`):** Hoàn thiện 12 khu vực thông tin chuẩn quốc tế, có thanh đo % hoàn thiện hồ sơ.
4. **Quản lý ứng viên & Xác nhận hoàn thành công việc 2 chiều (`ApplicantsPage` & `WorkHistory`):** Duyệt ứng viên, kích hoạt email thông báo tự động, đánh giá sao, xác nhận hoàn thành 2 chiều giữa nhà tuyển dụng và sinh viên.
5. **Sinh viên theo dõi đơn & lịch sử việc làm (`MyApplicationsPage`):** Quản lý trạng thái đơn ứng tuyển realtime và bấm xác nhận công việc vào hồ sơ.
6. **Bộ dữ liệu kiểm thử & CSDL hoàn chỉnh:** Đi kèm 1.472 jobs gốc, 6 jobs thử nghiệm có ca làm việc, file DDL migration và script dọn dẹp dữ liệu an toàn.

---

## 🎯 2. CHI TIẾT CÁC TÍNH NĂNG MỚI TRIỂN KHAI

### 2.1. Tìm kiếm & Lọc việc theo Lịch làm việc (`JobBrowsePage`)
* **Endpoint API:** `GET /api/v1/jobs?daysOfWeek=...&shiftType=...&startTime=...&endTime=...`
* **Giao diện:** Tích hợp bộ chọn thứ trong tuần (Thứ 2 đến Chủ nhật), các nút chọn nhanh ca làm việc (Ca Sáng, Ca Chiều, Ca Tối, Lịch Linh Hoạt), và ô nhập khung giờ bắt đầu/kết thúc.
* **Xử lý đặc biệt:**
  * Hỗ trợ ca làm qua đêm (Ví dụ: `22:00:00` đến `06:00:00`).
  * Ca có giờ bắt đầu bằng giờ kết thúc.
  * Khi không chọn bộ lọc, hệ thống tự động hiển thị đầy đủ toàn bộ 1.472 việc làm gốc mà không yêu cầu việc cũ phải có ca làm.

### 2.2. Đăng tin tuyển dụng kèm Ca làm (`PostJobPage`)
* **Endpoint API:** `POST /api/v1/jobs` (kèm danh sách `shifts`)
* **Bảng dữ liệu:** `job_shifts` (liên kết khóa ngoại `job_id` với bảng `jobs`).
* **Khả năng:** Nhà tuyển dụng có thể thêm động không giới hạn số ca làm việc cho một tin tuyển dụng (chọn thứ trong tuần, chọn loại ca, chọn giờ cụ thể hoặc đánh dấu linh hoạt).

### 2.3. Hồ sơ sinh viên chuyên nghiệp 12 khu vực (`StudentProfilePage`)
* **Endpoint API:** `GET /api/v1/student-profile/me`, `PUT /api/v1/student-profile`
* **Đường dẫn xem hồ sơ công khai:** `/students/:id` hoặc `/student-profile/:id`
* **12 Khu vực bao gồm:**
  1. 👤 **Thông tin cơ bản & Ảnh đại diện:** Họ tên, email, số điện thoại, địa chỉ, ảnh đại diện.
  2. 🎯 **Giới thiệu bản thân & Mục tiêu:** Bio tóm tắt năng lực và mục tiêu nghề nghiệp.
  3. 🎓 **Học vấn:** Trường đại học, chuyên ngành, hệ đào tạo, niên khóa, điểm GPA.
  4. 💻 **Kỹ năng chuyên môn:** Danh sách tags kỹ năng có mức độ thành thạo (Cơ bản, Khá, Thành thạo).
  5. 💼 **Kinh nghiệm việc làm đã xác thực:** Tự động đồng bộ từ các công việc đã hoàn thành được Nhà tuyển dụng xác nhận (Snapshot Pattern).
  6. 🚀 **Dự án tiêu biểu:** Tên dự án, vai trò, công nghệ sử dụng, link GitHub / Demo.
  7. 📜 **Chứng chỉ & Giải thưởng:** Các chứng chỉ chuyên môn, giải thưởng học thuật.
  8. 🌐 **Ngoại ngữ & Trình độ:** Tiếng Anh (IELTS/TOEIC), Tiếng Nhật, Tiếng Hàn...
  9. 🤝 **Hoạt động ngoại khóa & Tình nguyện:** Hoạt động Đoàn - Hội, câu lạc bộ.
  10. 💡 **Sở thích & Điểm mạnh cá nhân:** Soft skills và phong cách làm việc.
  11. 📄 **Tài liệu đính kèm (CV / Portfolio):** Link tải CV định dạng PDF / Portfolio cá nhân.
  12. 🔗 **Liên kết mạng xã hội chuyên nghiệp:** GitHub, LinkedIn, Facebook, Personal Blog.
* **Thanh tiến độ:** Tự động tính toán tỷ lệ hoàn thiện hồ sơ từ 0% đến 100% kèm gợi ý điền thông tin.

### 2.4. Quản lý ứng viên & Xác nhận hoàn thành 2 chiều (`WorkHistory`)
* **Quy trình hoàn chỉnh:**
  1. Sinh viên nộp đơn ứng tuyển (`POST /api/v1/applications`) -> Trạng thái ban đầu `PENDING`. Máy chủ tự động chặn nếu nộp đơn trùng lặp (HTTP 400).
  2. Nhà tuyển dụng xem chi tiết hồ sơ 12 khu vực của sinh viên (`GET /api/v1/student-profile/{studentId}`) và duyệt nhận (`PUT /api/v1/applications/{id}/status` với `ACCEPTED`).
  3. Hệ thống kích hoạt gửi **Email thông báo chúc mừng tự động** tới sinh viên thông qua Spring `@EventListener`.
  4. Sau khi hoàn thành công việc, Nhà tuyển dụng đánh giá từ 1 đến 5 sao, ghi nhận xét và bấm xác nhận hoàn tất -> Tạo bản ghi `work_histories` trạng thái `PENDING_STUDENT_CONFIRM`.
  5. Sinh viên vào trang `MyApplicationsPage` bấm nút **"Xác nhận vào hồ sơ"** -> Trạng thái chuyển `COMPLETED`, cờ `student_confirmed = true`.
  6. Công việc hoàn thành lập tức hiển thị công khai trên mục 5 của Hồ sơ sinh viên với dấu tích xanh xác thực.
  7. Cơ chế bảo vệ: Chặn bấm xác nhận 2 lần (Double confirmation) và chặn nhà tuyển dụng sửa trái phép hồ sơ sinh viên (IDOR Prevention: HTTP 403 Forbidden).

---

## 🗄️ 3. DỮ LIỆU CƠ SỞ DỮ LIỆU & BẢO TOÀN DỮ LIỆU GỐC

Trong thư mục `database/` đã có đầy đủ các tệp mã nguồn CSDL:

| Tệp tin | Mô tả & Mục đích |
|---|---|
| `database/mysql_init.sql` | Chứa toàn bộ cấu trúc CSDL và **1.472 công việc gốc** cùng 16 danh mục nghề nghiệp tiếng Việt. |
| `database/upgrade_v2_features.sql` | DDL tạo mới 3 bảng `job_shifts`, `student_profiles`, `work_histories` và các index tối ưu hóa. *(Lưu ý: Spring Boot có `ddl-auto: update` nên sẽ tự động tạo bảng nếu chưa có)*. |
| `database/seed_test_data.sql` | Bộ dữ liệu thử nghiệm gồm 6 tin tuyển dụng có ca làm việc chi tiết (IDs: 99001 - 99006) và tài khoản test. |
| `database/cleanup_test_data.sql` | Script dọn dẹp dữ liệu test an toàn: **chỉ xóa ID >= 99000**, bảo toàn 100% các công việc gốc <= 1.472. |

---

## 🚀 4. HƯỚNG DẪN KHỞI CHẠY ĐỂ TEST NGAY (QUICK START)

### Cách 1: Khởi động 1-Click thông minh (Khuyên dùng)
Tại thư mục gốc dự án, nhấp đúp chạy tệp:
👉 **`CHAY_FREELANCEHUB.bat`**

File batch sẽ tự động:
1. Kiểm tra và kích hoạt MySQL XAMPP (Port 3306).
2. Khởi động Backend Spring Boot API (Port 8080).
3. Khởi động Frontend React Vite (Port 3000).
4. Tự động mở trình duyệt tại `http://localhost:3000`.

### Cách 2: Khởi chạy thủ công từng phần
1. **Khởi động MySQL:** Mở XAMPP Control Panel và bật MySQL (Port 3306).
2. **Khởi động Backend:**
   ```bash
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```
   *(Backend chạy tại: `http://localhost:8080/api/v1`, Swagger UI tại `http://localhost:8080/api/v1/swagger-ui.html`)*
3. **Khởi động Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *(Frontend chạy tại: `http://localhost:3000`)*

---

## 🔑 5. DANH SÁCH TÀI KHOẢN MẪU ĐỂ TEST (Mật khẩu chung: `Password123@`)

| Vai trò | Email đăng nhập | Mật khẩu | Kịch bản kiểm thử đề xuất |
|---|---|---|---|
| 👑 **Quản trị viên (Admin)** | `admin@freelancehub.vn` | `Password123@` | Quản lý người dùng, duyệt tin tuyển dụng PENDING sang OPEN |
| 🏢 **Nhà tuyển dụng** | `recruiter@thecoffee.vn`<br>*(hoặc `TEST_employer@freelancehub.vn`)* | `Password123@` | Đăng tin tuyển dụng kèm ca làm, xem ứng viên, duyệt ứng viên, đánh giá và xác nhận hoàn thành công việc |
| 🎓 **Sinh viên** | `sinhvien.khoi@vanlanguni.vn`<br>*(hoặc `TEST_student@freelancehub.vn`)* | `Password123@` | Cập nhật hồ sơ 12 khu vực, tìm kiếm lọc việc theo ca/ngày/giờ, nộp đơn ứng tuyển, xác nhận việc hoàn thành vào hồ sơ |

---

## 🧪 6. KẾT QUẢ KIỂM THỬ ĐÃ THỰC THI (QA VERIFIED)

* **Backend Unit & Integration Test:** 75 / 75 tests JUnit 5 PASS (16 test suites, 0 failures, 0 errors).
* **Frontend Production Build (`npm run build`):** BUILD SUCCESS trong 2.04s, 0 lỗi TypeScript.
* **Kiểm thử bộ lọc Lịch làm việc (`tests/test_shift_filters.ps1`):** 20 / 20 test cases PASS trên Live Server.
* **Kiểm thử Vòng đời & Phân quyền RBAC/IDOR (`tests/test_full_lifecycle.ps1`):** 20 / 20 test cases PASS trên Live Server.
* **Tổng số test cases độc lập:** **115 / 115 PASS 100%**. Chi tiết xem tại `QA_ACTUAL_TEST_RESULTS.csv` và `QA_AUDIT_REPORT.md`.

---
*Bản quyền phát triển thuộc về Nhóm 8 — Đồ án Chuyên đề tốt nghiệp 2 — Đại học Văn Lang (2026).*

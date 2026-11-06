# Quickstart Validation Guide: Part-time P0 Gap Completion & Student Safety

**Feature**: `001-parttime-p0-completion`  
**Date**: 2026-11-06  
**Status**: Ready for Verification  

---

## 1. Prerequisites & Environment Setup

1. **Backend**: JDK 17 hoặc 21, Maven wrapper hoặc Maven đã cài đặt.
2. **Database**: PostgreSQL 16 hoặc MySQL 8 hoặc H2 in-memory (mặc định cho test).
3. **Frontend**: Node.js 18+, npm.

Khởi động nhanh:
```bash
# Terminal 1: Chạy Backend (Spring Boot trên cổng 8080)
cd backend
./mvnw spring-boot:run

# Terminal 2: Chạy Frontend (Vite trên cổng 5173)
cd frontend
npm install
npm run dev
```

---

## 2. End-to-End Validation Scenarios

### Kịch bản 1: Luồng Kiểm duyệt Tin tuyển dụng (Admin Moderation Flow)
1. **Bước 1 (NTD Đăng tin):**
   - Đăng nhập tài khoản NTD (`employer@example.com` / `123456`).
   - Vào `/post-job`, điền thông tin việc làm ca tối, chọn ca `EVENING`, bấm "Đăng tin tuyển dụng".
   - **Kỳ vọng:** Tin được tạo thành công với thông báo: *"Tin tuyển dụng đã được gửi và đang chờ Ban quản trị phê duyệt."*
2. **Bước 2 (Kiểm tra công khai):**
   - Mở cửa sổ ẩn danh (Guest), truy cập `/jobs`.
   - **Kỳ vọng:** Tin vừa tạo **KHÔNG xuất hiện** trên danh sách việc làm công khai.
3. **Bước 3 (Admin Duyệt tin):**
   - Đăng nhập tài khoản Admin (`admin@freelancehub.vn` / `123456`).
   - Truy cập `/admin/jobs`, chuyển sang tab **"Tin chờ duyệt"**.
   - Thấy bài đăng mới, bấm **"Phê duyệt"**.
   - **Kỳ vọng:** Trạng thái chuyển thành `OPEN`. Mở lại trang `/jobs`, tin lập tức hiển thị công khai cho sinh viên.
   - Tài khoản NTD nhận được thông báo: *"Tin tuyển dụng của bạn đã được phê duyệt"*.

---

### Kịch bản 2: Báo cáo Vi phạm & Khóa tin Lừa đảo (Scam Report Flow)
1. **Bước 1 (Sinh viên xem tin & cảnh báo):**
   - Đăng nhập tài khoản Sinh viên (`student@example.com` / `123456`).
   - Mở xem chi tiết một tin tuyển dụng (`/jobs/:id`).
   - **Kỳ vọng:** Nhìn thấy **Banner Cảnh báo An toàn Sinh viên** màu vàng/cam nổi bật với các lưu ý không đóng cọc, không nộp CMND gốc.
2. **Bước 2 (Gửi báo cáo vi phạm):**
   - Nhấn nút **"Báo cáo tin vi phạm"**.
   - Chọn lý do: *"Yêu cầu đóng tiền đặt cọc trái phép"*, nhập mô tả: *"NTD gọi điện bảo chuyển trước 300k tiền giữ chân"*.
   - Nhấn "Gửi báo cáo".
   - **Kỳ vọng:** Modal hiển thị thông báo tiếp nhận thành công.
   - Bấm gửi lại lần 2 $\rightarrow$ Bị chặn với thông báo đã có báo cáo đang chờ xử lý.
3. **Bước 3 (Admin xử lý báo cáo):**
   - Admin truy cập `/admin/reports`.
   - Xem nội dung phản ánh, bấm **"Gỡ bỏ tin vi phạm"**.
   - **Kỳ vọng:** Tin bị gỡ bỏ ngay lập tức, không còn nhận đơn ứng tuyển mới.

---

### Kịch bản 3: Lọc nhanh theo Ca làm việc (Shift Filter Flow)
1. Truy cập `/jobs`.
2. Bấm vào chip lọc ca: **"Ca tối"**.
3. **Kỳ vọng:** Danh sách lập tức lọc các công việc có `shiftType = EVENING`. URL cập nhật param `?shiftType=EVENING`.
4. Bấm "Tất cả ca" hoặc "Xóa bộ lọc" $\rightarrow$ Hiển thị đầy đủ danh sách ban đầu.

---

### Kịch bản 4: Quên mật khẩu an toàn (Password Reset Flow)
1. Tại trang `/login`, bấm **"Quên mật khẩu?"**.
2. Nhập email: `student@example.com`, nhấn "Gửi yêu cầu".
3. **Kỳ vọng:** Thông báo chung thành công bảo mật xuất hiện.
4. Nhập mật khẩu mới cùng mã xác thực được cung cấp $\rightarrow$ Cập nhật mật khẩu thành công.
5. Đăng nhập lại với mật khẩu mới $\rightarrow$ Vào trang Dashboard thành công.


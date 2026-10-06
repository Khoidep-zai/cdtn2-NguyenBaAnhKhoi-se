# ĐẶC TẢ YÊU CẦU PHẦN MỀM (SOFTWARE REQUIREMENTS SPECIFICATION - SRS)

**Đề tài:** Nền tảng quản lý freelance & marketplace việc làm part-time cho sinh viên  
**Học phần:** Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường Đại học Văn Lang  
**Nhóm thực hiện:** Nhóm 8 (261_71ITGR40303_04)  
**Phiên bản:** 1.0 (Phát hành Sprint 1)  

---

## 1. GIỚI THIỆU (INTRODUCTION)

### 1.1. Mục đích tài liệu
Tài liệu này đặc tả chi tiết các yêu cầu chức năng (Functional Requirements) và phi chức năng (Non-Functional Requirements) của hệ thống "Student Freelance & Part-time Marketplace". Tài liệu đóng vai trò là căn cứ chuyển giao kỹ thuật giữa BA, PM, Developer và QA/Tester.

### 1.2. Đối tượng thụ hưởng & Các tác nhân (Actors)
1. **Khách vãng lai (Guest):** Người dùng chưa đăng nhập, có thể tra cứu thông tin chung, danh mục việc làm và xem chi tiết tin tuyển dụng.
2. **Sinh viên (Student - `ROLE_STUDENT`):** Người tìm việc làm thêm hoặc công việc dự án freelance ngắn hạn; có hồ sơ cá nhân thể hiện kỹ năng, ngành học; nộp hồ sơ ứng tuyển, theo dõi trạng thái đơn và đánh giá nhà tuyển dụng.
3. **Nhà tuyển dụng (Employer - `ROLE_EMPLOYER`):** Doanh nghiệp, cửa hàng hoặc cá nhân có nhu cầu thuê nhân sự; đăng bài tuyển dụng, duyệt hồ sơ ứng viên, cập nhật tiến độ công việc và đánh giá năng lực sinh viên.
4. **Quản trị viên (Admin - `ROLE_ADMIN`):** Kiểm soát toàn bộ hệ thống; quản lý người dùng, quản lý tin đăng, theo dõi các chỉ số thống kê và xử lý khiếu nại/vi phạm.

---

## 2. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS - FR)

### FR-01: Quản lý Xác thực & Tài khoản (Authentication)
- **FR-01.1 Đăng ký:** Cho phép người dùng đăng ký tài khoản mới bằng Email, Mật khẩu, Họ tên, Số điện thoại và lựa chọn vai trò (`ROLE_STUDENT` hoặc `ROLE_EMPLOYER`). Mật khẩu được mã hóa an toàn bằng thuật toán BCrypt.
- **FR-01.2 Đăng nhập:** Cho phép đăng nhập bằng Email và Mật khẩu. Hệ thống xác thực và cấp mã JWT (JSON Web Token) có thời hạn hiệu lực.
- **FR-01.3 Lấy thông tin cá nhân hiện tại:** Endpoint `/api/v1/auth/me` trả về thông tin người dùng đang đăng nhập dựa trên JWT token được gửi kèm trong header.

### FR-02: Quản lý Hồ sơ cá nhân (User Profiles)
- **FR-02.1 Xem hồ sơ:** Người dùng có thể xem hồ sơ chi tiết của bản thân.
- **FR-02.2 Cập nhật hồ sơ Sinh viên:** Sinh viên có thể cập nhật thông tin giới thiệu (bio), danh sách kỹ năng (skills), trường đại học (university), chuyên ngành (major), liên kết CV/Portfolio.
- **FR-02.3 Cập nhật hồ sơ Nhà tuyển dụng:** Nhà tuyển dụng có thể cập nhật tên đơn vị/công ty (company_name), địa chỉ hoạt động (company_address), mô tả công ty (bio).

### FR-03: Quản lý Danh mục công việc (Job Categories)
- **FR-03.1 Danh sách danh mục:** Xem danh sách tất cả các ngành nghề/danh mục việc làm (CNTT, Đồ họa, Gia sư, Phục vụ, Viết nội dung...).

### FR-04: Quản lý Tin tuyển dụng (Job Management)
- **FR-04.1 Đăng tin việc làm:** Nhà tuyển dụng có thể tạo tin mới với đầy đủ thông tin: Tiêu đề, mô tả chi tiết, yêu cầu công việc, loại công việc (`PART_TIME`, `FREELANCE`, `INTERNSHIP`), hình thức làm việc (`ONSITE`, `REMOTE`, `HYBRID`), địa điểm, loại lương (`HOURLY`, `FIXED_PROJECT`, `MONTHLY`), số tiền lương, số lượng cần tuyển, hạn nộp hồ sơ.
- **FR-04.2 Danh sách & Tìm kiếm / Lọc tin:** Tìm kiếm tin việc làm theo từ khóa trong tiêu đề/mô tả; lọc theo danh mục, hình thức làm việc, loại công việc, trạng thái tin.
- **FR-04.3 Xem chi tiết tin:** Xem toàn bộ thông tin chi tiết của tin tuyển dụng kèm thông tin nhà tuyển dụng đăng tin và các đánh giá liên quan.
- **FR-04.4 Cập nhật / Đóng tin:** Nhà tuyển dụng sở hữu tin có thể sửa thông tin tin đăng hoặc chuyển trạng thái sang `IN_PROGRESS`, `COMPLETED`, `CLOSED`.

### FR-05: Quản lý Ứng tuyển (Job Applications)
- **FR-05.1 Nộp hồ sơ ứng tuyển:** Sinh viên có thể nộp đơn ứng tuyển cho tin đang mở (`OPEN`), gửi kèm thư giới thiệu (cover letter) và đường dẫn liên kết CV. Mỗi sinh viên chỉ được nộp một lần cho mỗi công việc.
- **FR-05.2 Xem danh sách đơn ứng tuyển của tôi (Sinh viên):** Sinh viên theo dõi tất cả các công việc mình đã nộp hồ sơ cùng trạng thái duyệt (`PENDING`, `REVIEWING`, `ACCEPTED`, `REJECTED`).
- **FR-05.3 Quản lý ứng viên theo tin tuyển dụng (Nhà tuyển dụng):** Nhà tuyển dụng xem danh sách tất cả ứng viên đã nộp vào tin của mình, xem hồ sơ, duyệt nhận (`ACCEPTED`) hoặc từ chối (`REJECTED`) kèm lý do từ chối.

### FR-06: Đánh giá & Xếp hạng 2 chiều (Reviews & Ratings)
- **FR-06.1 Sinh viên đánh giá Nhà tuyển dụng:** Sau khi công việc được đánh dấu `COMPLETED` và ứng viên đã được nhận, Sinh viên gửi đánh giá từ 1 đến 5 sao và nhận xét về đơn vị tuyển dụng.
- **FR-06.2 Nhà tuyển dụng đánh giá Sinh viên:** Nhà tuyển dụng gửi đánh giá số sao và nhận xét về thái độ, hiệu quả làm việc của Sinh viên.
- **FR-06.3 Xem danh sách đánh giá:** Mọi người dùng có thể xem lịch sử đánh giá của một công việc hoặc một người dùng.

### FR-07: Quản lý Thông báo (Notifications)
- **FR-07.1 Tạo thông báo tự động:** Hệ thống tự động gửi thông báo khi:
  - Có ứng viên mới nộp đơn cho bài đăng của NTD.
  - NTD cập nhật kết quả xét duyệt đơn của Sinh viên.
  - Công việc hoàn thành và mời hai bên đánh giá.
- **FR-07.2 Xem danh sách thông báo:** Người dùng xem danh sách thông báo của mình và đánh dấu đã đọc.

### FR-08: Quản trị Hệ thống (Admin Portal)
- **FR-08.1 Thống kê tổng quan:** Thống kê tổng số người dùng, số lượng tin đăng, số lượt ứng tuyển và tỉ lệ hoàn thành.
- **FR-08.2 Quản lý người dùng:** Admin có quyền xem danh sách tất cả tài khoản, kích hoạt hoặc khóa tài khoản vi phạm.
- **FR-08.3 Quản lý tin đăng:** Admin có quyền kiểm duyệt hoặc gỡ bỏ tin tuyển dụng có nội dung không phù hợp.

---

## 3. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - NFR)

### NFR-01: Hiệu năng (Performance)
- Thời gian phản hồi API trung bình < 300ms đối với các truy vấn đọc dữ liệu thông thường.
- CSDL được đánh chỉ mục (Index) đầy đủ trên các trường tìm kiếm thường xuyên (`email`, `category_id`, `employer_id`, `status`, `job_type`).

### NFR-02: Bảo mật (Security)
- Xác thực không lưu phiên (Stateless) bằng JWT có chữ ký số bí mật (HS256).
- Mật khẩu người dùng bắt buộc mã hóa bằng BCrypt với hệ số Salt tối ưu (Cost factor >= 10).
- Áp dụng phân quyền RBAC phân tầng tại cả cấp độ URL Pattern lẫn phương thức nghiệp vụ.
- Ngăn chặn lỗi bảo mật phổ biến: SQL Injection (JPA PreparedStatement), XSS, Broken Access Control.

### NFR-03: Tính sẵn sàng & Đóng gói (Availability & DevOps)
- Đóng gói toàn bộ kiến trúc thành các container độc lập bằng Docker (Database, Spring Boot API, React Web Nginx).
- Triển khai chạy được ngay thông qua một lệnh `docker-compose up -d`.

### NFR-04: Tính khả dụng & Thẩm mỹ giao diện (Usability & UI/UX)
- Giao diện thân thiện, tuân thủ nguyên tắc thiết kế hiện đại (Design System nhất quán, màu sắc hài hòa, độ tương phản văn bản chuẩn WCAG 2.1 AA).
- Sử dụng icon vector SVG chuẩn (Lucide icons), tuyệt đối không dùng emoji thay thế icon chức năng.
- Tương thích tốt trên màn hình máy tính để bàn (Desktop >= 1024px), máy tính bảng (Tablet >= 768px) và điện thoại thông minh (Mobile >= 375px).

---

## 4. QUY TẮC NGHIỆP VỤ (BUSINESS RULES - BR)
- **BR-01:** Chỉ tài khoản có vai trò `ROLE_STUDENT` mới được nộp hồ sơ ứng tuyển vào công việc.
- **BR-02:** Chỉ tài khoản có vai trò `ROLE_EMPLOYER` mới được tạo bài đăng tuyển dụng.
- **BR-03:** Nhà tuyển dụng chỉ có quyền xem danh sách ứng viên và thay đổi trạng thái ứng tuyển của các tin do chính tài khoản đó đăng tải.
- **BR-04:** Sinh viên chỉ có thể đánh giá Nhà tuyển dụng sau khi đơn ứng tuyển của mình đã được duyệt (`ACCEPTED`).
- **BR-05:** Mỗi ứng viên chỉ được đánh giá một lần cho mỗi công việc hoàn thành.

# PHIẾU XÁC ĐỊNH PHẠM VI DỰ ÁN (PROJECT SCOPE STATEMENT)

**Trường Đại học Văn Lang — Khoa Công nghệ Thông tin**  
**Học phần:** Chuyên đề tốt nghiệp 2 — Học kỳ 1, Năm học 2026 – 2027  
**Mã lớp học phần:** 261_71ITGR40303_04  
**Nhóm thực hiện:** Nhóm 8  
**Tên đề tài:** Nền tảng quản lý freelance & marketplace việc làm part-time cho sinh viên  
**Giảng viên hướng dẫn:** ThS. Nguyễn Văn Trung  

---

## 1. THÀNH VIÊN VÀ PHÂN CÔNG VAI TRÒ
| STT | Họ và tên | MSSV | Vai trò chính | Trách nhiệm chính |
|---|---|---|---|---|
| 1 | **Nguyễn Tấn Tài** | (Trưởng nhóm) | Project Manager (PM) & Backend Lead | Quản lý tiến độ dự án, thiết kế kiến trúc Backend Spring Boot, bảo mật JWT/RBAC, thiết kế CSDL. |
| 2 | **Đăng Khôi** | Thành viên | Business Analyst (BA) & Frontend Lead | Phân tích đặc tả yêu cầu (SRS), thiết kế API Contract, xây dựng giao diện ReactJS, tích hợp API. |
| 3 | **Bảo Long** | Thành viên | QA / Tester & System Ops | Lập kế hoạch kiểm thử (Test Plan), viết Test Cases, kiểm thử tự động JUnit 5 / Postman, triển khai Docker Compose. |

---

## 2. MỤC TIÊU DỰ ÁN (PROJECT OBJECTIVES)
1. **Xây dựng nền tảng Marketplace hai chiều (Two-sided Marketplace):** Kết nối sinh viên có nhu cầu làm thêm với doanh nghiệp/hộ kinh doanh/cá nhân cần tuyển nhân lực thời vụ hoặc freelance ngắn hạn.
2. **Chuẩn hóa quy trình tuyển dụng linh hoạt:** Khép kín luồng nghiệp vụ từ: Đăng tin tuyển dụng -> Tìm kiếm/Lọc tin -> Ứng tuyển -> Duyệt/Từ chối hồ sơ -> Quản lý thực hiện -> Đánh giá hai chiều sau khi hoàn thành.
3. **Đảm bảo tính bảo mật và trải nghiệm người dùng:** Xác thực người dùng bằng JWT, phân quyền truy cập nghiêm ngặt theo 3 vai trò (Sinh viên, Nhà tuyển dụng, Quản trị viên), giao diện hiện đại chuẩn Responsive thích ứng trên cả Desktop và Mobile.

---

## 3. PHẠM VI DỰ ÁN (SCOPE SPECIFICATION)

### 3.1. Các chức năng TRONG PHẠM VI (In-Scope)
1. **Quản lý Tài khoản & Phân quyền (Authentication & Authorization):**
   - Đăng ký tài khoản (hỗ trợ chọn vai trò: Sinh viên / Nhà tuyển dụng).
   - Đăng nhập xác thực bằng JSON Web Token (JWT) và mã hóa mật khẩu bằng BCrypt.
   - Phân quyền RBAC (Role-Based Access Control) cho 3 vai trò: Sinh viên (`ROLE_STUDENT`), Nhà tuyển dụng (`ROLE_EMPLOYER`), Quản trị viên (`ROLE_ADMIN`).
   - Quản lý hồ sơ cá nhân:
     - Sinh viên: Cập nhật kỹ năng, chuyên ngành, trường đại học, liên kết CV.
     - Nhà tuyển dụng: Cập nhật tên đơn vị/công ty, địa chỉ, mô tả giới thiệu.
2. **Quản lý Tin tuyển dụng (Job Management):**
   - Nhà tuyển dụng đăng tin việc làm (tiêu đề, danh mục ngành nghề, hình thức làm việc, địa điểm, mức lương theo giờ/theo dự án, hạn nộp hồ sơ).
   - Chỉnh sửa, đóng tin hoặc cập nhật trạng thái tin (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`).
   - Sinh viên tìm kiếm tin theo từ khóa và lọc đa tiêu chí (danh mục, mức lương, hình thức làm việc).
3. **Ứng tuyển & Quản lý Ứng viên (Application Management):**
   - Sinh viên nộp đơn ứng tuyển kèm thư giới thiệu (Cover letter) và liên kết CV.
   - Sinh viên theo dõi trạng thái đơn ứng tuyển của mình (`PENDING`, `REVIEWING`, `ACCEPTED`, `REJECTED`).
   - Nhà tuyển dụng duyệt danh sách ứng viên nộp hồ sơ, xem CV, chấp nhận hoặc từ chối kèm lý do phản hồi.
4. **Đánh giá & Xếp hạng 2 chiều (Two-way Reviews):**
   - Sau khi công việc hoàn thành, Sinh viên được đánh giá chất lượng và sự uy tín của Nhà tuyển dụng (1 - 5 sao kèm bình luận).
   - Nhà tuyển dụng đánh giá thái độ và năng lực hoàn thành của Sinh viên.
5. **Hệ thống Thông báo cơ bản (Notification Service):**
   - Tự động thông báo khi có ứng viên mới nộp đơn, khi trạng thái đơn ứng tuyển thay đổi hoặc khi công việc được đánh dấu hoàn thành.
6. **Bảng điều khiển Quản trị viên (Admin Dashboard):**
   - Quản lý người dùng: Xem danh sách, kích hoạt / khóa tài khoản người dùng vi phạm.
   - Quản lý tin tuyển dụng và theo dõi các chỉ số thống kê hệ thống.

### 3.2. Các nội dung NGOÀI PHẠM VI (Out-of-Scope - Không bắt buộc)
- Tích hợp cổng thanh toán giao dịch tiền mặt trực tuyến (sẽ thanh toán trực tiếp giữa hai bên hoặc phát triển trong giai đoạn sau).
- Ứng dụng di động Native (Android/iOS riêng biệt), tập trung hoàn thiện giao diện Web Responsive đa nền tảng.
- Hệ thống phòng chat thời gian thực phức tạp (sử dụng liên hệ qua thông báo, email và số điện thoại).

---

## 4. KẾ HOẠCH TRIỂN KHAI VÀ MỐC THỜI GIAN (SPRINTS)
Dự án được phân bổ trong 10 buổi thực hành theo mô hình Agile/Scrum:
- **Sprint 0 (Buổi 1–3):** Thu thập & phân tích yêu cầu, xác định Actor, lập Product Backlog và viết tài liệu SRS.
- **Sprint 1 (Buổi 4–5):** Thiết kế kiến trúc phần mềm, ERD cơ sở dữ liệu, thiết kế REST API Contract và Wireframes UI.
- **Sprint 2 (Buổi 6):** Lập trình Module Xác thực, Phân quyền JWT, Quản lý hồ sơ người dùng.
- **Sprint 3 (Buổi 7):** Lập trình Module Quản lý tin đăng, Tìm kiếm/Lọc tin và Nộp hồ sơ ứng tuyển.
- **Sprint 4 (Buổi 8):** Lập trình Module Đánh giá 2 chiều, Duyệt ứng viên, Thông báo và kiểm thử tự động (Unit Test / Postman).
- **Sprint 5 (Buổi 9–10):** Đóng gói Docker, triển khai thử nghiệm hệ thống, viết báo cáo tổng kết và chuẩn bị bảo vệ.

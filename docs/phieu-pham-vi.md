# PHIẾU XÁC ĐỊNH PHẠM VI DỰ ÁN (PROJECT SCOPE STATEMENT)

**Trường Đại học Văn Lang — Khoa Công nghệ Thông tin**  
- **Học phần:** Chuyên đề tốt nghiệp 2 (Học kỳ 1, Năm học 2026 – 2027)  
- **Mã lớp học phần:** 261_71ITGR40303_04 | **Nhóm:** Nhóm 8  
- **Tên đề tài:** Nền tảng quản lý freelance & marketplace việc làm part-time cho sinh viên  
- **Giảng viên hướng dẫn:** ThS. Nguyễn Văn Trung  

---

## 1. THÀNH VIÊN VÀ PHÂN CÔNG TRÁCH NHIỆM

| STT | Họ và tên | MSSV | Vai trò chính | Trách nhiệm cụ thể |
|---|---|---|---|---|
| 1 | **Nguyễn Tấn Tài** | 2174802010... (Trưởng nhóm) | Project Manager (PM) & Backend Lead | Quản lý tiến độ Scrum, thiết kế kiến trúc Spring Boot, xác thực JWT & phân quyền RBAC, thiết kế CSDL PostgreSQL. |
| 2 | **Nguyễn Bá Anh Khôi** | 2174802010... (Thành viên) | Business Analyst (BA) & Frontend Lead | Thu thập & đặc tả yêu cầu (SRS), thiết kế API Contract, xây dựng giao diện ReactJS + TypeScript, tích hợp REST API. |
| 3 | **Hoàng Long (Bảo Long)** | 2174802010... (Thành viên) | QA / Tester & DevOps Lead | Lập kế hoạch kiểm thử (Test Plan), viết kịch bản kiểm thử Postman & JUnit 5, đóng gói Docker Compose và tự động hóa khởi chạy. |

---

## 2. MỤC TIÊU DỰ ÁN

1. **Xây dựng sàn kết nối hai chiều (Two-sided Marketplace):** Kết nối sinh viên có nhu cầu làm thêm với cá nhân/doanh nghiệp cần thuê nhân lực part-time, thời vụ hoặc dự án ngắn hạn.
2. **Khép kín quy trình tuyển dụng:** Vận hành luồng nghiệp vụ thông suốt: Đăng tin ➔ Tìm kiếm/Lọc việc ➔ Nộp hồ sơ (CV) ➔ Xét duyệt đơn ➔ Thực hiện ➔ Đánh giá hai chiều (1–5 sao).
3. **Đạt chuẩn kỹ thuật doanh nghiệp:** Xác thực không lưu phiên (Stateless JWT), phân quyền chặt chẽ theo vai trò (RBAC), CSDL đạt chuẩn 3NF có đánh chỉ mục tối ưu, giao diện Responsive hiện đại.

---

## 3. PHẠM VI DỰ ÁN (PROJECT SCOPE)

### 3.1. Các chức năng TRONG PHẠM VI (In-Scope)

1. **Quản lý Tài khoản & Phân quyền (Authentication & Authorization):**
   - Đăng ký tài khoản theo vai trò: Sinh viên (`ROLE_STUDENT`) hoặc Nhà tuyển dụng (`ROLE_EMPLOYER`).
   - Đăng nhập xác thực bằng JWT, mật khẩu mã hóa BCrypt (Salt >= 10).
   - Phân quyền RBAC cho 3 tác nhân: `ROLE_STUDENT`, `ROLE_EMPLOYER`, `ROLE_ADMIN`.
   - Quản lý hồ sơ cá nhân:
     - Sinh viên: Giới thiệu (bio), danh sách kỹ năng, trường đại học, chuyên ngành, link CV.
     - Nhà tuyển dụng: Tên đơn vị/công ty, địa chỉ, mô tả hoạt động.
2. **Quản lý Tin tuyển dụng (Job Management):**
   - NTD đăng tin: Tiêu đề, danh mục, hình thức (`ONSITE`/`REMOTE`/`HYBRID`), loại việc (`PART_TIME`/`FREELANCE`/`INTERNSHIP`), địa điểm, mức lương, hạn nộp.
   - Tìm kiếm & lọc đa tiêu chí: Từ khóa, danh mục ngành nghề, hình thức làm việc, loại công việc.
   - Cập nhật trạng thái tin theo vòng đời: `OPEN` ➔ `IN_PROGRESS` ➔ `COMPLETED` ➔ `CLOSED`.
3. **Ứng tuyển & Quản lý Ứng viên (Application Management):**
   - Sinh viên nộp đơn ứng tuyển kèm thư giới thiệu và liên kết CV trực tuyến (ràng buộc 1 đơn/công việc).
   - Sinh viên theo dõi lịch sử và trạng thái duyệt (`PENDING`, `REVIEWING`, `ACCEPTED`, `REJECTED`).
   - NTD duyệt danh sách ứng viên: Xem CV, chấp nhận (`ACCEPTED`) hoặc từ chối (`REJECTED`) kèm lý do.
4. **Đánh giá & Xếp hạng hai chiều (Two-Way Reviews):**
   - Sau khi công việc chuyển sang `COMPLETED`, mở cổng đánh giá:
     - Sinh viên đánh giá Nhà tuyển dụng (1–5 sao kèm nhận xét).
     - Nhà tuyển dụng đánh giá Sinh viên (1–5 sao kèm nhận xét).
   - Ràng buộc: Mỗi bên chỉ được đánh giá tối đa 1 lần cho mỗi công việc.
5. **Hệ thống Thông báo (Notification Service):**
   - Tự động phát thông báo khi: Có ứng viên mới, cập nhật kết quả duyệt, công việc hoàn thành.
   - Hỗ trợ xem danh sách thông báo, đánh dấu đã đọc từng tin hoặc toàn bộ.
6. **Bảng điều khiển Quản trị viên (Admin Portal):**
   - Thống kê tổng quan hệ thống: Tổng số người dùng, số lượng tin đăng, số lượt nộp đơn, số lượt đánh giá.
   - Quản lý người dùng: Xem toàn bộ danh sách, khóa/mở khóa tài khoản vi phạm.
   - Kiểm duyệt: Xóa bỏ tin đăng vi phạm quy định.

### 3.2. Các nội dung NGOÀI PHẠM VI (Out-of-Scope)

- Tích hợp cổng thanh toán giao dịch tiền mặt trực tuyến (hai bên tự thanh toán trực tiếp hoặc phát triển ở giai đoạn thương mại hóa).
- Ứng dụng di động Native (tập trung tối ưu Web Responsive hoạt động tốt trên mobile browser).
- Chatbot AI hoặc tin nhắn thời gian thực phức tạp (liên hệ qua điện thoại, email, thông báo hệ thống).

---

## 4. KẾ HOẠCH TRIỂN KHAI THEO SPRINT (10 BUỔI AGILE)

| Sprint | Buổi | Mục tiêu chính | Sản phẩm bàn giao |
|---|---|---|---|
| **Sprint 0** | Buổi 1–3 | Khảo sát nhu cầu sinh viên, xác định Actor, viết SRS, lập Product Backlog. | Phiếu phạm vi, SRS v1.0, Product Backlog. |
| **Sprint 1** | Buổi 4–5 | Thiết kế kiến trúc 3 lớp, thiết kế CSDL (ERD), đặc tả REST API Contract, vẽ Wireframe. | Tài liệu kiến trúc, file ERD DrawIO, API Contract, Wireframes Prototype. |
| **Sprint 2** | Buổi 6 | Lập trình Backend xác thực JWT, mã hóa BCrypt, module hồ sơ; dựng khung Frontend React. | Module Auth + User Profile hoạt động trên Swagger & Web UI. |
| **Sprint 3** | Buổi 7 | Lập trình CRUD tin việc làm, bộ lọc tìm kiếm, nộp hồ sơ ứng tuyển kèm CV. | Module Jobs + Applications hoạt động hoàn chỉnh. |
| **Sprint 4** | Buổi 8 | Lập trình Đánh giá 2 chiều, Thông báo, trang Admin; viết Unit Test JUnit 5 & kịch bản Postman. | Module Reviews + Admin + Test Report 100% Pass. |
| **Sprint 5** | Buổi 9–10 | Đóng gói Docker Compose, cấu hình One-Click Runner, hoàn thiện báo cáo và bảo vệ đồ án. | Bộ mã nguồn hoàn chỉnh, Docker chạy 1 lệnh, Slide & Báo cáo nghiệm thu. |

---

## 5. TIÊU CHÍ NGHIỆM THU KỸ THUẬT (ACCEPTANCE CRITERIA)

- **Chức năng:** Vận hành hoàn chỉnh 100% kịch bản nghiệp vụ: Đăng tin ➔ Ứng tuyển ➔ Duyệt đơn ➔ Hoàn thành ➔ Đánh giá 2 chiều.
- **Bảo mật:** Không để lộ dữ liệu mật khẩu, chặn truy cập trái phép bằng HTTP 401/403, kiểm soát quyền theo vai trò (RBAC).
- **Chất lượng kiểm thử:** Tối thiểu 20+ ca kiểm thử tự động trên JUnit 5 & Postman, tỷ lệ đạt 100%, không còn lỗi nghiêm trọng (Blocker Bug).
- **Triển khai:** Chạy được ngay trên máy giám khảo thông qua Docker Compose hoặc 1-Click Runner (`run.bat` / IntelliJ Run Configuration).

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
| 1 | **Nguyễn Tấn Tài** | 2174802010839 (Trưởng nhóm) | Tech Lead & Frontend Lead | Quản lý kỹ thuật và tiến độ Sprint, xây dựng toàn bộ giao diện Web React 18 TypeScript Vite, thiết kế UI/UX, hỗ trợ Dark Mode và song ngữ VI/EN. |
| 2 | **Nguyễn Bá Anh Khôi** | 2174802010842 (Thành viên) | Business Analyst (BA) & DevOps Lead | Thu thập & đặc tả yêu cầu (SRS, 14 User Stories), thiết kế API Contract, đóng gói cụm container Docker Compose, cấu hình tự động hóa script 1-Click launcher (`run.bat`). |
| 3 | **Hoàng Bảo Long** | 2174802010850 (Thành viên) | QA/QC & Backend Lead | Thiết kế CSDL 7 bảng chuẩn 3NF, lập trình toàn bộ Backend RESTful API Spring Boot 3 & JWT Stateless, lập và thực thi Kế hoạch kiểm thử Test Plan 21/21 Pass. |

---

## 2. MỤC TIÊU DỰ ÁN

1. **Xây dựng sàn kết nối hai chiều (Two-sided Marketplace):** Kết nối sinh viên có nhu cầu làm thêm với cá nhân/doanh nghiệp cần thuê nhân lực part-time, thời vụ hoặc dự án ngắn hạn.
2. **Khép kín quy trình tuyển dụng:** Vận hành luồng nghiệp vụ thông suốt: Đăng tin ➔ Tìm kiếm/Lọc việc ➔ Nộp hồ sơ (CV) ➔ Xét duyệt đơn ➔ Thực hiện ➔ Đánh giá hai chiều (1–5 sao).
3. **Tích hợp bộ dữ liệu thực tế VietJobs và cào từ Internet quy mô lớn:** Chuẩn hóa và làm sạch 1.470+ tin tuyển dụng part-time/thực tập thực tế, 16 nhóm ngành, 34 tỉnh/thành, hỗ trợ lọc chuyên biệt cho sinh viên theo tinh thần Nghị quyết 202/2025/QH15.
4. **Đạt chuẩn kỹ thuật doanh nghiệp & Đa CSDL:** Xác thực không lưu phiên (Stateless JWT), phân quyền chặt chẽ theo vai trò (RBAC), hỗ trợ song song 2 hệ quản trị CSDL phổ biến (MySQL 8 và PostgreSQL 18) với mật khẩu chuẩn hóa `12345`, CSDL đạt chuẩn 3NF có đánh chỉ mục tối ưu, giao diện Responsive hiện đại.

---

## 3. PHẠM VI DỰ ÁN (PROJECT SCOPE)

### 3.1. Các chức năng TRONG PHẠM VI (In-Scope)

1. **Quản lý Tài khoản & Phân quyền (Authentication & Authorization):**
   - Đăng ký tài khoản theo vai trò: Sinh viên (`ROLE_STUDENT`) hoặc Nhà tuyển dụng (`ROLE_EMPLOYER`).
   - Đăng nhập xác thực bằng JWT, mật khẩu mã hóa BCrypt (Salt >= 10).
   - Phân quyền RBAC cho 3 tác nhân: `ROLE_STUDENT`, `ROLE_EMPLOYER`, `ROLE_ADMIN`.
   - Quản lý hồ sơ cá nhân:
      - Sinh viên: Họ tên, số điện thoại, giới thiệu (bio), danh sách kỹ năng, trường đại học, chuyên ngành, link CV.
      - Nhà tuyển dụng: Tên đơn vị/công ty, địa chỉ trụ sở, mô tả hoạt động, người liên hệ.
      - Quản trị viên: Thông tin định danh, số điện thoại, tiểu sử quản trị hệ thống.
2. **Quản lý Tin tuyển dụng & Bộ dữ liệu lớn (Job Management & Dataset):**
   - NTD đăng tin: Tiêu đề, danh mục, hình thức (`ONSITE`/`REMOTE`/`HYBRID`), loại việc (`PART_TIME`/`FREELANCE`/`INTERNSHIP`), địa điểm, tỉnh thành (`province`), mức lương, thù lao chuỗi (`salaryText`), thời gian làm ca kíp (`workingHours`), quyền lợi (`benefits`), gắn nhãn sinh viên (`studentFriendly`), hạn nộp.
   - Tìm kiếm & lọc đa tiêu chí hiệu năng cao: Từ khóa, danh mục ngành nghề (16 nhóm ngành), tỉnh/thành phố, hình thức làm việc, loại công việc, lọc nhanh việc làm phù hợp sinh viên.
   - Cập nhật trạng thái tin theo vòng đời: `OPEN` ➔ `IN_PROGRESS` ➔ `COMPLETED` ➔ `CLOSED`.
3. **Ứng tuyển & Quản lý Ứng viên (Application Management):**
   - Sinh viên nộp đơn ứng tuyển kèm thư giới thiệu và liên kết CV trực tuyến (ràng buộc 1 đơn/công việc).
   - Sinh viên theo dõi lịch sử và trạng thái duyệt (`PENDING`, `REVIEWING`, `ACCEPTED`, `REJECTED`, `CANCELLED`).
   - Sinh viên có quyền tự hủy đơn đã nộp khi đơn còn ở trạng thái `PENDING` (`PATCH /api/v1/applications/{id}/cancel`).
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
7. **Trải nghiệm Giao diện & Đa ngôn ngữ (UI/UX, Dark/Light Mode & i18n):**
   - Chế độ sáng / tối (Dark & Light Theme): Tích hợp nút toggle trên thanh điều hướng, tự động lưu và khôi phục trạng thái qua LocalStorage.
   - Chuyển đổi song ngữ Tiếng Việt - Tiếng Anh (VI / EN): Chuyển đổi tức thì toàn bộ nhãn, điều hướng, bộ lọc, thẻ việc làm và chân trang.
   - Trang hồ sơ đa vai trò: Giao diện xem và cập nhật hồ sơ cá nhân đồng nhất cho Sinh viên, NTD và Quản trị viên.
8. **Giám sát Trạng thái & Công cụ CSDL (Health API & H2 Console):**
   - API gốc `GET /api/v1/` trả về trạng thái máy chủ, phiên bản, link Swagger UI và H2 Console.
   - Web Console `GET /api/v1/h2-console` phục vụ tra cứu dữ liệu CSDL nhanh trong môi trường phát triển.

### 3.2. Các nội dung NGOÀI PHẠM VI (Out-of-Scope)

- Tích hợp cổng thanh toán giao dịch tiền mặt trực tuyến (hai bên tự thanh toán trực tiếp hoặc phát triển ở giai đoạn thương mại hóa).
- Ứng dụng di động Native (tập trung tối ưu Web Responsive hoạt động tốt trên mobile browser).
- Chatbot AI hoặc tin nhắn thời gian thực phức tạp (liên hệ qua điện thoại, email, thông báo hệ thống).

---

## 4. KẾ HOẠCH TRIỂN KHAI THEO SPRINT (10 BUỔI AGILE)

> **📅 Lịch:** Mỗi buổi = 1 tuần | Buổi 1: **25/09/2026** | Buổi 5: **23/10/2026** | Buổi 10: **27/11/2026**

| Sprint | Buổi | Ngày | Mục tiêu chính | Sản phẩm bàn giao |
|---|---|---|---|---|
| **Sprint 0** | Buổi 1 | 25/09/2026 | Thành lập nhóm, đăng ký đề tài, phân vai trò kỹ thuật. | Phiếu xác nhận đề tài, danh sách thành viên + vai trò RACI. |
| **Sprint 0** | Buổi 2 | 02/10/2026 | Phân tích bài toán 5W1H, viết SRS v1.0, lập ma trận FR-NFR. | SRS v1.0, 11 FR + 4 NFR. |
| **Sprint 0** | Buổi 3 | 09/10/2026 | Xây dựng Product Backlog MoSCoW, 14 User Stories (48 pts), kế hoạch 5 Sprint. | Phiếu phạm vi, Product Backlog. |
| **Sprint 1** | Buổi 4 | 16/10/2026 | Thiết kế kiến trúc 3 lớp, ERD 7 bảng, 13 indexes, đặc tả API Contract Swagger. | Tài liệu kiến trúc, ERD DrawIO, API Contract OpenAPI 3.0. |
| **Sprint 1** | **Buổi 5** | **23/10/2026 ⭐ Giữa kỳ** | Thiết kế Wireframe UI, báo cáo nghiệm thu giữa kỳ (Rubric 2). | Wireframes, Slide thuyết trình Buổi 5, Gantt Chart cập nhật. |
| **Sprint 2** | Buổi 6 | 30/10/2026 | Lập trình Backend Auth JWT HS256, BCrypt, RBAC; dựng khung Frontend React. | Module Auth + User Profile hoạt động trên Swagger & Web UI. |
| **Sprint 3** | Buổi 7 | 06/11/2026 | CRUD tin việc làm, bộ lọc tìm kiếm, nộp hồ sơ ứng tuyển kèm CV. | Module Jobs + Applications hoàn chỉnh. |
| **Sprint 4** | Buổi 8 | 13/11/2026 | Đánh giá 2 chiều, Thông báo, Admin Portal; 21 Test Cases + 30 Unit Tests. | Module Reviews + Admin + Test Report 100% Pass. |
| **Sprint 5** | Buổi 9 | 20/11/2026 | Docker Compose 3 dịch vụ, 1-Click Launcher, video demo. | Docker hoàn chỉnh, run.bat chạy được. |
| **Sprint 5** | **Buổi 10** | **27/11/2026 🎯 Cuối kỳ** | Hoàn thiện báo cáo tổng kết, Slide bảo vệ, Demo Live trước Hội đồng. | Bộ mã nguồn hoàn chỉnh, Báo cáo nghiệm thu Rubric 3. |

---

## 5. TIÊU CHÍ NGHIỆM THU KỸ THUẬT (ACCEPTANCE CRITERIA)

- **Chức năng:** Vận hành hoàn chỉnh 100% kịch bản nghiệp vụ: Đăng tin ➔ Ứng tuyển ➔ Duyệt đơn ➔ Hoàn thành ➔ Đánh giá 2 chiều.
- **Bảo mật:** Không để lộ dữ liệu mật khẩu, chặn truy cập trái phép bằng HTTP 401/403, kiểm soát quyền theo vai trò (RBAC).
- **Chất lượng kiểm thử:** Tối thiểu 20+ ca kiểm thử tự động trên JUnit 5 & Postman, tỷ lệ đạt 100%, không còn lỗi nghiêm trọng (Blocker Bug).
- **Triển khai:** Chạy được ngay trên máy giám khảo thông qua Docker Compose hoặc 1-Click Runner (`run.bat` / IntelliJ Run Configuration).

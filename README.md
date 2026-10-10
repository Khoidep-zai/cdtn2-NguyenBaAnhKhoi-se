# HỆ THỐNG QUẢN LÝ FREELANCE & MARKETPLACE VIỆC LÀM PART-TIME CHO SINH VIÊN
## (Student Freelance & Part-time Job Marketplace)

> **Học phần:** Chuyên đề tốt nghiệp 2 — Khoa Công nghệ Thông tin — Trường Đại học Văn Lang  
> **Mã lớp học phần:** 261_71ITGR40303_04 | **Nhóm:** Nhóm 8  
> **Thành viên:** 
> - **Nguyễn Tấn Tài** (PM & Backend Lead)
> - **Nguyễn Bá Anh Khôi** (BA & Frontend Lead)
> - **Hoàng Bảo Long** (QA / Tester & DevOps Lead)  
> **Giảng viên hướng dẫn:** ThS. Nguyễn Văn Trung  

---

## 1. TỔNG QUAN ĐỀ TÀI & PHẠM VI (PROJECT OVERVIEW)

### 1.1. Mục tiêu đề tài
Xây dựng một nền tảng web hai chiều (**Two-sided Marketplace**) kết nối sinh viên tìm việc làm thêm, bán thời gian, thực tập và dự án tự do (freelance) với các nhà tuyển dụng / cá nhân có nhu cầu thuê nhân sự ngắn hạn. Hệ thống khép kín toàn bộ luồng nghiệp vụ: **Đăng tin ➔ Tìm kiếm & Lọc việc ➔ Nộp hồ sơ (CV) ➔ Xét duyệt đơn ➔ Thực hiện ➔ Đánh giá hai chiều (1–5 sao)**.

### 1.2. Phạm vi chức năng chính
1. **Xác thực & Phân quyền (RBAC):** Đăng ký, đăng nhập JWT (HS256), mật khẩu mã hóa BCrypt, phân 3 vai trò: Sinh viên (`ROLE_STUDENT`), Nhà tuyển dụng (`ROLE_EMPLOYER`), Quản trị viên (`ROLE_ADMIN`).
2. **Quản lý Hồ sơ Đa vai trò (Multi-role Profile):** Sinh viên cập nhật kỹ năng/CV/học vấn; Nhà tuyển dụng cập nhật thông tin công ty; Quản trị viên cập nhật thông tin cá nhân và quản trị.
3. **Đăng tin & Quản lý Tuyển dụng:** Đăng tin theo ngành nghề, thời gian làm ca kíp (`workingHours`), mức thù lao (`salaryText`), quyền lợi (`benefits`), gắn nhãn sinh viên (`studentFriendly`), quản lý vòng đời tin (`OPEN` ➔ `IN_PROGRESS` ➔ `COMPLETED` ➔ `CLOSED`).
4. **Bộ dữ liệu lớn (1.470+ việc làm thực tế):** Tích hợp dataset VietJobs kết hợp 20 việc làm mới cào tại TP.HCM (ITviec, TopCV, Shopee, VUS, GHTK), bao phủ 16 nhóm ngành và 34 tỉnh/thành.
5. **Ứng tuyển & Quản lý Đơn:** Sinh viên nộp đơn kèm link CV và thư giới thiệu; theo dõi trạng thái đơn (`PENDING`, `REVIEWING`, `ACCEPTED`, `REJECTED`, `CANCELLED`); sinh viên có quyền tự hủy đơn khi đang ở trạng thái `PENDING`.
6. **Đánh giá & Xếp hạng 2 chiều:** Sinh viên và Nhà tuyển dụng gửi đánh giá 1–5 sao kèm nhận xét sau khi công việc hoàn thành (`COMPLETED`).
7. **Thông báo hệ thống:** Thông báo thời gian thực khi có ứng viên mới, cập nhật duyệt đơn hoặc hoàn thành việc làm.
8. **Bảng điều khiển Quản trị viên:** KPI tổng quan, quản lý danh sách người dùng, khóa/mở khóa tài khoản vi phạm, xóa bài đăng không phù hợp.
9. **Trải nghiệm Giao diện Cao cấp (UX/UI & i18n):**
   - **Chế độ Sáng / Tối (Dark & Light Mode):** Nút toggle trên thanh điều hướng, lưu tự động vào `localStorage`, đồng bộ thiết kế chuẩn CSS Variables tokens.
   - **Hỗ trợ Song ngữ Việt - Anh (i18n):** Chuyển đổi ngôn ngữ tức thì giữa Tiếng Việt và Tiếng Anh trên toàn hệ thống.
10. **Giám sát & Công cụ CSDL:** Root status endpoint (`GET /api/v1/`) và H2 Database Web Console (`/api/v1/h2-console`).

---

## 2. HỒ SƠ TÀI LIỆU KỸ THUẬT WORD (.DOCX)

Toàn bộ tài liệu kỹ thuật đã được biên dịch đồng bộ từ mã nguồn Markdown sang định dạng Microsoft Word (**`.docx`**) chuyên nghiệp nằm tại thư mục `docs/`:

| Tên tệp Word | Tệp nguồn Markdown | Nội dung tài liệu |
|---|---|---|
| [`docs/srs.docx`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/docs/srs.docx) | [`docs/srs.md`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/docs/srs.md) | Bản đặc tả yêu cầu phần mềm đầy đủ (SRS v1.2), danh sách Actor, 9 nhóm Functional Requirements và 4 Non-Functional Requirements. |
| [`docs/api-contract.docx`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/docs/api-contract.docx) | [`docs/api-contract.md`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/docs/api-contract.md) | Hợp đồng REST API Contract chi tiết: Root API, Auth, Jobs, Applications (kèm Cancel), Reviews, Users Profile, H2 Console, Admin. |
| [`docs/architecture.docx`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/docs/architecture.docx) | [`docs/architecture.md`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/docs/architecture.md) | Thiết kế kiến trúc phân tầng 3 lớp (Client Tier, Application Tier, Data Tier), ma trận phân quyền RBAC và sơ đồ luồng bảo mật. |
| [`docs/deployment-guide.docx`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/docs/deployment-guide.docx) | [`docs/deployment-guide.md`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/docs/deployment-guide.md) | Cẩm nang hướng dẫn triển khai: Docker Compose, Windows 1-Click Scripts, IntelliJ IDEA, mạng cổng và xử lý sự cố. |
| [`docs/phieu-pham-vi.docx`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/docs/phieu-pham-vi.docx) | [`docs/phieu-pham-vi.md`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/docs/phieu-pham-vi.md) | Phiếu xác định phạm vi dự án (In-scope, Out-of-scope), phân công trách nhiệm thành viên và kế hoạch 5 Sprint Scrum. |
| [`docs/ai-disclosure.docx`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/docs/ai-disclosure.docx) | [`docs/ai-disclosure.md`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/docs/ai-disclosure.md) | Bản công bố minh bạch phạm vi sử dụng AI (Google Gemini / GitHub Copilot) và cam kết liêm chính học thuật. |

> **Lệnh tự động cập nhật tài liệu Word:**
> Khi chỉnh sửa nội dung tài liệu Markdown, chạy lệnh sau tại thư mục gốc để tự động cập nhật lại toàn bộ file `.docx`:
> ```bash
> python docs/convert_md_to_docx.py
> ```

---

## 3. CÔNG NGHỆ ÁP DỤNG (TECH STACK)

| Tầng kiến trúc | Công nghệ sử dụng | Mục đích áp dụng |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite Bundler, Vanilla CSS Design System | Giao diện Responsive mượt mà, định kiểu chặt chẽ, tối ưu tốc độ tải trang; hỗ trợ Theme Dark/Light và Song ngữ VI/EN. |
| **Backend** | Java 17/21, Spring Boot 3.2.x, Spring Data JPA, Spring Security 6 | Kiến trúc Clean Architecture phân tầng chuẩn doanh nghiệp (Controller ➔ Service ➔ Repository), hiệu năng cao. |
| **Bảo mật** | JSON Web Token (JWT HS256) & BCrypt Password Encoder | Xác thực không lưu phiên (Stateless Authentication) và phân quyền chặt chẽ RBAC theo vai trò. |
| **Cơ sở dữ liệu** | MySQL 8.0, PostgreSQL 16/18 & H2 In-Memory (Pass: `12345`) | Hỗ trợ linh hoạt 3 hệ quản trị CSDL, đảm bảo toàn vẹn dữ liệu giao dịch ACID và 13 chỉ mục hiệu năng. |
| **Tài liệu API & Giám sát** | OpenAPI 3.0 / Swagger UI, H2 Database Console, Root API Status | Chuẩn hóa tài liệu API cho Frontend tra cứu và công cụ điều khiển CSDL trực tiếp cho nhà phát triển. |
| **Đóng gói & Runner** | Docker, Docker Compose, Windows Batch 1-Click (`run.bat`, `run-mysql.bat`, `run-postgres.bat`) | Đồng nhất môi trường phát triển và kiểm thử, khởi chạy trọn gói hệ thống chỉ bằng 1 thao tác. |

---

## 4. QUY MÔ DỮ LIỆU & BỘ DATASET CÀO THỰC TẾ (DATASET SCALE)

- **Tổng số lượng tin việc làm:** **1.470 việc làm thực tế** (1.450 tin nền tảng VietJobs + 20 tin tuyển dụng mới cào tại TP.HCM).
- **Phân loại ngành nghề:** **16 nhóm ngành** (Công nghệ thông tin, Thiết kế đồ họa, Marketing số, Trợ giảng/Gia sư, Dịch thuật, Dịch vụ F&B, Logistics, Bán hàng, Hành chính/Nhân sự...).
- **Độ phủ địa lý:** **34 tỉnh/thành phố** trên toàn quốc (tập trung trọng điểm tại TP. Hồ Chí Minh, Hà Nội, Đà Nẵng, Cần Thơ...).
- **20 việc làm mới cào tại khu vực TP.HCM (VJ001451 - VJ001470):**
  - **12 việc làm IT:** Frontend ReactJS, Backend Java Spring Boot, Mobile Flutter, QA/QC Manual & Automation, Python AI/Data Analyst Intern, Devops Cloud, Node.js Fullstack... (Nguồn: ITviec, TopCV).
  - **8 việc làm đa ngành:** Content Creator Shopee, Digital Marketing Intern, Trợ giảng Anh ngữ VUS, Nhân viên kho bãi & vận hành GHTK, Kế toán part-time, Chăm sóc khách hàng, Graphic Designer TikTok Shop, Tuyển dụng nhân sự part-time.
- **Tệp dữ liệu và công cụ chuyển đổi:**
  - `dataset/jobs_marketplace.csv`: Bảng dữ liệu gốc 1.470 dòng chuẩn hóa.
  - `dataset/append_20_hcm_jobs.py`: Kịch bản cào và bổ sung 20 việc làm TP.HCM.
  - `dataset/HUONG_DAN_AI_AGENT.md`: Tài liệu hướng dẫn phân tích dữ liệu, nguồn gốc và cấu trúc schema.
  - `database/init_database.sql` & `database/init_postgres.sql`: Bộ kịch bản SQL nạp dữ liệu tức thì cho MySQL & PostgreSQL.

---

## 5. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG (GETTING STARTED)

### 5.1. Yêu cầu môi trường (Prerequisites)
- **Java JDK:** Phiên bản 17 hoặc 21.
- **Node.js:** Phiên bản >= 18.x và npm.
- **Cơ sở dữ liệu (tùy chọn 1 trong 3):**
  - **MySQL >= 8.x** (Cổng 3306, user: `root`, mật khẩu: `12345`)
  - **PostgreSQL >= 15.x/16.x/18.x** (Cổng 5433 hoặc 5432, user: `postgres`, mật khẩu: `12345`)
  - **H2 In-Memory Database** (Tự động kích hoạt khi không có MySQL/PostgreSQL cục bộ)
- **Docker Desktop** (Nếu chọn phương án chạy container).

### 5.2. Khởi chạy 1-Click trên Windows (Khuyên dùng)
Hệ thống cung cấp sẵn các kịch bản thực thi một chạm tại thư mục gốc:
- **Chạy với MySQL:** Nhấp đúp vào [`run-mysql.bat`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/run-mysql.bat).
- **Chạy với PostgreSQL:** Nhấp đúp vào [`run-postgres.bat`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/run-postgres.bat).
- **Menu lựa chọn tương tác:** Nhấp đúp vào [`run.bat`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/run.bat) để chọn giữa MySQL, PostgreSQL hoặc H2 Database.
- **Dừng hệ thống:** Nhấp đúp vào [`stop.bat`](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/stop.bat) để giải phóng các cổng 8080 và 3000.

### 5.3. Khởi chạy 1-Click trên IntelliJ IDEA
Dự án đã tích hợp sẵn các cấu hình chạy tại thư mục `.idea/runConfigurations/`:
1. Mở thư mục dự án bằng **IntelliJ IDEA**.
2. Trên thanh công cụ trên cùng, chọn cấu hình:
   - **`🚀 Run Project with MySQL`** (Backend MySQL + Frontend React)
   - **`🚀 Run Project with PostgreSQL`** (Backend PostgreSQL + Frontend React)
   - **`🚀 Run Full Project (BE + FE)`** (Cấu hình khởi chạy tổng hợp)
3. Nhấp nút **Run (▶)** (hoặc phím tắt `Shift + F10`). Hệ thống sẽ tự động khởi chạy Backend, Frontend và mở trình duyệt web.

### 5.4. Khởi chạy trọn gói bằng Docker Compose
1. Tạo tệp cấu hình môi trường:
   ```bash
   cp .env.example .env
   ```
2. Khởi động toàn bộ dịch vụ:
   ```bash
   docker-compose up -d --build
   ```

---

## 6. ĐỊA CHỈ TRUY CẬP VÀ DANH MỤC DỊCH VỤ

| Phân hệ / Dịch vụ | Địa chỉ URL truy cập | Ghi chú kỹ thuật |
|---|---|---|
| **Giao diện Web (Frontend)** | `http://localhost:3000` | Giao diện React Vite (Dark/Light mode, Song ngữ VI/EN, Hồ sơ cá nhân đa vai trò) |
| **REST API Root (Backend)** | `http://localhost:8080/api/v1` | Cổng API gốc: Trạng thái máy chủ, phiên bản và đường dẫn tra cứu |
| **Tài liệu Swagger UI** | `http://localhost:8080/api/v1/swagger-ui.html` | Giao diện tra cứu và tương tác API trực quan OpenAPI 3.0 |
| **OpenAPI Docs (JSON)** | `http://localhost:8080/api/v1/v3/api-docs` | Định nghĩa schema OpenAPI 3.0 |
| **H2 Database Console** | `http://localhost:8080/api/v1/h2-console` | Bảng điều khiển CSDL H2 In-Memory (JDBC: `jdbc:h2:mem:freelance_db`) |
| **CSDL MySQL (Local/Docker)** | `localhost:3306` | Database: `freelance_db`, User: `root`, Mật khẩu: `12345` |
| **CSDL PostgreSQL (Local/Docker)** | `localhost:5433` (Local) / `5432` (Docker) | Database: `freelance_db`, User: `postgres`, Mật khẩu: `12345` |

---

## 7. TÀI KHOẢN MẪU DÙNG THỬ (DEMO TEST ACCOUNTS)

> **Mật khẩu chung cho tất cả các tài khoản thử nghiệm:** `Password123@`

| Vai trò người dùng | Email đăng nhập | Tên người dùng | Kịch bản kiểm thử đề xuất |
|---|---|---|---|
| **Quản trị viên (Admin)** | `admin@freelancehub.vn` | Quản Trị Viên Nhóm 8 | Xem thống kê KPI tổng quan, quản lý danh sách tài khoản, khóa/mở khóa tài khoản, xóa tin vi phạm, cập nhật hồ sơ cá nhân. |
| **Nhà tuyển dụng (Employer)** | `recruiter@thecoffee.vn` | Nguyễn Thị Tuyết (The Coffee House) | Đăng tin part-time, quản lý tin đăng, đổi trạng thái vòng đời tin, xem danh sách ứng viên nộp hồ sơ, duyệt hoặc từ chối đơn. |
| **Nhà tuyển dụng (Employer)** | `techlead@innovate.vn` | Trần Văn Minh (Innovate Studio) | Tuyển dụng lập trình viên, designer, xem CV ứng viên, đánh giá 2 chiều (1-5 sao) sau khi hoàn thành. |
| **Sinh viên (Student)** | `sinhvien.khoi@vanlanguni.vn` | Nguyễn Bá Anh Khôi | Tìm kiếm và lọc 1.470 tin việc làm, nộp hồ sơ kèm link CV, xem trạng thái đơn, tự hủy đơn ứng tuyển đang chờ duyệt, cập nhật hồ sơ cá nhân (kỹ năng, trường, ngành). |
| **Sinh viên (Student)** | `sinhvien.tai@vanlanguni.vn` | Nguyễn Tấn Tài | Xem lịch sử ứng tuyển, theo dõi đơn đã duyệt (`ACCEPTED`), thực hiện đánh giá nhà tuyển dụng sau khi công việc kết thúc. |
| **Sinh viên (Student)** | `sinhvien.long@vanlanguni.vn` | Hoàng Bảo Long | Quản lý thông báo hệ thống, chuyển đổi chế độ giao diện Sáng/Tối, chuyển đổi ngôn ngữ Việt/Anh. |

---

## 8. CẤU TRÚC MÃ NGUỒN DỰ ÁN (PROJECT DIRECTORY STRUCTURE)

```
cdtn2-NguyenBaAnhKhoi-se/
├── .env.example                    # Biến môi trường mẫu
├── .gitignore
├── docker-compose.yml              # Đóng gói trọn cụm Backend + Frontend + Databases
├── run.bat                         # Menu tương tác 1-Click trên Windows
├── run-mysql.bat                   # 1-Click khởi chạy với MySQL 8
├── run-postgres.bat                # 1-Click khởi chạy với PostgreSQL
├── stop.bat                        # Giải phóng cổng 8080 & 3000
├── README.md                       # Tài liệu hướng dẫn tổng quan dự án
│
├── docs/                           # Bộ hồ sơ kỹ thuật & tài liệu Word (.docx)
│   ├── convert_md_to_docx.py       # Script tự động biên dịch Markdown ➔ Word (.docx)
│   ├── srs.docx / srs.md           # Đặc tả yêu cầu phần mềm v1.2
│   ├── api-contract.docx / .md     # Hợp đồng REST API Contract
│   ├── architecture.docx / .md     # Tài liệu thiết kế kiến trúc hệ thống 3 tầng
│   ├── deployment-guide.docx / .md # Hướng dẫn triển khai & vận hành
│   ├── phieu-pham-vi.docx / .md    # Phiếu xác định phạm vi dự án
│   ├── ai-disclosure.docx / .md    # Bản công bố minh bạch sử dụng AI
│   ├── architecture.drawio         # Sơ đồ kiến trúc DrawIO
│   ├── erd.drawio                  # Sơ đồ thực thể quan hệ CSDL DrawIO
│   ├── usecase.drawio              # Sơ đồ Use Case phân quyền
│   ├── activity-diagram.drawio     # Sơ đồ luồng hoạt động nghiệp vụ
│   ├── wireframes.html             # Bản vẽ Wireframe giao diện
│   └── test/                       # Kế hoạch và kết quả kiểm thử (Test Plan & Report)
│
├── dataset/                        # Dữ liệu việc làm thực tế quy mô lớn
│   ├── jobs_marketplace.csv        # 1.470 tin việc làm thực tế đã chuẩn hóa
│   ├── append_20_hcm_jobs.py       # Script cào và bổ sung 20 việc làm TP.HCM
│   └── HUONG_DAN_AI_AGENT.md       # Cẩm nang dữ liệu & schema chi tiết
│
├── database/                       # CSDL, Schema & Seed Scripts
│   ├── init_database.sql           # Nạp 1.470 việc làm vào MySQL
│   ├── init_postgres.sql           # Nạp 1.470 việc làm vào PostgreSQL
│   ├── schema.sql                  # Schema CSDL chuẩn 7 bảng & 13 chỉ mục
│   ├── seed.sql                    # Dữ liệu tài khoản & danh mục cơ bản
│   └── ERD_Diagram.md              # Sơ đồ quan hệ thực thể Mermaid
│
├── backend/                        # Java Spring Boot 3.2.x REST API
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       ├── main/
│       │   ├── java/com/nhom8/freelance/
│       │   │   ├── FreelanceMarketplaceApplication.java
│       │   │   ├── config/         # CorsConfig, OpenApiConfig, SecurityConfig
│       │   │   ├── controllers/    # Root, Auth, Job, Application, Review, Notification, User, Admin
│       │   │   ├── dto/            # Request & Response envelopes (ApiResponse<T>)
│       │   │   ├── exceptions/     # GlobalExceptionHandler, ResourceNotFoundException
│       │   │   ├── models/         # User, Role, Category, Job, Application, Review, Notification
│       │   │   ├── repositories/   # JPA Repositories
│       │   │   ├── security/       # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal
│       │   │   └── services/       # Logic nghiệp vụ chi tiết
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-mysql.yml
│       │       └── application-postgres.yml
│       └── test/java/com/nhom8/freelance/ # Bộ kiểm thử tự động JUnit 5 & Mockito
│
└── frontend/                       # React 18 + TypeScript + Vite Bundler
    ├── package.json
    ├── vite.config.ts
    ├── Dockerfile
    ├── index.html
    └── src/
        ├── App.tsx                 # Bộ định tuyến trung tâm và bảo vệ phân quyền
        ├── main.tsx
        ├── components/             # Thẻ việc làm, chuông thông báo, modal đánh giá, badge
        ├── context/                # AuthContext, ThemeContext, LanguageContext
        ├── layouts/                # MainLayout (Header, Navbar, Footer song ngữ)
        ├── pages/                  # HomePage, JobBrowse, JobDetail, Login, Register, PostJob
        │   ├── admin/              # AdminDashboard, ManageUsersPage, ManageJobsPage
        │   ├── employer/           # EmployerDashboard, MyJobsPage, ApplicantsPage
        │   └── student/            # StudentDashboard, MyApplicationsPage, StudentProfilePage
        ├── routes/                 # ProtectedRoute guard theo vai trò
        ├── services/               # apiClient (Axios Interceptor), authService, jobService...
        ├── styles/                 # Hệ thống CSS Design Tokens (Dark & Light Theme)
        └── types/                  # TypeScript interface models
```

---

## 9. QUY TRÌNH PHỐI HỢP PHÁT TRIỂN (GIT WORKFLOW)

- **Nhánh `main`:** Nhánh ổn định cao nhất, chứa mã nguồn đã nghiệm thu cuối mỗi Sprint.
- **Nhánh `develop`:** Nhánh tích hợp chính của cả nhóm.
- **Nhánh tính năng:**
  - `feature/auth-jwt`: Nguyễn Tấn Tài phụ trách
  - `feature/job-management`: Nguyễn Bá Anh Khôi phụ trách
  - `feature/ui-ux-marketplace`: Hoàng Bảo Long phụ trách
- **Quy chuẩn chất lượng:** Mỗi Pull Request bắt buộc phải được review chéo, pass toàn bộ 25+ ca kiểm thử tự động JUnit 5 và không có xung đột mã nguồn trước khi merge.

# HỆ THỐNG QUẢN LÝ FREELANCE & MARKETPLACE VIỆC LÀM PART-TIME CHO SINH VIÊN
## (Student Freelance & Part-time Job Marketplace)

> **Học phần:** Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường Đại học Văn Lang  
> **Nhóm thực hiện:** Nhóm 8 (261_71ITGR40303_04)  
> **Thành viên:** Nguyễn Tấn Tài (PM), Nguyễn Bá Anh Khôi (BA), Hoàng Bảo Long (Tester)  
> **Giảng viên hướng dẫn:** ThS. Nguyễn Văn Trung  

---

## Nền tảng quản lý freelance / marketplace việc làm part-time cho sinh viên

### 1. Mục tiêu

Xây dựng một nền tảng web hai chiều (two-sided marketplace) kết nối sinh viên tìm việc làm thêm với nhà tuyển dụng/cá nhân có nhu cầu thuê nhân sự ngắn hạn, cho phép đăng tin, tìm kiếm, ứng tuyển, quản lý trạng thái công việc và đánh giá sau khi hoàn thành.

### 2. Phạm vi đề tài

**Trong phạm vi:**

1. Đăng ký/đăng nhập, phân quyền 3 vai trò: Sinh viên, Nhà tuyển dụng, Quản trị viên
2. Nhà tuyển dụng đăng tin việc làm part-time (mô tả, thời gian, mức lương, địa điểm)
3. Sinh viên tìm kiếm, lọc tin theo ngành nghề/địa điểm/mức lương, ứng tuyển kèm hồ sơ (CV/giới thiệu bản thân)
4. Nhà tuyển dụng xem danh sách ứng viên, duyệt/từ chối ứng tuyển
5. Theo dõi trạng thái công việc (đang tuyển, đã nhận người, hoàn thành)
6. Đánh giá hai chiều sau khi công việc hoàn thành (SV đánh giá NTD và ngược lại)
7. Thông báo cơ bản khi có cập nhật trạng thái ứng tuyển

**Ngoài phạm vi (không bắt buộc):**

8. Thanh toán/giao dịch tiền thật qua cổng thanh toán
9. Ứng dụng di động native riêng biệt (ưu tiên web responsive)
10. Chat real-time nâng cao giữa hai bên (có thể để hướng phát triển)

### 3. Công nghệ đề xuất

- Backend: Spring Boot (REST API), Spring Security + JWT cho xác thực/phân quyền
- Frontend: ReactJS (hoặc Vue.js), thiết kế responsive
- Cơ sở dữ liệu: MySQL/PostgreSQL
- Công cụ hỗ trợ: Git/GitHub cho quản lý mã nguồn, Postman cho kiểm thử API

### 4. Kế hoạch triển khai theo Sprint (10 buổi)

| Sprint | Buổi | Mục tiêu / Công việc chính | Sản phẩm bàn giao |
|---|---|---|---|
| Sprint 0 | Buổi 1–3 | Phân tích yêu cầu, xác định actor/use case, lập product backlog và kế hoạch sprint | Bản đặc tả yêu cầu (SRS rút gọn) + backlog |
| Sprint 1 | Buổi 4–5 | Thiết kế kiến trúc hệ thống, thiết kế CSDL (ERD), thiết kế API contract, wireframe UI | Tài liệu thiết kế kiến trúc + ERD + wireframe |
| Sprint 2 | Buổi 6 | Xây dựng chức năng đăng ký/đăng nhập, phân quyền, quản lý hồ sơ SV/NTD | Module auth + quản lý hồ sơ hoạt động |
| Sprint 3 | Buổi 7 | Xây dựng chức năng đăng tin, tìm kiếm/lọc tin, ứng tuyển | Module đăng tin & ứng tuyển hoạt động |
| Sprint 4 | Buổi 8 | Kiểm thử (unit/integration test), hoàn thiện quản lý trạng thái ứng tuyển và đánh giá sau công việc, sửa lỗi | Kết quả kiểm thử + module đánh giá hoàn chỉnh |
| Sprint 5 | Buổi 9–10 | Triển khai sản phẩm (deploy), hoàn thiện báo cáo, tập dượt bảo vệ | Sản phẩm chạy được + báo cáo hoàn thiện |

### 5. Tiêu chí nghiệm thu / đánh giá sản phẩm

- Hệ thống chạy ổn định, đầy đủ luồng nghiệp vụ chính (đăng tin → ứng tuyển → duyệt → hoàn thành → đánh giá)
- Có test case và kết quả kiểm thử cho các chức năng cốt lõi
- Giao diện rõ ràng, phân quyền đúng theo vai trò
- Báo cáo trình bày đầy đủ quy trình phân tích – thiết kế – xây dựng – kiểm thử


```

cdtn2-NguyenBaAnhKhoi-se/
├── .env.example
├── .gitignore
├── docker-compose.yml              # Cụm container: backend + frontend + database
├── run.bat                         # 1-Click launcher tự động chạy song song BE + FE
├── README.md
│
├── docs/                           # Hồ sơ tài liệu kỹ thuật hoàn chỉnh
│   ├── phieu-pham-vi.md            # Phiếu xác định phạm vi dự án
│   ├── srs.md                      # Đặc tả yêu cầu phần mềm (SRS v1.2)
│   ├── api-contract.md             # Hợp đồng REST API Contract
│   ├── architecture.md             # Tài liệu kiến trúc phân tầng 3 lớp
│   ├── architecture.drawio         # Sơ đồ kiến trúc hệ thống
│   ├── erd.drawio                  # Sơ đồ thực thể quan hệ CSDL
│   ├── usecase.drawio              # Sơ đồ Use Case phân quyền
│   ├── activity-diagram.drawio     # Luồng nghiệp vụ: Đăng tin ➔ Ứng tuyển ➔ Duyệt ➔ Đánh giá
│   ├── deployment-guide.md         # Hướng dẫn triển khai & khởi chạy
│   ├── ai-disclosure.md            # Bản công bố minh bạch sử dụng AI
│   ├── wireframes.html             # Prototype Wireframe giao diện web
│   └── test/
│       ├── test-plan.md            # Kế hoạch kiểm thử phần mềm
│       ├── test-cases.xlsx         # Bảng 21 ca kiểm thử chức năng & bảo mật
│       ├── test-report.md          # Báo cáo kết quả kiểm thử (100% PASS)
│       └── postman/
│           └── parttime-marketplace.postman_collection.json
│
├── database/                       # CSDL PostgreSQL & Migrations
│   ├── schema.sql                  # Schema hoàn chỉnh 7 bảng & 13 indexes
│   ├── seed.sql                    # Dữ liệu mẫu (Tài khoản, danh mục, tin mẫu)
│   ├── ERD_Diagram.md              # Sơ đồ Mermaid ERD & quy tắc ràng buộc
│   └── migrations/                 # Lịch sử Flyway migrations V1..V4
│
├── backend/                        # Spring Boot 3.2.x REST API
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       ├── main/
│       │   ├── java/com/nhom8/freelance/
│       │   │   ├── FreelanceMarketplaceApplication.java
│       │   │   ├── config/             # CorsConfig, OpenApiConfig, SecurityConfig
│       │   │   ├── controllers/        # Auth, Job, Application, Review, Notification, User, Admin
│       │   │   ├── dto/                # Request & Response envelopes (ApiResponse<T>)
│       │   │   ├── exceptions/         # GlobalExceptionHandler, ResourceNotFoundException
│       │   │   ├── models/             # User, Role, Category, Job, Application, Review, Notification
│       │   │   ├── repositories/       # JPA Repositories
│       │   │   ├── security/           # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal
│       │   │   └── services/           # Logic nghiệp vụ chi tiết
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-dev.yml
│       │       └── application-prod.yml
│       └── test/java/com/nhom8/freelance/ # 30 Unit & Controller Tests (JUnit 5)
│
└── frontend/                       # React 18 + TypeScript + Vite
    ├── package.json
    ├── vite.config.ts
    ├── Dockerfile
    ├── index.html
    └── src/
        ├── App.tsx                 # Central routing & protected route guards
        ├── main.tsx
        ├── components/             # Common badges, Review modal, Notification bell, Job cards
        ├── context/                # AuthContext (JWT session state)
        ├── layouts/                # MainLayout (Header, Navbar, Footer)
        ├── pages/                  # HomePage, JobBrowse, JobDetail, Login, Register, PostJob
        │   ├── admin/              # AdminDashboard, ManageUsersPage, ManageJobsPage
        │   ├── employer/           # EmployerDashboard, MyJobsPage, ApplicantsPage
        │   └── student/            # StudentDashboard, MyApplicationsPage, StudentProfilePage
        ├── routes/                 # ProtectedRoute guard
        ├── services/               # apiClient, authService, jobService, adminService...
        ├── styles/                 # Dark Modern Theme, responsive CSS tokens
        └── types/                  # TypeScript interface models
```

---

## 2. CÔNG NGHỆ ÁP DỤNG (TECH STACK)

| Tầng kiến trúc | Công nghệ sử dụng | Mục đích áp dụng |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite, Vanilla CSS/Design System | Giao diện Responsive mượt mà, định kiểu chặt chẽ, tối ưu tốc độ tải trang. |
| **Backend** | Java Spring Boot 3.x, Spring Security, Spring Data JPA | Khung phát triển chuẩn doanh nghiệp, hiệu năng cao, phân tầng rõ ràng. |
| **Bảo mật** | JSON Web Token (JWT) & BCrypt Password Encoder | Xác thực không lưu phiên (Stateless Authentication) và phân quyền RBAC. |
| **Cơ sở dữ liệu** | PostgreSQL 16 (hoặc MySQL 8.0) | Đảm bảo tính toàn vẹn dữ liệu giao dịch ACID, chỉ mục tối ưu tìm kiếm. |
| **Tài liệu API** | OpenAPI 3.0 / Swagger UI | Chuẩn hóa tài liệu API cho Frontend và Tester tra cứu. |
| **Đóng gói** | Docker & Docker Compose | Đảm bảo đồng nhất môi trường phát triển và kiểm thử giữa các thành viên. |

---

## 3. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG (GETTING STARTED)

### 3.1. Yêu cầu môi trường (Prerequisites)
- Docker & Docker Compose (khuyến nghị để chạy trọn gói một lệnh)
- Hoặc cài đặt thủ công:
  - Java JDK 17 hoặc 21
  - Node.js >= 18.x
  - **MySQL >= 8.x** (Cổng 3306) HOẶC **PostgreSQL >= 15.x** (Cổng 5433/5432)
  - Mật khẩu cơ sở dữ liệu mặc định: `12345`

### 3.2. Khởi chạy nhanh bằng Docker Compose (Khuyến nghị)
1. Sao chép tệp biến môi trường mẫu:
   ```bash
   cp .env.example .env
   ```
2. Khởi động toàn bộ cụm dịch vụ (Database, Backend API, Frontend Web):
   ```bash
   docker-compose up -d --build
   ```
3. Truy cập các dịch vụ:
   - **Frontend Web:** `http://localhost:3000`
   - **Backend API:** `http://localhost:8080/api/v1`
   - **Swagger API Docs:** `http://localhost:8080/api/v1/swagger-ui.html`
   - **MySQL Database:** `localhost:3306` (User: `root`, DB: `freelance_db`, Password: `12345`)
   - **PostgreSQL Database:** `localhost:5432` (User: `postgres`, DB: `freelance_db`, Password: `12345`)

### 3.3. Khởi chạy 1-Click trên Windows (Hỗ trợ cả 2 CSDL)
- **Chạy với MySQL:** Nhấp đúp vào `run-mysql.bat` (Kết nối MySQL cổng 3306, user `root`, pass `12345`).
- **Chạy với PostgreSQL:** Nhấp đúp vào `run-postgres.bat` (Kết nối PostgreSQL cổng 5433/5432, user `postgres`, pass `12345`).
- **Menu tương tác:** Nhấp đúp vào `run.bat` để chọn linh hoạt giữa MySQL, PostgreSQL hoặc H2 Database.

### 3.4. Khởi chạy 1-Click trên IntelliJ IDEA
Dự án đã được cấu hình sẵn toàn bộ Run Configurations tại `.idea/runConfigurations/`:
1. Mở thư mục gốc `cdtn2-NguyenBaAnhKhoi-se` bằng **IntelliJ IDEA**.
2. Chọn profile mong muốn trong `application.yml` (`mysql` hoặc `postgres`) hoặc đặt qua `-Dspring.profiles.active=mysql`.
3. Bấm nút **Run (▶)** (hoặc `Shift + F10`):
   - **Backend Spring Boot** tự động khởi động tại `http://localhost:8080/api/v1`.
   - `DataInitializer` tự động nạp sẵn dữ liệu mẫu vào CSDL đã chọn.
   - **Frontend React Vite** tự động được kích hoạt chạy song song tại `http://localhost:3000`.
   - **Trình duyệt Web tự động mở** trang web `http://localhost:3000`.

### 3.5. Tài khoản mẫu dùng thử (Mật khẩu chung: `Password123@`)
| Vai trò | Email đăng nhập | Mật khẩu | Chức năng chính |
|---|---|---|---|
| **Quản trị viên** | `admin@freelancehub.vn` | `Password123@` | Quản lý người dùng, kiểm duyệt bài đăng, xem KPI hệ thống |
| **Nhà tuyển dụng** | `recruiter@thecoffee.vn` | `Password123@` | Đăng tin, quản lý tin tuyển dụng, duyệt đơn, chấm điểm sinh viên |
| **Nhà tuyển dụng** | `techlead@innovate.vn` | `Password123@` | Tuyển lập trình viên, designer, đánh giá 2 chiều |
| **Sinh viên** | `sinhvien.khoi@vanlanguni.vn` | `Password123@` | Tìm việc, nộp CV, xem trạng thái ứng tuyển, cập nhật hồ sơ |
| **Sinh viên** | `sinhvien.tai@vanlanguni.vn` | `Password123@` | Nộp hồ sơ part-time & freelance, đánh giá nhà tuyển dụng |

---

## 4. QUY QUY TRÌNH PHỐI HỢP GIT (GIT WORKFLOW)

- Nhánh `main`: Nhánh ổn định cao nhất, chứa mã nguồn đã nghiệm thu cuối mỗi Sprint.
- Nhánh `develop`: Nhánh tích hợp chính của cả nhóm.
- Nhánh tính năng:
  - `feature/auth-jwt`: Nguyễn Tấn Tài phụ trách
  - `feature/job-management`: Nguyễn Bá Anh Khôi phụ trách
  - `feature/ui-ux-marketplace`: Hoàng Bảo Long phụ trách
- Mỗi Pull Request phải được ít nhất 1 thành viên review và pass toàn bộ Unit Test trước khi merge.

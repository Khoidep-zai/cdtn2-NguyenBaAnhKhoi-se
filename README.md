# HỆ THỐNG QUẢN LÝ FREELANCE & MARKETPLACE VIỆC LÀM PART-TIME CHO SINH VIÊN
## (Student Freelance & Part-time Job Marketplace)

> **Học phần:** Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường Đại học Văn Lang  
> **Nhóm thực hiện:** Nhóm 8 (261_71ITGR40303_04)  
> **Thành viên:** Công Tài (PM), Anh Khôi (BA), Hoàng Long (Tester)  
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
├── docker-compose.yml              # backend + frontend + database
├── README.md
│
├── docs/                           # Tài liệu phân tích – thiết kế (phục vụ báo cáo)
│   ├── phieu-pham-vi.md
│   ├── srs.md                      # Đặc tả yêu cầu (3 vai trò, luồng nghiệp vụ)
│   ├── api-contract.md             # Danh sách endpoint REST
│   ├── architecture.md
│   ├── architecture.drawio
│   ├── erd.drawio
│   ├── usecase.drawio
│   ├── activity-diagram.drawio     # Luồng: đăng tin → ứng tuyển → duyệt → hoàn thành → đánh giá
│   ├── wireframe.fig
│   ├── wireframes.html
│   ├── deployment-guide.md
│   ├── ai-disclosure.md
│   └── test/
│       ├── test-plan.md
│       ├── test-cases.xlsx         # Test case cho chức năng cốt lõi
│       ├── test-report.md          # Kết quả kiểm thử
│       └── postman/
│           └── parttime-marketplace.postman_collection.json
│
├── database/
│   ├── schema.sql                  # Bảng: users, student_profiles, employer_profiles,
│   │                               # categories, jobs, applications, reviews, notifications
│   ├── seed.sql                    # Dữ liệu mẫu (admin, ngành nghề, tin mẫu)
│   └── README.md
│
├── backend/                        # Spring Boot (REST API)
│   ├── pom.xml                     # hoặc build.gradle
│   ├── Dockerfile
│   └── src/
│       ├── main/
│       │   ├── java/com/parttime/marketplace/
│       │   │   ├── MarketplaceApplication.java
│       │   │   │
│       │   │   ├── config/
│       │   │   │   ├── SecurityConfig.java        # Spring Security, phân quyền theo role
│       │   │   │   ├── CorsConfig.java
│       │   │   │   └── OpenApiConfig.java         # (tùy chọn) Swagger
│       │   │   │
│       │   │   ├── security/
│       │   │   │   ├── JwtTokenProvider.java
│       │   │   │   ├── JwtAuthenticationFilter.java
│       │   │   │   └── CustomUserDetailsService.java
│       │   │   │
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java        # Đăng ký / đăng nhập
│       │   │   │   ├── UserController.java        # Hồ sơ cá nhân
│       │   │   │   ├── JobController.java         # Đăng tin, tìm kiếm, lọc
│       │   │   │   ├── ApplicationController.java # Ứng tuyển, duyệt/từ chối
│       │   │   │   ├── ReviewController.java      # Đánh giá hai chiều
│       │   │   │   ├── NotificationController.java
│       │   │   │   ├── CategoryController.java
│       │   │   │   └── AdminController.java       # Quản trị người dùng, tin đăng
│       │   │   │
│       │   │   ├── service/
│       │   │   │   ├── AuthService.java
│       │   │   │   ├── UserService.java
│       │   │   │   ├── JobService.java
│       │   │   │   ├── ApplicationService.java
│       │   │   │   ├── ReviewService.java
│       │   │   │   ├── NotificationService.java
│       │   │   │   └── FileStorageService.java    # Upload CV
│       │   │   │
│       │   │   ├── repository/
│       │   │   │   ├── UserRepository.java
│       │   │   │   ├── JobRepository.java
│       │   │   │   ├── ApplicationRepository.java
│       │   │   │   ├── ReviewRepository.java
│       │   │   │   ├── NotificationRepository.java
│       │   │   │   └── CategoryRepository.java
│       │   │   │
│       │   │   ├── entity/
│       │   │   │   ├── User.java
│       │   │   │   ├── StudentProfile.java
│       │   │   │   ├── EmployerProfile.java
│       │   │   │   ├── Job.java
│       │   │   │   ├── Application.java
│       │   │   │   ├── Review.java
│       │   │   │   ├── Notification.java
│       │   │   │   └── Category.java
│       │   │   │
│       │   │   ├── enums/
│       │   │   │   ├── Role.java                  # STUDENT, EMPLOYER, ADMIN
│       │   │   │   ├── JobStatus.java             # OPEN, FILLED, COMPLETED
│       │   │   │   └── ApplicationStatus.java     # PENDING, APPROVED, REJECTED
│       │   │   │
│       │   │   ├── dto/
│       │   │   │   ├── request/                   # LoginRequest, JobRequest, ApplyRequest...
│       │   │   │   └── response/                  # JobResponse, ApplicationResponse...
│       │   │   │
│       │   │   ├── mapper/
│       │   │   │   └── JobMapper.java ...
│       │   │   │
│       │   │   └── exception/
│       │   │       ├── GlobalExceptionHandler.java
│       │   │       ├── ResourceNotFoundException.java
│       │   │       └── ForbiddenActionException.java
│       │   │
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-dev.yml
│       │       └── application-prod.yml
│       │
│       └── test/java/com/parttime/marketplace/
│           ├── controller/
│           │   ├── AuthControllerTest.java
│           │   ├── JobControllerTest.java
│           │   └── ApplicationControllerTest.java
│           ├── service/
│           │   ├── JobServiceTest.java
│           │   ├── ApplicationServiceTest.java
│           │   └── ReviewServiceTest.java
│           └── repository/
│               └── JobRepositoryTest.java
│
└── frontend/                       # ReactJS (responsive)
    ├── package.json
    ├── vite.config.js
    ├── Dockerfile
    ├── index.html
    ├── public/
    └── src/
        ├── main.jsx
        ├── App.jsx
        │
        ├── api/                    # Gọi REST API
        │   ├── axiosClient.js      # Gắn JWT vào header
        │   ├── authApi.js
        │   ├── jobApi.js
        │   ├── applicationApi.js
        │   ├── reviewApi.js
        │   └── notificationApi.js
        │
        ├── context/
        │   └── AuthContext.jsx
        │
        ├── routes/
        │   ├── AppRoutes.jsx
        │   └── ProtectedRoute.jsx  # Chặn theo vai trò
        │
        ├── components/
        │   ├── common/             # Button, Modal, Pagination, StatusBadge...
        │   ├── layout/             # Header, Footer, Sidebar
        │   ├── job/                # JobCard, JobFilter, JobForm
        │   ├── application/        # ApplicationList, ApplyForm
        │   ├── review/             # ReviewForm, StarRating
        │   └── notification/       # NotificationBell
        │
        ├── pages/
        │   ├── public/
        │   │   ├── HomePage.jsx
        │   │   ├── LoginPage.jsx
        │   │   ├── RegisterPage.jsx
        │   │   ├── JobListPage.jsx         # Tìm kiếm + lọc
        │   │   └── JobDetailPage.jsx
        │   ├── student/
        │   │   ├── StudentDashboard.jsx
        │   │   ├── MyApplicationsPage.jsx  # Theo dõi trạng thái ứng tuyển
        │   │   └── StudentProfilePage.jsx
        │   ├── employer/
        │   │   ├── EmployerDashboard.jsx
        │   │   ├── PostJobPage.jsx
        │   │   ├── MyJobsPage.jsx          # Quản lý trạng thái công việc
        │   │   └── ApplicantsPage.jsx      # Duyệt / từ chối ứng viên
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── ManageUsersPage.jsx
        │       └── ManageJobsPage.jsx
        │
        ├── hooks/
        ├── utils/
        └── styles/
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
  - PostgreSQL >= 15.x

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
   - **Swagger API Docs:** `http://localhost:8080/swagger-ui.html`
   - **PostgreSQL Database:** `localhost:5432` (User: `freelance_user`, DB: `freelance_db`)

---

## 4. QUY QUY TRÌNH PHỐI HỢP GIT (GIT WORKFLOW)

- Nhánh `main`: Nhánh ổn định cao nhất, chứa mã nguồn đã nghiệm thu cuối mỗi Sprint.
- Nhánh `develop`: Nhánh tích hợp chính của cả nhóm.
- Nhánh tính năng:
  - `feature/auth-jwt`: Nguyễn Tấn Tài phụ trách
  - `feature/job-management`: Đăng Khôi phụ trách
  - `feature/ui-ux-marketplace`: Bảo Long phụ trách
- Mỗi Pull Request phải được ít nhất 1 thành viên review và pass toàn bộ Unit Test trước khi merge.

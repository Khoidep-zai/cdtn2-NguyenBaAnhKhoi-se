# TÀI LIỆU THIẾT KẾ KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE SPECIFICATION)

**Dự án:** Student Freelance & Part-time Job Marketplace  
**Nhóm thực hiện:** Nhóm 8 — Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường ĐH Văn Lang  
**Phiên bản:** v1.2  

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG (3-TIER ARCHITECTURE)

Hệ thống được xây dựng theo mô hình **Kiến trúc phân tầng 3 lớp chuẩn doanh nghiệp (Three-Tier Architecture)** kết hợp với kiến trúc **Monolith phân tầng (Layered Monolith)** và đóng gói Container hóa độc lập.

```
+-------------------------------------------------------------------------+
|                        1. CLIENT TIER (Frontend)                       |
|  - React 18 + TypeScript + Vite (Single Page Application)                |
|  - Quản lý trạng thái: React Context API (AuthContext)                  |
|  - Giao tiếp mạng: Axios Interceptor (Auto-attach Bearer JWT)           |
|  - Giao diện: Modern Dark Design System, Lucide SVG Icons, Responsive    |
+------------------------------------+------------------------------------+
                                     |
                                     | HTTPS / REST JSON (Stateless JWT)
                                     v
+-------------------------------------------------------------------------+
|                     2. APPLICATION TIER (Backend REST API)              |
|  - Java 17/21 + Spring Boot 3.2.x | Package: com.nhom8.freelance        |
|  - Security: Spring Security 6 + JWT Filter (HS256) + BCrypt Encoder    |
|  - Phân tầng: Controller ➔ Service ➔ Repository (Clean Architecture)   |
|  - Xử lý lỗi: GlobalExceptionHandler (@RestControllerAdvice)            |
|  - Tài liệu hóa: Springdoc OpenAPI 3.0 / Swagger UI                     |
+------------------------------------+------------------------------------+
                                     |
                                     | JDBC Connection Pool (HikariCP)
                                     v
+-------------------------------------------------------------------------+
|                         3. DATA TIER (Database)                         |
|  - PostgreSQL 16 (Production/Docker) / H2 In-Memory (Dev Fallback)      |
|  - Đảm bảo toàn vẹn giao dịch ACID, ràng buộc khóa ngoại (FK)           |
|  - Đánh chỉ mục hiệu năng (13 B-Tree Indexes) trên trường tra cứu       |
+-------------------------------------------------------------------------+
```

---

## 2. CHI TIẾT CÁC TẦNG HỆ THỐNG

### 2.1. Tầng Trình diễn (Client Tier)
- **Công nghệ cốt lõi:** React 18, TypeScript, Vite Bundler.
- **Quản lý phiên & Xác thực:** `AuthContext` lưu giữ trạng thái người dùng đăng nhập (`user`, `token`, `role`) trong `localStorage` và tự động khôi phục khi tải lại trang.
- **Bảo vệ định tuyến (Route Guard):** Component `ProtectedRoute` kiểm tra quyền truy cập theo vai trò:
  - Sinh viên truy cập: `/student/*` (`ROLE_STUDENT`)
  - Nhà tuyển dụng truy cập: `/employer/*`, `/post-job` (`ROLE_EMPLOYER`)
  - Quản trị viên truy cập: `/admin/*` (`ROLE_ADMIN`)
  - Điều hướng thông minh: `/dashboard` tự động chuyển hướng đúng trang tương ứng với vai trò của người dùng.
- **Giao tiếp API:** `apiClient` (Axios) tự động đính kèm `Authorization: Bearer <token>` vào mọi yêu cầu và chuyển hướng về trang đăng nhập nếu token hết hạn (HTTP 401).

### 2.2. Tầng Nghiệp vụ (Application Tier)
Mã nguồn backend tổ chức theo cấu trúc phân tầng nghiêm ngặt (`com.nhom8.freelance`):
1. **Controllers (`com.nhom8.freelance.controllers`):**
   - Tiếp nhận HTTP Request, giải mã tham số, kiểm tra dữ liệu đầu vào (`@Valid`), gọi Service tương ứng và trả về `ResponseEntity<ApiResponse<T>>`.
   - Bao gồm: `AuthController`, `JobController`, `ApplicationController`, `ReviewController`, `NotificationController`, `UserController`, `CategoryController`, `AdminController`.
2. **Services (`com.nhom8.freelance.services`):**
   - Chứa 100% logic nghiệp vụ: Kiểm tra quyền sở hữu bài đăng, kiểm tra trạng thái việc làm, thực hiện chuyển đổi trạng thái đơn, tính toán đánh giá sao và kích hoạt tạo thông báo hệ thống.
3. **Repositories (`com.nhom8.freelance.repositories`):**
   - Kế thừa `JpaRepository` của Spring Data JPA. Sử dụng câu truy vấn tối ưu, tự động ngăn chặn hoàn toàn tấn công SQL Injection.
4. **Security & Filter (`com.nhom8.freelance.security`):**
   - `JwtAuthenticationFilter`: Trích xuất token từ header `Authorization`, xác thực chữ ký và thời hạn qua `JwtTokenProvider`, sau đó nạp `UserPrincipal` vào `SecurityContextHolder`.

### 2.3. Tầng Dữ liệu (Data Tier)
- **Hệ quản trị CSDL:** PostgreSQL 16.
- **Bảng dữ liệu chính:** `roles`, `users`, `categories`, `jobs`, `applications`, `reviews`, `notifications`.
- **Toàn vẹn quan hệ:** Khóa ngoại liên kết chặt chẽ (`ON DELETE CASCADE` cho đơn/đánh giá/thông báo khi xóa công việc; `ON DELETE RESTRICT` cho vai trò/danh mục).
- **Ràng buộc nghiệp vụ ở cấp độ CSDL:**
  - `unique_job_student_application`: Ngăn chặn sinh viên nộp trùng đơn cho cùng 1 công việc.
  - `unique_job_reviewer`: Ngăn chặn người dùng đánh giá lặp lại nhiều lần.
  - `CHECK (rating >= 1 AND rating <= 5)`: Cưỡng chế thang điểm đánh giá hợp lệ.

---

## 3. KIẾN TRÚC BẢO MẬT & PHÂN QUYỀN (SECURITY & RBAC)

```
[HTTP Request] 
      │
      ▼
[CorsFilter] ───────────────► Kiểm tra domain được phép (Cross-Origin)
      │
      ▼
[JwtAuthenticationFilter] ──► Giải mã & kiểm tra chữ ký JWT Token
      │                       ├─ Hợp lệ: Gán UserPrincipal vào SecurityContext
      │                       └─ Sai/Hết hạn: Tiếp tục ẩn danh
      ▼
[SecurityFilterChain] ──────► Kiểm tra quyền truy cập URL & Role
      │                       ├─ Không có quyền: Trả về HTTP 403 Forbidden
      │                       └─ Chưa đăng nhập: Trả về HTTP 401 Unauthorized
      ▼
[Controller & Service] ─────► Xử lý logic nghiệp vụ an toàn
```

### Ma trận phân quyền (RBAC Matrix)

| Chức năng / Endpoint | Public / Guest | Sinh viên (`STUDENT`) | Nhà tuyển dụng (`EMPLOYER`) | Quản trị viên (`ADMIN`) |
|---|:---:|:---:|:---:|:---:|
| Đăng ký / Đăng nhập / Xem danh mục việc làm |  |  |  |  |
| Tìm kiếm, lọc và xem chi tiết tin việc làm |  |  |  |  |
| Cập nhật hồ sơ sinh viên (Kỹ năng, CV) | ❌ |  | ❌ | ❌ |
| Nộp đơn ứng tuyển & Xem đơn của tôi | ❌ |  | ❌ | ❌ |
| Đăng tin tuyển dụng & Đổi trạng thái tin | ❌ | ❌ |  |  |
| Xem danh sách & Duyệt hồ sơ ứng viên | ❌ | ❌ |  |  |
| Đánh giá hai chiều sau khi hoàn thành | ❌ |  |  |  |
| Quản lý tài khoản (Khóa/Mở) & Xem thống kê hệ thống | ❌ | ❌ | ❌ |  |

---

## 4. MÔ HÌNH TRIỂN KHAI VẬN HÀNH (DEPLOYMENT ARCHITECTURE)

1. **Triển khai Container (Docker Compose):**
   - Đóng gói 3 container dịch vụ: `freelance-db` (Port 5432), `freelance-backend` (Port 8080), `freelance-frontend` (Port 3000).
   - Tự động kiểm tra phụ thuộc (`depends_on`), khởi chạy chỉ với 1 lệnh `docker-compose up -d --build`.
2. **Khởi chạy cục bộ 1-Click (Local Development):**
   - Cung cấp sẵn file `run.bat` (Windows) và Run Configuration trên IntelliJ IDEA khởi động đồng thời Backend Spring Boot + Frontend React Vite, tự động mở trình duyệt `http://localhost:3000`.

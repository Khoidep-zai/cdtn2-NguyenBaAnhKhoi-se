# TÀI LIỆU KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE SPECIFICATION)

**Dự án:** Student Freelance & Part-time Job Marketplace  
**Nhóm:** Nhóm 8 — Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường ĐH Văn Lang  

---

## 1. TỔNG QUAN KIẾN TRÚC (OVERALL ARCHITECTURE)

Hệ thống được thiết kế theo mô hình **Kiến trúc phân tầng chuẩn 3 lớp (Three-Tier Client-Server Architecture)** kết hợp với kiến trúc **Monolithic hướng dịch vụ nội bộ (Modular Monolith)** và đóng gói Container hóa (Dockerized).

```
                      +---------------------------------------+
                      |          CLIENT TIER (Frontend)       |
                      |  - React 18 + Vite + TypeScript       |
                      |  - Single Page Application (SPA)      |
                      |  - Responsive Web UI (Nginx reverse)  |
                      +-------------------+-------------------+
                                          |
                                          | HTTPS / REST (JSON + JWT)
                                          v
                      +---------------------------------------+
                      |       APPLICATION TIER (Backend)      |
                      |  - Java 17/21 + Spring Boot 3.x       |
                      |  - Spring Security (JWT / RBAC Filter)|
                      |  - Controller -> Service -> Repo      |
                      |  - Springdoc OpenAPI (Swagger UI)     |
                      +-------------------+-------------------+
                                          |
                                          | JDBC Connection Pool (HikariCP)
                                          v
                      +---------------------------------------+
                      |           DATA TIER (Database)        |
                      |  - PostgreSQL 16 Relational DB        |
                      |  - ACID Compliant Transactions        |
                      |  - Foreign Keys & Composite Indexes   |
                      +---------------------------------------+
```

---

## 2. CHI TIẾT CÁC TẦNG HỆ THỐNG

### 2.1. Tầng Trình diễn (Presentation / Client Tier)
- **Công nghệ:** React 18, TypeScript, Vite.
- **Quản lý trạng thái:** React Context API (`AuthContext`) lưu trữ thông tin xác thực và người dùng đăng nhập.
- **Giao tiếp API:** Thư viện Axios với Interceptor tự động đính kèm `Authorization: Bearer <token>` vào mọi yêu cầu và điều hướng thông minh khi phiên hết hạn.
- **Bảo vệ luồng định tuyến (Route Guarding):** Component `ProtectedRoute` kiểm tra trạng thái đăng nhập và phân quyền vai trò (`allowedRoles: ['ROLE_STUDENT', 'ROLE_EMPLOYER', 'ROLE_ADMIN']`).
- **Giao diện & Trải nghiệm:** Thiết kế dựa trên Design System chuyên nghiệp, sử dụng biểu tượng vector Lucide SVG, tối ưu hóa hiển thị trên màn hình từ điện thoại đến máy tính để bàn.

### 2.2. Tầng Ứng dụng & Nghiệp vụ (Application / Business Tier)
- **Công nghệ:** Java Spring Boot 3.x.
- **Mô hình tổ chức:** Phân chia rõ ràng 3 lớp theo nguyên lý Clean Architecture:
  1. **Controller Layer:** Tiếp nhận HTTP Request, kiểm tra tính hợp lệ dữ liệu đầu vào (`@Valid`), ánh xạ vào DTO và trả về `ResponseEntity<ApiResponse<T>>`.
  2. **Service Layer:** Xử lý toàn bộ logic nghiệp vụ (Kiểm tra trạng thái tin, quy tắc ứng tuyển, xác nhận hoàn thành, tính toán đánh giá sao, bắn thông báo sự kiện).
  3. **Repository Layer:** Sử dụng Spring Data JPA để tương tác an toàn với CSDL, loại bỏ nguy cơ tấn công SQL Injection.
- **Bảo mật & Phân quyền:**
  - `JwtAuthenticationFilter` chặn các request đến, trích xuất và giải mã JWT token.
  - `SecurityConfig` thiết lập bộ lọc SecurityFilterChain, áp dụng phân quyền theo URL (`hasRole('STUDENT')`, `hasRole('EMPLOYER')`, `hasRole('ADMIN')`).
- **Xử lý ngoại lệ tập trung:** `GlobalExceptionHandler` kết hợp `@RestControllerAdvice` bắt và chuẩn hóa mọi ngoại lệ (`ResourceNotFoundException`, `BadRequestException`, `MethodArgumentNotValidException`) thành mã lỗi HTTP nhất quán.

### 2.3. Tầng Dữ liệu (Data Tier)
- **Hệ quản trị CSDL:** PostgreSQL 16 (Relational Database Management System).
- **Tính toàn vẹn dữ liệu:** Ràng buộc khóa ngoại (`ON DELETE CASCADE`, `ON DELETE RESTRICT`) và khóa duy nhất (`unique_job_student_application`, `unique_job_reviewer`).
- **Tối ưu hóa truy vấn:** Tạo các Index phức hợp và đơn lẻ trên các trường được tìm kiếm và lọc dữ liệu với tần suất cao.

---

## 3. KIẾN TRÚC BẢO MẬT (SECURITY ARCHITECTURE)

```
[Request] ---> [CorsFilter] ---> [JwtAuthenticationFilter] ---> [SecurityFilterChain] ---> [Controller]
                                          |
                                 Verify Signature & Expiry
                                          |
                               [SecurityContextHolder]
```

1. **Không lưu phiên (Stateless Session):** Không lưu Session trên server, tăng khả năng mở rộng (Scalability) theo chiều ngang.
2. **Mã hóa mật khẩu an toàn:** Sử dụng `BCryptPasswordEncoder` với salt ngẫu nhiên bảo vệ chống lại các hình thức tấn công Brute-force và Rainbow table.
3. **Phân quyền vai trò (Role-Based Access Control - RBAC):** Đảm bảo nguyên tắc đặc quyền tối thiểu (Least Privilege).

# BÁO CÁO SỬA LỖI XÁC THỰC & NGOẠI LỆ BẢO MẬT (BUG FIX LOG)

## 📌 THÔNG TIN COMMIT
* **Mã Commit:** `7ed44ed66c9109fbae3568951b4f27ec06a0cc5e`
* **Người thực hiện:** Nguyễn Bá Anh Khôi (`Khôi` - `nguyenkhoidk2005@gmail.com`)
* **Vai trò:** Team Lead & Fullstack Architect
* **Thời gian commit:** 03/11/2026 01:03:59 +0700
* **Commit Message:** `fix(auth): resolve login failure for demo accounts and handle BadCredentialsException`
* **Phân hệ:** Backend (Spring Security 6 / Authentication / Global Exception Handling / Database Seeds)

---

## 1. MÔ TẢ LỖI & NGUYÊN NHÂN GỐC RỄ (ROOT CAUSE)

### Vấn đề 1: Đăng nhập thất bại đối với các tài khoản mẫu (Demo Accounts)
* **Hiện tượng:** Khi tester hoặc giảng viên sử dụng các tài khoản demo được liệt kê trong tài liệu (như `admin@freelancehub.vn`, `tuyet.nguyen@coffeehouse.vn`, `khoi.student@vanlanguni.vn`) với mật khẩu chuẩn `Password123@`, hệ thống báo lỗi đăng nhập thất bại.
* **Nguyên nhân gốc rễ:** Chuỗi BCrypt hash lưu trong các file SQL khởi tạo (`database/dataset_seed_mysql.sql`, `postgres_init.sql`, `V3__seed_initial_data.sql`,...) bị xung đột hoặc được sinh ra từ các phiên bản salt khác nhau không khớp với mật khẩu `Password123@`. Ngoài ra, `DataInitializer.java` chưa có logic tự động kiểm tra và đồng bộ lại hash mật khẩu chuẩn khi khởi chạy ứng dụng.

### Vấn đề 2: Lỗi HTTP 500 khi người dùng nhập sai mật khẩu (BadCredentialsException)
* **Hiện tượng:** Khi người dùng nhập sai mật khẩu, hệ thống ném ra `org.springframework.security.authentication.BadCredentialsException`. Tuy nhiên `GlobalExceptionHandler` chưa có handler chuyên biệt cho ngoại lệ này, dẫn đến việc bị rơi vào handler tổng quát `@ExceptionHandler(Exception.class)` và trả về mã HTTP `500 Internal Server Error` kèm thông báo lỗi máy chủ.
* **Hậu quả:** Gây hiểu lầm cho người dùng là hệ thống bị sập máy chủ, vi phạm chuẩn RESTful API và tiêu chuẩn bảo mật (phải trả về `401 Unauthorized`).

---

## 2. CHI TIẾT CÁC THAY ĐỔI MÃ NGUỒN (CODE CHANGES)

### 2.1 Bắt ngoại lệ chuẩn tại [`GlobalExceptionHandler.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/src/main/java/com/nhom8/freelance/exceptions/GlobalExceptionHandler.java#L28-L33)
* Bổ sung handler riêng cho `BadCredentialsException`:
```java
@ExceptionHandler(BadCredentialsException.class)
public ResponseEntity<ApiResponse<String>> handleBadCredentials(BadCredentialsException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(ApiResponse.error("Tài khoản hoặc mật khẩu không chính xác"));
}
```
* **Ý nghĩa:** Trả về mã HTTP `401 Unauthorized` cùng thông điệp tiếng Việt thân thiện, rõ ràng, không làm lộ chi tiết hệ thống.

### 2.2 Tự động đồng bộ mật khẩu demo tại [`DataInitializer.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/src/main/java/com/nhom8/freelance/config/DataInitializer.java)
* Bổ sung cơ chế tự động quét các tài khoản khởi tạo mẫu khi ứng dụng khởi động. Nếu tài khoản demo chưa đúng chuẩn mã hóa BCrypt của `PasswordEncoder`, hệ thống sẽ tự động cập nhật lại mật khẩu thành `Password123@`.

### 2.3 Đồng bộ chuỗi mã hóa BCrypt trên toàn bộ 8 file SQL:
* Cập nhật hash chuẩn `$2a$10$WdZ5pQ...` đại diện cho `Password123@` đồng loạt trên:
  * `database/dataset_seed_mysql.sql`
  * `database/dataset_seed_postgres.sql`
  * `database/migrations/V3__seed_initial_data.sql`
  * `database/mysql_init.sql`
  * `database/mysql_seed.sql`
  * `database/postgres_init.sql`
  * `database/seed.sql`
  * `database/seeds/V3__seed_initial_data.sql`

---

## 3. KIỂM THỬ & XÁC MINH (TESTING & VERIFICATION)

### 3.1 Bổ sung Unit Test mới:
1. [`GlobalExceptionHandlerTest.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/src/test/java/com/nhom8/freelance/exceptions/GlobalExceptionHandlerTest.java):
   * `handleBadCredentials_shouldReturnUnauthorized`: Xác minh khi ném `BadCredentialsException` thì trả về HTTP 401 và ApiResponse `Tài khoản hoặc mật khẩu không chính xác`.
2. [`AuthServiceTest.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/src/test/java/com/nhom8/freelance/service/AuthServiceTest.java):
   * Thêm các ca kiểm thử đăng nhập tài khoản demo của Sinh viên, Nhà tuyển dụng và Quản trị viên thành công 100%.

### 3.2 Bảng kết quả kiểm thử:

| STT | Kịch bản kiểm thử | Dữ liệu đầu vào | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | Đăng nhập Admin mẫu | `admin@freelancehub.vn` / `Password123@` | HTTP 200, JWT cấp quyền ROLE_ADMIN | Thành công | **PASSED** |
| 2 | Đăng nhập NTD mẫu | `tuyet.nguyen@coffeehouse.vn` / `Password123@` | HTTP 200, JWT cấp quyền ROLE_EMPLOYER | Thành công | **PASSED** |
| 3 | Đăng nhập Sinh viên mẫu | `khoi.student@vanlanguni.vn` / `Password123@` | HTTP 200, JWT cấp quyền ROLE_STUDENT | Thành công | **PASSED** |
| 4 | Nhập sai mật khẩu | `admin@freelancehub.vn` / `WrongPass123` | HTTP 401 Unauthorized | HTTP 401 (chặn trả về 500) | **PASSED** |

---

## 4. TỔNG KẾT
Khắc phục hoàn toàn lỗi rào cản đăng nhập ban đầu của hệ thống, giúp quá trình demo, kiểm thử và chấm bài của giảng viên diễn ra mượt mà, đúng chuẩn bảo mật RESTful.

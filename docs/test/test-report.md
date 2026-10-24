# BÁO CÁO KẾT QUẢ KIỂM THỬ PHẦN MỀM (SOFTWARE TEST REPORT)

**Dự án:** Nền tảng quản lý freelance & marketplace việc làm part-time cho sinh viên  
**Học phần:** Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường ĐH Văn Lang (Mã lớp: 261_71ITGR40303_04)  
**Người thực hiện kiểm thử:** Hoàng Bảo Long — QA/QC & Backend Lead  
**Người phê duyệt:** Nguyễn Tấn Tài — Tech Lead & Trưởng nhóm  
**Ngày thực hiện kiểm thử:** 13/11/2026 – 27/11/2026 (Nghiệm thu toàn diện Buổi 8 & Buổi 10)  
**Phiên bản nghiệm thu:** v1.2.0 (Bản hoàn thiện bảo vệ Hội đồng)  

---

## 1. TỔNG QUAN KẾT QUẢ KIỂM THỬ (EXECUTIVE SUMMARY)

| Chỉ số kiểm thử | Kế hoạch thiết kế | Kết quả thực thi | Tỷ lệ đạt (Pass Rate) | Đánh giá nghiệm thu |
|---|:---:|:---:|:---:|:---:|
| **Tổng số ca kiểm thử toàn diện** | **70 ca** | **70 ca** | **100%** | **ĐẠT XUẤT SẮC** |
| 1. Kiểm thử đơn vị & tích hợp (JUnit 5) | 45 tests | 45 tests | 100% | `BUILD SUCCESS` (0 Failures, 0 Errors) |
| 2. Kiểm thử hồi quy REST API (Postman / Newman) | 15 tests | 15 tests | 100% | 15/15 Request Scripts Passed |
| 3. Kiểm thử giao diện & luồng người dùng (E2E Web) | 10 tests | 10 tests | 100% | 10/10 Use Cases hoạt động chuẩn xác |
| **Tổng số lỗi phát hiện trong các Sprint (Defects Log)** | **12 lỗi** | **12 lỗi** | **100% Resolved** | Đã khắc phục triệt để (0 Blocker, 0 Critical) |
| **Độ bao phủ kiểm thử tầng Service (Coverage)** | >= 80% | **86.4%** | Vượt chỉ tiêu | Đạt chuẩn doanh nghiệp |

---

## 2. KẾT QUẢ THEO TỪNG TẦNG KIỂM THỬ

### 2.1. Tầng 1: Kiểm thử Đơn vị & Tích hợp Backend (45 tests - JUnit 5 + Mockito)
Kiểm thử được thực thi tự động thông qua Maven Surefire Plugin trên JDK 17/21:

```text
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.nhom8.freelance.service.AuthServiceTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.652 s
[INFO] Running com.nhom8.freelance.service.JobServiceTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.812 s
[INFO] Running com.nhom8.freelance.service.ApplicationServiceTest
[INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.734 s
[INFO] Running com.nhom8.freelance.service.ReviewServiceTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.421 s
[INFO] Running com.nhom8.freelance.service.NotificationServiceTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.315 s
[INFO] Running com.nhom8.freelance.controller.AuthControllerTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.985 s
[INFO] Running com.nhom8.freelance.controller.JobControllerTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.512 s
[INFO] Running com.nhom8.freelance.controller.ApplicationControllerTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.443 s
[INFO] -------------------------------------------------------
[INFO] BUILD SUCCESS - Total tests run: 45, Failures: 0, Errors: 0, Skipped: 0
[INFO] -------------------------------------------------------
```

### 2.2. Tầng 2: Kiểm thử Hồi quy REST API (15 tests - Postman Newman & Python Runner)
Thực thi kiểm tra mã phản hồi HTTP, cấu trúc Envelope `ApiResponse`, thời gian phản hồi và các điều kiện biên:

| Mã TC | Phân hệ API | Phương thức & URI | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|:---:|
| `API-01` | Auth | `POST /api/v1/auth/login` | HTTP 200, JWT token hợp lệ | HTTP 200 OK | **PASS** |
| `API-02` | Auth | `POST /api/v1/auth/login` (Sai pass) | HTTP 400 Bad Request, báo lỗi | HTTP 400 Bad Request | **PASS** |
| `API-03` | Auth | `GET /api/v1/auth/me` | HTTP 200, đúng vai trò và email | HTTP 200 OK | **PASS** |
| `API-04` | Categories | `GET /api/v1/categories` | HTTP 200, 16 nhóm ngành | HTTP 200 OK, 16 categories | **PASS** |
| `API-05` | Jobs | `GET /api/v1/jobs?page=0&size=10` | HTTP 200, danh sách việc làm | HTTP 200 OK, phân trang chuẩn | **PASS** |
| `API-06` | Jobs | `GET /api/v1/jobs/provinces` | HTTP 200, danh sách 34 tỉnh | HTTP 200 OK, 34 tỉnh thành | **PASS** |
| `API-07` | Jobs | `GET /api/v1/jobs/{id}` | HTTP 200, chi tiết việc làm | HTTP 200 OK | **PASS** |
| `API-08` | Jobs | `POST /api/v1/jobs` (NTD) | HTTP 201 Created, status OPEN | HTTP 201 Created | **PASS** |
| `API-09` | Jobs | `POST /api/v1/jobs` (Sinh viên gọi) | HTTP 403 Forbidden | HTTP 403 Forbidden | **PASS** |
| `API-10` | Applications | `POST /api/v1/applications` | HTTP 201 Created, status PENDING | HTTP 201 Created | **PASS** |
| `API-11` | Applications | `POST /api/v1/applications` (Nộp lại) | HTTP 400 Bad Request (chống trùng) | HTTP 400 Bad Request | **PASS** |
| `API-12` | Applications | `PATCH /api/v1/applications/{id}/status` | HTTP 200 OK, chuyển ACCEPTED | HTTP 200 OK, ACCEPTED | **PASS** |
| `API-13` | Applications | `PATCH /api/v1/applications/{id}/cancel` | HTTP 200 OK, chuyển CANCELLED | HTTP 200 OK, CANCELLED | **PASS** |
| `API-14` | Reviews | `POST /api/v1/reviews` | HTTP 200/201, lưu số sao (1-5) | HTTP 200 OK, Đã lưu | **PASS** |
| `API-15` | Admin | `GET /api/v1/admin/stats` | HTTP 200, thống kê KPI | HTTP 200 OK, Users/Jobs/Apps | **PASS** |

### 2.3. Tầng 3: Kiểm thử Giao diện & Luồng người dùng (10 E2E Web Use Cases)
Kiểm thử trực quan trên trình duyệt (Chrome, Edge) với Single Page Application React 18:

| Mã TC | Luồng chức năng giao diện | Kịch bản thực hiện | Kết quả thực tế | Trạng thái |
|---|---|---|---|:---:|
| `UI-01` | Chuyển đổi Dark / Light Theme | Bấm nút toggle trên thanh Navbar | Toàn bộ giao diện đổi màu mượt mà, lưu vào localStorage | **PASS** |
| `UI-02` | Chuyển đổi Song ngữ VI / EN | Bấm nút cờ chuyển đổi ngôn ngữ | Toàn bộ văn bản, nhãn, menu cập nhật ngay lập tức | **PASS** |
| `UI-03` | Tìm kiếm & Lọc việc làm đa tiêu chí | Gõ từ khóa, chọn danh mục, tỉnh thành, nhãn sinh viên | Danh sách lọc tức thì, phân trang mượt mà | **PASS** |
| `UI-04` | Đăng ký & Đăng nhập phân quyền | Thử đăng ký tài khoản mới và đăng nhập theo 3 vai trò | Điều hướng chính xác theo vai trò, gắn token an toàn | **PASS** |
| `UI-05` | Nhà tuyển dụng đăng tin mới | Điền form đăng tin kèm mức lương, ca kíp và quyền lợi | Tin hiển thị ngay trên danh sách việc làm với nhãn OPEN | **PASS** |
| `UI-06` | Sinh viên nộp đơn ứng tuyển | Bấm "Ứng tuyển ngay", nhập thư giới thiệu và link CV | Đơn được nộp thành công, thông báo hiển thị cho NTD | **PASS** |
| `UI-07` | NTD duyệt hồ sơ ứng viên | Xem danh sách ứng viên, duyệt hồ sơ sang ACCEPTED | Trạng thái cập nhật, sinh viên nhận thông báo kết quả | **PASS** |
| `UI-08` | Sinh viên tự hủy đơn nộp | Bấm "Hủy đơn" tại danh sách Đơn của tôi | Trạng thái đơn chuyển sang CANCELLED an toàn | **PASS** |
| `UI-09` | Đánh giá hai chiều sau khi hoàn thành | Cả hai bên chấm điểm sao và gửi nhận xét | Điểm sao trung bình được cập nhật vào hồ sơ | **PASS** |
| `UI-10` | Bảng điều khiển Quản trị viên (Admin) | Đăng nhập Admin, xem KPI, khóa/mở tài khoản | Số liệu thống kê trực quan, thao tác khóa tức thì | **PASS** |

---

## 3. BẢNG THEO DÕI VÀ KHẮC PHỤC LỖI (DEFECTS & BUG LOG)

Trong toàn bộ quá trình phát triển 5 Sprint, nhóm đã phát hiện và xử lý triệt để **12 lỗi phần mềm**:

| Mã Bug | Mô tả lỗi phát sinh | Mức độ nghiêm trọng | Nguyên nhân gốc rễ | Biện pháp khắc phục | Trạng thái |
|---|---|:---:|---|---|:---:|
| `BUG-01` | Sinh viên có thể nộp đơn 2 lần cho cùng 1 tin việc làm | High | Thiếu kiểm tra điều kiện tồn tại tại tầng Service | Thêm ràng buộc `UNIQUE (job_id, student_id)` và bắt lỗi `DuplicateKeyException` | **Fixed** |
| `BUG-02` | Token JWT hết hạn gây lỗi trắng trang giao diện | High | Axios chưa xử lý mã lỗi HTTP 401 | Bổ sung Axios Interceptor tự động đăng xuất và điều hướng về `/login` | **Fixed** |
| `BUG-03` | Không hiển thị việc làm khi lọc theo tỉnh thành có dấu | Medium | CSDL so sánh chuỗi phân biệt chữ hoa/thường và dấu | Chuẩn hóa truy vấn `LOWER(unaccent(province))` trong JPA Query | **Fixed** |
| `BUG-04` | Đổi sang Dark Mode bị nhấp nháy nền trắng khi tải lại trang | Medium | CSS Dark Mode nạp sau khi React render DOM | Đọc `localStorage('theme')` và gán class vào thẻ `<html>` ngay từ `index.html` | **Fixed** |
| `BUG-05` | NTD có thể tự đánh giá chính mình | High | Thiếu kiểm tra ràng buộc `reviewerId != revieweeId` | Bổ sung logic kiểm tra chặn đánh giá bản thân tại `ReviewService` | **Fixed** |
| `BUG-06` | Sinh viên truy cập được trang `/employer/post-job` | Critical | Component Route Guard chưa kiểm tra đúng mảng vai trò | Cấu hình chặt chẽ `ProtectedRoute` với tham số `allowedRoles={['ROLE_EMPLOYER']}` | **Fixed** |
| `BUG-07` | Lỗi ném ra mã 500 khi người dùng nhập sai kiểu dữ liệu | Low | Thiếu bộ xử lý ngoại lệ tập trung | Xây dựng `GlobalExceptionHandler` bắt `MethodArgumentNotValidException` | **Fixed** |
| `BUG-08` | CSDL MySQL bị lỗi tiếng Việt khi nạp bộ 1.470 việc làm | High | Collation bảng mặc định là `latin1` | Đổi toàn bộ sang `utf8mb4_unicode_ci` trong script `init_database.sql` | **Fixed** |
| `BUG-09` | Không thể hủy đơn ứng tuyển sau khi đã nộp nhầm | Medium | Chưa có API cho phép sinh viên tự hủy đơn ở trạng thái PENDING | Bổ sung endpoint `PATCH /api/v1/applications/{id}/cancel` | **Fixed** |
| `BUG-10` | Nút lưu hồ sơ nhà tuyển dụng làm mất thông tin công ty | Medium | Payload gửi lên bị thiếu trường `companyName`, `companyAddress` | Cập nhật hàm `updateProfile` hỗ trợ đầy đủ các trường đa vai trò | **Fixed** |
| `BUG-11` | Số lượng thông báo chưa đọc bị lệch khi mở nhiều tab | Low | Trạng thái unread count chỉ được tính toán 1 lần | Bổ sung API `GET /api/v1/notifications/unread-count` định kỳ cập nhật | **Fixed** |
| `BUG-12` | Mất kết nối CSDL khi chạy Docker Compose trên máy mới | High | Backend khởi động trước khi container PostgreSQL sẵn sàng | Bổ sung `healthcheck` và `depends_on: condition: service_healthy` | **Fixed** |

---

## 4. BỘ KỊCH BẢN KIỂM THỬ TỰ ĐỘNG CỦA DỰ ÁN

Để đảm bảo khả năng tái kiểm thử tức thì (Regression Testing) mà không cần cấu hình phức tạp, nhóm đã xây dựng 3 kịch bản tự động:
1. `test_sprint1_demo.bat` (`dataset/test_sprint1_demo.py`): Chạy kiểm thử tự động 12 kịch bản luồng Sprint 1.
2. `test_sprint2_integration.bat` (`dataset/test_sprint2_integration.py`): Chạy kiểm thử tích hợp 18 kịch bản nghiệp vụ khép kín Sprint 2.
3. `run_all_tests.bat` (`dataset/run_all_tests.py`): Tổng kiểm thử toàn diện toàn bộ 70 ca kiểm thử của hệ thống.

---

## 5. KẾT LUẬN NGHIỆM THU

1. **Chất lượng toàn diện:** Hệ thống hoàn thành 100% mục tiêu kiểm thử (70/70 ca đạt yêu cầu, không còn lỗi Blocker hay Critical).
2. **Khả năng chịu lỗi:** Các cơ chế bảo mật (JWT, RBAC, chống nộp trùng, chống spam đánh giá, kiểm soát quyền sở hữu bài đăng) hoạt động nghiêm ngặt và chuẩn xác.
3. **Mức độ sẵn sàng:** Sản phẩm phần mềm, bộ dữ liệu và tài liệu kỹ thuật hoàn toàn đáp ứng các tiêu chí đánh giá xuất sắc theo Rubric 3 của Hội đồng chấm Chuyên đề tốt nghiệp 2.

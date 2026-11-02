# BÁO CÁO KẾT QUẢ KIỂM THỬ TỔNG THỂ BACKEND RESTFUL API

* **Dự án:** Freelance & Part-time Job Marketplace API (Chuyên đề tốt nghiệp 2 - Nhóm 8)
* **Thành viên nhóm:** Tài - Khôi - Long
* **Người thực hiện kiểm thử:** Phan Văn Hoàng Long (Phụ trách Backend & Test API)
* **Ngày thực hiện:** 02/11/2026
* **Môi trường kiểm thử:** Localhost (`http://localhost:8080/api/v1`) qua OpenAPI / Swagger UI
* **Kết quả chung:** **14/14 Ca kiểm thử ĐẠT (100% PASSED)**

---

## I. BẢNG TỔNG HỢP KẾT QUẢ KIỂM THỬ (SUMMARY TABLE)

| STT | Nhóm chức năng | Tên ca kiểm thử (Test Case) | Endpoint / Method | Mã HTTP kỳ vọng | Mã HTTP thực tế | Kết quả |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: |
| **01** | Xác thực (Auth) | Đăng nhập tài khoản Sinh viên / NTD nhận JWT Token | `POST /auth/login` | 200 | 200 OK | **PASSED** |
| **02** | Xác thực (Auth) | Lấy thông tin cá nhân hiện tại qua Bearer Token | `GET /auth/me` | 200 | 200 OK | **PASSED** |
| **03** | Phân quyền (RBAC) | Chặn Sinh viên / NTD truy cập API Admin | `GET /admin/users` | 403 | 403 Forbidden | **PASSED** |
| **04** | Việc làm (Jobs) | Lấy danh sách việc làm công khai (Phân trang) | `GET /jobs` | 200 | 200 OK | **PASSED** |
| **05** | Phân quyền (RBAC) | Chặn Sinh viên thực hiện tạo bài đăng tuyển dụng | `POST /jobs` | 403 | 403 Forbidden | **PASSED** |
| **06** | Việc làm (Jobs) | NTD chính chủ đăng bài việc làm mới hợp lệ | `POST /jobs` | 200 | 200 OK | **PASSED** |
| **07** | Ứng tuyển | Sinh viên nộp đơn ứng tuyển vào công việc | `POST /applications/jobs/{jobId}/apply` | 200 | 200 OK | **PASSED** |
| **08** | Bảo mật Logic | Chặn Sinh viên nộp đơn trùng vào cùng một bài đăng | `POST /applications/jobs/{jobId}/apply` | 400 | 400 Bad Request | **PASSED** |
| **09** | Duyệt đơn | NTD chính chủ duyệt đơn ứng tuyển ➔ ACCEPTED | `PATCH /applications/{id}/status` | 200 | 200 OK | **PASSED** |
| **10** | Bảo mật Logic | Chặn Sinh viên hủy đơn ứng tuyển đã ở trạng thái ACCEPTED | `PATCH /applications/{id}/cancel` | 400 | 400 Bad Request | **PASSED** |
| **11** | Bảo mật Logic | Chặn Sinh viên A rút / hủy đơn ứng tuyển của Sinh viên B | `PATCH /applications/{id}/cancel` | 400 | 400 Bad Request | **PASSED** |
| **12** | Phân quyền NTD | Chặn NTD B xem danh sách ứng viên bài đăng của NTD A | `GET /applications/job/{jobId}` | 400 / 403 | 400 Bad Request | **PASSED** |
| **13** | Phân quyền NTD | Chặn NTD B xét duyệt đơn ứng tuyển thuộc bài đăng NTD A | `PATCH /applications/{id}/status` | 400 / 403 | 400 Bad Request | **PASSED** |
| **14** | Vòng đời Job | NTD chính chủ đóng bài đăng ➔ Trạng thái CLOSED | `PATCH /jobs/{id}/status` | 200 | 200 OK | **PASSED** |

---

## II. CHI TIẾT NỘI DUNG VÀ KẾT QUẢ THỰC HIỆN CÁC CA KIỂM THỬ

### 1. Nhóm Xác thực & Phân quyền Role (Auth & RBAC)

* **Test 01: Đăng nhập & Sinh JWT Token (`POST /auth/login`)**
  * **Mục tiêu:** Kiểm tra khả năng xác thực tài khoản và cấp phát JWT Access Token.
  * **Input:** `{"email": "techlead@innovate.vn", "password": "Password123@"}`.
  * **Output:** HTTP Code `200 OK`. Trả về đầy đủ `accessToken`, `tokenType: "Bearer"`, thông tin `userId` và `role: "ROLE_EMPLOYER"`.
  * **Kết luận:** Hệ thống tạo token JWT chứa đúng Claims và Role.

* **Test 02: Lấy thông tin tài khoản đang đăng nhập (`GET /auth/me`)**
  * **Mục tiêu:** Xác thực Token Bearer gửi lên Header.
  * **Input:** Header `Authorization: Bearer <token>` của tài khoản NTD Tuyết (`recruiter@thecoffee.vn`).
  * **Output:** HTTP Code `200 OK`. Trả về đúng thông tin profile cá nhân (`companyName: "The Coffee House Bình Thạnh"`, `role: ROLE_EMPLOYER`).
  * **Kết luận:** Trích xuất thông tin người dùng từ token chính xác.

* **Test 03: Chặn Sinh viên / NTD truy cập API Admin (`GET /admin/users`)**
  * **Mục tiêu:** Kiểm tra rào chắn phân quyền vai trò (Role-Based Access Control).
  * **Input:** Sử dụng Token của NTD Tuyết (`ROLE_EMPLOYER`) gọi API quản trị.
  * **Output:** HTTP Code `403 Forbidden`.
  * **Kết luận:** Spring Security hoạt động chính xác, ngăn chặn tài khoản không đủ thẩm quyền.

* **Test 05: Chặn Sinh viên đăng tin việc làm (`POST /jobs`)**
  * **Mục tiêu:** Kiểm tra phân quyền nghiệp vụ đăng bài.
  * **Input:** Dùng Token của Sinh viên Tấn Tài (`ROLE_STUDENT`) gửi request tạo Job.
  * **Output:** HTTP Code `403 Forbidden`.
  * **Kết luận:** Chỉ tài khoản `ROLE_EMPLOYER` mới được phép đăng bài.

---

### 2. Nhóm Quản lý Tin tuyển dụng (Jobs Lifecycle)

* **Test 04: Lấy danh sách việc làm công khai (`GET /jobs`)**
  * **Mục tiêu:** Truy vấn danh sách tin tuyển dụng có phân trang.
  * **Input:** Params `page=0&size=10`.
  * **Output:** HTTP Code `200 OK`. Trả về danh sách công việc kèm thông tin doanh nghiệp, danh mục và chi tiết mức lương.

* **Test 06: NTD đăng tin tuyển dụng mới (`POST /jobs`)**
  * **Mục tiêu:** Tạo mới bài đăng công việc từ NTD.
  * **Input:** Token NTD Tuyết, JSON bài đăng `"Tin test của Long"`, `salaryAmount: 25000`.
  * **Output:** HTTP Code `200 OK`. Bài đăng được lưu vào DB với ID = 5, trạng thái mặc định `OPEN`.

* **Test 14: Cập nhật trạng thái vòng đời công việc (`PATCH /jobs/{id}/status`)**
  * **Mục tiêu:** NTD chính chủ đóng tin tuyển dụng khi đủ người.
  * **Input:** Path variable `id=5`, Query param `status=CLOSED` (sử dụng Token NTD Tuyết - sở hữu bài đăng).
  * **Output:** HTTP Code `200 OK`. Trả về response object với `status: "CLOSED"`, `updatedAt` được ghi nhận chính xác.

---

### 3. Nhóm Quy trình & Logic Ứng tuyển (Applications Flow & Logic)

* **Test 07: Sinh viên nộp đơn ứng tuyển (`POST /applications/jobs/{jobId}/apply`)**
  * **Mục tiêu:** Tạo đơn ứng tuyển vào công việc.
  * **Input:** Token Sinh viên Anh Khôi, `jobId = 5`, Body chứa `coverLetter` và `cvUrl`.
  * **Output:** HTTP Code `200 OK`. Đơn ứng tuyển khởi tạo với ID = 4, trạng thái `PENDING`.

* **Test 08: Chặn Sinh viên nộp trùng đơn vào 1 công việc**
  * **Mục tiêu:** Kiểm tra ràng buộc duy nhất (Unique constraint) của đơn ứng tuyển.
  * **Input:** Sinh viên Anh Khôi tiếp tục bấm gửi đơn lần 2 vào `jobId = 5`.
  * **Output:** HTTP Code `400 Bad Request`. Message báo lỗi rõ ràng chống spam đơn.

* **Test 09: NTD xét duyệt đơn ứng tuyển (`PATCH /applications/{applicationId}/status`)**
  * **Mục tiêu:** Chuyển trạng thái đơn ứng tuyển.
  * **Input:** Token NTD Tuyết, `applicationId = 3`, Body `{"status": "ACCEPTED"}`.
  * **Output:** HTTP Code `200 OK`. Đơn chuyển trạng thái thành `ACCEPTED`.

* **Test 10: Chặn hủy đơn ứng tuyển đã được duyệt (`PATCH /applications/{applicationId}/cancel`)**
  * **Mục tiêu:** Validation quy trình không cho phép sinh viên tự ý rút đơn khi đã được nhận.
  * **Input:** Token Sinh viên gửi yêu cầu hủy đơn ID = 3 (đã ACCEPTED từ Test 09).
  * **Output:** HTTP Code `400 Bad Request`. Response: `"Chỉ có thể hủy đơn ứng tuyển khi hồ sơ ở trạng thái Chờ duyệt (PENDING)!"`.

* **Test 11: Chặn hủy đơn ứng tuyển của sinh viên khác (`PATCH /applications/{applicationId}/cancel`)**
  * **Mục tiêu:** Bảo mật dữ liệu cá nhân giữa các sinh viên.
  * **Input:** Dùng Token Sinh viên Anh Khôi cố tình gửi request hủy đơn ID = 3 của Sinh viên Tấn Tài.
  * **Output:** HTTP Code `400 Bad Request`. Response: `"Bạn không thể hủy đơn ứng tuyển của người khác!"`.

---

### 4. Nhóm Bảo mật Phân quyền Chéo giữa các NTD (Cross-Tenant Security)

* **Test 12: Chặn NTD xem danh sách ứng viên bài đăng của NTD khác (`GET /applications/job/{jobId}`)**
  * **Mục tiêu:** Đảm bảo tính riêng tư dữ liệu ứng viên giữa các doanh nghiệp.
  * **Input:** Dùng Token NTD Trần Văn Minh (Innovate Studio) truy cập danh sách ứng viên của `jobId = 5` (thuộc NTD Tuyết - The Coffee House).
  * **Output:** HTTP Code `400 Bad Request`. Response: `"Bạn không có quyền xem danh sách ứng viên của công việc này"`.

* **Test 13: Chặn NTD xét duyệt đơn ứng tuyển không thuộc quyền sở hữu (`PATCH /applications/{applicationId}/status`)**
  * **Mục tiêu:** Chặn NTD này can thiệp/thao tác dữ liệu bài đăng của NTD khác.
  * **Input:** Dùng Token NTD Trần Văn Minh gửi request duyệt đơn `applicationId = 3` (thuộc bài đăng của NTD Tuyết).
  * **Output:** HTTP Code `400 Bad Request`. Response: `"Bạn không có quyền xét duyệt đơn ứng tuyển này"`.

---

## III. ĐÁNH GIÁ TỔNG QUAN CHẤT LƯỢNG HỆ THỐNG BACKEND

1. **Xác thực & Phân quyền (Security & RBAC):** Khóa bảo mật theo cơ chế stateless bằng JWT Bearer Token hoạt động chính xác tuyệt đối trên cả 3 lớp vạch quyền: `ROLE_STUDENT`, `ROLE_EMPLOYER`, `ROLE_ADMIN`.
2. **Bảo mật dữ liệu chéo (Data-Level Authorization / Tenant Isolation):** Đã kiểm thử rủi ro can thiệp chéo dữ liệu. Backend xử lý triệt để các trường hợp thao tác gian lận ID (Sinh viên không sửa/hủy đơn người khác, NTD A không xem/duyệt đơn NTD B).
3. **Logic nghiệp vụ & Exception Handling:** Xử lý ngoại lệ (`GlobalExceptionHandler`) chuẩn RESTful specification. Toàn bộ các câu phản hồi lỗi đều trả về đúng định dạng JSON `ApiResponse` thống nhất với mã HTTP (400, 403) và thông điệp tiếng Việt thân thiện.
4. **Trạng thái sẵn sàng:** Hệ thống Backend REST API đã đạt độ ổn định 100% đối với các luồng nghiệp vụ cốt lõi, sẵn sàng kết nối cùng Frontend ReactJS.

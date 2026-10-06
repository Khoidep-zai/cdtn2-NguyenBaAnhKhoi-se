# TÀI LIỆU HỢP ĐỒNG API REST (API CONTRACT SPECIFICATION)

**Dự án:** Student Freelance & Part-time Job Marketplace  
**Base URL:** `http://localhost:8080/api/v1`  
**Định dạng trao đổi:** `application/json`  
**Chuẩn xác thực:** JWT Bearer Token (`Authorization: Bearer <token>`)  

---

## 1. CẤU TRÚC PHẢN HỒI CHUẨN (STANDARD API RESPONSE)

### Phản hồi thành công (Success Envelope)
```json
{
  "success": true,
  "message": "Thao tác thành công",
  "data": { ... }
}
```

### Phản hồi lỗi (Error Response)
```json
{
  "success": false,
  "message": "Chi tiết thông báo lỗi",
  "data": null
}
```

---

## 2. DANH SÁCH CÁC ENDPOINT THEO PHÂN HỆ

### 2.1. Phân hệ Xác thực (Authentication - `/api/v1/auth`)

| Phương thức | Đường dẫn | Quyền hạn (Role) | Mô tả chức năng |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public (Mọi người) | Đăng ký tài khoản Sinh viên / NTD |
| `POST` | `/api/v1/auth/login` | Public (Mọi người) | Đăng nhập hệ thống, trả về JWT Token |
| `GET` | `/api/v1/auth/me` | Authenticated (Đã đăng nhập) | Lấy thông tin tài khoản hiện tại kèm quyền |

#### Request Payload: `POST /api/v1/auth/register`
```json
{
  "email": "sinhvien.moi@vanlanguni.vn",
  "password": "Password123@",
  "fullName": "Trần Văn A",
  "phone": "0987654321",
  "role": "ROLE_STUDENT",
  "university": "Trường ĐH Văn Lang",
  "major": "Công nghệ thông tin",
  "companyName": null
}
```

#### Request Payload: `POST /api/v1/auth/login`
```json
{
  "email": "sinhvien.tai@vanlanguni.vn",
  "password": "Password123@"
}
```

---

### 2.2. Phân hệ Danh mục công việc (Categories - `/api/v1/categories`)

| Phương thức | Đường dẫn | Quyền hạn | Mô tả chức năng |
|---|---|---|---|
| `GET` | `/api/v1/categories` | Public | Lấy danh sách tất cả các danh mục |
| `GET` | `/api/v1/categories/{id}` | Public | Lấy chi tiết một danh mục theo ID |

---

### 2.3. Phân hệ Tin tuyển dụng (Jobs - `/api/v1/jobs`)

| Phương thức | Đường dẫn | Quyền hạn | Mô tả chức năng |
|---|---|---|---|
| `GET` | `/api/v1/jobs` | Public | Tìm kiếm, lọc và phân trang tin việc làm |
| `GET` | `/api/v1/jobs/{id}` | Public | Xem chi tiết tin tuyển dụng |
| `POST` | `/api/v1/jobs` | `ROLE_EMPLOYER`, `ROLE_ADMIN` | Đăng tin tuyển dụng mới |
| `PUT` | `/api/v1/jobs/{id}` | `ROLE_EMPLOYER`, `ROLE_ADMIN` | Chỉnh sửa tin tuyển dụng |
| `PATCH` | `/api/v1/jobs/{id}/status` | `ROLE_EMPLOYER`, `ROLE_ADMIN` | Đổi trạng thái tin (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`) |
| `DELETE` | `/api/v1/jobs/{id}` | `ROLE_EMPLOYER`, `ROLE_ADMIN` | Xóa tin tuyển dụng |
| `GET` | `/api/v1/jobs/my-jobs` | `ROLE_EMPLOYER` | Danh sách các tin do chính NTD đăng |

#### Query Parameters: `GET /api/v1/jobs`
- `keyword` (string, tùy chọn): Tìm kiếm trong tiêu đề hoặc mô tả
- `categoryId` (number, tùy chọn): Lọc theo ID danh mục
- `jobType` (string, tùy chọn): `PART_TIME`, `FREELANCE`, `INTERNSHIP`
- `workMode` (string, tùy chọn): `ONSITE`, `REMOTE`, `HYBRID`
- `status` (string, tùy chọn, mặc định `OPEN`): Trạng thái tin
- `page` (number, mặc định `0`)
- `size` (number, mặc định `10`)

#### Request Payload: `POST /api/v1/jobs`
```json
{
  "categoryId": 1,
  "title": "Lập trình ReactJS làm giao diện Dashboard",
  "description": "Xây dựng các trang quản trị bằng React và Tailwind CSS...",
  "requirements": "Thành thạo ReactJS, TypeScript, có tinh thần trách nhiệm",
  "jobType": "FREELANCE",
  "workMode": "REMOTE",
  "location": "Toàn quốc",
  "salaryType": "FIXED_PROJECT",
  "salaryAmount": 3000000.00,
  "slotsAvailable": 2,
  "deadline": "2026-11-30T23:59:59"
}
```

---

### 2.4. Phân hệ Ứng tuyển (Applications - `/api/v1/applications`)

| Phương thức | Đường dẫn | Quyền hạn | Mô tả chức năng |
|---|---|---|---|
| `POST` | `/api/v1/applications` | `ROLE_STUDENT` | Nộp hồ sơ ứng tuyển vào công việc |
| `GET` | `/api/v1/applications/my-applications` | `ROLE_STUDENT` | Lịch sử nộp đơn của sinh viên hiện tại |
| `GET` | `/api/v1/applications/job/{jobId}` | `ROLE_EMPLOYER`, `ROLE_ADMIN` | Danh sách ứng viên đã nộp vào một công việc |
| `PATCH` | `/api/v1/applications/{id}/status` | `ROLE_EMPLOYER`, `ROLE_ADMIN` | Duyệt / Từ chối đơn (`ACCEPTED` / `REJECTED`) |

#### Request Payload: `POST /api/v1/applications`
```json
{
  "jobId": 2,
  "coverLetter": "Em có 1 năm kinh nghiệm làm việc với React và rất mong muốn được thử sức.",
  "cvUrl": "https://example.com/cv.pdf"
}
```

#### Request Payload: `PATCH /api/v1/applications/{id}/status`
```json
{
  "status": "ACCEPTED",
  "rejectionReason": null
}
```

---

### 2.5. Phân hệ Đánh giá 2 chiều (Reviews - `/api/v1/reviews`)

| Phương thức | Đường dẫn | Quyền hạn | Mô tả chức năng |
|---|---|---|---|
| `POST` | `/api/v1/reviews` | Authenticated | Gửi đánh giá cho đối phương (SV <-> NTD) |
| `GET` | `/api/v1/reviews/job/{jobId}` | Public | Lấy danh sách đánh giá của một công việc |
| `GET` | `/api/v1/reviews/user/{userId}` | Public | Lấy danh sách đánh giá của một người dùng |

#### Request Payload: `POST /api/v1/reviews`
```json
{
  "jobId": 2,
  "revieweeId": 3,
  "rating": 5,
  "comment": "Nhà tuyển dụng hướng dẫn chi tiết, giao tiếp tốt và thanh toán đúng hẹn!"
}
```

---

### 2.6. Phân hệ Quản lý Hồ sơ người dùng (Users - `/api/v1/users`)

| Phương thức | Đường dẫn | Quyền hạn | Mô tả chức năng |
|---|---|---|---|
| `GET` | `/api/v1/users/{id}` | Public | Xem thông tin hồ sơ người dùng theo ID |
| `PUT` | `/api/v1/users/profile` | Authenticated | Cập nhật hồ sơ cá nhân của người dùng hiện tại |

#### Request Payload: `PUT /api/v1/users/profile`
```json
{
  "fullName": "Nguyễn Tấn Tài",
  "phone": "0934567890",
  "bio": "Lập trình viên nhiệt huyết, đam mê Java Spring Boot",
  "skills": "Java, Spring Boot, PostgreSQL, Docker",
  "university": "Trường ĐH Văn Lang",
  "major": "Công nghệ thông tin",
  "companyName": null,
  "companyAddress": null
}
```

---

### 2.7. Phân hệ Thông báo (Notifications - `/api/v1/notifications`)

| Phương thức | Đường dẫn | Quyền hạn | Mô tả chức năng |
|---|---|---|---|
| `GET` | `/api/v1/notifications` | Authenticated | Lấy danh sách thông báo của tài khoản hiện tại |
| `PATCH` | `/api/v1/notifications/{id}/read` | Authenticated | Đánh dấu thông báo đã đọc |
| `PATCH` | `/api/v1/notifications/read-all` | Authenticated | Đánh dấu tất cả thông báo đã đọc |

---

### 2.8. Phân hệ Quản trị (Admin - `/api/v1/admin`)

| Phương thức | Đường dẫn | Quyền hạn | Mô tả chức năng |
|---|---|---|---|
| `GET` | `/api/v1/admin/stats` | `ROLE_ADMIN` | Thống kê số lượng người dùng, tin đăng, ứng tuyển |
| `GET` | `/api/v1/admin/users` | `ROLE_ADMIN` | Danh sách tất cả người dùng trong hệ thống |
| `PATCH` | `/api/v1/admin/users/{id}/toggle-status` | `ROLE_ADMIN` | Khóa hoặc mở khóa kích hoạt tài khoản |

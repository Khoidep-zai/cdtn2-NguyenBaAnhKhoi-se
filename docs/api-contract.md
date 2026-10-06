# HỢP ĐỒNG API REST (RESTFUL API CONTRACT SPECIFICATION)

**Dự án:** Student Freelance & Part-time Job Marketplace  
**Base URL:** `http://localhost:8080/api/v1`  
**Chuẩn dữ liệu:** `application/json` (UTF-8)  
**Cơ chế xác thực:** HTTP Header `Authorization: Bearer <jwt_token>`  

---

## 1. QUY CHUẨN CẤU TRÚC PHẢN HỒI (STANDARD RESPONSE ENVELOPE)

### 1.1. Phản hồi thành công (HTTP 200 OK / HTTP 201 Created)
```json
{
  "success": true,
  "message": "Thao tác thành công",
  "data": { ... }
}
```

### 1.2. Phản hồi lỗi (HTTP 400 / 401 / 403 / 404 / 500)
```json
{
  "success": false,
  "message": "Thông báo nguyên nhân lỗi cụ thể",
  "data": null
}
```

---

## 2. BẢNG TỔNG HỢP CÁC ENDPOINTS THEO PHÂN HỆ

| Phân hệ | Phương thức | Endpoint URI | Phân quyền truy cập | Mô tả chức năng |
|---|---|---|---|---|
| **Auth** | `POST` | `/auth/register` | Public | Đăng ký tài khoản mới (Sinh viên / NTD) |
| | `POST` | `/auth/login` | Public | Đăng nhập hệ thống, nhận JWT Access Token |
| | `GET` | `/auth/me` | Authenticated | Lấy thông tin tài khoản đang đăng nhập |
| **Categories** | `GET` | `/categories` | Public | Lấy danh sách toàn bộ danh mục việc làm |
| | `GET` | `/categories/{id}` | Public | Lấy thông tin chi tiết một danh mục |
| **Jobs** | `GET` | `/jobs` | Public | Tìm kiếm, lọc và phân trang việc làm |
| | `GET` | `/jobs/{id}` | Public | Xem thông tin chi tiết một tin tuyển dụng |
| | `GET` | `/jobs/my-jobs` | `ROLE_EMPLOYER` | Xem danh sách tin do chính NTD đăng |
| | `POST` | `/jobs` | `ROLE_EMPLOYER`, `ROLE_ADMIN` | Đăng tin tuyển dụng mới |
| | `PUT` | `/jobs/{id}` | `ROLE_EMPLOYER`, `ROLE_ADMIN` | Cập nhật thông tin tin tuyển dụng |
| | `PATCH`| `/jobs/{id}/status` | `ROLE_EMPLOYER`, `ROLE_ADMIN` | Đổi trạng thái tin (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`) |
| | `DELETE`| `/jobs/{id}` | `ROLE_EMPLOYER`, `ROLE_ADMIN` | Xóa tin tuyển dụng |
| **Applications** | `POST` | `/applications` | `ROLE_STUDENT` | Nộp hồ sơ ứng tuyển kèm CV |
| | `GET` | `/applications/my-applications` | `ROLE_STUDENT` | Lịch sử nộp đơn của sinh viên hiện tại |
| | `GET` | `/applications/job/{jobId}` | `ROLE_EMPLOYER`, `ROLE_ADMIN` | Xem danh sách ứng viên nộp vào tin |
| | `PATCH`| `/applications/{id}/status` | `ROLE_EMPLOYER`, `ROLE_ADMIN` | Duyệt (`ACCEPTED`) hoặc từ chối (`REJECTED`) đơn |
| **Reviews** | `POST` | `/reviews` | Authenticated | Gửi đánh giá hai chiều (1–5 sao kèm nhận xét) |
| | `GET` | `/reviews/job/{jobId}` | Public | Lấy tất cả đánh giá của một công việc |
| | `GET` | `/reviews/user/{userId}` | Public | Lấy tất cả đánh giá nhận được của một người dùng |
| **Users** | `GET` | `/users/{id}` | Public | Xem hồ sơ công khai của người dùng theo ID |
| | `PUT` | `/users/profile` | Authenticated | Cập nhật hồ sơ cá nhân của tài khoản hiện tại |
| **Notifications** | `GET` | `/notifications` | Authenticated | Lấy danh sách thông báo của tài khoản hiện tại |
| | `PATCH`| `/notifications/{id}/read` | Authenticated | Đánh dấu 1 thông báo đã đọc |
| | `PATCH`| `/notifications/read-all` | Authenticated | Đánh dấu toàn bộ thông báo đã đọc |
| **Admin** | `GET` | `/admin/stats` | `ROLE_ADMIN` | Thống kê KPI: người dùng, tin đăng, đơn ứng tuyển, đánh giá |
| | `GET` | `/admin/users` | `ROLE_ADMIN` | Xem danh sách toàn bộ tài khoản trong hệ thống |
| | `PATCH`| `/admin/users/{id}/toggle-status` | `ROLE_ADMIN` | Khóa hoặc kích hoạt lại tài khoản người dùng |
| | `DELETE`| `/admin/jobs/{id}` | `ROLE_ADMIN` | Xóa/gỡ bỏ tin tuyển dụng vi phạm |

---

## 3. CHI TIẾT REQUEST / RESPONSE TIÊU BIỂU

### 3.1. Đăng ký tài khoản (`POST /api/v1/auth/register`)
- **Request Body:**
```json
{
  "email": "sinhvien.moi@vanlanguni.vn",
  "password": "Password123@",
  "fullName": "Trần Thị Mai",
  "phone": "0987654321",
  "role": "ROLE_STUDENT",
  "university": "Trường ĐH Văn Lang",
  "major": "Công nghệ thông tin",
  "companyName": null
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Đăng ký tài khoản thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "role": "ROLE_STUDENT",
    "email": "sinhvien.moi@vanlanguni.vn",
    "fullName": "Trần Thị Mai"
  }
}
```

### 3.2. Đăng nhập hệ thống (`POST /api/v1/auth/login`)
- **Request Body:**
```json
{
  "email": "sinhvien.tai@vanlanguni.vn",
  "password": "Password123@"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "role": "ROLE_STUDENT",
    "email": "sinhvien.tai@vanlanguni.vn",
    "fullName": "Nguyễn Tấn Tài"
  }
}
```

### 3.3. Đăng tin tuyển dụng (`POST /api/v1/jobs`)
- **Headers:** `Authorization: Bearer <employer_token>`
- **Request Body:**
```json
{
  "categoryId": 1,
  "title": "Tuyển lập trình viên Frontend ReactJS làm Dashboard",
  "description": "Xây dựng các trang quản trị hệ thống bằng React 18 và TypeScript.",
  "requirements": "Biết ReactJS, HTML/CSS, Git cơ bản. Ưu tiên sinh viên năm 3, 4.",
  "jobType": "FREELANCE",
  "workMode": "REMOTE",
  "location": "Toàn quốc",
  "salaryType": "FIXED_PROJECT",
  "salaryAmount": 2500000.00,
  "slotsAvailable": 1,
  "deadline": "2026-11-30T23:59:59"
}
```

### 3.4. Nộp đơn ứng tuyển (`POST /api/v1/applications`)
- **Headers:** `Authorization: Bearer <student_token>`
- **Request Body:**
```json
{
  "jobId": 2,
  "coverLetter": "Em đã hoàn thành nhiều đồ án ReactJS tại trường, mong muốn được thử sức với dự án.",
  "cvUrl": "https://drive.google.com/sample_cv.pdf"
}
```

### 3.5. Duyệt đơn ứng tuyển (`PATCH /api/v1/applications/{id}/status`)
- **Headers:** `Authorization: Bearer <employer_token>`
- **Request Body:**
```json
{
  "status": "ACCEPTED",
  "rejectionReason": null
}
```

### 3.6. Đánh giá hai chiều sau khi hoàn thành (`POST /api/v1/reviews`)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "jobId": 2,
  "revieweeId": 3,
  "rating": 5,
  "comment": "Nhà tuyển dụng hỗ trợ nhiệt tình, thanh toán đúng hạn và giao tiếp rất rõ ràng!"
}
```

### 3.7. Thống kê KPI quản trị viên (`GET /api/v1/admin/stats`)
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Lấy dữ liệu thống kê thành công",
  "data": {
    "totalUsers": 6,
    "totalJobs": 4,
    "totalApplications": 2,
    "totalReviews": 2
  }
}
```

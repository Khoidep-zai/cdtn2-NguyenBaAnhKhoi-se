# SƠ ĐỒ THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE ERD DIAGRAM)

**Dự án:** Nền tảng quản lý freelance & marketplace việc làm part-time cho sinh viên  
**Học phần:** Chuyên đề tốt nghiệp 2 — Nhóm 8 (261_71ITGR40303_04)  
**Hệ quản trị CSDL:** PostgreSQL 16 (Chuẩn 3NF, ACID Compliant)  
**Phiên bản:** v1.2  

---

## 1. SƠ ĐỒ THỰC THỂ QUAN HỆ (MERMAID ERD)

```mermaid
erDiagram
    ROLES ||--o{ USERS : "has (role_id)"
    USERS ||--o{ JOBS : "posts as Employer (employer_id)"
    CATEGORIES ||--o{ JOBS : "classifies (category_id)"
    JOBS ||--o{ APPLICATIONS : "receives (job_id)"
    USERS ||--o{ APPLICATIONS : "applies as Student (student_id)"
    JOBS ||--o{ REVIEWS : "evaluated in (job_id)"
    USERS ||--o{ REVIEWS : "writes as Reviewer (reviewer_id)"
    USERS ||--o{ REVIEWS : "receives as Reviewee (reviewee_id)"
    USERS ||--o{ NOTIFICATIONS : "receives (user_id)"

    ROLES {
        int id PK
        string name UK "Tên quyền (ROLE_ADMIN, ROLE_EMPLOYER, ROLE_STUDENT)"
        string description "Mô tả vai trò"
    }

    USERS {
        int id PK
        string email UK "Địa chỉ email định danh"
        string password_hash "Mật khẩu mã hóa BCrypt"
        string full_name "Họ và tên"
        string phone "Số điện thoại"
        int role_id FK "Khóa ngoại tới ROLES"
        string avatar_url "Ảnh đại diện"
        text bio "Tiểu sử / Giới thiệu"
        text skills "Kỹ năng chuyên môn (Sinh viên)"
        string university "Trường đại học (Sinh viên)"
        string major "Chuyên ngành (Sinh viên)"
        string company_name "Tên đơn vị / Công ty (NTD)"
        string company_address "Địa chỉ hoạt động (NTD)"
        boolean is_active "Trạng thái kích hoạt (true/false)"
        timestamp created_at "Thời điểm tạo"
        timestamp updated_at "Thời điểm cập nhật"
    }

    CATEGORIES {
        int id PK
        string name UK "Tên danh mục ngành nghề"
        string slug UK "Đường dẫn thân thiện (SEO slug)"
        string icon "Tên biểu tượng Lucide SVG"
        string description "Mô tả ngành nghề"
    }

    JOBS {
        int id PK
        int employer_id FK "Khóa ngoại tới USERS"
        int category_id FK "Khóa ngoại tới CATEGORIES"
        string title "Tiêu đề tin tuyển dụng"
        text description "Mô tả chi tiết công việc"
        text requirements "Yêu cầu ứng viên"
        string job_type "PART_TIME, FREELANCE, INTERNSHIP"
        string work_mode "ONSITE, REMOTE, HYBRID"
        string location "Địa điểm làm việc"
        string salary_type "HOURLY, FIXED_PROJECT, MONTHLY"
        decimal salary_amount "Mức thù lao / lương"
        int slots_available "Số lượng cần tuyển"
        string status "OPEN, IN_PROGRESS, COMPLETED, CLOSED"
        timestamp deadline "Hạn chót nhận hồ sơ"
        timestamp created_at "Ngày đăng tin"
        timestamp updated_at "Ngày cập nhật"
    }

    APPLICATIONS {
        int id PK
        int job_id FK "Khóa ngoại tới JOBS"
        int student_id FK "Khóa ngoại tới USERS"
        text cover_letter "Thư giới thiệu bản thân"
        string cv_url "Đường dẫn liên kết CV trực tuyến"
        string status "PENDING, REVIEWING, ACCEPTED, REJECTED"
        string rejection_reason "Lý do từ chối phản hồi cho SV"
        timestamp applied_at "Thời điểm nộp đơn"
        timestamp updated_at "Thời điểm cập nhật kết quả"
    }

    REVIEWS {
        int id PK
        int job_id FK "Khóa ngoại tới JOBS"
        int reviewer_id FK "Người gửi đánh giá (USERS)"
        int reviewee_id FK "Người nhận đánh giá (USERS)"
        int rating "Điểm sao (CHECK 1..5)"
        text comment "Nội dung nhận xét"
        timestamp created_at "Thời điểm đánh giá"
    }

    NOTIFICATIONS {
        int id PK
        int user_id FK "Người nhận thông báo (USERS)"
        string title "Tiêu đề thông báo"
        text message "Nội dung chi tiết"
        string type "APPLICATION_STATUS, NEW_APPLICATION, JOB_COMPLETED, SYSTEM"
        int reference_id "Mã tham chiếu (job_id / application_id)"
        boolean is_read "Trạng thái đã đọc (true/false)"
        timestamp created_at "Thời điểm gửi thông báo"
    }
```

---

## 2. QUY TẮC RÀNG BUỘC VÀ TÍNH TOÀN VẸN (INTEGRITY CONSTRAINTS)

1. **Ràng buộc Chống nộp trùng đơn (`unique_job_student_application`):**
   - Mỗi sinh viên chỉ được tạo tối đa 1 hồ sơ ứng tuyển vào 1 tin việc làm nhất định:
     `UNIQUE (job_id, student_id)`
2. **Ràng buộc Đánh giá một lần (`unique_job_reviewer`):**
   - Mỗi người dùng chỉ được gửi tối đa 1 đánh giá cho 1 công việc cụ thể:
     `UNIQUE (job_id, reviewer_id)`
3. **Kiểm tra thang điểm hợp lệ:**
   - Điểm đánh giá bắt buộc phải nằm trong thang 1 đến 5 sao:
     `CHECK (rating >= 1 AND rating <= 5)`
4. **Vòng đời trạng thái việc làm (Job State Machine):**
   - `OPEN` (Đang nhận đơn) ➔ `IN_PROGRESS` (Đã duyệt ứng viên, đang làm) ➔ `COMPLETED` (Đã hoàn thành bàn giao) ➔ `CLOSED` (Đóng tin).
5. **Hệ thống Chỉ mục hiệu năng (13 B-Tree Indexes):**
   - Đánh chỉ mục trên: `users(email)`, `users(role_id)`, `jobs(category_id)`, `jobs(employer_id)`, `jobs(status)`, `jobs(job_type)`, `jobs(work_mode)`, `jobs(created_at DESC)`, `applications(job_id)`, `applications(student_id)`, `applications(status)`, `reviews(job_id)`, `notifications(user_id, is_read)`.

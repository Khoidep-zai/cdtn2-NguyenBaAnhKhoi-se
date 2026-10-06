# SƠ ĐỒ THIẾT KẾ CƠ SỞ DỮ LIỆU (ERD DIAGRAM)

**Dự án:** Nền tảng quản lý freelance / marketplace việc làm part-time cho sinh viên  
**Học phần:** Chuyên đề tốt nghiệp 2 — Nhóm 8  

---

## 1. SƠ ĐỒ THỰC THỂ QUAN HỆ (MERMAID ERD)

```mermaid
erDiagram
    ROLES ||--o{ USERS : "has"
    USERS ||--o{ JOBS : "posts (as Employer)"
    CATEGORIES ||--o{ JOBS : "classifies"
    JOBS ||--o{ APPLICATIONS : "receives"
    USERS ||--o{ APPLICATIONS : "applies (as Student)"
    JOBS ||--o{ REVIEWS : "evaluated_in"
    USERS ||--o{ REVIEWS : "writes (as Reviewer)"
    USERS ||--o{ REVIEWS : "receives (as Reviewee)"

    ROLES {
        int id PK
        string name UK
        string description
    }

    USERS {
        int id PK
        string email UK
        string password_hash
        string full_name
        string phone
        int role_id FK
        string avatar_url
        text bio
        text skills
        string university
        string major
        string company_name
        string company_address
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        int id PK
        string name UK
        string slug UK
        string icon
        string description
    }

    JOBS {
        int id PK
        int employer_id FK
        int category_id FK
        string title
        text description
        text requirements
        string job_type
        string work_mode
        string location
        string salary_type
        decimal salary_amount
        int slots_available
        string status
        timestamp deadline
        timestamp created_at
        timestamp updated_at
    }

    APPLICATIONS {
        int id PK
        int job_id FK
        int student_id FK
        text cover_letter
        string cv_url
        string status
        string rejection_reason
        timestamp applied_at
        timestamp updated_at
    }

    REVIEWS {
        int id PK
        int job_id FK
        int reviewer_id FK
        int reviewee_id FK
        int rating
        text comment
        timestamp created_at
    }
```

---

## 2. QUY TẮC RÀNG BUỘC VÀ TÍNH TOÀN VẸN
1. **Ràng buộc ứng tuyển duy nhất (Constraint `unique_job_student_application`):** Một sinh viên chỉ được tạo tối đa 1 hồ sơ ứng tuyển vào 1 tin tuyển dụng nhất định (`UNIQUE (job_id, student_id)`).
2. **Ràng buộc đánh giá 1 lần (Constraint `unique_job_reviewer`):** Mỗi người tham gia chỉ được đánh giá 1 lần cho 1 công việc cụ thể (`UNIQUE (job_id, reviewer_id)`).
3. **Thang điểm hợp lệ:** Điểm đánh giá bắt buộc nằm trong khoảng từ 1 đến 5 sao (`CHECK (rating >= 1 AND rating <= 5)`).
4. **Vòng đời trạng thái công việc (Job State Machine):**
   `OPEN` (Đang tuyển sinh viên) ➔ `IN_PROGRESS` (Đã duyệt ứng viên và đang tiến hành) ➔ `COMPLETED` (Đã hoàn thành bàn giao) ➔ `CLOSED` (Đã đóng).

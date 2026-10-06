-- ========================================================
-- DATABASE SCHEMA DEFINITION: V1__init_schema.sql
-- Project: Student Freelance & Part-time Job Marketplace
-- Group: Team 8 (Chuyên đề tốt nghiệp 2)
-- ========================================================

-- 1. Bảng Vai trò người dùng (Roles)
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

-- 2. Bảng Người dùng (Users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    avatar_url VARCHAR(500),
    bio TEXT,
    skills TEXT, -- Danh sách kỹ năng (JSON hoặc dạng chuỗi phân cách bởi dấu phẩy)
    university VARCHAR(150), -- Trường đại học (dành cho sinh viên)
    major VARCHAR(150), -- Chuyên ngành
    company_name VARCHAR(150), -- Tên công ty / cửa hàng (dành cho NTD)
    company_address VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Danh mục công việc (Job Categories)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    icon VARCHAR(100),
    description VARCHAR(255)
);

-- 4. Bảng Tin tuyển dụng (Jobs)
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    employer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    job_type VARCHAR(50) NOT NULL, -- PART_TIME, FREELANCE, INTERNSHIP
    work_mode VARCHAR(50) DEFAULT 'ONSITE', -- ONSITE, REMOTE, HYBRID
    location VARCHAR(255),
    salary_type VARCHAR(50) NOT NULL, -- HOURLY, FIXED_PROJECT, MONTHLY
    salary_amount DECIMAL(12, 2) NOT NULL,
    slots_available INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, COMPLETED, CLOSED
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng Ứng tuyển công việc (Applications)
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    cv_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, REVIEWING, ACCEPTED, REJECTED
    rejection_reason VARCHAR(255),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_job_student_application UNIQUE (job_id, student_id)
);

-- 6. Bảng Đánh giá & Xếp hạng 2 chiều (Reviews)
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    reviewer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_job_reviewer UNIQUE (job_id, reviewer_id)
);

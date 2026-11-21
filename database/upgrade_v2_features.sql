-- ========================================================================
-- FREELANCEHUB V2 SCHEMA UPGRADE SCRIPT
-- Project: FreelanceHub_Tai (Phạm Công Tài)
-- Safe, Idempotent, Zero Data Loss
-- ========================================================================

USE freelance_db;

-- 1. BẢNG job_shifts (Lưu các ca làm việc chi tiết, hỗ trợ đa ca, giờ tùy chỉnh và ca qua đêm)
CREATE TABLE IF NOT EXISTS job_shifts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    day_of_week INT NOT NULL COMMENT '1: Thứ 2, 2: Thứ 3, ..., 7: Chủ nhật',
    shift_name VARCHAR(100) NULL,
    start_time TIME NULL,
    end_time TIME NULL,
    is_flexible BOOLEAN DEFAULT FALSE,
    sessions_per_week INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_shifts_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_job_shifts_job (job_id),
    INDEX idx_job_shifts_lookup (day_of_week, start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG work_histories (Snapshot Pattern - Bảo vệ vĩnh viễn dữ liệu kinh nghiệm)
CREATE TABLE IF NOT EXISTS work_histories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NULL UNIQUE COMMENT 'Khóa ngoại an toàn, ON DELETE SET NULL',
    job_id BIGINT NULL COMMENT 'Khóa ngoại an toàn, ON DELETE SET NULL',
    student_id BIGINT NOT NULL,
    employer_id BIGINT NULL COMMENT 'Khóa ngoại an toàn, ON DELETE SET NULL',
    -- Snapshot thông tin công việc & nhà tuyển dụng:
    job_title VARCHAR(255) NOT NULL,
    employer_name VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NULL,
    company_address VARCHAR(255) NULL,
    employer_email VARCHAR(150) NULL,
    job_type VARCHAR(50) NOT NULL,
    work_mode VARCHAR(50) NOT NULL,
    description TEXT NULL,
    -- Trạng thái & Thời gian:
    start_date DATE NOT NULL,
    end_date DATE NULL,
    completion_status VARCHAR(50) NOT NULL DEFAULT 'PENDING_STUDENT_CONFIRM' 
        COMMENT 'PENDING_STUDENT_CONFIRM, COMPLETED, DISPUTED',
    employer_rating INT NULL,
    employer_feedback TEXT NULL,
    student_feedback TEXT NULL,
    employer_completed_at DATETIME NOT NULL,
    student_confirmed_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_wh_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_wh_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_wh_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_wh_employer FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_wh_student (student_id),
    INDEX idx_wh_status (completion_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG student_profiles (Thông tin 12 khu vực mở rộng của Profile sinh viên)
CREATE TABLE IF NOT EXISTS student_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    career_objective TEXT NULL,
    education_level VARCHAR(100) NULL,
    gpa VARCHAR(20) NULL,
    languages LONGTEXT NULL COMMENT 'JSON array [{language, level}]',
    work_experiences LONGTEXT NULL COMMENT 'JSON array [{company, position, startDate, endDate, description}]',
    portfolio_projects LONGTEXT NULL COMMENT 'JSON array [{title, link, description, technologies}]',
    certificates LONGTEXT NULL COMMENT 'JSON array [{name, issuer, year, url}]',
    available_schedule LONGTEXT NULL COMMENT 'JSON object: Thứ và ca rảnh trong tuần',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

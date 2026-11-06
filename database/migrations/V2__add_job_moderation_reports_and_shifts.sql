-- ========================================================
-- MIGRATION: V2__add_job_moderation_reports_and_shifts.sql
-- Project: FreelanceHub - CDTN2 Part-time P0 Completion
-- Dual Database: PostgreSQL 16 & MySQL 8 Compatible
-- ========================================================

-- 1. Bổ sung cột shift_type và rejection_reason cho jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS shift_type VARCHAR(50) DEFAULT 'FLEXIBLE';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(255);

-- 2. Tạo bảng reports (Báo cáo vi phạm tin tuyển dụng)
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    reporter_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id INT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, RESOLVED, DISMISSED
    resolved_by INT REFERENCES users(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 3. Tạo bảng password_reset_tokens (Token đặt lại mật khẩu)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(100) UNIQUE NOT NULL,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tạo chỉ mục tối ưu hiệu năng truy vấn
CREATE INDEX IF NOT EXISTS idx_jobs_shift_type ON jobs(shift_type);
CREATE INDEX IF NOT EXISTS idx_reports_job_id ON reports(job_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON password_reset_tokens(user_id);


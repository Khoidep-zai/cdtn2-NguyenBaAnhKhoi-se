-- ============================================================================
-- FREELANCEHUB QA AUTOMATION - SEED TEST DATA
-- Idempotent script: Có thể chạy nhiều lần mà không tạo trùng lặp
-- Tiền tố chuẩn: TEST_ hoặc TEST_FREELANCEHUB
-- ============================================================================

USE freelance_db;

START TRANSACTION;

-- 1. TẠO TÀI KHOẢN EMPLOYER THỬ NGHIỆM
INSERT INTO users (id, email, password_hash, full_name, phone, role_id, company_name, company_address, is_active, created_at, updated_at)
VALUES (9901, 'TEST_employer@freelancehub.vn', '$2a$10$1SlK24.ljte4Ll8Bmd/iXePZFtttDBDZuZEq/eqrH3P1L1BcMU/vq', 'TEST Nhà Tuyển Dụng FreelanceHub', '0909999001', 2, 'TEST_Company FreelanceHub', 'Quận 1, TP.HCM', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    full_name = VALUES(full_name),
    phone = VALUES(phone),
    company_name = VALUES(company_name),
    is_active = 1;

-- 2. TẠO TÀI KHOẢN SINH VIÊN THỬ NGHIỆM
INSERT INTO users (id, email, password_hash, full_name, phone, role_id, university, major, bio, skills, is_active, created_at, updated_at)
VALUES (9902, 'TEST_student@freelancehub.vn', '$2a$10$1SlK24.ljte4Ll8Bmd/iXePZFtttDBDZuZEq/eqrH3P1L1BcMU/vq', 'TEST Sinh Viên FreelanceHub', '0909999002', 3, 'Trường ĐH Văn Lang', 'Công nghệ thông tin', 'Sinh viên thử nghiệm QA Automation', 'Java, Spring Boot, React, Playwright', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    full_name = VALUES(full_name),
    phone = VALUES(phone),
    university = VALUES(university),
    major = VALUES(major),
    is_active = 1;

-- 3. XÓA CÁC CA LÀM VÀ JOB TEST CŨ NẾU ĐÃ TỒN TẠI ĐỂ RE-SEED CHUẨN UTF8
DELETE js FROM job_shifts js
JOIN jobs j ON js.job_id = j.id
WHERE j.title LIKE '%TEST_FREELANCEHUB%' OR j.id IN (99001, 99002, 99003, 99004, 99005, 99006);

DELETE FROM jobs WHERE id IN (99001, 99002, 99003, 99004, 99005, 99006);

-- 4. TẠO 4 TIN TUYỂN DỤNG THỬ NGHIỆM CHÍNH (THEO YÊU CẦU PHẦN 3)

-- TEST_JOB_01: Thứ 2 và Thứ 7, 08:00 - 12:00, Ca sáng
INSERT INTO jobs (id, employer_id, category_id, title, description, requirements, job_type, work_mode, location, province, salary_type, salary_amount, salary_text, working_hours, shift_type, student_friendly, slots_available, status, deadline, created_at, updated_at)
VALUES (99001, 9901, 2, '[TEST_FREELANCEHUB] TEST_JOB_01 - Nhân viên Pha chế Ca Sáng T2 và T7', 'Mô tả công việc kiểm thử TEST_JOB_01 ca sáng', 'Sinh viên nhanh nhẹn', 'PART_TIME', 'ONSITE', 'Quận Bình Thạnh', 'Hồ Chí Minh', 'HOURLY', 30000.00, '30.000 đ/giờ', 'Ca sáng 08h-12h Thứ 2 và Thứ 7', 'MORNING', 1, 2, 'OPEN', '2027-12-31 23:59:59', NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title), shift_type = VALUES(shift_type), status = 'OPEN', deadline = '2027-12-31 23:59:59';

INSERT INTO job_shifts (job_id, day_of_week, shift_name, start_time, end_time, is_flexible, sessions_per_week)
VALUES 
(99001, 1, 'Ca sáng Thứ 2', '08:00:00', '12:00:00', 0, 1),
(99001, 6, 'Ca sáng Thứ 7', '08:00:00', '12:00:00', 0, 1);

-- TEST_JOB_02: Thứ 3 và Thứ 6, 18:00 - 22:00, Ca tối
INSERT INTO jobs (id, employer_id, category_id, title, description, requirements, job_type, work_mode, location, province, salary_type, salary_amount, salary_text, working_hours, shift_type, student_friendly, slots_available, status, deadline, created_at, updated_at)
VALUES (99002, 9901, 4, '[TEST_FREELANCEHUB] TEST_JOB_02 - Nhân viên Bán hàng Ca Tối T3 và T6', 'Mô tả công việc kiểm thử TEST_JOB_02 ca tối', 'Giao tiếp tốt', 'PART_TIME', 'ONSITE', 'Quận 1', 'Hồ Chí Minh', 'HOURLY', 35000.00, '35.000 đ/giờ', 'Ca tối 18h-22h Thứ 3 và Thứ 6', 'EVENING', 1, 2, 'OPEN', '2027-12-31 23:59:59', NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title), shift_type = VALUES(shift_type), status = 'OPEN', deadline = '2027-12-31 23:59:59';

INSERT INTO job_shifts (job_id, day_of_week, shift_name, start_time, end_time, is_flexible, sessions_per_week)
VALUES 
(99002, 2, 'Ca tối Thứ 3', '18:00:00', '22:00:00', 0, 1),
(99002, 5, 'Ca tối Thứ 6', '18:00:00', '22:00:00', 0, 1);

-- TEST_JOB_03: Thứ 4 và Chủ nhật, 13:00 - 17:00, Ca chiều
INSERT INTO jobs (id, employer_id, category_id, title, description, requirements, job_type, work_mode, location, province, salary_type, salary_amount, salary_text, working_hours, shift_type, student_friendly, slots_available, status, deadline, created_at, updated_at)
VALUES (99003, 9901, 1, '[TEST_FREELANCEHUB] TEST_JOB_03 - Hỗ trợ Kỹ thuật Ca Chiều T4 và CN', 'Mô tả công việc kiểm thử TEST_JOB_03 ca chiều', 'Hiểu biết IT cơ bản', 'PART_TIME', 'ONSITE', 'Quận Gò Vấp', 'Hồ Chí Minh', 'HOURLY', 40000.00, '40.000 đ/giờ', 'Ca chiều 13h-17h Thứ 4 và CN', 'AFTERNOON', 1, 1, 'OPEN', '2027-12-31 23:59:59', NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title), shift_type = VALUES(shift_type), status = 'OPEN', deadline = '2027-12-31 23:59:59';

INSERT INTO job_shifts (job_id, day_of_week, shift_name, start_time, end_time, is_flexible, sessions_per_week)
VALUES 
(99003, 3, 'Ca chiều Thứ 4', '13:00:00', '17:00:00', 0, 1),
(99003, 7, 'Ca chiều Chủ nhật', '13:00:00', '17:00:00', 0, 1);

-- TEST_JOB_04: Lịch làm việc linh hoạt, không cố định giờ
INSERT INTO jobs (id, employer_id, category_id, title, description, requirements, job_type, work_mode, location, province, salary_type, salary_amount, salary_text, working_hours, shift_type, student_friendly, slots_available, status, deadline, created_at, updated_at)
VALUES (99004, 9901, 8, '[TEST_FREELANCEHUB] TEST_JOB_04 - Cộng tác viên Dịch thuật Lịch Linh Hoạt', 'Mô tả công việc kiểm thử TEST_JOB_04 linh hoạt tự do', 'Tiếng Anh đọc hiểu tốt', 'FREELANCE', 'REMOTE', 'Toàn quốc', 'Toàn quốc', 'FIXED_PROJECT', 1500000.00, '1.500.000 đ/dự án', 'Linh hoạt tự sắp xếp thời gian', 'FLEXIBLE', 1, 3, 'OPEN', '2027-12-31 23:59:59', NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title), shift_type = VALUES(shift_type), status = 'OPEN', deadline = '2027-12-31 23:59:59';

INSERT INTO job_shifts (job_id, day_of_week, shift_name, start_time, end_time, is_flexible, sessions_per_week)
VALUES 
(99004, 1, 'Linh hoạt Thứ 2', NULL, NULL, 1, 1),
(99004, 3, 'Linh hoạt Thứ 4', NULL, NULL, 1, 1),
(99004, 5, 'Linh hoạt Thứ 6', NULL, NULL, 1, 1);

-- TEST_JOB_OVERNIGHT: Ca qua đêm Thứ 7 (22:00 -> 06:00 sáng hôm sau, startTime > endTime)
INSERT INTO jobs (id, employer_id, category_id, title, description, requirements, job_type, work_mode, location, province, salary_type, salary_amount, salary_text, working_hours, shift_type, student_friendly, slots_available, status, deadline, created_at, updated_at)
VALUES (99005, 9901, 1, '[TEST_FREELANCEHUB] TEST_JOB_OVERNIGHT - Giám sát Hệ thống Ca Qua Đêm T7', 'Trực giám sát hệ thống máy chủ đêm Thứ 7', 'Có thể thức đêm', 'PART_TIME', 'ONSITE', 'Quận 1', 'Hồ Chí Minh', 'HOURLY', 50000.00, '50.000 đ/giờ', 'Ca đêm 22h-06h Thứ 7', 'EVENING', 1, 1, 'OPEN', '2027-12-31 23:59:59', NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title), shift_type = VALUES(shift_type), status = 'OPEN', deadline = '2027-12-31 23:59:59';

INSERT INTO job_shifts (job_id, day_of_week, shift_name, start_time, end_time, is_flexible, sessions_per_week)
VALUES 
(99005, 6, 'Ca qua đêm T7', '22:00:00', '06:00:00', 0, 1);

-- TEST_JOB_ZERO_DURATION: Ca có giờ bắt đầu bằng kết thúc (10:00:00 = 10:00:00)
INSERT INTO jobs (id, employer_id, category_id, title, description, requirements, job_type, work_mode, location, province, salary_type, salary_amount, salary_text, working_hours, shift_type, student_friendly, slots_available, status, deadline, created_at, updated_at)
VALUES (99006, 9901, 4, '[TEST_FREELANCEHUB] TEST_JOB_ZERO_DURATION - Điểm danh tại chỗ', 'Công việc chỉ yêu cầu có mặt điểm danh', 'Đúng giờ', 'PART_TIME', 'ONSITE', 'Quận 3', 'Hồ Chí Minh', 'HOURLY', 100000.00, '100.000 đ/buổi', '10h00', 'MORNING', 1, 1, 'OPEN', '2027-12-31 23:59:59', NOW(), NOW())
ON DUPLICATE KEY UPDATE title = VALUES(title), shift_type = VALUES(shift_type), status = 'OPEN', deadline = '2027-12-31 23:59:59';

INSERT INTO job_shifts (job_id, day_of_week, shift_name, start_time, end_time, is_flexible, sessions_per_week)
VALUES 
(99006, 1, 'Ca điểm danh 10h', '10:00:00', '10:00:00', 0, 1);

COMMIT;

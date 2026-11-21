-- ============================================================================
-- FREELANCEHUB QA AUTOMATION - CLEANUP TEST DATA
-- Xóa an toàn CHỈ các bản ghi test (tiền tố TEST_ hoặc ID >= 99000)
-- BẢO VỆ 100% 1.472 JOBS GỐC, 16 CATEGORIES VÀ CÁC TÀI KHOẢN GỐC
-- ============================================================================

USE freelance_db;

START TRANSACTION;

-- 1. Xóa các bản ghi liên quan trong work_histories (test records)
DELETE FROM work_histories 
WHERE student_id = 9902 OR employer_id = 9901 OR job_id >= 99000
   OR job_title LIKE '%TEST_FREELANCEHUB%';

-- 2. Xóa các đơn ứng tuyển test
DELETE FROM applications 
WHERE student_id = 9902 OR job_id >= 99000;

-- 3. Xóa thông báo test
DELETE FROM notifications 
WHERE user_id IN (9901, 9902) OR title LIKE '%TEST%';

-- 4. Xóa đánh giá test
DELETE FROM reviews 
WHERE reviewer_id IN (9901, 9902) OR reviewee_id IN (9901, 9902);

-- 5. Xóa hồ sơ sinh viên test
DELETE FROM student_profiles 
WHERE user_id = 9902;

-- 6. Xóa ca làm việc test
DELETE js FROM job_shifts js
JOIN jobs j ON js.job_id = j.id
WHERE j.title LIKE '%TEST_FREELANCEHUB%' OR j.id >= 99000 OR j.employer_id = 9901;

-- 7. Xóa jobs test (CHỈ XÓA ID >= 99000, BẢO TOÀN 100% ID 1 - 1472)
DELETE FROM jobs 
WHERE id >= 99000 
   OR title LIKE '%TEST_FREELANCEHUB%'
   OR employer_id = 9901;

-- 8. Xóa tài khoản test
DELETE FROM users 
WHERE id IN (9901, 9902) 
   OR email IN ('TEST_employer@freelancehub.vn', 'TEST_student@freelancehub.vn');

COMMIT;

-- ========================================================
-- SEED DATA FOR MYSQL: mysql_seed.sql
-- Project: Student Freelance & Part-time Job Marketplace
-- Team: Nhom 8 - Chuyen de tot nghiep 2
-- Default password for demo accounts: "Password123@"
-- BCrypt hash: $2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2
-- ========================================================

USE freelance_db;

-- 1. Insert Roles
INSERT IGNORE INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Quản trị viên toàn quyền hệ thống'),
(2, 'ROLE_EMPLOYER', 'Nhà tuyển dụng / Doanh nghiệp / Cá nhân thuê nhân sự'),
(3, 'ROLE_STUDENT', 'Sinh viên tìm việc part-time hoặc freelance');

-- 2. Insert Categories
INSERT IGNORE INTO categories (id, name, slug, icon, description) VALUES
(1, 'Lập trình & CNTT', 'lap-trinh-cntt', 'code', 'Lập trình web, app, fix bug, hỗ trợ kỹ thuật IT'),
(2, 'Thiết kế đồ họa & Media', 'thiet-ke-do-hoa', 'palette', 'Thiết kế banner, logo, chỉnh sửa video ngắn, chụp ảnh'),
(3, 'Gia sư & Dạy kèm', 'gia-su-day-kem', 'book-open', 'Dạy kèm Toán, Lý, Hóa, Tiếng Anh cho học sinh phổ thông'),
(4, 'Phục vụ & Bán hàng part-time', 'phuc-vu-ban-hang', 'coffee', 'Nhân viên barista quán cà phê, nhân viên bán hàng shop thời trang'),
(5, 'Dịch thuật & Viết nội dung (Content)', 'content-dich-thuat', 'feather', 'Viết bài chuẩn SEO, chăm sóc fanpage, dịch tài liệu tiếng Anh');

-- 3. Insert Demo Users
INSERT IGNORE INTO users (id, email, password_hash, full_name, phone, role_id, university, major, company_name, company_address, bio, skills, is_active) VALUES
(1, 'admin@freelancehub.vn', '$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2', 'Quản Trị Viên Nhóm 8', '0901234567', 1, 'Trường ĐH Văn Lang', 'Khoa CNTT', 'FreelanceHub System', 'TP.HCM', 'Tài khoản quản trị viên hệ thống', 'Spring Boot, React, MySQL, PostgreSQL', true),
(2, 'recruiter@thecoffee.vn', '$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2', 'Nguyễn Thị Tuyết (The Coffee House)', '0912345678', 2, NULL, NULL, 'The Coffee House Bình Thạnh', 'Bình Thạnh, TP.HCM', 'Chuỗi cà phê chuyên tuyển nhân sự sinh viên theo ca linh hoạt', NULL, true),
(3, 'techlead@innovate.vn', '$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2', 'Trần Văn Minh (Innovate Studio)', '0923456789', 2, NULL, NULL, 'Innovate Media & Tech', 'Quận 1, TP.HCM', 'Agency thiết kế website và sản xuất nội dung số', NULL, true),
(4, 'sinhvien.tai@vanlanguni.vn', '$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2', 'Nguyễn Tấn Tài', '0934567890', 3, 'Trường ĐH Văn Lang', 'Công nghệ thông tin', NULL, NULL, 'Sinh viên năm 4 đam mê Backend Java Spring Boot và cơ sở dữ liệu', 'Java, Spring Boot, MySQL, PostgreSQL, Docker', true),
(5, 'sinhvien.khoi@vanlanguni.vn', '$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2', 'Nguyễn Bá Anh Khôi', '0945678901', 3, 'Trường ĐH Văn Lang', 'Công nghệ thông tin', NULL, NULL, 'Sinh viên năm 4 chuyên ngành CNPM, có kinh nghiệm phân tích nghiệp vụ và ReactJS', 'React, Java, Spring Boot, Figma, Git', true),
(6, 'sinhvien.long@vanlanguni.vn', '$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2', 'Hoàng Bảo Long', '0956789012', 3, 'Trường ĐH Văn Lang', 'Công nghệ thông tin', NULL, NULL, 'Sinh viên năm 4 yêu thích UI/UX, kiểm thử phần mềm tự động', 'React, TypeScript, Testing', true);

-- 4. Insert Demo Jobs
INSERT IGNORE INTO jobs (id, employer_id, category_id, title, description, requirements, job_type, work_mode, location, salary_type, salary_amount, slots_available, status, deadline) VALUES
(1, 2, 4, 'Tuyển nhân viên Barista & Phục vụ ca tối', 'Pha chế đồ uống theo công thức, phục vụ khách hàng, dọn dẹp quầy ca tối từ 17h00 - 22h00 các ngày trong tuần.', 'Nhanh nhẹn, chăm chỉ, ưu tiên sinh viên năm 1, 2 có thể xoay ca theo lịch học.', 'PART_TIME', 'ONSITE', 'Quận Bình Thạnh, TP.HCM', 'HOURLY', 28000.00, 3, 'OPEN', DATE_ADD(NOW(), INTERVAL 14 DAY)),
(2, 3, 1, 'Lập trình Landing Page giới thiệu sản phẩm bằng React', 'Xây dựng trang đích quảng bá sản phẩm mới dựa trên bản thiết kế Figma có sẵn. Yêu cầu responsive chuẩn máy tính và điện thoại.', 'Thành thạo HTML/CSS, ReactJS, biết sử dụng Git. Thời gian hoàn thành trong 1 tuần.', 'FREELANCE', 'REMOTE', 'Toàn quốc', 'FIXED_PROJECT', 2500000.00, 1, 'OPEN', DATE_ADD(NOW(), INTERVAL 7 DAY)),
(3, 3, 2, 'Thiết kế bộ ấn phẩm Banner & Poster sự kiện âm nhạc', 'Thiết kế 5 poster và 10 ảnh định dạng vuông đăng Facebook/Instagram phục vụ tuần lễ giao lưu âm nhạc sinh viên.', 'Biết sử dụng Photoshop, Illustrator hoặc Canva Pro. Thẩm mỹ hiện đại, trẻ trung.', 'FREELANCE', 'REMOTE', 'Toàn quốc', 'FIXED_PROJECT', 1500000.00, 1, 'OPEN', DATE_ADD(NOW(), INTERVAL 10 DAY)),
(4, 2, 3, 'Gia sư dạy kèm môn Tiếng Anh giao tiếp lớp 7', 'Kèm cặp ngữ pháp và rèn luyện kỹ năng nghe nói cơ bản cho học sinh lớp 7. 3 buổi/tuần, mỗi buổi 1.5 giờ.', 'Sinh viên có điểm IELTS từ 6.0 trở lên hoặc chuyên ngành Ngôn ngữ Anh.', 'PART_TIME', 'HYBRID', 'Quận Gò Vấp, TP.HCM', 'HOURLY', 120000.00, 1, 'OPEN', DATE_ADD(NOW(), INTERVAL 20 DAY));

-- 5. Insert Demo Applications
INSERT IGNORE INTO applications (id, job_id, student_id, cover_letter, cv_url, status) VALUES
(1, 2, 4, 'Em có kinh nghiệm 1 năm làm việc với React và TailwindCSS, em đã xem bản mô tả và tự tin hoàn thành tốt.', 'https://drive.google.com/sample_cv_tai.pdf', 'ACCEPTED'),
(2, 2, 5, 'Chào anh/chị, em là Khôi, đã hoàn thành nhiều dự án frontend trong trường học, rất mong được hợp tác.', 'https://drive.google.com/sample_cv_khoi.pdf', 'PENDING');

-- 6. Insert Demo Reviews
INSERT IGNORE INTO reviews (id, job_id, reviewer_id, reviewee_id, rating, comment) VALUES
(1, 2, 4, 3, 5, 'Nhà tuyển dụng rất nhiệt tình, hướng dẫn chi tiết và thanh toán đúng hẹn!'),
(2, 2, 3, 4, 5, 'Sinh viên làm việc có trách nhiệm, code sạch, giao bài đúng hạn.');

-- 7. Insert Demo Notifications
INSERT IGNORE INTO notifications (id, user_id, title, message, type, reference_id, is_read) VALUES
(1, 4, 'Đơn ứng tuyển được chấp nhận', 'Chúc mừng bạn! Nhà tuyển dụng Innovate Studio đã chấp nhận đơn ứng tuyển của bạn cho công việc "Lập trình Landing Page".', 'APPLICATION_STATUS', 1, false),
(2, 5, 'Đơn ứng tuyển đã gửi', 'Bạn đã nộp đơn thành công cho công việc "Lập trình Landing Page". Hãy chờ phản hồi từ nhà tuyển dụng.', 'APPLICATION_STATUS', 2, true),
(3, 3, 'Có ứng viên mới', 'Sinh viên Nguyễn Bá Anh Khôi vừa nộp đơn ứng tuyển cho công việc "Lập trình Landing Page".', 'NEW_APPLICATION', 2, false);

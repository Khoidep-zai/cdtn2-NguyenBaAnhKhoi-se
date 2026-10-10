-- ========================================================
-- SEED DATA: V3__seed_initial_data.sql
-- Sample accounts, categories, and job posts for testing
-- Default password for all seed accounts: "Password123@"
-- BCrypt hash: $2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2
-- ========================================================

-- 1. Insert Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Quản trị viên toàn quyền hệ thống'),
(2, 'ROLE_EMPLOYER', 'Nhà tuyển dụng / Doanh nghiệp / Cá nhân thuê nhân sự'),
(3, 'ROLE_STUDENT', 'Sinh viên tìm việc part-time hoặc freelance')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Categories
INSERT INTO categories (id, name, slug, icon, description) VALUES
(1, 'Lập trình & CNTT', 'lap-trinh-cntt', 'code', 'Lập trình web, app, fix bug, hỗ trợ kỹ thuật IT'),
(2, 'Thiết kế đồ họa & Media', 'thiet-ke-do-hoa', 'palette', 'Thiết kế banner, logo, chỉnh sửa video ngắn, chụp ảnh'),
(3, 'Gia sư & Dạy kèm', 'gia-su-day-kem', 'book-open', 'Dạy kèm Toán, Lý, Hóa, Tiếng Anh cho học sinh phổ thông'),
(4, 'Phục vụ & Bán hàng part-time', 'phuc-vu-ban-hang', 'coffee', 'Nhân viên barista quán cà phê, nhân viên bán hàng shop thời trang'),
(5, 'Dịch thuật & Viết nội dung (Content)', 'content-dich-thuat', 'feather', 'Viết bài chuẩn SEO, chăm sóc fanpage, dịch tài liệu tiếng Anh')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Demo Users
INSERT INTO users (id, email, password_hash, full_name, phone, role_id, university, major, company_name, bio) VALUES
(1, 'admin@freelancehub.vn', '$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2', 'Quản Trị Viên Nhóm 8', '0901234567', 1, 'Trường ĐH Văn Lang', 'Khoa CNTT', 'FreelanceHub System', 'Tài khoản quản trị viên'),
(2, 'recruiter@thecoffee.vn', '$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2', 'Nguyễn Thị Tuyết (The Coffee House)', '0912345678', 2, NULL, NULL, 'The Coffee House Bình Thạnh', 'Chuỗi cà phê chuyên tuyển nhân sự sinh viên theo ca'),
(3, 'techlead@innovate.vn', '$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2', 'Trần Văn Minh (Innovate Studio)', '0923456789', 2, NULL, NULL, 'Innovate Media & Tech', 'Agency thiết kế website và sản xuất nội dung số'),
(4, 'sinhvien.tai@vanlanguni.vn', '$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2', 'Nguyễn Tấn Tài', '0934567890', 3, 'Trường ĐH Văn Lang', 'Công nghệ thông tin', NULL, 'Sinh viên năm 4 đam mê Backend Java Spring Boot và cơ sở dữ liệu'),
(5, 'sinhvien.khoi@vanlanguni.vn', '$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2', 'Nguyễn Bá Anh Khôi', '0945678901', 3, 'Trường ĐH Văn Lang', 'Công nghệ thông tin', NULL, 'Sinh viên năm 4 chuyên ngành CNPM, có kinh nghiệm phân tích nghiệp vụ và ReactJS'),
(6, 'sinhvien.long@vanlanguni.vn', '$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2', 'Hoàng Bảo Long', '0956789012', 3, 'Trường ĐH Văn Lang', 'Công nghệ thông tin', NULL, 'Sinh viên năm 4 yêu thích UI/UX, kiểm thử phần mềm tự động')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Demo Jobs
INSERT INTO jobs (id, employer_id, category_id, title, description, requirements, job_type, work_mode, location, salary_type, salary_amount, slots_available, status) VALUES
(1, 2, 4, 'Tuyển nhân viên Barista & Phục vụ ca tối', 'Pha chế đồ uống theo công thức, phục vụ khách hàng, dọn dẹp quầy ca tối từ 17h00 - 22h00 các ngày trong tuần.', 'Nhanh nhẹn, chăm chỉ, ưu tiên sinh viên năm 1, 2 có thể xoay ca theo lịch học.', 'PART_TIME', 'ONSITE', 'Quận Bình Thạnh, TP.HCM', 'HOURLY', 28000.00, 3, 'OPEN'),
(2, 3, 1, 'Lập trình Landing Page giới thiệu sản phẩm bằng React', 'Xây dựng trang đích quảng bá sản phẩm mới dựa trên bản thiết kế Figma có sẵn. Yêu cầu responsive chuẩn máy tính và điện thoại.', 'Thành thạo HTML/CSS, ReactJS, biết sử dụng Git. Thời gian hoàn thành trong 1 tuần.', 'FREELANCE', 'REMOTE', 'Toàn quốc', 'FIXED_PROJECT', 2500000.00, 1, 'OPEN'),
(3, 3, 2, 'Thiết kế bộ ấn phẩm Banner & Poster sự kiện âm nhạc', 'Thiết kế 5 poster và 10 ảnh định dạng vuông đăng Facebook/Instagram phục vụ tuần lễ giao lưu âm nhạc sinh viên.', 'Biết sử dụng Photoshop, Illustrator hoặc Canva Pro. Thẩm mỹ hiện đại, trẻ trung.', 'FREELANCE', 'REMOTE', 'Toàn quốc', 'FIXED_PROJECT', 1500000.00, 1, 'OPEN'),
(4, 2, 3, 'Gia sư dạy kèm môn Tiếng Anh giao tiếp lớp 7', 'Kèm cặp ngữ pháp và rèn luyện kỹ năng nghe nói cơ bản cho học sinh lớp 7. 3 buổi/tuần, mỗi buổi 1.5 giờ.', 'Sinh viên có điểm IELTS từ 6.0 trở lên hoặc chuyên ngành Ngôn ngữ Anh.', 'PART_TIME', 'HYBRID', 'Quận Gò Vấp, TP.HCM', 'HOURLY', 120000.00, 1, 'OPEN')
ON CONFLICT (id) DO NOTHING;

-- Reset identity sequence
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('jobs_id_seq', (SELECT MAX(id) FROM jobs));

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to import VietJobs marketplace dataset into MySQL and PostgreSQL databases.
Generates full SQL init scripts and directly executes them on both local databases.
"""

import os
import re
import sys
import subprocess
from pathlib import Path
import pandas as pd

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

DATASET_CSV = Path(__file__).parent / "output" / "jobs_marketplace.csv"
DB_DIR = Path(__file__).parent.parent / "database"

CAT_INFO = {
    "công_nghệ_thông_tin_kỹ_thuật_số": (1, "Lập trình & CNTT", "lap-trinh-cntt", "code", "Lập trình web, app, fix bug, IT"),
    "du_lịch_nhà_hàng_khách_sạn_dịch_vụ": (2, "Phục vụ, Nhà hàng & Khách sạn", "phuc-vu-nha-hang", "coffee", "Phục vụ quán cafe, barista, lễ tân, phụ bếp"),
    "giáo_dục_đào_tạo_nghiên_cứu": (3, "Gia sư & Dạy kèm", "gia-su-day-kem", "book-open", "Gia sư Toán, Lý, Hóa, Tiếng Anh, trợ giảng"),
    "kinh_doanh_bán_hàng_chăm_sóc_khách_hàng": (4, "Bán hàng & Chăm sóc khách hàng", "ban-hang-cskh", "shopping-bag", "Nhân viên bán hàng shop, trực page, telesales"),
    "kỹ_thuật_điện_điện_tử_viễn_thông": (5, "Kỹ thuật, Điện & Viễn thông", "ky-thuat-dien-tu", "cpu", "Lắp đặt, bảo trì kỹ thuật, phần cứng"),
    "logistics_vận_tải_chuỗi_cung_ứng": (6, "Logistics, Giao hàng & Kho vận", "logistics-kho-van", "truck", "Nhân viên kho, điều phối đơn hàng, shipper"),
    "marketing_truyền_thông_quảng_cáo_nội_dung": (7, "Marketing, Truyền thông & Content", "marketing-content", "feather", "Viết bài chuẩn SEO, quản trị fanpage, seeding"),
    "ngôn_ngữ_dịch_thuật": (8, "Dịch thuật & Biên dịch", "dich-thuat", "globe", "Dịch tài liệu tiếng Anh, Trung, Nhật, Hàn"),
    "nhân_sự_hành_chính_pháp_chế_tư_vấn": (9, "Hành chính & Nhân sự", "hanh-chinh-nhan-su", "users", "Hỗ trợ tuyển dụng, quản lý hồ sơ, nhập liệu"),
    "nhóm_nghề_khác": (10, "Lao động & Việc làm khác", "viec-lam-khac", "briefcase", "Các công việc part-time và thời vụ khác"),
    "nông_nghiệp_năng_lượng_môi_trường": (11, "Môi trường & Năng lượng", "moi-truong-nang-luong", "leaf", "Công việc nghiên cứu, khảo sát môi trường"),
    "sản_xuất_lao_động_phổ_thông_cơ_khí": (12, "Lao động phổ thông & Đóng gói", "lao-dong-pho-thong", "tool", "Đóng gói hàng hóa, phụ kho, thủ công"),
    "thiết_kế_nghệ_thuật_giải_trí_truyền_hình_báo_chí": (13, "Thiết kế đồ họa & Media", "thiet-ke-do-hoa", "palette", "Thiết kế poster, banner, edit video ngắn"),
    "tài_chính_kế_toán_ngân_hàng_bảo_hiểm": (14, "Tài chính & Kế toán", "tai-chinh-ke-toan", "pie-chart", "Hỗ trợ kế toán, chứng từ, thu ngân part-time"),
    "xây_dựng_kiến_trúc_bất_động_sản": (15, "Kiến trúc & Xây dựng", "kien-truc-xay-dung", "home", "Vẽ 2D/3D AutoCad, phối cảnh dự án"),
    "y_tế_dược_chăm_sóc_sức_khỏe_công_nghệ_sinh_học": (16, "Y tế, Dược & Sức khỏe", "y-te-suc-khoe", "activity", "Hỗ trợ phòng khám, nhà thuốc, y tá part-time")
}

DEMO_USERS = [
    (1, "admin@freelancehub.vn", "Quản Trị Viên Nhóm 8", "0901234567", 1, "Trường ĐH Văn Lang", "Khoa CNTT", "FreelanceHub System", "TP.HCM", "Quản trị viên hệ thống Chuyên đề tốt nghiệp 2", "Spring Boot, React, MySQL, PostgreSQL"),
    (2, "recruiter@thecoffee.vn", "Nguyễn Thị Tuyết (The Coffee House)", "0912345678", 2, None, None, "The Coffee House Chuỗi F&B", "Quận Bình Thạnh, TP.HCM", "Chuỗi cà phê chuyên tuyển dụng nhân sự sinh viên theo ca linh hoạt", "F&B, Barista, Quản lý ca"),
    (3, "techlead@innovate.vn", "Trần Văn Minh (Innovate Studio)", "0923456789", 2, None, None, "Innovate Media & Tech", "Quận 1, TP.HCM", "Agency thiết kế website, lập trình app và sản xuất nội dung số", "React, Node.js, Design"),
    (4, "sinhvien.tai@vanlanguni.vn", "Nguyễn Tấn Tài", "0934567890", 3, "Trường ĐH Văn Lang", "Công nghệ thông tin", None, None, "Sinh viên năm 4 đam mê Backend Java Spring Boot và cơ sở dữ liệu", "Java, Spring Boot, MySQL, PostgreSQL, Docker"),
    (5, "sinhvien.khoi@vanlanguni.vn", "Nguyễn Bá Anh Khôi", "0945678901", 3, "Trường ĐH Văn Lang", "Công nghệ thông tin", None, None, "Sinh viên năm 4 chuyên ngành CNPM, có kinh nghiệm phân tích nghiệp vụ và ReactJS", "React, Java, Spring Boot, Figma, Git"),
    (6, "sinhvien.long@vanlanguni.vn", "Hoàng Bảo Long", "0956789012", 3, "Trường ĐH Văn Lang", "Công nghệ thông tin", None, None, "Sinh viên năm 4 yêu thích UI/UX, kiểm thử phần mềm tự động", "React, TypeScript, Testing"),
    (7, "hr@fptsoftware.vn", "Phạm Hoàng Long (FPT Software)", "0961122334", 2, None, None, "FPT Software Toàn Cầu", "Khu Công Nghệ Cao, TP.HCM & Hà Nội", "Tập đoàn công nghệ hàng đầu Việt Nam tuyển thực tập sinh và lập trình viên", "Java, Python, C++, React"),
    (8, "tuyendung@highlandscoffee.com.vn", "Lê Thanh Trúc (Highlands Coffee)", "0972233445", 2, None, None, "Highlands Coffee Việt Nam", "Toàn quốc", "Chuỗi đồ uống hàng đầu tuyển nhân viên phục vụ, thu ngân part-time", "Dịch vụ khách hàng, Pha chế"),
    (9, "talent@shopee.vn", "Vũ Minh Quân (Shopee Vietnam)", "0983344556", 2, None, None, "Shopee Logistics & E-Commerce", "Quận 7, TP.HCM", "Sàn thương mại điện tử tuyển CTV nội dung, kho vận và hỗ trợ vận hành", "E-commerce, Marketing, Logistics"),
    (10, "recruitment@viettel.vn", "Đoàn Thu Hà (Viettel Telecom)", "0994455667", 2, None, None, "Tập đoàn Công nghiệp Viễn thông Viettel", "Cầu Giấy, Hà Nội", "Tập đoàn viễn thông tuyển thực tập sinh kỹ thuật và nhân viên CSKH sinh viên", "Viễn thông, Kỹ thuật số, CSKH")
]

DEFAULT_PASSWORD_HASH = "$2a$10$wK1VfM9zH1OlnqA8oN1hKe7GjYj8F1BqN8uV2YyvK1Yd8QxV8uXW2"

def esc_sql(val):
    if val is None or pd.isna(val):
        return "NULL"
    s = str(val).replace("'", "''").strip()
    return f"'{s}'"

def generate_and_import():
    if not DATASET_CSV.exists():
        print(f"Error: {DATASET_CSV} not found!")
        return

    df = pd.read_csv(DATASET_CSV)
    print(f"Loading {len(df)} jobs from dataset...")

    mysql_lines = []
    postgres_lines = []

    # Header
    mysql_lines.append("-- ========================================================")
    mysql_lines.append("-- COMPLETE MYSQL INITIALIZATION SCRIPT WITH VIETJOBS DATASET")
    mysql_lines.append("-- Database: freelance_db (MySQL 8.x)")
    mysql_lines.append("-- ========================================================\n")
    mysql_lines.append("CREATE DATABASE IF NOT EXISTS freelance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    mysql_lines.append("USE freelance_db;\n")
    mysql_lines.append("DROP TABLE IF EXISTS notifications, reviews, applications, jobs, categories, users, roles;\n")

    postgres_lines.append("-- ========================================================")
    postgres_lines.append("-- COMPLETE POSTGRESQL INITIALIZATION SCRIPT WITH VIETJOBS DATASET")
    postgres_lines.append("-- Database: freelance_db (PostgreSQL 16/18)")
    postgres_lines.append("-- ========================================================\n")
    postgres_lines.append("DROP TABLE IF EXISTS notifications, reviews, applications, jobs, categories, users, roles CASCADE;\n")

    # Tables DDL
    mysql_schema_content = (DB_DIR / "mysql_schema.sql").read_text(encoding="utf-8")
    # Clean database create from schema since already done
    mysql_lines.append(mysql_schema_content)

    postgres_ddl = """
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    avatar_url VARCHAR(500),
    bio TEXT,
    skills TEXT,
    university VARCHAR(150),
    major VARCHAR(150),
    company_name VARCHAR(150),
    company_address VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    icon VARCHAR(100),
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    employer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    job_type VARCHAR(50) NOT NULL,
    work_mode VARCHAR(50) DEFAULT 'ONSITE',
    location VARCHAR(255),
    province VARCHAR(100),
    salary_type VARCHAR(50) NOT NULL,
    salary_amount DECIMAL(12, 2) NOT NULL,
    salary_text VARCHAR(100),
    working_hours VARCHAR(255),
    benefits TEXT,
    student_friendly BOOLEAN DEFAULT TRUE,
    slots_available INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'OPEN',
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    student_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    cv_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'PENDING',
    rejection_reason VARCHAR(255),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_job_student_application UNIQUE (job_id, student_id)
);

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

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category_id ON jobs(category_id);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_work_mode ON jobs(work_mode);
CREATE INDEX IF NOT EXISTS idx_jobs_province ON jobs(province);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
"""
    postgres_lines.append(postgres_ddl)

    # 1. Insert Roles
    mysql_lines.append("\n-- 1. Insert Roles")
    postgres_lines.append("\n-- 1. Insert Roles")
    roles_sql = """
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Quản trị viên toàn quyền hệ thống'),
(2, 'ROLE_EMPLOYER', 'Nhà tuyển dụng / Doanh nghiệp / Cá nhân thuê nhân sự'),
(3, 'ROLE_STUDENT', 'Sinh viên tìm việc part-time hoặc freelance');
"""
    mysql_lines.append(roles_sql)
    postgres_lines.append(roles_sql)

    # 2. Insert 16 Categories
    mysql_lines.append("\n-- 2. Insert 16 Categories")
    postgres_lines.append("\n-- 2. Insert 16 Categories")
    for key, (cid, name, slug, icon, desc) in CAT_INFO.items():
        mysql_lines.append(f"INSERT INTO categories (id, name, slug, icon, description) VALUES ({cid}, '{name}', '{slug}', '{icon}', '{desc}');")
        postgres_lines.append(f"INSERT INTO categories (id, name, slug, icon, description) VALUES ({cid}, '{name}', '{slug}', '{icon}', '{desc}');")

    # 3. Insert Demo Users
    mysql_lines.append("\n-- 3. Insert Demo Users & Employers")
    postgres_lines.append("\n-- 3. Insert Demo Users & Employers")
    for uid, email, fullname, phone, rid, univ, major, cname, caddr, bio, skills in DEMO_USERS:
        mysql_lines.append(
            f"INSERT INTO users (id, email, password_hash, full_name, phone, role_id, university, major, company_name, company_address, bio, skills, is_active) VALUES "
            f"({uid}, '{email}', '{DEFAULT_PASSWORD_HASH}', '{fullname}', '{phone}', {rid}, {esc_sql(univ)}, {esc_sql(major)}, {esc_sql(cname)}, {esc_sql(caddr)}, {esc_sql(bio)}, {esc_sql(skills)}, true);"
        )
        postgres_lines.append(
            f"INSERT INTO users (id, email, password_hash, full_name, phone, role_id, university, major, company_name, company_address, bio, skills, is_active) VALUES "
            f"({uid}, '{email}', '{DEFAULT_PASSWORD_HASH}', '{fullname}', '{phone}', {rid}, {esc_sql(univ)}, {esc_sql(major)}, {esc_sql(cname)}, {esc_sql(caddr)}, {esc_sql(bio)}, {esc_sql(skills)}, true);"
        )

    # 4. Insert 1,450 Jobs
    mysql_lines.append("\n-- 4. Insert 1,450 VietJobs dataset posts")
    postgres_lines.append("\n-- 4. Insert 1,450 VietJobs dataset posts")

    emp_ids = [2, 3, 7, 8, 9, 10]

    for idx, row in df.iterrows():
        jid = idx + 1
        emp_id = emp_ids[idx % len(emp_ids)]

        cat_key = str(row.get("category", "")).strip()
        cat_id = CAT_INFO.get(cat_key, (10,))[0]

        title = str(row.get("title", "Việc làm sinh viên")).strip()[:250]
        if not title:
            title = "Việc làm thêm sinh viên"

        ct = str(row.get("contract_type", "")).lower()
        if "thực tập" in ct or "intern" in ct:
            job_type = "INTERNSHIP"
        elif "cộng tác viên" in ct or "freelance" in ct or "tự do" in ct:
            job_type = "FREELANCE"
        else:
            job_type = "PART_TIME"

        loc = str(row.get("location", "Toàn quốc")).strip()[:250]
        prov = row.get("province")
        prov_val = esc_sql(prov)

        loc_desc = (loc + " " + str(row.get("description", ""))).lower()
        if "remote" in loc_desc or "tại nhà" in loc_desc:
            work_mode = "REMOTE"
        elif "hybrid" in loc_desc:
            work_mode = "HYBRID"
        else:
            work_mode = "ONSITE"

        sal_text = str(row.get("salary_text", "Thỏa thuận")).strip()[:100]
        sal_min = row.get("salary_min_million_vnd")
        sal_max = row.get("salary_max_million_vnd")

        if "giờ" in sal_text.lower() or "h" in sal_text.lower():
            salary_type = "HOURLY"
            salary_amount = 28000.00
        elif job_type == "FREELANCE":
            salary_type = "FIXED_PROJECT"
            salary_amount = 2500000.00
            if pd.notna(sal_max) and sal_max > 0:
                salary_amount = sal_max * 1000000.0
            elif pd.notna(sal_min) and sal_min > 0:
                salary_amount = sal_min * 1000000.0
        else:
            salary_type = "MONTHLY"
            if pd.notna(sal_max) and sal_max > 0:
                salary_amount = sal_max * 1000000.0
            elif pd.notna(sal_min) and sal_min > 0:
                salary_amount = sal_min * 1000000.0
            else:
                salary_amount = 4000000.00

        desc = row.get("description")
        if pd.isna(desc) or not str(desc).strip():
            desc = "Công việc bán thời gian / thực tập dành cho sinh viên năng động, mong muốn tích lũy kinh nghiệm."
        else:
            desc = str(desc).strip()

        req = row.get("requirements")
        tech_skills = row.get("technical_skills")
        soft_skills = row.get("soft_skills")
        full_req = []
        if pd.notna(req) and str(req).strip():
            full_req.append(str(req).strip())
        if pd.notna(tech_skills) and str(tech_skills).strip():
            full_req.append("Kỹ năng chuyên môn: " + str(tech_skills).strip())
        if pd.notna(soft_skills) and str(soft_skills).strip():
            full_req.append("Kỹ năng mềm: " + str(soft_skills).strip())
        req_str = "\n".join(full_req) if full_req else "Sinh viên nhiệt tình, có trách nhiệm trong công việc."

        benefits = row.get("benefits")
        benefits_val = esc_sql(benefits)

        wh = row.get("working_hours")
        wh_val = esc_sql(str(wh)[:250] if pd.notna(wh) else "Ca làm việc linh hoạt theo lịch học")

        student_friendly = "true" if row.get("student_friendly", True) else "false"
        slots = (idx % 4) + 1

        mysql_lines.append(
            f"INSERT INTO jobs (id, employer_id, category_id, title, description, requirements, "
            f"job_type, work_mode, location, province, salary_type, salary_amount, salary_text, "
            f"working_hours, benefits, student_friendly, slots_available, status, deadline) VALUES ("
            f"{jid}, {emp_id}, {cat_id}, {esc_sql(title)}, {esc_sql(desc)}, {esc_sql(req_str)}, "
            f"'{job_type}', '{work_mode}', {esc_sql(loc)}, {prov_val}, '{salary_type}', {salary_amount:.2f}, {esc_sql(sal_text)}, "
            f"{wh_val}, {benefits_val}, {student_friendly}, {slots}, 'OPEN', DATE_ADD(NOW(), INTERVAL 30 DAY));"
        )

        postgres_lines.append(
            f"INSERT INTO jobs (id, employer_id, category_id, title, description, requirements, "
            f"job_type, work_mode, location, province, salary_type, salary_amount, salary_text, "
            f"working_hours, benefits, student_friendly, slots_available, status, deadline) VALUES ("
            f"{jid}, {emp_id}, {cat_id}, {esc_sql(title)}, {esc_sql(desc)}, {esc_sql(req_str)}, "
            f"'{job_type}', '{work_mode}', {esc_sql(loc)}, {prov_val}, '{salary_type}', {salary_amount:.2f}, {esc_sql(sal_text)}, "
            f"{wh_val}, {benefits_val}, {student_friendly}, {slots}, 'OPEN', CURRENT_TIMESTAMP + INTERVAL '30 days');"
        )

    # 5. Insert Sample Applications & Reviews & Notifications
    demo_app_mysql = """
INSERT INTO applications (id, job_id, student_id, cover_letter, cv_url, status) VALUES
(1, 2, 4, 'Em có kinh nghiệm với React và TypeScript, em tự tin hoàn thành công việc tốt.', 'https://drive.google.com/sample_cv_tai.pdf', 'ACCEPTED'),
(2, 2, 5, 'Chào anh/chị, em là Khôi, đã hoàn thành nhiều dự án frontend trong trường học.', 'https://drive.google.com/sample_cv_khoi.pdf', 'PENDING');

INSERT INTO reviews (id, job_id, reviewer_id, reviewee_id, rating, comment) VALUES
(1, 2, 4, 3, 5, 'Nhà tuyển dụng rất nhiệt tình, hướng dẫn chi tiết và thanh toán đúng hẹn!'),
(2, 2, 3, 4, 5, 'Sinh viên làm việc có trách nhiệm, code sạch, giao bài đúng hạn.');

INSERT INTO notifications (id, user_id, title, message, type, reference_id, is_read) VALUES
(1, 4, 'Đơn ứng tuyển được chấp nhận', 'Chúc mừng bạn! Nhà tuyển dụng đã chấp nhận đơn ứng tuyển của bạn.', 'APPLICATION_STATUS', 1, false),
(2, 5, 'Đơn ứng tuyển đã gửi', 'Bạn đã nộp đơn thành công cho công việc.', 'APPLICATION_STATUS', 2, true);
"""
    mysql_lines.append(demo_app_mysql)
    postgres_lines.append(demo_app_mysql)

    # Postgres Sequences
    postgres_lines.append("\nSELECT setval('roles_id_seq', (SELECT COALESCE(MAX(id), 1) FROM roles));")
    postgres_lines.append("SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM categories));")
    postgres_lines.append("SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));")
    postgres_lines.append("SELECT setval('jobs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM jobs));")
    postgres_lines.append("SELECT setval('applications_id_seq', (SELECT COALESCE(MAX(id), 1) FROM applications));")
    postgres_lines.append("SELECT setval('reviews_id_seq', (SELECT COALESCE(MAX(id), 1) FROM reviews));")
    postgres_lines.append("SELECT setval('notifications_id_seq', (SELECT COALESCE(MAX(id), 1) FROM notifications));")

    # Save to database/mysql_init.sql and database/postgres_init.sql
    mysql_init_path = DB_DIR / "mysql_init.sql"
    postgres_init_path = DB_DIR / "postgres_init.sql"

    print(f"Saving full MySQL script to {mysql_init_path}...")
    mysql_init_path.write_text("\n".join(mysql_lines), encoding="utf-8")

    print(f"Saving full PostgreSQL script to {postgres_init_path}...")
    postgres_init_path.write_text("\n".join(postgres_lines), encoding="utf-8")

    print("Executing MySQL import...")
    res_m = subprocess.run(
        ["mysql.exe", "-u", "root", "-p12345", "freelance_db", "-e", f"source {mysql_init_path.as_posix()}"],
        capture_output=True, text=True
    )
    if res_m.returncode == 0:
        print("✅ MySQL import SUCCESSFUL!")
    else:
        print("❌ MySQL import error:", res_m.stderr)

    print("Executing PostgreSQL import...")
    env = os.environ.copy()
    env["PGPASSWORD"] = "12345"
    res_p = subprocess.run(
        ["C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe", "-U", "postgres", "-p", "5433", "-h", "localhost", "-d", "freelance_db", "-f", str(postgres_init_path)],
        env=env, capture_output=True, text=True
    )
    if res_p.returncode == 0:
        print("✅ PostgreSQL import SUCCESSFUL!")
    else:
        print("❌ PostgreSQL import error:", res_p.stderr)

if __name__ == "__main__":
    generate_and_import()

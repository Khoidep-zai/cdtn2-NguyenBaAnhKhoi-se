# TÀI LIỆU QUẢN TRỊ CƠ SỞ DỮ LIỆU (DATABASE GUIDE)

**Học phần:** Chuyên đề tốt nghiệp 2 — Nhóm 8  

---

## 1. THƯ MỤC CHỨC NĂNG
- `migrations/`: Chứa các kịch bản SQL định nghĩa schema (DDL) có tiền tố `V1`, `V2` theo chuẩn Flyway.
  - `V1__init_schema.sql`: Khởi tạo 6 bảng chính (`roles`, `users`, `categories`, `jobs`, `applications`, `reviews`).
  - `V2__create_indexes.sql`: Tạo các chỉ mục Index phục vụ tìm kiếm nhanh dưới 500ms (NFR-01).
- `seeds/`:
  - `V3__seed_initial_data.sql`: Nạp sẵn tài khoản Admin, Nhà tuyển dụng, Sinh viên và các bài tuyển dụng mẫu.

## 2. HƯỚNG DẪN KẾT NỐI
- Khi chạy qua Docker Compose: Hệ thống tự động nạp toàn bộ script trong `migrations/` khi container khởi tạo lần đầu.
- Khi kết nối thủ công bằng DBeaver / pgAdmin / DataGrip:
  - Host: `localhost`
  - Port: `5432`
  - Database: `freelance_db`
  - User: `freelance_user`
  - Password: `SecretPassword2026!`

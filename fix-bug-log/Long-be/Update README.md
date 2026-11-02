# BÁO CÁO CẬP NHẬT TÀI LIỆU DỰ ÁN (DOCUMENTATION UPDATE LOG)

## 📌 THÔNG TIN COMMIT
* **Mã Commit:** `064a304986e453813b790384d591a7fb0de2ecde`
* **Người thực hiện:** Phan Văn Hoàng Long (`phanlong0706`)
* **Vai trò:** Backend Developer & API Tester
* **Thời gian commit:** 02/11/2026 16:40:49 +0700
* **Commit Message:** `Update README.md`
* **Phân hệ:** Project Documentation & Test Evidence

---

## 1. BỐI CẢNH & MỤC ĐÍCH (CONTEXT & OBJECTIVE)
* **Vấn đề / Yêu cầu:** 
  File [`README.md`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_test/README.md) của repository chính cần được cập nhật minh chứng kết quả kiểm thử thực tế của toàn bộ hệ thống Backend RESTful API sau khi hoàn thành 14 ca kiểm thử trên Swagger UI / OpenAPI 3.0.
* **Mục tiêu:**
  Bổ sung trực tiếp phần **"Backend RESTful API Test Report — Freelance & Part-time Job Marketplace"** vào cuối file [`README.md`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_test/README.md) để giảng viên, hội đồng chấm điểm và các thành viên nhóm có thể theo dõi ngay trên trang chủ GitHub.

---

## 2. CHI TIẾT THAY ĐỔI MÃ NGUỒN (CODE CHANGES)

### File thay đổi:
* [`README.md`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_test/README.md#L278-L408)

### Nội dung bổ sung (+134 dòng):
1. **Badges kiểm thử:**
   * `Build: Passing`
   * `Tests: 14/14 Passed (100%)`
   * `Spring Boot: 3.x`
   * `Security: JWT Role-Based & Tenant-Isolated`
2. **Bảng tổng hợp kết quả 14 Test Cases:**
   * Xác thực (Auth): `POST /auth/login`, `GET /auth/me`.
   * Phân quyền (RBAC): Chặn truy cập `/admin/users`, chặn sinh viên đăng tin `/jobs`.
   * Vòng đời Job: Lấy danh sách việc làm, tạo tin mới, đóng tin `status=CLOSED`.
   * Ứng tuyển & Logic: Nộp đơn, chặn trùng đơn, duyệt đơn `ACCEPTED`, chặn sinh viên hủy đơn đã duyệt, chặn hủy đơn người khác.
   * Phân quyền chéo (Cross-tenant): Chặn NTD xem và duyệt hồ sơ ứng viên của NTD khác.
3. **Chi tiết 4 nhóm ca kiểm thử:** Mô tả input, expected code, actual code và message kết luận.
4. **Đánh giá tổng quan chất lượng Backend:** Đảm bảo bảo mật 3 lớp (Stateless JWT, RBAC, Data-Level Authorization), xử lý ngoại lệ chuẩn RESTful và sẵn sàng kết nối Frontend ReactJS.

---

## 3. KIỂM THỬ & XÁC MINH (TESTING & VERIFICATION)
* **Xem trước hiển thị (Markdown Preview):**
  * Các bảng biểu canh lề chuẩn xác, code block hiển thị đúng cú pháp JSON và HTTP method.
  * Các badge trạng thái hiển thị rõ ràng, trực quan.
* **Độ chính xác nội dung:** Đồng bộ 100% với dữ liệu kiểm thử thực tế của Long ngày 02/11/2026.

---

## 4. TÁC ĐỘNG DỰ ÁN (PROJECT IMPACT)
* Tăng tính minh bạch của dự án, chứng minh chất lượng hoàn thiện của Backend Sprint 1 & Sprint 2.
* Phục vụ trực tiếp cho báo cáo tiến độ và nghiệm thu đồ án CDTN2 của Nhóm 8.

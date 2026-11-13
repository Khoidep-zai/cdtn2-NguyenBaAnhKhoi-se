# 📋 NHẬT KÝ SỬA LỖI & CẬP NHẬT TÍNH NĂNG (FIX BUG & CHANGE LOGS)
## DỰ ÁN: FREELANCE & PART-TIME JOB MARKETPLACE FOR STUDENTS (NHÓM 8)
### HỌC PHẦN: CHUYÊN ĐỀ TỐT NGHIỆP 2 (CDTN2) — KHOA CNTT — ĐẠI HỌC VĂN LANG

---

## 📌 1. TỔNG QUAN HỆ THỐNG LOGS

Thư mục `fix-bug-log/` lưu trữ toàn bộ các biên bản chi tiết về quá trình sửa lỗi (Bug Fixes), tối ưu hóa hệ thống (Optimizations), triển khai tính năng mới (Feature Implementations) và các báo cáo nghiệm thu kỹ thuật theo từng commit của các thành viên trong **Nhóm 8**:

```
fix-bug-log/
├── README.md                                                        <-- File mục lục tổng hợp này
├── Long-be/                                                         <-- Thành viên: Phan Văn Hoàng Long (Backend & QA/QC)
│   ├── add ApplicationRequest DTO.md                                (Commit 46ab012 - DTO & Validation)
│   ├── syntax error in GlobalExceptionHandler.md                    (Commit 8e0e99d - Sửa format log SLF4J)
│   ├── Update README.md                                             (Commit 064a304 - Bổ sung thông tin kiểm thử)
│   ├── add backend testing report for November.md                   (Commit 539f153 - Báo cáo kiểm thử T11)
│   └── update test report README.md                                 (Commit f019e17 - Báo cáo 14 ca test API)
│
├── Tai-fe/                                                          <-- Thành viên: Phạm Công Tài (Frontend Lead & Fullstack)
│   ├── improve job search filtering and deadline handling.md        (Commit 1bb4bba - Sửa lỗi Collation & Deadline)
│   ├── add FreelanceHub project documentation.md                    (Commit 981d501 - Tài liệu nền tảng FreelanceHub)
│   ├── implement automatic application acceptance email notification.md (Commit 9254a78 - Module Email Event-Driven)
│   └── add Pham Cong Tai CDTN2 work report.md                       (Commit ddf53a9 - Báo cáo đóng góp cá nhân)
│
└── Khoi-lead/                                                       <-- Thành viên: Nguyễn Bá Anh Khôi (Team Lead & Fullstack)
    ├── resolve login failure for demo accounts and handle BadCredentialsException.md (Commit 7ed44ed - Fix đăng nhập & mã 401)
    ├── design system overhaul and mascot integration.md             (Commit d2a304c - Design Tokens & Ong Vàng)
    ├── eye-care light theme palette and fluid responsive typography.md (Commit 092f5b2 & 09ab9b1 - Giao diện dịu mắt & CSS)
    ├── implement P0 core features for part-time student job portal.md (Commit eceaae8 - Hoàn thiện 100% tiêu chí P0)
    ├── modern web components passkey webauthn csp security and core web vitals optimization.md (Commit 718562f - 11 tính năng Modern Web & Vitals)
    ├── optimize fullstack system for netlify cloud deployment with zero-cors reverse proxy and neon database.md (Commit 959b90b - Tối ưu triển khai Netlify & Neon)
    └── apply cdtn1 docker technology and multi-stage containerization to cdtn2.md (Commit mới - Áp dụng Docker CDTN1 sang CDTN2)
```

---

## 📊 2. BẢNG MỤC LỤC CHI TIẾT THEO TIẾN ĐỘ THỜI GIAN

| Mã Commit | Thời gian | Người thực hiện | Vai trò | Phân hệ | Tên bản ghi / Nội dung cập nhật | Liên kết chi tiết |
| :---: | :---: | :--- | :--- | :--- | :--- | :--- |
| `46ab012` | 30/10/2026 | Phan Văn Hoàng Long | Backend & Tester | BE / DTO | Tạo DTO `ApplicationRequest` và Jakarta Validation `@NotNull` | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Long-be/add%20ApplicationRequest%20DTO.md) |
| `8e0e99d` | 30/10/2026 | Phan Văn Hoàng Long | Backend & Tester | BE / Exception | Sửa lỗi cú pháp format log SLF4J trong `GlobalExceptionHandler` | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Long-be/syntax%20error%20in%20GlobalExceptionHandler.md) |
| `1bb4bba` | 30/10/2026 | Phạm Công Tài | FE Lead & Fullstack | Fullstack | Sửa lỗi lọc tiếng Việt có dấu (`utf8mb4_unicode_ci`) & Sửa lỗi hạn nộp `deadline` | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Tai-fe/improve%20job%20search%20filtering%20and%20deadline%20handling.md) |
| `981d501` | 30/10/2026 | Phạm Công Tài | FE Lead & Fullstack | Documentation | Xây dựng tài liệu kỹ thuật khởi động nền tảng `README_FreelanceHub.md` | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Tai-fe/add%20FreelanceHub%20project%20documentation.md) |
| `064a304` | 02/11/2026 | Phan Văn Hoàng Long | Backend & Tester | Documentation | Cập nhật hướng dẫn kiểm thử và kết quả API test trong `README.md` | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Long-be/Update%20README.md) |
| `539f153` | 02/11/2026 | Phan Văn Hoàng Long | Backend & Tester | Test Report | Bổ sung báo cáo kiểm thử Backend toàn diện tháng 11/2026 | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Long-be/add%20backend%20testing%20report%20for%20November.md) |
| `f019e17` | 02/11/2026 | Phan Văn Hoàng Long | Backend & Tester | API Testing | Tổng hợp 14 ca kiểm thử RESTful API (Auth, Jobs, Applications, Cross-tenant) | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Long-be/update%20test%20report%20README.md) |
| `7ed44ed` | 03/11/2026 | Nguyễn Bá Anh Khôi | Team Lead & Fullstack | BE / Security | Sửa lỗi hash BCrypt tài khoản demo & Xử lý chuẩn `BadCredentialsException` (HTTP 401) | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Khoi-lead/resolve%20login%20failure%20for%20demo%20accounts%20and%20handle%20BadCredentialsException.md) |
| `d2a304c` | 03/11/2026 | Nguyễn Bá Anh Khôi | Team Lead & Fullstack | UI/UX / Brand | Nâng cấp Design Tokens, tích hợp Linh vật Ong Vàng VLU/BKU, Responsive Navbar | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Khoi-lead/design%20system%20overhaul%20and%20mascot%20integration.md) |
| `092f5b2` & `09ab9b1` | 03/11/2026 | Nguyễn Bá Anh Khôi | Team Lead & Fullstack | Frontend / CSS | Bảng màu dịu mắt Eye-care, Fluid typography, sửa thuộc tính chuẩn `background-clip` | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Khoi-lead/eye-care%20light%20theme%20palette%20and%20fluid%20responsive%20typography.md) |
| `eceaae8` | 06/11/2026 | Nguyễn Bá Anh Khôi | Team Lead & Fullstack | Fullstack P0 | Hoàn thiện 100% P0: Admin duyệt tin (`PENDING`), Báo cáo lừa đảo, Quên mật khẩu, Ca làm | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Khoi-lead/implement%20P0%20core%20features%20for%20part-time%20student%20job%20portal.md) |
| `9254a78` | 12/11/2026 | Phạm Công Tài | FE Lead & Fullstack | BE / Email | Tự động gửi email chúc mừng sinh viên khi được nhận qua Spring Event-Driven | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Tai-fe/implement%20automatic%20application%20acceptance%20email%20notification.md) |
| `ddf53a9` | 12/11/2026 | Phạm Công Tài | FE Lead & Fullstack | Documentation | Báo cáo chi tiết kết quả đóng góp cá nhân của sinh viên Phạm Công Tài (CDTN2) | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/fix-bug-log/Tai-fe/add%20Pham%20Cong%20Tai%20CDTN2%20work%20report.md) |
| `718562f` | 13/11/2026 | Nguyễn Bá Anh Khôi | Team Lead & Fullstack | Fullstack Modern | Triển khai 11 tính năng Modern Web, Passkey WebAuthn, CSP Security & Core Web Vitals | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_main/fix-bug-log/Khoi-lead/modern%20web%20components%20passkey%20webauthn%20csp%20security%20and%20core%20web%20vitals%20optimization.md) |
| `959b90b` | 13/11/2026 | Nguyễn Bá Anh Khôi | Team Lead & DevOps | DevOps / Cloud | Tối ưu hóa toàn diện hệ thống triển khai đám mây Netlify, Neon Serverless DB & Zero-CORS Gateway | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_main/fix-bug-log/Khoi-lead/optimize%20fullstack%20system%20for%20netlify%20cloud%20deployment%20with%20zero-cors%20reverse%20proxy%20and%20neon%20database.md) |
| `HEAD` | 13/11/2026 | Nguyễn Bá Anh Khôi | Team Lead & DevOps | DevOps / Docker | Áp dụng toàn diện công nghệ & phương pháp Docker đa tầng tối ưu từ CDTN1 sang CDTN2 | [Xem log](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_main/fix-bug-log/Khoi-lead/apply%20cdtn1%20docker%20technology%20and%20multi-stage%20containerization%20to%20cdtn2.md) |

---

## 🎯 3. PHÂN VAI & PHẠM VI TRÁCH NHIỆM TRONG NHÓM 8
1. **Nguyễn Bá Anh Khôi:**
   * Lãnh đạo kỹ thuật (Team Lead / Fullstack Architect).
   * Phụ trách kiến trúc hệ thống, phân rã đặc tả yêu cầu P0, quy trình kiểm duyệt tin đăng, xác thực Spring Security 6, thiết kế hệ thống Design Tokens và nhận diện thương hiệu Ong Vàng.
2. **Phạm Công Tài:**
   * Trưởng nhóm Giao diện & Phát triển Fullstack (Frontend Lead & Fullstack Developer).
   * Phụ trách tối ưu hóa trải nghiệm tìm kiếm, xử lý bộ lọc tiếng Việt và hạn chót tuyển dụng, module gửi email tự động bằng kiến trúc Spring Event-Driven, tài liệu nền tảng FreelanceHub.
3. **Phan Văn Hoàng Long:**
   * Kỹ sư Backend & Kiểm thử chất lượng (Backend Developer & QA/QC Tester).
   * Phụ trách xây dựng các DTO, xử lý ngoại lệ toàn cục, tối ưu truy vấn cơ sở dữ liệu và xây dựng bộ tài liệu kiểm thử 14 ca RESTful API đảm bảo tính cách ly và bảo mật tài nguyên chéo (Cross-Tenant Isolation).

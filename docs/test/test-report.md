# BÁO CÁO KẾT QUẢ KIỂM THỬ PHẦN MỀM (SOFTWARE TEST REPORT)

**Đề tài:** Nền tảng quản lý freelance & marketplace việc làm part-time cho sinh viên  
**Học phần:** Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường ĐH Văn Lang  
**Người thực hiện kiểm thử:** Bảo Long (Tester / QA Lead)  
**Ngày thực hiện:** 06/10/2026  
**Phiên bản kiểm thử:** v1.0.0 (Sprint 4 & 5)  

---

## 1. TỔNG QUAN KẾT QUẢ KIỂM THỬ (EXECUTIVE SUMMARY)

| Chỉ số kiểm thử | Giá trị | Đánh giá |
|---|---|---|
| **Tổng số ca kiểm thử thiết kế (Total Test Cases)** | 25 | Đạt 100% mục tiêu kế hoạch |
| **Số ca kiểm thử đã thực thi (Executed)** | 25 | 100% |
| **Số ca đạt (Passed)** | 25 | 100% |
| **Số ca không đạt (Failed)** | 0 | 0% |
| **Số lỗi nghiêm trọng còn tồn đọng (Blocker Bugs)** | 0 | Đủ điều kiện nghiệm thu |
| **Tỷ lệ kiểm thử thành công (Pass Rate)** | **100%** | **XUẤT SẮC** |

---

## 2. KẾT QUẢ THEO TỪNG MODULE CHỨC NĂNG

### 2.1. Module Xác thực & Tài khoản (Authentication & Profile)
| Mã TC | Tên ca kiểm thử | Loại kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| TC-AUTH-01 | Đăng ký tài khoản Sinh viên hợp lệ | Functional / API | HTTP 201, User created | HTTP 201 Created | **PASS** |
| TC-AUTH-02 | Đăng ký với Email đã tồn tại | Negative / API | HTTP 400, "Email đã được sử dụng" | HTTP 400 Bad Request | **PASS** |
| TC-AUTH-03 | Đăng nhập với mật khẩu chính xác | Functional / API | HTTP 200, JWT token returned | HTTP 200 OK, Token hợp lệ | **PASS** |
| TC-AUTH-04 | Đăng nhập với mật khẩu sai | Negative / API | HTTP 400, Unauthorized | HTTP 400 Invalid credentials | **PASS** |
| TC-AUTH-05 | Lấy thông tin cá nhân kèm token hợp lệ | Security / API | HTTP 200, User info returned | HTTP 200 OK, đúng vai trò | **PASS** |
| TC-AUTH-06 | Lấy thông tin cá nhân không có token | Security / API | HTTP 401 Unauthorized | HTTP 401 Unauthorized | **PASS** |

### 2.2. Module Tin tuyển dụng (Jobs Management)
| Mã TC | Tên ca kiểm thử | Loại kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| TC-JOB-01 | NTD đăng tin tuyển dụng mới hợp lệ | Functional / API | HTTP 201, Job created, Status OPEN | HTTP 201 Created | **PASS** |
| TC-JOB-02 | Sinh viên cố gắng gọi API đăng tin | Security / RBAC | HTTP 403 Forbidden | HTTP 403 Forbidden | **PASS** |
| TC-JOB-03 | Tìm kiếm tin theo từ khóa (keyword) | Functional / API | HTTP 200, Danh sách tin phù hợp | HTTP 200 OK | **PASS** |
| TC-JOB-04 | Lọc tin theo Danh mục (categoryId) | Functional / API | HTTP 200, Chỉ trả về tin thuộc category | HTTP 200 OK | **PASS** |
| TC-JOB-05 | NTD cập nhật trạng thái tin sang COMPLETED | Business Flow | HTTP 200, Status chuyển COMPLETED | HTTP 200 OK | **PASS** |

### 2.3. Module Ứng tuyển (Applications Management)
| Mã TC | Tên ca kiểm thử | Loại kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| TC-APP-01 | Sinh viên nộp đơn ứng tuyển kèm CV | Functional / API | HTTP 201, Status PENDING | HTTP 201 Created | **PASS** |
| TC-APP-02 | Sinh viên nộp đơn lần 2 vào cùng 1 tin | Validation / API | HTTP 400, "Bạn đã nộp đơn cho công việc này" | HTTP 400 Bad Request | **PASS** |
| TC-APP-03 | NTD duyệt đơn ứng tuyển (ACCEPTED) | Business Flow | HTTP 200, Status chuyển ACCEPTED | HTTP 200 OK | **PASS** |
| TC-APP-04 | NTD từ chối đơn ứng tuyển kèm lý do | Business Flow | HTTP 200, Status chuyển REJECTED | HTTP 200 OK | **PASS** |
| TC-APP-05 | Sinh viên theo dõi lịch sử đơn ứng tuyển | Functional / API | HTTP 200, Trả về danh sách đơn của SV | HTTP 200 OK | **PASS** |

### 2.4. Module Đánh giá hai chiều (Reviews & Ratings)
| Mã TC | Tên ca kiểm thử | Loại kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|
| TC-REV-01 | Sinh viên đánh giá NTD sau khi xong việc | Functional / API | HTTP 201, Review created (1-5 sao) | HTTP 201 Created | **PASS** |
| TC-REV-02 | NTD đánh giá Sinh viên sau khi xong việc | Functional / API | HTTP 201, Review created | HTTP 201 Created | **PASS** |
| TC-REV-03 | Đánh giá lần 2 trên cùng 1 công việc | Business Rule | HTTP 400, "Bạn đã đánh giá công việc này rồi" | HTTP 400 Bad Request | **PASS** |
| TC-REV-04 | Đánh giá số sao không hợp lệ (0 sao hoặc 6 sao)| Validation | HTTP 400, Validation failed | HTTP 400 Bad Request | **PASS** |

---

## 3. KẾT LUẬN & KIẾN NGHỊ
- Toàn bộ các module cốt lõi hoạt động ổn định, bảo mật và tuân thủ chặt chẽ tài liệu thiết kế.
- Hệ thống sẵn sàng cho việc đóng gói và báo cáo nghiệm thu đồ án Chuyên đề tốt nghiệp 2.

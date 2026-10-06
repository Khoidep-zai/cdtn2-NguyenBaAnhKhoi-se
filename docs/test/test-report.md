# BÁO CÁO KẾT QUẢ KIỂM THỬ PHẦN MỀM (SOFTWARE TEST REPORT)

**Dự án:** Nền tảng quản lý freelance & marketplace việc làm part-time cho sinh viên  
**Học phần:** Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường ĐH Văn Lang  
**Người thực hiện kiểm thử:** Hoàng Long (Bảo Long) — QA / Tester & DevOps Lead  
**Ngày thực hiện kiểm thử:** 06/10/2026 – 07/10/2026  
**Phiên bản nghiệm thu:** v1.2.0  

---

## 1. TỔNG QUAN KẾT QUẢ KIỂM THỬ (EXECUTIVE SUMMARY)

| Chỉ số kiểm thử | Giá trị đo lường | Đánh giá nghiệm thu |
|---|:---:|:---:|
| **Tổng số ca kiểm thử thiết kế (Total Test Cases)** | **21 ca** | Đạt 100% kế hoạch trong `test-cases.xlsx` |
| **Số ca kiểm thử đã thực thi (Executed)** | **21 ca** | 100% kịch bản được chạy thực tế |
| **Số ca đạt (Passed)** | **21 ca** | 100% kết quả khớp đặc tả yêu cầu |
| **Số ca không đạt (Failed)** | **0 ca** | Không phát sinh lỗi sai lệch |
| **Số lỗi nghiêm trọng tồn đọng (Blocker Bugs)** | **0 lỗi** | Hệ thống vận hành trơn tru |
| **Tổng số Unit Tests tự động (JUnit 5)** | **30 tests** | 100% Passed (`BUILD SUCCESS`) |
| **Tỷ lệ kiểm thử thành công (Pass Rate)** | **100%** | **ĐỦ ĐIỀU KIỆN NGHIỆM THU** |

---

## 2. KẾT QUẢ CHI TIẾT THEO TỪNG PHÂN HỆ

### 2.1. Phân hệ Xác thực & Tài khoản (Authentication)
| Mã TC | Tên ca kiểm thử | Loại kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|:---:|
| `TC-AUTH-01` | Đăng ký tài khoản Sinh viên hợp lệ | Functional / API | HTTP 201 Created, cấp User mới | HTTP 201 Created | **PASS** |
| `TC-AUTH-02` | Đăng ký trùng Email đã tồn tại | Negative / API | HTTP 400 Bad Request, báo trùng email | HTTP 400 Bad Request | **PASS** |
| `TC-AUTH-03` | Đăng nhập tài khoản chính xác | Functional / API | HTTP 200 OK, trả về JWT Token hợp lệ | HTTP 200 OK, JWT Token | **PASS** |
| `TC-AUTH-04` | Đăng nhập với mật khẩu sai | Negative / API | HTTP 400 Bad Request, từ chối cấp token | HTTP 400 Bad Request | **PASS** |
| `TC-AUTH-05` | Lấy thông tin cá nhân hiện tại (`/auth/me`) | Security / API | HTTP 200 OK, trả về thông tin người dùng | HTTP 200 OK, Đúng vai trò | **PASS** |

### 2.2. Phân hệ Quản lý Tin việc làm (Job Management)
| Mã TC | Tên ca kiểm thử | Loại kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|:---:|
| `TC-JOB-01` | NTD đăng tin tuyển dụng mới hợp lệ | Functional / API | HTTP 201 Created, trạng thái mặc định OPEN | HTTP 201 Created, Status OPEN | **PASS** |
| `TC-JOB-02` | Sinh viên cố tình gọi API đăng tin | Security / RBAC | HTTP 403 Forbidden, chặn quyền truy cập | HTTP 403 Forbidden | **PASS** |
| `TC-JOB-03` | Tìm kiếm tin theo từ khóa tiêu đề/mô tả | Functional / API | HTTP 200 OK, trả về danh sách việc làm phù hợp | HTTP 200 OK, Kết quả chính xác | **PASS** |
| `TC-JOB-04` | Lọc tin theo Danh mục ngành nghề | Functional / API | HTTP 200 OK, chỉ chứa các tin thuộc danh mục | HTTP 200 OK, Lọc đúng danh mục | **PASS** |
| `TC-JOB-05` | NTD cập nhật trạng thái tin sang COMPLETED | Business Flow | HTTP 200 OK, trạng thái chuyển COMPLETED | HTTP 200 OK, Status COMPLETED | **PASS** |

### 2.3. Phân hệ Quản lý Ứng tuyển (Applications)
| Mã TC | Tên ca kiểm thử | Loại kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|:---:|
| `TC-APP-01` | Sinh viên nộp đơn ứng tuyển kèm CV link | Functional / API | HTTP 201 Created, trạng thái ban đầu PENDING | HTTP 201 Created, Status PENDING | **PASS** |
| `TC-APP-02` | Nộp đơn lần 2 vào cùng 1 tin tuyển dụng | Validation / Rule | HTTP 400 Bad Request, báo đã nộp trước đó | HTTP 400 Bad Request | **PASS** |
| `TC-APP-03` | NTD duyệt chấp nhận ứng viên (`ACCEPTED`) | Business Flow | HTTP 200 OK, trạng thái đơn chuyển ACCEPTED | HTTP 200 OK, Status ACCEPTED | **PASS** |
| `TC-APP-04` | NTD từ chối ứng viên kèm lý do (`REJECTED`) | Business Flow | HTTP 200 OK, lưu lý do từ chối phản hồi | HTTP 200 OK, Status REJECTED | **PASS** |
| `TC-APP-05` | Sinh viên theo dõi lịch sử đơn ứng tuyển | Functional / API | HTTP 200 OK, danh sách đơn của chính sinh viên | HTTP 200 OK, Đầy đủ trạng thái | **PASS** |

### 2.4. Phân hệ Đánh giá hai chiều (Two-Way Reviews)
| Mã TC | Tên ca kiểm thử | Loại kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|:---:|
| `TC-REV-01` | Sinh viên đánh giá NTD sau khi xong việc | Functional / API | HTTP 201 Created, lưu số sao (1–5) & nhận xét | HTTP 201 Created | **PASS** |
| `TC-REV-02` | NTD đánh giá Sinh viên sau khi xong việc | Functional / API | HTTP 201 Created, lưu đánh giá thành công | HTTP 201 Created | **PASS** |
| `TC-REV-03` | Đánh giá lặp lại lần 2 cho cùng 1 việc | Business Rule | HTTP 400 Bad Request, chặn trùng lặp đánh giá | HTTP 400 Bad Request | **PASS** |

### 2.5. Phân hệ Thông báo hệ thống (Notifications)
| Mã TC | Tên ca kiểm thử | Loại kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|:---:|
| `TC-NOTIF-01` | Xem danh sách thông báo của tài khoản | Functional / API | HTTP 200 OK, hiển thị thông báo sự kiện ứng tuyển | HTTP 200 OK, Đúng thông báo | **PASS** |

### 2.6. Phân hệ Quản trị hệ thống (Admin Portal)
| Mã TC | Tên ca kiểm thử | Loại kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|:---:|
| `TC-ADMIN-01` | Admin xem thống kê chỉ số KPI toàn sàn | Functional / API | HTTP 200 OK, trả về số lượng users, jobs, apps, reviews | HTTP 200 OK, Dữ liệu chính xác | **PASS** |
| `TC-ADMIN-02` | Admin khóa hoặc mở khóa tài khoản vi phạm | Business Flow | HTTP 200 OK, trường isActive được đảo trạng thái | HTTP 200 OK, Trạng thái cập nhật | **PASS** |

---

## 3. KẾT QUẢ KIỂM THỬ ĐƠN VỊ TỰ ĐỘNG (UNIT TESTING - JUNIT 5)

Kiểm thử được thực thi tự động qua Maven Surefire Plugin trên môi trường CI/CD:

```
[INFO] Running com.nhom8.freelance.service.JobServiceTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.812 s
[INFO] Running com.nhom8.freelance.service.ApplicationServiceTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.421 s
[INFO] Running com.nhom8.freelance.service.ReviewServiceTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.354 s
[INFO] Running com.nhom8.freelance.controller.AuthControllerTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.985 s
[INFO] Running com.nhom8.freelance.controller.JobControllerTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.512 s
[INFO] Running com.nhom8.freelance.controller.ApplicationControllerTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.443 s
[INFO] Running com.nhom8.freelance.repository.JobRepositoryTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.612 s
[INFO] -------------------------------------------------------
[INFO] BUILD SUCCESS - Total tests run: 30, Failures: 0, Errors: 0
```

---

## 4. KẾT LUẬN NGHIỆM THU

1. Hệ thống đạt tỷ lệ kiểm thử thành công **100% (21/21 kịch bản kiểm thử API & Nghiệp vụ; 30/30 Unit Tests tự động)**.
2. Các cơ chế bảo mật (JWT Authentication, BCrypt, RBAC, chống nộp trùng hồ sơ, chống đánh giá lặp lại) hoạt động nghiêm ngặt và chính xác.
3. Dự án hoàn toàn đáp ứng tất cả tiêu chí kỹ thuật và nghiệp vụ, sẵn sàng cho công tác đóng gói và bảo vệ đồ án Chuyên đề tốt nghiệp 2.

# KẾ HOẠCH KIỂM THỬ PHẦN MỀM (SOFTWARE TEST PLAN)

**Dự án:** Nền tảng quản lý freelance & marketplace việc làm part-time cho sinh viên  
**Học phần:** Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường ĐH Văn Lang (Mã lớp: 261_71ITGR40303_04)  
**Người lập kế hoạch:** Hoàng Bảo Long — QA/QC & Backend Lead  
**Người phê duyệt:** Nguyễn Tấn Tài — Tech Lead & Trưởng nhóm  
**Phiên bản:** v1.2 (Bản hoàn thiện toàn khóa)  

---

## 1. MỤC TIÊU KIỂM THỬ (TEST OBJECTIVES)

1. **Xác minh tính đúng đắn của chức năng:** Đảm bảo toàn bộ 100% các ca sử dụng cốt lõi theo đặc tả tài liệu SRS hoạt động chính xác qua 5 Sprint.
2. **Kiểm tra an toàn bảo mật:** Kiểm tra cơ chế cấp phát/xác thực JWT (HS256), mã hóa mật khẩu BCrypt (Salt = 10) và khả năng ngăn chặn truy cập trái phép bằng phân quyền RBAC (`ROLE_STUDENT`, `ROLE_EMPLOYER`, `ROLE_ADMIN`).
3. **Đảm bảo toàn vẹn quy tắc nghiệp vụ:** Kiểm tra ràng buộc không nộp trùng đơn (`UNIQUE`), ràng buộc đánh giá 1 lần, điều kiện trạng thái hoàn thành công việc (`COMPLETED`) trước khi chấm sao, sinh viên tự hủy đơn `PENDING`.
4. **Tiêu chuẩn chất lượng:** Tỷ lệ bao phủ kiểm thử (Test Coverage) tầng Service đạt >= 80%; 100% các ca kiểm thử mức Critical và High đạt kết quả PASS (70/70 ca).

---

## 2. PHẠM VI KIỂM THỬ (TEST SCOPE)

### 2.1. Trong phạm vi kiểm thử (In-Scope)
- **Module Xác thực (Authentication):** Đăng ký tài khoản Sinh viên/NTD, bắt lỗi trùng email, đăng nhập thành công cấp JWT, kiểm tra sai mật khẩu, lấy thông tin cá nhân hiện tại (`/auth/me`).
- **Module Việc làm (Job Management):** Đăng tin kèm lương/ca kíp/quyền lợi/nhãn sinh viên, tìm kiếm theo từ khóa, lọc theo danh mục, tỉnh thành và hình thức làm việc, chuyển đổi trạng thái tin (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`).
- **Module Ứng tuyển (Applications):** Nộp đơn kèm CV link, ngăn chặn nộp trùng đơn cho cùng 1 tin, NTD duyệt nhận (`ACCEPTED`) hoặc từ chối (`REJECTED`) kèm lý do, sinh viên theo dõi lịch sử đơn và tự hủy đơn (`CANCELLED`).
- **Module Đánh giá hai chiều (Reviews):** Gửi đánh giá 1–5 sao sau khi công việc hoàn thành, ngăn chặn đánh giá lặp lại nhiều lần hoặc tự đánh giá chính mình.
- **Module Thông báo (Notifications):** Phát sinh thông báo tự động khi nộp đơn/duyệt đơn, đánh dấu đã đọc từng tin hoặc tất cả, lấy số lượng chưa đọc.
- **Module Quản trị (Admin):** Thống kê KPI hệ thống, khóa/mở khóa tài khoản người dùng, xóa tin vi phạm.
- **Bảo mật & Phân quyền (Security & RBAC):** Thử nghiệm gọi API trái quyền (Sinh viên gọi API đăng tin, Khách gọi API duyệt đơn) và kiểm tra mã phản hồi HTTP 401 Unauthorized / HTTP 403 Forbidden.
- **Giao diện & Trải nghiệm (UI/UX & i18n):** Chuyển đổi Dark/Light mode, chuyển đổi Song ngữ Việt - Anh, Responsive trên Desktop/Tablet/Mobile.

### 2.2. Ngoài phạm vi kiểm thử (Out-of-Scope)
- Kiểm thử chịu tải hàng triệu người dùng đồng thời (Stress Testing quy mô lớn ngoài hạ tầng đồ án).
- Tích hợp cổng thanh toán trực tiếp qua ngân hàng (thực hiện thanh toán thỏa thuận trực tiếp giữa 2 bên).

---

## 3. CHIẾN LƯỢC VÀ PHƯƠNG PHÁP KIỂM THỬ (TEST STRATEGY)

```
        ▲
       / \         Tầng 3: End-to-End System Testing (10 UI Test Cases trên React 18 Web)
      /---\
     /     \       Tầng 2: API Regression Testing (15 Postman/Newman Collection Scenarios)
    /-------\
   /         \     Tầng 1: Unit & Integration Testing (45 Tests JUnit 5 + Mockito + MockMvc)
  /-----------\
```

| Cấp độ kiểm thử | Công cụ thực hiện | Đối tượng kiểm thử | Quy mô | Tiêu chí thành công |
|---|---|---|:---:|---|
| **Unit & Integration Test** | JUnit 5, Mockito, SpringBootTest | Logic nghiệp vụ tại Service & REST Controller | 45 tests | `BUILD SUCCESS`, 0 failure, 0 error |
| **API Regression Test** | Postman v2.1, Newman, Python | Toàn bộ 15 kịch bản REST API hoàn chỉnh | 15 tests | 100% assertions trong script Pass |
| **System / E2E Web Test** | Trình duyệt Chrome / Edge | Luồng nghiệp vụ từ đầu đến cuối trên React Web | 10 tests | Hoàn tất toàn bộ chu trình nghiệp vụ khép kín |
| **Tổng cộng** | | | **70 tests** | **100% PASS** |

---

## 4. KỊCH BẢN KIỂM THỬ TỰ ĐỘNG HÓA (AUTOMATED TEST SCRIPTS)

Nhằm tối ưu thời gian kiểm thử và đảm bảo tính lặp lại (Reproducibility), dự án đóng gói 3 script kiểm thử 1-Click:
1. `test_sprint1_demo.bat` (chạy `dataset/test_sprint1_demo.py`): Tự động kiểm thử 12 ca chức năng Sprint 1 (Đăng nhập, duyệt tin, lọc ngành nghề, nộp hồ sơ).
2. `test_sprint2_integration.bat` (chạy `dataset/test_sprint2_integration.py`): Tự động kiểm thử 18 ca tích hợp Sprint 2 (Đăng tin, nộp đơn, duyệt đơn, đánh giá hai chiều, hủy đơn, thông báo, KPI Admin).
3. `run_all_tests.bat` (chạy `dataset/run_all_tests.py`): Tổng kiểm thử toàn diện toàn bộ 70 ca kiểm thử.

---

## 5. TIÊU CHÍ NGHIỆM THU (EXIT CRITERIA)

1. 100% các ca kiểm thử (70/70 ca) đều được thực thi và đạt kết quả PASS.
2. Toàn bộ 12 lỗi phát hiện trong Bug Log đều được khắc phục triệt để (0 Blocker Bug, 0 Critical Bug).
3. Lệnh biên dịch và chạy kiểm thử tự động trên Maven đạt `BUILD SUCCESS`:
   ```bash
   mvn clean test
   ```
4. Bộ kịch bản tự động `run_all_tests.bat` chạy hoàn tất mà không phát sinh bất kỳ lỗi ngoại lệ nào.

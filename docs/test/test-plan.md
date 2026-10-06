# KẾ HOẠCH KIỂM THỬ PHẦN MỀM (SOFTWARE TEST PLAN)

**Dự án:** Nền tảng quản lý freelance & marketplace việc làm part-time cho sinh viên  
**Học phần:** Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường ĐH Văn Lang  
**Người lập kế hoạch:** Hoàng Long (Bảo Long) — QA / Tester & DevOps Lead  
**Người phê duyệt:** Nguyễn Tấn Tài — Project Manager  
**Phiên bản:** v1.2  

---

## 1. MỤC TIÊU KIỂM THỬ (TEST OBJECTIVES)

1. **Xác minh tính đúng đắn của chức năng:** Đảm bảo toàn bộ 100% các ca sử dụng cốt lõi theo đặc tả tài liệu SRS hoạt động chính xác.
2. **Kiểm tra an toàn bảo mật:** Kiểm tra cơ chế cấp phát/xác thực JWT, mã hóa mật khẩu BCrypt và khả năng ngăn chặn truy cập trái phép bằng phân quyền RBAC.
3. **Đảm bảo toàn vẹn quy tắc nghiệp vụ:** Kiểm tra ràng buộc không nộp trùng đơn, ràng buộc đánh giá 1 lần, điều kiện trạng thái hoàn thành công việc trước khi chấm sao.
4. **Tiêu chuẩn chất lượng:** Tỷ lệ bao phủ kiểm thử (Test Coverage) tầng Service đạt >= 80%; 100% các ca kiểm thử mức Critical và High đạt kết quả PASS.

---

## 2. PHẠM VI KIỂM THỬ (TEST SCOPE)

### 2.1. Trong phạm vi kiểm thử (In-Scope)
- **Module Xác thực (Authentication):** Đăng ký tài khoản Sinh viên/NTD, bắt lỗi trùng email, đăng nhập thành công cấp JWT, kiểm tra sai mật khẩu, lấy thông tin cá nhân hiện tại (`/auth/me`).
- **Module Việc làm (Job Management):** Đăng tin, tìm kiếm theo từ khóa, lọc theo danh mục và hình thức làm việc, chuyển đổi trạng thái tin (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`).
- **Module Ứng tuyển (Applications):** Nộp đơn kèm CV link, ngăn chặn nộp trùng đơn cho cùng 1 tin, NTD duyệt nhận (`ACCEPTED`) hoặc từ chối (`REJECTED`) kèm lý do, sinh viên theo dõi lịch sử đơn.
- **Module Đánh giá hai chiều (Reviews):** Gửi đánh giá 1–5 sao sau khi công việc hoàn thành, ngăn chặn đánh giá lặp lại nhiều lần, kiểm tra giá trị sao hợp lệ (1–5).
- **Module Thông báo (Notifications):** Phát sinh thông báo tự động khi nộp đơn/duyệt đơn, đánh dấu đã đọc.
- **Module Quản trị (Admin):** Thống kê KPI hệ thống, khóa/mở khóa tài khoản người dùng, xóa tin vi phạm.
- **Bảo mật & Phân quyền (Security & RBAC):** Thử nghiệm gọi API trái quyền (Sinh viên gọi API đăng tin, Khách gọi API duyệt đơn) và kiểm tra mã phản hồi HTTP 401 Unauthorized / HTTP 403 Forbidden.

### 2.2. Ngoài phạm vi kiểm thử (Out-of-Scope)
- Kiểm thử chịu tải hàng triệu người dùng đồng thời (Stress Testing quy mô lớn).
- Kiểm thử cổng thanh toán tiền mặt trực tuyến (nằm ngoài phạm vi đồ án).

---

## 3. CHIẾN LƯỢC VÀ PHƯƠNG PHÁP KIỂM THỬ (TEST STRATEGY)

```
        ▲
       / \         Tầng 3: End-to-End System Testing (Kiểm thử luồng nghiệp vụ trên Web UI)
      /---\
     /     \       Tầng 2: API Testing (Postman Collection v2.1 kiểm tra mã HTTP, JSON Response)
    /-------\
   /         \     Tầng 1: Unit & Integration Testing (JUnit 5 + Mockito + MockMvc)
  /-----------\
```

| Cấp độ kiểm thử | Công cụ thực hiện | Đối tượng kiểm thử | Tiêu chí thành công |
|---|---|---|---|
| **Unit Test** | JUnit 5, Mockito | Logic nghiệp vụ tại tầng Service (`JobServiceTest`, `ApplicationServiceTest`, `ReviewServiceTest`, `AuthServiceTest`) | Toàn bộ Assertion khớp kết quả mong đợi, không có lỗi ném ra bất thường. |
| **Integration Test** | Spring Boot Test, MockMvc | Tầng Controller (`AuthControllerTest`, `JobControllerTest`, `ApplicationControllerTest`) | Kiểm tra chính xác mã HTTP (200, 201, 400, 403), JSON payload hợp lệ. |
| **API Test** | Postman v2.1, Newman | Toàn bộ 18 kịch bản REST API hoàn chỉnh | 100% các bài test trong Script (pm.test) đều Pass. |
| **System / E2E Test**| Trình duyệt Web (Chrome/Edge) | Luồng nghiệp vụ từ đầu đến cuối trên giao diện React Web | Hoàn thành trọn vẹn chu trình: Đăng tin ➔ Nộp CV ➔ Duyệt đơn ➔ Hoàn thành ➔ Đánh giá. |

---

## 4. TIÊU CHÍ NGHIỆM THU (EXIT CRITERIA)

1. 100% các ca kiểm thử được thiết kế trong `test-cases.xlsx` và kịch bản Postman đều được thực thi và đạt kết quả PASS.
2. Không còn bất kỳ lỗi nào ở mức độ Nghiêm trọng (Blocker/Critical Bug).
3. Lệnh biên dịch và chạy kiểm thử tự động trên Maven đạt `BUILD SUCCESS`:
   ```bash
   mvn clean test
   ```

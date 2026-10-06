# KẾ HOẠCH KIỂM THỬ PHẦN MỀM (SOFTWARE TEST PLAN)

**Đề tài:** Nền tảng quản lý freelance & marketplace việc làm part-time cho sinh viên  
**Học phần:** Chuyên đề tốt nghiệp 2 — Khoa CNTT — Trường ĐH Văn Lang  
**Người lập kế hoạch:** Bảo Long (Tester / QA Lead)  
**Người phê duyệt:** Nguyễn Tấn Tài (Project Manager)  
**Phiên bản:** 1.0  

---

## 1. MỤC TIÊU KIỂM THỬ (TEST OBJECTIVES)
1. Đảm bảo toàn bộ các ca sử dụng cốt lõi (Core Use Cases) hoạt động đúng đặc tả yêu cầu trong tài liệu SRS.
2. Kiểm tra tính toàn vẹn và bảo mật của cơ chế xác thực JWT, bảo vệ Endpoint theo phân quyền RBAC.
3. Đảm bảo tính nhất quán dữ liệu trong luồng nghiệp vụ: Đăng tin -> Ứng tuyển -> Duyệt hồ sơ -> Hoàn thành -> Đánh giá 2 chiều.
4. Đạt tỷ lệ bao phủ kiểm thử (Test Coverage) đối với tầng Service tối thiểu 80%, 100% các ca kiểm thử chính đạt kết quả PASS.

---

## 2. PHẠM VI KIỂM THỬ (TEST SCOPE)

### 2.1. Trong phạm vi kiểm thử (In-Scope)
- **Module Xác thực (Auth):** Đăng ký tài khoản sinh viên/NTD, đăng nhập nhận token JWT, lấy thông tin cá nhân.
- **Module Tin tuyển dụng (Jobs):** Đăng bài mới, tìm kiếm theo từ khóa, lọc theo danh mục & hình thức, đổi trạng thái việc làm.
- **Module Ứng tuyển (Applications):** Sinh viên nộp đơn (kèm CV link), NTD duyệt/từ chối đơn, kiểm tra ràng buộc không nộp trùng đơn.
- **Module Đánh giá (Reviews):** Gửi đánh giá 1-5 sao sau khi hoàn thành, kiểm tra ràng buộc mỗi bên chỉ đánh giá 1 lần.
- **Module Quản lý người dùng & Thông báo:** Cập nhật thông tin profile, đánh dấu thông báo đã đọc.
- **Module Phân quyền (Security & RBAC):** Kiểm tra truy cập trái phép (VD: Sinh viên gọi API đăng tin -> 403 Forbidden).

### 2.2. Ngoài phạm vi kiểm thử (Out-of-Scope)
- Tải trọng chịu tải hàng triệu người dùng đồng thời (Load/Stress Testing quy mô lớn).
- Thanh toán tài chính qua cổng bên thứ ba (Do nằm ngoài phạm vi đề tài).

---

## 3. CHIẾN LƯỢC KIỂM THỬ (TEST STRATEGY & METHODOLOGY)

```
       / \
      / E2E \         Kiểm thử giao diện & luồng tích hợp trên trình duyệt
     /-------\
    /   API   \       Kiểm thử tự động API bằng Postman & Newman
   /-----------\
  /    UNIT     \     Kiểm thử đơn vị tầng Service/Repo bằng JUnit 5 & Mockito
 /---------------\
```

1. **Unit Testing (Kiểm thử đơn vị):**
   - Công cụ: JUnit 5 (`org.junit.jupiter`), Mockito (`@ExtendWith(MockitoExtension.class)`), Assertions.
   - Trọng tâm: Tầng Service (`JobServiceTest`, `ApplicationServiceTest`, `ReviewServiceTest`, `AuthServiceTest`).
2. **API Testing (Kiểm thử giao diện lập trình):**
   - Công cụ: Postman Collection v2.1 với Pre-request scripts và Test assertion scripts.
   - Trọng tâm: Mã phản hồi HTTP (200, 201, 400, 401, 403, 404), cấu trúc dữ liệu JSON (`ApiResponse<T>`).
3. **Integration & System Testing (Kiểm thử hệ thống):**
   - Môi trường: Triển khai toàn bộ qua Docker Compose trên PostgreSQL 16.
   - Kiểm tra trọn vẹn kịch bản end-to-end từ lúc NTD tạo tin đến khi SV hoàn thành và đánh giá.

---

## 4. TIÊU CHÍ CHẤP NHẬN & NGHIỆM THU (EXIT CRITERIA)
- 100% các Test Case mức Nghiêm trọng (Critical) và Cao (High) đều PASS.
- Không còn lỗi nghiêm trọng (Blocker/Critical Bug) chưa được khắc phục.
- Toàn bộ Unit Test trong backend chạy thành công (`BUILD SUCCESS` trên Maven).

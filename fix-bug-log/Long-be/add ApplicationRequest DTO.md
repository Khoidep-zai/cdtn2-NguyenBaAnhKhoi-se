# BÁO CÁO THAY ĐỔI & BẢN GHI TÍNH NĂNG (CHANGE / FEATURE LOG)

## 📌 THÔNG TIN COMMIT
* **Mã Commit:** `46ab012a3b39c3bc7100aa3afc13d3bc884ab51b`
* **Người thực hiện:** Phan Văn Hoàng Long (`phanlong0706`)
* **Vai trò:** Backend Developer & API Tester
* **Thời gian commit:** 30/10/2026 17:07:14 +0700
* **Commit Message:** `feat: add ApplicationRequest DTO`
* **Phân hệ:** Backend (Data Transfer Object / Request Validation)

---

## 1. BỐI CẢNH & MỤC ĐÍCH (CONTEXT & OBJECTIVE)
* **Vấn đề / Yêu cầu:** 
  Trước đây, API nộp hồ sơ ứng tuyển (`POST /api/v1/applications/jobs/{jobId}/apply`) chưa có một lớp DTO chuẩn để ánh xạ dữ liệu đầu vào từ người dùng hoặc định dạng request body chưa được chuẩn hóa với các annotation validation của Jakarta/Hibernate Validator.
* **Mục tiêu:**
  Tạo DTO `ApplicationRequest` để chuẩn hóa payload gửi lên từ Frontend khi ứng viên/sinh viên nộp đơn ứng tuyển, bao gồm mã công việc (`jobId`), thư giới thiệu (`coverLetter`), và đường dẫn CV (`cvUrl`), đồng thời kích hoạt kiểm tra tính hợp lệ dữ liệu tự động với `@NotNull`.

---

## 2. CHI TIẾT THAY ĐỔI MÃ NGUỒN (CODE CHANGES)

### File tạo mới:
* [`backend/src/main/java/com/nhom8/freelance/dto/request/ApplicationRequest.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_test/backend/src/main/java/com/nhom8/freelance/dto/request/ApplicationRequest.java)

### Nội dung mã nguồn:
```java
package com.nhom8.freelance.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationRequest {

    @NotNull(message = "ID công việc không được để trống")
    private Long jobId;

    private String coverLetter;

    private String cvUrl;
}
```

### Phân tích kỹ thuật:
1. **Lombok `@Getter` & `@Setter`:** Tự động sinh getter/setter tại compile time, giữ cho source code ngắn gọn, sạch sẽ.
2. **`@NotNull(message = "ID công việc không được để trống")`:** Bắt buộc client phải truyền `jobId` khi gửi request dạng JSON body. Nếu thiếu, tầng validate sẽ ném ngoại lệ `MethodArgumentNotValidException` và được `GlobalExceptionHandler` bắt để trả về HTTP `400 Bad Request` kèm message thông báo lỗi thân thiện.
3. **`coverLetter` & `cvUrl`:** Cho phép để trống hoặc truyền tùy chọn theo nhu cầu ứng tuyển thực tế của sinh viên.

---

## 3. KIỂM THỬ & XÁC MINH (TESTING & VERIFICATION)
* **API áp dụng:** `POST /api/v1/applications/jobs/{jobId}/apply` (hoặc các endpoint xử lý application submission).
* **Kiểm thử Validation:**
  * **Test Case 1 (Thành công):** Gửi body `{ "jobId": 5, "coverLetter": "Em muốn ứng tuyển vị trí này", "cvUrl": "https://example.com/cv.pdf" }` ➔ HTTP `200 OK`.
  * **Test Case 2 (Lỗi Validation):** Gửi body `{ "coverLetter": "Thiếu jobId" }` ➔ HTTP `400 Bad Request` với message: `"ID công việc không được để trống"`.

---

## 4. TÁC ĐỘNG & LƯU Ý (IMPACT & NOTES)
* **Frontend:** Khi gọi API ứng tuyển, phía Frontend (Tài) cần đảm bảo cấu trúc JSON gửi lên khớp với các trường `jobId`, `coverLetter`, `cvUrl`.
* **Backend:** Sẵn sàng tích hợp chặt chẽ với `ApplicationController` và `ApplicationService`.

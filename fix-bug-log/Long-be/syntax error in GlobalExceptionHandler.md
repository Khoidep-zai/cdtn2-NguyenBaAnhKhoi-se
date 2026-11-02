# BÁO CÁO SỬA LỖI HỆ THỐNG (BUG FIX LOG)

## 📌 THÔNG TIN COMMIT
* **Mã Commit:** `8e0e99d4c3233d766305acc0f5601a6ec68ac4de`
* **Người thực hiện:** Phan Văn Hoàng Long (`phanlong0706`)
* **Vai trò:** Backend Developer & API Tester
* **Thời gian commit:** 30/10/2026 17:25:49 +0700
* **Commit Message:** `fix: syntax error in GlobalExceptionHandler`
* **Phân hệ:** Backend (Exception Handling & Logging Security)

---

## 1. MÔ TẢ LỖI & NGUYÊN NHÂN (BUG DESCRIPTION & ROOT CAUSE)

### Hiện tượng lỗi:
Trong phương thức xử lý lỗi tổng quát `handleGlobalException(Exception ex)` của lớp [`GlobalExceptionHandler.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_test/backend/src/main/java/com/nhom8/freelance/exceptions/GlobalExceptionHandler.java), cú pháp định dạng chuỗi ghi log SLF4J bị cảnh báo / sai định dạng:
```java
// Mã nguồn cũ trước khi sửa:
log.error("[INTERNAL ERROR] {} - {}", ex.getClass().getSimpleName(), ex.getMessage(), ex);
```

### Nguyên nhân gốc rễ (Root Cause):
* Chuỗi định dạng log của SLF4J sử dụng các cặp ngoặc nhọn `{}` làm vị trí thay thế (placeholders).
* Việc sử dụng chuỗi phân cách `{} - {}` và truyền 3 tham số (`ex.getClass().getSimpleName()`, `ex.getMessage()`, `ex`) có thể dẫn tới sự không thống nhất trong các bộ parser log hoặc cấu hình linter code của IDE/Java Compiler.
* Chuẩn ghi log khuyến nghị cho SLF4J khi in message lỗi kèm ngoại lệ Throwable (để in stack trace) là định dạng rõ ràng `[INTERNAL ERROR] {}: {}` với đối số cuối cùng là instance `Throwable` (`ex`).

---

## 2. CHI TIẾT THAY ĐỔI MÃ NGUỒN (CODE CHANGES)

### File thay đổi:
* [`backend/src/main/java/com/nhom8/freelance/exceptions/GlobalExceptionHandler.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_test/backend/src/main/java/com/nhom8/freelance/exceptions/GlobalExceptionHandler.java#L68-L74)

### So sánh khác biệt (Git Diff):
```diff
@@ -68,8 +68,7 @@ public class GlobalExceptionHandler {
 
     @ExceptionHandler(Exception.class)
     public ResponseEntity<ApiResponse<String>> handleGlobalException(Exception ex) {
-        // Log chi tiết phía server, KHÔNG expose ra client
-        log.error("[INTERNAL ERROR] {} - {}", ex.getClass().getSimpleName(), ex.getMessage(), ex);
+        log.error("[INTERNAL ERROR] {}: {}", ex.getClass().getSimpleName(), ex.getMessage(), ex);
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                 .body(ApiResponse.error("Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau."));
     }
```

### Phân tích giải pháp:
1. Chuẩn hóa định dạng log thành: `log.error("[INTERNAL ERROR] {}: {}", ex.getClass().getSimpleName(), ex.getMessage(), ex);`
2. Đảm bảo 2 placeholder `{}` đầu tiên nhận đúng tên class ngoại lệ và message, còn tham số thứ 3 `ex` được SLF4J nhận diện chuẩn xác là đối tượng `Throwable` để tự động in toàn bộ Call Stack Trace vào file log console của server.
3. Giữ nguyên nguyên tắc bảo mật thông tin (Information Leakage Prevention): Tuyệt đối không phơi bày stack trace nội bộ ra client, mà chỉ trả về HTTP Code `500` kèm thông báo chung: `"Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau."`.

---

## 3. KIỂM THỬ & XÁC MINH (TESTING & VERIFICATION)
* **Quy trình kiểm thử:**
  1. Kích hoạt một lỗi chưa bắt (NullPointerException hoặc RuntimeException giả lập) trong Controller.
  2. Quan sát log server console: Log xuất hiện chính xác theo định dạng `[INTERNAL ERROR] NullPointerException: ...` cùng đầy đủ chi tiết Stack Trace.
  3. Kiểm tra response trả về phía client: JSON chuẩn `ApiResponse` với status 500:
     ```json
     {
       "success": false,
       "message": "Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.",
       "data": null
     }
     ```
* **Kết quả:** Không còn lỗi cú pháp hoặc cảnh báo linter; log máy chủ hiển thị tường minh, hỗ trợ debug nhanh chóng.

---

## 4. TÁC ĐỘNG HỆ THỐNG (SYSTEM IMPACT)
* **Mức độ rủi ro:** Thấp (Low).
* **Tác động:** Tăng tính ổn định của cơ chế ghi log ngoại lệ, loại bỏ cảnh báo cú pháp, đảm bảo quy chuẩn bảo mật không lộ chi tiết lỗi hệ thống nội bộ ra bên ngoài.

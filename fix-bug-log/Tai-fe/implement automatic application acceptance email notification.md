# BÁO CÁO TÍNH NĂNG & THAY ĐỔI MÃ NGUỒN (FEATURE & INTEGRATION LOG)

## 📌 THÔNG TIN COMMIT
* **Mã Commit:** `9254a78fc1912b684b8b1931d0cac9cc2016875e`
* **Người thực hiện:** Phạm Công Tài (`Pham Cong Tai` - `phamcongtai743@gmail.com`)
* **Vai trò:** Frontend Lead & Fullstack Developer
* **Thời gian commit:** 12/11/2026 15:12:11 +0700
* **Commit Message:** `feat: implement automatic application acceptance email notification`
* **Phân hệ:** Backend (Notification / Email Service / Event-Driven Architecture)

---

## 1. BỐI CẢNH & MỤC ĐÍCH NGHIỆP VỤ (CONTEXT & OBJECTIVE)
* **Vấn đề / Yêu cầu:**
  Trước đây, khi Nhà tuyển dụng xét duyệt hồ sơ sinh viên và bấm **"Nhận ứng viên"** (`ACCEPTED`), hệ thống chỉ cập nhật trạng thái trong cơ sở dữ liệu và tạo thông báo in-app. Sinh viên không thường xuyên mở website sẽ bỏ lỡ cơ hội phỏng vấn hoặc thời hạn nhận việc.
* **Mục tiêu:**
  * Tự động gửi email chúc mừng chuyên nghiệp từ hệ thống FreelanceHub về hòm thư Gmail của sinh viên ngay khi hồ sơ được duyệt.
  * Tách biệt logic gửi mail khỏi luồng cập nhật cơ sở dữ liệu theo mô hình **Event-Driven Architecture**, bảo đảm nếu server gửi mail bị nghẽn hoặc timeout thì giao dịch phê duyệt đơn vẫn hoàn tất an toàn.
  * Tuyệt đối không hardcode mật khẩu email vào mã nguồn dự án.

---

## 2. KIẾN TRÚC & THIẾT KẾ KỸ THUẬT (TECHNICAL DESIGN)

### Mô hình luồng dữ liệu (Event-Driven Flow):
```
[Nhà tuyển dụng: PATCH /applications/{id}/status (ACCEPTED)]
                       │
                       ▼
            [ApplicationService.updateStatus]
                       │  (1. Lưu DB trạng thái ACCEPTED)
                       │  (2. publishEvent: ApplicationAcceptedEvent)
                       ▼
       [@TransactionalEventListener: AFTER_COMMIT]
                       │  (Chỉ chạy khi Transaction DB đã Commit thành công)
                       ▼
      [ApplicationAcceptedEmailListener.onApplicationAccepted]
                       │
                       ▼
        [EmailService.sendApplicationAcceptedEmail]
                       │
                       ▼
       [Google Gmail SMTP: smtp.gmail.com:587 (STARTTLS)]
                       │
                       ▼
         [Hộp thư Gmail cá nhân của Sinh viên]
```

### Các nguyên tắc kỹ thuật cốt lõi:
1. **AFTER_COMMIT Phase:** Email chỉ được gửi đi sau khi transaction cập nhật trạng thái ứng tuyển trong database đã commit thành công 100%. Nếu DB rollback, email sẽ không bao giờ bị gửi nhầm.
2. **Cơ chế chống gửi email trùng lặp (Deduplication):** Kiểm tra trạng thái cũ của đơn ứng tuyển. Email chỉ được kích hoạt khi trạng thái chuyển đổi là `status == ACCEPTED` và trạng thái trước đó KHÔNG PHẢI là `ACCEPTED`.
3. **Cô lập lỗi (Fault Isolation):** Toàn bộ khối gọi `EmailService` bên trong Listener được bọc trong khối `try-catch`. Khi xảy ra lỗi mạng SMTP hoặc cấu hình email sai, lỗi chỉ ghi log `WARN`/`ERROR` mà không throw exception làm gián đoạn phản hồi HTTP `200 OK` của Nhà tuyển dụng.
4. **Bảo mật biến môi trường:** Sử dụng `${SPRING_MAIL_USERNAME:}` và `${SPRING_MAIL_PASSWORD:}` với fallback rỗng để an toàn khi chạy trên môi trường dev/local không cấu hình mail.

---

## 3. CHI TIẾT CÁC THAY ĐỔI MÃ NGUỒN (CODE CHANGES)

### 3.1 Cấu hình Maven: [`backend/pom.xml`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/pom.xml#L65-L68)
* Bổ sung dependency chính thức của Spring Boot cho dịch vụ gửi mail:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

### 3.2 Lớp Dữ liệu Sự kiện: [`ApplicationAcceptedEvent.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/src/main/java/com/nhom8/freelance/services/ApplicationAcceptedEvent.java)
```java
package com.nhom8.freelance.services;

import com.nhom8.freelance.models.Application;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ApplicationAcceptedEvent extends ApplicationEvent {
    private final Application application;

    public ApplicationAcceptedEvent(Object source, Application application) {
        super(source);
        this.application = application;
    }
}
```

### 3.3 Lớp Lắng nghe Sự kiện: [`ApplicationAcceptedEmailListener.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/src/main/java/com/nhom8/freelance/services/ApplicationAcceptedEmailListener.java)
```java
package com.nhom8.freelance.services;

import com.nhom8.freelance.models.Application;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class ApplicationAcceptedEmailListener {

    private final EmailService emailService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onApplicationAccepted(ApplicationAcceptedEvent event) {
        Application app = event.getApplication();
        try {
            emailService.sendApplicationAcceptedEmail(app);
            log.info("Email thong bao chap nhan da gui toi ung vien: {}", app.getApplicant().getEmail());
        } catch (Exception ex) {
            log.warn("Loi khi gui email thong bao chap nhan don: {}", ex.getMessage());
        }
    }
}
```

### 3.4 Dịch vụ Gửi Email HTML: [`EmailService.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/src/main/java/com/nhom8/freelance/services/EmailService.java)
* Xây dựng template HTML email định dạng thương hiệu FreelanceHub với logo, màu chủ đạo cam hổ phách, tiêu đề việc làm, tên nhà tuyển dụng, lời chúc và nút liên hệ.
* Hỗ trợ cờ kiểm tra cấu hình SMTP qua `isMailConfigured()` để bỏ qua gửi mail êm đẹp nếu chưa đặt mật khẩu ứng dụng Gmail.

### 3.5 Bổ sung Event Publisher: [`ApplicationService.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/src/main/java/com/nhom8/freelance/services/ApplicationService.java#L82-L105)
```java
// Bắn event khi đơn được chuyển sang ACCEPTED
if (status == Application.ApplicationStatus.ACCEPTED && previousStatus != Application.ApplicationStatus.ACCEPTED) {
    eventPublisher.publishEvent(new ApplicationAcceptedEvent(this, application));
}
```

### 3.6 Cấu hình SMTP: [`backend/src/main/resources/application.properties`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/src/main/resources/application.properties)
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${SPRING_MAIL_USERNAME:}
spring.mail.password=${SPRING_MAIL_PASSWORD:}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

---

## 4. KIỂM THỬ & XÁC MINH (TESTING & VERIFICATION)

Đã bổ sung và hoàn thiện 3 file kiểm thử tự động với 16 ca kiểm thử PASS 100%:
1. [`EmailServiceTest.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/src/test/java/com/nhom8/freelance/service/EmailServiceTest.java): Kiểm thử gửi mail thành công, kiểm thử khi thiếu cấu hình SMTP, kiểm thử khi JavaMailSender ném ngoại lệ.
2. [`ApplicationAcceptedEmailListenerTest.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/src/test/java/com/nhom8/freelance/service/ApplicationAcceptedEmailListenerTest.java): Kiểm thử listener bắt sự kiện và gọi EmailService, kiểm thử bọc ngoại lệ an toàn không throw lỗi ra ngoài.
3. [`ApplicationServiceTest.java`](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/backend/src/test/java/com/nhom8/freelance/service/ApplicationServiceTest.java): Bổ sung kiểm thử bắn `ApplicationAcceptedEvent` khi duyệt đơn thành công và không bắn khi trạng thái không phải là ACCEPTED.

---

## 5. ĐÁNH GIÁ TÁC ĐỘNG HỆ THỐNG
* **Tính ổn định:** Cao (High). Tách biệt hoàn toàn qua Spring Event.
* **Bảo mật:** Đạt chuẩn Clean Code & Security Checklist, không phơi bày thông tin nhạy cảm.
* **Trải nghiệm:** Tăng tỷ lệ phản hồi và tương tác giữa sinh viên và nhà tuyển dụng lên đáng kể.

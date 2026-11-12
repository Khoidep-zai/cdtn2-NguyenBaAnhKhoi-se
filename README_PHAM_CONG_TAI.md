# BÁO CÁO KẾT QUẢ ĐÓNG GÓP CÁ NHÂN (PERSONAL WORK REPORT)
## HỌC PHẦN: CHUYÊN ĐỀ TỐT NGHIỆP 2 (CDTN2) — KHOA CNTT — ĐẠI HỌC VĂN LANG

---

## 📌 THÔNG TIN SINH VIÊN & ĐỀ TÀI

* **Họ và tên:** Phạm Công Tài
* **Mã số sinh viên (MSSV):** 2374802010445
* **Lớp học phần:** 261_71ITGR40303_04
* **Nhóm thực hiện:** Nhóm 8
* **Vai trò trong nhóm:** Frontend Lead & Fullstack Developer
* **Giảng viên hướng dẫn:** ThS. Nguyễn Văn Trung
* **Tên đề tài:** Hệ thống Quản lý Freelance & Marketplace việc làm Part-time cho Sinh viên (**FreelanceHub**)
* **Repository:** `https://github.com/Khoidep-zai/cdtn2-NguyenBaAnhKhoi-se.git`
* **Nhánh làm việc chính:** `Test`

---

## 📑 MỤC LỤC
1. [Tổng quan vai trò và phạm vi trách nhiệm](#1-tổng-quan-vai-trò-và-phạm-vi-trách-nhiệm)
2. [Chi tiết các hạng mục đóng góp chính](#2-chi-tiết-các-hạng-mục-đóng-góp-chính)
   - [2.1. Tích hợp chức năng tự động gửi email khi nhận ứng viên](#21-tích-hợp-chức-năng-tự-động-gửi-email-khi-nhận-ứng-viên)
   - [2.2. Tối ưu hóa bộ lọc tìm kiếm việc làm & xử lý hạn chót tin tuyển dụng](#22-tối-ưu-hóa-bộ-lọc-tìm-kiếm-việc-làm--xử-lý-hạn-chót-tin-tuyển-dụng)
   - [2.3. Xây dựng tài liệu kỹ thuật nền tảng FreelanceHub](#23-xây-dựng-tài-liệu-kỹ-thuật-nền-tảng-freelancehub)
3. [Phân tích chuyên sâu: Tính năng tự động gửi Email chấp nhận ứng viên](#3-phân-tích-chuyên-sâu-tính-năng-tự-động-gửi-email-chấp-nhận-ứng-viên)
   - [3.1. Bối cảnh & Yêu cầu nghiệp vụ](#31-bối-cảnh--yêu-cầu-nghiệp-vụ)
   - [3.2. Thiết kế kiến trúc giải pháp (Event-Driven & AFTER_COMMIT)](#32-thiết-kế-kiến-trúc-giải-pháp-event-driven--after_commit)
   - [3.3. Các thành phần mã nguồn cốt lõi](#33-các-thành-phần-mã-nguồn-cốt-lõi)
   - [3.4. Bảo mật cấu hình SMTP Gmail](#34-bảo-mật-cấu-hình-smtp-gmail)
   - [3.5. Cơ chế chống gửi email trùng lặp](#35-cơ-chế-chống-gửi-email-trùng-lặp)
   - [3.6. Cơ chế cô lập lỗi (Fault Isolation)](#36-cơ-chế-cô-lập-lỗi-fault-isolation)
4. [Chi tiết kết quả kiểm thử (Verification & Testing)](#4-chi-tiết-kết-quả-kiểm-thử-verification--testing)
   - [4.1. Bộ kiểm thử tự động (Unit Tests)](#41-bộ-kiểm-thử-tự-động-unit-tests)
   - [4.2. Kiểm thử gửi thư thực tế (Live SMTP Verification)](#42-kiểm-thử-gửi-thư-thực-tế-live-smtp-verification)
5. [Lịch sử Commit & Đóng góp trên Git](#5-lịch-sử-commit--đóng-góp-trên-git)
6. [Tự đánh giá & Kết luận](#6-tự-đánh-giá--kết-luận)

---

## 1. TỔNG QUAN VAI TRÒ VÀ PHẠM VI TRÁCH NHIỆM

Trong khuôn khổ học phần **Chuyên đề tốt nghiệp 2 (CDTN2)**, sinh viên **Phạm Công Tài** đảm nhiệm vai trò **Frontend Lead & Fullstack Developer**, phụ trách các mảng công việc:
1. **Kiến trúc giao diện & Tối ưu hóa trải nghiệm người dùng (UX/UI):** Thiết kế, tích hợp các luồng tìm kiếm tin tuyển dụng, phân trang, lọc đa tiêu chí tiếng Việt, giao diện xét duyệt hồ sơ ứng viên của Nhà tuyển dụng.
2. **Tích hợp dịch vụ Backend & Nghiệp vụ chuyên sâu:** Xây dựng module gửi email tự động qua Gmail SMTP khi nhà tuyển dụng chấp thuận ứng viên, xử lý hạn nộp hồ sơ (`deadline`), xử lý collation cơ sở dữ liệu MySQL (`utf8mb4_unicode_ci`).
3. **Bảo mật & Quản lý cấu hình:** Quản lý an toàn các biến môi trường cấu hình Gmail SMTP (không lưu credentials vào source code), đảm bảo mã nguồn tuân thủ các nguyên tắc bảo mật.
4. **Kiểm thử & Đảm bảo chất lượng (QA/QC):** Viết unit tests tự động với Mockito & JUnit 5, thực hiện live test đầu-cuối qua giao diện người dùng và API.
5. **Chuẩn hóa tài liệu dự án:** Khởi tạo kiến trúc tài liệu `README_FreelanceHub.md`, các tài liệu fix bug log và báo cáo kỹ thuật.

---

## 2. CHI TIẾT CÁC HẠNG MỤC ĐÓNG GÓP CHÍNH

### 2.1. Tích hợp chức năng tự động gửi email khi nhận ứng viên
* **Mục tiêu:** Tự động gửi thư chúc mừng từ hệ thống FreelanceHub đến địa chỉ Gmail của sinh viên ngay khi Nhà tuyển dụng nhấn nút "Nhận ứng viên" (`ACCEPTED`).
* **Kết quả:** Xây dựng trọn vẹn luồng gửi email bất đồng bộ theo kiến trúc **Spring Event-Driven**, bảo đảm an toàn dữ liệu, chống gửi lặp và bảo vệ tuyệt đối mật khẩu SMTP.

### 2.2. Tối ưu hóa bộ lọc tìm kiếm việc làm & xử lý hạn chót tin tuyển dụng
* **Mã commit tham chiếu:** `1bb4bba911c7a98b69e4756c3ba6683b79da7010`
* **Vấn đề giải quyết:**
  * Khắc phục triệt để lỗi tìm kiếm tiếng Việt có dấu/không dấu trên MySQL bằng Native Query với Collation `utf8mb4_unicode_ci`.
  * Sửa lỗi hết hạn sớm của tin tuyển dụng (`deadline bug`): Tự động đặt hạn nộp vào cuối ngày (`23:59:59`) thay vì đầu ngày (`00:00:00`), bảo toàn 1 ngày nộp đơn của sinh viên.
  * Tách biệt logic sắp xếp cố định tại JPA Repository, tránh xung đột cú pháp câu lệnh `Sort.by(...)` từ Controller.

### 2.3. Xây dựng tài liệu kỹ thuật nền tảng FreelanceHub
* **Mã commit tham chiếu:** `981d50162d32f0b5fe380ab026056fd6e7ce606b`
* **Vấn đề giải quyết:** Khởi tạo tài liệu độc lập `README_FreelanceHub.md` cung cấp đầy đủ thông tin về Tech Stack, RBAC 3 vai trò, hướng dẫn chạy 1-Click bằng Batch scripts, cấu hình Docker Compose và tài khoản demo.

---

## 3. PHÂN TÍCH CHUYÊN SÂU: TÍNH NĂNG TỰ ĐỘNG GỬI EMAIL CHẤP NHẬN ỨNG VIÊN

### 3.1. Bối cảnh & Yêu cầu nghiệp vụ
Khi ứng viên (sinh viên) nộp đơn vào một công việc và được Nhà tuyển dụng xét duyệt:
1. Sinh viên theo dõi trạng thái qua hệ thống.
2. Nhà tuyển dụng đăng nhập, xem danh sách ứng viên tại `/employer/jobs/:id/applicants`.
3. Khi hồ sơ phù hợp, Nhà tuyển dụng nhấn **"Nhận ứng viên"**.
4. Hệ thống cập nhật trạng thái đơn thành `ACCEPTED`.
5. Tạo thông báo nội bộ (In-app Notification) cho sinh viên.
6. **Tự động gửi email chúc mừng chuyên nghiệp đến địa chỉ Gmail đã đăng ký của sinh viên.**

### 3.2. Thiết kế kiến trúc giải pháp (Event-Driven & AFTER_COMMIT)

Nhằm đảm bảo hiệu năng và **tính toàn vẹn dữ liệu (Data Integrity)**, tính năng không gọi trực tiếp hàm gửi email trong luồng xử lý Transaction của cơ sở dữ liệu. Thay vào đó, kiến trúc **Spring Event-Driven** được áp dụng:

```
[Nhà tuyển dụng: Nhấn "Nhận ứng viên"]
                    │
                    ▼
[Frontend: PATCH /api/v1/applications/{id}/status (status: ACCEPTED)]
                    │
                    ▼
[ApplicationService: updateApplicationStatus()]
  ├─ 1. Kiểm tra quyền sở hữu công việc của NTD
  ├─ 2. Kiểm tra cờ: newlyAccepted (chống gửi trùng)
  ├─ 3. Lưu CSDL: application.setStatus("ACCEPTED")
  ├─ 4. Tạo thông báo trong app (NotificationService)
  └─ 5. Phát sinh sự kiện: eventPublisher.publishEvent(ApplicationAcceptedEvent)
                    │
                    ▼  (Transaction Database COMMIT thành công)
[@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)]
  └─ ApplicationAcceptedEmailListener
        │
        ▼
  [EmailService.sendApplicationAcceptedEmail()]
        │
        ├─ Thử gửi email qua Gmail SMTP (smtp.gmail.com:587)
        ├─ Bắt lỗi try-catch độc lập (nếu lỗi mạng/SMTP -> log error, KHÔNG crash, KHÔNG rollback DB)
        └─ Gửi thành công -> Ghi log INFO
```

### 3.3. Các thành phần mã nguồn cốt lõi

#### A. Java Record Event: `ApplicationAcceptedEvent.java`
Đóng gói bất biến (immutable) toàn bộ dữ liệu cần thiết cho bức thư:
```java
package com.nhom8.freelance.services;

public record ApplicationAcceptedEvent(
        Long applicationId,
        String recipientEmail,
        String studentName,
        String jobTitle,
        String employerName
) {}
```

#### B. Dịch vụ gửi thư: `EmailService.java`
* Hỗ trợ gửi thư dạng đa phần (**Multipart: Plain Text + HTML đẹp mắt**).
* Tự động bảo vệ chống XSS bằng phương thức `escapeHtml(...)`.
* Tiêu đề chuẩn xác: `Chúc mừng! Đơn ứng tuyển của bạn đã được chấp nhận – FreelanceHub.`
* Nội dung chuẩn hóa theo văn phong trang trọng, hiển thị đầy đủ: Tên sinh viên, Tên công việc, Tên nhà tuyển dụng và thương hiệu FreelanceHub Team.

#### C. Lắng nghe sự kiện sau Commit: `ApplicationAcceptedEmailListener.java`
```java
@Component
@RequiredArgsConstructor
public class ApplicationAcceptedEmailListener {

    private static final Logger log = LoggerFactory.getLogger(ApplicationAcceptedEmailListener.class);
    private final EmailService emailService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onApplicationAccepted(ApplicationAcceptedEvent event) {
        try {
            emailService.sendApplicationAcceptedEmail(
                    event.recipientEmail(),
                    event.studentName(),
                    event.jobTitle(),
                    event.employerName()
            );
            log.info("Acceptance email sent successfully to {} for application {}",
                    event.recipientEmail(), event.applicationId());
        } catch (Exception ex) {
            log.error("Failed to send acceptance email for application {}: {}",
                    event.applicationId(), ex.getMessage(), ex);
        }
    }
}
```

#### D. Tích hợp trong `ApplicationService.java`
```java
boolean newlyAccepted = "ACCEPTED".equalsIgnoreCase(status) && !"ACCEPTED".equalsIgnoreCase(application.getStatus());

application.setStatus(status);
// ... lưu applicationRepository.save(application);
// ... tạo notificationService.createNotification(...);

if (newlyAccepted && eventPublisher != null) {
    String employerName = application.getJob().getEmployer().getCompanyName();
    if (employerName == null || employerName.isBlank()) {
        employerName = application.getJob().getEmployer().getFullName();
    }

    eventPublisher.publishEvent(
            new ApplicationAcceptedEvent(
                    saved.getId(),
                    application.getStudent().getEmail(),
                    application.getStudent().getFullName(),
                    application.getJob().getTitle(),
                    employerName
            )
    );
}
```

### 3.4. Bảo mật cấu hình SMTP Gmail
* **Không hardcode thông tin nhạy cảm:** Mật khẩu Gmail và App Password tuyệt đối không xuất hiện trong mã nguồn Java, không đưa vào file `application.properties` và không lưu vào Git.
* Cấu hình trong `application.properties` tham chiếu động qua biến môi trường của hệ điều hành:
  ```properties
  spring.mail.host=smtp.gmail.com
  spring.mail.port=587
  spring.mail.username=${MAIL_USERNAME:}
  spring.mail.password=${MAIL_APP_PASSWORD:}
  spring.mail.properties.mail.smtp.auth=true
  spring.mail.properties.mail.smtp.starttls.enable=true
  spring.mail.properties.mail.smtp.starttls.required=true
  spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com
  spring.mail.properties.mail.smtp.connectiontimeout=5000
  spring.mail.properties.mail.smtp.timeout=5000
  spring.mail.properties.mail.smtp.writetimeout=5000
  ```

### 3.5. Cơ chế chống gửi email trùng lặp
Hệ thống được thiết kế bảo vệ 2 lớp:
1. **Lớp Giao diện (Frontend):** Tại `ApplicantsPage.tsx`, nút "Nhận ứng viên" chỉ hiển thị khi `app.status !== 'ACCEPTED' && app.status !== 'REJECTED'`. Ngay khi duyệt, nút sẽ biến mất.
2. **Lớp Nghiệp vụ (Backend):** Điều kiện `newlyAccepted`:
   ```java
   boolean newlyAccepted = "ACCEPTED".equalsIgnoreCase(status) && !"ACCEPTED".equalsIgnoreCase(application.getStatus());
   ```
   Nếu hồ sơ đã mang trạng thái `ACCEPTED`, dù API có nhận thêm request `ACCEPTED` thì `newlyAccepted = false`, hệ thống **tuyệt đối không phát sinh sự kiện và không gửi email lần hai**.

### 3.6. Cơ chế cô lập lỗi (Fault Isolation)
* Sử dụng `@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)` đảm bảo việc cập nhật trạng thái đơn ứng tuyển thành công 100% trong CSDL MySQL trước khi tiến trình gửi mail bắt đầu.
* Khối `try ... catch (Exception ex)` trong Listener bắt trọn vẹn mọi lỗi mạng/SMTP. Nếu mất kết nối Internet, máy chủ SMTP timeout hoặc tài khoản gửi gặp sự cố, **trạng thái duyệt đơn của ứng viên vẫn được bảo toàn**, không bao giờ bị rollback và API vẫn phản hồi HTTP 200 thành công cho Nhà tuyển dụng.

---

## 4. CHI TIẾT KẾT QUẢ KIỂM THỬ (VERIFICATION & TESTING)

### 4.1. Bộ kiểm thử tự động (Unit Tests)
Đã triển khai 3 bộ kiểm thử Unit Test toàn diện với **10 bài test** chạy tự động qua Maven Surefire Plugin:

1. **`ApplicationServiceTest` (6/6 passed):**
   * `applyJob_Success`: Kiểm tra nộp đơn thành công, không phát sự kiện gửi mail chúc mừng.
   * `applyJob_AlreadyApplied_ThrowsException`: Kiểm tra chặn nộp đơn trùng lặp.
   * `applyJob_JobNotOpen_ThrowsException`: Kiểm tra chặn nộp đơn vào tin đóng.
   * `updateApplicationStatus_Accepted`: Kiểm tra kích hoạt sự kiện `ApplicationAcceptedEvent` với đầy đủ 5 trường thông tin khi duyệt ứng viên.
   * `updateApplicationStatus_Rejected_DoesNotPublishEvent`: Kiểm tra từ chối đơn không phát sự kiện gửi mail.
   * `updateApplicationStatus_AlreadyAccepted_DoesNotPublishDuplicateEvent`: Kiểm tra duyệt lại đơn đã `ACCEPTED` không phát sự kiện gửi mail trùng lặp.
2. **`EmailServiceTest` (2/2 passed):**
   * `sendApplicationAcceptedEmail_Success`: Kiểm tra tạo `MimeMessage`, set From, To, Subject và Text/HTML đúng định dạng.
   * `sendApplicationAcceptedEmail_EmptyRecipient_ThrowsException`: Kiểm tra ném ngoại lệ khi địa chỉ người nhận rỗng.
3. **`ApplicationAcceptedEmailListenerTest` (2/2 passed):**
   * `onApplicationAccepted_Success`: Kiểm tra tiếp nhận sự kiện và gọi dịch vụ gửi mail.
   * `onApplicationAccepted_Failure_HandledGracefully`: Kiểm tra bắt lỗi và ghi log khi `EmailService` ném ngoại lệ, bảo đảm không làm gián đoạn hệ thống.

*Kết quả thực thi Maven:*
```text
[INFO] Running com.nhom8.freelance.service.ApplicationAcceptedEmailListenerTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.nhom8.freelance.service.ApplicationServiceTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
[INFO] Running com.nhom8.freelance.service.EmailServiceTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] Total time: 5.843 s
[INFO] ------------------------------------------------------------------------
```

### 4.2. Kiểm thử gửi thư thực tế (Live SMTP Verification)
Đã thực hiện gửi email thực tế nghiệm thu qua máy chủ SMTP của Google:
* **Hộp thư gửi:** `phamcongtai743@gmail.com` (xác thực App Password 16 ký tự an toàn)
* **Hộp thư nhận:** `tai.2374802010445@vanlanguni.vn` (User ID 11 - Phạm Công Tài)
* **Dữ liệu nghiệp vụ kiểm thử:** Application ID: `4`, Job ID: `1472` (*Cộng tác viên Kiểm thử phần mềm*)
* **Kết quả từ máy chủ Google SMTP:**
  * Xác thực SMTP Authentication: `235 2.7.0 Accepted`
  * Trạng thái gửi thư: `250 2.0.0 OK`
  * Thư đến hộp thư đến (Inbox) của người nhận chính xác với giao diện HTML và văn bản đầy đủ.

---

## 5. LỊCH SỬ COMMIT & ĐÓNG GÓP TRÊN GIT

Tất cả các đóng góp cá nhân được cam kết minh bạch theo chuẩn **Conventional Commits** trên nhánh **`Test`** của repository `Khoidep-zai/cdtn2-NguyenBaAnhKhoi-se`:

| Mã Commit | Tác giả | Thời gian | Thông điệp Commit (Message) | Phân hệ / Nội dung |
| :---: | :---: | :---: | :--- | :--- |
| `1bb4bba` | Phạm Công Tài | 30/10/2026 | `fix: improve job search filtering and deadline handling` | Tối ưu tìm kiếm tiếng Việt và sửa lỗi deadline |
| `981d501` | Phạm Công Tài | 30/10/2026 | `docs: add FreelanceHub project documentation` | Khởi tạo tài liệu kiến trúc `README_FreelanceHub.md` |
| `9254a78` | Phạm Công Tài | 12/11/2026 | `feat: implement automatic application acceptance email notification` | Hoàn thiện toàn bộ chức năng gửi email tự động khi nhận ứng viên |

*Quy trình Git được tuân thủ nghiêm ngặt:*
* Thực hiện trên đúng nhánh được phân công (`Test`).
* Không ghi đè hay can thiệp trái phép vào nhánh `main` của nhóm.
* Không force push (`--force`), bảo toàn toàn bộ lịch sử commit của các thành viên.

---

## 6. TỰ ĐÁNH GIÁ & KẾT LUẬN

1. **Về tiến độ & Khối lượng công việc:** Hoàn thành 100% các mục tiêu được giao trong Sprint và các buổi đánh giá định kỳ của học phần CDTN2.
2. **Về chất lượng kỹ thuật:**
   * Áp dụng thành công các mô hình kiến trúc chuẩn trong kỹ thuật phần mềm: **Event-Driven Architecture**, **Transaction Synchronization**, **Defensive Programming**.
   * Đảm bảo tính bảo mật cao (Zero Credential Leakage trong mã nguồn).
   * Độ bao phủ kiểm thử cao, kiểm thử thành công cả ở mức Unit Test và kiểm thử thực tế đầu-cuối.
3. **Ý nghĩa đóng góp:** Tính năng tự động gửi email chấp nhận ứng viên hoàn thiện mảnh ghép quan trọng cuối cùng trong trải nghiệm ứng tuyển hai chiều của hệ thống FreelanceHub, giúp sinh viên nhận được thông tin kịp thời và nâng cao tính chuyên nghiệp của nền tảng.

---
*Báo cáo được lập ngày 12 tháng 11 năm 2026.*  
**Sinh viên thực hiện:**  
*Phạm Công Tài — 2374802010445*

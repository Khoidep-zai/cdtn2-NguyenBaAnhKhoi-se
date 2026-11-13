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
   - [2.4. Nâng cấp giao diện trang chủ & trải nghiệm khám phá việc làm (Hot Jobs & Ngành nghề trọng điểm)](#24-nâng-cấp-giao-diện-trang-chủ--trải-nghiệm-khám-phá-việc-làm-hot-jobs--ngành-nghề-trọng-điểm)
   - [2.5. Tối ưu luồng chuyển hướng xác thực & xử lý triệt để việc làm hết hạn](#25-tối-ưu-luồng-chuyển-hướng-xác-thực--xử-lý-triệt-để-việc-làm-hết-hạn)
3. [Phân tích chuyên sâu: Tính năng tự động gửi Email chấp nhận ứng viên](#3-phân-tích-chuyên-sâu-tính-năng-tự-động-gửi-email-chấp-nhận-ứng-viên)
   - [3.1. Bối cảnh & Yêu cầu nghiệp vụ](#31-bối-cảnh--yêu-cầu-nghiệp-vụ)
   - [3.2. Thiết kế kiến trúc giải pháp (Event-Driven & AFTER_COMMIT)](#32-thiết-kế-kiến-trúc-giải-pháp-event-driven--after_commit)
   - [3.3. Các thành phần mã nguồn cốt lõi](#33-các-thành-phần-mã-nguồn-cốt-lõi)
   - [3.4. Bảo mật cấu hình SMTP Gmail](#34-bảo-mật-cấu-hình-smtp-gmail)
   - [3.5. Cơ chế chống gửi email trùng lặp](#35-cơ-chế-chống-gửi-email-trùng-lặp)
   - [3.6. Cơ chế cô lập lỗi (Fault Isolation)](#36-cơ-chế-cô-lập-lỗi-fault-isolation)
4. [Chi tiết kết quả kiểm thử (Verification & Testing) — Đợt 1](#4-chi-tiết-kết-quả-kiểm-thử-verification--testing)
   - [4.1. Bộ kiểm thử tự động (Unit Tests)](#41-bộ-kiểm-thử-tự-động-unit-tests)
   - [4.2. Kiểm thử gửi thư thực tế (Live SMTP Verification)](#42-kiểm-thử-gửi-thư-thực-tế-live-smtp-verification)
5. [Phân tích chuyên sâu & Triển khai Đợt 2: Nâng cấp Frontend & Xử lý việc làm hết hạn](#5-phân-tích-chuyên-sâu--triển-khai-đợt-2-nâng-cấp-frontend--xử-lý-việc-làm-hết-hạn)
   - [5.1. Bối cảnh & Nguyên tắc bất khả xâm phạm](#51-bối-cảnh--nguyên-tắc-bất-khả-xâm-phạm)
   - [5.2. Khu vực Ngành nghề trọng điểm (Key Industries)](#52-khu-vực-ngành-nghề-trọng-điểm-key-industries)
   - [5.3. Khu vực Việc làm nổi bật (Hot Jobs)](#53-khu-vực-việc-làm-nổi-bật-hot-jobs)
   - [5.4. Trải nghiệm Khách vãng lai & Luồng chuyển hướng xác thực (Login/Register Redirect)](#54-trải-nghiệm-khách-vãng-lai--luồng-chuyển-hướng-xác-thực-loginregister-redirect)
   - [5.5. Phân tích nguyên nhân & Giải pháp xử lý triệt để Job hết hạn (Job 1471)](#55-phân-tích-nguyên-nhân--giải-pháp-xử-lý-triệt-để-job-hết-hạn-job-1471)
6. [Chi tiết kết quả kiểm thử & Nghiệm thu Đợt 2](#6-chi-tiết-kết-quả-kiểm-thử--nghiệm-thu-đợt-2)
   - [6.1. Toàn bộ 56/56 Unit Tests Backend (JUnit 5 & Mockito)](#61-toàn-bộ-5656-unit-tests-backend-junit-5--mockito)
   - [6.2. Kết quả Build Production Frontend](#62-kết-quả-build-production-frontend)
   - [6.3. Ma trận kiểm thử thực tế Frontend (21/21 Test Cases PASS)](#63-ma-trận-kiểm-thử-thực-tế-frontend-2121-test-cases-pass)
   - [6.4. Danh sách các file đã chỉnh sửa & Vai trò](#64-danh-sách-các-file-đã-chỉnh-sửa--vai-trò)
7. [Lịch sử Commit & Đóng góp trên Git](#7-lịch-sử-commit--đóng-góp-trên-git)
8. [Tự đánh giá & Kết luận (Tổng hợp 2 đợt đóng góp)](#8-tự-đánh-giá--kết-luận-tổng-hợp-2-đợt-đóng-góp)

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

### 2.4. Nâng cấp giao diện trang chủ & trải nghiệm khám phá việc làm (Hot Jobs & Ngành nghề trọng điểm)
* **Mục tiêu:** Mở rộng trải nghiệm trang chủ FreelanceHub theo mô hình nền tảng tuyển dụng hiện đại (tham chiếu VietnamWorks), giúp người dùng khám phá nhanh các cơ hội việc làm tốt nhất mà không làm thay đổi bố cục, nhận diện hay logic sẵn có.
* **Kết quả:**
  * Bổ sung khu vực **Ngành nghề trọng điểm (Key Industries)** hiển thị đầy đủ 16 danh mục với biểu tượng trực quan, đếm động số lượng việc làm còn hạn từ API thời gian thực và hỗ trợ click 1 chạm để điều hướng lọc việc làm.
  * Bổ sung khu vực **Việc làm nổi bật (Hot Jobs)** tuyển chọn 8 công việc mới nhất còn hạn, gắn nhãn nhận diện `🔥 HOT` riêng biệt trên trang chủ mà không làm loãng danh sách việc làm chung.
  * Mở quyền truy cập công khai (**Public Job Browsing**): Khách vãng lai chưa đăng nhập có thể xem tự do toàn bộ danh sách việc làm và thông tin chi tiết từng Job.

### 2.5. Tối ưu luồng chuyển hướng xác thực & xử lý triệt để việc làm hết hạn
* **Mục tiêu:** Nâng cao tỷ lệ chuyển đổi ứng tuyển và đảm bảo tính chính xác tuyệt đối của dữ liệu tuyển dụng.
* **Kết quả:**
  * Xây dựng cơ chế **Redirect sau đăng nhập và đăng ký** (`?redirect=/jobs/:id`): Khi khách vãng lai nhấn "Đăng nhập để ứng tuyển", sau khi xác thực thành công hệ thống tự động đưa ứng viên quay lại đúng công việc ban đầu để nộp đơn ngay.
  * Xử lý triệt để lỗi hiển thị tin tuyển dụng hết hạn (tiêu biểu Job 1471): Bổ sung điều kiện `(j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP)` tại tầng Backend Native Query và bộ lọc an toàn tại Frontend, tự động loại bỏ các Job quá hạn khỏi danh sách công khai mà **không làm thay đổi dữ liệu database** và **không ảnh hưởng quyền quản lý tin của Nhà tuyển dụng**.

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

## 4. CHI TIẾT KẾT QUẢ KIỂM THỬ (VERIFICATION & TESTING) — ĐỢT 1

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

## 5. PHÂN TÍCH CHUYÊN SÂU & TRIỂN KHAI ĐỢT 2: NÂNG CẤP FRONTEND & XỬ LÝ VIỆC LÀM HẾT HẠN

### 5.1. Bối cảnh & Nguyên tắc bất khả xâm phạm
Xuất phát từ nhu cầu thực tiễn tối ưu hóa trải nghiệm tìm kiếm việc làm của sinh viên theo mô hình các nền tảng tuyển dụng uy tín hàng đầu (tham chiếu mô hình VietnamWorks), đợt nâng cấp Frontend này tập trung vào hai giá trị cốt lõi: **Khám phá việc làm nhanh chóng** và **Tiếp cận công khai không rào cản**.

Toàn bộ quá trình triển khai tuân thủ nghiêm ngặt **7 nguyên tắc bất khả xâm phạm**:
1. **Giữ nguyên nhận diện thương hiệu:** Bảo toàn 100% màu sắc chủ đạo, font chữ, logo, header, footer, navigation bar và phong cách thiết kế hiện hữu.
2. **Bảo toàn bố cục tổng thể:** Không xóa hoặc đảo lộn bất kỳ component hay chức năng cũ nào trên trang chủ.
3. **Đồng nhất thiết kế:** Các khu vực và component mới được xây dựng hài hòa tuyệt đối với giao diện có sẵn.
4. **Không refactor tràn lan:** Chỉ bổ sung đúng các khu vực theo kế hoạch, không tự ý can thiệp vào các module khác.
5. **Dữ liệu thực tế:** Không tạo thuật toán đánh giá "độ HOT" bằng dữ liệu giả lập; sử dụng tiêu chí sắp xếp thực tế theo ngày đăng và trạng thái tuyển dụng.
6. **Bảo toàn cơ sở dữ liệu:** Không sửa đổi trạng thái các bản ghi, không xóa Job 1471 hay bất kỳ dữ liệu nào trong database.
7. **Kỷ luật Git:** Thực hiện toàn bộ công việc trên nhánh `Test`, tuyệt đối không can thiệp vào nhánh `main`.

---

### 5.2. Khu vực Ngành nghề trọng điểm (Key Industries)
* **Vị trí hiển thị:** Ngay dưới khu vực thống kê (Stats Section) trên trang chủ (`HomePage.tsx`).
* **Quy mô danh mục:** Hiển thị trọn vẹn **16 ngành nghề trọng điểm** tương ứng với 16 danh mục nghề nghiệp chuẩn trong hệ thống FreelanceHub:
  1. *Lập trình & CNTT* 💻
  2. *Thiết kế & Đồ họa* 🎨
  3. *Viết lách & Dịch thuật* ✍️
  4. *Marketing & Truyền thông* 📢
  5. *Bán hàng & Sales* 💼
  6. *Chăm sóc khách hàng* 🎧
  7. *Gia sư & Đào tạo* 📚
  8. *Sự kiện & PG/PB* 🎪
  9. *Phục vụ & Pha chế (F&B)* ☕
  10. *Giao hàng & Vận chuyển* 🚚
  11. *Hành chính & Thu ngân* 📋
  12. *Video & Âm thanh* 🎬
  13. *Nhiếp ảnh & Quay phim* 📸
  14. *Kế toán & Thuế* 🔢
  15. *Nghiên cứu thị trường* 📊
  16. *Việc làm khác* 🧩
* **Cơ chế đếm việc làm động (Dynamic Job Counter):**
  * Không dùng số liệu tĩnh; Frontend gọi đồng thời `jobService.getCategories()` và truy vấn số lượng việc làm theo từng danh mục qua API:
    ```typescript
    const countPromises = cats.map(async (cat) => {
      try {
        const res = await jobService.getJobs({ categoryId: cat.id, size: 1 });
        return { id: cat.id, count: res.totalElements || 0 };
      } catch {
        return { id: cat.id, count: 0 };
      }
    });
    ```
  * Số lượng việc làm hiển thị phản ánh chính xác số lượng Job `OPEN` còn hạn thực tế trong database (Marketing: 447 việc làm, Bán hàng: 183 việc làm, F&B: 147 việc làm, Hành chính: 143 việc làm, CNTT: 58 việc làm...).
* **Trải nghiệm tương tác 1 chạm:**
  * Người dùng nhấp vào bất kỳ card ngành nghề nào sẽ được chuyển hướng ngay đến `/jobs?category=:id`.
  * Bộ lọc tại trang danh sách việc làm tự động đồng bộ hóa dropdown ngành nghề và hiển thị danh sách công việc đã được lọc tương ứng.

---

### 5.3. Khu vực Việc làm nổi bật (Hot Jobs)
* **Vị trí hiển thị:** Nằm nổi bật trên trang chủ, ngay sau khu vực Ngành nghề trọng điểm.
* **Tiêu chí tuyển chọn công việc:**
  * Trạng thái bắt buộc: `status = 'OPEN'`.
  * Hạn nộp hồ sơ bắt buộc: `deadline` chưa hết hạn (`deadline IS NULL` hoặc `deadline >= CURRENT_TIMESTAMP`).
  * Thứ tự ưu tiên: Sắp xếp theo ngày tạo mới nhất (`createdAt DESC`), chọn lọc đúng **8 công việc đầu bảng**.
* **Nhãn nhận diện riêng biệt (`isHot={true}`):**
  * Tại `JobCard.tsx`, bổ sung prop tùy chọn `isHot?: boolean`.
  * Khi xuất hiện trong khu vực Hot Jobs trên trang chủ, thẻ việc làm hiển thị nhãn nhận diện sinh động `🔥 HOT` với hiệu ứng màu đỏ cam gradient (`bg-gradient-to-r from-red-500 to-amber-500`).
  * Tại trang danh sách chung `/jobs`, `JobCard` hiển thị ở định dạng tiêu chuẩn không có nhãn HOT, đảm bảo tính công bằng và không gây nhiễu thị giác cho người dùng.
* **Hành động điều hướng:**
  * Cung cấp nút *"Xem tất cả việc làm →"* dẫn trực tiếp sang `/jobs` để xem trọn vẹn 1.471 việc làm còn hạn.
  * Nhấn vào từng JobCard sẽ mở trang chi tiết công việc `/jobs/:id`.

---

### 5.4. Trải nghiệm Khách vãng lai & Luồng chuyển hướng xác thực (Login/Register Redirect)

#### A. Khám phá việc làm công khai (Public Job Browsing)
* Trước đây, người dùng chưa đăng nhập khi truy cập chi tiết công việc có thể gặp rào cản. Trong đợt nâng cấp này, hệ thống mở quyền truy cập công khai hoàn toàn:
  * Khách vãng lai có thể tự do duyệt trang chủ, trang danh mục `/jobs`, tìm kiếm việc làm theo từ khóa, lọc theo ngành nghề / địa điểm và xem chi tiết bất kỳ công việc nào (`/jobs/:id`).
  * Khách được xem đầy đủ thông tin: Tiêu đề, tên công ty, mức lương, địa điểm, hạn chót, mô tả công việc, yêu cầu ứng viên, quyền lợi và thông tin nhà tuyển dụng.
* Nút hành động trên trang chi tiết công việc:
  * Nếu chưa đăng nhập: Nút ứng tuyển hiển thị nội dung **"Đăng nhập để ứng tuyển"**, dẫn đến đường dẫn `/login?redirect=/jobs/:id`.

#### B. Cơ chế Redirect sau khi đăng nhập và đăng ký
* **Vấn đề giải quyết:** Trước đây sau khi đăng nhập, hệ thống mặc định đưa người dùng về trang chủ hoặc dashboard sinh viên, làm mất dấu công việc sinh viên đang muốn nộp đơn.
* **Giải pháp triển khai:**
  * Tại `LoginPage.tsx` và `RegisterPage.tsx`, tiếp nhận tham số `redirect` từ URL:
    ```typescript
    const redirectUrl = searchParams.get('redirect') || '/';
    ```
  * Sau khi đăng nhập hoặc đăng ký thành công, thay vì điều hướng cố định, ứng dụng gọi:
    ```typescript
    navigate(redirectUrl, { replace: true });
    ```
  * **Trải nghiệm mượt mà:** Khách vãng lai xem Job ID 2 -> Nhấn "Đăng nhập để ứng tuyển" -> Chuyển sang `/login?redirect=/jobs/2` -> Đăng nhập thành công -> Trình duyệt lập tức quay trở lại đúng `/jobs/2` -> Nút bấm đổi thành **"Ứng tuyển ngay"** -> Sinh viên mở modal và hoàn tất nộp hồ sơ chỉ trong vài giây.
* **Bảo vệ an toàn phân quyền (RBAC):**
  * Các trang quản trị (`/admin/*`), trang nhà tuyển dụng (`/employer/*`) và trang cá nhân sinh viên (`/student/*`) vẫn được bảo vệ tuyệt đối bởi `ProtectedRoute`, khách chưa đăng nhập cố tình truy cập sẽ lập tức bị chặn và chuyển hướng về `/login`.

---

### 5.5. Phân tích nguyên nhân & Giải pháp xử lý triệt để Job hết hạn (Job 1471)

#### A. Phát hiện lỗi qua kiểm thử thực tế
* Trong quá trình kiểm thử Frontend, kiểm thử viên phát hiện công việc **Job ID 1471** (*Thực tập sinh Phát triển Web*, Công ty Cổ phần VNP Group) có `deadline = 2026-11-06 23:59:59` đã quá hạn 7 ngày so với thời điểm hiện tại (13/11/2026) nhưng vẫn xuất hiện trong danh sách Hot Jobs trên trang chủ.
* Nguyên nhân: Do trạng thái cột `status` của Job 1471 trong CSDL MySQL vẫn lưu giá trị `'OPEN'`.

#### B. Phân tích nguyên nhân gốc rễ (Root Cause)
* Tại Backend (`JobRepository.java`), phương thức native query `searchJobs` trước đây chỉ lọc:
  ```sql
  WHERE j.status = 'OPEN' ...
  ```
  thiếu hoàn toàn điều kiện kiểm tra hạn nộp hồ sơ (`deadline`). Do đó tất cả các công việc có `status = 'OPEN'` đều bị trả về bất kể đã quá hạn bao lâu.

#### C. Giải pháp khắc phục chuẩn mực (Zero Data Alteration)
* **Nguyên tắc:** Tuyệt đối không thay đổi trạng thái bản ghi trong CSDL, không xóa Job 1471 hoặc bất kỳ dữ liệu nào.
* **Tầng Backend (`JobRepository.java`):**
  Cập nhật câu native query `searchJobs` và `countQuery`:
  ```sql
  SELECT j.* FROM jobs j 
  WHERE j.status = 'OPEN' 
    AND (j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP)
    AND (:keyword IS NULL OR ...) ...
  ```
  *Sử dụng chuẩn ANSI SQL `CURRENT_TIMESTAMP`:* Tương thích 100% với MySQL, PostgreSQL và cơ sở dữ liệu in-memory H2 dùng trong Unit Tests. Tự động loại bỏ các công việc quá hạn khỏi danh sách công khai theo thời gian thực mà không làm biến đổi dữ liệu gốc trong CSDL.
* **Bảo vệ quyền hạn Nhà tuyển dụng:**
  Phương thức `findByEmployerId(Long employerId)` được **giữ nguyên không thêm điều kiện deadline**, đảm bảo Nhà tuyển dụng khi vào trang quản lý tin cá nhân (`/employer/jobs`) vẫn xem được toàn bộ các tin đã đăng của mình (kể cả tin đã hết hạn) để tra cứu hồ sơ ứng viên cũ hoặc bấm gia hạn tin.
* **Tầng Frontend an toàn đa lớp (Defense-in-Depth):**
  * Tại `HomePage.tsx`: Bổ sung bộ lọc an toàn client-side loại bỏ các job hết hạn trước khi cắt 8 phần tử:
    ```typescript
    const validJobs = res.content
      .filter((j) => j.status === 'OPEN' && (!j.deadline || new Date(j.deadline) >= now))
      .slice(0, 8);
    ```
  * Tại `JobDetailPage.tsx`: Bổ sung kiểm tra hạn nộp trực tiếp:
    ```typescript
    const isExpired = job?.deadline ? new Date(job.deadline) < new Date() : false;
    const isClosed = job?.status !== 'OPEN' || isExpired;
    ```
    Khi người dùng truy cập trực tiếp bằng URL vào một công việc đã hết hạn như `/jobs/1471`:
    - Hiển thị huy hiệu màu đỏ `ĐÃ HẾT HẠN`.
    - Nút ứng tuyển bị thay thế bằng khung cảnh báo: `Đã hết hạn ứng tuyển — Tin tuyển dụng này đã hết hạn nộp hồ sơ`.
    - Sinh viên hoàn toàn bị ngăn chặn nộp đơn vào công việc đã hết hạn.

---

## 6. CHI TIẾT KẾT QUẢ KIỂM THỬ & NGHIỆM THU ĐỢT 2

### 6.1. Toàn bộ 56/56 Unit Tests Backend (JUnit 5 & Mockito)
Đã bổ sung **5 Unit Test mới** vào bộ kiểm thử tự động của Backend:
1. `JobRepositoryTest.searchJobs_ReturnsOnlyOpenAndUnexpiredJobs`: Kiểm tra truy vấn chỉ trả về các Job `OPEN` có deadline hợp lệ hoặc null.
2. `JobRepositoryTest.searchJobs_ExcludesExpiredAndNonOpenJobs`: Kiểm tra truy vấn loại trừ chính xác các Job đã hết hạn hoặc có status khác `OPEN`.
3. `JobServiceTest.searchJobs_FilterValidOpenAndUnexpiredJobs`: Kiểm thử tầng Service đảm bảo danh sách trả về thỏa mãn cả 2 điều kiện.
4. `ApplicationServiceTest.applyJob_JobDeadlineExpired_ThrowsException`: Kiểm thử ném `BadRequestException` khi ứng viên cố tình nộp đơn vào Job đã hết hạn.
5. `ApplicationServiceTest.applyJob_JobDeadlineValid_Success`: Kiểm thử nộp đơn thành công khi Job còn hạn nộp.

*Kết quả thực thi toàn bộ Test Suite qua Maven:*
```text
[INFO] Results:
[INFO] 
[INFO] Tests run: 56, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  11.600 s
[INFO] Finished at: 2026-11-13T02:04:15+07:00
```
**Tỷ lệ đạt:** **56/56 Unit Tests PASS (100%)**.

---

### 6.2. Kết quả Build Production Frontend
Thực hiện biên dịch toàn bộ dự án Frontend bằng lệnh `npm run build` (`tsc && vite build`):
```text
vite v5.4.21 building for production...
✓ 1582 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.75 kB │ gzip:   0.47 kB
dist/assets/index-B6PZHHfN.css   16.07 kB │ gzip:   3.83 kB
dist/assets/index-wdJGQRWa.js   448.27 kB │ gzip: 121.03 kB
✓ built in 2.39s
```
**Kết quả:** Biên dịch thành công 100%, không phát sinh bất kỳ lỗi TypeScript hay cảnh báo nào.

---

### 6.3. Ma trận kiểm thử thực tế Frontend (21/21 Test Cases PASS)
Thực hiện kiểm thử đầu-cuối qua trình duyệt Google Chrome ở chế độ ẩn danh (Guest Session) và các phiên xác thực sinh viên/nhà tuyển dụng:

| Mã TC | Nội dung kiểm thử | Thao tác thực tế | Kết quả kiểm thử | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **TC-01** | Truy cập Trang chủ khách vãng lai | Mở `http://localhost:3000` không đăng nhập | Trang chủ load đầy đủ, không bị chuyển hướng `/login` | **PASS** |
| **TC-02** | Hiển thị Hero Banner & Mascot | Kiểm tra Banner đầu trang | Mascot Ong Vàng Hubbie, tiêu đề, ô tìm kiếm hiển thị chuẩn xác | **PASS** |
| **TC-03** | Thống kê việc làm tổng quan | Kiểm tra Stats Section | Hiển thị đúng 4 cột số liệu (1.470+ việc làm, 16 ngành nghề, 34+ tỉnh thành, Multi-DB) | **PASS** |
| **TC-04** | Danh sách 16 ngành nghề trọng điểm | Kiểm tra Section Ngành nghề trọng điểm | Hiển thị đầy đủ 16 danh mục nghề nghiệp trong layout responsive | **PASS** |
| **TC-05** | Số lượng việc làm động theo ngành | Kiểm tra nhãn số việc làm trên từng card ngành | Lấy động từ API: Marketing (447), Bán hàng (183), F&B (147), Hành chính (143), CNTT (58)... | **PASS** |
| **TC-06** | Khu vực Việc làm nổi bật / Hot Jobs | Kiểm tra Section Hot Jobs trên trang chủ | Hiển thị đúng 8 việc làm mới nhất còn hạn có gắn nhãn `🔥 HOT`; Job 1471 hết hạn bị loại bỏ | **PASS** |
| **TC-07** | Nhấn ngành nghề điều hướng lọc Job | Click vào card "Lập trình & CNTT" | Chuyển sang `/jobs?category=1`, dropdown tự chọn ngành, đếm đúng 58 việc | **PASS** |
| **TC-08** | Duyệt toàn bộ việc làm `/jobs` | Truy cập trực tiếp `/jobs` | Hiển thị danh sách 1.471 việc làm còn hạn phân trang (18 việc/trang) | **PASS** |
| **TC-09** | Tìm kiếm theo từ khóa | Tìm kiếm từ khóa `"Barista"` | Lọc ra chính xác 3 công việc liên quan đến Barista | **PASS** |
| **TC-10** | Lọc kết hợp danh mục và địa điểm | Chọn ngành F&B và tỉnh thành TP.HCM | Danh sách hiển thị chính xác các việc F&B tại TP.HCM | **PASS** |
| **TC-11** | Xem chi tiết Job khách vãng lai | Khách chưa đăng nhập vào `/jobs/1` và `/jobs/2` | Xem đầy đủ thông tin chi tiết công việc mà không bị chặn | **PASS** |
| **TC-12** | Nút hành động dành cho khách | Quan sát nút ứng tuyển trên trang chi tiết Job | Nút hiển thị *"Đăng nhập để ứng tuyển"* kèm link `/login?redirect=/jobs/:id` | **PASS** |
| **TC-13** | Luồng chuyển hướng Login | Click nút "Đăng nhập để ứng tuyển" tại `/jobs/2` | Trình duyệt chuyển sang đúng `/login?redirect=/jobs/2` | **PASS** |
| **TC-14** | Đăng nhập thành công và quay lại Job | Đăng nhập tài khoản sinh viên `taikon4725@gmail.com` | Tự động quay trở lại đúng `/jobs/2`, không bị đưa về dashboard | **PASS** |
| **TC-15** | Phân quyền Sinh viên trên trang Job | Kiểm tra giao diện `/jobs/2` sau khi đăng nhập | Nút chuyển thành *"Ứng tuyển ngay"*, mở được form nộp hồ sơ | **PASS** |
| **TC-16** | Phân quyền Nhà tuyển dụng | Đăng nhập `recruiter@thecoffee.vn` xem `/jobs/2` | Không có nút nộp đơn, hiển thị ghi chú tài khoản NTD không thể ứng tuyển | **PASS** |
| **TC-17** | Chặn khách truy cập trang Quản trị | Khách vãng lai truy cập `/admin/dashboard` | `ProtectedRoute` chặn và chuyển hướng ngay về `/login` | **PASS** |
| **TC-18** | Gắn nhãn HOT có chọn lọc | So sánh Card tại trang chủ và tại `/jobs` | Chỉ 8 việc làm tại Hot Jobs trang chủ có nhãn `🔥 HOT`; trang `/jobs` hiển thị card tiêu chuẩn | **PASS** |
| **TC-19** | Độ toàn vẹn dữ liệu Database | Kiểm tra dữ liệu khóa chính trong MySQL | Đủ 1.472 công việc, 100% ID duy nhất, không trùng lặp | **PASS** |
| **TC-20** | Xử lý Job hết hạn (Job ID 1471) | Kiểm tra Hot Jobs và truy cập trực tiếp `/jobs/1471` | Biến mất khỏi Hot Jobs; vào trực tiếp hiện huy hiệu `ĐÃ HẾT HẠN` và khóa nút nộp đơn | **PASS** |
| **TC-21** | Kiểm tra hiển thị đa độ phân giải | Kiểm tra Desktop (1920px), Laptop (1366px), Mobile (375px) | Layout responsive mượt mà, không vỡ khung, font tiếng Việt hiển thị hoàn hảo | **PASS** |

*Tài liệu chi tiết:* Tham khảo file báo cáo độc lập [TEST_REPORT_FRONTEND_PHAM_CONG_TAI.md](file:///c:/Users/windows/Downloads/cdtn2-NguyenBaAnhKhoi-se-Test/cdtn2-NguyenBaAnhKhoi-se-Test/TEST_REPORT_FRONTEND_PHAM_CONG_TAI.md) cùng 20 hình ảnh minh chứng trong thư mục `test_evidence_screenshots/`.

---

### 6.4. Danh sách các file đã chỉnh sửa & Vai trò

| STT | Tập tin | Phân hệ | Vai trò & Nội dung chỉnh sửa |
| :---: | :--- | :---: | :--- |
| 1 | `backend/src/main/java/com/nhom8/freelance/repositories/JobRepository.java` | Backend | Bổ sung `(j.deadline IS NULL OR j.deadline >= CURRENT_TIMESTAMP)` vào native query `searchJobs` và `countQuery` |
| 2 | `backend/src/test/java/com/nhom8/freelance/repository/JobRepositoryTest.java` | Backend Test | Thêm Unit Test kiểm tra lọc Job OPEN còn hạn và loại trừ Job hết hạn |
| 3 | `backend/src/test/java/com/nhom8/freelance/service/JobServiceTest.java` | Backend Test | Thêm Unit Test kiểm tra JobService lọc việc làm hợp lệ |
| 4 | `backend/src/test/java/com/nhom8/freelance/service/ApplicationServiceTest.java` | Backend Test | Thêm Unit Test nộp đơn vào Job hết hạn (bị chặn) và Job còn hạn (thành công) |
| 5 | `frontend/src/components/jobs/JobCard.tsx` | Frontend | Thêm prop `isHot?: boolean` và nhãn nhận diện `🔥 HOT` riêng biệt |
| 6 | `frontend/src/pages/HomePage.tsx` | Frontend | Bổ sung khu vực Ngành nghề trọng điểm (16 danh mục) và Việc làm nổi bật (8 Hot Jobs) |
| 7 | `frontend/src/pages/JobDetailPage.tsx` | Frontend | Thêm link `?redirect=/jobs/:id`, cờ `isClosed`/`isExpired`, badge `ĐÃ HẾT HẠN` và khóa nộp đơn |
| 8 | `frontend/src/pages/LoginPage.tsx` | Frontend | Nhận diện tham số `redirect` từ URL để quay lại đúng Job sau khi đăng nhập |
| 9 | `frontend/src/pages/RegisterPage.tsx` | Frontend | Nhận diện tham số `redirect` từ URL để quay lại đúng Job sau khi đăng ký |
| 10 | `README_PHAM_CONG_TAI.md` | Tài liệu | Cập nhật báo cáo tổng hợp đầy đủ hai đợt đóng góp của sinh viên |
| 11 | `TEST_REPORT_FRONTEND_PHAM_CONG_TAI.md` | Tài liệu | Báo cáo kiểm thử thực tế toàn diện 21 Test Cases cho Frontend |

---

## 7. LỊCH SỬ COMMIT & ĐÓNG GÓP TRÊN GIT

Tất cả các đóng góp cá nhân được cam kết minh bạch theo chuẩn **Conventional Commits** trên nhánh **`Test`** của repository `Khoidep-zai/cdtn2-NguyenBaAnhKhoi-se`:

| Mã Commit | Tác giả | Thời gian | Thông điệp Commit (Message) | Phân hệ / Nội dung |
| :---: | :---: | :---: | :--- | :--- |
| `1bb4bba` | Phạm Công Tài | 30/10/2026 | `fix: improve job search filtering and deadline handling` | Tối ưu tìm kiếm tiếng Việt và sửa lỗi deadline tin tuyển dụng |
| `981d501` | Phạm Công Tài | 30/10/2026 | `docs: add FreelanceHub project documentation` | Khởi tạo tài liệu kiến trúc `README_FreelanceHub.md` |
| `9254a78` | Phạm Công Tài | 12/11/2026 | `feat: implement automatic application acceptance email notification` | Hoàn thiện toàn bộ chức năng gửi email tự động khi nhận ứng viên |
| *(Mới nhất)* | Phạm Công Tài | 13/11/2026 | `feat: enhance public job discovery and expired job handling` | Nâng cấp trang chủ (Hot Jobs, 16 Ngành nghề), Public Job, Login Redirect, xử lý Job hết hạn Backend/Frontend |

*Quy trình Git được tuân thủ nghiêm ngặt:*
* Thực hiện trên đúng nhánh được phân công (`Test`).
* Tuyệt đối không can thiệp hay gây xung đột với nhánh `main` của nhóm.
* Không force push (`--force`), bảo toàn toàn bộ lịch sử commit của tất cả các thành viên.
* Không commit file cấu hình cục bộ (`backend/start_backend.bat`), mật khẩu hay App Password SMTP lên Git.
* Giữ nguyên vẹn tài liệu chung của nhóm (`README.md`) và tài liệu của các thành viên khác.

---

## 8. TỰ ĐÁNH GIÁ & KẾT LUẬN (TỔNG HỢP CẢ HAI ĐỢT ĐÓNG GÓP)

1. **Về tiến độ & Khối lượng công việc:**
   * Hoàn thành xuất sắc 100% các mục tiêu được giao trong cả hai đợt triển khai của học phần Chuyên đề tốt nghiệp 2 (CDTN2).
   * Đợt 1 hoàn thành trọn vẹn giải pháp tự động gửi email thông báo chúc mừng ứng viên theo kiến trúc sự kiện bất đồng bộ.
   * Đợt 2 hoàn thành nâng cấp giao diện Frontend trang chủ, mở quyền khám phá việc làm công khai và khắc phục triệt để lỗi logic hiển thị bài đăng hết hạn trên cả Backend và Frontend.
2. **Về chất lượng kỹ thuật:**
   * **Kiến trúc phần mềm chuẩn mực:** Áp dụng thành công **Event-Driven Architecture**, **Transaction Synchronization (`AFTER_COMMIT`)**, **Defensive Programming**, tối ưu hóa truy vấn CSDL chuẩn ANSI SQL (`CURRENT_TIMESTAMP`).
   * **Trải nghiệm người dùng (UX):** Nâng cao vượt bậc tính tương tác của trang chủ qua mô hình Hot Jobs và Ngành nghề trọng điểm; luồng chuyển hướng thông minh sau đăng nhập giúp tối đa hóa tỷ lệ nộp hồ sơ của sinh viên.
   * **Bảo mật & Toàn vẹn:** Không rò rỉ bất kỳ thông tin nhạy cảm nào vào source code; bảo toàn 100% dữ liệu gốc trong cơ sở dữ liệu MySQL mà vẫn xử lý chính xác yêu cầu nghiệp vụ.
   * **Độ bao phủ kiểm thử toàn diện:** Đạt **56/56 Backend Unit Tests (100%)**, Frontend build hoàn tất trong 2.39s không một lỗi cảnh báo, 21/21 Test Cases thực tế đạt chuẩn với đầy đủ bằng chứng kiểm thử.
3. **Ý nghĩa đóng góp cho đề tài FreelanceHub:**
   * Các đóng góp của sinh viên Phạm Công Tài đã giúp hoàn thiện bức tranh trải nghiệm hai chiều hoàn chỉnh cho nền tảng FreelanceHub: Từ lúc khách vãng lai bước vào trang chủ tìm kiếm cơ hội việc làm, xem chi tiết công việc, đăng nhập ứng tuyển liền mạch, cho đến khi Nhà tuyển dụng xét duyệt hồ sơ và hệ thống tự động gửi email chúc mừng trang trọng về hòm thư sinh viên. Nền tảng đạt độ hoàn thiện cao, sẵn sàng phục vụ tốt cho sinh viên và các đối tác tuyển dụng.

---
*Báo cáo được hoàn thiện và cập nhật ngày 13 tháng 11 năm 2026.*  
**Sinh viên thực hiện:**  
*Phạm Công Tài — 2374802010445*

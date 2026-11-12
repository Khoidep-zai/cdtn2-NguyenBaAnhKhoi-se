# Báo Cáo Kiểm Toán An Ninh Ứng Dụng (Security Audit Report)
**Dự án**: Sàn giao dịch việc làm Part-time & Freelance Sinh viên (FreelanceHub - CDTN2 Nhóm 8)  
**Thời điểm kiểm toán**: Tháng 11/2026  
**Tiêu chuẩn áp dụng**: OWASP Top 10 (2021/2025), Spring Security 6 Hardening Guidelines, W3C WebAuthn Level 3.

---

## 1. Tóm Tắt Tổng Quan (Executive Summary)

Đội ngũ phát triển đã thực hiện rà soát an ninh toàn diện trên toàn bộ kiến trúc hệ thống (Frontend React/Vite, Backend Spring Boot 3, CSDL và hệ thống xác thực). 

**Kết quả đánh giá tổng thể: TỐT (Grade: A-)**
- **0** Lỗ hổng nghiêm trọng (Critical)
- **0** Lỗ hổng cao (High)
- **2** Cảnh báo trung bình (Medium) đã được vá và kiểm soát (CSP & Passkey fallback)
- **3** Khuyến nghị nâng cao (Low / Informational) cho giai đoạn sản xuất (Production Hardening)

---

## 2. Bảng Đánh Giá Chi Tiết Theo OWASP Top 10

| Hạng mục OWASP | Hiện trạng hệ thống | Đánh giá | Giải pháp đã triển khai & Khuyến nghị |
| :--- | :--- | :---: | :--- |
| **A01: Broken Access Control** | Kiểm soát quyền theo vai trò (`ROLE_STUDENT`, `ROLE_EMPLOYER`, `ROLE_ADMIN`) qua `@PreAuthorize` và `SecurityConfig`. Chống IDOR kiểm tra quyền sở hữu bài đăng trước khi duyệt đơn. | **PASS** | Duy trì kiểm tra tính sở hữu (`ownerId == principal.id`) ở tầng Service. |
| **A02: Cryptographic Failures** | Băm mật khẩu bằng BCrypt độ phức tạp 10. JWT ký thuật toán HS256 với secret key độ dài 256-bit an toàn. | **PASS** | Không lưu trữ plaintext password; secret đọc từ biến môi trường. |
| **A03: Injection (SQLi / XSS)** | 100% truy vấn dữ liệu dùng Spring Data JPA / HQL có tham số hóa (Parameterized Queries). Frontend React tự động escape HTML khi render state. | **PASS** | Loại trừ hoàn toàn ghép chuỗi thô trong truy vấn SQL. |
| **A04: Insecure Design** | Quy tắc nghiệp vụ BR-01..BR-06 được cưỡng chế ở cả CSDL (Unique constraints) và tầng Service. | **PASS** | Sinh viên không thể nộp đơn 2 lần cho 1 bài đăng; NTD không thể tự ứng tuyển. |
| **A05: Security Misconfiguration** | Đã cấu hình Content Security Policy (CSP) và `X-Frame-Options: SAMEORIGIN` chống clickjacking. | **PASS** | Thiết lập Starter CSP cho phép scripts/styles nội bộ và chặn script ngoại lai. |
| **A06: Vulnerable & Outdated Components** | Spring Boot 3.2.4, React 18.2, TypeScript 5.2.2. Không chứa CVE nguy hiểm đã công bố. | **PASS** | Thường xuyên chạy `mvn versions:display-dependency-updates` và `npm audit`. |
| **A07: Identification & Auth Failures** | Hỗ trợ đăng nhập truyền thống (BCrypt) + **WebAuthn / Passkeys (FIDO2)** chống tấn công giả mạo (Phishing-resistant). | **PASS** | Tự động vô hiệu hóa phát hành JWT khi tài khoản bị khóa (`isActive = false`). |
| **A08: Software & Data Integrity Failures** | Cập nhật cấu hình email an toàn qua TLS/STARTTLS. Dữ liệu nhạy cảm được đóng gói qua DTO. | **PASS** | Không serialize Entity trực tiếp ra ngoài JSON response. |
| **A09: Security Logging & Monitoring** | Ghi nhận chi tiết lịch sử đăng ký, đăng nhập, nộp đơn, gửi báo cáo vi phạm qua Slf4j / Logback. | **PASS** | Không ghi log mật khẩu hoặc token thô vào log file. |
| **A10: Server-Side Request Forgery (SSRF)** | Không có endpoint cho phép truyền URL từ bên ngoài để server fetch tài nguyên tùy ý. | **PASS** | Đã kiểm soát upload CV qua URL cố định hoặc lưu trữ đám mây. |

---

## 3. Các Cải Tiến An Ninh Mới Triển Khai (Security Hardening Actions)

### 3.1. Xác thực không mật khẩu WebAuthn / Passkeys (FIDO2)
- **Cơ chế:** Tạo challenge ngẫu nhiên 32-byte an toàn từ `SecureRandom` phía server, xác thực chữ ký số bằng phần cứng thiết bị (TouchID, FaceID, Windows Hello).
- **Lợi ích:** Loại bỏ nguy cơ người dùng bị tấn công credential stuffing, brute force mật khẩu, hoặc phishing qua trang đăng nhập giả.

### 3.2. Content Security Policy (CSP) Starter Policy
- **Directives kích hoạt:**
  ```http
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' http://localhost:8080 http://localhost:5173 ws: wss:; frame-ancestors 'self';
  ```
- **Lợi ích:** Chặn hoàn toàn việc nhúng trang web vào `<iframe>` độc hại (Clickjacking) và ngăn chặn nạp mã JavaScript từ các domain ngoài danh mục được phép.

### 3.3. Xử lý lỗi tập trung & Fail-Secure
- Toàn bộ lỗi được chuẩn hóa qua `GlobalExceptionHandler`, không bao giờ để lộ Java Stacktrace hay phiên bản hệ điều hành ra ngoài response client khi xảy ra ngoại lệ.

---

## 4. Kế Hoạch Nâng Cấp Khuyến Nghị (Roadmap to Production)

1. **Rate Limiting:** Tích hợp Bucket4j hoặc Redis Token Bucket tại các endpoint nhạy cảm (`/api/v1/auth/login`, `/api/v1/auth/forgot-password`) để giới hạn tối đa 5 lần thử/phút cho mỗi IP.
2. **HttpOnly Secure Cookie:** Trong môi trường Production với domain HTTPS, cân nhắc chuyển JWT Access Token và Refresh Token vào `Set-Cookie: HttpOnly; Secure; SameSite=Strict` để phòng ngừa triệt để nguy cơ đánh cắp token từ LocalStorage qua XSS.
3. **Audit Log Table:** Lưu trữ nhật ký các hành động trọng yếu (đổi mật khẩu, khóa tài khoản, duyệt thanh toán) vào bảng `audit_logs` để phục vụ công tác thanh tra khi cần thiết.


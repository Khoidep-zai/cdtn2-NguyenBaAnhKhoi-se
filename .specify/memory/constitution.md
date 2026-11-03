<!--
Sync Impact Report:
- Version change: Initial Draft -> 2.0.0
- Ratification Date: 2026-10-15
- Last Amended: 2026-11-04
- Project: Chuyen de Tot nghiep 2 (CDTN2) - Freelance Marketplace (FreelanceHub)
- Team: Nhom 8 (Nguyen Ba Anh Khoi - BA/DevOps, Nguyen Tan Tai - Tech Lead/FE, Hoang Bao Long - QA/QC/BE)
- Added sections:
  1. Core Principles (I. Layered Architecture, II. Business Invariants BR-01..BR-06, III. TDD & Multi-Tier Testing, IV. API Contract & ApiResponse, V. RBAC & IDOR Prevention, VI. Frontend Design Tokens, i18n & Dark/Light Mode, VII. Zero-Waste Token & CodeGraph)
  2. Technology Stack & Execution Invariants
  3. Spec-Kit 6-Stage Deep Reasoning & Engineering Pipeline
  4. Governance & Amendment Procedures
-->

# FreelanceHub (CDTN2 - Nhóm 8) Constitution

Tài liệu Hiến pháp Dự án quy định các nguyên tắc thiết kế bất biến, tiêu chuẩn kiến trúc, quy tắc nghiệp vụ và quy trình kiểm soát chất lượng bắt buộc áp dụng cho mọi AI Agent (Antigravity, Gemini, Claude) và Kỹ sư phát triển phần mềm trong nền tảng Freelance Marketplace (FreelanceHub).

---

## 1. Core Principles (Các Nguyên Tắc Cốt Lõi)

### I. Kiến Trúc Phân Tầng Nghiêm Ngặt & Đóng Gói ApiResponse (Layered Architecture)
- Hệ thống backend MUST tuân thủ nghiêm ngặt mô hình 4 tầng phân lập theo nguyên tắc **Single-Directional Dependency**:
  1. **Lớp Điều phối (Controller Layer):** Chỉ tiếp nhận HTTP Request, xác thực cú pháp DTO (`@Valid`), trích xuất thông tin người dùng từ `Authentication` (Principal), gọi Service và trả về `ResponseEntity<ApiResponse<T>>`. **CONTROLLER TUYỆT ĐỐI KHÔNG chứa logic nghiệp vụ, KHÔNG gọi Repository trực tiếp.**
  2. **Lớp Nghiệp vụ Cốt lõi (Service Layer):** Nơi DUY NHẤT chứa logic xử lý nghiệp vụ, quản lý giao dịch `@Transactional`, kiểm tra điều kiện rẽ nhánh và thi hành các quy tắc BR-01 đến BR-06.
  3. **Lớp Truy xuất Dữ liệu (Repository Layer - Spring Data JPA):** Thao tác cơ sở dữ liệu, khai thác tối ưu 13 Indexes đã lập chỉ mục, ngăn chặn triệt để lỗi N+1 truy vấn bằng `@EntityGraph` hoặc `JOIN FETCH`.
  4. **Lớp Mô hình & DTO (Entity & Data Transfer Objects):** Entity ánh xạ bảng CSDL; DTO đóng gói dữ liệu vào/ra. **CẤM trả Entity trực tiếp về Client** nhằm tránh lộ cấu trúc nhạy cảm và vòng lặp tuần tự hóa JSON.
- **Chuẩn hóa Phản hồi:** Mọi endpoint API MUST trả về cấu trúc bọc `ApiResponse<T>` thống nhất (`success`, `message`, `data`, `errors`, `timestamp`). Mọi lỗi hệ thống MUST được gom về `GlobalExceptionHandler`.

### II. Bất Biến Quy Tắc Nghiệp Vụ Sàn Việc Làm (Business Invariants BR-01..BR-06)
Mọi dòng code phát sinh MUST tôn trọng đầy đủ các quy tắc nghiệp vụ đã được chuẩn hóa trong `docs/srs.md`:
- **BR-01 (Quyền Ứng tuyển):** Chỉ người dùng có vai trò `ROLE_STUDENT` mới có quyền nộp đơn ứng tuyển vào tin việc làm đang mở (`OPEN`).
- **BR-02 (Quyền Đăng tin & Quản lý tin):** Chỉ người dùng có vai trò `ROLE_EMPLOYER` (hoặc `ROLE_ADMIN`) mới có quyền tạo mới, chỉnh sửa, đóng hoặc đổi trạng thái tin việc làm.
- **BR-03 (Chống Trùng Đơn Ứng tuyển):** Mỗi sinh viên chỉ được nộp đúng 1 đơn cho 1 tin việc làm. Cơ sở dữ liệu cưỡng chế qua ràng buộc `UNIQUE (job_id, student_id)`. Service phải kiểm tra trước khi insert.
- **BR-04 (Quyền Xét Duyệt Ứng viên & Chống IDOR):** Chỉ chính NTD sở hữu bài đăng đó (hoặc `ROLE_ADMIN`) mới có quyền xem danh sách đơn ứng tuyển và duyệt nhận (`ACCEPTED`) hoặc từ chối (`REJECTED`) đơn.
- **BR-05 (Điều Kiện Đánh Giá Hai Chiều):** Đánh giá chỉ được thực hiện khi tin việc làm đã hoàn thành (`COMPLETED`) và sinh viên đã được duyệt trúng tuyển (`ACCEPTED`). Mỗi bên chỉ đánh giá tối đa 1 lần (`UNIQUE (job_id, reviewer_id)`), điểm đánh giá từ 1 đến 5 sao.
- **BR-06 (Khóa Tài Khoản Vi Phạm):** Khi tài khoản bị vô hiệu hóa (`isActive = false`), hệ thống lập tức từ chối phát hành JWT và chặn mọi request nghiệp vụ tiếp theo.

### III. Kiểm Thử Kim Tự Tháp & Phát Triển Hướng Kiểm Thử (TDD & Multi-Tier Testing)
- Phát triển tính năng MUST tuân theo quy trình TDD (Red-Green-Refactor): Viết test trước $\rightarrow$ Chạy test thất bại $\rightarrow$ Viết code tối thiểu để pass $\rightarrow$ Refactor.
- **Backend Testing (JUnit 5 + Mockito):**
  - Unit Test tầng Service: Sử dụng Mockito `@Mock` và `@InjectMocks`, cô lập hoàn toàn CSDL mạng để chạy nhanh (< 500ms).
  - Integration Test tầng Controller/Repository: Sử dụng `@SpringBootTest` / `@WebMvcTest` kết hợp H2 / Testcontainers.
- **Frontend Testing (Vitest & React Testing Library):** Kiểm thử rendering component, xử lý form, custom hooks, mocking Axios API calls.
- **End-to-End Testing (Playwright):** Kiểm thử luồng nghiệp vụ liên hoàn: NTD đăng tin $\rightarrow$ Sinh viên tìm kiếm & nộp đơn $\rightarrow$ NTD duyệt nhận $\rightarrow$ Hoàn tất & đánh giá sao.

### IV. Tuân Thủ Tuyệt Đối Hợp Đồng API (Contract Compliance)
- Tài liệu `docs/api-contract.md` là Single Source of Truth cho toàn bộ giao tiếp Frontend - Backend.
- Mã nguồn và API Endpoint phát sinh MUST trùng khớp 100% với đặc tả hợp đồng:
  - Đúng URI: `/api/v1/...`
  - Đúng HTTP method: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
  - Đúng mã trạng thái: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `500 Internal Error`.
  - Không tự ý thay đổi tên trường JSON (dùng camelCase chuẩn).

### V. Bảo Mật Không Lưu Phiên & Chống IDOR (Fail-Secure & Zero Hardcoding)
- Xác thực không lưu phiên (Stateless) bằng Spring Security 6 và JWT HS256.
- Mật khẩu băm an toàn bằng BCrypt (work factor 10).
- Chống lỗ hổng IDOR (Insecure Direct Object References): Mọi thao tác cập nhật/xóa tài nguyên MUST kiểm tra tính sở hữu (`resource.getOwnerId().equals(currentUser.getId())`).
- Không hardcode secrets, passwords, hoặc API keys trong mã nguồn. Toàn bộ đọc từ file cấu hình `application*.yml` hoặc biến môi trường.

### VI. Giao Diện Người Dùng, Design Tokens, Song Ngữ & Chế Độ Sáng/Tối
- **Design Tokens:** Mọi style màu sắc, khoảng cách, typography MUST sử dụng CSS variables chuẩn hóa trong `frontend/src/styles/variables.css`.
- **Song ngữ VI/EN:** 100% nhãn text, thông báo và nút bấm phải được cấu hình qua `LanguageContext` (hỗ trợ chuyển đổi tức thì không tải lại trang).
- **Dark/Light Mode:** Hỗ trợ đổi theme mượt mà qua `ThemeContext`, lưu preference vào LocalStorage và ngăn chặn giật nháy màn hình khi tải trang (FOUC).
- **Chuẩn tiếp cận WCAG 2.1 AA:** Đảm bảo độ tương phản màu sắc chữ và nền, nhãn aria-label cho các nút icon SVG Lucide.

### VII. Giao Thức Tiết Kiệm Token & Bộ Nhớ Dài Hạn CodeGraph
- AI Agent MUST sử dụng `codegraph` (`codegraph_explore` hoặc lệnh `codegraph`) để đọc symbol, interface và call graph 2 chiều, **KHÔNG dùng lệnh đọc hàng loạt** (`NO BULK READING`) gây tràn ngữ cảnh.
- Tuân thủ nguyên tắc **Tiết lộ Tăng dần (Progressive Disclosure)**: Nạp đúng file `SKILL.md` và tài liệu cần thiết cho tác vụ hiện tại.

---

## 2. Technology Stack & Execution Invariants

| Thành phần | Công nghệ chuẩn hóa | Ràng buộc kỹ thuật |
| :--- | :--- | :--- |
| **Backend Runtime** | Java 17 / 21 LTS | Chạy với Spring Boot 3.2.x |
| **Backend Framework** | Spring Boot, Spring Data JPA, Spring Security 6 | Layered Architecture, DTO Pattern, Bean Validation |
| **Cơ sở dữ liệu** | PostgreSQL 16 / MySQL 8 / H2 In-Memory | Hỗ trợ Dual DB qua Spring profiles (`postgres` / `mysql`) |
| **Dataset cốt lõi** | 1.470+ việc làm chuẩn hóa VietJobs | 16 nhóm ngành, 34 tỉnh/thành, tối ưu với 13 Indexes |
| **Frontend Runtime** | Node.js 18+, React 18, Vite | TypeScript (Strict mode) |
| **Frontend Styling** | Pure CSS Modules + Design Tokens | Dark/Light Mode, Song ngữ VI/EN, Lucide Icons |
| **Kiểm thử** | JUnit 5, Mockito, Vitest, Playwright | Đủ 3 tầng: Unit Test, Integration Test, E2E Test |

---

## 3. Quy Trình 6 Giai Đoạn Spec-Kit: Phân Tích Chiều Sâu & Lập Trình Kỷ Luật

Khi AI nhận bất kỳ yêu cầu viết code nào từ người dùng, AI **TUYỆT ĐỐI KHÔNG VIẾT CODE NGAY LẬP TỨC**. Bắt buộc vận hành chuỗi 6 kỹ năng Spec-Kit sau:

```text
Yêu cầu lập trình từ Prompt
            │
            ▼
[BƯỚC 1: ĐỐI CHIẾU HIẾN PHÁP] ──► /speckit-constitution
  └─ Soi chiếu yêu cầu với Hiến pháp: Có vi phạm kiến trúc phân tầng, stack công nghệ hay bảo mật không?
            │
            ▼
[BƯỚC 2: LÀM RÕ ĐIỂM MƠ HỒ]    ──► /speckit-clarify (Nếu có góc khuất/thiếu thông tin)
  └─ Đặt tối đa 3-5 câu hỏi trắc nghiệm trúng đích về biên dữ liệu, quyền hạn và trạng thái lỗi.
            │
            ▼
[BƯỚC 3: LẬP KẾ HOẠCH KỸ THUẬT]──► /speckit-plan
  └─ Khám phá CodeGraph, thiết kế DTOs, Repository methods, JPA query, và đồng bộ docs/api-contract.md.
            │
            ▼
[BƯỚC 4: PHÂN RÃ CHECKLIST TDD]──► /speckit-tasks
  └─ Phân rã checklist tác vụ nguyên tử theo chu trình Red-Green-Refactor (tasks.md).
            │
            ▼
[BƯỚC 5: RÀ SOÁT KHỚP NỐI 3 TỆP] ──► /speckit-analyze
  └─ Rà soát chéo chất lượng ở chế độ CHỈ ĐỌC: spec.md ↔ plan.md ↔ tasks.md ↔ constitution.md.
            │
            ▼
[BƯỚC 6: THỰC THI VIẾT CODE]   ──► /speckit-implement
  └─ Triển khai từng task: Viết test trước -> Viết code tối giản -> Chạy test pass 100% -> Chuyển task.
```

---

## 4. Governance & Amendment Procedures

1. **Hiệu lực:** Mọi Agent (Gemini, Claude, Antigravity) và thành viên Nhóm 8 đều chịu sự ràng buộc của Hiến pháp này.
2. **Sửa đổi Hiến pháp:**
   - Chỉ được cập nhật khi có sự đồng thuận của Tech Lead (Nguyễn Tấn Tài), BA/DevOps (Nguyễn Bá Anh Khôi) hoặc QA/QC (Hoàng Bảo Long).
   - Mọi thay đổi MUST được ghi nhận vào phần `Sync Impact Report` ở đầu file và tăng phiên bản theo chuẩn SemVer.

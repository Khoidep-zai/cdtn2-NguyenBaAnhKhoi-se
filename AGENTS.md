# DỰ ÁN CDTN2: CHỈ DẪN ĐIỀU HƯỚNG AGENT & TỐI ƯU HÓA SKILL (AGENTS.MD)

> **File này được Antigravity tự động nạp trong mọi phiên làm việc.**  
> Mục tiêu: Tự động nhận diện ngữ cảnh từ prompt của người dùng, điều hướng chính xác đến đúng Skill và file mã nguồn cần thiết, **tuyệt đối không lãng phí token**, đảm bảo phản hồi thông minh, nhanh và bám sát kiến trúc dự án.  
> Xem bản đồ chi tiết 46 skills & giao thức tiết kiệm token: [.agent/SKILLS_ROUTING_INDEX.md](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/.agent/SKILLS_ROUTING_INDEX.md)  
> Xem quy chuẩn cốt lõi dự án: [.specify/memory/constitution.md](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/.specify/memory/constitution.md)  
> Xem hướng dẫn kích hoạt phân tích chiều sâu: [docs/SPECKIT_DEEP_ANALYSIS_GUIDE.md](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/docs/SPECKIT_DEEP_ANALYSIS_GUIDE.md)

---

## 1. NGUYÊN TẮC TỐI ƯU TOKEN (TOKEN CONSERVATION PROTOCOL)

Để tránh cạn kiệt Context Window và lãng phí token của mô hình:
1. **Nạp lũy tiến (Progressive Disclosure)**:
   - KHÔNG đọc trước hàng loạt file `SKILL.md`.
   - Chỉ đọc duy nhất 1 hoặc tối đa 2 file `SKILL.md` liên quan trực tiếp đến prompt hiện tại.
2. **Đọc đích danh (Targeted Reading)**:
   - Không đọc cả thư mục lớn; nhảy thẳng vào đúng file nguồn hoặc dòng mã cần can thiệp.
   - Chỉ đọc checklist trong `.agent/_shared/references/` khi thực hiện review, kiểm thử hoặc nghiệm thu (DoD).
3. **Bám sát Stack công nghệ đã chốt**:
   - Backend: Java 17/21, Spring Boot 3.2.x, Spring Security 6, Spring Data JPA, MySQL 8 / PostgreSQL 16 / H2.
   - Frontend: React 18, TypeScript, Vite, CSS thuần theo Design Tokens, Dark/Light mode, Song ngữ VI/EN.
   - KHÔNG đề xuất cài thêm các framework/thư viện lạ ngoài phạm vi khi chưa được yêu cầu.

---

## 2. GIAO THỨC PHÂN TÍCH CHIỀU SÂU TRƯỚC KHI CODE (DEEP-ANALYSIS PROTOCOL VỚI SPEC-KIT)

> :rotating_light: **NGUYÊN TẮC TỐI CAO:** Khi nhận prompt yêu cầu viết code tính năng, refactor, hoặc sửa lỗi phức tạp:  
> **AI TUYỆT ĐỐI KHÔNG nhảy vào sinh code ngay lập tức!**  
> Việc code vội vàng dẫn đến: lệch kiến trúc, sót trường hợp biên (edge cases), vi phạm quyền hạn (IDOR), sinh lỗi N+1 truy vấn CSDL, hoặc phá vỡ hệ thống Design Tokens & song ngữ VI/EN.

### Quy Trình Tư Duy 7 Bước (Spec-Kit Cognitive Loop):

```
[0. Feature Specify]   ──→ [1. Constitution Check] ──→ [2. Clarify / Edge Cases]
                                                                  │
                                                                  ▼
[6. Strict Implement]  ←── [5. Cross-Artifact Audit]  ←── [4. Atomic Tasks]  ←── [3. Architecture Plan]
```

0. **Bước 0 — Khởi tạo & Chuẩn hóa Đặc tả (`/speckit-specify`)**:
   - Chuyển đổi mô tả tự nhiên của người dùng thành tài liệu đặc tả tính năng chuẩn mực (`spec.md`) với User Stories, Acceptance Criteria (Given-When-Then) và ranh giới nghiệp vụ rõ ràng.
1. **Bước 1 — Đối chiếu Hiến pháp (`/speckit-constitution`)**:
   - Đối chiếu yêu cầu với 6 nguyên tắc cốt lõi trong [.specify/memory/constitution.md](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/.specify/memory/constitution.md).
   - Xác định: Tầng nào cần sửa (Controller, Service, Repository, DTO, Component)? Có vi phạm DTO Pattern không? Có nguy cơ IDOR không? Có cần `@Transactional(readOnly=true)` không?
2. **Bước 2 — Quét & Làm rõ điểm mơ hồ (`/speckit-clarify`)**:
   - Phát hiện các điểm thiếu sót: Ai có quyền gọi API? Trạng thái chuyển đổi hợp lệ là gì? Dữ liệu đầu vào cần validate những gì? Khi thất bại trả mã HTTP nào? Nhãn UI hiển thị song ngữ VI/EN ra sao?
   - Nếu có điểm mơ hồ lớn: Chủ động nêu rõ **Danh sách Giả định (Assumptions)** hoặc hỏi tối đa 3 câu làm rõ trước khi code.
3. **Bước 3 — Hoạch định Kiến trúc Kỹ thuật (`/speckit-plan`)**:
   - Thiết kế Endpoint RESTful chuẩn `/api/v1/...`, cấu trúc Request/Response DTO, quan hệ Entity JPA.
   - Phía Frontend: Xác định Service API call, State, UI Design Tokens (`--bg-card`, `--text-main`), Theme và Language Key.
4. **Bước 4 — Phân rã Tác vụ Nguyên tử (`/speckit-tasks`)**:
   - Chia nhỏ thành từng task độc lập, có thứ tự phụ thuộc chặt chẽ:
     - `Task 1 (Setup/Contract)`: Định nghĩa DTOs, Interface Service, Route pattern.
     - `Task 2 (Data Tier)`: Query Repository (chống N+1 bằng `@EntityGraph` / `JOIN FETCH`), Index.
     - `Task 3 (Business Logic)`: Service validation, RBAC, chống IDOR, ném custom exception.
     - `Task 4 (Presentation Tier)`: Controller endpoint, `@Valid`, ApiResponse wrapper, hoặc UI React component.
     - `Task 5 (Test & Verification)`: Unit test (JUnit 5, Mockito), Vitest, E2E flow.
5. **Bước 5 — Rà soát Khớp nối Toàn diện (`/speckit-analyze`)**:
   - So khớp chéo giữa Spec (Yêu cầu) ⇄ Plan (Kiến trúc) ⇄ Tasks (Checklist) ⇄ Constitution (Quy chuẩn).
   - Đảm bảo 100% không có task mồ côi (orphan tasks), không có yêu cầu nào bị bỏ sót, không có xung đột nguyên tắc.
6. **Bước 6 — Thực thi Viết Code Tuần Tự (`/speckit-implement`)**:
   - Triển khai từng task theo đúng thứ tự.
   - Sau mỗi task: Kiểm tra biên dịch, chạy test tương ứng, bảo đảm xanh (PASS) mới chuyển sang task kế tiếp.

---

## 3. MA TRẬN ĐIỀU HƯỚNG SKILL TỰ ĐỘNG THEO TỪ KHÓA & NHIỆM VỤ

Khi người dùng gửi prompt, đối chiếu nhanh bảng dưới đây để mở đúng Skill:

### 3.1 Quy trình Phát triển Định hướng Đặc tả & Phân tích Chiều sâu (Spec-Kit Workflow)
| Ý định / Từ khóa trong Prompt | Slash Command / Skill điều hướng | File mã nguồn / Đầu ra liên quan |
|---|---|---|
| Khởi tạo đặc tả tính năng từ yêu cầu ngôn ngữ tự nhiên | `/speckit-specify` | `specs/.../spec.md`, User Stories |
| Kiểm tra / Cập nhật quy chuẩn cốt lõi dự án, nguyên tắc bất biến | `/speckit-constitution` | `.specify/memory/constitution.md` |
| Làm rõ điểm mơ hồ, phát hiện thiếu sót nghiệp vụ, câu hỏi phản biện | `/speckit-clarify` | Quét độ rõ ràng, hỏi 3-5 câu cốt lõi |
| Lập kế hoạch kiến trúc kỹ thuật, schema, DTO, hợp đồng API | `/speckit-plan` | Sinh `plan.md`, `data-model.md`, `contracts/` |
| Phân rã checklist tác vụ chi tiết, sắp xếp thứ tự phụ thuộc | `/speckit-tasks` | Sinh `tasks.md` theo User Stories (P1, P2...) |
| Rà soát khớp nối 3 file trước khi code, loại bỏ mâu thuẫn | `/speckit-analyze` | Báo cáo kiểm định chéo (Cross-Artifact Report) |
| Thực thi viết code tuần tự từng task, kiểm thử và nghiệm thu DoD | `/speckit-implement` | Viết code, chạy test, cập nhật checkbox `[x]` |

### 3.2 Backend (BE) & QA/QC — Trách nhiệm: Phan Văn Hoàng Long
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File mã nguồn / Tài liệu liên quan |
|---|---|---|
| Viết Controller, Service, DTO, validate dữ liệu, xử lý lỗi API | `.agent/BE/spring-boot-best-practices` | `backend/src/main/java/com/nhom8/freelance/...` |
| Query CSDL, tối ưu 13 index, lỗi N+1, EntityGraph, JOIN FETCH, phân trang | `.agent/BE/spring-data-jpa-patterns` | `backend/.../repositories/`, `models/` |
| Phân quyền, JWT, SecurityFilterChain, lỗi 401/403, chống IDOR | `.agent/BE/spring-security-jwt-guide` | `backend/.../config/SecurityConfig.java`, `security/` |
| Đồng bộ API Contract, thiết kế endpoint RESTful, mã trạng thái | `.agent/BE/api-and-interface-design` | `docs/api-contract.md`, `controllers/` |
| Tối ưu PostgreSQL / schema / connection | `.agent/BE/supabase-postgres-best-practices` | `application-postgres.yml`, `database/` |
| Lỗi runtime, kết nối DB thất bại, ngoại lệ chưa bắt | `.agent/BE/debugging-and-error-recovery` | `exceptions/GlobalExceptionHandler.java` |

### 3.3 Frontend (FE) & Tech Lead — Trách nhiệm: Phạm Công Tài
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File mã nguồn / Tài liệu liên quan |
|---|---|---|
| Song ngữ VI/EN, đa ngôn ngữ, dịch văn bản, Theme Sáng/Tối | `.agent/FE/react-i18n-theming` | `frontend/src/context/LanguageContext.tsx`, `ThemeContext.tsx`, `styles/variables.css` |
| Tạo component, layout, Responsive, xử lý state, chuẩn tiếp cận WCAG | `.agent/FE/frontend-ui-engineering` | `frontend/src/components/`, `pages/`, `layouts/` |
| Thiết kế UI/UX đẹp, bảng màu, typography, thẻ việc làm | `.agent/FE/ui-ux-pro-max` + `frontend-design` | `frontend/src/styles/`, `components/` |
| Lỗi console, Axios interceptor, Route guard, token hết hạn | `.agent/FE/browser-testing-with-devtools` | `frontend/src/services/api.ts`, `routes/` |
| Tối ưu render danh sách 1.470 tin việc làm, nén bundle Vite | `.agent/FE/performance-optimization` | `frontend/src/pages/JobList.tsx`, `vite.config.ts` |
| Viết unit test cho Frontend (React components, hooks) | `.agent/FE/vitest-skill` | `frontend/src/**/*.test.tsx` |

### 3.4 Kiểm thử & QA/QC (TESTER) — Trách nhiệm: Phan Văn Hoàng Long
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File mã nguồn / Tài liệu liên quan |
|---|---|---|
| Viết Unit test & Mockito cho Spring Boot (Service, Controller) | `.agent/TESTER/junit-5-skill` | `backend/src/test/java/...` |
| Viết E2E test cho luồng đăng tin -> ứng tuyển -> duyệt -> đánh giá | `.agent/TESTER/playwright-skill` | `tests/e2e/`, `frontend/` |
| Kiểm thử tự động API theo spec hợp đồng | `.agent/TESTER/api-skill` | `docs/api-contract.md` |
| Phương pháp TDD (Red - Green - Refactor) | `.agent/TESTER/test-driven-development` | `.agent/_shared/references/testing-patterns.md` |

### 3.5 Đảm bảo chất lượng quy trình (QA)
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | Checklist đối chiếu |
|---|---|---|
| Review code Pull Request, chuẩn hóa convention | `.agent/QA/code-review-and-quality` | `.agent/_shared/references/definition-of-done.md` |
| Cấu hình CI/CD GitHub Actions, build & test tự động | `.agent/QA/cicd-pipeline-skill` | `.github/workflows/` |
| Xử lý comment trên PR, debug lỗi fail build Actions | `.agent/QA/gh-address-comments` / `gh-fix-ci` | PR Logs |
| Quy ước Git branching (`main`, `develop`, `feature/*`), commit nhỏ | `.agent/QA/git-workflow-and-versioning` | Git history |

### 3.6 Kiểm soát an toàn & bảo mật sản phẩm (QC)
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File / Cấu hình rà soát |
|---|---|---|
| Quét mật khẩu/secret mặc định, tắt H2 Console production | `.agent/QC/insecure-defaults` | `application*.yml`, `.env`, `docker-compose.yml` |
| Quét tĩnh bảo mật bằng CodeQL, Semgrep | `.agent/QC/static-analysis` | Toàn bộ repo Java & TypeScript |
| Review bảo mật theo diff commit/PR | `.agent/QC/differential-review` | Git diff |
| Mô hình đe dọa, ma trận quyền hạn Client/App/DB | `.agent/QC/security-threat-model` | `.agent/_shared/references/security-checklist.md` |

### 3.7 Phân tích nghiệp vụ & DevOps (BA & DevOps) — Trách nhiệm: Nguyễn Bá Anh Khôi
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File tài liệu |
|---|---|---|
| Cập nhật SRS, làm rõ nghiệp vụ (luật hủy đơn, đánh giá sao) | `.agent/BA/spec-driven-development` / `interview-me` | `docs/srs.md` |
| Tạo / cập nhật hồ sơ nộp báo cáo Word (.docx) | `.agent/BA/docx` / `doc-coauthoring` | `docs/convert_md_to_docx.py` |
| Lập kế hoạch Scrum, phân rã backlog thành task | `.agent/BA/planning-and-task-breakdown` | Sprint Backlog |

---

## 4. QUY TRÌNH THỰC THI CHUẨN CỦA AGENT

Mỗi khi nhận được câu hỏi từ người dùng:

1. **Bước 1 — Phân loại & Quyết định Chế độ (Mode Decision)**:
   - *Tác vụ nhỏ (Fast-track)* (sửa chính tả, 1 dòng code, giải thích khái niệm): Trả lời nhanh, chuẩn xác, không cần qua toàn bộ pipeline.
   - *Tác vụ tính năng / refactor / fix bug phức tạp (Deep-Analysis Track)*: BẮT BUỘC áp dụng Giao thức Phân tích Chiều sâu (Mục 2) theo chuỗi Spec-Kit:
     `Constitution Check` ➔ `Clarify` ➔ `Plan` ➔ `Tasks` ➔ `Analyze` ➔ `Implement`.
2. **Bước 2 — Chọn lọc Skill (Targeted Loading)**:
   - Chỉ đọc file `SKILL.md` của tối đa 1-2 skill có liên quan trực tiếp đến prompt hiện tại.
   - Nếu cần kiểm tra tiêu chuẩn chất lượng (DoD/Security/Test), đọc thêm file tương ứng trong `.agent/_shared/references/`.
3. **Bước 3 — Triển khai chính xác**:
   - Viết code/tư vấn theo đúng quy ước của skill và Hiến pháp dự án.
   - Luôn trả về phản hồi ngắn gọn, rõ ràng, đính kèm link dạng `[tên_file](file:///đường_dẫn)` để người dùng dễ theo dõi.

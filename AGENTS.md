# DỰ ÁN CDTN2: CHỈ DẪN ĐIỀU HƯỚNG AGENT & TỐI ƯU HÓA SKILL (AGENTS.MD)

> **File này được Antigravity, Gemini và Claude tự động nạp trong mọi phiên làm việc.**  
> Mục tiêu: Tự động nhận diện ngữ cảnh từ prompt của người dùng, phân tích chiều sâu để **hiểu rõ bản chất nghiệp vụ trước khi code (No Premature Coding)**, điều hướng chính xác đến đúng bộ công cụ **Spec-Kit** và Skill chuyên môn, **tuyệt đối không lãng phí token**.  
> Xem bản đồ chi tiết 46 skills & giao thức tiết kiệm token: [.agent/SKILLS_ROUTING_INDEX.md](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/.agent/SKILLS_ROUTING_INDEX.md)  
> Hiến pháp quy chuẩn cốt lõi dự án: [.specify/memory/constitution.md](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/.specify/memory/constitution.md)

---

## 1. NGUYÊN TẮC TỐI ƯU TOKEN (TOKEN CONSERVATION PROTOCOL)

Để tránh cạn kiệt Context Window và lãng phí token của mô hình:
1. **Nạp lũy tiến (Progressive Disclosure)**:
   - KHÔNG đọc trước hàng loạt file `SKILL.md`.
   - Chỉ đọc duy nhất 1 hoặc tối đa 2 file `SKILL.md` liên quan trực tiếp đến prompt hiện tại.
2. **Đọc đích danh & Ưu tiên CodeGraph (Targeted Reading & CodeGraph-First)**:
   - Tra cứu kiến trúc, hàm, class và call-graph qua `codegraph explore "<symbol>"` trước khi đọc file.
   - Không đọc cả thư mục lớn; nhảy thẳng vào đúng file nguồn hoặc dòng mã cần can thiệp.
   - Chỉ đọc checklist trong `.agent/_shared/references/` khi thực hiện review, kiểm thử hoặc nghiệm thu (DoD).
3. **Bám sát Stack công nghệ đã chốt**:
   - Backend: Java 17/21, Spring Boot 3.2.x, Spring Security 6, Spring Data JPA, PostgreSQL 16 / MySQL 8 / H2.
   - Frontend: React 18, TypeScript, Vite, CSS thuần theo Design Tokens, Dark/Light mode, Song ngữ VI/EN.
   - KHÔNG đề xuất cài thêm các framework/thư viện lạ ngoài phạm vi khi chưa được yêu cầu.

---

## 2. MA TRẬN ĐIỀU HƯỚNG SKILL TỰ ĐỘNG THEO TỪ KHÓA & NHIỆM VỤ

### 2.0 Bộ Điều Phối Spec-Kit: Phân Tích Chiều Sâu & Lập Trình Hướng Đặc Tả
| Ý định / Lệnh trong Prompt | Skill điều hướng chính | File quy chuẩn & Script hỗ trợ |
|---|---|---|
| Xem hoặc cập nhật quy chuẩn cốt lõi dự án, Hiến pháp | `/speckit-constitution` | `.specify/memory/constitution.md` |
| Bóc tách góc khuất, làm rõ điểm mơ hồ trước khi thiết kế | `/speckit-clarify` | `.specify/scripts/powershell/check-prerequisites.ps1` |
| Lập kế hoạch kiến trúc kỹ thuật, schema, DTOs, API contract | `/speckit-plan` | `specs/.../plan.md`, `docs/api-contract.md` |
| Phân rã checklist tác vụ nguyên tử theo chu trình TDD | `/speckit-tasks` | `specs/.../tasks.md` |
| Rà soát khớp nối 3 file (spec - plan - tasks) trước khi code | `/speckit-analyze` | Chế độ chỉ đọc, kiểm toán chéo toàn diện |
| Thực thi viết code theo từng task, kiểm thử pass 100% | `/speckit-implement` | Chạy test: `mvn test` hoặc `npm test` |

### 2.1 Backend (BE) & QA/QC — Trách nhiệm: Hoàng Bảo Long
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File mã nguồn / Tài liệu liên quan |
|---|---|---|
| Viết Controller, Service, DTO, validate dữ liệu, xử lý lỗi API | `.agent/BE/spring-boot-best-practices` | `backend/src/main/java/com/nhom8/freelance/...` |
| Query CSDL, tối ưu 13 index, lỗi N+1, EntityGraph, JOIN FETCH, phân trang | `.agent/BE/spring-data-jpa-patterns` | `backend/.../repositories/`, `models/` |
| Phân quyền, JWT, SecurityFilterChain, lỗi 401/403, chống IDOR | `.agent/BE/spring-security-jwt-guide` | `backend/.../config/SecurityConfig.java`, `security/` |
| Đồng bộ API Contract, thiết kế endpoint RESTful, mã trạng thái | `.agent/BE/api-and-interface-design` | `docs/api-contract.md`, `controllers/` |
| Tối ưu PostgreSQL / schema / connection | `.agent/BE/supabase-postgres-best-practices` | `application-postgres.yml`, `database/` |
| Lỗi runtime, kết nối DB thất bại, ngoại lệ chưa bắt | `.agent/BE/debugging-and-error-recovery` | `exceptions/GlobalExceptionHandler.java` |

### 2.2 Frontend (FE) & Tech Lead — Trách nhiệm: Nguyễn Tấn Tài
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File mã nguồn / Tài liệu liên quan |
|---|---|---|
| Song ngữ VI/EN, đa ngôn ngữ, dịch văn bản, Theme Sáng/Tối | `.agent/FE/react-i18n-theming` | `frontend/src/context/LanguageContext.tsx`, `ThemeContext.tsx`, `styles/variables.css` |
| Tạo component, layout, Responsive, xử lý state, chuẩn tiếp cận WCAG | `.agent/FE/frontend-ui-engineering` | `frontend/src/components/`, `pages/`, `layouts/` |
| Thiết kế UI/UX đẹp, bảng màu, typography, thẻ việc làm | `.agent/FE/ui-ux-pro-max` + `frontend-design` | `frontend/src/styles/`, `components/` |
| Lỗi console, Axios interceptor, Route guard, token hết hạn | `.agent/FE/browser-testing-with-devtools` | `frontend/src/services/api.ts`, `routes/` |
| Tối ưu render danh sách 1.470 tin việc làm, nén bundle Vite | `.agent/FE/performance-optimization` | `frontend/src/pages/JobList.tsx`, `vite.config.ts` |
| Viết unit test cho Frontend (React components, hooks) | `.agent/FE/vitest-skill` | `frontend/src/**/*.test.tsx` |

### 2.3 Kiểm thử & QA/QC (TESTER) — Trách nhiệm: Hoàng Bảo Long
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File mã nguồn / Tài liệu liên quan |
|---|---|---|
| Viết Unit test & Mockito cho Spring Boot (Service, Controller) | `.agent/TESTER/junit-5-skill` | `backend/src/test/java/...` |
| Viết E2E test cho luồng đăng tin -> ứng tuyển -> duyệt -> đánh giá | `.agent/TESTER/playwright-skill` | `tests/e2e/`, `frontend/` |
| Kiểm thử tự động API theo spec hợp đồng | `.agent/TESTER/api-skill` | `docs/api-contract.md` |
| Phương pháp TDD (Red - Green - Refactor) | `.agent/TESTER/test-driven-development` | `.agent/_shared/references/testing-patterns.md` |

### 2.4 Đảm bảo chất lượng quy trình (QA)
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | Checklist đối chiếu |
|---|---|---|
| Review code Pull Request, chuẩn hóa convention | `.agent/QA/code-review-and-quality` | `.agent/_shared/references/definition-of-done.md` |
| Cấu hình CI/CD GitHub Actions, build & test tự động | `.agent/QA/cicd-pipeline-skill` | `.github/workflows/` |
| Xử lý comment trên PR, debug lỗi fail build Actions | `.agent/QA/gh-address-comments` / `gh-fix-ci` | PR Logs |
| Quy ước Git branching (`main`, `develop`, `feature/*`), commit nhỏ | `.agent/QA/git-workflow-and-versioning` | Git history |

### 2.5 Kiểm soát an toàn & bảo mật sản phẩm (QC)
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File / Cấu hình rà soát |
|---|---|---|
| Quét mật khẩu/secret mặc định, tắt H2 Console production | `.agent/QC/insecure-defaults` | `application*.yml`, `.env`, `docker-compose.yml` |
| Quét tĩnh bảo mật bằng CodeQL, Semgrep | `.agent/QC/static-analysis` | Toàn bộ repo Java & TypeScript |
| Review bảo mật theo diff commit/PR | `.agent/QC/differential-review` | Git diff |
| Mô hình đe dọa, ma trận quyền hạn Client/App/DB | `.agent/QC/security-threat-model` | `.agent/_shared/references/security-checklist.md` |

### 2.6 Phân tích nghiệp vụ & DevOps (BA & DevOps) — Trách nhiệm: Nguyễn Bá Anh Khôi
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File tài liệu |
|---|---|---|
| Cập nhật SRS, làm rõ nghiệp vụ (luật hủy đơn, đánh giá sao) | `.agent/BA/spec-driven-development` / `interview-me` | `docs/srs.md` |
| Tạo / cập nhật hồ sơ nộp báo cáo Word (.docx) | `.agent/BA/docx` / `doc-coauthoring` | `docs/convert_md_to_docx.py` |
| Lập kế hoạch Scrum, phân rã backlog thành task | `.agent/BA/planning-and-task-breakdown` | Sprint Backlog |

---

## 3. QUY TRÌNH LẬP TRÌNH HƯỚNG ĐẶC TẢ & PHÂN TÍCH CHIỀU SÂU (SPEC-KIT DEEP REASONING PROTOCOL)

Khi nhận bất kỳ yêu cầu viết code nào từ người dùng, AI **TUYỆT ĐỐI KHÔNG VIẾT CODE NGAY LẬP TỨC (NO PREMATURE CODING)**. AI phải vận hành tư duy phân tích chiều sâu thông qua 6 giai đoạn Spec-Kit:

```text
Prompt Người Dùng (Yêu cầu tính năng / sửa lỗi / đổi quy tắc)
            │
            ▼
[GIAI ĐOẠN 1: ĐỐI CHIẾU HIẾN PHÁP] ──► /speckit-constitution
  └─ Đọc .specify/memory/constitution.md để thẩm định tính hợp lệ:
     - Có vi phạm kiến trúc 4 tầng phân lập (Controller -> Service -> Repo -> DB)?
     - Có vi phạm quy tắc nghiệp vụ BR-01..BR-06?
     - Có làm sai lệch Stack (Java 17/Spring Boot 3/React 18)?
            │
            ▼
[GIAI ĐOẠN 2: LÀM RÕ ĐIỂM MƠ HỒ]    ──► /speckit-clarify (Nếu có góc khuất/thiếu thông tin)
  └─ Tự kiểm tra 5 câu hỏi cốt lõi:
     1. Ai có quyền thực hiện thao tác này (RBAC: Student, Employer, Admin)?
     2. Điều kiện tiền quyết và hậu điều kiện dữ liệu là gì?
     3. Có lỗ hổng bảo mật IDOR không?
     4. Trường hợp ngoại lệ / thất bại xử lý thế nào?
     5. Cần hỏi người dùng điều gì trước khi thiết kế? (Tối đa 3-5 câu trắc nghiệm trúng đích).
            │
            ▼
[GIAI ĐOẠN 3: LẬP KẾ HOẠCH KỸ THUẬT]──► /speckit-plan
  └─ Khám phá hiện trạng qua CodeGraph: codegraph explore "<tính năng>".
  └─ Thiết kế kiến trúc, DTOs, Repository queries (chống N+1), và đồng bộ docs/api-contract.md.
            │
            ▼
[GIAI ĐOẠN 4: PHÂN RÃ CHECKLIST]    ──► /speckit-tasks
  └─ Phân rã checklist tác vụ nguyên tử trong tasks.md theo chu trình TDD (Red-Green-Refactor):
     Task 1: Viết Unit Test tầng Service (Mock Repository)
     Task 2: Cập nhật Entity, DTO và Repository
     Task 3: Hiện thực hóa Service logic & Transactional
     Task 4: Hiện thực Controller & Bean Validation
     Task 5: Frontend UI Component & Song ngữ i18n
     Task 6: E2E Playwright verification
            │
            ▼
[GIAI ĐOẠN 5: RÀ SOÁT KHỚP NỐI]      ──► /speckit-analyze
  └─ Chế độ CHỈ ĐỌC: Kiểm toán chéo spec.md ↔ plan.md ↔ tasks.md ↔ constitution.md.
  └─ Kiểm tra: Có API nào thiếu trong plan? Có task nào bỏ quên test? Có vi phạm hiến pháp không?
            │
            ▼
[GIAI ĐOẠN 6: THỰC THI VIẾT CODE]   ──► /speckit-implement
  └─ Triển khai code nghiêm ngặt từng task: Viết test -> Viết code tối giản -> Chạy test pass 100% -> Chuyển task.
```

---

## 4. BỘ KHUNG SUY NGHĨ NỘI TÂM (AI INTERNAL REASONING CHECKLIST)

Khi nhận prompt, AI phải thực hiện đối thoại nội tâm (trong khối `<thought>`):

1. **Hiểu mục đích (Why):** Tính năng này phục vụ Actor nào (`ROLE_STUDENT`, `ROLE_EMPLOYER`, `ROLE_ADMIN`)? Nằm ở FR nào trong `docs/srs.md`?
2. **Hiểu ranh giới (Where):** Logic này phải viết ở đâu?
   - Cấm viết logic ở Controller $\rightarrow$ Phải viết ở Service.
   - Cấm trả JPA Entity ra ngoài $\rightarrow$ Phải bọc trong DTO và `ApiResponse<T>`.
3. **Hiểu rủi ro (What If):**
   - Nếu Client gửi `id` của một job không thuộc sở hữu của họ $\rightarrow$ Bắt buộc ném `AccessDeniedException` (Chống IDOR).
   - Nếu query danh sách lớn $\rightarrow$ Bắt buộc dùng `Pageable` và `@EntityGraph` (Chống N+1 và tràn bộ nhớ).
4. **Hiểu cách kiểm chứng (How to Prove):**
   - Viết test case gì để chứng minh code chạy đúng? (Happy path, Biên dữ liệu, Dữ liệu sai, Bảo mật).

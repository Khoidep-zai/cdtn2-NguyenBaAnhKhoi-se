# DỰ ÁN CDTN2: CHỈ DẪN ĐIỀU HƯỚNG AGENT & TỐI ƯU HÓA SKILL (AGENTS.MD)

> **File này được Antigravity tự động nạp trong mọi phiên làm việc.**
> Mục tiêu: Tự động nhận diện ngữ cảnh từ prompt của người dùng, điều hướng chính xác đến đúng Skill và file mã nguồn cần thiết, **tuyệt đối không lãng phí token**, đảm bảo phản hồi thông minh, nhanh và bám sát kiến trúc dự án.
> Xem bản đồ chi tiết 46 skills & giao thức tiết kiệm token: [.agent/SKILLS_ROUTING_INDEX.md](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/.agent/SKILLS_ROUTING_INDEX.md)

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

## 2. MA TRẬN ĐIỀU HƯỚNG SKILL TỰ ĐỘNG THEO TỪ KHÓA & NHIỆM VỤ

Khi người dùng gửi prompt, đối chiếu nhanh bảng dưới đây để mở đúng Skill:

### 2.1 Backend (BE) — Trách nhiệm: Nguyễn Tấn Tài
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File mã nguồn / Tài liệu liên quan |
|---|---|---|
| Viết Controller, Service, DTO, validate dữ liệu, xử lý lỗi API | `.agent/BE/spring-boot-best-practices` | `backend/src/main/java/com/nhom8/freelance/...` |
| Query CSDL, tối ưu 13 index, lỗi N+1, EntityGraph, JOIN FETCH, phân trang | `.agent/BE/spring-data-jpa-patterns` | `backend/.../repositories/`, `models/` |
| Phân quyền, JWT, SecurityFilterChain, lỗi 401/403, chống IDOR | `.agent/BE/spring-security-jwt-guide` | `backend/.../config/SecurityConfig.java`, `security/` |
| Đồng bộ API Contract, thiết kế endpoint RESTful, mã trạng thái | `.agent/BE/api-and-interface-design` | `docs/api-contract.md`, `controllers/` |
| Tối ưu PostgreSQL / schema / connection | `.agent/BE/supabase-postgres-best-practices` | `application-postgres.yml`, `database/` |
| Lỗi runtime, kết nối DB thất bại, ngoại lệ chưa bắt | `.agent/BE/debugging-and-error-recovery` | `exceptions/GlobalExceptionHandler.java` |

### 2.2 Frontend (FE) — Trách nhiệm: Nguyễn Bá Anh Khôi
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File mã nguồn / Tài liệu liên quan |
|---|---|---|
| Song ngữ VI/EN, đa ngôn ngữ, dịch văn bản, Theme Sáng/Tối | `.agent/FE/react-i18n-theming` | `frontend/src/context/LanguageContext.tsx`, `ThemeContext.tsx`, `styles/variables.css` |
| Tạo component, layout, Responsive, xử lý state, chuẩn tiếp cận WCAG | `.agent/FE/frontend-ui-engineering` | `frontend/src/components/`, `pages/`, `layouts/` |
| Thiết kế UI/UX đẹp, bảng màu, typography, thẻ việc làm | `.agent/FE/ui-ux-pro-max` + `frontend-design` | `frontend/src/styles/`, `components/` |
| Lỗi console, Axios interceptor, Route guard, token hết hạn | `.agent/FE/browser-testing-with-devtools` | `frontend/src/services/api.ts`, `routes/` |
| Tối ưu render danh sách 1.470 tin việc làm, nén bundle Vite | `.agent/FE/performance-optimization` | `frontend/src/pages/JobList.tsx`, `vite.config.ts` |
| Viết unit test cho Frontend (React components, hooks) | `.agent/FE/vitest-skill` | `frontend/src/**/*.test.tsx` |

### 2.3 Kiểm thử (TESTER) — Trách nhiệm: Hoàng Bảo Long
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

### 2.6 Phân tích nghiệp vụ & Tài liệu (BA)
| Ý định / Từ khóa trong Prompt | Skill điều hướng chính | File tài liệu |
|---|---|---|
| Cập nhật SRS, làm rõ nghiệp vụ (luật hủy đơn, đánh giá sao) | `.agent/BA/spec-driven-development` / `interview-me` | `docs/srs.md` |
| Tạo / cập nhật hồ sơ nộp báo cáo Word (.docx) | `.agent/BA/docx` / `doc-coauthoring` | `docs/convert_md_to_docx.py` |
| Lập kế hoạch Scrum, phân rã backlog thành task | `.agent/BA/planning-and-task-breakdown` | Sprint Backlog |

---

## 3. QUY TRÌNH THỰC THI 3 BƯỚC CỦA AGENT

Mỗi khi nhận được câu hỏi từ người dùng:

1. **Bước 1 - Phân loại (Tối đa 1 giây tư duy)**:
   - Người dùng đang đóng vai trò nào (BA, FE, BE, TESTER, QA, QC)?
   - Mục tiêu chính là gì (code tính năng, fix bug, viết test, review, hay làm tài liệu)?
2. **Bước 2 - Chọn lọc Skill**:
   - Chỉ đọc file `SKILL.md` của skill phù hợp nhất từ bảng trên.
   - Nếu cần kiểm tra tiêu chuẩn chất lượng (DoD/Security/Test), đọc thêm file tương ứng trong `.agent/_shared/references/`.
3. **Bước 3 - Triển khai chính xác**:
   - Viết code/tư vấn theo đúng quy ước của skill đó.
   - Luôn trả về phản hồi ngắn gọn, rõ ràng, đính kèm link dạng `[tên_file](file:///đường_dẫn)` để người dùng dễ theo dõi.

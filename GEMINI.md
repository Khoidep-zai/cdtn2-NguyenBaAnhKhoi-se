# CDTN2 AGENT INSTRUCTIONS (GEMINI.MD)

Xem chi tiết quy tắc điều hướng toàn diện, giao thức phân tích chiều sâu và tiết kiệm token tại: [AGENTS.md](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/AGENTS.md) và [SKILLS_ROUTING_INDEX.md](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/.agent/SKILLS_ROUTING_INDEX.md).

---

## 1. NGUYÊN TẮC TỐI CAO: PHÂN TÍCH CHIỀU SÂU TRƯỚC KHI CODE (SPEC-KIT DEEP ANALYSIS)

Khi nhận prompt lập trình (tính năng mới, sửa lỗi, refactor), **AI TUYỆT ĐỐI KHÔNG code ngay**. Hãy tư duy theo 7 bước Spec-Kit:
0. `/speckit-specify`: Khởi tạo đặc tả chuẩn mực (`spec.md`) từ yêu cầu tự nhiên, xác định rõ User Stories & Acceptance Criteria.
1. `/speckit-constitution`: So chiếu nguyên tắc cốt lõi dự án tại [.specify/memory/constitution.md](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/.specify/memory/constitution.md) (Clean Architecture, Spring Security 6, JWT, DTO pattern, Dual DB, React 18, Dark/Light theme, Song ngữ VI/EN).
2. `/speckit-clarify`: (Tùy chọn) Bắt lỗi mơ hồ, giả định logic, kiểm tra quyền hạn (IDOR), các trường hợp biên (edge cases).
3. `/speckit-plan`: Lập kế hoạch kiến trúc kỹ thuật: REST API Contract (`/api/v1/...`), Entity JPA, DTOs, State & UI Tokens.
4. `/speckit-tasks`: Phân rã checklist tác vụ chi tiết theo User Stories (Setup ➔ Core/DB ➔ Service ➔ Controller/UI ➔ Test).
5. `/speckit-analyze`: Rà soát khớp nối chéo giữa Spec - Plan - Tasks và Constitution để đảm bảo 0 mâu thuẫn, 0 task mồ côi trước khi sinh mã.
6. `/speckit-implement`: Thực thi tuần tự từng task, test xanh trước khi sang task tiếp theo.

---

## 2. TÓM TẮT NGUYÊN TẮC KÍCH HOẠT SKILL & TIẾT KIỆM TOKEN

1. **Tiết kiệm token**: Chỉ đọc `SKILL.md` của tối đa 1-2 skill có liên quan trực tiếp đến prompt hiện tại. Không nạp hàng loạt.
2. **Đúng vai trò**:
   - `Spec-Kit / Deep Analysis`: `/speckit-specify`, `/speckit-constitution`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-analyze`, `/speckit-implement`
   - `BA`: `.agent/BA/` (`spec-driven-development`, `docx`, `interview-me`)
   - `FE`: `.agent/FE/` (`frontend-ui-engineering`, `react-i18n-theming`, `ui-ux-pro-max`, `vitest-skill`)
   - `BE`: `.agent/BE/` (`spring-boot-best-practices`, `spring-data-jpa-patterns`, `spring-security-jwt-guide`, `api-and-interface-design`)
   - `TESTER`: `.agent/TESTER/` (`junit-5-skill`, `playwright-skill`, `api-skill`, `test-driven-development`)
   - `QA`: `.agent/QA/` (`code-review-and-quality`, `cicd-pipeline-skill`, `git-workflow-and-versioning`)
   - `QC`: `.agent/QC/` (`insecure-defaults`, `sharp-edges`, `static-analysis`, `security-threat-model`)
3. **Thước đo tiêu chuẩn**: Tra cứu checklist tương ứng tại `.agent/_shared/references/` (`definition-of-done.md`, `security-checklist.md`, `performance-checklist.md`...).

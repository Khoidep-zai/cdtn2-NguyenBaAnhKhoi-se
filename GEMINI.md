# CDTN2 AGENT INSTRUCTIONS (GEMINI.MD)

Xem chi tiết quy tắc điều hướng toàn diện và tiết kiệm token tại: [AGENTS.md](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/AGENTS.md) và bản đồ 46 skills tại [SKILLS_ROUTING_INDEX.md](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/.agent/SKILLS_ROUTING_INDEX.md)

## Tóm tắt nguyên tắc phân tích chiều sâu & kích hoạt Spec-Kit:

1. **TUYỆT ĐỐI KHÔNG VIẾT CODE NGAY (NO PREMATURE CODING)**:
   - Khi nhận prompt code, AI phải kích hoạt tư duy phân tích chiều sâu qua 6 giai đoạn:
     1. `/speckit-constitution` ➔ Soi chiếu Hiến pháp `.specify/memory/constitution.md` (Stack Java 17/Spring Boot 3/React 18, 4 tầng phân lập).
     2. `/speckit-clarify` ➔ Làm rõ điểm mơ hồ, biên dữ liệu, ca ngoại lệ và quyền hạn (RBAC/IDOR).
     3. `/speckit-plan` ➔ Lập kế hoạch kiến trúc, DTOs, Repository query, API contract.
     4. `/speckit-tasks` ➔ Phân rã checklist tác vụ TDD (Red-Green-Refactor) trong `tasks.md`.
     5. `/speckit-analyze` ➔ Rà soát khớp nối chéo ở chế độ chỉ đọc trước khi chạm code.
     6. `/speckit-implement` ➔ Viết code theo từng task, kiểm thử pass 100%.

2. **Tiết kiệm token & CodeGraph-First**:
   - Chỉ đọc `SKILL.md` của tối đa 1-2 skill có liên quan trực tiếp đến prompt. Không nạp hàng loạt.
   - Luôn dùng `codegraph explore` để tra cứu hàm, class và call graph thay vì grep/find quét file.

3. **Phân vai chuẩn xác**:
   - `BA`: `.agent/BA/` (`spec-driven-development`, `docx`, `interview-me`)
   - `FE`: `.agent/FE/` (`frontend-ui-engineering`, `react-i18n-theming`, `ui-ux-pro-max`, `vitest-skill`)
   - `BE`: `.agent/BE/` (`spring-boot-best-practices`, `spring-data-jpa-patterns`, `spring-security-jwt-guide`, `api-and-interface-design`)
   - `TESTER`: `.agent/TESTER/` (`junit-5-skill`, `playwright-skill`, `api-skill`, `test-driven-development`)
   - `QA`: `.agent/QA/` (`code-review-and-quality`, `cicd-pipeline-skill`, `git-workflow-and-versioning`)
   - `QC`: `.agent/QC/` (`insecure-defaults`, `sharp-edges`, `static-analysis`, `security-threat-model`)

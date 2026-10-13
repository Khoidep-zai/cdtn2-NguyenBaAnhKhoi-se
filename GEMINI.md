# CDTN2 AGENT INSTRUCTIONS (GEMINI.MD)

Xem chi tiết quy tắc điều hướng toàn diện và tiết kiệm token tại: [AGENTS.md](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/AGENTS.md) và bản đồ 46 skills tại [SKILLS_ROUTING_INDEX.md](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev_main/cdtn2-NguyenBaAnhKhoi-se/.agent/SKILLS_ROUTING_INDEX.md)

## Tóm tắt nguyên tắc kích hoạt Skill:
1. **Tiết kiệm token**: Chỉ đọc `SKILL.md` của tối đa 1-2 skill có liên quan trực tiếp đến prompt của người dùng. Không nạp hàng loạt.
2. **Đúng vai trò**:
   - `BA`: `.agent/BA/` (`spec-driven-development`, `docx`, `interview-me`)
   - `FE`: `.agent/FE/` (`frontend-ui-engineering`, `react-i18n-theming`, `ui-ux-pro-max`, `vitest-skill`)
   - `BE`: `.agent/BE/` (`spring-boot-best-practices`, `spring-data-jpa-patterns`, `spring-security-jwt-guide`, `api-and-interface-design`)
   - `TESTER`: `.agent/TESTER/` (`junit-5-skill`, `playwright-skill`, `api-skill`, `test-driven-development`)
   - `QA`: `.agent/QA/` (`code-review-and-quality`, `cicd-pipeline-skill`, `git-workflow-and-versioning`)
   - `QC`: `.agent/QC/` (`insecure-defaults`, `sharp-edges`, `static-analysis`, `security-threat-model`)
3. **Thước đo tiêu chuẩn**: Tra cứu checklist tương ứng tại `.agent/_shared/references/` (`definition-of-done.md`, `security-checklist.md`, `performance-checklist.md`...).

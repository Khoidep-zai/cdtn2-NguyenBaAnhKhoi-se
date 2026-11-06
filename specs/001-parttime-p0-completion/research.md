# Research & Technical Decisions: Part-time P0 Gap Completion

**Feature**: `001-parttime-p0-completion`  
**Date**: 2026-11-06  
**Status**: Completed  

---

## 1. Technical Context & Baseline

- **Backend Stack**: Java 17/21, Spring Boot 3.2.x, Spring Data JPA, Spring Security 6 (Stateless JWT HS256), Bean Validation (Jakarta).
- **Database Engine**: Dual DB architecture (PostgreSQL 16 & MySQL 8, with H2 in-memory for testing).
- **Frontend Stack**: React 18, TypeScript, Vite, Pure CSS Modules with Design Tokens (`variables.css`), Context API (`AuthContext`, `ThemeContext`, `LanguageContext` song ngữ VI/EN).
- **Core Principles**: Strictly adhere to [constitution.md](file:///c:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/.specify/memory/constitution.md):
  - Layered Clean Architecture (Controller $\rightarrow$ Service $\rightarrow$ Repository $\rightarrow$ Entity/DTO).
  - Never leak JPA entities out of Controller (`ApiResponse<T>` wrapper with DTOs).
  - Zero IDOR vulnerability (owner validation at Service layer).
  - Zero SQL injection & N+1 query prevention (`@EntityGraph` / `JOIN FETCH`).

---

## 2. Unknowns & Technical Decisions

### Decision 1: Job Moderation Workflow & State Transitions
- **Context**: Currently, when an Employer posts a job via `POST /api/v1/jobs`, it is immediately set to status `OPEN`, exposing it publicly without admin review.
- **Decision**:
  - Add `PENDING_REVIEW` and `REJECTED` to the valid job statuses: `PENDING_REVIEW`, `OPEN`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`, `REJECTED`.
  - When an Employer creates a job, default status is `PENDING_REVIEW`. (If an Admin creates a job, it can be immediately `OPEN`).
  - Add Admin endpoints:
    - `GET /api/v1/admin/jobs/pending` (paginated).
    - `PATCH /api/v1/admin/jobs/{id}/review` with payload `{ "action": "APPROVE" | "REJECT", "reason": "string" }`.
  - On approval: Status $\rightarrow$ `OPEN`. Auto-send Notification to Employer.
  - On rejection: Status $\rightarrow$ `REJECTED`. Auto-send Notification to Employer with explanation.
  - Public `GET /api/v1/jobs` search query ONLY fetches jobs where `status = 'OPEN'` and `employer.isActive = true`.
- **Alternatives Considered**:
  - *Auto-approve for verified employers only*: Rejected for MVP to ensure 100% of jobs undergo human check, guaranteeing zero fraudulent job listings.

### Decision 2: Scam Report Architecture & Anti-Spam Strategy
- **Context**: Part-time students often encounter scams (advance fee fraud, deposit requests, multi-level marketing). The system needs a reporting channel and warning banners.
- **Decision**:
  - Create table `reports` with: `reporter_id`, `job_id`, `reason` (Enum/String: `SCAM_DEPOSIT`, `FALSE_INFO`, `HARASSMENT`, `OTHER`), `description`, `status` (`PENDING`, `RESOLVED`, `DISMISSED`), `resolved_by`, `resolution_notes`, timestamps.
  - Rate limiting & Anti-spam: A student can only have 1 `PENDING` report per job (`findByReporterIdAndJobIdAndStatus(reporterId, jobId, "PENDING")`).
  - Admin Resolution Actions:
    - `DISMISS`: Dismiss false report.
    - `RESOLVE_REMOVE_JOB`: Set job status to `CLOSED` or delete job, prevent new applications.
    - `RESOLVE_BAN_EMPLOYER`: Set employer `isActive = false`, automatically revoking JWT access and closing all employer jobs.
- **Alternatives Considered**:
  - *Anonymous reporting*: Rejected because authenticated reports prevent malicious competitors from spamming fake complaints against legitimate businesses.

### Decision 3: Part-time Shift Standardization
- **Context**: `Job.java` currently has a loose string field `workingHours` (e.g. "Ca tối 17h-22h"). It is impossible to filter programmatically.
- **Decision**:
  - Add column `shift_type` (`VARCHAR(50)`) with standardized values:
    - `MORNING` (Ca sáng: ~06:00 - 12:00)
    - `AFTERNOON` (Ca chiều: ~12:00 - 18:00)
    - `EVENING` (Ca tối: ~18:00 - 23:00)
    - `WEEKEND` (Cuối tuần: T7, CN)
    - `FLEXIBLE` (Linh hoạt: thỏa thuận theo lịch học)
  - Keep `working_hours` for detailed notes (e.g., "Thứ 2, 4, 6 từ 18:00 đến 22:00") for backward compatibility.
  - Update `JobRepository.searchJobs` query: Add optional parameter `:shiftType IS NULL OR j.shiftType = :shiftType`.
  - Frontend: Add shift filter chips on `JobBrowsePage.tsx`.

### Decision 4: Secure Password Reset Mechanism
- **Context**: The application lacks a password recovery mechanism (`ST-01`).
- **Decision**:
  - Create table `password_reset_tokens`: `token` (UUID v4), `user_id`, `expiry_date` (15 minutes lifespan), `used` (boolean).
  - Request endpoint: `POST /api/v1/auth/forgot-password` (`email`).
    - Security: Always return HTTP 200 with standard message: *"Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi"* (prevents account enumeration attacks).
    - In local development mode without external paid SMTP services: generate token, store in DB, log token to server console, and return a demo helper link in non-production profiles so developers/testers can verify the flow end-to-end.
  - Reset endpoint: `POST /api/v1/auth/reset-password` (`token`, `newPassword`).
    - Validates token existence, expiry (`expiryDate.isAfter(LocalDateTime.now())`), and `!used`.
    - Updates BCrypt password hash in `users` table and marks token `used = true`.

---

## 3. Database Schema Migration Plan

A migration script `database/migrations/V2__add_job_moderation_reports_and_shifts.sql` will be created to:
1. Add column `shift_type VARCHAR(50) DEFAULT 'FLEXIBLE'` to `jobs`.
2. Update default job status handling to include `PENDING_REVIEW` and `REJECTED`.
3. Create table `reports` with foreign keys to `users` and `jobs`.
4. Create table `password_reset_tokens` with foreign key to `users`.
5. Add indexes: `idx_reports_job_id`, `idx_reports_status`, `idx_jobs_shift_type`, `idx_reset_tokens_token`.


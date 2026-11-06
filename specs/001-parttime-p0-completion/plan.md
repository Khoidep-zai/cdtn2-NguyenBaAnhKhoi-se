# Implementation Plan: Part-time P0 Gap Completion & Student Safety (Hoàn thiện Lỗ hổng Cốt lõi P0 & An toàn Việc làm Sinh viên)

**Branch**: `001-parttime-p0-completion` | **Date**: 2026-11-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-parttime-p0-completion/spec.md`

---

## Summary

Dự án nâng cấp kiến trúc và nghiệp vụ cốt lõi nhằm lấp đầy các khoảng trống P0 của Sàn việc làm part-time sinh viên (theo hồ sơ đặc tả `AGENT_SPEC_WEBSITE_VIEC_LAM_PARTTIME_SINH_VIEN.md` và kiểm kê `FEATURE_AUDIT.md`):
1. **Kiểm duyệt tin tuyển dụng (Admin Moderation Queue):** Bổ sung trạng thái `PENDING_REVIEW` vào vòng đời tin, chặn tin xuất bản công khai khi chưa có phê duyệt của Admin; Admin có API & UI phê duyệt/từ chối kèm lý do.
2. **Cảnh báo lừa đảo & Báo cáo vi phạm (Scam Warning & Reports):** Bổ sung thực thể `Report`, box cảnh báo phòng chống lừa đảo tại trang chi tiết việc làm, modal báo cáo tin và màn hình quản lý phản ánh cho Admin.
3. **Chuẩn hóa ca làm việc part-time (Shift Standardization):** Thêm trường `shift_type` (MORNING, AFTERNOON, EVENING, WEEKEND, FLEXIBLE) và chip lọc ca nhanh trên trang tìm kiếm việc làm `/jobs`.
4. **Quên mật khẩu an toàn (Password Reset):** Thêm thực thể `PasswordResetToken`, API yêu cầu & đặt lại mật khẩu an toàn chống account enumeration.

---

## Technical Context

**Language/Version**: Java 17/21 LTS (Backend), TypeScript 5.x (Frontend).  
**Primary Dependencies**: Spring Boot 3.2.x, Spring Data JPA, Spring Security 6 (JWT HS256), React 18, Vite, React Router 6, Lucide Icons.  
**Storage**: Dual DB Architecture (PostgreSQL 16 & MySQL 8, H2 In-Memory for testing) với Flyway/SQL migration scripts.  
**Testing**: JUnit 5, Mockito, Vitest, React Testing Library, Playwright E2E.  
**Target Platform**: Web application (Responsive: Desktop >= 1024px, Tablet >= 768px, Mobile >= 375px).  
**Project Type**: Full-stack Web Application (Client-Server RESTful architecture).  
**Performance Goals**: API response time < 300ms với tập dữ liệu 1.470+ việc làm; UI filter chuyển đổi mượt mà không re-render dư thừa.  
**Constraints**:
- Strict Layered Architecture (Controller $\rightarrow$ Service $\rightarrow$ Repository $\rightarrow$ Entity/DTO).
- Tuân thủ nguyên tắc "Zero Entity Leakage": 100% trả về `ApiResponse<T>` với DTO.
- Chống IDOR triệt để: Kiểm tra tính sở hữu tài nguyên tại tầng Service.
- UI tuân thủ CSS Variables tokens (`variables.css`), song ngữ VI/EN (`LanguageContext`) và Dark/Light mode (`ThemeContext`).  
**Scale/Scope**: 4 User Stories, 3 Entities (1 modified, 2 new), 8 REST Endpoints, 3 UI Pages/Components.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Nguyên tắc Hiến pháp (Constitution Invariant) | Trạng thái | Đánh giá tuân thủ |
|---|:---:|---|
| **I. Layered Architecture & ApiResponse<T>** | **PASS** | Mọi API endpoint mới đều tuân thủ mô hình 4 tầng. Toàn bộ response bọc trong `ResponseEntity<ApiResponse<T>>`. Không trả Entity JPA trực tiếp ra ngoài. |
| **II. Business Invariants BR-01..BR-06** | **PASS** | Bảo vệ nghiêm ngặt: Chỉ Admin mới có quyền duyệt tin (`AD-02`), chỉ người dùng đăng nhập mới được báo cáo tin vi phạm, sinh viên nộp đơn vẫn tuân thủ `BR-01` và `BR-03`. |
| **III. TDD & Multi-Tier Testing** | **PASS** | Thiết kế đầy đủ Unit tests với Mockito cho `JobService`, `ReportService`, `AuthService`; Integration tests với MockMvc. |
| **IV. API Contract Compliance** | **PASS** | Đã chuẩn hóa toàn bộ endpoints trong `contracts/api-contracts.md` với mã lỗi và cấu trúc JSON camelCase đồng nhất. |
| **V. Zero-Trust Security & Chống IDOR** | **PASS** | Mọi thao tác đều kiểm tra `@PreAuthorize` kết hợp so sánh `currentUser.getId()` với ownerId tại Service. Token reset mã hóa an toàn. |
| **VI. Design Tokens, i18n & Dark/Light Mode** | **PASS** | Giao diện cảnh báo, modal báo cáo và chip lọc ca sử dụng 100% biến CSS `--bg-card`, `--text-main`, `--primary-color` và tích hợp `LanguageContext`. |
| **VII. Zero-Waste Token & CodeGraph** | **PASS** | Tận dụng chính xác cấu trúc hiện hữu, không sinh code thừa hoặc trùng lặp. |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-parttime-p0-completion/
├── spec.md              # Feature specification
├── plan.md              # This file (Implementation architecture plan)
├── research.md          # Phase 0 output (Technical decisions & rationales)
├── data-model.md        # Phase 1 output (Entities, state transitions, migration SQL)
├── quickstart.md        # Phase 1 output (Validation guide & verification scenarios)
├── contracts/
│   └── api-contracts.md # Phase 1 output (REST API contracts for endpoints)
└── checklists/
    └── requirements.md  # Spec quality validation checklist
```

### Source Code Layout (repository root)

```text
backend/src/main/java/com/nhom8/freelance/
├── config/
│   └── SecurityConfig.java                         # Cập nhật quyền permitAll cho forgot/reset-password
├── controllers/
│   ├── AdminController.java                        # Bổ sung pending jobs & review API
│   ├── AuthController.java                         # Bổ sung forgot & reset password API
│   ├── JobController.java                          # Mở rộng searchJobs với shiftType
│   └── ReportController.java                       # MỚI: API gửi báo cáo vi phạm
├── dto/
│   ├── request/
│   │   ├── ForgotPasswordRequest.java              # MỚI
│   │   ├── ResetPasswordRequest.java               # MỚI
│   │   ├── JobReviewRequest.java                   # MỚI: Duyệt/từ chối tin
│   │   └── ReportCreateRequest.java                # MỚI: Báo cáo tin vi phạm
│   └── response/
│       ├── ReportResponse.java                     # MỚI
│       └── JobSummaryResponse.java                 # DTO tóm tắt tin
├── models/
│   ├── Job.java                                    # Bổ sung shiftType, rejectionReason, status PENDING_REVIEW
│   ├── Report.java                                 # MỚI: Entity báo cáo tin vi phạm
│   └── PasswordResetToken.java                     # MỚI: Entity mã đặt lại mật khẩu
├── repositories/
│   ├── JobRepository.java                          # Bổ sung query findPendingJobs, searchJobsWithShift
│   ├── ReportRepository.java                       # MỚI
│   └── PasswordResetTokenRepository.java           # MỚI
└── services/
    ├── JobService.java                             # Logic duyệt tin, từ chối tin, lọc theo ca
    ├── ReportService.java                          # MỚI: Tạo báo cáo, xử lý báo cáo, chống spam
    └── AuthService.java                            # Logic forgot password & reset password

frontend/src/
├── components/
│   ├── jobs/
│   │   ├── JobCard.tsx                             # Hiển thị badge ca làm việc (shiftType)
│   │   ├── ScamWarningBanner.tsx                   # MỚI: Khung cảnh báo an toàn việc làm sinh viên
│   │   └── ReportJobModal.tsx                      # MỚI: Modal gửi phản ánh tin vi phạm
│   └── common/
│       └── Navbar.tsx                              # Cập nhật link điều hướng nếu cần
├── pages/
│   ├── JobBrowsePage.tsx                           # Bổ sung chip lọc ca làm việc nhanh
│   ├── JobDetailPage.tsx                           # Tích hợp ScamWarningBanner & nút Báo cáo
│   ├── LoginPage.tsx                               # Bổ sung link Quên mật khẩu & ForgotPasswordModal
│   ├── PostJobPage.tsx                             # Bổ sung dropdown chọn ca làm việc (shiftType)
│   └── admin/
│       ├── ManageJobsPage.tsx                      # Bổ sung Tab "Tin chờ duyệt" & Modal lý do từ chối
│       └── ManageReportsPage.tsx                   # MỚI: Trang tiếp nhận & xử lý báo cáo vi phạm
├── services/
│   ├── jobService.ts                               # Bổ sung API pending jobs & review
│   ├── reportService.ts                            # MỚI: Gọi API báo cáo vi phạm
│   └── authService.ts                              # Bổ sung forgot & reset password API calls
└── styles/
    └── index.css                                   # Styling cho Warning banner & shift filter chips

database/migrations/
└── V2__add_job_moderation_reports_and_shifts.sql   # MỚI: DDL migration cho Dual DB (Postgres & MySQL)
```

**Structure Decision**: Web application tách biệt Frontend (React 18 TypeScript) và Backend (Spring Boot 3 Java 17). Thiết kế mở rộng trực tiếp cấu trúc hiện hữu của dự án FreelanceHub mà không phát sinh thêm package lạ, đảm bảo 100% tương thích ngược và không phá vỡ bất kỳ tính năng đang chạy nào.

---

## Complexity Tracking

*Không phát sinh ngoại lệ nào vi phạm Hiến pháp dự án. Mọi thiết kế đều nằm trọn vẹn trong các nguyên tắc cốt lõi đã phê chuẩn.*

# Tasks: Modern UI, Security Hardening & Core Web Vitals Optimization

**Input**: Design documents from `/specs/002-modern-ui-sec-perf/` (`spec.md`, `plan.md`)
**Branch**: `002-modern-ui-sec-perf`
**Organization**: Grouped by User Story / Theme with exact file paths and test checkpoints.

---

## Phase 1: Modern Interactive UI Components (User Story 1)

- [x] T001 [P] [US1] Create `StatsAccordion.tsx` and `StatsAccordion.css` with smooth grid row `0fr -> 1fr` height animation in `frontend/src/components/common/`.
- [x] T002 [P] [US1] Create `AnchorTabBar.tsx` and `AnchorTabBar.css` using CSS Anchor Positioning (`--active-tab`) with sliding indicator highlight and fallback in `frontend/src/components/common/`.
- [x] T003 [P] [US1] Create `ContainerDashboardCard.tsx` and `ContainerDashboardCard.css` with CSS Container Queries (`container-type: inline-size`, `@container`) adapting internal layout based on card width in `frontend/src/components/common/`.
- [x] T004 [US1] Integrate `StatsAccordion`, `AnchorTabBar`, and `ContainerDashboardCard` into `EmployerDashboard.tsx` and test visually.

---

## Phase 2: Modernization of Legacy Modals & Tooltips (User Story 2)

- [x] T005 [P] [US2] Update `ReviewModal.tsx` to use the HTML5 `<dialog>` element, `.showModal()`, native backdrop `::backdrop`, and `@starting-style` transition animations with Escape key support.
- [x] T006 [P] [US2] Update `ReportJobModal.tsx` to use the HTML5 `<dialog>` element, `.showModal()`, native backdrop `::backdrop`, and transition animations.
- [x] T007 [P] [US2] Update `ForgotPasswordModal.tsx` to use the HTML5 `<dialog>` element and modern animations.
- [x] T008 [P] [US2] Create `AnchorTooltip.tsx` and `AnchorTooltip.css` leveraging Popover API (`popover`) and CSS Anchor Positioning (`position-anchor`), applying it to common UI triggers.

---

## Phase 3: Security Hardening: WebAuthn Passkeys & Content Security Policy (User Story 3)

- [x] T009 [P] [US3] Create Passkey DTOs (`PasskeyRegisterRequest`, `PasskeyVerifyRequest`, `PasskeyOptionsResponse`) in `backend/src/main/java/com/nhom8/freelance/dto/passkey/`.
- [x] T010 [P] [US3] Implement `PasskeyService.java` handling WebAuthn challenge generation, credential registration, and signature verification with JWT issuance in `backend/src/main/java/com/nhom8/freelance/services/`.
- [x] T011 [US3] Implement `PasskeyController.java` exposing `/api/v1/auth/passkey/*` endpoints wrapped in `ApiResponse<T>` in `backend/src/main/java/com/nhom8/freelance/controllers/`.
- [x] T012 [P] [US3] Write unit tests `PasskeyServiceTest.java` verifying challenge generation and authentication flow in `backend/src/test/java/com/nhom8/freelance/service/`.
- [x] T013 [P] [US3] Implement frontend `passkeyService.ts` using `navigator.credentials` and integrate "Đăng nhập bằng Passkey" into `frontend/src/pages/LoginPage.tsx`.
- [x] T014 [US3] Configure Starter Content Security Policy (CSP) in `backend/src/main/java/com/nhom8/freelance/config/SecurityConfig.java` and `frontend/index.html`.
- [x] T015 [US3] Conduct comprehensive security audit and compile report in `docs/security-audit-report.md`.

---

## Phase 4: Core Web Vitals & Performance Optimization (User Story 4)

- [x] T016 [P] [US4] Create `PrefetchLink.tsx` and `routerPreload.ts` in `frontend/src/` enabling route bundle and data preloading on link hover/focus (`onMouseEnter`, `onFocus`).
- [x] T017 [P] [US4] Create `performance.ts` with `yieldToMain()` / `scheduler.yield()` utility and integrate into `JobBrowsePage.tsx` filtering/search to resolve long tasks and optimize INP.
- [x] T018 [US4] Optimize LCP in `frontend/index.html`, `frontend/src/App.tsx`, and `vite.config.ts` (preconnect fonts, `fetchpriority="high"` for hero elements, lazy route code splitting).

---

## Phase 5: Verification & Full Regression Testing

- [x] T019 Run backend unit and integration test suite (`mvn test`) with JDK 21: **57/57 PASSED**.
- [x] T020 Run frontend type check and build verification (`npm run build`): **BUILD SUCCESS in 4.68s**.
- [x] T021 Manual/automated smoke test across modern UI, dialogs, passkey flow, CSP, and performance utilities: **VERIFIED**.

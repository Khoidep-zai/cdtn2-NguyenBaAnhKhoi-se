# Feature Specification: Modern UI, Security Hardening & Core Web Vitals Optimization

**Feature Branch**: `002-modern-ui-sec-perf`
**Created**: 2026-11-13
**Status**: Ready for Planning
**Input**: 11 targeted improvements covering Modern UX Components, Legacy Code Modernization, Security Hardening (WebAuthn Passkeys & CSP), and Performance Optimization (INP, LCP, Link Preloading).

---

## 1. User Scenarios & Acceptance Criteria

### User Story 1 - Modern Interactive UI Experience (Priority: P1)
As a student or employer, I want responsive, high-performance UI components with smooth animations that look clean and adjust dynamically to different screen and container dimensions.

**Key Deliverables:**
1. **Accordion-Style Stats Component:** A collapsible statistics summary widget that smoothly animates open/close transitions (using CSS `interpolate-size: allow-keywords` or CSS grid row transition `0fr -> 1fr`).
2. **Anchor-Positioned Tab Bar:** Navigation / status filtering tab bar featuring a sliding highlight indicator that accurately tracks the active tab using CSS Anchor Positioning (`position-anchor: --active-tab`, `left: anchor(left)`, `right: anchor(right)`) with seamless fallback.
3. **Container-Query Dashboard Card:** A dashboard metric card that responds to its own container width (`@container (min-width: 320px)` and `@container (min-width: 480px)`) rather than the global browser window viewport.

**Acceptance Scenarios:**
- Given an employer or student viewing the dashboard, when clicking an accordion stats header, the content expands/collapses with a fluid CSS animation without jumping.
- Given the job status tab bar, when switching tabs, the highlight element slides smoothly to the active tab via CSS anchor positioning (or fallback transform).
- Given a dashboard layout resizing between single column and multi-column, the container-query cards adjust internal layout (stacked vs side-by-side badges/metrics) based on their container size.

---

### User Story 2 - Modernization of Legacy Modals & Tooltips (Priority: P1)
As a developer and end-user, I want standard, accessible HTML5 elements for modal dialogs and tooltips that leverage browser-native capabilities rather than ad-hoc absolute `<div>` overlays.

**Key Deliverables:**
1. **Native `<dialog>` Modals:** Migrate legacy modal implementations (`ReviewModal`, `ReportJobModal`, `ForgotPasswordModal`) to native HTML5 `<dialog>` elements utilizing `showModal()`, backdrop styling via `::backdrop`, and modern `@starting-style` / CSS transition animations for opening and closing.
2. **Popover API & Anchor-Positioned Tooltips:** Migrate tooltips to the native Popover API (`popover="auto"` or `popover="hint"`) anchored to target elements via CSS Anchor Positioning (`position-anchor`, `top: anchor(bottom)`), with robust fallback.

**Acceptance Scenarios:**
- Given a user opening `ReviewModal` or `ReportJobModal`, the modal opens using `.showModal()`, traps focus natively, dims the background via `::backdrop`, and smoothly fades/scales in with `@starting-style`. Pressing `Escape` closes the modal cleanly.
- Given a user hovering over badges, action buttons, or mascot tips, tooltips appear anchored directly to the triggering element using the Popover API and anchor positions without layout shifts.

---

### User Story 3 - Security Hardening: WebAuthn Passkeys & Content Security Policy (Priority: P1)
As a security-conscious platform user, I want passwordless authentication via WebAuthn Passkeys and strong browser-enforced security headers that protect against XSS and clickjacking.

**Key Deliverables:**
1. **Passkey / WebAuthn Authentication:**
   - Backend: Spring Boot endpoints `/api/v1/auth/passkey/register-options`, `/api/v1/auth/passkey/register`, `/api/v1/auth/passkey/login-options`, `/api/v1/auth/passkey/verify-login`.
   - Frontend: WebAuthn browser client utilizing `navigator.credentials.create` and `navigator.credentials.get` (with conditional UI support `mediation: 'conditional'` for autofill passkeys).
2. **Starter Content Security Policy (CSP):**
   - Configured in Spring Boot `SecurityConfig.java` and HTML `<meta http-equiv="Content-Security-Policy">` providing safe defaults:
     `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:8080 http://localhost:5173;`
3. **Comprehensive Security Audit Report:**
   - In-depth evaluation of JWT handling, IDOR prevention, CORS, Passkeys, CSP, and dependency vulnerabilities with actionable remediation suggestions.

**Acceptance Scenarios:**
- Given a registered user, they can register a biometric/hardware Passkey and log in via fingerprint/Face ID/Windows Hello without typing their password.
- Given a browser loading the frontend, CSP headers allow legitimate API calls, fonts, and assets while strictly blocking unauthorized inline scripts and untrusted framing.

---

### User Story 4 - Core Web Vitals & Performance Optimization (Priority: P2)
As a user on a mobile or low-end device, I want pages to load instantly (LCP < 2.5s) and clicks to respond immediately without UI freezes (INP < 200ms).

**Key Deliverables:**
1. **Link Hover Preloading:** A custom `PrefetchLink` component and router preloader that triggers route and data prefetching on link hover / focus (`onMouseEnter`, `onFocus`).
2. **INP Long Task Optimization:**
   - Introduce `yieldToMain()` utility utilizing `scheduler.yield()` (with fallback to `requestIdleCallback` / `setTimeout(..., 0)`).
   - Wrap heavy filtering, search parsing, and data manipulation in `startTransition` and scheduler yields to keep main-thread interaction responsive.
3. **LCP Optimization:**
   - Optimize hero banners, preconnect critical font origins, set `fetchpriority="high"` for hero visuals, and implement lazy code-splitting for heavy non-critical routes.

**Acceptance Scenarios:**
- Given a user hovering over "Việc làm" or "Dashboard", the corresponding route chunk and prefetch triggers before click, reducing perceived navigation latency to near zero.
- Given high search/filtering activity on the Jobs page, typing and clicking inputs remain snappy (< 50ms input delay, INP < 200ms).
- Given a cold page load, LCP element renders within 2.0s without render-blocking font flashes.

---

## 2. Requirements Matrix

| ID | Requirement | Category | Target Files |
| :--- | :--- | :--- | :--- |
| **REQ-01** | Accordion Stats Component with smooth CSS transitions | Modern UI | `frontend/src/components/common/StatsAccordion.tsx`, `StatsAccordion.css` |
| **REQ-02** | Tab Bar with sliding highlight via CSS Anchor Positioning | Modern UI | `frontend/src/components/common/AnchorTabBar.tsx`, `AnchorTabBar.css` |
| **REQ-03** | Dashboard Card with CSS Container Queries | Modern UI | `frontend/src/components/common/ContainerDashboardCard.tsx`, `ContainerDashboardCard.css` |
| **REQ-04** | Migrate modals to native `<dialog>` with animations | Modernization | `ReviewModal.tsx`, `ReportJobModal.tsx`, `ForgotPasswordModal.tsx` |
| **REQ-05** | Popover API & CSS Anchor-positioned Tooltip | Modernization | `frontend/src/components/common/AnchorTooltip.tsx`, `AnchorTooltip.css` |
| **REQ-06** | WebAuthn Passkeys Authentication flow | Security | Backend: `PasskeyController.java`, `PasskeyService.java`; Frontend: `webauthn.ts`, `LoginPage.tsx` |
| **REQ-07** | Starter Content Security Policy (CSP) | Security | `SecurityConfig.java`, `frontend/index.html` |
| **REQ-08** | Security Audit & Documentation | Security | `docs/security-audit-report.md` |
| **REQ-09** | Link Hover Preloading | Performance | `frontend/src/components/common/PrefetchLink.tsx`, `routerPreload.ts` |
| **REQ-10** | INP Long-task mitigation & `yieldToMain()` | Performance | `frontend/src/utils/performance.ts`, `JobsPage.tsx` |
| **REQ-11** | LCP Optimization & Resource Hints | Performance | `frontend/index.html`, `frontend/src/App.tsx`, `vite.config.ts` |

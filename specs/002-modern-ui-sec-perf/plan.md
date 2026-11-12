# Implementation Plan: Modern UI, Security Hardening & Core Web Vitals Optimization

**Branch**: `002-modern-ui-sec-perf` | **Date**: 2026-11-13 | **Spec**: [spec.md](file:///C:/O%20E/Chuyen%20de%202/Project/Nhom%208_dev/cdtn2-NguyenBaAnhKhoi-se_test/specs/002-modern-ui-sec-perf/spec.md)

## Summary
Implement 11 core modernizations across 4 tracks:
1. **Modern UX Components**: Accordion-style stats with smooth open/close animations, Anchor-positioned tab bar sliding highlight, Container Query-based responsive dashboard card.
2. **Legacy Modernization**: Upgrade legacy modals to HTML5 `<dialog>` with modern CSS animations (`::backdrop`, `@starting-style`), migrate legacy tooltips to Popover API and CSS Anchor Positioning.
3. **Security Hardening**: Implement WebAuthn Passkeys login (backend Spring Boot endpoints + frontend biometric auth), configure starter Content Security Policy (CSP), perform security audit report.
4. **Performance & Core Web Vitals**: Link hover preloading, INP long-task splitting via `yieldToMain()` / `scheduler.yield()`, and LCP optimization (critical resource hints and route code-splitting).

---

## Technical Context
- **Frontend**: React 18, TypeScript 5.2, Vite 5.1, Lucide React, Modern CSS (Anchor Positioning, Popover API, Container Queries, CSS Grid).
- **Backend**: Java 17/21, Spring Boot 3.2.4, Spring Security 6, Maven 3.9, H2/MySQL.
- **Testing**:
  - Backend: JUnit 5, Mockito (`mvn test`).
  - Frontend: TypeScript check (`tsc`) & Vite production bundle verification (`npm run build`).

---

## Constitution Check
- **Principle I (Layered Architecture):** New Passkey endpoints live in `PasskeyController` delegating strictly to `PasskeyService` returning `ResponseEntity<ApiResponse<T>>`.
- **Principle V (Fail-Secure & Stateless):** Passkey authentication issues standard signed JWT upon verification; CSP prevents unauthorized script execution without leaking session state.
- **Principle VI (Design Tokens & WCAG):** Modern UI components reuse CSS custom properties (`var(--primary)`, `var(--bg-card)`, etc.) and maintain keyboard accessibility (`Escape` on dialogs, tab index, ARIA attributes).
- **Principle VIII (Modern Web APIs & Web Vitals):** Strict conformance to `<dialog>`, Popover API, Anchor Positioning, Container Queries, `yieldToMain()`, and LCP optimizations.

---

## Architecture & Implementation Blueprint

```text
cdtn2-NguyenBaAnhKhoi-se_test/
├── backend/
│   ├── src/main/java/com/nhom8/freelance/
│   │   ├── config/
│   │   │   └── SecurityConfig.java                     # Add CSP header configuration
│   │   ├── controllers/
│   │   │   └── PasskeyController.java                  # WebAuthn options and verification endpoints
│   │   ├── dto/
│   │   │   └── passkey/                                # Passkey challenge and credential DTOs
│   │   └── services/
│   │       └── PasskeyService.java                     # WebAuthn challenge generation & verification
│   └── src/test/java/com/nhom8/freelance/
│       └── service/PasskeyServiceTest.java             # Unit tests for passkey service
├── frontend/
│   ├── index.html                                      # Starter CSP meta tag & LCP font/resource hints
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── StatsAccordion.tsx                  # Task 1: Smooth animating accordion stats
│   │   │   │   ├── StatsAccordion.css
│   │   │   │   ├── AnchorTabBar.tsx                    # Task 2: Anchor positioned sliding highlight tab bar
│   │   │   │   ├── AnchorTabBar.css
│   │   │   │   ├── ContainerDashboardCard.tsx          # Task 3: Container query adaptive card
│   │   │   │   ├── ContainerDashboardCard.css
│   │   │   │   ├── AnchorTooltip.tsx                   # Task 5: Popover API + Anchor positioning tooltip
│   │   │   │   ├── AnchorTooltip.css
│   │   │   │   ├── PrefetchLink.tsx                    # Task 9: Link hover preloading component
│   │   │   │   └── ForgotPasswordModal.tsx             # Task 4: Upgraded to <dialog>
│   │   │   ├── jobs/
│   │   │   │   └── ReportJobModal.tsx                  # Task 4: Upgraded to <dialog>
│   │   │   └── review/
│   │   │       └── ReviewModal.tsx                     # Task 4: Upgraded to <dialog>
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx                           # Task 6: Passkey button & autofill UI
│   │   │   ├── employer/EmployerDashboard.tsx          # Integration of modern stats & tabs
│   │   │   └── JobsPage.tsx                            # Task 10: INP optimization with yieldToMain
│   │   ├── services/
│   │   │   └── passkeyService.ts                       # Task 6: WebAuthn browser API integration
│   │   └── utils/
│   │       ├── performance.ts                          # Task 10: yieldToMain() / scheduler.yield helper
│   │       └── routerPreload.ts                        # Task 9: Dynamic route chunk preloader
└── docs/
    └── security-audit-report.md                        # Task 8: Comprehensive security audit report
```

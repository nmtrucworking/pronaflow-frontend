# Functional Module 1 Completion Checklist (IAM)

## 0) Scope and Definition of Done

- [ ] Chot pham vi Module 1: Register, Login, Verify Email, Forgot/Reset Password, MFA, Session Management, RBAC, Protected Route
- [ ] Chot API contract theo tai lieu API v1.3
- [ ] Chot Definition of Done cho Module 1:
  - [ ] Hoan tat UI + integration API + xu ly loi
  - [ ] Co test (unit/integration/e2e) cho luong chinh
  - [ ] Co tai lieu su dung va checklist release

## 1) Baseline Audit (Hien trang)

- [x] Xac nhan cac thanh phan da co trong code:
  - [x] Auth service
  - [x] Auth hooks
  - [x] Auth pages (login/register/forgot/reset/verify)
  - [x] ProtectedRoute
  - [x] Auth slice
  - [x] RBAC hook
- [ ] Danh dau gap giua docs va implementation thuc te
- [ ] Lap bang TODO theo muc do uu tien (P0/P1/P2)

## 2) Authentication Flows (P0)

### 2.1 Register
- [x] Validate form phia client (email, username, password, full_name)
- [x] Enforce password policy tuong thich backend
- [x] Xu ly response pending_verification
- [x] Dieu huong sang trang thong bao xac minh email

### 2.2 Login
- [x] Xu ly login thanh cong + luu token an toan
- [x] Xu ly mfa_required = true
- [x] Xu ly tai khoan chua verify email
- [x] Xu ly lockout/rate-limit thong diep ro rang

### 2.3 Verify Email
- [x] Verify bang user_id + token tu URL
- [x] UX cho cac trang thai: loading/success/expired/invalid
- [x] Resend verification email flow

### 2.4 Forgot + Reset Password
- [x] Forgot password form + thong bao neutral (khong lo email ton tai)
- [x] Reset confirm page + token validation
- [x] Rule password moi + confirm password
- [x] UX thong bao reset thanh cong + dieu huong login

## 3) MFA / 2FA (P0-P1)

- [ ] Enable MFA: nhan secret + QR + backup codes
- [ ] Confirm MFA bang TOTP 6 so
- [ ] Login voi MFA step
- [ ] Disable MFA (yeu cau password/TOTP theo backend)
- [ ] Hien thi/luu backup codes an toan (khong hien lai thong tin nhay cam sai nguyen tac)
- [ ] Xu ly drift time va ma het han

## 4) Session Management (P1)

- [ ] Trang danh sach active sessions
- [ ] Danh dau current session
- [ ] Revoke 1 session
- [ ] Revoke all other sessions
- [ ] Xu ly truong hop token bi revoke (auto logout + redirect)

## 5) RBAC + Route Guards (P0)

- [x] Chuan hoa role enum va permission map
- [x] Kiem tra hasRole / hasPermission / hasAnyRole / hasAllRoles
- [x] ProtectedRoute ho tro requiredRoles
- [x] Unauthorized route va fallback UX ro rang
- [ ] Test truong hop user khong co role hop le

## 6) Security Hardening (P0)

- [x] Khong log token/password/MFA code ra console
- [x] Axios interceptor xu ly 401 + refresh token + retry 1 lan
- [x] Tranh race-condition khi refresh token dong thoi
- [x] Sanitization error message (khong leak thong tin nhay cam)
- [ ] Kiem tra CORS/HTTPS assumptions cho moi truong production

## 7) State and UX Quality (P1)

- [x] Dong bo auth state sau reload (bootstrap current user)
- [ ] Loading/skeleton cho cac trang auth
- [ ] Error boundary / toast thong nhat
- [ ] Accessibility: label, focus order, aria cho form auth
- [ ] i18n thong diep auth (neu du an da bat i18n)

## 8) Testing Checklist (P0)

### 8.1 Unit tests
- [ ] authService: request/response mapping, error mapping
- [ ] authSlice reducers
- [ ] useAuth hooks (login/register/logout/mfa/sessions)
- [ ] useRBAC permissions matrix

### 8.2 Integration tests
- [ ] Login -> Protected route
- [ ] Register -> Verify email
- [ ] Forgot -> Reset confirm
- [ ] MFA challenge flow
- [ ] Session revoke -> forced re-auth

### 8.3 E2E smoke
- [ ] Happy path login
- [ ] Invalid credentials
- [ ] Unauthorized access redirect
- [ ] Logout va truy cap lai route bao ve

## 9) Observability and Monitoring (P2)

- [ ] Tracking event auth quan trong (login success/fail, mfa enabled, password reset)
- [ ] Audit trail cho session revoke
- [ ] Dashboard metric co ban cho auth error rate

## 10) Documentation and Handover (P1)

- [ ] Cap nhat tai lieu Module 1 theo code thuc te
- [ ] Viet quick start cho dev moi
- [ ] Bo sung runbook su co auth (token expired, mfa lockout)
- [ ] Checklist go-live va rollback

## 11) Release Readiness Gate

- [ ] Tat ca P0 da complete
- [ ] Khong con bug Severity High/Critical lien quan auth
- [ ] Test pass tren CI
- [ ] Security review pass
- [ ] PM/Tech Lead sign-off

---

## Recommended Execution Order (2 tuan mau)

### Week 1
- [ ] Ngay 1-2: Baseline audit + chot P0 backlog
- [ ] Ngay 3-4: Hoan tat Register/Login/Verify/Forgot/Reset
- [ ] Ngay 5: Hoan tat RBAC + ProtectedRoute + Unauthorized UX

### Week 2
- [ ] Ngay 1-2: MFA full flow
- [ ] Ngay 3: Session management + hardening refresh token
- [ ] Ngay 4: Unit + integration test completion
- [ ] Ngay 5: E2E smoke + bugfix + release gate

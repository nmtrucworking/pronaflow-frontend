# UI Single Source of Truth (SSOT) Checklist

Ngày cập nhật: 2026-02-28
Phạm vi: apps/frontend
Mục tiêu: Ghi lại toàn bộ điểm **chưa đạt** SSOT trong UI để xử lý theo từng phase.

---

## 1) Design Tokens / Theme

- [x] **Đã chuẩn hóa CSS variables theo Tailwind theme tokens** để giảm duplicate literal giữa TS/CSS.
  - `src/index.css` hiện dùng `theme('colors...')` thay cho giá trị HEX/RGB cứng ở các token chính.
- [x] **Đã xử lý pass cuối hardcode màu trực tiếp trong feature UI** theo token/config dùng chung.
  - Ví dụ: `src/features/workspace/pages/GanttChartEnhanced.tsx`
  - Ví dụ: `src/features/projects/components/simple_mode.tsx`
  - Ví dụ: `src/features/workspace/components/Setting_workspace.tsx`
  - Ví dụ: `src/features/settings/pages/SettingsPage.tsx`
  - Ví dụ: `src/features/error/pages/Error404.tsx`, `src/features/error/pages/Error500.tsx`
  - Đã sweep thêm: `src/features/calendar/pages/CalendarPage.tsx`, `src/features/archived/pages/ArchivedPage.tsx`, `src/features/projects/components/ProjectDetails.tsx`, `src/components/layout/components/Sidebar.tsx`, `src/components/ui/CreateTaskModal.tsx`.
- [x] **Shadow/rgba custom trong các file ưu tiên của nhóm 1 đã được chuẩn hóa**.
  - Ví dụ: `src/features/workspace/pages/Member.tsx`
  - Ví dụ: `src/features/tasks/components/TaskDetailPanel.tsx`
- [x] **Theme type đã đồng bộ theo hướng hỗ trợ system preference**.
  - `src/themes/gantt-theme.ts`: `light | dark | system`
  - `src/themes/ThemeProvider.tsx`: thêm `preference` + `mode` resolved (`light|dark`).
  - `src/types/personalization.ts`: `light | dark | system`

## 2) Routing SSOT

- [x] **Đã tạo route constants tập trung** cho toàn app.
  - `src/routes/paths.ts` là nguồn SSOT cho route path (`ROUTES.*`) + helper `toChildPath`.
- [x] **Đã thay thế phần lớn path string hardcode quan trọng** bằng `ROUTES`.
  - Router chính: `src/App.tsx`
  - Security/redirect: `src/components/ProtectedRoute.tsx`, `src/lib/axiosClient.ts`
  - Services redirect: `src/services/workspaceService.ts`, `src/services/projectService.ts`, `src/services/taskService.ts`
  - Điều hướng UI: `src/components/layout/components/Sidebar.tsx`, `src/components/layout/HelpLayout.tsx`, `src/components/CommandPalette.tsx`
  - Auth/Landing/Integrations/Helper pages: các file chính trong `src/features/**/pages/*.tsx`
- [x] **Redirect login đã thống nhất theo route constants**.
  - Các điểm redirect 401 chính đã dùng `ROUTES.auth.login`.

## 3) API Client / Service SSOT

- [x] **Đã loại bỏ axios instance cục bộ** trong nhóm service ưu tiên và chuyển về client chuẩn.
  - `src/services/workspaceService.ts`
  - `src/services/projectService.ts`
  - `src/services/taskService.ts`
  - `src/services/personalizationService.ts`
  - `src/services/integrationService.ts`
- [x] **Đã chuẩn hóa dùng client chung** `src/lib/axiosClient.ts` qua factory `createApiClient(...)`.
- [x] **Đã chuẩn hóa nguồn base URL** trong `axiosClient` theo thứ tự ưu tiên `VITE_API_BASE_URL` -> `VITE_API_URL` (backward compatible).
- [x] **Đã chuẩn hóa baseURL theo domain endpoint** bằng `API_BASE_URL` + `API_ROOT_URL` để tránh lỗi `/v1/v1`.
- [x] **Đã gom interceptor về một nơi** (`attachInterceptors` trong `src/lib/axiosClient.ts`), loại bỏ lặp logic auth/error ở các service trên.

## 4) State Management SSOT

- [x] **Đã chốt ownership rõ ràng giữa Redux và Zustand**.
  - Redux: chỉ giữ `auth/session` (`src/store/rootReducer.ts`).
  - Zustand: giữ `workspace context` (`src/store/features/workspaceStore.ts`).
- [x] **Đã giảm nguy cơ dual source cho workspace context** bằng đồng bộ điểm đọc/ghi chính.
  - `src/features/workspace/pages/WorkspaceListPage.tsx`: chọn workspace cập nhật Zustand trước khi điều hướng.
  - `src/features/workspace/pages/WorkspaceDetailPage.tsx`: đồng bộ workspace đã tải vào Zustand.
  - `src/components/layout/components/Sidebar.tsx`: ưu tiên `currentWorkspaceId` từ Zustand và cập nhật lại khi switch workspace.

## 5) Domain Config / Mapping SSOT

- [x] **Đã gom Status/Priority color mapping về config trung tâm** và thay thế ở các module chính.
  - Config trung tâm: `src/config/domainMappings.ts`
  - Đã migrate: `src/features/projects/components/simple_mode.tsx`
  - Đã migrate: `src/features/tasks/components/TaskBulkActionBar.tsx`
  - Đã migrate: `src/features/workspace/pages/GanttChartEnhanced.tsx`
- [x] **Đã tách dữ liệu route/mapping cục bộ khỏi component** sang constants/config dùng lại.
  - Sidebar config: `src/components/layout/components/sidebarNavigationConfig.ts`
  - Integrations config: `src/features/integrations/config.ts`
  - Consumer đã dùng config: `src/components/layout/components/Sidebar.tsx`, `src/features/integrations/pages/IntegrationsPage.tsx`

## 6) Mức độ ảnh hưởng

- [x] **Đã giảm đáng kể khó bảo trì khi đổi design token** nhờ gom mapping/token về config dùng chung.
- [x] **Đã giảm rủi ro mismatch UI giữa module** (status/priority semantic đã được chuẩn hóa ở domain mapping trung tâm).
- [x] **Đã giảm rủi ro đổi route/base URL gây lỗi dây chuyền** nhờ route constants + API client SSOT.
- [x] **Đã giảm chi phí review/test** do loại bỏ nhiều implementation trùng lặp.

---

## Đề xuất xử lý theo phase

- [x] **Phase 1 (ưu tiên cao):** Route constants + hợp nhất API client/interceptor.
- [x] **Phase 2:** Chuẩn hóa token usage (loại hardcode màu/shadow lớn).
- [x] **Phase 3:** Chốt 1 chiến lược global state cho workspace context.
- [x] **Phase 4:** Đồng bộ type/theme contracts (`ThemeMode`, semantic mappings).

### Kết quả re-audit toàn diện (2026-02-28)

- [x] Route/API/State/Domain mapping đã đạt SSOT theo phạm vi checklist.
- [x] Editor diagnostics hiện không có lỗi (`Problems`: clean).
- [ ] Build production hiện **chưa pass** do technical debt TypeScript ở nhiều module ngoài phạm vi SSOT.
  - Đã sửa blocker cấu hình: `ignoreDeprecations` từ `"6.0"` -> `"5.0"` trong `tsconfig*.json`.
  - Build hiện dừng ở các lỗi typing/import cũ trong `workspace/examples/forms/dialogs`, `mocks`, và một số hook/page legacy.

---

## Ghi chú tracking

- Owner: _TBD_
- ETA: _TBD_
- Trạng thái tổng: **SSOT Completed (code-level), Build Blocked by legacy TS compile errors**

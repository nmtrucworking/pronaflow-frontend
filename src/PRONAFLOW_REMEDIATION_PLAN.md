# PronaFlow Remediation Plan

## 1. Current State And Priorities

PronaFlow has a solid product direction and a useful monorepo shape, but the current implementation should be treated as an internal prototype or early beta rather than production-ready.

Primary risks identified during the project review:

- P0: Frontend and backend API route prefixes are inconsistent, so real API calls can fail even when the frontend build passes.
- P1: Frontend lint has a large backlog of type-safety and hygiene issues.
- P1: Backend development environment is not reproducible because the checked virtual environment points to a missing Python executable.
- P2: Electron build dependencies are not installed or synchronized.
- P2: AI service files are placeholders while project documentation and compose files present AI as an active capability.

The first remediation phase should focus on making the running web application and backend API contract reliable before expanding feature scope.

## 2. P0: Standardize API Prefixes

Goal: make frontend service calls and backend routes agree on a single API shape.

Decision:

- Backend should expose versioned API routes under `/api/v1`.
- Frontend service modules should continue using relative paths such as `/workspaces`, `/projects`, and `/tasks`.
- Data schemas and payload shapes should not change in this phase.

Implementation direction:

- Add a single API prefix at the backend router inclusion boundary instead of mixing `/api/v1`, `/v1`, and unversioned prefixes inside endpoint modules.
- Normalize backend endpoint router prefixes to domain-level paths only.
- Keep `createApiClient()` configured with an API base URL ending in `/api/v1`.
- Verify workspace, project, task, auth, analytics, archive, notification, scheduling, integration, subscription, personalization, onboarding, admin, and help-center routes all resolve consistently.

Acceptance criteria:

- A frontend request to `http://localhost:8000/api/v1/workspaces` reaches the backend workspace route.
- Existing frontend service calls do not need to prepend `/api/v1`.
- Backend OpenAPI documentation shows a consistent `/api/v1/...` route namespace.

## 3. P1: Clean Frontend Lint And Improve Test Coverage

Goal: restore lint as a meaningful quality gate and reduce TypeScript risk.

Implementation direction:

- Remove `@ts-nocheck` from shared UI, layout, mock, and feature files incrementally.
- Remove unused imports, unused variables, and stale component helpers.
- Replace broad `any` usage in services, hooks, and shared types with existing domain types or narrow response DTOs.
- Keep frontend API service behavior unchanged while improving types.
- Add focused tests for high-risk user flows that currently depend on mock or service-layer behavior.

Priority order:

1. Shared components and layout.
2. API service layer and hooks.
3. Workspace, project, task, auth, settings, and integration feature pages.
4. Remaining mock/demo components and examples.

Acceptance criteria:

- `npm.cmd --prefix apps/frontend run lint` passes.
- `npm.cmd --prefix apps/frontend run build` continues to pass.
- Frontend tests cover at least the API client refresh-token behavior and key workspace/project service interactions.

## 4. P1: Repair Backend Environment And Test Setup

Goal: make backend setup reproducible for local development and CI.

Implementation direction:

- Stop relying on the checked `.venv`; recreate local environments from `requirements.txt`.
- Document a Windows-friendly backend setup path using `py -3.11` or the project-supported Python version.
- Ensure pytest dependencies are installed from `apps/backend/requirements.txt`.
- Run backend tests from `apps/backend` so imports, Alembic config, and app package paths match local expectations.
- Add or update CI commands so backend compile and pytest are run consistently.

Acceptance criteria:

- A fresh backend virtual environment can install dependencies from `requirements.txt`.
- `python -m compileall app` passes from `apps/backend`.
- `python -m pytest tests` runs without environment-level failures.

## 5. P2: Align Electron, AI Service, And Documentation

Goal: make auxiliary surfaces honest and buildable.

Electron direction:

- Install or lock Electron dependencies for `apps/electron`.
- Confirm `npm.cmd --prefix apps/electron run build` can resolve `electron`, `electron-updater`, and Electron types.
- Keep Electron packaging out of the critical web/API remediation path until the web app contract is stable.

AI service direction:

- Either implement a minimal health endpoint and dependency set for `services/ai-serving`, or clearly mark the service as planned.
- If kept as a placeholder, prevent compose and README language from implying production AI capability.

Documentation direction:

- Update project docs to distinguish implemented, partial, mock-only, and planned capabilities.
- Record known gaps for OAuth, email delivery, archive export, analytics queries, Electron packaging, and AI serving.

Acceptance criteria:

- Electron build either passes or is explicitly documented as not part of the current release target.
- AI service has a truthful status in README and deployment docs.
- Documentation no longer overstates incomplete capabilities as production-ready.


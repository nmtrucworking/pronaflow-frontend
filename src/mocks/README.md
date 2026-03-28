# Comprehensive Mock Data Guide

This folder provides a full mock dataset aligned with the PronaFlow docs (modules 1-16), intended for:

- UI demonstration with realistic cross-module data.
- Integration testing in mock API mode.
- State testing (empty, edge, and fallback scenarios).
- Local development without backend dependency.

## Core Datasets

- `users.ts`: normalized user profiles and lookup maps.
- `workspaces.ts`: workspace, members, invitations, settings, and empty dataset.
- `projects.ts`: project portfolio data with tags, members, notes, files, and edge/empty scenarios.
- `task.ts`: dashboard-oriented tasks with urgency, overdue, unassigned, and empty scenarios.
- `notifications.ts`: inbox notifications with unread/mention and count helpers.

## Extended Domain Catalog (Modules 8-16)

- `domainCatalog.ts` provides datasets for:
  - Archive and compliance.
  - Analytics and reports.
  - Integration ecosystem (tokens, webhooks, plugins).
  - Admin governance (feature flags, incidents).
  - Help center and article feedback.
  - Onboarding flow and user progress.

## Mock API

`bootstrapMockApi.ts` now serves richer endpoint coverage including:

- Core: auth, workspaces, projects, tasks, notifications.
- Extended: analytics, archive, integrations, admin, help-center, onboarding.
- Testing utility endpoint: `/errors/validation` for validation error payloads.

## Scenarios

Every core domain has scenario exports for multi-purpose usage:

- `default`: realistic production-like data.
- `empty`: blank state for UI fallback tests.
- `edge`: high-risk or exceptional values (overdue, unassigned, etc.).

Use these scenarios directly in component stories, tests, or local demo pages.

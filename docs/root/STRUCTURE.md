# PronaFlow Frontend Project Structure

This document describes the effective structure of the frontend workspace and its documentation areas.

## Root Directory

```text
apps/frontend/
|-- docs/
|-- public/
|-- src/
|-- package.json
|-- tsconfig.json
|-- vite.config.ts
|-- README.md
```

## Documentation Structure

```text
docs/
|-- INDEX.md
|-- api/
|-- deployment/
|-- features/
|-- frontend/
|-- implementation/
|-- modules/
|-- reports/
|-- root/
`-- technical-docs/
```

## Technical Docs Policy

The folder `docs/technical-docs/` inside frontend is a compatibility entry point.

- Canonical shared source: `docs/technical-docs/` at repository root.
- Frontend path kept for legacy links: `apps/frontend/docs/technical-docs/`.
- New shared technical content must be authored in canonical root docs.
- Frontend-only implementation content stays in `apps/frontend/docs/frontend/`.

## Source Code Structure

```text
src/
|-- components/
|-- features/
|-- hooks/
|-- layouts/
|-- routes/
|-- services/
|-- store/
|-- styles/
|-- themes/
|-- types/
`-- utils/
```

## Related Documents

- [Frontend docs index](../INDEX.md)
- [Frontend technical docs entry point](../technical-docs/INDEX.md)
- [Canonical shared technical docs](../../../../docs/technical-docs/README.md)

Last updated: 2026-03-31

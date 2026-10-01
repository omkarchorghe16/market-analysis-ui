---
name: frontend-architecture
description: Plan or implement cross-cutting frontend changes while preserving the React application's boundaries, API contracts, accessibility, and maintainability.
---

# Frontend architecture

Use this skill when changing application bootstrap, routing/navigation, shared state, API transport, reusable component contracts, or multiple route workflows.

## Workflow

1. Read `.github/instructions/frontend-architecture.instructions.md`, the repository instructions, and the affected source files.
2. State the responsibility/boundary being changed and trace its callers and data flow before editing.
3. Prefer the smallest design that fits existing React Router, MUI, and Axios patterns. Avoid adding global state, caching, service layers, or dependencies without a demonstrated need.
4. Keep transport configuration in `src/api/client.js`, shared error normalization in `src/api/errors.js`, route shell concerns in `src/App.jsx`, reusable presentation in `src/components/`, and route workflows in `src/pages/`.
5. Validate the complete flow across affected routes, including loading/error states, mutation refresh behavior, keyboard interaction, and responsive layout.
6. Update architecture/API documentation when boundaries or supported capabilities change.

## Decision guardrails

- Keep backend authorization authoritative; UI visibility is not a security boundary.
- Do not broaden the supported API surface as an incidental consequence of a refactor.
- Do not guess backend contracts or introduce server-side pagination until the backend defines it.
- Avoid silent fallback data, broad error suppression, and automatic retries for non-idempotent work.
- For large or irreversible architectural decisions, record the alternatives and rationale in an ADR after the team chooses a direction. Do not invent organizational decisions on the team's behalf.

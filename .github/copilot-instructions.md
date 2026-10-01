# Repository instructions

## Scope and product context

- This repository is the React/Vite frontend for the Stock News Scheduler Service.
- Keep UI/API integration scoped to `/api/digest`, `/api/fmp`, `/api/sectors`, and `/api/stocks` unless the user explicitly expands scope.
- The API base URL already includes `/api`; frontend calls use paths relative to that prefix.
- Digest supports health checks and side-effecting triggers, not CRUD. FMP supports profile fetch-and-store, not UI listing or CRUD. Sectors and stocks support CRUD; stocks also support filters and bulk creation.
- Do not infer API capabilities from the UI. Check service controllers/DTOs or its OpenAPI document when request/response details are uncertain.

## Implementation

- Follow the architecture, coding, and API integration instructions in `.github/instructions/`.
- For multi-file changes that alter boundaries or shared contracts, follow `.github/skills/frontend-architecture/SKILL.md`.
- Use existing React, React Router, MUI, and Axios dependencies and established patterns before adding dependencies.
- Keep page-level data workflows in their route page and extract a component/helper only when it has a clear shared responsibility.
- Represent loading, success, empty, validation, and request-error states explicitly. Do not silently swallow failures or show a success state after a failed request.
- Protect side-effecting actions from duplicate submissions while in progress. Do not automatically retry digest triggers.
- Keep forms aligned with backend validation and use detail endpoints when available to retrieve records for edits.
- Maintain keyboard accessibility, visible labels, dialog focus behavior, and responsive layouts.
- Never put provider keys, credentials, or other secrets in browser code, `VITE_*` variables, docs, screenshots, or committed environment files.
- Do not add unrelated backend routes, profile-provider integrations, or stock-symbol management routes without explicit scope approval.

## Validation

- Run `npm run build` after frontend changes.
- The repository currently has no configured lint, unit-test, or browser-test scripts. Do not claim those checks ran; add test tooling only as an approved project change.
- Keep README and these guidance files synchronized when product scope or development conventions change.

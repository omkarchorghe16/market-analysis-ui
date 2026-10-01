---
applyTo: "src/**/*.{js,jsx}"
---

# Frontend architecture

## Boundaries

- `src/main.jsx` owns application bootstrap, global theme, and router provider.
- `src/App.jsx` owns route registration, responsive shell, and navigation. Route pages own their page-specific state and user workflows.
- `src/api/client.js` owns the shared Axios instance, base URL, timeout, and transport defaults. Keep endpoint paths and resource-specific request bodies in the relevant page or a focused API module.
- `src/api/errors.js` is the shared conversion point for backend/network errors presented to users.
- `src/components/` contains reusable UI elements with stable presentation/data contracts. `DataTable` owns client-side table pagination and row rendering, not fetching or resource mutation.
- `src/pages/` contains route-level workflows; avoid a single page that conditionally implements unrelated API roots.

## Data flow and API ownership

- Keep API calls explicit and traceable to the service contract; do not call backend endpoints from shared layout components except the existing dashboard summary workflow.
- Parse list results defensively as arrays and keep errors visible. Do not silently substitute mock records or treat a failed request as an empty successful response.
- Use local state for transient forms, filters, dialogs, and results. If shared cache/state becomes necessary, propose the smallest architecture change before adding a state-management dependency.
- Refresh affected collections after successful mutations. Do not close a form or report success until its mutation succeeds.
- Use detail endpoints for edit forms when the API provides them.
- Preserve API boundaries: digest and FMP pages are trigger/fetch workflows, sector and stock pages are CRUD workflows.

## UI consistency and accessibility

- Keep route navigation responsive and use Router links rather than full-page navigation.
- Use MUI components and the application theme before adding page-specific design systems or raw CSS.
- Tables must expose pagination, empty/loading states, and meaningful row identity.
- Forms need labels, required constraints, and feedback consistent with server-side validation.
- Destructive operations require an explicit confirmation step. Disable controls during the pending operation to reduce duplicate submissions.
- Keep actions operable with keyboard and assistive technology; icon-only controls need accessible names.

## Change discipline

- Avoid cross-layer abstractions for one-off behavior. Extract shared helpers only when they reduce duplication without hiding the API contract.
- Do not introduce backend changes, additional API roots, authentication assumptions, or new infrastructure as part of a UI-only change.
- Update architecture documentation when responsibility boundaries or the supported API surface changes.

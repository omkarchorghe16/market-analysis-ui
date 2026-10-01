---
applyTo: "src/**/*.{js,jsx}"
---

# Coding standards

## JavaScript and React

- Use ES modules, function components, hooks, and the existing JSX conventions.
- Use descriptive names for state, handlers, and API payloads. Keep functions focused on one workflow.
- Keep React state updates immutable. Use functional state updates when the next value depends on the previous value.
- Keep effects for synchronization with external systems; use stable callbacks where effect dependencies require them. Handle request failures and loading cleanup explicitly.
- Do not add `any`-style escape hatches or suppress warnings to hide uncertain data shapes. This application is JavaScript today; prefer runtime checks and clearly shaped values until TypeScript is adopted.
- Avoid duplicating API error parsing, repeated endpoint strings, and common UI patterns. Extract a shared helper only when its contract remains clear.

## API and errors

- Validate required input before issuing a request and preserve backend validation as the source of truth.
- Keep payload names/types identical to the service contract (for example, numeric `sectorId`, uppercase stock tickers, and non-empty FMP `symbols`).
- Handle loading, success, validation, empty, and failure states explicitly.
- Use `getApiErrorMessage` for consistent API/network error display. Do not show raw objects, stack traces, or implementation details to users.
- Do not add broad catches that hide failures, silent fallbacks that look successful, or automatic retries for side-effecting calls.
- Never log or render credentials, authorization headers, or sensitive provider payloads.

## UI, accessibility, and styling

- Prefer MUI controls and the shared theme. Keep colors, spacing, and responsive behavior consistent with existing screens.
- Use semantic controls (`Button`, `IconButton`, `TextField`, `Select`) and label inputs. Provide accessible names for icon-only buttons.
- Keep destructive actions confirmed and actionable error/success feedback visible.
- Ensure disabled/loading controls communicate pending work and prevent accidental duplicate mutations.
- Use responsive layouts and horizontally scrollable tables rather than forcing desktop widths onto small screens.
- Avoid comments that restate code. Add comments only to clarify non-obvious constraints or decisions.

## Dependencies and configuration

- Reuse dependencies already in `package.json`. Add a package only for a justified requirement; update and validate the lockfile if the project adopts one.
- Browser-exposed configuration must use non-secret values only. Provider credentials belong in the backend runtime secret store.
- Keep `.env` local and ignored; committed examples must contain placeholders/defaults only.

---
name: frontend-feature
description: Implement or update a user-facing feature in this React and MUI application using its architecture, accessibility expectations, API boundaries, and validation workflow.
---

# Frontend feature delivery

Use this skill when adding or changing route pages, navigation, tables, forms, dialogs, or other user workflows in this application.

## Workflow

1. Read repository instructions and the affected page/component. Identify the precise user workflow and supported API root.
2. Confirm endpoint capabilities and DTO contracts before implementing mutations or forms. Do not infer a CRUD surface from the existence of a navigation item.
3. Keep route shell, API transport, reusable presentation, and page workflows in their established modules.
4. Implement explicit loading, empty, validation, error, and success states. Make destructive actions confirmable and all controls accessible.
5. Verify responsive behavior, successful refresh after mutations, and the application's existing build command.
6. Update README and scoped instructions if routes, configuration, API coverage, or architecture changes.

## Guardrails

- Use existing React/MUI/Axios dependencies and shared helpers.
- No secrets in frontend code or `VITE_*` configuration.
- Do not silently swallow errors or automatically repeat side-effecting actions.
- Avoid unrelated endpoint, backend, or package changes.

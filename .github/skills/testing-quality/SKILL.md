---
name: testing-quality
description: Plan and perform proportional validation for changes to the React UI while distinguishing existing checks from proposed enterprise quality gates.
---

# Testing and quality

Use this skill when implementing a feature, fixing a UI defect, or evaluating release readiness.

## Workflow

1. Identify the smallest relevant existing validation command from `package.json`.
2. For this repository, run `npm run build` for code changes. Do not claim that build output proves runtime API behavior or accessibility.
3. If tests or lint scripts are added later, run focused checks for the changed behavior and keep them deterministic.
4. For API page changes, review loading/error/empty states, request methods/bodies, list refresh behavior, duplicate-submit prevention, and client-side pagination.
5. Report unconfigured quality gates as gaps; do not add test/build dependencies without an approved scope change.

## Recommended enterprise checks to establish

- Unit and React component tests for validation, loading/error states, and mutation behavior.
- Browser smoke tests for routes, responsive navigation, keyboard operation, and critical forms.
- Lint/format checks, dependency/license/security scanning, and CI branch protection.
- Contract validation against the backend OpenAPI specification, including representative success and error responses.
- Accessibility automation supplemented by keyboard and assistive-technology review.
- Deployment checks for environment configuration, SPA route fallback, HTTPS, CORS, and rollback readiness.

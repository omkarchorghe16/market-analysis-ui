# Market Analysis UI

A responsive React application for the Stock News Scheduler Service. The UI is intentionally scoped to four API roots: digest operations, FMP company-profile fetching, sector management, and stock management.

## Features

- Responsive navigation for Dashboard, Digest, Sectors, Stocks, and FMP Profiles.
- Digest health status plus manual daily and portfolio digest triggers.
- Sector create, list, update, and delete workflows.
- Stock create, list, update, and delete workflows; sector/ticker filters; and bulk ticker creation.
- FMP profile fetch-and-display workflow, with client-side validation and no unsupported edit/delete controls.
- Reusable tables with loading/empty states and client-side pagination.
- Shared API error-message handling and configurable API base URL/timeout.

## Technology

- React 18 and Vite 5
- React Router 6
- Material UI 5 and Emotion
- Axios
- JavaScript with JSX and ES modules

The frontend currently uses JavaScript rather than TypeScript. Styling is primarily through MUI's `sx` prop, with global defaults in `src/index.css`.

## Requirements

- Node.js 18 or later and npm
- The backend service running and reachable by the browser
- For live API workflows, a configured backend database and provider credentials as required by the service

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Vite prints the local development URL when it starts. Environment values are read when Vite starts; restart the dev server after changing `.env`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | Backend API prefix. Include `/api`; do not add a trailing slash. |
| `VITE_API_TIMEOUT` | `8000` | Axios request timeout in milliseconds. |

Vite exposes `VITE_*` values to browser code. **Never put API keys, passwords, or other secrets in these variables.** Keep provider credentials on the backend. For a remote deployment, set `VITE_API_BASE_URL` to the reachable HTTPS API origin and configure backend CORS for the UI origin.

## API integration

The API client in `src/api/client.js` uses `VITE_API_BASE_URL` as its `baseURL`, so the paths below are relative to that prefix.

| UI area | Method and path | Behavior |
| --- | --- | --- |
| Dashboard | `GET /digest/health` | Shows service health. |
| Dashboard | `GET /sectors` | Counts sectors. |
| Dashboard | `GET /stocks` | Counts stocks. |
| Digest | `GET /digest/health` | Refreshable service health check. |
| Digest | `POST /digest/run` | Runs the daily digest immediately. |
| Digest | `POST /digest/portfolio` | Runs the portfolio digest immediately. |
| FMP Profiles | `POST /fmp/profiles` | Fetches and stores profiles for `{ "symbols": ["AAPL"] }`. |
| Sectors | `GET /sectors` | Lists sectors. |
| Sectors | `GET /sectors/{id}` | Loads sector detail for editing. |
| Sectors | `POST /sectors` | Creates a sector with `{ "sectorName": "Technology" }`. |
| Sectors | `PUT /sectors/{id}` | Updates the sector name. |
| Sectors | `DELETE /sectors/{id}` | Deletes a sector; the service may reject deletion if stocks still reference it. |
| Stocks | `GET /stocks?sectorId={id}&ticker={ticker}` | Lists stocks, optionally filtered by sector and/or ticker. |
| Stocks | `GET /stocks/{id}` | Loads stock detail for editing. |
| Stocks | `POST /stocks` | Creates a stock with `{ "ticker": "AAPL", "sectorId": 1 }`. |
| Stocks | `POST /stocks/bulk` | Creates stocks with `{ "sectorId": 1, "tickers": ["AAPL", "MSFT"] }`. |
| Stocks | `PUT /stocks/{id}` | Updates ticker and sector. |
| Stocks | `DELETE /stocks/{id}` | Deletes a stock. |

Only these service routes are wired in the UI. Other service capabilities, including non-FMP stock-profile providers and `/api/stock-symbols`, are intentionally out of scope. Digest and FMP are action/fetch workflows rather than CRUD resources.

The service returns complete sector and stock arrays and does not define pagination parameters for these list endpoints. The table pagination is therefore **client-side** and applies to records already returned by the API; it is not server-side pagination.

## Project structure

```text
src/
  api/
    client.js              Axios client and API prefix
    errors.js              Shared API error message extraction
  components/
    DataTable.jsx          Reusable paginated MUI table
  pages/
    DashboardPage.jsx      Health and sector/stock summary
    DigestPage.jsx         Health and digest trigger actions
    FmpProfilesPage.jsx    FMP fetch-and-display workflow
    SectorsPage.jsx        Sector CRUD
    StocksPage.jsx         Stock CRUD, filters, and bulk creation
  App.jsx                  Responsive navigation and route definitions
  main.jsx                 React, router, and MUI theme setup
  index.css                Global styles
.github/
  copilot-instructions.md  Repository-wide assistant guidance
  instructions/            Architecture and coding standards
  skills/                  Reusable feature/API workflow guidance
```

## Build and preview

```bash
npm run build
npm run preview
```

The production bundle is emitted to `dist/`. The current project has a build script but no automated test, lint, or format scripts.

## Error handling and troubleshooting

- Request errors are displayed in the relevant page; structured service errors use their `detail`, `message`, or `title` fields when available.
- A browser network/CORS error usually means the API origin is unreachable or its CORS configuration does not allow the UI origin. Check `VITE_API_BASE_URL`, backend availability, and backend CORS settings.
- FMP responses can fail when the backend provider key/quota is unavailable or a requested symbol is unsupported. Configure provider credentials on the backend, not in this UI.
- Sector deletion can fail when stocks remain associated with the sector. Move or delete those stocks first.
- Empty stock lists can reflect active filters; clear filters to view all returned stocks.

## Engineering standards

- [Repository Copilot instructions](.github/copilot-instructions.md)
- [Frontend architecture](.github/instructions/frontend-architecture.instructions.md)
- [Coding standards](.github/instructions/coding-standards.instructions.md)
- [API integration standards](.github/instructions/api-integration.instructions.md)
- [Frontend architecture skill](.github/skills/frontend-architecture/SKILL.md)
- [Frontend feature delivery skill](.github/skills/frontend-feature/SKILL.md)
- [API integration skill](.github/skills/api-integration/SKILL.md)
- [Testing and quality skill](.github/skills/testing-quality/SKILL.md)

## Enterprise-readiness gaps

These are follow-up capabilities, not claims about what this UI currently implements:

1. **Reproducible dependencies:** No npm/yarn/pnpm lockfile is present. Choose npm for this repository and add `package-lock.json` so CI and developers use reproducible dependency resolutions.
2. **Automated quality gates:** Add test sources and scripts for component/unit and browser smoke tests, lint/format configuration, dependency/security scanning, and a required CI workflow such as `.github/workflows/ci.yml`.
3. **Type safety and API contracts:** Consider TypeScript and generated or validated API types from the service OpenAPI document; detect backend/frontend contract drift in CI.
4. **Runtime operations:** Define separate dev/staging/production configuration, a deployment pipeline, hosting/CDN and SPA-route fallback, health/availability monitoring, and documented rollback procedures (for example, `docs/DEPLOYMENT.md` and an operational runbook).
5. **Security and access control:** Add `SECURITY.md` with the reporting process and confirm whether the backend requires authentication/authorization. If it does, add a reviewed identity/session design, role-based UI affordances, CSRF protection where applicable, and secure transport; never rely on hidden buttons as authorization.
6. **Observability and resilience:** Add privacy-safe client error reporting, request correlation where supported, and explicit retry/rate-limit behavior for safe operations. Digest triggers are side-effecting and must not be retried automatically without an idempotency contract.
7. **Accessibility and localization:** Add automated accessibility checks plus keyboard/screen-reader review, and establish localization/date/number formatting requirements.
8. **Data scale and UX:** If stock/sector collections grow, add backend-supported pagination, sorting, and filtering. Current pagination is in-memory only.
9. **Project governance:** Add `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `.github/CODEOWNERS`, release/versioning and support/deprecation policies, and an `.editorconfig`. Add `LICENSE` only after the project owners select the intended legal terms.

Prioritize authentication requirements, automated CI checks, API contract checks, and deployment/environment controls before treating this UI as production-ready. Enterprise requirements depend on the organization and hosting environment and should be confirmed rather than assumed.

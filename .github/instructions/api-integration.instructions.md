---
applyTo: "src/api/**/*.{js,jsx},src/pages/**/*.{js,jsx}"
---

# API integration standards

## Contract-first integration

- Confirm endpoint path, HTTP method, query parameters, body, response, and failure behavior using the service controller/DTO or OpenAPI specification.
- The configured base URL includes `/api`; pass a relative endpoint path such as `/stocks`, not `/api/stocks`.
- Use the shared Axios instance in `src/api/client.js`, with configured timeout and common transport settings.
- Keep API payloads in the server's expected form; do not submit UI-only fields or guess field names.
- Handle `204 No Content` as successful completion without attempting to parse a body.

## Current supported endpoint inventory

- Digest: `GET /digest/health`, `POST /digest/run`, `POST /digest/portfolio`.
- FMP: `POST /fmp/profiles` with a non-empty list of symbols.
- Sectors: collection `GET`/`POST`, and `GET`/`PUT`/`DELETE /sectors/{id}`.
- Stocks: collection `GET` with optional `sectorId` and `ticker`; `POST /stocks`; `POST /stocks/bulk`; and `GET`/`PUT`/`DELETE /stocks/{id}`.
- Do not add other service endpoints without explicit product scope approval.

## Reliability and user feedback

- Surface request failures using the shared API error formatter. Preserve actionable backend validation messages when possible; use a concise fallback for network/unknown errors.
- Do not convert request failures into successful empty lists, and do not display a success message until the mutation or trigger succeeds.
- Disable repeated submissions while a request is in flight. Keep form values available after a failed mutation so users can correct/retry.
- Refresh relevant visible data after successful create/update/delete operations.
- Do not automatically retry digest endpoints: they may cause repeated external notifications. Retry other mutations only if the service defines idempotency or safe retry semantics.
- Enforce authorization on the service, not by hiding frontend controls. Do not assume public access or implement authentication without an agreed identity contract.

## Pagination and filters

- Sector and stock collection endpoints currently return complete arrays and have no documented pagination contract. The UI may paginate those returned arrays locally.
- Clearly label in-memory pagination as client-side. Do not send guessed `page`, `size`, or sorting parameters.
- If server-side paging becomes necessary, coordinate a documented backend contract and update the UI, tests, and README together.

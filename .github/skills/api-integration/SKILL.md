---
name: api-integration
description: Wire this frontend to a documented service endpoint, including request validation, user feedback, response handling, and refresh behavior.
---

# API integration

Use this skill when connecting a page or component to the Stock News Scheduler Service.

## Workflow

1. Inspect the service controller, request/response DTOs, or OpenAPI document. Record the method, path, required fields, query parameters, return shape, and meaningful errors.
2. Check that the endpoint belongs to the UI's approved API scope: `/api/digest`, `/api/fmp`, `/api/sectors`, or `/api/stocks`.
3. Call the endpoint through the shared Axios client, whose configured base URL already includes `/api`.
4. Match payload types and service validation; validate user input before sending and keep server errors visible.
5. Show loading/success/error states, avoid duplicate submissions, and refresh affected lists after successful mutations.
6. Add or update tests if a test runner exists; otherwise run the production build and document the testing gap. Update the API matrix in README.

## Safety

- Never expose backend provider secrets to browser code.
- No automatic retries for digest runs or other non-idempotent operations without an explicit idempotency contract.
- A UI restriction is not authorization; access control must be enforced by the service.
- Do not assume paginated responses or add undocumented query parameters.

# Authentication Refresh Change Log

## Root cause

The refresh flow had several gaps that combined to prevent a valid refresh token
from restoring the session:

- The access-token cookie used `ACCESS_TOKEN_EXPIRY` as milliseconds, while JWT
  `expiresIn` treats that value as seconds. The browser could discard the access
  cookie earlier than the JWT itself expired.
- The client did not refresh in response to an authentication `401` or retry the
  failed request. Its refresh behavior relied on periodic polling instead.
- The Next.js route proxy checked only for an access-token cookie, so a user
  with only a valid refresh-token cookie could be redirected away from the app.
- The refresh service generated its access token from a session payload with an
  `id` property, while the token generator read `_id`. The renewed token could
  consequently contain an undefined user ID.
- Expired access tokens from `/auth/session` were reported as server errors,
  rather than authentication failures.

## Changes made

- `lib/http-request/axios-http-request.ts` — added a response interceptor that
  refreshes on `401`, coalesces simultaneous refresh requests, and retries each
  original request at most once. Refresh endpoint failures are not retried.
- `proxy.ts` — recognized either the access-token or refresh-token cookie when
  deciding whether to allow app navigation.
- `components/app/AppLayout.tsx` — removed periodic refresh polling and
  logout-on-poll-error behavior in favor of refreshing when a request needs
  authentication.
- `../vizeo-server/services/auth/src/auth.service.ts` — updated token generation
  to support both database users (`_id`) and refresh-session payloads (`id`).
- `../vizeo-server/services/auth/src/auth.controller.ts` — centralized cookie
  options, converted access-token expiry from seconds to milliseconds for
  cookie `maxAge`, and returned `401` when access-token verification failed.
- `../vizeo-server/services/auth/src/auth.middleware.ts` — changed invalid and
  expired refresh-token responses to `401`.

## Validation

- Client production build: passed.
- Auth service TypeScript build: passed.
- Focused ESLint on `lib/http-request/axios-http-request.ts` and `proxy.ts`:
  passed.
- Full client lint still reported pre-existing issues in other files, including
  React effect lint errors and explicit `any` errors.

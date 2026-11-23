# StudioPilot Authentication & Security

## 1. Single-Administrator Security Mandate

StudioPilot is designed for single-admin operation. It does not allow public registration, signup pages, or guest sessions.

### Security Principles:
1. **No Public Registration**: There are no `/signup`, `/register`, or invitation endpoints.
2. **Pre-Provisioned Identity**: The administrator account is specified via environment variables (`ADMIN_EMAIL`).
3. **Route Protection**: Next.js Middleware (`src/middleware.ts`) intercepts every inbound request.
   - Unauthenticated visitors hitting pages are redirected to `/login`.
   - Direct requests to `/api/*` endpoints return `401 Unauthorized` JSON responses.
4. **Rate Limiting**: The authentication endpoint (`/api/auth/login`) enforces a sliding-window rate limit (10 attempts per 5 minutes per IP). Exceeding this limit returns HTTP `429 Too Many Requests`.
5. **Signed Session Cookies**: Sessions use HMAC-SHA256 signatures with `AUTH_SESSION_SECRET`. Credentials never leave the server.

---

## 2. Supabase Auth Provisioning

When connecting a live Supabase project:
1. Open the Supabase Dashboard -> **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Supply the administrator email (e.g. `admin@studiopilot.io`) and a strong password.
4. Under **Authentication Settings**, disable:
   - "Enable Email Signups"
   - "Enable Anonymous Sign-ins"
5. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

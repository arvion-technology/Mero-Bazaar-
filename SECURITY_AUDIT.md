# Security & Production-Readiness Audit

**Project:** HamroNepal Bazaar (Nepali multi-category marketplace)
**Stack:** Next.js 16 (App Router, NextAuth v5) BFF → NestJS 11 REST API → Prisma 5 → PostgreSQL 15
**Branch:** `sushant`

---

## Architecture & trust boundaries

```
Browser ──> Next.js BFF (app/api/* + next.config.ts rewrites) ──> NestJS (/api/*) ──> Prisma ──> Postgres
```

- **BFF vs backend split:** Next.js `app/api/*` route handlers (auth, OTP, vendor-kyc, user, leads, jobs apply) are self-contained or proxy to the backend; everything else is proxied by `next.config.ts` rewrites. The backend is reachable directly only via the BFF/CORS allow-list.
- **Internal trust boundary:** BFF → backend privileged calls use the `x-internal-secret` header, validated by `InternalAuthGuard` with `crypto.timingSafeEqual` (constant-time).
- **Auth:** JWT (HS256) with a startup-enforced 32+ char secret; server-side `sid` sessions; roles USER / VENDOR / DOCTOR / ADMIN.

## Verified controls

| Area | Status |
|---|---|
| **Authentication** | JWT + session; login rate-limited; OTP bcrypt-hashed + per-IP/per-phone rate limits |
| **Authorization** | `@SellerOnly()` / `@DoctorOnly()` composed guards (`JwtAuthGuard + RolesGuard`) on all category mutations; admin controllers guarded; `assertVerifiedSeller` KYC gate on listing creation |
| **Injection** | No raw SQL (`$queryRaw`/`$executeRaw`); Prisma parameterized queries throughout |
| **XSS** | No `innerHTML`/`document.write`/`eval` with user data; user content rendered via React escaping; only 2 `dangerouslySetInnerHTML` for static CSS |
| **CSRF** | State-changing API calls use `Authorization: Bearer` (not cookies); backend CORS is origin-restricted |
| **Secrets** | `JWT_SECRET`, `INTERNAL_API_SECRET`, payment keys all env-based with length enforcement; no hardcoded fallbacks; `.env` gitignored (only `.env.example` tracked) |
| **Data leaks** | Removed console.log leaks of password-reset token+password and listing edit data |
| **File upload** | Magic-byte validation (rejects non-image content); 400 on invalid images |
| **IDOR** | Object ownership enforced (`where: { id, userId }`); vendor-vs-vendor access returns 404 |
| **Headers** | `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, CSP (`frame-ancestors 'none'`), HSTS in production |
| **Validation** | Global `ValidationPipe` with `whitelist + forbidNonWhitelisted`; DTOs enforce `@Min`/`@Max`/`@MaxLength`/password strength |

## Fixed this session (15 commits, branch `sushant`)

1. 6 broken links (created Privacy/Terms/Refund/Safety/Contact/FAQ pages).
2. Homepage search 404 → built `/search` results page (wired to `/api/search`).
3. Khalti logo case-sensitivity 404.
4. 6 broken API endpoints (`/api/trades-home-repair` → `/api/trades`, `/api/hair|wellness` → `/api/beauty`, `/api/profile/notifications/*` → `/api/user/notifications/*`).
5. Search `limit=50` → `limit=20` (backend DTO cap).
6. Hidden homepage categories (`slice(0,4)` → all 9).
7. Removed false "Blockchain Verified" claims (no blockchain exists) and "18 categories" → 9.
8. Removed console.log credential/data leaks.
9. Added branded 404/error/global-error boundaries, SEO (robots/sitemap/metadata), OG/Twitter cards.

## Verification results

- `tsc --noEmit`: **0 errors**
- `eslint`: **0 errors** (227 pre-existing warnings)
- `next build`: **passes** (all routes compile, static pages prerender)
- Backend test suite (prior session): **68/68 suites, 83/83 tests pass**

## Remaining recommendations (product/ops, not code defects)

1. **Publish** under the target GitHub account — needs a Personal Access Token (GitHub rejects password pushes).
2. **Marketing statistics** ("1M+ users", "50K+ listings", "200+ cities") are placeholders; the demo DB is too sparse for real counts to be meaningful — replace with real data post-launch.
3. **ConnectIPS** payment gateway — merchant registration pending (graceful "not live yet" fallback already in place).
4. **Enable HSTS** (auto-applied when `NODE_ENV=production`).

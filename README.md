<<<<<<< HEAD
# Mero Bazaar

Nepali multi-category marketplace: vehicles, jobs, medical & dental, trades & home repair,
rent & real estate, agriculture & livestock, secondhand goods, food & home delivery, and
hair, beauty & wellness.

## Architecture

```
┌─────────────────────┐        ┌──────────────────────┐
│  Next.js frontend   │  HTTP  │  NestJS backend      │
│  (app router, BFF   │ ─────► │  (REST, JWT auth)    │
│   API routes)       │        │                      │
└─────────────────────┘        └──────────┬───────────┘
                                          │ Prisma
                                   ┌──────▼──────┐
                                   │ PostgreSQL  │
                                   └─────────────┘
```

- **`frontend/`** — Next.js 16 (App Router), NextAuth v5 (credentials + Google + Facebook),
  Tailwind. Server components talk to the backend through `/api/*` BFF route handlers.
- **`backend/`** — NestJS 11, Prisma 5, Passport-JWT with server-side sessions, bcrypt,
  eSewa/Khalti payment callbacks, Sparrow SMS.

## Prerequisites

- Node.js 20+ (lockfiles are committed; use `npm ci`, not `npm install`)
- PostgreSQL 15+
- (Optional) Docker + Docker Compose for local services

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env      # then fill in real values (JWT_SECRET is mandatory)
npm ci
npx prisma migrate deploy
npm run seed:admin        # creates the admin from ADMIN_EMAIL/ADMIN_PASSWORD
npm run start:dev         # http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # NEXT_PUBLIC_API_URL=http://localhost:3001, OAuth keys, etc.
npm ci
npm run dev               # http://localhost:3000
```

> `npm ci` fails if `package.json` and `package-lock.json` disagree — regenerate the
> lockfile with `npm install --package-lock-only` and commit it. Never delete the lockfile.

### 3. Local services (Docker)

```bash
cd backend
cp .env.example .env
docker compose up --build
```

The compose file pins the Node/Postgres images, injects secrets from the environment
(`JWT_SECRET`, `INTERNAL_API_SECRET` are mandatory), runs the app as a non-root user and
does not expose PostgreSQL to the host.

## Environment variables

See `backend/.env.example` (backend) and `frontend/.env.example` (frontend) for the full
reference. The most security-critical ones:

| Variable              | Required | Purpose                                        |
| --------------------- | -------- | ---------------------------------------------- |
| `JWT_SECRET`          | yes      | JWT signing key, 32+ random chars. Backend refuses to start without it. |
| `INTERNAL_API_SECRET` | yes      | Shared secret between the Next.js BFF and the backend (oauth-sync). |
| `DATABASE_URL`        | yes      | PostgreSQL connection string.                  |
| `SMS_PROVIDER`        | no       | `mock` logs OTPs to console (dev only — never in production). |
| `ESEWA_*`/`KHALTI_*`  | prod     | Payment provider credentials.                  |

## Migrations

Prisma migrations live in `backend/prisma/migrations`. Apply with
`npx prisma migrate deploy` (never edit applied migrations; create a new one).

Seed scripts:
- `npm run seed:admin` — upserts the admin user from `ADMIN_EMAIL`/`ADMIN_PASSWORD`.
  The plaintext password is never logged.

## Testing & quality gates

```bash
cd backend && npm run lint && npm test
cd frontend && npm run lint && npm run build
```

CI (`.github/workflows/docker-publish.yml`) runs `npm ci`, lint and build for the frontend
and publishes the backend image with cosign signing. Release blockers: clean install from
the lockfile, lint, unit/e2e tests, production dependency audit, secret scan.

## Security

See [SECURITY.md](SECURITY.md) for the vulnerability reporting process and the supported
versions policy. Key controls implemented:

- JWT access tokens require a live server-side session (`sid`); the 2FA hand-off token is
  never accepted as a bearer token; `JWT_SECRET` has no fallback and is never logged.
- Registration can only assign `USER`/`VENDOR`; privileged roles (`DOCTOR`, `ADMIN`) are
  admin-granted only. Listing publication requires an admin-approved KYC (server-side).
- Passwords/OTPs/reset tokens are stored hashed; reset and credential changes revoke
  sessions; sensitive account actions (phone change, 2FA disable, account deletion)
  require step-up reauthentication.
- Uploaded images are content-validated by magic bytes and re-encoded to a safe JPEG;
  KYC documents live outside the public static mount and are served through authenticated
  endpoints only.
- Payment confirmation only happens after a server-to-server verification with the
  payment provider; reservations are quota-limited and transitions are transactional.
- Auth, OTP and search endpoints are rate-limited and pagination-bounded.
=======
# Mero-Bazaar-
Nepali marketplace 
>>>>>>> origin/aashika

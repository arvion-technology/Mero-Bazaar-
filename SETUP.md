# Mero Bazaar — Install & Run on a New System

Complete step-by-step guide to clone, configure, and run **Mero Bazaar** (NestJS backend +
Next.js frontend + PostgreSQL) on any machine (Windows / macOS / Linux).

---

## 0. Prerequisites

| Tool | Version | Why |
| ---- | ------- | --- |
| Git | any recent | cloning |
| Node.js | **>= 20** (22/24 LTS recommended) | both apps |
| npm | 10+ (ships with Node) | dependency install |
| PostgreSQL | 15+ | database (skip if using Docker) |
| Docker + Compose | optional | easiest all-in-one start |

Check with:

```bash
git --version
node --version     # must be >= 20
npm --version
```

---

## 1. Clone

```bash
git clone https://github.com/sushant-me/Mero-Bazaar-Secured.git
cd Mero-Bazaar-Secured
```

The repository contains two apps: `backend/` (NestJS API on port 3001) and `frontend/`
(Next.js web app on port 3000).

---

## 2. Quick start with Docker (easiest — backend + PostgreSQL only)

```bash
cd backend
cp .env.example .env          # Windows:  copy .env.example .env

# Mandatory secrets — generate strong values and put them in .env:
#   JWT_SECRET=            (openssl rand -hex 32)
#   INTERNAL_API_SECRET=   (openssl rand -hex 32)

docker compose up --build
```

- Backend API: http://localhost:3000
- Health check: http://localhost:3000/api/health
- Compose runs the backend **and** PostgreSQL; the frontend is not containerized.

> The compose file requires `JWT_SECRET` and `INTERNAL_API_SECRET` to be present in your
> environment (`.env`), otherwise the app refuses to start — this is intentional.

### Apply migrations + create the admin (inside the container)

```bash
# backend/ (from a second terminal)
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run seed:admin   # uses ADMIN_EMAIL / ADMIN_PASSWORD from .env
docker compose exec app npm run seed         # optional demo user + listing
```

---

## 3. Manual setup (no Docker) — backend

### 3.1 Create the database

```bash
# with PostgreSQL running locally:
psql -U postgres -c "CREATE DATABASE marketplace;"
```

### 3.2 Configure the backend

```bash
cd backend
cp .env.example .env          # Windows:  copy .env.example .env
```

Edit `.env` — at minimum:

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/marketplace
PORT=3001
JWT_SECRET=<32+ random chars, e.g. openssl rand -hex 32>
INTERNAL_API_SECRET=<16+ random chars>
FRONTEND_URL=http://localhost:3000
SMS_PROVIDER=mock        # dev only: OTPs are printed to the backend console
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<strong password>
```

Other optional vars (OAuth, SMS Sparrow, eSewa/Khalti, mail) are documented inside
`.env.example` — leave blank for local browsing; payment/OAuth features need real values.

### 3.3 Install, migrate, seed, run

```bash
npm ci                      # reproducible install from the lockfile (never npm install)

npx prisma generate         # generate the Prisma client
npx prisma migrate deploy   # apply all migrations to your database

npm run seed:admin          # creates the admin from ADMIN_EMAIL / ADMIN_PASSWORD
npm run seed                # optional: demo user + demo vehicle listing

npm run start:dev           # http://localhost:3001  (hot reload)
# production-style:  npm run build && npm run start:prod
```

---

## 4. Manual setup — frontend

### 4.1 Configure

```bash
cd frontend
cp .env.example .env        # Windows:  copy .env.example .env
```

Edit `.env` — at minimum:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_SECRET=<any long random string, e.g. openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
INTERNAL_API_SECRET=<SAME value as backend .env>
```

Optional (needed only for Google/Facebook login):

```dotenv
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
```

### 4.2 Install & run

```bash
npm ci
npm run dev                 # http://localhost:3000
```

---

## 5. First login

1. Open http://localhost:3000 → **Register** (choose **Seller** to get a vendor account)
   or log in as the seeded admin.
2. Vendor accounts must complete **KYC** (Seller → KYC) before they can publish listings;
   an **admin** (login with `ADMIN_EMAIL`/`ADMIN_PASSWORD`) approves KYC from the admin
   panel. This is enforced server-side.
3. OTPs in development are printed to the **backend console** (SMS_PROVIDER=mock). In
   production never use `mock`.

---

## 6. Daily commands

| Task | Backend (`backend/`) | Frontend (`frontend/`) |
| ---- | -------------------- | ---------------------- |
| Run (dev) | `npm run start:dev` | `npm run dev` |
| Build | `npm run build` | `npm run build` |
| Lint | `npm run lint` | `npm run lint` |
| Tests | `npm test` | — |
| Security regression tests | `npx jest security-regression` | — |
| Prod audit | `npm audit --omit=dev` | `npm audit --omit=dev` |
| Migrations | `npx prisma migrate deploy` | — |
| Regenerate Prisma client | `npx prisma generate` | — |

---

## 7. Troubleshooting

| Problem | Fix |
| ------- | --- |
| `npm ci` fails with "package.json and package-lock.json are out of sync" | Run `npm install --package-lock-only` and commit the lockfile. Never delete it. |
| Backend won't start: `JWT_SECRET is missing or too short` | Set `JWT_SECRET` to 32+ random characters in `backend/.env`. This is deliberate fail-closed behaviour. |
| OTP not received | `SMS_PROVIDER=mock` prints the OTP to the **backend** console — check the `npm run start:dev` output. |
| Login says "Invalid email or password" | Unified error by design (no account enumeration). Try `npm run seed:admin` and the seeded credentials. |
| eSewa/Khalti payment fails | Payment requires real provider credentials (`ESEWA_PRODUCT_CODE`, `KHALTI_SECRET_KEY`) and public URLs — not available in local dev. |
| Port 3000 already in use | Run frontend with `npm run dev -- -p 3002` and set `NEXTAUTH_URL` / `NEXT_PUBLIC_API_URL` accordingly. |
| npm 11.17+ blocks install scripts | npm's new `allow-scripts` policy may need approval: run `npm approve-scripts` and allow `bcrypt`, `prisma`, `@prisma/client`, `sharp` (see your npm version docs). |
| `ts-node` ESM errors in seeds | Use the npm scripts (`npm run seed:admin`), which load ts-node with the repo's config. |

---

## 8. Production checklist (before deploying)

- `SMS_PROVIDER` is **not** `mock`; `SPARROW_SMS_TOKEN`/`FROM` configured.
- `FRONTEND_URL`, `NEXTAUTH_URL` point at the real domains; HTTPS everywhere.
- Payment provider keys set; eSewa/Khalti callback URLs are the backend's
  `/api/payments/esewa/success` and `/api/payments/khalti/callback`.
- See `backend/.env.example`, `frontend/.env.example`, and `SECURITY.md` (release checklist).

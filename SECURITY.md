# Security Policy

## Supported versions

Only the latest release of `main` is supported with security fixes. Older tags are not
backported.

| Version | Supported          |
| ------- | ------------------ |
| main    | ✅                 |
| < main  | ❌                 |

## Reporting a vulnerability

Please **do not open a public issue** for security problems. Report privately:

- **Email:** security@merobazaar.example.com (replace with the maintainer address)
- **PGP key:** published in the repository admin channel (ask maintainers)

Please include:

1. The affected endpoint/file and the exact request needed to reproduce it.
2. Impact assessment (what an attacker can do).
3. Suggested remediation if you have one.

You will receive an acknowledgement within 72 hours, a triage decision within 7 days,
and we will coordinate a disclosure date once a fix is released.

## Security model

- **Authentication:** JWT bearer tokens with a mandatory live server-side session (`sid`).
  The 2FA hand-off token (`purpose=login_2fa`, no `sid`) is never accepted as an access
  token. `JWT_SECRET` has no fallback value and is never logged; the backend refuses to
  start without a 32+ character secret.
- **Authorization:** Role checks are enforced server-side (`RolesGuard`) and object-level
  ownership is verified on every mutation. Registration can only create `USER`/`VENDOR`
  accounts; `DOCTOR`/`ADMIN` roles are granted exclusively through admin endpoints.
  Publishing marketplace listings requires a KYC-verified vendor (server-side gate).
- **Credentials & sessions:** Passwords, reset tokens and OTPs are stored hashed.
  Password changes and resets revoke existing sessions. Phone changes, 2FA disable and
  account deletion require step-up reauthentication (current password or a fresh OTP).
- **Data exposure:** Public APIs return explicit projections — credential hashes, reset
  tokens and internal flags are never serialized. KYC identity documents are stored
  outside the public static mount and streamed only through authenticated endpoints.
- **Uploads:** All uploads are content-validated by magic bytes and re-encoded to a safe
  format; server-generated filenames are used; orphan temp files are deleted on failure.
- **Payments:** Orders are confirmed only after a server-to-server verification with the
  payment provider (signature + status lookup); payment references are unique and
  transitions are transactional with reservation quotas.
- **Abuse control:** Login/OTP endpoints are rate-limited per IP; OTPs use a CSPRNG with
  atomic attempt counters and per-phone windows; search/seller endpoints are pagination-
  bounded.

## Security expectations for contributors

- Never log passwords, tokens, OTPs, phone numbers or identity documents.
- Never trust client-supplied roles, verification flags or MIME types.
- Always verify object ownership before read/write/delete.
- Run `npm audit` on both workspaces and keep the lockfiles in sync (`npm ci` must pass).
- Add a negative regression test for any new authorization or validation boundary.

## Release checklist

Before tagging a release:

- [ ] `npm ci` succeeds in a clean clone (both workspaces)
- [ ] Backend `npm run build`, `npm run lint`, `npm test` pass
- [ ] Frontend `npm run build`, `npm run lint` pass
- [ ] Production dependency audit (`npm audit --omit=dev`) is clean or exceptions documented
- [ ] No secret, token, OTP or KYC material in code, logs, or the repository history
- [ ] Containers run least-privileged with health checks; DB is not publicly exposed
- [ ] Backup/restore and key rotation procedures exercised

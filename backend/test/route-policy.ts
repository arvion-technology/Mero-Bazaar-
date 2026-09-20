// test/route-policy.ts
// Single source of truth for "who may call what". FIRST matching rule wins,
// so specific rules must stay ABOVE general ones.
// Routes matching nothing FAIL the audit as UNCLASSIFIED.
//
// Access levels:
//   'public'   -> no token needed
//   'auth'     -> any logged-in role
//   'internal' -> server-to-server (e.g. NextAuth -> backend). Must NOT be reachable
//                 anonymously; protect with a shared-secret guard, not a user JWT
//   Role[]     -> only these roles (everyone else must get 403)
//
// Lines marked CHECK are my guess at your intent. If the audit flags one and
// your intent is different, change the rule here, not the app.

export type Role = 'user' | 'seller' | 'doctor' | 'admin';
export const ROLES: Role[] = ['user', 'seller', 'doctor', 'admin'];

// Must match app.setGlobalPrefix() in main.ts ('' if none)
export const GLOBAL_PREFIX = '/api';

export type Access = 'public' | 'auth' | 'internal' | Role[];

export interface Rule {
  methods: string[] | '*';
  pattern: string;
  re: RegExp;
  access: Access;
}

// '/x/:id' -> matches one segment; '/x/**' -> matches '/x' and anything below it
const compile = (p: string) =>
  new RegExp(
    '^' +
      p
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\/\*\*$/, '(/.*)?')
        .replace(/:[A-Za-z0-9_]+/g, '[^/]+') +
      '$',
  );

const R = (methods: string | string[], pattern: string, access: Access): Rule => ({
  methods: methods === '*' ? '*' : Array.isArray(methods) ? methods : [methods],
  pattern,
  re: compile(pattern),
  access,
});

const WRITE = ['POST', 'PATCH', 'PUT', 'DELETE'];
const SELLER: Role[] = ['seller'];
const ADMIN: Role[] = ['admin'];
const SELLER_ADMIN: Role[] = ['seller', 'admin'];
const DOCTOR: Role[] = ['doctor'];
const DOCTOR_ADMIN: Role[] = ['doctor', 'admin'];

const VERTICALS = [
  'vehicles', 'jobs', 'medical', 'trades', 'rental',
  'agriculture', 'secondhand-goods', 'foods', 'beauty',
];

export const RULES: Rule[] = [
  // ---------- public ----------
  R('GET', '/', 'public'),
  R('GET', '/health', 'public'),
  R('GET', '/geocode/search', 'public'),
  R('GET', '/search/**', 'public'),
  R('GET', '/featured/**', 'public'),
  R('GET', '/sellers/**', 'public'),
  R('GET', '/reviews/**', 'public'),
  R('POST', '/auth/register', 'public'),
  R('POST', '/auth/login', 'public'),
  R('POST', '/auth/2fa/verify', 'public'),
  R('POST', '/otp/send', 'public'),              // CHECK: needs rate-limit (SMS abuse)
  R('POST', '/otp/verify', 'public'),
  R('POST', '/user/forgot-password', 'public'),
  R('POST', '/user/reset-password', 'public'),
  // Payment gateway redirects. Public by nature, so the handler MUST verify with
  // the gateway server-side and never trust query params
  R('GET', '/payments/esewa/success', 'public'),
  R('GET', '/payments/esewa/failure', 'public'),
  R('GET', '/payments/khalti/callback', 'public'),
  R('GET', '/payments/connectips/success', 'public'),
  R('GET', '/payments/connectips/failure', 'public'),
  // Slot availability is browsable before booking
  R('GET', '/medical/slots/**', 'public'),          // CHECK
  R('GET', '/beauty/slots/**', 'public'),           // CHECK

  // ---------- internal (must not be anonymous) ----------
  R('POST', '/user/oauth-sync', 'internal'),
  R('GET', '/user/by-email', 'internal'),        // CHECK: must never return password hash/2FA secret

  // ---------- admin ----------
  R('*', '/admin/**', ADMIN),
  R('*', '/vendor-kyc/admin/**', ADMIN),
  R('PATCH', '/verification-docs/:id/approve', ADMIN),
  R('PATCH', '/verification-docs/:id/reject', ADMIN),
  R('GET', '/user', ADMIN),
  R('DELETE', '/user/:id', ADMIN),

  // ---------- appointments & slots (medical / beauty) ----------
  R('*', '/medical/slots/**', DOCTOR_ADMIN),        // writes only (GET matched above)
  R('*', '/beauty/slots/**', SELLER_ADMIN),
  R('GET', '/medical/appointments', ADMIN),         // list ALL appointments (@Roles('ADMIN'))
  R('GET', '/beauty/appointments', ADMIN),
  // create, mine, by-listing, :id, :id/status, cancel: JwtAuthGuard only; ownership/role
  // is enforced inside the service, so any logged-in role must get past the guards
  R('*', '/medical/appointments/**', 'auth'),
  R('*', '/beauty/appointments/**', 'auth'),

  // ---------- seller-only ----------
  R('*', '/seller/**', SELLER),
  R('*', '/orders/seller/**', SELLER_ADMIN),
  R('*', '/vendor-sales-overview/**', SELLER_ADMIN),
  R('GET', '/listings/mine/**', SELLER_ADMIN),
  R('*', '/reports/**', SELLER_ADMIN),              // CHECK
  R('PATCH', '/leads/:id/status', SELLER_ADMIN),
  R('GET', '/leads', ADMIN),                        // CHECK: observed admin-only
  R('POST', '/verification-docs', DOCTOR),          // observed: only DOCTOR gets through
  // Observed: only the seller role gets through (user AND admin get 403)
  R('*', '/vendor-kyc/**', SELLER),                 // CHECK: if normal users must START KYC, this blocks them

  // ---------- any logged-in role ----------
  R('POST', '/auth/logout', 'auth'),
  R('POST', '/jobs/:id/apply', 'auth'),
  R('GET', '/jobs/:id/has-applied', 'auth'),
  R('POST', '/trades/:id/lead', 'auth'),
  R('POST', '/leads', 'auth'),
  R('*', '/leads/mine/**', 'auth'),
  R('POST', '/reviews', 'auth'),
  R(['PATCH', 'DELETE'], '/reviews/:id', 'auth'),
  R('POST', '/content-reports', 'auth'),
  R('*', '/wishlist/**', 'auth'),
  R('*', '/orders/**', 'auth'),
  R('*', '/payments/**', 'auth'),
  R('*', '/sessions/**', 'auth'),
  R('*', '/user/notifications/**', 'auth'),
  R('*', '/user/profile/**', 'auth'),
  R('*', '/user/2fa/**', 'auth'),
  R('GET', '/user/:id', ADMIN),                     // CHECK: exposes any user by id

  // ---------- listing verticals: read = public, write = seller ----------
  ...VERTICALS.flatMap((v) => [
    R('GET', `/${v}/**`, 'public'),
    R(WRITE, `/${v}/**`, v === 'medical' ? DOCTOR_ADMIN : SELLER_ADMIN),
  ]),
  R('GET', '/listings/**', 'public'),
  R(WRITE, '/listings/**', SELLER_ADMIN),
];

export const describeAccess = (a: Access) => (Array.isArray(a) ? a.join('|') : a);
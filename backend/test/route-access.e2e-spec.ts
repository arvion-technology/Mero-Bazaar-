// Run against a TEST database (allowed requests reach real handlers).
//   npx jest --config ./test/jest-e2e.json route-access
//
// For EVERY route registered in the app:
//   1. must be classified in route-policy.ts
//   2. public   -> anonymous must NOT get 401/403
//      internal -> anonymous MUST get 401/403
//      auth/role-> anonymous MUST get 401
//   3. with tokens: auth -> all roles pass; Role[] -> listed roles pass, others get 403
//
// Tokens are signed with JWT_SECRET + issuer/audience exactly like your JwtStrategy expects
// (signature, expiry, iss, aud are still verified by passport-jwt). Only JwtStrategy.validate()
// is stubbed, so no user/session rows are needed. Session revocation is NOT tested here.

import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtStrategy } from '../src/modules/auth/jwt.strategy';
import { GLOBAL_PREFIX, RULES, ROLES, Role, Rule, describeAccess } from './route-policy';

// ---- ADJUST only if needed ---------------------------------------------------
const TEST_USERS: Record<Role, { sub: string; email: string }> = {
  user:   { sub: 'test-user-id',   email: 'user@test.local' },
  seller: { sub: 'test-seller-id', email: 'seller@test.local' },
  doctor: { sub: 'test-doctor-id', email: 'doctor@test.local' },
  admin:  { sub: 'test-admin-id',  email: 'admin@test.local' },
};
const ISSUER = process.env.JWT_ISSUER ?? 'mero-bazaar-api';
const AUDIENCE = process.env.JWT_AUDIENCE ?? 'mero-bazaar-web';
// -------------------------------------------------------------------------------

// Reads the real values of User.role from the Prisma schema (e.g. USER / VENDOR / ADMIN)
let ALL_ROLE_VALUES: string[] = [];
function discoverRoleClaims(): Record<Role, string> {
  const fallback: Record<Role, string> = { user: 'USER', seller: 'VENDOR', doctor: 'DOCTOR', admin: 'ADMIN' };
  try {
    const dm = (Prisma as any).dmmf.datamodel;
    const field = dm.models.find((m: any) => m.name === 'User')?.fields.find((f: any) => f.name === 'role');
    const values: string[] = dm.enums.find((e: any) => e.name === field?.type)?.values.map((v: any) => v.name) ?? [];
    ALL_ROLE_VALUES = values;
    if (!values.length) return fallback;
    const pick = (re: RegExp, dflt: string) => values.find((v) => re.test(v)) ?? dflt;
    return {
      user: pick(/^(user|customer|buyer)$/i, fallback.user),
      seller: pick(/seller|vendor/i, fallback.seller),
      doctor: pick(/doctor|provider|clinic/i, fallback.doctor),
      admin: pick(/admin/i, fallback.admin),
    };
  } catch {
    return fallback;
  }
}

type RouteInfo = { method: string; path: string };

function listRoutes(app: INestApplication): RouteInfo[] {
  const server: any = app.getHttpAdapter().getInstance();
  const router = server._router ?? server.router; // Express 4 / 5
  const out: RouteInfo[] = [];
  for (const layer of router.stack) {
    if (!layer.route) continue;
    for (const method of Object.keys(layer.route.methods)) {
      out.push({ method: method.toUpperCase(), path: layer.route.path });
    }
  }
  return out;
}

const stripPrefix = (p: string) =>
  GLOBAL_PREFIX && p.startsWith(GLOBAL_PREFIX) ? p.slice(GLOBAL_PREFIX.length) || '/' : p;

const fillParams = (p: string) =>
  p.replace(/:[A-Za-z0-9_]+\??/g, '00000000-0000-0000-0000-000000000000').replace(/\*/g, 'x');

const findRule = (method: string, path: string): Rule | undefined =>
  RULES.find((r) => (r.methods === '*' || r.methods.includes(method)) && r.re.test(path));

const blocked = (s: number) => s === 401 || s === 403;
// A 403 raised by a service (ownership check on a fake record) is NOT a guard denial.
// Nest's RolesGuard returning false produces the message 'Forbidden resource'.
const guardDenied = (res: any) =>
  res.status === 401 || (res.status === 403 && (res.body?.message ?? 'Forbidden resource') === 'Forbidden resource');

describe('Route access audit', () => {
  let app: INestApplication;
  let tokens: Record<Role, string>;
  let roleClaims: Record<Role, string>;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    app.useLogger(false);
    if (GLOBAL_PREFIX) app.setGlobalPrefix(GLOBAL_PREFIX.replace(/^\//, ''));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Skip the DB user/session lookup; passport-jwt still verifies signature, exp, iss, aud
    const strategy = app.get(JwtStrategy, { strict: false });
    jest.spyOn(strategy, 'validate').mockImplementation(async (payload: any) => ({
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sid,
    }));

    roleClaims = discoverRoleClaims();
    const signer = new JwtService({});
    tokens = Object.fromEntries(
      ROLES.map((r) => [
        r,
        signer.sign(
          { sub: TEST_USERS[r].sub, email: TEST_USERS[r].email, role: roleClaims[r], sid: `sid-${r}`, purpose: 'access' },
          { secret: process.env.JWT_SECRET, algorithm: 'HS256', expiresIn: '1h', issuer: ISSUER, audience: AUDIENCE },
        ),
      ]),
    ) as Record<Role, string>;
  });

  afterAll(async () => {
    await app.close();
  });

  it('every route is classified, and 401/403/allow behave correctly', async () => {
    const server = app.getHttpServer();
    const problems: string[] = [];
    const publicSurface: string[] = [];
    const routes = listRoutes(app);
    expect(routes.length).toBeGreaterThan(0);

    // Preflight 1: does the app accept our test tokens at all?
    const probe = await request(server)
      .get(`${GLOBAL_PREFIX}/sessions/me`)
      .set('Authorization', `Bearer ${tokens.user}`);
    const tokensOk = probe.status !== 401;
    if (!tokensOk) {
      problems.push(
        'TEST TOKENS REJECTED (401 on GET /sessions/me with a user token). Role checks SKIPPED. ' +
          'Check JWT_SECRET/JWT_ISSUER/JWT_AUDIENCE are loaded in the test env (.env or .env.test).',
      );
    }

    // Preflight 2: do the role values match what RolesGuard expects?
    if (tokensOk) {
      const adminProbe = await request(server)
        .get(`${GLOBAL_PREFIX}/admin/users`)
        .set('Authorization', `Bearer ${tokens.admin}`);
      if (blocked(adminProbe.status)) {
        problems.push(
          `ADMIN TOKEN GOT ${adminProbe.status} on GET /admin/users. Role claims used: ${JSON.stringify(roleClaims)}. ` +
            'If wrong, set them by hand in discoverRoleClaims(); role results below are unreliable until fixed.',
        );
      }
    }

    for (const { method, path: fullPath } of routes) {
      const path = stripPrefix(fullPath);
      const label = `${method} ${fullPath}`;
      const rule = findRule(method, path);
      if (!rule) {
        problems.push(`${label} is UNCLASSIFIED (add it to route-policy.ts)`);
        continue;
      }

      const url = fillParams(fullPath);
      const call = (token?: string) => {
        const req = (request(server) as any)[method.toLowerCase()](url);
        return token ? req.set('Authorization', `Bearer ${token}`) : req;
      };

      const { access } = rule;
      const anon = await call();

      if (access === 'public') {
        publicSurface.push(`${label}  (anon -> ${anon.status})`);
        if (blocked(anon.status)) problems.push(`${label} is PUBLIC in policy but anonymous got ${anon.status}`);
        continue;
      }

      if (access === 'internal') {
        if (!blocked(anon.status)) {
          problems.push(`${label} is INTERNAL but reachable anonymously (got ${anon.status}). Add a shared-secret guard.`);
        }
        continue;
      }

      if (anon.status !== 401) {
        problems.push(`${label} [${describeAccess(access)}] anonymous -> ${anon.status}, expected 401`);
      }
      if (!tokensOk) continue;

      for (const role of ROLES) {
        const res = await call(tokens[role]);
        const allowed = access === 'auth' || access.includes(role);
        if (allowed && guardDenied(res)) {
          problems.push(`${label} ${role} should be ALLOWED, got ${res.status} ${JSON.stringify(res.body?.message ?? '')}`);
        } else if (!allowed && res.status !== 403) {
          problems.push(`${label} ${role} should be FORBIDDEN (403), got ${res.status}`);
        }
      }
    }

    console.log(
      `Checked ${routes.length} routes. Role claims used: ${JSON.stringify(roleClaims)}. All User.role values: ${ALL_ROLE_VALUES.join(', ') || '(not found)'}\n` +
        `Public surface (review this list):\n${publicSurface.join('\n')}`,
    );
    expect(problems).toEqual([]);
  }, 180_000);

  // Express dispatches in registration order. A parameterised route such as GET /medical/:id
  // registered BEFORE GET /medical/appointments swallows it: the guarded handler never runs.
  it('no route is shadowed by an earlier parameterised route', () => {
    const toRe = (p: string) =>
      new RegExp('^' + p.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:[A-Za-z0-9_]+/g, '[^/]+') + '$');
    const routes = listRoutes(app);
    const problems: string[] = [];
    routes.forEach((r, i) => {
      for (let j = 0; j < i; j++) {
        const e = routes[j];
        if (e.method !== r.method || e.path === r.path || !e.path.includes(':')) continue;
        if (toRe(e.path).test(r.path)) {
          problems.push(`${r.method} ${r.path} is UNREACHABLE: earlier route ${e.method} ${e.path} answers first`);
          break;
        }
      }
    });
    expect(problems).toEqual([]);
  });
});
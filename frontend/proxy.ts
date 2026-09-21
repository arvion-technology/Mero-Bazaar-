import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Server-side route protection (defense-in-depth).
 *
 * The NestJS backend is the authoritative security boundary — every privileged
 * API call is re-checked there. This middleware only *gates page access* so that
 * unauthenticated users are redirected to sign-in and users with the wrong role
 * never see the admin/seller shells. It must never be relied on as the sole
 * control, and it is intentionally lenient: it reads the session JWT role and
 * redirects, nothing more.
 */

// Guest-accessible pages. Everything else is public unless explicitly protected
// below (the marketplace's browsing surface stays open to visitors).
const GUEST_ONLY_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/auth-error",
];

function startsWithAny(path: string, prefixes: string[]): boolean {
  return prefixes.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );
}

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  // API routes, static assets, and guest pages are never touched here.
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    startsWithAny(path, GUEST_ONLY_PATHS)
  ) {
    return NextResponse.next();
  }

  const session = req.auth;
  const role = session?.user?.role;

  const requiresAdmin = path.startsWith("/admin");
  const requiresSeller = path.startsWith("/seller") || path.startsWith("/kyc");
  const requiresAuth =
    requiresAdmin ||
    requiresSeller ||
    path.startsWith("/user") ||
    path.startsWith("/profile") ||
    path.startsWith("/orders") ||
    path.startsWith("/cart") ||
    path.startsWith("/checkout");

  if (!requiresAuth) {
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/register", nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  if (requiresAdmin && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (requiresSeller && role !== "VENDOR" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

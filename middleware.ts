import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_ROLES = [
  "admin",
  "super-admin",
  "question-manager",
  "exam-manager",
  "result-manager",
  "user-manager",
];

const USER_ROLES = ["student", "user"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role = typeof token?.role === "string" ? token.role : null;

  const isAdminRole = role !== null && ADMIN_ROLES.includes(role);
  const isUserRole = role !== null && USER_ROLES.includes(role);

  /*
   * ============================================
   * NORMAL USER LOGIN
   * ============================================
   */
  if (pathname === "/login") {
    if (!token) {
      return NextResponse.next();
    }

    // Admin users should use admin dashboard
    if (isAdminRole) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }

    // Normal users
    if (isUserRole) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    return NextResponse.next();
  }

  /*
   * ============================================
   * ADMIN LOGIN
   * ============================================
   */
  if (pathname === "/admin/login") {
    if (!token) {
      return NextResponse.next();
    }

    // Any admin role -> admin dashboard
    if (isAdminRole) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }

    // Normal user -> user dashboard
    if (isUserRole) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    return NextResponse.next();
  }

  /*
   * ============================================
   * STUDENT / USER DASHBOARD
   * ============================================
   */
  if (pathname.startsWith("/dashboard")) {
    // Not logged in
    if (!token) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set(
        "callbackUrl",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }

    // Admin roles must stay in admin area
    if (isAdminRole) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }

    // Only normal users can access /dashboard
    if (!isUserRole) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    return NextResponse.next();
  }

  /*
   * ============================================
   * ADMIN DASHBOARD
   * ============================================
   */
  if (pathname.startsWith("/admin/dashboard")) {
    // Not logged in
    if (!token) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }

    // Any valid admin role can access admin dashboard
    if (isAdminRole) {
      return NextResponse.next();
    }

    // Normal user cannot access admin dashboard
    if (isUserRole) {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    // Unknown/invalid role
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/admin/login",
    "/dashboard/:path*",
    "/admin/dashboard/:path*",
  ],
};
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  /*
   * Student dashboard
   */
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set(
        "callbackUrl",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "student") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }
  }

  /*
   * Admin dashboard
   */
  if (pathname.startsWith("/admin/dashboard")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }

    if (token.role !== "admin") {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }
  }

  /*
   * Prevent logged-in users from opening login pages.
   */
  if (pathname === "/login") {
    if (token?.role === "student") {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    if (token?.role === "admin") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }
  }

  if (pathname === "/admin/login") {
    if (token?.role === "admin") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }

    if (token?.role === "student") {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }
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
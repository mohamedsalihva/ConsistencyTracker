import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DASHBOARD_PATH = "/dashboard";
const AUTH_PATHS = ["/auth/login", "/auth/register"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname.startsWith(DASHBOARD_PATH);
  const isAuthRoute = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isDashboardRoute && !token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};

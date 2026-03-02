import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const DASHBOARD_PATH = '/dashboard';
const BILLING_PATH = '/billing';
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

const AUTH_PATHS = ['/auth/login', '/auth/register'];
const GOOGLE_COMPLETE_PATH = '/auth/google-complete';

type AuthUser = {
  role?: 'manager' | 'member';
  subscriptionStatus?: 'none' | 'pending' | 'active' | 'failed';
};

function requiresBilling(user: AuthUser | null) {
  return user?.role === 'manager' && user.subscriptionStatus !== 'active';
}

async function getCurrentUser(token: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        cookie: `token=${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = (await res.json()) as { user?: AuthUser };
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const onboardingToken = req.cookies.get('google_onboarding')?.value;
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname.startsWith(DASHBOARD_PATH);
  const isBillingRoute = pathname.startsWith(BILLING_PATH);
  const isGoogleCompleteRoute = pathname.startsWith(GOOGLE_COMPLETE_PATH);
  const isAuthRoute = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isProtectedRoute = isDashboardRoute || isBillingRoute;

  if (isGoogleCompleteRoute) {
    if (onboardingToken) return NextResponse.next();
    if (!token) return NextResponse.redirect(new URL('/auth/login', req.url));
    const user = await getCurrentUser(token);
    if (!user) return NextResponse.redirect(new URL('/auth/login', req.url));
    const target = requiresBilling(user) ? '/billing' : '/dashboard';
    return NextResponse.redirect(new URL(target, req.url));
  }

  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!token) {
    return NextResponse.next();
  }

  const user = await getCurrentUser(token);
  if (!user && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute) {
  return NextResponse.next();
}


  if (isDashboardRoute && requiresBilling(user)) {
    return NextResponse.redirect(new URL('/billing', req.url));
  }

  if (isBillingRoute && !requiresBilling(user)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/billing/:path*', '/auth/login', '/auth/register', '/auth/google-complete'],
};

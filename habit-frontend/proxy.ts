import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const DASHBOARD_PATH = '/dashboard';
const BILLING_PATH = '/billing';
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

const AUTH_PATHS = ['/auth/login', '/auth/register'];
const GOOGLE_COMPLETE_PATH = '/auth/google-complete';

type AuthUser = {
  role?: 'manager' | 'member';
  subscriptionStatus?: 'none' | 'pending' | 'active' | 'failed';
};

type UserCheckResult =
  | { status: 'authorized'; user: AuthUser | null }
  | { status: 'unauthorized' }
  | { status: 'unknown' };

function requiresBilling(user: AuthUser | null) {
  return user?.role === 'manager' && user.subscriptionStatus !== 'active';
}

function isJwtLike(value?: string | null) {
  if (!value) return false;
  return value.split('.').length === 3;
}

function setSessionCookies(res: NextResponse, token: string, req: NextRequest) {
  const isProd = process.env.NODE_ENV === 'production';
  const secure = isProd || req.nextUrl.protocol === 'https:';

  res.cookies.set('token', token, {
    httpOnly: true,
    sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
    secure,
    path: '/',
    maxAge: WEEK_IN_SECONDS,
  });

  res.cookies.set('token_client', token, {
    httpOnly: false,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: WEEK_IN_SECONDS,
  });
}

async function getCurrentUser(token: string): Promise<UserCheckResult> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (res.status === 401 || res.status === 403) return { status: 'unauthorized' };
    if (!res.ok) return { status: 'unknown' };
    const data = (await res.json()) as { user?: AuthUser };
    return { status: 'authorized', user: data.user ?? null };
  } catch {
    return { status: 'unknown' };
  }
}

export async function proxy(req: NextRequest) {
  const serverTokens = req.cookies
    .getAll('token')
    .map((c) => c.value?.trim())
    .filter((v): v is string => Boolean(v));
  const clientTokens = req.cookies
    .getAll('token_client')
    .map((c) => c.value?.trim())
    .filter((v): v is string => Boolean(v));
  const urlToken = req.nextUrl.searchParams.get('token')?.trim() || '';
  const tokenCandidates = [...serverTokens, ...clientTokens, ...(urlToken ? [urlToken] : [])];
  const token =
    tokenCandidates.find((v) => isJwtLike(v)) ??
    tokenCandidates[0];
  const { pathname } = req.nextUrl;

  const isDashboardRoute = pathname.startsWith(DASHBOARD_PATH);
  const isBillingRoute = pathname.startsWith(BILLING_PATH);
  const isGoogleCompleteRoute = pathname.startsWith(GOOGLE_COMPLETE_PATH);
  const isAuthRoute = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isProtectedRoute = isDashboardRoute || isBillingRoute;

  if (isGoogleCompleteRoute) {
    return NextResponse.next();
  }

  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!token) {
    return NextResponse.next();
  }

  let result = await getCurrentUser(token);
  if (
    result.status === 'unauthorized' &&
    tokenCandidates.length > 1
  ) {
    for (const candidate of tokenCandidates) {
      if (candidate === token) continue;
      const candidateResult = await getCurrentUser(candidate);
      if (candidateResult.status === 'authorized' || candidateResult.status === 'unknown') {
        result = candidateResult;
        break;
      }
    }
  }

  if (urlToken && isJwtLike(urlToken) && (result.status === 'authorized' || result.status === 'unknown')) {
    const cleanUrl = new URL(req.url);
    cleanUrl.searchParams.delete('token');
    const response = NextResponse.redirect(cleanUrl);
    setSessionCookies(response, urlToken, req);
    return response;
  }

  if (result.status === 'unauthorized' && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (result.status === 'unknown' && isProtectedRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    return NextResponse.next();
  }


  if (result.status === 'authorized' && isDashboardRoute && requiresBilling(result.user)) {
    return NextResponse.redirect(new URL('/billing', req.url));
  }

  if (result.status === 'authorized' && isBillingRoute && !requiresBilling(result.user)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/billing/:path*', '/auth/login', '/auth/register', '/auth/google-complete'],
};

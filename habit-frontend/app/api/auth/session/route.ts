import { NextRequest, NextResponse } from "next/server";

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

function getCookieOptions(maxAge?: number) {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    secure: isProd,
    path: "/",
    ...(maxAge ? { maxAge } : {}),
  };
}

function clearTokenCookieVariants(response: NextResponse) {
  const expired = new Date(0);
  response.cookies.set("token", "", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 0,
    expires: expired,
  });
  response.cookies.set("token", "", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    expires: expired,
  });
  response.cookies.set("token", "", {
    path: "/",
    secure: true,
    sameSite: "none",
    maxAge: 0,
    expires: expired,
  });
  response.cookies.set("token", "", {
    path: "/",
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    expires: expired,
  });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { token?: string };
  const token = body?.token?.trim();

  if (!token) {
    return NextResponse.json({ message: "Missing token" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  clearTokenCookieVariants(response);
  response.cookies.set("token", token, getCookieOptions(WEEK_IN_SECONDS));
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearTokenCookieVariants(response);
  response.cookies.set("token", "", getCookieOptions(0));
  return response;
}

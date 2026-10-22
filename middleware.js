import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl
  const hasSession = req.cookies.has("better-auth.session_token")
  const isAuthPage = pathname === "/login" || pathname === "/signup"

  if (!hasSession && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api/auth|api/cron).*)"],
}

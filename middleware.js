import { NextResponse } from "next/server";

export function middleware(req) {
  const path = req.nextUrl.pathname;
  // Protéger les routes commençant par /admin, sauf la page de login
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const cookie = req.cookies.adminPassword;
    const expected = process.env.ADMIN_PASSWORD;
    if (!cookie || cookie !== expected) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("error", "non_auth");
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
}

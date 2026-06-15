import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE } from "./app/lib/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") return NextResponse.next();
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };

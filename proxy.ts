import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_DEFAULT_LOGIN_PATH, ADMIN_SESSION_COOKIE, getAdminLoginPath } from "./app/lib/admin-auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loginPath = getAdminLoginPath();
  const usesCustomLoginPath = loginPath !== ADMIN_DEFAULT_LOGIN_PATH;

  // Si ya configuraste una ruta secreta, la ruta hardcodeada /admin/login
  // queda bloqueada para que nadie pueda enumerarla ni acceder por ahí.
  if (usesCustomLoginPath && pathname === ADMIN_DEFAULT_LOGIN_PATH) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // La ruta pública configurada se sirve internamente desde /admin/login,
  // sin que la URL visible la delate.
  if (pathname === loginPath) {
    if (loginPath === ADMIN_DEFAULT_LOGIN_PATH) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_DEFAULT_LOGIN_PATH;
    return NextResponse.rewrite(url);
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === ADMIN_DEFAULT_LOGIN_PATH) return NextResponse.next();

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = loginPath;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
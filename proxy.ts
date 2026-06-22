import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_DEFAULT_LOGIN_PATH, ADMIN_SESSION_COOKIE, getAdminLoginPath } from "./src/shared/lib/admin-auth";

function adminNotFoundResponse() {
  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Página no encontrada | Beauty Cosmetics</title>
    <style>
      :root { color-scheme: light; --primary: #9E3659; --primary-dark: #84304C; --text: #2D1F23; --muted: #6B6063; --soft: #FCEDF0; --border: #F1CCD5; }
      * { box-sizing: border-box; }
      body { margin: 0; min-width: 320px; min-height: 100vh; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: radial-gradient(circle at top left, #fff 0, #fff 36%, #fff7f9 72%, #fcedf0 100%); color: var(--text); }
      main { min-height: 100vh; display: grid; place-items: center; padding: 32px 16px; }
      .card { width: min(100%, 900px); overflow: hidden; border: 1px solid var(--border); border-radius: 28px; background: rgba(255,255,255,.92); box-shadow: 0 24px 80px rgba(158,54,89,.16); }
      .hero { display: grid; gap: 28px; padding: clamp(32px, 6vw, 72px); text-align: center; place-items: center; }
      .logo { width: 88px; height: 88px; border-radius: 999px; object-fit: cover; box-shadow: 0 12px 30px rgba(158,54,89,.18); }
      .badge { display: inline-flex; align-items: center; border-radius: 999px; background: var(--soft); padding: 9px 18px; color: var(--primary); font-size: 12px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; }
      h1 { margin: 0; max-width: 720px; font-size: clamp(38px, 7vw, 76px); line-height: .95; letter-spacing: -.05em; }
      p { margin: 0; max-width: 620px; color: var(--muted); font-size: clamp(16px, 2vw, 19px); line-height: 1.75; }
      .actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
      a { min-height: 48px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; padding: 0 22px; font-size: 14px; font-weight: 800; text-decoration: none; transition: transform .18s ease, background .18s ease; }
      a:hover { transform: translateY(-1px); }
      .primary { background: var(--primary); color: white; }
      .primary:hover { background: var(--primary-dark); }
      .secondary { border: 1px solid #e7bfc9; background: white; color: var(--primary); }
      .secondary:hover { background: var(--soft); }
      .hint { width: 100%; border-top: 1px solid #f3dce3; background: #fff9fb; padding: 18px 24px; text-align: center; color: var(--muted); font-size: 13px; }
    </style>
  </head>
  <body>
    <main>
      <section class="card" aria-labelledby="not-found-title">
        <div class="hero">
          <img class="logo" src="/bc-logo.png" alt="Beauty Cosmetics" />
          <span class="badge">Error 404</span>
          <h1 id="not-found-title">Esta página no está disponible</h1>
          <p>El enlace puede haber cambiado, estar protegido o ya no existir. Puedes volver a Beauty Cosmetics y seguir explorando nuestros productos.</p>
          <div class="actions">
            <a class="primary" href="/">Volver al inicio</a>
            <a class="secondary" href="/catalog">Ver catálogo</a>
          </div>
        </div>
        <div class="hint">Si crees que deberías tener acceso, revisa el enlace o contacta al administrador.</div>
      </section>
    </main>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 404,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loginPath = getAdminLoginPath();
  const usesCustomLoginPath = loginPath !== ADMIN_DEFAULT_LOGIN_PATH;

  // Si ya configuraste una ruta secreta, la ruta hardcodeada /admin/login
  // queda bloqueada por completo: nadie debe poder llegar ahí adivinando.
  if (usesCustomLoginPath && pathname === ADMIN_DEFAULT_LOGIN_PATH) {
    return adminNotFoundResponse();
  }

  // La ruta secreta configurada en ADMIN_LOGIN_PATH se sirve sin necesidad
  // de reescritura aquí: next.config.ts ya mapea esa ruta hacia /admin/login
  // a nivel de ruteo (sin red, sin TLS), evitando el bug EPROTO que produce
  // NextResponse.rewrite() en producción detrás de un reverse proxy.
  if (pathname === loginPath) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === ADMIN_DEFAULT_LOGIN_PATH) return NextResponse.next();

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    // CLAVE: nunca redirigimos a la ruta de login. Si no hay sesión,
    // /admin y todas sus subrutas deben comportarse como si no existieran,
    // sin dejar ningún rastro de hacia dónde está el login real.
    return adminNotFoundResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

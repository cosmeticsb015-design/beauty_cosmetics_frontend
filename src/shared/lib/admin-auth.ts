export const ADMIN_SESSION_COOKIE = "bc_admin_jwt";

export const ADMIN_DEFAULT_LOGIN_PATH = "/admin/login";

function normalizeLoginPath(rawPath: string) {
  const trimmed = rawPath.trim();
  if (!trimmed) return ADMIN_DEFAULT_LOGIN_PATH;
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.length > 1 && withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

/**
 * Ruta pública por la que se accede al login del admin. Se controla con
 * ADMIN_LOGIN_PATH para evitar que la ruta quede hardcodeada y sea
 * adivinable por un atacante. Si no se configura, cae al valor por
 * defecto (solo recomendado en desarrollo local).
 */
export function getAdminLoginPath() {
  return normalizeLoginPath(process.env.ADMIN_LOGIN_PATH ?? "");
}

export function isCustomAdminLoginPath() {
  return getAdminLoginPath() !== ADMIN_DEFAULT_LOGIN_PATH;
}
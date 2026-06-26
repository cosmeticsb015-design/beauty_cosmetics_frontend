import type { NextConfig } from "next";
import { ADMIN_DEFAULT_LOGIN_PATH, getAdminLoginPath } from "./src/shared/lib/admin-auth";

const allowedDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const adminLoginPath = getAdminLoginPath();

const nextConfig: NextConfig = {
  allowedDevOrigins,

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "api.beautycosmeticssv.com" },
    ],
  },

  async rewrites() {
    // Resuelto en la capa de ruteo de Next (sin red, sin TLS, sin proxy
    // interno). Esto reemplaza el NextResponse.rewrite() que antes vivía en
    // proxy.ts y que causaba el error EPROTO en producción detrás de Nginx.
    if (adminLoginPath === ADMIN_DEFAULT_LOGIN_PATH) return [];
    return [{ source: adminLoginPath, destination: ADMIN_DEFAULT_LOGIN_PATH }];
  },
};

export default nextConfig;
"use client";

import { Gift, HandFist, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const preFooterFeatures = [
  {
    id: "feat-envios",
    title: "ENVIOS RAPIDOS",
    desc: "A todo El Salvador",
    icon: <Truck className="w-6 h-6 text-[#9E3659]" />,
  },
  {
    id: "feat-segura",
    title: "PAGA SEGURO",
    desc: "Tus compras están protegidas",
    icon: <ShieldCheck className="w-6 h-6 text-[#9E3659]" />,
  },
  {
    id: "feat-soporte",
    title: "ATENCIÓN PERSONALIZADA",
    desc: "Estamos aqui para ayudarte",
    icon: <HandFist className="w-6 h-6 text-[#9E3659]" />,
  },
  {
    id: "feat-regalos",
    title: "REGALOS Y MUESTRAS",
    desc: "En compras selecionadas",
    icon: <Gift className="w-6 h-6 text-[#9E3659]" />,
  },
];

const explorarLinks = [
  { label: "Tiendas", href: "/catalog" },
];

const soporteLinks = [
  { label: "Preguntas Frecuentes", href: "/faq" },
  { label: "Seguimiento", href: "/tracking" },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer id="footer" className="w-full flex flex-col bg-white">

      {/* Pre-footer: Features bar */}
      <div className="w-full bg-[#FCEDF0] border-t border-[#F5C6D0]/40 py-5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4">
          {preFooterFeatures.map((feat, i) => (
            <div
              key={feat.id}
              className={`flex items-center gap-3 px-6 py-3 ${i < preFooterFeatures.length - 1
                ? "border-r border-[#D4738F]/30"
                : ""
                }`}
            >
              <div className="shrink-0">{feat.icon}</div>
              <div>
                <h4 className="text-[11px] font-bold text-[#2D1F23] tracking-wide uppercase leading-tight">
                  {feat.title}
                </h4>
                <p className="text-[11px] text-[#9E3659] mt-0.5">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full py-12 grid md:grid-cols-3 gap-12">

        {/* Brand Info */}
        <div className="flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center">
            <img
              src="/bc-logo.png"
              alt="Beauty Cosmetics"
              className="h-14 w-auto"

            />
          </Link>
          <div className="text-sm text-[#8A7A7E] leading-relaxed max-w-xs">
            <p className="font-bold text-[#2D1F23]">Beauty Cosmetics</p>
            <p>
              Maquillaje y skincare auténticos, seleccionados cuidadosamente para quienes buscan calidad, confianza y resultados reales.
            </p>
          </div>
          {/* Social Icons */}
          <div className="flex gap-3 mt-1">
            <a
              href="https://www.instagram.com/beautycosmetics_sv/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-[#E8D5DB] flex items-center justify-center text-[#C15074] hover:bg-[#FCEDF0] transition-colors duration-200"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-[#E8D5DB] flex items-center justify-center text-[#C15074] hover:bg-[#FCEDF0] transition-colors duration-200"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@beautycosmetics_sv?_r=1&_t=ZS-97KUhWuXQA9"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-9 h-9 rounded-full border border-[#E8D5DB] flex items-center justify-center text-[#C15074] hover:bg-[#FCEDF0] transition-colors duration-200"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.6 5.82a5.6 5.6 0 0 0 3.28 1.05v3.18a8.7 8.7 0 0 1-3.31-.66v5.64a5.74 5.74 0 1 1-5.74-5.74c.34 0 .67.03.99.09v3.28a2.55 2.55 0 1 0 1.57 2.36V2h3.15c.1 1.43.86 2.83 2.06 3.82Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Explorar Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[11px] font-bold text-[#C15074] tracking-widest uppercase">
            EXPLORAR
          </h4>
          <ul className="flex flex-col gap-3">
            {explorarLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-[#554246] hover:text-[#C15074] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Soporte Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[11px] font-bold text-[#C15074] tracking-widest uppercase">
            SOPORTE
          </h4>
          <ul className="flex flex-col gap-3">
            {soporteLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-[#554246] hover:text-[#C15074] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#F0E4E8] w-full py-5 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#AC9CA0]">
          <p>© {new Date().getFullYear()} BEAUTY COSMETICS. TODOS LOS DERECHOS RESERVADOS.</p>
        </div>
      </div>

    </footer>
  );
}

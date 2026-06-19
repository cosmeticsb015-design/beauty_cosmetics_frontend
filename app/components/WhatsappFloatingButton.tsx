"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const DEFAULT_MESSAGE = "Hola, quiero más información sobre Beauty Cosmetics.";

function normalizeWhatsappNumber(number?: string | null) {
  if (!number) return "";
  return number.replace(/[^\d]/g, "");
}

type WhatsappFloatingButtonProps = {
  whatsappNumber?: string | null;
};

export default function WhatsappFloatingButton({ whatsappNumber: configuredWhatsappNumber }: WhatsappFloatingButtonProps) {
  const pathname = usePathname();
  const whatsappNumber = normalizeWhatsappNumber(configuredWhatsappNumber);

  if (!whatsappNumber || pathname?.startsWith("/admin")) return null;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-105 hover:bg-[#1DB954] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 md:bottom-7 md:right-7 md:h-16 md:w-16"
    >
      <MessageCircle size={30} strokeWidth={2.4} aria-hidden="true" />
      <span className="sr-only">Abrir WhatsApp</span>
    </a>
  );
}

"use client";
// RUTA (archivo nuevo): src/shared/components/HeroBackgroundSlider.tsx

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { HomeBanner } from "@/src/shared/services/storeConfig";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337").replace(/\/$/, "");
const AUTO_SLIDE_MS = 6000;
const FADE_MS = 900;

function mediaUrl(url?: string | null) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

export default function HeroBackgroundSlider({ banners = [] }: { banners?: HomeBanner[] }) {
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // Por defecto asumimos desktop hasta que el efecto confirme el viewport
  // real; así el primer render del servidor y el del cliente coinciden
  // (sin esto, el filtro por display_scope causaría un parpadeo o un
  // mismatch de hidratación).
  const [isDesktopViewport, setIsDesktopViewport] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    setIsDesktopViewport(query.matches);
    const handleChange = (event: MediaQueryListEvent) => setIsDesktopViewport(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  // Se filtra por display_scope aquí (en JS), no con clases CSS de
  // "ocultar": así nunca puede pasar que la imagen "activa" en el ciclo de
  // autoplay sea una que está oculta en el viewport actual, lo que dejaría
  // un hueco en blanco mientras le toca su turno.
  const slides = useMemo(
    () =>
      banners
        .filter((banner) => banner.active !== false && (banner.desktop_image?.url || banner.mobile_image?.url))
        .filter((banner) => {
          if (banner.display_scope === "desktop_only") return isDesktopViewport;
          if (banner.display_scope === "mobile_only") return !isDesktopViewport;
          return true;
        })
        .sort((a, b) => (a.home_position ?? 0) - (b.home_position ?? 0)),
    [banners, isDesktopViewport]
  );

  // Si el número de slides cambia (ej. al cruzar el breakpoint), el índice
  // activo se recoloca dentro del rango válido en vez de quedar apuntando
  // a una posición que ya no existe.
  useEffect(() => {
    setActiveIndex((current) => (slides.length ? current % slides.length : 0));
  }, [slides.length]);

  const goTo = useCallback(
    (index: number) => {
      if (!slides.length) return;
      setActiveIndex(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  const pause = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
  }, []);

  const resumeSoon = useCallback(() => {
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, AUTO_SLIDE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // Avance automático: cambia el índice activo cada AUTO_SLIDE_MS; la
  // transición visual la hace el CSS (transition-opacity), no JS, así que
  // siempre es fluida sin importar la velocidad del dispositivo.
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = window.setInterval(() => {
      if (!pausedRef.current && document.visibilityState === "visible") {
        setActiveIndex((current) => (current + 1) % slides.length);
      }
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  const navigateManually = useCallback(
    (index: number) => {
      pause();
      resumeSoon();
      goTo(index);
    },
    [pause, resumeSoon, goTo]
  );

  if (!slides.length) return null;

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Promociones destacadas"
      onMouseEnter={pause}
      onMouseLeave={() => {
        if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
        pausedRef.current = false;
      }}
    >
      {slides.map((banner, index) => {
        const desktopUrl = mediaUrl(banner.desktop_image?.url) ?? mediaUrl(banner.mobile_image?.url);
        const mobileUrl = mediaUrl(banner.mobile_image?.url) ?? desktopUrl;
        if (!desktopUrl) return null;
        const isActive = index === activeIndex;

        const picture = (
          <picture className="block h-full w-full">
            {mobileUrl ? <source media="(max-width: 767px)" srcSet={mobileUrl} /> : null}
            <img
              src={desktopUrl}
              alt={banner.name}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              className="h-full w-full object-cover"
            />
          </picture>
        );

        return (
          <div
            key={`hero-slide-${banner.id ?? banner.name}-${index}`}
            className="absolute inset-0 transition-opacity ease-out"
            style={{ opacity: isActive ? 1 : 0, transitionDuration: `${FADE_MS}ms`, pointerEvents: isActive ? "auto" : "none" }}
            aria-hidden={isActive ? undefined : true}
            aria-roledescription={isActive ? "slide" : undefined}
            aria-label={isActive ? `${index + 1} de ${slides.length}: ${banner.name}` : undefined}
          >
            {banner.destination_url ? (
              <Link href={banner.destination_url} aria-label={banner.name} className="block h-full w-full">
                {picture}
              </Link>
            ) : (
              picture
            )}
          </div>
        );
      })}

      {/* Overlay para que el texto blanco del Hero siga siendo legible
          encima de cualquier foto, manteniendo el tono de marca. */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#9E3659]/85 via-[#C15074]/60 to-[#C15074]/20" />

      {slides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => navigateManually(activeIndex - 1)}
            aria-label="Ver promoción anterior"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#9E3659] shadow-[0_8px_24px_rgba(45,31,35,0.25)] transition hover:scale-105 hover:bg-white md:left-6 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.3} />
          </button>
          <button
            type="button"
            onClick={() => navigateManually(activeIndex + 1)}
            aria-label="Ver siguiente promoción"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#9E3659] shadow-[0_8px_24px_rgba(45,31,35,0.25)] transition hover:scale-105 hover:bg-white md:right-6 md:h-12 md:w-12"
          >
            <ChevronRight className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.3} />
          </button>
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-8">
            {slides.map((banner, index) => (
              <button
                key={`hero-dot-${banner.id ?? index}`}
                type="button"
                onClick={() => navigateManually(index)}
                aria-label={`Ver promoción ${index + 1} de ${slides.length}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all ${activeIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
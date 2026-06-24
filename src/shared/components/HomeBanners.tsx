"use client";
// RUTA: src/shared/components/HomeBanners.tsx

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { HomeBanner } from "@/src/shared/services/storeConfig";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337").replace(/\/$/, "");
// Velocidad del movimiento automático continuo, en píxeles por segundo. Es
// independiente del refresco de pantalla (se calcula con delta de tiempo
// real entre frames), así que se ve igual de fluido en cualquier dispositivo.
const SCROLL_SPEED_PX_PER_SEC = 38;
// Tras cualquier interacción manual (flechas, puntos, teclado, swipe, drag)
// se le da un respiro a la persona antes de que el movimiento automático
// retome, en vez de pelearse con lo que está mirando o arrastrando.
const RESUME_AFTER_INTERACTION_MS = 2500;
const SCROLL_GAP_PX = 12; // debe coincidir con la clase gap-3 del contenedor
// Por defecto se ven hasta 3 banners en desktop (ver lg:min-w-[31.6%] en
// cada tarjeta); se usa para decidir qué imágenes cargar "eager" vs "lazy".
const DEFAULT_VISIBLE_COUNT = 3;

function mediaUrl(url?: string | null) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

function scopeClass(scope: HomeBanner["display_scope"]) {
  if (scope === "desktop_only") return "hidden md:block";
  if (scope === "mobile_only") return "block md:hidden";
  return "block";
}

// Solo tarjetas realmente visibles en el breakpoint actual. offsetParent es
// null cuando el propio elemento (o un ancestro) tiene display:none, que es
// justo lo que le pasa a una tarjeta "solo desktop" en mobile o viceversa.
function getVisibleCards(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>("[data-home-banner-card]")).filter(
    (card) => card.offsetParent !== null
  );
}

export default function HomeBanners({ banners = [] }: { banners?: HomeBanner[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [liveMessage, setLiveMessage] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const visibleBanners = useMemo(
    () =>
      banners
        .filter((banner) => banner.active !== false && banner.desktop_image?.url)
        .sort((a, b) => (a.home_position ?? 0) - (b.home_position ?? 0)),
    [banners]
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const handleChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  // ---- Movimiento automático continuo (requestAnimationFrame) ----
  // En vez de "saltar" cada N segundos con setInterval, esto avanza
  // scrollLeft un poquito en CADA frame, calculando cuánto según el tiempo
  // real transcurrido (no según número de frames). Resultado: deslizamiento
  // fluido y constante, no pasos. Al llegar al final, vuelve al inicio.
  // pausedRef se revisa fresco en cada frame, así que nunca hay un closure
  // viejo/atascado que lo deje "pegado" pausado o sin arrancar.
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || reducedMotion) return;

    let rafId = 0;
    let lastTimestamp: number | null = null;

    const hasOverflow = () => slider.scrollWidth > slider.clientWidth + 1;

    const tick = (timestamp: number) => {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      // Si la pestaña estuvo en segundo plano, el siguiente frame puede
      // traer un delta enorme; lo recortamos para no "teletransportar" el
      // scroll de golpe al volver a la pestaña.
      const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      if (!pausedRef.current && document.visibilityState === "visible" && hasOverflow()) {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        const next = slider.scrollLeft + SCROLL_SPEED_PX_PER_SEC * deltaSeconds;
        slider.scrollLeft = next >= maxScroll ? 0 : next;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [reducedMotion, visibleBanners.length]);

  // ---- Resaltado del punto activo (solo visual, no mueve nada) ----
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cards = getVisibleCards(slider);
    if (cards.length <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;
        const index = cards.indexOf(mostVisible.target as HTMLElement);
        if (index >= 0) setActiveIndex(index);
      },
      { root: slider, threshold: [0.6] }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [visibleBanners.length]);

  // ---- Navegación manual: flechas avanzan/retroceden una tarjeta ----
  const stepByOneCard = useCallback(
    (direction: 1 | -1) => {
      const slider = sliderRef.current;
      if (!slider) return;
      const cards = getVisibleCards(slider);
      const cardWidth = cards[0]?.getBoundingClientRect().width ?? slider.clientWidth;
      slider.scrollBy({ left: direction * (cardWidth + SCROLL_GAP_PX), behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion]
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const slider = sliderRef.current;
      if (!slider) return;
      const cards = getVisibleCards(slider);
      if (!cards.length) return;
      const normalizedIndex = ((index % cards.length) + cards.length) % cards.length;
      const card = cards[normalizedIndex];
      if (!card) return;
      slider.scrollTo({ left: card.offsetLeft - slider.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [reducedMotion]
  );

  const pause = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
  }, []);

  const resumeSoon = useCallback(() => {
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_AFTER_INTERACTION_MS);
  }, []);

  const resumeNow = useCallback(() => {
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    pausedRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const navigateManually = useCallback(
    (action: () => void, targetIndex: number) => {
      pause();
      resumeSoon();
      action();
      // Solo anunciamos a lectores de pantalla cuando la navegación la pidió
      // la persona; el movimiento automático no se anuncia (sería una
      // interrupción constante para quien usa lector de pantalla).
      setLiveMessage(`Mostrando promoción ${targetIndex + 1} de ${visibleBanners.length}`);
    },
    [pause, resumeSoon, visibleBanners.length]
  );

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateManually(() => stepByOneCard(-1), (activeIndex - 1 + visibleBanners.length) % visibleBanners.length);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateManually(() => stepByOneCard(1), (activeIndex + 1) % visibleBanners.length);
    }
  };

  if (!visibleBanners.length) return null;

  return (
    <section
      className="bg-[#FFF7F9] py-6 sm:py-7"
      aria-roledescription="carousel"
      aria-label="Promociones destacadas"
      onMouseEnter={pause}
      onMouseLeave={resumeNow}
      onFocus={pause}
      onBlur={resumeNow}
      onPointerDown={pause}
      onPointerUp={resumeSoon}
      onTouchStart={pause}
      onTouchEnd={resumeSoon}
    >
      <div className="section-container relative">
        {visibleBanners.length > 1 ? (
          <button
            type="button"
            onClick={() => navigateManually(() => stepByOneCard(-1), (activeIndex - 1 + visibleBanners.length) % visibleBanners.length)}
            aria-label="Ver banner anterior"
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#9E3659] shadow-[0_8px_24px_rgba(45,31,35,0.18)] ring-1 ring-[#E7BFC9] transition hover:-translate-y-1/2 hover:scale-105 hover:bg-white md:left-1 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-7 w-7 md:h-[38px] md:w-[38px]" strokeWidth={2.2} />
          </button>
        ) : null}

        <div
          ref={sliderRef}
          role="group"
          aria-label="Lista de promociones, navegable con las flechas del teclado"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="flex gap-3 overflow-x-auto px-1 pb-1 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-[#9E3659] focus-visible:ring-offset-2 [&::-webkit-scrollbar]:hidden md:px-10"
        >
          {visibleBanners.map((banner, index) => {
            const desktopUrl = mediaUrl(banner.desktop_image?.url);
            const mobileUrl = mediaUrl(banner.mobile_image?.url) ?? desktopUrl;
            const isAboveTheFold = index < DEFAULT_VISIBLE_COUNT;
            const content = (
              <picture>
                {mobileUrl ? <source media="(max-width: 767px)" srcSet={mobileUrl} /> : null}
                <img
                  src={desktopUrl ?? ""}
                  alt={banner.name}
                  loading={isAboveTheFold ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
              </picture>
            );

            return (
              <article
                id={`home-banner-${banner.id ?? banner.home_position}`}
                data-home-banner-card
                key={`${banner.id ?? banner.name}-${banner.home_position}`}
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${visibleBanners.length}: ${banner.name}`}
                className={`${scopeClass(banner.display_scope)} group relative min-w-full shrink-0 overflow-hidden rounded-[14px] bg-white shadow-[0_12px_28px_rgba(45,31,35,0.16)] ring-1 ring-[#F1CCD5]/80 sm:min-w-[46%] lg:min-w-[31.6%]`}
              >
                <div className="aspect-[16/9] md:aspect-[120/63]">
                  {banner.destination_url ? <Link href={banner.destination_url} aria-label={banner.name}>{content}</Link> : content}
                </div>
              </article>
            );
          })}
        </div>

        {visibleBanners.length > 1 ? (
          <button
            type="button"
            onClick={() => navigateManually(() => stepByOneCard(1), (activeIndex + 1) % visibleBanners.length)}
            aria-label="Ver siguiente banner"
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#9E3659] shadow-[0_8px_24px_rgba(45,31,35,0.18)] ring-1 ring-[#E7BFC9] transition hover:-translate-y-1/2 hover:scale-105 hover:bg-white md:right-1 md:h-12 md:w-12"
          >
            <ChevronRight className="h-7 w-7 md:h-[38px] md:w-[38px]" strokeWidth={2.2} />
          </button>
        ) : null}

        {visibleBanners.length > 1 ? (
          <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Selector de promociones">
            {visibleBanners.map((banner, index) => (
              <button
                key={`home-banner-dot-${banner.id ?? index}`}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                onClick={() => navigateManually(() => scrollToIndex(index), index)}
                aria-label={`Ver banner ${index + 1} de ${visibleBanners.length}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all ${activeIndex === index ? "w-8 bg-[#9E3659]" : "w-2.5 bg-[#E7BFC9] hover:bg-[#D4738F]"}`}
              />
            ))}
          </div>
        ) : null}

        <p className="sr-only" aria-live="polite">
          {liveMessage}
        </p>
      </div>
    </section>
  );
}
"use client";
// RUTA: src/shared/components/HomeBanners.tsx

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { HomeBanner } from "@/src/shared/services/storeConfig";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337"
).replace(/\/$/, "");

/**
 * Velocidad constante del carrusel en píxeles por segundo.
 * Un valor moderado evita que se vea apresurado y mantiene una
 * sensación profesional y fluida.
 */
const SCROLL_SPEED_PX_PER_SEC = 28;

/**
 * Tiempo que espera el slider después de una interacción manual
 * antes de volver a desplazarse automáticamente.
 */
const RESUME_AFTER_INTERACTION_MS = 2600;

/**
 * Cantidad aproximada de banners que pueden mostrarse inicialmente
 * en pantallas grandes.
 */
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

/**
 * Obtiene únicamente los banners visibles en el breakpoint actual.
 * Esto permite que desktop_only y mobile_only funcionen correctamente.
 */
function getVisibleCards(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>("[data-home-banner-card]")
  ).filter((card) => card.offsetParent !== null);
}

function sameArray(first: number[], second: number[]) {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

export default function HomeBanners({
  banners = [],
}: {
  banners?: HomeBanner[];
}) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<number | null>(null);
  const loopDistanceRef = useRef(0);
  const activeBannerIndexRef = useRef(0);

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [liveMessage, setLiveMessage] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  /**
   * Guarda los índices de banners realmente visibles según el dispositivo.
   * Así los indicadores no muestran banners desktop en móvil ni viceversa.
   */
  const [visibleSlideIndexes, setVisibleSlideIndexes] = useState<number[]>(
    []
  );

  const visibleBanners = useMemo(
    () =>
      banners
        .filter(
          (banner) =>
            banner.active !== false &&
            (banner.desktop_image?.url || banner.mobile_image?.url)
        )
        .sort(
          (first, second) =>
            (first.home_position ?? 0) - (second.home_position ?? 0)
        ),
    [banners]
  );

  /**
   * Cuando hay más de un banner visible, se duplica el contenido
   * para generar desplazamiento infinito sin saltos visuales.
   */
  const shouldLoop =
    visibleSlideIndexes.length > 1 ||
    (visibleSlideIndexes.length === 0 && visibleBanners.length > 1);

  const trackBanners = useMemo(() => {
    if (!shouldLoop) return visibleBanners;
    return [...visibleBanners, ...visibleBanners];
  }, [shouldLoop, visibleBanners]);

  /**
   * Banners disponibles para los puntos y navegación según el breakpoint.
   */
  const activeSlides = useMemo(() => {
    const slidesFromViewport = visibleSlideIndexes
      .map((index) => ({
        banner: visibleBanners[index],
        index,
      }))
      .filter(
        (
          slide
        ): slide is {
          banner: HomeBanner;
          index: number;
        } => Boolean(slide.banner)
      );

    if (slidesFromViewport.length) return slidesFromViewport;

    return visibleBanners.map((banner, index) => ({
      banner,
      index,
    }));
  }, [visibleBanners, visibleSlideIndexes]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateReducedMotion = () => {
      setReducedMotion(query.matches);
    };

    updateReducedMotion();
    query.addEventListener("change", updateReducedMotion);

    return () => {
      query.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  /**
   * Actualiza el punto activo tomando como referencia el banner
   * que está más cerca del borde izquierdo visible del slider.
   */
  const updateActiveBanner = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const cards = getVisibleCards(slider);
    if (!cards.length) return;

    const visibleStartPosition = slider.scrollLeft + 16;

    const closestCard = cards.reduce((closest, card) => {
      const closestDistance = Math.abs(
        closest.offsetLeft - visibleStartPosition
      );

      const currentDistance = Math.abs(card.offsetLeft - visibleStartPosition);

      return currentDistance < closestDistance ? card : closest;
    });

    const index = Number(closestCard.dataset.bannerIndex ?? 0);

    if (Number.isNaN(index)) return;

    if (activeBannerIndexRef.current !== index) {
      activeBannerIndexRef.current = index;
      setActiveBannerIndex(index);
    }
  }, []);

  /**
   * Calcula la distancia exacta de una vuelta completa del carrusel.
   * Al llegar a esa distancia, el scroll vuelve matemáticamente al inicio
   * de la copia original sin que la persona perciba un corte visual.
   */
  const syncSliderMetrics = useCallback(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const cards = getVisibleCards(slider);

    if (!cards.length) {
      loopDistanceRef.current = 0;
      setVisibleSlideIndexes([]);
      return;
    }

    const originalCardsCount = shouldLoop
      ? Math.floor(cards.length / 2)
      : cards.length;

    const visibleIndexes = cards
      .slice(0, originalCardsCount)
      .map((card) => Number(card.dataset.bannerIndex))
      .filter((index) => !Number.isNaN(index));

    setVisibleSlideIndexes((previousIndexes) =>
      sameArray(previousIndexes, visibleIndexes)
        ? previousIndexes
        : visibleIndexes
    );

    if (
      visibleIndexes.length &&
      !visibleIndexes.includes(activeBannerIndexRef.current)
    ) {
      activeBannerIndexRef.current = visibleIndexes[0];
      setActiveBannerIndex(visibleIndexes[0]);
    }

    const firstCard = cards[0];
    const firstDuplicatedCard = cards[originalCardsCount];

    if (
      !shouldLoop ||
      visibleIndexes.length <= 1 ||
      !firstCard ||
      !firstDuplicatedCard
    ) {
      loopDistanceRef.current = 0;

      if (!shouldLoop) {
        slider.scrollLeft = 0;
      }

      updateActiveBanner();
      return;
    }

    loopDistanceRef.current = Math.max(
      0,
      firstDuplicatedCard.offsetLeft - firstCard.offsetLeft
    );

    /**
     * Evita posiciones inválidas cuando cambia el tamaño de pantalla.
     */
    if (
      loopDistanceRef.current > 0 &&
      slider.scrollLeft >= loopDistanceRef.current
    ) {
      slider.scrollLeft %= loopDistanceRef.current;
    }

    updateActiveBanner();
  }, [shouldLoop, updateActiveBanner]);

  /**
   * Recalcula posiciones al cambiar tamaño, orientación o breakpoint.
   */
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let frameId = 0;

    const scheduleSync = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(syncSliderMetrics);
    };

    scheduleSync();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleSync)
        : null;

    resizeObserver?.observe(slider);
    window.addEventListener("resize", scheduleSync);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", scheduleSync);
    };
  }, [syncSliderMetrics]);

  /**
   * Movimiento automático continuo.
   *
   * requestAnimationFrame permite que el desplazamiento sea suave,
   * calculado según el tiempo real entre cuadros, no con saltos de intervalo.
   */
  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || reducedMotion || visibleBanners.length <= 1) return;

    let animationFrameId = 0;
    let lastTimestamp: number | null = null;

    const move = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      /**
       * Limita el delta para evitar un salto grande cuando la pestaña
       * vuelve a estar activa después de estar en segundo plano.
       */
      const deltaSeconds = Math.min(
        (timestamp - lastTimestamp) / 1000,
        0.08
      );

      lastTimestamp = timestamp;

      const loopDistance = loopDistanceRef.current;

      const canMove =
        !pausedRef.current &&
        document.visibilityState === "visible" &&
        loopDistance > 0 &&
        slider.scrollWidth > slider.clientWidth + 1;

      if (canMove) {
        /**
         * Si el scroll está ya dentro de la copia visual,
         * lo normaliza sobre la primera sin alterar la imagen visible.
         */
        const currentPosition =
          slider.scrollLeft >= loopDistance
            ? slider.scrollLeft % loopDistance
            : slider.scrollLeft;

        const nextPosition =
          currentPosition + SCROLL_SPEED_PX_PER_SEC * deltaSeconds;

        /**
         * Aquí está la parte clave del loop continuo:
         * en vez de volver abruptamente a cero, conserva el sobrante
         * de píxeles para que no exista salto visual.
         */
        slider.scrollLeft =
          nextPosition >= loopDistance
            ? nextPosition - loopDistance
            : nextPosition;
      }

      animationFrameId = window.requestAnimationFrame(move);
    };

    animationFrameId = window.requestAnimationFrame(move);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion, visibleBanners.length]);

  const pause = useCallback(() => {
    pausedRef.current = true;

    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }
  }, []);

  const resumeSoon = useCallback(() => {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    resumeTimeoutRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_AFTER_INTERACTION_MS);
  }, []);

  const resumeNow = useCallback(() => {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }

    pausedRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Busca la copia más cercana del banner solicitado.
   * Esto evita que los botones hagan un recorrido largo e incómodo
   * cuando el carrusel ya está cerca de la segunda copia visual.
   */
  const scrollToBanner = useCallback(
    (bannerIndex: number) => {
      const slider = sliderRef.current;
      if (!slider) return;

      const cards = getVisibleCards(slider);

      const candidates = cards.filter(
        (card) => Number(card.dataset.bannerIndex) === bannerIndex
      );

      if (!candidates.length) return;

      const closestCard = candidates.reduce((closest, card) => {
        const closestDistance = Math.abs(
          closest.offsetLeft - slider.scrollLeft
        );

        const currentDistance = Math.abs(card.offsetLeft - slider.scrollLeft);

        return currentDistance < closestDistance ? card : closest;
      });

      slider.scrollTo({
        left: closestCard.offsetLeft,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion]
  );

  const goToBanner = useCallback(
    (bannerIndex: number) => {
      const totalSlides = activeSlides.length;
      if (!totalSlides) return;

      const targetPosition = activeSlides.findIndex(
        (slide) => slide.index === bannerIndex
      );

      const normalizedPosition =
        targetPosition >= 0 ? targetPosition : 0;

      const targetBanner = activeSlides[normalizedPosition];

      if (!targetBanner) return;

      pause();
      scrollToBanner(targetBanner.index);
      resumeSoon();

      setLiveMessage(
        `Mostrando promoción ${normalizedPosition + 1} de ${totalSlides}`
      );
    },
    [activeSlides, pause, resumeSoon, scrollToBanner]
  );

  const handleKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>
  ) => {
    if (!activeSlides.length) return;

    const activePosition = Math.max(
      0,
      activeSlides.findIndex(
        (slide) => slide.index === activeBannerIndex
      )
    );

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      const previousPosition =
        (activePosition - 1 + activeSlides.length) %
        activeSlides.length;

      goToBanner(activeSlides[previousPosition].index);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();

      const nextPosition =
        (activePosition + 1) % activeSlides.length;

      goToBanner(activeSlides[nextPosition].index);
    }
  };

  if (!visibleBanners.length) return null;

  const totalSlides = activeSlides.length;

  const activeSlidePosition = Math.max(
    0,
    activeSlides.findIndex(
      (slide) => slide.index === activeBannerIndex
    )
  );

  const previousBannerIndex =
    activeSlides[
      (activeSlidePosition - 1 + totalSlides) % totalSlides
    ]?.index ?? 0;

  const nextBannerIndex =
    activeSlides[
      (activeSlidePosition + 1) % totalSlides
    ]?.index ?? 0;

  return (
    <section
      className="overflow-hidden bg-gradient-to-b from-[#FFF8FA] via-white to-[#FFF7F9] py-7 sm:py-9"
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
      <div className="section-container">
        <div className="relative rounded-[26px] border border-[#F2D7DE] bg-white/70 p-2 shadow-[0_18px_50px_rgba(91,47,61,0.10)] backdrop-blur-sm sm:rounded-[30px] sm:p-3">
          {totalSlides > 1 ? (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-3 left-0 z-[1] hidden w-20 bg-gradient-to-r from-white via-white/80 to-transparent md:block"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-3 right-0 z-[1] hidden w-20 bg-gradient-to-l from-white via-white/80 to-transparent md:block"
              />
            </>
          ) : null}

          {totalSlides > 1 ? (
            <button
              type="button"
              onClick={() => goToBanner(previousBannerIndex)}
              aria-label="Ver banner anterior"
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#9E3659] shadow-[0_10px_25px_rgba(68,32,43,0.18)] backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-white hover:text-[#7C2344] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E3659] focus-visible:ring-offset-2 sm:h-11 sm:w-11 md:left-5 md:h-12 md:w-12"
            >
              <ChevronLeft
                className="h-5 w-5 sm:h-6 sm:w-6"
                strokeWidth={2.4}
              />
            </button>
          ) : null}

          <div
            ref={sliderRef}
            role="group"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onScroll={updateActiveBanner}
            aria-label="Lista de promociones. Usa las flechas izquierda y derecha para navegar."
            className="flex cursor-grab gap-4 overflow-x-auto px-0.5 pb-1 outline-none [scrollbar-width:none] active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-[#9E3659] focus-visible:ring-offset-4 [&::-webkit-scrollbar]:hidden sm:px-1"
          >
            {trackBanners.map((banner, renderIndex) => {
              const sourceIndex =
                renderIndex % visibleBanners.length;

              const isDuplicatedSlide =
                shouldLoop &&
                renderIndex >= visibleBanners.length;

              const slidePosition = activeSlides.findIndex(
                (slide) => slide.index === sourceIndex
              );

              const accessibleSlidePosition =
                slidePosition >= 0
                  ? slidePosition + 1
                  : sourceIndex + 1;

              const desktopUrl =
                mediaUrl(banner.desktop_image?.url) ??
                mediaUrl(banner.mobile_image?.url);

              const mobileUrl =
                mediaUrl(banner.mobile_image?.url) ??
                desktopUrl;

              const isInitiallyVisible =
                !isDuplicatedSlide &&
                renderIndex < DEFAULT_VISIBLE_COUNT;

              if (!desktopUrl) return null;

              const bannerImage = (
                <picture className="block h-full w-full">
                  {mobileUrl ? (
                    <source
                      media="(max-width: 767px)"
                      srcSet={mobileUrl}
                    />
                  ) : null}

                  <img
                    src={desktopUrl}
                    alt={banner.name}
                    loading={isInitiallyVisible ? "eager" : "lazy"}
                    fetchPriority={
                      renderIndex === 0 ? "high" : "auto"
                    }
                    draggable={false}
                    sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 34vw"
                    className="h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  />
                </picture>
              );

              const bannerContent = banner.destination_url ? (
                <Link
                  href={banner.destination_url}
                  aria-label={
                    isDuplicatedSlide
                      ? undefined
                      : `Abrir promoción: ${banner.name}`
                  }
                  aria-hidden={
                    isDuplicatedSlide ? true : undefined
                  }
                  tabIndex={isDuplicatedSlide ? -1 : undefined}
                  className="block h-full w-full"
                >
                  {bannerImage}
                </Link>
              ) : (
                bannerImage
              );

              return (
                <article
                  id={`home-banner-${banner.id ?? banner.home_position}-${renderIndex}`}
                  data-home-banner-card
                  data-banner-index={sourceIndex}
                  key={`${banner.id ?? banner.name}-${renderIndex}`}
                  aria-hidden={isDuplicatedSlide ? true : undefined}
                  aria-roledescription={
                    isDuplicatedSlide ? undefined : "slide"
                  }
                  aria-label={
                    isDuplicatedSlide
                      ? undefined
                      : `${accessibleSlidePosition} de ${totalSlides}: ${banner.name}`
                  }
                  className={`${scopeClass(
                    banner.display_scope
                  )} group relative min-w-full shrink-0 overflow-hidden rounded-[20px] border border-[#F5DCE3] bg-[#FFF7F9] shadow-[0_12px_30px_rgba(75,34,47,0.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(75,34,47,0.20)] sm:min-w-[calc(50%-0.5rem)] sm:rounded-[22px] xl:min-w-[calc(33.333%-0.667rem)]`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
                    {bannerContent}

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/30"
                    />
                  </div>
                </article>
              );
            })}
          </div>

          {totalSlides > 1 ? (
            <button
              type="button"
              onClick={() => goToBanner(nextBannerIndex)}
              aria-label="Ver siguiente banner"
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#9E3659] shadow-[0_10px_25px_rgba(68,32,43,0.18)] backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-white hover:text-[#7C2344] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E3659] focus-visible:ring-offset-2 sm:h-11 sm:w-11 md:right-5 md:h-12 md:w-12"
            >
              <ChevronRight
                className="h-5 w-5 sm:h-6 sm:w-6"
                strokeWidth={2.4}
              />
            </button>
          ) : null}
        </div>

        {totalSlides > 1 ? (
          <div
            className="mt-5 flex items-center justify-center gap-2"
            role="group"
            aria-label="Selector de promociones"
          >
            {activeSlides.map(({ banner, index }, position) => {
              const isActive = activeBannerIndex === index;

              return (
                <button
                  key={`home-banner-dot-${banner.id ?? index}`}
                  type="button"
                  onClick={() => goToBanner(index)}
                  aria-label={`Ver promoción ${position + 1} de ${totalSlides}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E3659] focus-visible:ring-offset-2 ${
                    isActive
                      ? "w-9 bg-[#9E3659] shadow-[0_3px_10px_rgba(158,54,89,0.34)]"
                      : "w-2.5 bg-[#E9C6D1] hover:w-5 hover:bg-[#D57E9B]"
                  }`}
                />
              );
            })}
          </div>
        ) : null}

        <p className="sr-only" aria-live="polite">
          {liveMessage}
        </p>
      </div>
    </section>
  );
}
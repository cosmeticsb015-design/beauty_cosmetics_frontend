import Link from "next/link";
import type { HomeBanner } from "../services/storeConfig";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337").replace(/\/$/, "");

function mediaUrl(url?: string | null) {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
}

function scopeClass(scope: HomeBanner["display_scope"]) {
  if (scope === "desktop_only") return "hidden md:block";
  if (scope === "mobile_only") return "block md:hidden";
  return "block";
}

export default function HomeBanners({ banners = [] }: { banners?: HomeBanner[] }) {
  const visibleBanners = banners.filter((banner) => banner.active !== false && banner.desktop_image?.url);
  if (!visibleBanners.length) return null;

  return (
    <section className="bg-[#FFF7F9] px-4 py-8 md:px-8" aria-label="Promociones destacadas">
      <div className="mx-auto flex max-w-[1180px] gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:thin]">
        {visibleBanners.map((banner) => {
          const desktopUrl = mediaUrl(banner.desktop_image?.url);
          const mobileUrl = mediaUrl(banner.mobile_image?.url) ?? desktopUrl;
          const content = (
            <picture>
              {mobileUrl ? <source media="(max-width: 767px)" srcSet={mobileUrl} /> : null}
              <img src={desktopUrl ?? ""} alt={banner.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
            </picture>
          );

          return (
            <article key={`${banner.id ?? banner.name}-${banner.home_position}`} className={`${scopeClass(banner.display_scope)} group relative min-w-full snap-center overflow-hidden rounded-[10px] border border-[#F1CCD5] bg-white shadow-sm md:min-w-[calc(50%-0.5rem)]`}>
              <div className="aspect-[16/9] md:aspect-[21/8]">{banner.destination_url ? <Link href={banner.destination_url} aria-label={banner.name}>{content}</Link> : content}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

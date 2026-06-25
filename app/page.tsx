// RUTA: app/page.tsx

import HeroSection from "@/src/shared/components/HeroSection";
import CategoriesSection from "@/src/shared/components/CategoriesSection";
import FeaturedProduct from "@/src/shared/components/FeaturedProduct";
import EssenceSection from "@/src/shared/components/EssenceSection";
import GiftCardSection from "@/src/shared/components/GiftCardSection";
import NewsletterSection from "@/src/shared/components/NewsletterSection";
import SeoLandingSection from "@/src/shared/components/SeoLandingSection";
import { getCategories, getProducts, StrapiCategory, StrapiProduct } from "@/src/shared/services/producst";
import { getPublicStoreConfig } from "@/src/shared/services/storeConfig";


export const metadata = {
  title: "Beauty Cosmetics SV | Tienda Online de Maquillaje Original y Skincare",
  description:
    "Compra maquillaje original, skincare, cosmética y cuidado personal en Beauty Cosmetics El Salvador. Entregas en San Salvador y San Miguel, envíos a todo el país y sucursales en San Miguel y Usulután Plaza Mundo.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [featuredResponse, categoriesResponse, storeConfigResponse] = await Promise.all([
    getProducts({
      pageSize: 8,
      featured: true,
      sort: "createdAt:desc",
    }),
    getCategories(),
    getPublicStoreConfig(),
  ]);

  const featuredProducts: StrapiProduct[] = featuredResponse.data || [];
  const categories: StrapiCategory[] = categoriesResponse.data || [];

  return (
    <>
      {/* El carrusel de banners ahora vive DENTRO del Hero (como fondo
          rotativo), por eso ya no se renderiza <HomeBanners /> aparte. */}
      <HeroSection banners={storeConfigResponse.data?.home_banners} />
      <CategoriesSection categories={categories} />
      <FeaturedProduct products={featuredProducts} />
      <EssenceSection />
      <SeoLandingSection />
      <GiftCardSection whatsappNumber={storeConfigResponse.data?.whatsapp_number} />
      <NewsletterSection />
    </>
  );
}
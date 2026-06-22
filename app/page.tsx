import HeroSection from "@/src/shared/components/HeroSection";
import CategoriesSection from "@/src/shared/components/CategoriesSection";
import FeaturedProduct from "@/src/shared/components/FeaturedProduct";
import EssenceSection from "@/src/shared/components/EssenceSection";
import GiftCardSection from "@/src/shared/components/GiftCardSection";
import NewsletterSection from "@/src/shared/components/NewsletterSection";
import HomeBanners from "@/src/shared/components/HomeBanners";
import { getCategories, getProducts, StrapiCategory, StrapiProduct } from "@/src/shared/services/producst";
import { getPublicStoreConfig } from "@/src/shared/services/storeConfig";

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
      <HeroSection />
      <HomeBanners banners={storeConfigResponse.data?.home_banners} />
      <CategoriesSection categories={categories} />
      <FeaturedProduct products={featuredProducts} />
      <EssenceSection />
      <GiftCardSection whatsappNumber={storeConfigResponse.data?.whatsapp_number} />
      <NewsletterSection />
    </>
  );
}

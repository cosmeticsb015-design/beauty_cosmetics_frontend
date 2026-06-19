import HeroSection from "./components/HeroSection";
import CategoriesSection from "./components/CategoriesSection";
import FeaturedProduct from "./components/FeaturedProduct";
import EssenceSection from "./components/EssenceSection";
import GiftCardSection from "./components/GiftCardSection";
import NewsletterSection from "./components/NewsletterSection";
import HomeBanners from "./components/HomeBanners";
import { getCategories, getProducts, StrapiCategory, StrapiProduct } from "./services/producst";
import { getPublicStoreConfig } from "./services/storeConfig";

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
      <GiftCardSection />
      <NewsletterSection />
    </>
  );
}

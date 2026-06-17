import HeroSection from "./components/HeroSection";
import CategoriesSection from "./components/CategoriesSection";
import FeaturedProduct from "./components/FeaturedProduct";
import EssenceSection from "./components/EssenceSection";
import GiftCardSection from "./components/GiftCardSection";
import NewsletterSection from "./components/NewsletterSection";
import { getCategories, getProducts, StrapiCategory, StrapiProduct } from "./services/producst";

export default async function Home() {
  const [featuredResponse, categoriesResponse] = await Promise.all([
    getProducts({
      pageSize: 8,
      featured: true,
      sort: "createdAt:desc",
    }),
    getCategories(),
  ]);

  const featuredProducts: StrapiProduct[] = featuredResponse.data || [];
  const categories: StrapiCategory[] = categoriesResponse.data || [];

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProduct products={featuredProducts} />
      <EssenceSection />
      <GiftCardSection />
      <NewsletterSection />
    </>
  );
}

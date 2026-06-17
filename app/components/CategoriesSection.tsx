import Link from "next/link";
import { StrapiCategory } from "../services/producst";

interface CategoriesSectionProps {
  categories: StrapiCategory[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  const visibleCategories = categories
    .filter((category) => category.active && !category.parent)
    .slice(0, 4);

  return (
    <section id="categories-section" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between pb-4 mb-10 border-b border-[#F5C6D0]/40">
          <h2 className="text-2xl md:text-[28px] font-medium text-[#2D1F23] tracking-wide">
            Categorías Destacadas
          </h2>
          <Link
            href="/catalog"
            id="categories-view-all"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C15074] tracking-widest uppercase hover:text-[#9E3659] transition-colors"
          >
            VER TODAS <span className="text-sm">→</span>
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {visibleCategories.map((category) => (
            <Link
              key={category.documentId}
              href={`/catalog?category=${category.slug}`}
              id={`cat-${category.slug}`}
              className="flex flex-col items-start group"
            >
              <div className="w-full aspect-square rounded-[4px] bg-[#FCEDF0] flex items-center justify-center transition-all duration-300 group-hover:bg-[#F5C6D0]/50 group-hover:scale-[1.02]">
                <span className="text-sm font-semibold text-[#8C344E] uppercase tracking-[0.22em]">
                  {category.name}
                </span>
              </div>
              <span className="mt-4 text-[11px] md:text-xs font-semibold text-[#554246] tracking-[0.15em] transition-colors group-hover:text-[#C15074] uppercase">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}



import Link from "next/link";
import { Flower2, Paintbrush, Wind, Sparkles } from "lucide-react";

const categories = [
  {
    id: "cat-skincare",
    name: "SKINCARE",
    href: "/catalog?category=skincare",
    icon: <Flower2 size={40} strokeWidth={1.5} className="text-[#8C344E]" />,
  },
  {
    id: "cat-makeup",
    name: "MAKEUP",
    href: "/catalog?category=makeup",
    icon: <Paintbrush size={40} strokeWidth={1.5} className="text-[#8C344E]" />,
  },
  {
    id: "cat-fragrance",
    name: "FRAGRANCE",
    href: "/catalog?category=fragrance",
    icon: <Wind size={40} strokeWidth={1.5} className="text-[#8C344E]" />,
  },
  {
    id: "cat-wellness",
    name: "WELLNESS",
    href: "/catalog?category=wellness",
    icon: <Sparkles size={40} strokeWidth={1.5} className="text-[#8C344E]" />,
  },
];

export default function CategoriesSection() {
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
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              id={cat.id}
              className="flex flex-col items-start group"
            >
              {/* Pink square block */}
              <div className="w-full aspect-square rounded-[4px] bg-[#FCEDF0] flex items-center justify-center transition-all duration-300 group-hover:bg-[#F5C6D0]/50 group-hover:scale-[1.02]">
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {cat.icon}
                </div>
              </div>
              {/* Text label underneath */}
              <span className="mt-4 text-[11px] md:text-xs font-semibold text-[#554246] tracking-[0.15em] transition-colors group-hover:text-[#C15074] uppercase">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}



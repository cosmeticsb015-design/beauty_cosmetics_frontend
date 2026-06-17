"use client";

import ProductCard from "./ProductCard";
import { StrapiProduct } from "../services/producst";

interface FeaturedProductProps {
  products: StrapiProduct[];
}

export default function FeaturedProduct({ products }: FeaturedProductProps) {
  return (
    <section id="featured-product-section" className="py-16 md:py-24 bg-[#F9F5F0]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-4 mb-10 border-b border-[#F5C6D0]/40">
            <div>
              <h2 className="text-2xl md:text-[34px] font-medium text-[#2D1F23] tracking-wide">
                Productos Destacados
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[#554246]">
                Una selección especial de <span className="font-semibold text-[#C15074]">productos</span>.
              </p>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#AC9CA0]">
              Elige lo mejor para tu rutina
            </p>
          </div>

          {products.length === 0 ? (
            <p className="text-center text-sm text-[#AC9CA0]">
              No hay productos destacados disponibles en este momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.documentId} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

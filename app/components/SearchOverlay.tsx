"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getBrands,
  getCategories,
  getProducts,
  StrapiBrand,
  StrapiCategory,
  StrapiProduct,
} from "../services/producst";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337").replace(/\/$/, "");

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<StrapiCategory[]>([]);
  const [brands, setBrands] = useState<StrapiBrand[]>([]);
  const [products, setProducts] = useState<StrapiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load categories and brands on mount
  useEffect(() => {
    Promise.all([getCategories(), getBrands()])
      .then(([catsRes, brandsRes]) => {
        // Only show root/active categories
        setCategories((catsRes.data || []).filter((c) => !c.parent && c.active !== false).slice(0, 5));
        setBrands((brandsRes.data || []).filter((b) => b.active !== false).slice(0, 5));
      })
      .catch((err) => {
        console.error("Failed to load search filters", err);
      });
  }, []);

  // Fetch search products with debouncing
  useEffect(() => {
    setLoading(true);
    const delayDebounce = setTimeout(() => {
      getProducts({ search: query || undefined, pageSize: 6 })
        .then((res) => {
          setProducts(res.data || []);
        })
        .catch((err) => {
          console.error("Search failed", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Auto-focus input & lock scroll when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  const handleCategoryClick = (slug: string) => {
    router.push(`/catalog?category=${slug}`);
    onClose();
  };

  const handleProductClick = (documentId: string) => {
    router.push(`/catalog/${documentId}`);
    onClose();
  };

  const getProductImage = (product: StrapiProduct) => {
    const url = product.images?.[0]?.image?.url;
    return url ? `${API_BASE}${url}` : null;
  };

  return (
    <div
      id="search-overlay"
      className="fixed inset-0 z-[200] bg-[#F2F2F2] overflow-y-auto"
      style={{ animation: "fadeInOverlay 0.18s ease" }}
    >
      {/* Close button */}
      <div className="flex justify-end px-8 pt-6 pb-2">
        <button
          id="search-close"
          onClick={onClose}
          className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-[#2D1F23] hover:text-[#C15074] uppercase transition-colors"
        >
          FINALIZAR <X size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Search input */}
      <div className="max-w-2xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-3 bg-white border border-[#E8E0E4] rounded-[8px] px-5 py-3.5 shadow-sm">
          <Search size={18} strokeWidth={1.8} className="text-[#C15074] shrink-0" />
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Qué estás buscando hoy?"
            className="flex-1 text-sm text-[#2D1F23] placeholder:text-[#C0A8B0] outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#AC9CA0] hover:text-[#C15074] transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content grid: Categories/Brands + Products */}
      <div className="max-w-4xl mx-auto px-4 mt-10 pb-24 flex flex-col md:grid md:grid-cols-[200px_1fr] gap-8 md:gap-10">
        
        {/* Left: Categories & Brands */}
        <div className="flex flex-col gap-8">
          {categories.length > 0 && (
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#C15074] uppercase mb-4">
                CATEGORÍAS
              </p>
              <ul className="flex flex-col gap-3">
                {categories.map((cat) => (
                  <li key={cat.documentId}>
                    <button
                      onClick={() => handleCategoryClick(cat.slug)}
                      className="text-[12px] text-[#554246] hover:text-[#C15074] transition-colors text-left font-semibold uppercase tracking-wider"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {brands.length > 0 && (
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#C15074] uppercase mb-4">
                MARCAS
              </p>
              <ul className="flex flex-col gap-3">
                {brands.map((brand) => (
                  <li key={brand.documentId}>
                    <button
                      onClick={() => {
                        router.push("/catalog");
                        onClose();
                      }}
                      className="text-[12px] text-[#554246] hover:text-[#C15074] transition-colors text-left font-semibold uppercase tracking-wider"
                    >
                      {brand.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Products */}
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#C15074] uppercase mb-4">
            {loading ? "BUSCANDO..." : "PRODUCTOS"}
          </p>

          {products.length === 0 ? (
            <p className="text-sm text-[#AC9CA0] py-10 text-center">
              No se encontraron productos coincidentes.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((product) => {
                const img = getProductImage(product);
                return (
                  <div
                    key={product.documentId}
                    onClick={() => handleProductClick(product.documentId)}
                    className="bg-white rounded-[8px] overflow-hidden cursor-pointer group hover:shadow-md transition-shadow duration-300 flex flex-col"
                  >
                    <div className="w-full aspect-square flex items-center justify-center bg-[#FAF6F6] overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center">
                          <span className="text-xs">✨</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-1 justify-between">
                      <div>
                        {product.brand?.name && (
                          <p className="text-[10px] font-bold tracking-widest text-[#C15074] uppercase mb-1">
                            {product.brand.name}
                          </p>
                        )}
                        <p className="text-[13px] font-medium text-[#2D1F23] leading-snug group-hover:text-[#C15074] transition-colors line-clamp-2">
                          {product.name}
                        </p>
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-sm font-bold text-[#2D1F23]">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Decorative vertical text */}
      <div className="fixed bottom-8 left-6 hidden md:flex gap-10 pointer-events-none select-none">
        <p
          className="text-[10px] tracking-[0.3em] text-[#C0B0B4] uppercase"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          TE VES BELLA HOY
        </p>
        <p
          className="text-[10px] tracking-[0.3em] text-[#C0B0B4] uppercase"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          BEAUTY COSMETICS
        </p>
      </div>

      <style>{`
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

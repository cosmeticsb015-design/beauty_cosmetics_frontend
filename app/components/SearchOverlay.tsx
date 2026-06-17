"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, Filter, Sparkles } from "lucide-react";
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
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("all");
  const [selectedBrandNames, setSelectedBrandNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load categories and brands on mount
  useEffect(() => {
    Promise.all([getCategories(), getBrands()])
      .then(([catsRes, brandsRes]) => {
        setCategories((catsRes.data || []).filter((c) => c.active !== false));
        setBrands((brandsRes.data || []).filter((b) => b.active !== false));
      })
      .catch(() => {
        setCategories([]);
        setBrands([]);
      });
  }, []);

  // Fetch search products with debouncing
  useEffect(() => {
    setLoading(true);
    const delayDebounce = setTimeout(() => {
      getProducts({
        search: query || undefined,
        categorySlug: selectedCategorySlug !== "all" ? selectedCategorySlug : undefined,
        brandNames: selectedBrandNames.length > 0 ? selectedBrandNames : undefined,
        pageSize: 12,
      })
        .then((res) => {
          setProducts((res.data || []).filter((product) => product.active === true));
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, selectedCategorySlug, selectedBrandNames]);

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
    setSelectedCategorySlug(slug);
    if (filterOpen) setFilterOpen(false);
  };

  const handleBrandToggle = (brandName: string) => {
    setSelectedBrandNames((prev) =>
      prev.includes(brandName) ? prev.filter((name) => name !== brandName) : [...prev, brandName]
    );
  };

  const handleProductClick = (documentId: string) => {
    router.push(`/catalog/${documentId}`);
    onClose();
  };

  const getProductImage = (product: StrapiProduct) => {
    const url = product.images?.[0]?.image?.url;
    return url ? `${API_BASE}${url}` : null;
  };

  const rootCategories = categories.filter((cat) => !cat.parent);

  const getChildren = (cat: StrapiCategory): StrapiCategory[] => {
    if (!cat.children || cat.children.length === 0) return [];
    return cat.children
      .map((child) => categories.find((c) => c.documentId === child.documentId))
      .filter(Boolean) as StrapiCategory[];
  };

  const visibleBrands = selectedCategorySlug === "all"
    ? brands
    : brands.filter((brand) =>
        products.some((product) => product.brand?.documentId === brand.documentId)
      );

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

      <div className="max-w-2xl mx-auto px-4 mt-4 text-center">
        <p className="text-lg font-bold text-[#2D1F23]">¡Qué bonita te ves hoy!</p>
        <p className="text-sm text-[#AC9CA0] mt-2">
          Descubre productos activos y seleccionados especialmente para que te sientas aún más hermosa.
        </p>
      </div>

      {/* Search input */}
      <div className="max-w-2xl mx-auto px-4 mt-8">
        <div className="flex flex-col gap-3 bg-white border border-[#E8E0E4] rounded-[8px] px-5 py-3.5 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
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
          </div>
          <div className="flex items-center gap-2">
            {query && (
              <button
                onClick={() => setQuery("")}
                className="rounded-[6px] px-3 py-2 text-xs font-semibold text-[#554246] hover:text-[#C15074] transition-colors"
              >
                Limpiar
              </button>
            )}
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex items-center gap-2 rounded-[6px] border border-[#F0E4E8] bg-white px-3 py-2 text-xs font-semibold text-[#2D1F23] hover:border-[#C15074] hover:text-[#C15074] transition md:hidden"
            >
              <Filter size={16} />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {filterOpen && (
        <div className="fixed inset-0 z-[300] flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="relative ml-auto h-full w-full max-w-[23rem] overflow-hidden bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F0E4E8] px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-[#2D1F23]">Filtros</p>
                <p className="text-[11px] text-[#AC9CA0]">Selecciona categorías y marcas</p>
              </div>
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#F0E4E8] text-[#554246] hover:border-[#C15074] hover:text-[#C15074] transition"
                aria-label="Cerrar filtros"
              >
                <X size={16} />
              </button>
            </div>
            <div className="h-full overflow-y-auto px-4 py-5 space-y-6">
              <section>
                <p className="text-[10px] font-bold tracking-[0.15em] text-[#AC9CA0] uppercase mb-3">
                  CATEGORÍAS
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSelectedCategorySlug("all");
                      setFilterOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[12px] font-semibold tracking-wide uppercase text-left ${selectedCategorySlug === "all"
                      ? "bg-[#FCEDF0] text-[#C15074]"
                      : "text-[#554246] hover:text-[#C15074] hover:bg-[#FCEDF0]/50"
                      }`}
                  >
                    <span className={selectedCategorySlug === "all" ? "text-[#C15074]" : "text-[#AC9CA0]"}>
                      <Sparkles size={14} strokeWidth={1.8} />
                    </span>
                    Todas
                  </button>
                  {categories
                    .filter((cat) => !cat.parent)
                    .map((cat) => (
                      <button
                        key={cat.documentId}
                        onClick={() => {
                          setSelectedCategorySlug(cat.slug);
                          setFilterOpen(false);
                        }}
                        className={`w-full text-left rounded-[8px] px-3 py-2 text-[12px] font-semibold transition-all ${selectedCategorySlug === cat.slug
                          ? "bg-[#FCEDF0] text-[#C15074]"
                          : "text-[#554246] hover:text-[#C15074] hover:bg-[#FCEDF0]/50"
                          }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                </div>
              </section>

              <section>
                <p className="text-[10px] font-bold tracking-[0.15em] text-[#AC9CA0] uppercase mb-3">
                  MARCAS
                </p>
                <div className="max-h-[16rem] overflow-y-auto pr-2 space-y-2">
                  {visibleBrands.length === 0 ? (
                    <p className="text-sm text-[#AC9CA0]">No hay marcas disponibles para esta categoría.</p>
                  ) : (
                    visibleBrands.map((brand) => (
                      <label
                        key={brand.documentId}
                        className="flex items-center gap-3 rounded-[8px] border border-[#F0E4E8] px-3 py-2 text-sm text-[#554246] cursor-pointer transition-colors hover:border-[#C15074]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrandNames.includes(brand.name)}
                          onChange={() => handleBrandToggle(brand.name)}
                          className="h-4 w-4 accent-[#C15074]"
                        />
                        <span>{brand.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </section>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategorySlug("all");
                    setSelectedBrandNames([]);
                  }}
                  className="flex-1 rounded-[8px] border border-[#F0E4E8] bg-white px-4 py-3 text-sm font-semibold text-[#554246] hover:border-[#C15074] hover:text-[#C15074] transition"
                >
                  Limpiar filtros
                </button>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="flex-1 rounded-[8px] bg-[#C15074] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a03f66]"
                >
                  Listo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content grid: Categories/Brands + Products */}
      <div className="max-w-4xl mx-auto px-4 mt-10 pb-24 flex flex-col md:grid md:grid-cols-[220px_1fr] gap-8 md:gap-10">
        
        {/* Left: Categories & Brands */}
        <aside className="hidden md:sticky md:top-[120px] md:flex flex-col gap-8">
          {rootCategories.length > 0 && (
            <section className="bg-white border border-[#E8E0E8] rounded-[18px] p-4 shadow-sm">
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#C15074] uppercase mb-4">
                CATEGORÍAS
              </p>
              <div className="max-h-[calc(100vh-28rem)] overflow-y-auto pr-2 space-y-2">
                {rootCategories.map((cat) => (
                  <div key={cat.documentId} className="space-y-2">
                    <button
                      onClick={() => handleCategoryClick(cat.slug)}
                      className={`w-full text-left rounded-[12px] border px-3 py-2 text-[12px] font-semibold transition-colors ${selectedCategorySlug === cat.slug
                        ? "border-[#C15074] bg-[#FCEDF0] text-[#C15074]"
                        : "border-transparent text-[#554246] hover:border-[#F0E4E8] hover:text-[#C15074]"
                        }`}
                    >
                      {cat.name}
                    </button>
                    {getChildren(cat).length > 0 && (
                      <div className="ml-4 border-l border-[#F0E4E8] pl-3 space-y-2">
                        {getChildren(cat).map((child) => (
                          <button
                            key={child.documentId}
                            onClick={() => handleCategoryClick(child.slug)}
                            className={`w-full text-left rounded-[12px] border px-3 py-2 text-[12px] font-semibold transition-colors ${selectedCategorySlug === child.slug
                              ? "border-[#C15074] bg-[#FCEDF0] text-[#C15074]"
                              : "border-transparent text-[#554246] hover:border-[#F0E4E8] hover:text-[#C15074]"
                              }`}
                          >
                            {child.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {visibleBrands.length > 0 && (
            <section className="bg-white border border-[#E8E0E8] rounded-[18px] p-4 shadow-sm">
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#C15074] uppercase mb-4">
                MARCAS
              </p>
              <div className="max-h-[20rem] overflow-y-auto pr-2">
                <ul className="flex flex-col gap-2">
                  {visibleBrands.map((brand) => (
                    <li key={brand.documentId}>
                      <label className="flex items-center gap-3 rounded-[12px] border border-[#F0E4E8] px-3 py-2 text-sm text-[#554246] cursor-pointer transition-colors hover:border-[#C15074] hover:text-[#C15074]">
                        <input
                          type="checkbox"
                          checked={selectedBrandNames.includes(brand.name)}
                          onChange={() => handleBrandToggle(brand.name)}
                          className="h-4 w-4 accent-[#C15074]"
                        />
                        <span>{brand.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </aside>

        {/* Right: Products */}
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#C15074] uppercase mb-4">
            {loading ? "BUSCANDO..." : "PRODUCTOS"}
          </p>

          {products.length === 0 ? (
            <p className="text-sm text-[#AC9CA0] py-10 text-center">
              No se encontraron productos coincidentes. Pero hoy te ves increíble, sigue navegando.
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

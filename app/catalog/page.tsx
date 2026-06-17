"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Flower2,
  Paintbrush,
  Wind,
  Sparkles,
  Droplets,
  ChevronDown,
  X,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { getBrands, getCategories, getProducts, StrapiBrand, StrapiCategory, StrapiProduct } from "../services/producst";


// ── Icons Mapper ─────────────────────────────────────────
const getCategoryIcon = (slug: string) => {
  const norm = slug.toLowerCase();
  if (norm.includes("skincare") || norm.includes("piel") || norm.includes("rostro")) {
    return <Flower2 size={14} strokeWidth={1.8} />;
  }
  if (norm.includes("makeup") || norm.includes("maquillaje") || norm.includes("color")) {
    return <Paintbrush size={14} strokeWidth={1.8} />;
  }
  if (norm.includes("fragrance") || norm.includes("fragancia") || norm.includes("perfume")) {
    return <Wind size={14} strokeWidth={1.8} />;
  }
  if (norm.includes("wellness") || norm.includes("bienestar") || norm.includes("salud")) {
    return <Sparkles size={14} strokeWidth={1.8} />;
  }
  if (norm.includes("bath") || norm.includes("body") || norm.includes("cuerpo") || norm.includes("bano")) {
    return <Droplets size={14} strokeWidth={1.8} />;
  }
  return <Sparkles size={14} strokeWidth={1.8} />;
};

const sortOptions = [
  { label: "Relevancia", value: "Relevance" },
  { label: "Precio: Menor a Mayor", value: "Price: Low to High" },
  { label: "Precio: Mayor a Menor", value: "Price: High to Low" },
  { label: "Más Recientes", value: "Newest" },
];

// ── Component ────────────────────────────────────────────
function CatalogContent() {
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Relevance");

  const [dbCategories, setDbCategories] = useState<StrapiCategory[]>([]);
  const [dbBrands, setDbBrands] = useState<StrapiBrand[]>([]);
  const [dbProducts, setDbProducts] = useState<StrapiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 12, pageCount: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);
  const PAGE_SIZE = 12;

  // Categorías y marcas: carga única
  useEffect(() => {
    Promise.all([getCategories(), getBrands()])
      .then(([catsRes, brandsRes]) => {
        setDbCategories(catsRes.data || []);
        setDbBrands(brandsRes.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar los datos del catálogo.");
      });
  }, []);

  // Determinar categoría inicial a partir de la URL, una vez que dbCategories cargó
  useEffect(() => {
    if (dbCategories.length === 0) return;

    const categoryFromUrl = searchParams?.get("category");
    if (categoryFromUrl) {
      const matched = dbCategories.find(
        (c) =>
          c.slug.toLowerCase() === categoryFromUrl.toLowerCase() ||
          (categoryFromUrl.toLowerCase() === "makeup" && c.slug.toLowerCase() === "maquillaje") ||
          (categoryFromUrl.toLowerCase() === "skincare" && c.slug.toLowerCase() === "cuidado_de_piel")
      );
      if (matched) {
        setActiveCategory(matched.slug);
        return;
      }
      if (categoryFromUrl.toLowerCase() === "all" || categoryFromUrl.toLowerCase() === "todos") {
        setActiveCategory("all");
        return;
      }
    }
    setActiveCategory("all");
  }, [dbCategories, searchParams]);

  // Fetch productos cuando cambian filtros o página
  useEffect(() => {
    if (!activeCategory) return;

    setLoading(true);
    getProducts({
      page: currentPage,
      pageSize: PAGE_SIZE,
      categorySlug: activeCategory,
      brandNames: selectedBrands.length > 0 ? selectedBrands : undefined,
      sort:
        sortBy === "Price: Low to High" ? "price:asc" :
          sortBy === "Price: High to Low" ? "price:desc" :
            sortBy === "Newest" ? "createdAt:desc" : undefined,
    })
      .then((res) => {
        setDbProducts(res.data || []);
        if (res.meta?.pagination) setPagination(res.meta.pagination);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar los productos.");
        setLoading(false);
      });
  }, [activeCategory, selectedBrands, sortBy, currentPage]);

  // Reset página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, selectedBrands, sortBy]);

  const toggleBrand = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-[#C15074] border-t-transparent animate-spin" />
        <p className="text-xs text-[#AC9CA0] font-medium tracking-widest uppercase">Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-[#AC9CA0]">
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-[#C15074] font-semibold tracking-wider hover:underline uppercase"
        >
          Reintentar
        </button>
      </div>
    );
  }


  const rootCategories = dbCategories.filter((c) => !c.parent);
  const selectedCategory = dbCategories.find((c) => c.slug === activeCategory);
  const selectedCategoryName = activeCategory === "all" ? "Todas" : selectedCategory?.name || activeCategory;

  const availableBrands = Array.from(
    new Map(
      dbProducts
        .map((product) => product.brand)
        .filter((brand): brand is StrapiBrand => !!brand)
        .map((brand) => [brand.documentId, brand])
    ).values()
  );
  const visibleBrands = activeCategory === "all" ? dbBrands : availableBrands;

  const getChildren = (cat: StrapiCategory): StrapiCategory[] => {
    if (!cat.children || cat.children.length === 0) return [];
    return cat.children
      .map((child) => dbCategories.find((c) => c.documentId === child.documentId))
      .filter(Boolean) as StrapiCategory[];
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-6 md:gap-10 items-start">

          {/* ── Sidebar ── */}
          <aside className="hidden md:block w-full md:sticky md:top-[120px]">
            <div className="mb-6">
              <h2 className="text-base font-bold text-[#2D1F23]">Catálogo</h2>
              {/* <p className="text-xs italic text-[#C15074] mt-0.5">Exquisite Selections</p> */}
            </div>

            {/* Categories */}
            <div className="mb-6">
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#AC9CA0] uppercase mb-3">
                CATEGORÍAS
              </p>
              <div className="max-h-[26rem] overflow-y-auto pr-2 space-y-2">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[12px] font-semibold tracking-wide transition-all uppercase text-left ${activeCategory === "all"
                    ? "bg-[#FCEDF0] text-[#C15074]"
                    : "text-[#554246] hover:text-[#C15074] hover:bg-[#FCEDF0]/50"
                    }`}
                >
                  <span className={activeCategory === "all" ? "text-[#C15074]" : "text-[#AC9CA0]"}>
                    <Sparkles size={14} strokeWidth={1.8} />
                  </span>
                  Todos
                </button>

                {rootCategories.map((cat) => {
                  const isActive = activeCategory === cat.slug;
                  const children = getChildren(cat);

                  return (
                    <div key={cat.documentId} className="space-y-2">
                      <button
                        onClick={() => setActiveCategory(cat.slug)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[12px] font-semibold tracking-wide transition-all uppercase text-left ${isActive
                          ? "bg-[#FCEDF0] text-[#C15074]"
                          : "text-[#554246] hover:text-[#C15074] hover:bg-[#FCEDF0]/50"
                          }`}
                      >
                        <span className={isActive ? "text-[#C15074]" : "text-[#AC9CA0]"}>
                          {getCategoryIcon(cat.slug)}
                        </span>
                        {cat.name}
                      </button>

                      {children.length > 0 && (
                        <div className="ml-4 border-l border-[#F0E4E8] pl-2 space-y-1">
                          {children.map((child) => {
                            const isChildActive = activeCategory === child.slug;
                            return (
                              <button
                                key={child.documentId}
                                onClick={() => setActiveCategory(child.slug)}
                                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] text-[11px] font-medium tracking-wide transition-all text-left capitalize ${isChildActive
                                  ? "bg-[#FCEDF0] text-[#C15074]"
                                  : "text-[#AC9CA0] hover:text-[#C15074] hover:bg-[#FCEDF0]/50"
                                  }`}
                              >
                                {child.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Brands */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#AC9CA0] uppercase mb-1">
                MARCAS
              </p>
              <p className="text-[11px] text-[#AC9CA0] uppercase mb-3">
                {activeCategory === "all"
                  ? "Todas las marcas"
                  : `Marcas de ${selectedCategoryName}`}
              </p>
              <div className="max-h-[24rem] overflow-y-auto pr-2">
                <ul className="flex flex-col gap-2">
                  {visibleBrands.length === 0 ? (
                    <li className="text-[12px] text-[#AC9CA0]">No hay marcas asociadas a esta categoría.</li>
                  ) : (
                    visibleBrands.map((brand) => (
                      <li key={brand.documentId} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`brand-${brand.documentId}`}
                          checked={selectedBrands.includes(brand.name)}
                          onChange={() => toggleBrand(brand.name)}
                          className="w-3.5 h-3.5 accent-[#C15074] rounded cursor-pointer"
                        />
                        <label
                          htmlFor={`brand-${brand.documentId}`}
                          className="text-[12px] text-[#554246] cursor-pointer hover:text-[#C15074] transition-colors"
                        >
                          {brand.name}
                        </label>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </aside>

          {showFilters && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowFilters(false)}
              />
              <div className="relative ml-auto h-full w-full max-w-[22rem] overflow-y-auto bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#F0E4E8] px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-[#2D1F23]">Filtros</p>
                    <p className="text-[11px] text-[#AC9CA0]">Categorías y marcas</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#F0E4E8] text-[#554246] hover:border-[#C15074] hover:text-[#C15074] transition"
                    aria-label="Cerrar filtros"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="px-4 py-5 space-y-6">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#AC9CA0] uppercase mb-3">
                      CATEGORÍAS
                    </p>
                    <div className="max-h-[calc(100vh-24rem)] overflow-y-auto pr-2 space-y-2">
                      <button
                        onClick={() => {
                          setActiveCategory("all");
                          setShowFilters(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[12px] font-semibold tracking-wide transition-all uppercase text-left ${activeCategory === "all"
                          ? "bg-[#FCEDF0] text-[#C15074]"
                          : "text-[#554246] hover:text-[#C15074] hover:bg-[#FCEDF0]/50"
                          }`}
                      >
                        <span className={activeCategory === "all" ? "text-[#C15074]" : "text-[#AC9CA0]"}>
                          <Sparkles size={14} strokeWidth={1.8} />
                        </span>
                        Todos
                      </button>

                      {rootCategories.map((cat) => {
                        const isActive = activeCategory === cat.slug;
                        const children = getChildren(cat);

                        return (
                          <div key={cat.documentId} className="space-y-2">
                            <button
                              onClick={() => {
                                setActiveCategory(cat.slug);
                                setShowFilters(false);
                              }}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-[12px] font-semibold tracking-wide transition-all uppercase text-left ${isActive
                                ? "bg-[#FCEDF0] text-[#C15074]"
                                : "text-[#554246] hover:text-[#C15074] hover:bg-[#FCEDF0]/50"
                                }`}
                            >
                              <span className={isActive ? "text-[#C15074]" : "text-[#AC9CA0]"}>
                                {getCategoryIcon(cat.slug)}
                              </span>
                              {cat.name}
                            </button>

                            {children.length > 0 && (
                              <div className="ml-4 border-l border-[#F0E4E8] pl-2 space-y-1">
                                {children.map((child) => {
                                  const isChildActive = activeCategory === child.slug;
                                  return (
                                    <button
                                      key={child.documentId}
                                      onClick={() => {
                                        setActiveCategory(child.slug);
                                        setShowFilters(false);
                                      }}
                                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] text-[11px] font-medium tracking-wide transition-all text-left capitalize ${isChildActive
                                        ? "bg-[#FCEDF0] text-[#C15074]"
                                        : "text-[#AC9CA0] hover:text-[#C15074] hover:bg-[#FCEDF0]/50"
                                        }`}
                                    >
                                      {child.name}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#AC9CA0] uppercase mb-1">
                      MARCAS
                    </p>
                    <p className="text-[11px] text-[#AC9CA0] uppercase mb-3">
                      {activeCategory === "all"
                        ? "Todas las marcas"
                        : `Marcas de ${selectedCategoryName}`}
                    </p>
                    <div className="max-h-[16rem] overflow-y-auto pr-2">
                      <ul className="flex flex-col gap-2">
                        {visibleBrands.length === 0 ? (
                          <li className="text-[12px] text-[#AC9CA0]">No hay marcas asociadas a esta categoría.</li>
                        ) : (
                          visibleBrands.map((brand) => (
                            <li key={brand.documentId} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`mobile-brand-${brand.documentId}`}
                                checked={selectedBrands.includes(brand.name)}
                                onChange={() => toggleBrand(brand.name)}
                                className="w-3.5 h-3.5 accent-[#C15074] rounded cursor-pointer"
                              />
                              <label
                                htmlFor={`mobile-brand-${brand.documentId}`}
                                className="text-[12px] text-[#554246] cursor-pointer hover:text-[#C15074] transition-colors"
                              >
                                {brand.name}
                              </label>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Product Grid ── */}
          <div className="w-full">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs text-[#AC9CA0]">
                  Mostrando <span className="font-semibold text-[#2D1F23]">{dbProducts.length}</span> de{" "}
                  <span className="font-semibold text-[#2D1F23]">{pagination.total}</span> productos
                </p>
                <button
                  type="button"
                  onClick={() => setShowFilters(true)}
                  className="md:hidden inline-flex items-center justify-center rounded-[6px] border border-[#F0E4E8] bg-white px-3 py-2 text-xs font-semibold text-[#2D1F23] hover:border-[#C15074] hover:text-[#C15074] transition"
                >
                  Filtrar
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#554246]">
                <span>Ordenar por:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-[#F0E4E8] rounded-[4px] pl-3 pr-7 py-1.5 text-xs font-medium text-[#2D1F23] outline-none cursor-pointer focus:border-[#C15074] transition-colors"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#AC9CA0] pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Grid */}
            {dbProducts.length === 0 ? (
              <div className="py-20 text-center text-[#AC9CA0] text-sm">
                No hay productos en esta categoría.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {dbProducts.map((product) => (
                  <ProductCard
                    key={product.documentId}
                    product={product}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pageCount > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-medium rounded-[4px] border border-[#F0E4E8] text-[#554246] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#C15074] transition-colors"
                >
                  Anterior
                </button>

                {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 text-xs font-semibold rounded-[4px] transition-colors ${p === currentPage
                      ? "bg-[#C15074] text-white"
                      : "border border-[#F0E4E8] text-[#554246] hover:border-[#C15074]"
                      }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(pagination.pageCount, p + 1))}
                  disabled={currentPage === pagination.pageCount}
                  className="px-3 py-1.5 text-xs font-medium rounded-[4px] border border-[#F0E4E8] text-[#554246] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#C15074] transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-[#C15074] border-t-transparent animate-spin" /></div>}>
      <CatalogContent />
    </Suspense>
  );
}
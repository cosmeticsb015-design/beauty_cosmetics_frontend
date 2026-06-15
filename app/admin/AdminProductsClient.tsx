"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Ban,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Plus,
} from "lucide-react";
import AdminShell from "./components/AdminShell";
import { deactivateProductForm } from "./actions";

export type ProductRow = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  active: boolean;
  image: string;
  imageUrl?: string | null;
  editHref: string;
  variantLabel: string;
  variantNames: string[];
};

export type ProductStat = { label: string; value: string; tone: string };
export type ProductFilterOption = { label: string; value: string };
export type ProductPagination = { page: number; pageCount: number; total: number; pageSize: number };

type AdminProductsClientProps = {
  stats: ProductStat[];
  products: ProductRow[];
  totalLabel: string;
  categories: ProductFilterOption[];
  currentFilters: { category: string; availability: string; status: string; search: string };
  pagination: ProductPagination;
  saved?: boolean;
};

function ProductThumb({ className, imageUrl, alt }: { className: string; imageUrl?: string | null; alt: string }) {
  return (
    <div className={`relative h-14 w-14 overflow-hidden rounded-[4px] border border-[#F0E4E8] ${imageUrl ? "bg-[#F8F8F9]" : className}`}>
      {imageUrl ? <Image src={imageUrl} alt={alt} fill sizes="56px" className="object-cover" /> : null}
      {!imageUrl ? <div className="absolute bottom-2 left-1/2 h-6 w-3 -translate-x-1/2 rounded-t-[3px] bg-white/85 shadow-sm" /> : null}
      {!imageUrl ? <div className="absolute bottom-8 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#C15074]/70" /> : null}
      {!imageUrl ? <div className="absolute bottom-1 left-3 right-3 h-1 rounded-full bg-black/10" /> : null}
    </div>
  );
}

export default function AdminProductsClient({ stats, products, totalLabel, categories, currentFilters, pagination, saved }: AdminProductsClientProps) {
  const [productToDisable, setProductToDisable] = useState<ProductRow | null>(null);
  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (currentFilters.category !== "all") params.set("category", currentFilters.category);
    if (currentFilters.availability !== "all") params.set("availability", currentFilters.availability);
    if (currentFilters.status !== "all") params.set("status", currentFilters.status);
    if (currentFilters.search) params.set("q", currentFilters.search);
    params.set("page", String(page));
    return `/admin?${params.toString()}`;
  };
  const pages = Array.from({ length: Math.min(pagination.pageCount, 5) }, (_, index) => index + 1);

  return (
    <AdminShell active="products" searchPlaceholder="Buscar productos...">
          <main className={`mx-auto w-full max-w-[1080px] px-4 py-10 md:px-8 md:py-20 ${productToDisable ? "blur-[2px]" : ""}`}>
            {saved ? <div className="mb-6 rounded-[8px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-[15px] font-bold text-emerald-700">Cambios guardados correctamente.</div> : null}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold text-[#9E3659] lg:hidden">Beauty Cosmetics Admin</p>
                <h2 className="text-[38px] font-bold leading-none text-[#1F1F22] md:text-[52px]">
                  Gestion de Productos
                </h2>
                <p className="mt-3 text-[17px] text-[#6B6063]">
                  Administra tu inventario de productos de lujo, stock y estados de publicacion.
                </p>
              </div>

              <Link
                href="/admin/productos/nuevo"
                className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] bg-[#9E3659] px-6 text-[15px] font-semibold tracking-wide text-white transition-colors hover:bg-[#84304C]"
              >
                <Plus size={20} strokeWidth={1.8} />
                Nuevo Producto
              </Link>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-[8px] border border-[#E7BFC9] bg-white px-7 py-7">
                  <p className="text-[17px] text-[#6B6063]">{stat.label}</p>
                  <p className={`mt-1 text-[28px] font-semibold leading-none ${stat.tone}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <section className="mt-12 overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white">
              <div className="flex flex-col gap-4 border-b border-[#E7BFC9] px-6 py-7 lg:flex-row lg:items-center lg:justify-between">
                <form className="flex flex-wrap gap-3" action="/admin">
                  <select name="category" defaultValue={currentFilters.category} className="h-10 rounded-[4px] bg-[#FCEDF0] px-5 text-[15px] font-semibold tracking-wide text-[#9E3659] outline-none">
                    {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                  </select>
                  <select name="availability" defaultValue={currentFilters.availability} className="h-10 rounded-[4px] bg-[#FCEDF0] px-5 text-[15px] font-semibold tracking-wide text-[#9E3659] outline-none">
                    <option value="all">Disponibilidad</option>
                    <option value="in_stock">En stock</option>
                    <option value="low_stock">Stock bajo</option>
                    <option value="out_of_stock">Sin stock</option>
                  </select>
                  <select name="status" defaultValue={currentFilters.status} className="h-10 rounded-[4px] bg-[#FCEDF0] px-5 text-[15px] font-semibold tracking-wide text-[#9E3659] outline-none">
                    <option value="all">Estado</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Desactivados</option>
                  </select>
                  {currentFilters.search ? <input type="hidden" name="q" value={currentFilters.search} /> : null}
                  <button className="inline-flex h-10 items-center gap-2 rounded-[4px] bg-[#9E3659] px-5 text-[15px] font-semibold tracking-wide text-white">
                    Filtrar
                    <ChevronDown size={16} strokeWidth={1.8} />
                  </button>
                </form>
                <p className="text-[15px] text-[#6B6063]">{totalLabel}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse">
                  <thead className="bg-[#F4F4F4] text-left text-[13px] font-bold uppercase tracking-wide text-[#8A7378]">
                    <tr>
                      <th className="px-12 py-5">Imagen</th>
                      <th className="px-4 py-5">Producto</th>
                      <th className="px-4 py-5">Categoria</th>
                      <th className="px-4 py-5">Precio</th>
                      <th className="px-4 py-5">Stock</th>
                      <th className="px-4 py-5">Estado</th>
                      <th className="px-4 py-5 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.sku} className="border-b border-[#E7BFC9] last:border-b-0">
                        <td className="px-12 py-5">
                          <ProductThumb className={product.image} imageUrl={product.imageUrl} alt={product.name} />
                        </td>
                        <td className="px-4 py-5">
                          <p className="max-w-[180px] text-[17px] font-semibold leading-tight text-[#1F1F22]">
                            {product.name}
                          </p>
                          <p className="mt-1 max-w-[150px] text-[16px] leading-tight text-[#8A7378]">SKU: {product.sku}</p>
                          <p className="mt-1 max-w-[160px] text-[13px] font-semibold leading-tight text-[#9E3659]">{product.variantLabel}</p>
                          {product.variantNames.length ? <p className="mt-1 max-w-[180px] text-[12px] leading-tight text-[#6B6063]">{product.variantNames.slice(0, 3).join(" • ")}</p> : null}
                        </td>
                        <td className="px-4 py-5">
                          <span
                            className={`rounded-full px-4 py-2 text-[15px] ${
                              product.active ? "bg-[#FCEDF0] text-[#C15074]" : "bg-[#EFEFEF] text-[#6B6063]"
                            }`}
                          >
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-[16px] text-[#1F1F22]">{product.price}</td>
                        <td className="px-4 py-5 text-[16px] text-[#1F1F22]">{product.stock}</td>
                        <td className="px-4 py-5">
                          <span
                            className={`inline-flex items-center gap-2 text-[15px] font-semibold ${
                              product.active ? "text-emerald-700" : "text-[#8A7378]"
                            }`}
                          >
                            <span className={`h-2 w-2 rounded-full ${product.active ? "bg-emerald-700" : "bg-[#8A7378]"}`} />
                            {product.status}
                          </span>
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex items-center justify-center gap-5 text-[#5F5F61]">
                            <Link
                              href={product.editHref}
                              aria-label={`Editar ${product.name}`}
                              className="transition-colors hover:text-[#9E3659]"
                            >
                              <Edit3 size={19} strokeWidth={1.9} />
                            </Link>
                            <button
                              aria-label={`Desactivar ${product.name}`}
                              onClick={() => setProductToDisable(product)}
                              className="transition-colors hover:text-[#9E3659]"
                            >
                              <Ban size={20} strokeWidth={1.9} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between bg-[#F4F4F4] px-7 py-7 text-[15px] font-semibold text-[#554246]">
                <Link href={pageHref(Math.max(1, pagination.page - 1))} className={`inline-flex items-center gap-1 transition-colors hover:text-[#9E3659] ${pagination.page <= 1 ? "pointer-events-none opacity-40" : ""}`}>
                  <ChevronLeft size={18} strokeWidth={1.8} />
                  Anterior
                </Link>
                <div className="flex items-center gap-4">
                  {pages.map((page) => (
                    <Link key={page} href={pageHref(page)} className={`flex h-9 w-9 items-center justify-center rounded-[4px] ${page === pagination.page ? "bg-[#9E3659] text-white" : ""}`}>{page}</Link>
                  ))}
                  {pagination.pageCount > 5 ? <span>...</span> : null}
                  {pagination.pageCount > 5 ? <Link href={pageHref(pagination.pageCount)}>{pagination.pageCount}</Link> : null}
                </div>
                <Link href={pageHref(Math.min(pagination.pageCount, pagination.page + 1))} className={`inline-flex items-center gap-1 transition-colors hover:text-[#9E3659] ${pagination.page >= pagination.pageCount ? "pointer-events-none opacity-40" : ""}`}>
                  Siguiente
                  <ChevronRight size={18} strokeWidth={1.8} />
                </Link>
              </div>
            </section>
          </main>

          {productToDisable && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
              <div className="w-full max-w-[430px] rounded-[8px] bg-white px-12 py-12 shadow-xl">
                <div className="flex items-center gap-3 text-red-700">
                  <Ban size={23} strokeWidth={2} />
                  <h3 className="text-[25px] font-bold">Desactivar Producto</h3>
                </div>

                <p className="mt-7 text-[16px] leading-relaxed text-[#6B6063]">
                  ¿Estás seguro de que deseas desactivar este producto? Se ocultará de la tienda pero no se eliminará.
                </p>

                <div className="mt-7 flex items-center gap-5 rounded-[4px] border border-[#E7BFC9] bg-[#F8F8F8] p-3">
                  <ProductThumb className={productToDisable.image} imageUrl={productToDisable.imageUrl} alt={productToDisable.name} />
                  <div>
                    <p className="text-[16px] font-bold text-[#1F1F22]">{productToDisable.name}</p>
                    <p className="mt-1 text-[15px] text-[#8A7378]">SKU: {productToDisable.sku}</p>
                  </div>
                </div>

                <div className="mt-9 flex items-center justify-end gap-8">
                  <button
                    onClick={() => setProductToDisable(null)}
                    className="text-[15px] font-semibold text-[#5F5F61] transition-colors hover:text-[#9E3659]"
                  >
                    Cancelar
                  </button>
                  <form action={deactivateProductForm}>
                    <input type="hidden" name="id" value={productToDisable.id} />
                    <button className="h-11 rounded-[4px] bg-red-700 px-7 text-[15px] font-bold text-white transition-colors hover:bg-red-800">
                      Desactivar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
    </AdminShell>
  );
}

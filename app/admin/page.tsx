"use client";

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

const stats = [
  { label: "Total Productos", value: "1,284", tone: "text-[#554246]" },
  { label: "En Stock", value: "1,156", tone: "text-emerald-700" },
  { label: "Stock Bajo", value: "28", tone: "text-[#9E3659]" },
  { label: "Desactivados", value: "102", tone: "text-[#554246]" },
];

const products = [
  {
    name: "Velvet Rose Elixir",
    sku: "LUX-SER-001",
    category: "Skincare",
    price: "$89.00",
    stock: 124,
    status: "Activo",
    active: true,
    image: "bg-[linear-gradient(135deg,#f8d7dc,#fff7f5_55%,#c68b8d)]",
  },
  {
    name: "Midnight Crimson Matte",
    sku: "LUX-LIP-042",
    category: "Makeup",
    price: "$45.00",
    stock: 12,
    status: "Activo",
    active: true,
    image: "bg-[linear-gradient(135deg,#f6eeee,#e9dfd9_55%,#b58b71)]",
  },
  {
    name: "Botanical Glow Oil",
    sku: "LUX-SER-089",
    category: "Skincare",
    price: "$112.00",
    stock: 0,
    status: "Desactivado",
    active: false,
    image: "bg-[linear-gradient(135deg,#0f2f2d,#e4efe8_52%,#547a73)]",
  },
  {
    name: "Pearl Bright Cream",
    sku: "LUX-CRM-015",
    category: "Skincare",
    price: "$72.00",
    stock: 56,
    status: "Activo",
    active: true,
    image: "bg-[linear-gradient(135deg,#dccbb0,#fffaf0_55%,#a89068)]",
  },
  {
    name: "Essence de Mar",
    sku: "LUX-FRG-009",
    category: "Fragrance",
    price: "$145.00",
    stock: 82,
    status: "Activo",
    active: true,
    image: "bg-[linear-gradient(135deg,#231d1a,#f1cda9_55%,#c8834f)]",
  },
];

function ProductThumb({ className }: { className: string }) {
  return (
    <div className={`relative h-14 w-14 overflow-hidden rounded-[4px] border border-[#F0E4E8] ${className}`}>
      <div className="absolute bottom-2 left-1/2 h-6 w-3 -translate-x-1/2 rounded-t-[3px] bg-white/85 shadow-sm" />
      <div className="absolute bottom-8 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#C15074]/70" />
      <div className="absolute bottom-1 left-3 right-3 h-1 rounded-full bg-black/10" />
    </div>
  );
}

export default function AdminProductsPage() {
  const [productToDisable, setProductToDisable] = useState<(typeof products)[number] | null>(null);

  return (
    <AdminShell active="products" searchPlaceholder="Buscar productos...">
          <main className={`mx-auto w-full max-w-[1080px] px-4 py-10 md:px-8 md:py-20 ${productToDisable ? "blur-[2px]" : ""}`}>
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
                <div className="flex flex-wrap gap-3">
                  {["Todas las Categorias", "Disponibilidad", "Estado"].map((label) => (
                    <button
                      key={label}
                      className="inline-flex h-10 items-center gap-2 rounded-[4px] bg-[#FCEDF0] px-5 text-[15px] font-semibold tracking-wide text-[#9E3659]"
                    >
                      {label}
                      <ChevronDown size={16} strokeWidth={1.8} />
                    </button>
                  ))}
                </div>
                <p className="text-[15px] text-[#6B6063]">Mostrando 1-10 de 1,284 productos</p>
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
                          <ProductThumb className={product.image} />
                        </td>
                        <td className="px-4 py-5">
                          <p className="max-w-[180px] text-[17px] font-semibold leading-tight text-[#1F1F22]">
                            {product.name}
                          </p>
                          <p className="mt-1 max-w-[150px] text-[16px] leading-tight text-[#8A7378]">SKU: {product.sku}</p>
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
                              href="/admin/productos/velvet-rose-elixir/editar"
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
                <button className="inline-flex items-center gap-1 transition-colors hover:text-[#9E3659]">
                  <ChevronLeft size={18} strokeWidth={1.8} />
                  Anterior
                </button>
                <div className="flex items-center gap-4">
                  <button className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#9E3659] text-white">1</button>
                  <button>2</button>
                  <button>3</button>
                  <span>...</span>
                  <button>128</button>
                </div>
                <button className="inline-flex items-center gap-1 transition-colors hover:text-[#9E3659]">
                  Siguiente
                  <ChevronRight size={18} strokeWidth={1.8} />
                </button>
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
                  <ProductThumb className={productToDisable.image} />
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
                  <button
                    onClick={() => setProductToDisable(null)}
                    className="h-11 rounded-[4px] bg-red-700 px-7 text-[15px] font-bold text-white transition-colors hover:bg-red-800"
                  >
                    Desactivar
                  </button>
                </div>
              </div>
            </div>
          )}
    </AdminShell>
  );
}

"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CirclePlus,
  Edit3,
  Eye,
  EyeOff,
  Grid2X2Plus,
  Package,
  Save,
  Search,
  Shapes,
  Star,
  X,
} from "lucide-react";
import AdminShell from "../components/AdminShell";

const brands = [
  { name: "L'Eclat Paris", active: true },
  { name: "Velvet Skin", active: true },
  { name: "Pure Essence", active: false },
];

const categories = [
  {
    name: "Cuidado Facial",
    products: 124,
    visible: true,
    open: true,
    children: [
      { name: "Serums", items: 48 },
      { name: "Limpieza Facial", items: 76 },
    ],
  },
  {
    name: "Fragancias",
    products: 86,
    visible: false,
    open: false,
    children: [],
  },
  {
    name: "Maquillaje",
    products: 312,
    visible: true,
    open: false,
    children: [],
  },
];

export default function AdminBrandsCategoriesPage() {
  const [activeModal, setActiveModal] = useState<"brand" | "category" | null>(null);

  return (
    <AdminShell active="catalog">
      <main className={`mx-auto w-full max-w-[1180px] px-4 py-10 md:px-8 ${activeModal ? "blur-[2px]" : ""}`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#9E3659] lg:hidden">Beauty Cosmetics Admin</p>
            <h2 className="text-[40px] font-bold leading-none text-[#1F1F22] md:text-[46px]">
              Organización del Catálogo
            </h2>
            <p className="mt-3 text-[17px] text-[#4B5563]">
              Gestiona la estructura jerárquica de tu inventario y marcas asociadas.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveModal("brand")}
              className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] bg-[#9E3659] px-6 text-[15px] font-semibold tracking-wide text-white transition-colors hover:bg-[#84304C]"
            >
              <CirclePlus size={20} strokeWidth={2} />
              Nueva Marca
            </button>
            <button
              onClick={() => setActiveModal("category")}
              className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] bg-[#9E3659] px-6 text-[15px] font-semibold tracking-wide text-white transition-colors hover:bg-[#84304C]"
            >
              <Shapes size={20} strokeWidth={2} />
              Nueva Categoría
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
          <section className="overflow-hidden rounded-[8px] border border-[#C8CEDB] bg-white">
            <div className="flex flex-col gap-5 border-b border-[#C8CEDB] px-6 py-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#DDEAFF] text-[#9E3659]">
                  <Star size={25} strokeWidth={1.9} />
                </span>
                <h3 className="text-[27px] font-bold text-[#1F1F22]">Marcas</h3>
              </div>

              <div className="flex h-10 w-full items-center gap-2 rounded-full border border-[#C8CEDB] bg-[#F8FAFC] px-4 text-[#4B5563] md:w-[230px]">
                <input
                  aria-label="Buscar marcas"
                  placeholder="Buscar marcas..."
                  className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-semibold outline-none placeholder:text-[#6B7280]"
                />
                <Search size={18} strokeWidth={2} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead className="bg-[#F3F4F6] text-left text-[14px] font-bold uppercase tracking-[0.12em] text-[#4B5563]">
                  <tr>
                    <th className="px-28 py-5">Nombre</th>
                    <th className="px-6 py-5">Estado</th>
                    <th className="px-6 py-5">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.name} className="border-b border-[#C8CEDB] last:border-b-0">
                      <td className="px-28 py-8 text-[19px] font-bold text-[#1F1F22]">{brand.name}</td>
                      <td className="px-6 py-8">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[14px] font-semibold ${
                            brand.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${brand.active ? "bg-emerald-500" : "bg-red-500"}`} />
                          {brand.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-8">
                        <button aria-label={`Editar ${brand.name}`} className="text-[#9E3659] transition-colors hover:text-[#84304C]">
                          <Edit3 size={23} strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="flex h-16 w-full items-center justify-center border-t border-[#C8CEDB] bg-[#F3F4F6] text-[15px] font-bold tracking-wide text-[#9E3659] transition-colors hover:bg-[#FCEDF0]">
              Ver todas las marcas
            </button>
          </section>

          <section className="overflow-hidden rounded-[8px] border border-[#C8CEDB] bg-white">
            <div className="flex items-center gap-4 border-b border-[#C8CEDB] px-6 py-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#FFE0D1] text-[#B4532B]">
                <Grid2X2Plus size={25} strokeWidth={1.9} />
              </span>
              <h3 className="text-[27px] font-bold text-[#1F1F22]">Categorías</h3>
            </div>

            <div className="space-y-5 px-5 py-5">
              {categories.map((category) => (
                <article key={category.name} className="overflow-hidden rounded-[4px] border border-[#C8CEDB] bg-white">
                  <div className="px-5 py-5">
                    <div className="flex items-center gap-2">
                      {category.open ? (
                        <ChevronDown size={20} strokeWidth={2} className="text-[#374151]" />
                      ) : category.name === "Fragancias" ? (
                        <span className="h-px w-4 bg-[#C8CEDB]" />
                      ) : (
                        <ChevronRight size={20} strokeWidth={2} className="text-[#374151]" />
                      )}
                      <h4 className="text-[20px] font-bold text-[#1F1F22]">{category.name}</h4>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-5 text-[14px] font-semibold text-[#4B5563]">
                      <span className="inline-flex items-center gap-1">
                        <Package size={17} strokeWidth={1.8} />
                        {category.products} Productos
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {category.visible ? <Eye size={17} strokeWidth={1.8} /> : <EyeOff size={17} strokeWidth={1.8} />}
                        {category.visible ? "Visible" : "Oculto"}
                      </span>
                    </div>
                  </div>

                  {category.open && (
                    <div className="border-t border-[#E5E7EB] bg-[#F9FAFB]">
                      {category.children.map((child) => (
                        <div
                          key={child.name}
                          className="flex items-center justify-between border-b border-[#E5E7EB] px-10 py-4 last:border-b-0"
                        >
                          <span className="flex items-center gap-2 text-[19px] text-[#1F1F22]">
                            <ChevronUp size={17} strokeWidth={1.8} className="rotate-90 text-[#6B7280]" />
                            {child.name}
                          </span>
                          <span className="text-[15px] font-semibold text-[#4B5563]">{child.items} ítems</span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-[#C8CEDB] bg-[#EEF0F3] px-6 py-6 text-[15px] font-semibold text-[#374151]">
              <p>Total de categorías: 14</p>
              <div className="flex items-center gap-6">
                <button aria-label="Página anterior" className="transition-colors hover:text-[#9E3659]">
                  <ChevronLeft size={19} strokeWidth={2} />
                </button>
                <span>1 / 3</span>
                <button aria-label="Página siguiente" className="transition-colors hover:text-[#9E3659]">
                  <ChevronRight size={19} strokeWidth={2} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-[620px] overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-[#E7BFC9] px-8 py-7">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#9E3659]">
                  Organización del catálogo
                </p>
                <h3 className="mt-2 text-[28px] font-bold text-[#1F1F22]">
                  {activeModal === "brand" ? "Nueva Marca" : "Nueva Categoría"}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                aria-label="Cerrar formulario"
                className="text-[#5F5F61] transition-colors hover:text-[#9E3659]"
              >
                <X size={27} strokeWidth={1.8} />
              </button>
            </div>

            <div className="space-y-6 px-8 py-8">
              <label className="block">
                <span className="text-[15px] font-bold text-[#4B4E5A]">
                  {activeModal === "brand" ? "Nombre de la marca" : "Nombre de la categoría"}
                </span>
                <input
                  placeholder={activeModal === "brand" ? "Ej. LuxeEssence" : "Ej. Cuidado Corporal"}
                  className="mt-3 h-13 w-full rounded-[6px] border border-[#E7BFC9] bg-[#FFFCFC] px-5 text-[16px] outline-none placeholder:text-[#C8AAB3] focus:border-[#9E3659]"
                />
              </label>

              <label className="block">
                <span className="text-[15px] font-bold text-[#4B4E5A]">Slug</span>
                <input
                  placeholder={activeModal === "brand" ? "luxe-essence" : "cuidado-corporal"}
                  className="mt-3 h-13 w-full rounded-[6px] border border-[#E7BFC9] bg-[#FFFCFC] px-5 text-[16px] outline-none placeholder:text-[#C8AAB3] focus:border-[#9E3659]"
                />
              </label>

              {activeModal === "category" && (
                <label className="block">
                  <span className="text-[15px] font-bold text-[#4B4E5A]">Categoría padre</span>
                  <div className="relative mt-3">
                    <select className="h-13 w-full appearance-none rounded-[6px] border border-[#E7BFC9] bg-[#FFFCFC] px-5 text-[16px] outline-none focus:border-[#9E3659]">
                      <option>Sin categoría padre</option>
                      <option>Cuidado Facial</option>
                      <option>Fragancias</option>
                      <option>Maquillaje</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6370]"
                    />
                  </div>
                </label>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[8px] bg-[#F1F2F4] px-5 py-4">
                  <p className="text-[15px] font-bold text-[#1F1F22]">Estado</p>
                  <div className="mt-3 flex items-center gap-3">
                    <button className="relative h-8 w-14 rounded-full bg-[#9E3659]" aria-label="Estado activo">
                      <span className="absolute right-1.5 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
                    </button>
                    <span className="text-[15px] font-semibold text-[#1F1F22]">Activo</span>
                  </div>
                </div>

                
              </div>

             
            </div>

            <div className="flex flex-col gap-4 border-t border-[#E7BFC9] bg-[#F8F8F9] px-8 py-6 sm:flex-row sm:justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="h-12 px-7 text-[15px] font-bold text-[#5C4B50] transition-colors hover:text-[#9E3659]"
              >
                Cancelar
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-[#7D123B] px-8 text-[15px] font-bold text-white transition-colors hover:bg-[#681032]"
              >
                <Save size={17} strokeWidth={2} />
                {activeModal === "brand" ? "Guardar Marca" : "Guardar Categoría"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

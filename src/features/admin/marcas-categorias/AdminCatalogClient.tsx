"use client";

import { useActionState, useEffect, useState } from "react";
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
  Trash2,
  X,
} from "lucide-react";
import AdminShell from "@/src/features/admin/components/AdminShell";
import { removeEntityForm, saveBrand, saveCategory } from "@/src/features/admin/actions";

export type BrandRow = { id: string; name: string; slug: string; active: boolean; products: number };
export type CategoryChildRow = { id: string; name: string; slug: string; items: number; active: boolean };
export type CategoryRow = { id: string; name: string; slug: string; products: number; visible: boolean; open: boolean; parentId?: string; children: CategoryChildRow[] };

type CatalogModal = { type: "brand"; item?: BrandRow } | { type: "category"; item?: CategoryRow } | null;
type AdminCatalogClientProps = { brands: BrandRow[]; categories: CategoryRow[]; allCategories: CategoryRow[] };

export default function AdminCatalogClient({ brands, categories, allCategories }: AdminCatalogClientProps) {
  const [activeModal, setActiveModal] = useState<CatalogModal>(null);
  const [savedMessage, setSavedMessage] = useState("");
  const [brandState, brandAction] = useActionState(saveBrand, { ok: false, message: "" });
  const [categoryState, categoryAction] = useActionState(saveCategory, { ok: false, message: "" });
  const isBrand = activeModal?.type === "brand";
  const isCategory = activeModal?.type === "category";
  const editingBrand = isBrand ? activeModal.item : undefined;
  const editingCategory = isCategory ? activeModal.item : undefined;

  useEffect(() => {
    const state = brandState.message ? brandState : categoryState.message ? categoryState : null;
    if (!state) return;
    setSavedMessage(state.message || (state.ok ? "Guardado correctamente." : "No se pudo guardar."));
    if (state.ok) setActiveModal(null);
    const timeout = window.setTimeout(() => setSavedMessage(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [brandState, categoryState]);

  return (
    <AdminShell active="catalog">
      {savedMessage && (
        <div className={`fixed right-6 top-6 z-[70] rounded-[8px] border px-5 py-4 text-[15px] font-bold shadow-lg ${brandState.ok || categoryState.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}> 
          {savedMessage}
        </div>
      )}
      <main className={`mx-auto w-full max-w-[1180px] px-4 py-10 md:px-8 ${activeModal ? "blur-[2px]" : ""}`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#9E3659] lg:hidden">Beauty Cosmetics Admin</p>
            <h2 className="text-[40px] font-bold leading-none text-[#1F1F22] md:text-[46px]">Organización del Catálogo</h2>
            <p className="mt-3 text-[17px] text-[#4B5563]">Gestiona la estructura jerárquica de tu inventario y marcas asociadas.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => setActiveModal({ type: "brand" })} className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] bg-[#9E3659] px-6 text-[15px] font-semibold tracking-wide text-white transition-colors hover:bg-[#84304C]"><CirclePlus size={20} strokeWidth={2} />Nueva Marca</button>
            <button onClick={() => setActiveModal({ type: "category" })} className="inline-flex h-12 items-center justify-center gap-3 rounded-[4px] bg-[#9E3659] px-6 text-[15px] font-semibold tracking-wide text-white transition-colors hover:bg-[#84304C]"><Shapes size={20} strokeWidth={2} />Nueva Categoría</button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
          <section className="overflow-hidden rounded-[8px] border border-[#C8CEDB] bg-white">
            <div className="flex flex-col gap-5 border-b border-[#C8CEDB] px-6 py-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#DDEAFF] text-[#9E3659]"><Star size={25} strokeWidth={1.9} /></span><h3 className="text-[27px] font-bold text-[#1F1F22]">Marcas</h3></div>
              <div className="flex h-10 w-full items-center gap-2 rounded-full border border-[#C8CEDB] bg-[#F8FAFC] px-4 text-[#4B5563] md:w-[230px]"><input aria-label="Buscar marcas" placeholder="Buscar marcas..." className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-semibold outline-none placeholder:text-[#6B7280]" /><Search size={18} strokeWidth={2} /></div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse">
                <thead className="bg-[#F3F4F6] text-left text-[14px] font-bold uppercase tracking-[0.12em] text-[#4B5563]"><tr><th className="px-12 py-5">Nombre</th><th className="px-6 py-5">Productos</th><th className="px-6 py-5">Estado</th><th className="px-6 py-5">Acciones</th></tr></thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.id} className="border-b border-[#C8CEDB] last:border-b-0">
                      <td className="px-12 py-8"><p className="text-[19px] font-bold text-[#1F1F22]">{brand.name}</p><p className="mt-1 text-[13px] text-[#6B7280]">{brand.slug}</p></td>
                      <td className="px-6 py-8 text-[15px] font-semibold text-[#4B5563]">{brand.products}</td>
                      <td className="px-6 py-8"><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[14px] font-semibold ${brand.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}><span className={`h-2 w-2 rounded-full ${brand.active ? "bg-emerald-500" : "bg-red-500"}`} />{brand.active ? "Activo" : "Inactivo"}</span></td>
                      <td className="px-6 py-8"><button aria-label={`Editar ${brand.name}`} onClick={() => setActiveModal({ type: "brand", item: brand })} className="text-[#9E3659] transition-colors hover:text-[#84304C]"><Edit3 size={23} strokeWidth={2} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex h-16 w-full items-center justify-center border-t border-[#C8CEDB] bg-[#F3F4F6] text-[15px] font-bold tracking-wide text-[#9E3659]">Total de marcas: {brands.length}</div>
          </section>

          <section className="overflow-hidden rounded-[8px] border border-[#C8CEDB] bg-white">
            <div className="flex items-center gap-4 border-b border-[#C8CEDB] px-6 py-6"><span className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-[#FFE0D1] text-[#B4532B]"><Grid2X2Plus size={25} strokeWidth={1.9} /></span><h3 className="text-[27px] font-bold text-[#1F1F22]">Categorías</h3></div>
            <div className="space-y-5 px-5 py-5">
              {categories.map((category) => (
                <article key={category.id} className="overflow-hidden rounded-[4px] border border-[#C8CEDB] bg-white">
                  <div className="px-5 py-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">{category.open ? <ChevronDown size={20} strokeWidth={2} className="text-[#374151]" /> : <ChevronRight size={20} strokeWidth={2} className="text-[#374151]" />}<div><h4 className="text-[20px] font-bold text-[#1F1F22]">{category.name}</h4><p className="text-[13px] text-[#6B7280]">{category.slug}</p></div></div>
                      <button aria-label={`Editar ${category.name}`} onClick={() => setActiveModal({ type: "category", item: category })} className="text-[#9E3659] hover:text-[#84304C]"><Edit3 size={20} /></button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-5 text-[14px] font-semibold text-[#4B5563]"><span className="inline-flex items-center gap-1"><Package size={17} strokeWidth={1.8} />{category.products} Productos</span><span className="inline-flex items-center gap-1">{category.visible ? <Eye size={17} strokeWidth={1.8} /> : <EyeOff size={17} strokeWidth={1.8} />}{category.visible ? "Visible" : "Oculto"}</span></div>
                  </div>
                  {category.open && <div className="border-t border-[#E5E7EB] bg-[#F9FAFB]">{category.children.map((child) => <div key={child.id} className="flex items-center justify-between border-b border-[#E5E7EB] px-10 py-4 last:border-b-0"><span className="flex items-center gap-2 text-[19px] text-[#1F1F22]"><ChevronUp size={17} strokeWidth={1.8} className="rotate-90 text-[#6B7280]" />{child.name}</span><span className="text-[15px] font-semibold text-[#4B5563]">{child.items} ítems</span></div>)}</div>}
                </article>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-[#C8CEDB] bg-[#EEF0F3] px-6 py-6 text-[15px] font-semibold text-[#374151]"><p>Total de categorías: {allCategories.length}</p><div className="flex items-center gap-6"><button aria-label="Página anterior" className="transition-colors hover:text-[#9E3659]"><ChevronLeft size={19} strokeWidth={2} /></button><span>1 / 1</span><button aria-label="Página siguiente" className="transition-colors hover:text-[#9E3659]"><ChevronRight size={19} strokeWidth={2} /></button></div></div>
          </section>
        </div>
      </main>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-[620px] overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-[#E7BFC9] px-8 py-7"><div><p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#9E3659]">Organización del catálogo</p><h3 className="mt-2 text-[28px] font-bold text-[#1F1F22]">{isBrand ? editingBrand ? "Editar Marca" : "Nueva Marca" : editingCategory ? "Editar Categoría" : "Nueva Categoría"}</h3></div><button onClick={() => setActiveModal(null)} aria-label="Cerrar formulario" className="text-[#5F5F61] transition-colors hover:text-[#9E3659]"><X size={27} strokeWidth={1.8} /></button></div>
            <form action={isBrand ? brandAction : categoryAction} className="space-y-6 px-8 py-8">
              <input type="hidden" name="id" value={isBrand ? editingBrand?.id ?? "" : editingCategory?.id ?? ""} />
              <label className="block"><span className="text-[15px] font-bold text-[#4B4E5A]">{isBrand ? "Nombre de la marca" : "Nombre de la categoría"}</span><input name="name" defaultValue={isBrand ? editingBrand?.name : editingCategory?.name} placeholder={isBrand ? "Ej. LuxeEssence" : "Ej. Cuidado Corporal"} className="mt-3 h-13 w-full rounded-[6px] border border-[#E7BFC9] bg-[#FFFCFC] px-5 text-[16px] outline-none placeholder:text-[#C8AAB3] focus:border-[#9E3659]" /></label>
              <label className="block"><span className="text-[15px] font-bold text-[#4B4E5A]">Slug</span><input name="slug" defaultValue={isBrand ? editingBrand?.slug : editingCategory?.slug} placeholder={isBrand ? "luxe-essence" : "cuidado-corporal"} className="mt-3 h-13 w-full rounded-[6px] border border-[#E7BFC9] bg-[#FFFCFC] px-5 text-[16px] outline-none placeholder:text-[#C8AAB3] focus:border-[#9E3659]" /></label>
              {isCategory && <label className="block"><span className="text-[15px] font-bold text-[#4B4E5A]">Categoría padre</span><div className="relative mt-3"><select name="parent" defaultValue={editingCategory?.parentId ?? ""} className="h-13 w-full appearance-none rounded-[6px] border border-[#E7BFC9] bg-[#FFFCFC] px-5 text-[16px] outline-none focus:border-[#9E3659]"><option value="">Sin categoría padre</option>{allCategories.filter((category) => category.id !== editingCategory?.id).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5F6370]" /></div></label>}
              <label className="flex items-center justify-between rounded-[8px] bg-[#F1F2F4] px-5 py-4"><span><span className="block text-[15px] font-bold text-[#1F1F22]">Estado</span><span className="text-[13px] text-[#4B4E5A]">Visible y disponible para productos</span></span><input type="checkbox" name="active" defaultChecked={isBrand ? editingBrand?.active ?? true : editingCategory?.visible ?? true} className="h-6 w-6 accent-[#9E3659]" /></label>
              <div className="flex flex-col gap-4 border-t border-[#E7BFC9] bg-[#F8F8F9] px-0 py-6 sm:flex-row sm:justify-end"><button type="button" onClick={() => setActiveModal(null)} className="h-12 px-7 text-[15px] font-bold text-[#5C4B50] transition-colors hover:text-[#9E3659]">Cancelar</button><button className="inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-[#7D123B] px-8 text-[15px] font-bold text-white transition-colors hover:bg-[#681032]"><Save size={17} strokeWidth={2} />{isBrand ? "Guardar Marca" : "Guardar Categoría"}</button></div>
            </form>
            {(editingBrand || editingCategory) && <form action={removeEntityForm} className="border-t border-red-100 px-8 pb-8"><input type="hidden" name="collection" value={isBrand ? "brands" : "categories"} /><input type="hidden" name="id" value={isBrand ? editingBrand?.id ?? "" : editingCategory?.id ?? ""} /><button className="inline-flex h-11 items-center gap-2 rounded-[6px] border border-red-200 px-5 text-[14px] font-bold text-red-700 hover:bg-red-50"><Trash2 size={16} />Eliminar {isBrand ? "marca" : "categoría"}</button></form>}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

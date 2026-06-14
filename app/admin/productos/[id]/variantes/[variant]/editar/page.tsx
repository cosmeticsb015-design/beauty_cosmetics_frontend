import Link from "next/link";
import {
  ArrowLeft,
  BadgeDollarSign,
  Box,
  CheckCircle2,
  CloudUpload,
  ImageIcon,
  Save,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import AdminShell from "../../../../../components/AdminShell";
import VariantColorPicker from "../../../../components/VariantColorPicker";

const stockRows = [
  { branch: "Sede Central Norte", stock: 62, state: "Disponible" },
  { branch: "Sucursal Sur Marina", stock: 18, state: "Bajo Stock" },
  { branch: "Plaza Luxury Mall", stock: 44, state: "Disponible" },
];

export default function EditVariantPage() {
  return (
    <AdminShell active="products" searchPlaceholder="Buscar productos...">
      <main className="mx-auto w-full max-w-[1120px] px-4 py-10 md:px-8">
        <Link href="/admin/productos/velvet-rose-elixir/editar" className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#5F6370] hover:text-[#9E3659]">
          <ArrowLeft size={18} strokeWidth={2} />
          Volver al producto
        </Link>

        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-[38px] font-bold leading-tight text-[#1F1F22]">Editar Variante</h2>
              <span className="rounded-full bg-[#FCEDF0] px-4 py-2 text-[13px] font-bold text-[#9E3659]">Rosa Intenso</span>
            </div>
            <p className="mt-2 text-[18px] text-[#5F6370]">
              Ajusta color, precio, multimedia e inventario para esta variante de Velvet Rose Elixir.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/admin/productos/velvet-rose-elixir/editar" className="inline-flex h-11 items-center justify-center rounded-[8px] border border-[#C8CEDB] px-8 text-[14px] font-bold text-[#4B4E5A] hover:border-[#9E3659] hover:text-[#9E3659]">
              Cancelar
            </Link>
            <button className="inline-flex h-11 items-center justify-center gap-3 rounded-[8px] bg-[#9E3659] px-7 text-[14px] font-bold text-white hover:bg-[#84304C]">
              <Save size={17} strokeWidth={2} />
              Guardar Variante
            </button>
          </div>
        </div>

        <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_340px]">
          <div className="space-y-7">
            <section className="rounded-[10px] border border-[#E7BFC9] bg-white p-7">
              <div className="mb-7 flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#F3E3E8] text-[#9E3659]">
                  <SlidersHorizontal size={24} strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-[25px] font-bold text-[#1F1F22]">Identidad de Variante</h3>
                  <p className="text-[15px] text-[#5F6370]">Nombre comercial y atributos visibles</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="text-[15px] font-bold text-[#4B4E5A]">Nombre de Variante</span>
                  <input defaultValue="Rosa Intenso" className="mt-3 h-13 w-full rounded-[6px] border border-[#C8CEDB] bg-[#F8F9FB] px-5 text-[17px] outline-none focus:border-[#9E3659]" />
                </label>
                <label className="block">
                  <span className="text-[15px] font-bold text-[#4B4E5A]">Etiqueta Pública</span>
                  <input defaultValue="Rosa Intenso 50ml" className="mt-3 h-13 w-full rounded-[6px] border border-[#C8CEDB] bg-[#F8F9FB] px-5 text-[17px] outline-none focus:border-[#9E3659]" />
                </label>
              </div>

              <div className="mt-7 grid gap-7 md:grid-cols-[1fr_220px]">
                <VariantColorPicker initialColor="#9E3659" />
                
              </div>
            </section>

            <section className="rounded-[10px] border border-[#E7BFC9] bg-white p-7">
              <div className="mb-7 flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#F3E3E8] text-[#9E3659]">
                  <CloudUpload size={24} strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-[25px] font-bold text-[#1F1F22]">Multimedia y Presentación</h3>
                  <p className="text-[15px] text-[#5F6370]">Imágenes para tienda y catálogo</p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-[1fr_190px]">
                <button className="flex min-h-[210px] flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-[#E7BFC9] bg-[#FFFCFC] text-[#9E3659]">
                  <CloudUpload size={38} strokeWidth={2} />
                  <span className="mt-4 text-[20px] font-bold text-[#1F1F22]">Cambiar Imagen Principal</span>
                  <span className="mt-1 text-[14px] text-[#5F6370]">1000 x 1000 px recomendado</span>
                </button>
                <div className="grid gap-4">
                  <div className="rounded-[8px] bg-[linear-gradient(135deg,#fff2e9,#b60e22_58%,#5d0614)]" />
                  <div className="flex items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-[#F8F9FB] text-[#A0A5B2]">
                    <ImageIcon size={32} />
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[10px] border border-[#E7BFC9] bg-white">
              <div className="flex items-center gap-4 px-7 py-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#F3E3E8] text-[#9E3659]">
                  <Box size={24} strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-[25px] font-bold text-[#1F1F22]">Stock por Sucursal</h3>
                  <p className="text-[15px] text-[#5F6370]">Lectura operativa de disponibilidad</p>
                </div>
              </div>
              <table className="w-full border-collapse">
                <tbody>
                  {stockRows.map((row) => (
                    <tr key={row.branch} className="border-t border-[#E7BFC9]">
                      <td className="px-7 py-5 text-[16px] font-semibold text-[#1F1F22]">{row.branch}</td>
                      <td className="px-7 py-5 text-[18px] font-bold text-[#1F1F22]">{row.stock}</td>
                      <td className="px-7 py-5">
                        <span className={`rounded-full px-3 py-1 text-[13px] font-bold ${row.state === "Disponible" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                          {row.state}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>

          <aside className="space-y-7">
            <section className="rounded-[10px] border border-[#E7BFC9] bg-white p-7">
              <div className="flex items-center gap-3">
                <BadgeDollarSign size={26} strokeWidth={2} className="text-[#9E3659]" />
                <h3 className="text-[25px] font-bold text-[#1F1F22]">Precio & Estado</h3>
              </div>
              <label className="mt-7 block">
                <span className="text-[15px] font-bold text-[#4B4E5A]">Precio</span>
                <input defaultValue="$89.00" className="mt-3 h-13 w-full rounded-[6px] border border-[#C8CEDB] bg-[#F8F9FB] px-5 text-[18px] font-bold outline-none focus:border-[#9E3659]" />
              </label>
             
              <div className="mt-7 flex items-center justify-between rounded-[8px] bg-[#F1F2F4] px-5 py-4">
                <div>
                  <p className="text-[15px] font-bold text-[#1F1F22]">Variante Activa</p>
                  <p className="text-[13px] text-[#4B4E5A]">Visible en tienda</p>
                </div>
                <button className="relative h-8 w-14 rounded-full bg-[#9E3659]" aria-label="Variante activa">
                  <span className="absolute right-1.5 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
                </button>
              </div>
            </section>

            <section className="rounded-[10px] border border-[#E7BFC9] bg-[#FCEDF0] p-7">
              <div className="flex gap-4">
                <Sparkles size={26} strokeWidth={2} className="shrink-0 text-[#9E3659]" />
                <div>
                  <h3 className="text-[20px] font-bold text-[#7D123B]">Sugerencia de Catálogo</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#5C4B50]">
                    Mantén el nombre corto y usa la galería para diferenciar acabados. Esto ayuda a que la variante sea clara en cards y checkout.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[10px] border border-emerald-200 bg-emerald-50 p-7">
              <div className="flex items-center gap-3 text-emerald-700">
                <CheckCircle2 size={24} strokeWidth={2} />
                <h3 className="text-[19px] font-bold">Lista para publicar</h3>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-emerald-800">
                Esta variante tiene precio, color, SKU e inventario disponible.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </AdminShell>
  );
}

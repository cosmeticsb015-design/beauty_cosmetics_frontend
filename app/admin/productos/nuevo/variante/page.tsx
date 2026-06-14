import Link from "next/link";
import {
  CircleDollarSign,
  CloudUpload,
  Info,
  ImageIcon,
  Link2,
  Save,
  SlidersHorizontal,
  Undo2,
} from "lucide-react";
import AdminShell from "../../../components/AdminShell";
import VariantColorPicker from "../../components/VariantColorPicker";

function MiniProductImage({ className }: { className: string }) {
  return (
    <div className={`relative h-[78px] w-[84px] overflow-hidden rounded-[4px] ${className}`}>
      <div className="absolute bottom-2 left-1/2 h-12 w-4 -translate-x-1/2 rounded-t-[3px] bg-white/90 shadow" />
      <div className="absolute bottom-14 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#7A2608]/70" />
    </div>
  );
}

export default function NewVariantPage() {
  return (
    <AdminShell active="products" searchPlaceholder="Buscar productos...">
      <main className="mx-auto w-full max-w-[1100px] px-4 pb-28 pt-10 md:px-8">
        <div className="text-[18px] text-[#6B6063]">
          <Link href="/admin" className="hover:text-[#9E3659]">Productos</Link>
          <span className="mx-2">›</span>
          <span>Lipsticks Pro</span>
          <span className="mx-2">›</span>
          <span className="font-bold text-[#1F1F22]">Nueva Variante</span>
        </div>

        <h2 className="mt-3 text-[33px] font-bold leading-tight text-[#7D123B]">Crear Nueva Variante</h2>
        <p className="mt-1 text-[19px] text-[#6B6063]">
          Configure los detalles específicos, colores y precios de la nueva variante del producto.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-8">
            <section className="rounded-[10px] border border-[#E7BFC9] bg-white p-6">
              <div className="mb-6 flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F3E3E8] text-[#9E3659]">
                  <Link2 size={23} strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-[26px] font-bold text-[#1F1F22]">Producto Relacionado</h3>
                  <p className="text-[15px] text-[#6B6063]">Vincular variante al producto base</p>
                </div>
              </div>
              <div className="flex items-center gap-5 rounded-[8px] border border-[#E7BFC9] bg-[#F7F4F4] p-5">
                <MiniProductImage className="bg-[linear-gradient(135deg,#f5e1c6,#fffaf0_55%,#c9985a)]" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-[20px] font-bold text-[#1F1F22]">Velvet Matte Liquid Lipstick</h4>
                  <p className="mt-1 text-[14px] text-[#6B6063]">ID: PRD-4492-LIP</p>
                </div>
                <button className="text-[15px] font-bold text-[#7D123B]">Cambiar</button>
              </div>
            </section>

            <section className="rounded-[10px] border border-[#E7BFC9] bg-white p-6">
              <div className="mb-7 flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F3E3E8] text-[#9E3659]">
                  <ImageIcon size={23} strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-[26px] font-bold text-[#1F1F22]">Multimedia de la Variante</h3>
                  <p className="text-[15px] text-[#6B6063]">Sube imágenes de alta resolución</p>
                </div>
              </div>

              <div className="flex min-h-[230px] flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-[#E7BFC9] bg-[#FFFCFC]">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F1E3E8] text-[#9E3659]">
                  <CloudUpload size={34} strokeWidth={2} />
                </span>
                <p className="mt-6 text-[22px] font-bold text-[#1F1F22]">Subir Imagen Principal</p>
                <p className="mt-2 text-[15px] text-[#6B6063]">Recomendado: 1000 x 1000 px (JPEG, PNG)</p>
              </div>

              <p className="mt-8 text-[16px] font-bold text-[#6B6063]">Galería Adicional</p>
              <div className="mt-4 flex flex-wrap gap-5">
                <div className="h-24 w-24 rounded-[8px] bg-[linear-gradient(135deg,#fff3e8,#b70c14_55%,#5b0d10)]" />
                <div className="h-24 w-24 rounded-[8px] bg-[linear-gradient(135deg,#7b3831,#f4d7ca_62%,#4a1f1b)]" />
                <button className="flex h-24 w-24 items-center justify-center rounded-[8px] border-2 border-dashed border-[#E7BFC9] text-[34px] text-[#5F5F61]">
                  +
                </button>
              </div>
            </section>
          </div>

          <section className="rounded-[10px] border border-[#E7BFC9] bg-white p-7">
            <div className="mb-9 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F3E3E8] text-[#9E3659]">
                <SlidersHorizontal size={24} strokeWidth={2} />
              </span>
              <div>
                <h3 className="text-[26px] font-bold text-[#1F1F22]">Detalles de la Variante</h3>
                <p className="text-[15px] text-[#6B6063]">Personalización y atributos visuales</p>
              </div>
            </div>

            <div className="space-y-9">
              <label className="block">
                <span className="text-[15px] font-bold tracking-wide text-[#6B6063]">Nombre de la Variante (Label)</span>
                <input
                  defaultValue="Deep Burgundy Matte"
                  className="mt-3 h-16 w-full rounded-[8px] border border-[#E7BFC9] bg-[#FFFCFC] px-5 text-[20px] outline-none focus:border-[#9E3659]"
                />
              </label>

              <div className="grid gap-8 md:grid-cols-[1fr_220px]">
                <VariantColorPicker initialColor="#6C0C2B" />

                
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <label className="block">
                  <span className="text-[15px] font-bold tracking-wide text-[#6B6063]">Precio Específico (Override)</span>
                  <div className="mt-3 flex h-16 items-center rounded-[8px] border border-[#E7BFC9] bg-[#FFFCFC] px-5 focus-within:border-[#9E3659]">
                    <CircleDollarSign size={22} className="mr-3 text-[#6B6063]" />
                    <input defaultValue="24.99" className="min-w-0 flex-1 bg-transparent text-[20px] outline-none" />
                  </div>
                  <p className="mt-2 text-[12px] text-[#6B6063]">Dejar vacío para usar precio base ($22.00)</p>
                </label>

                <div>
                  <p className="text-[15px] font-bold tracking-wide text-[#6B6063]">Estado de Variante</p>
                  <div className="mt-8 flex items-center gap-4 text-[20px]">
                    <span className="text-[#6B6063]">Inactivo</span>
                    <button className="relative h-8 w-14 rounded-full bg-[#7D123B]" aria-label="Estado activo">
                      <span className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
                    </button>
                    <span className="font-bold text-[#1F1F22]">Activo</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E7BFC9] pt-8">
                <div className="flex gap-5 rounded-[8px] bg-[#FCEDF0] p-6 text-[#7D123B]">
                  <Info size={26} strokeWidth={2} className="shrink-0" />
                  <div>
                    <h4 className="text-[20px] font-bold">Información de Disponibilidad</h4>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#5C4B50]">
                      Al activar esta variante, aparecerá inmediatamente en la tienda online y catálogos digitales.
                      Asegúrese de que el inventario esté actualizado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="fixed bottom-8 left-1/2 z-30 w-[calc(100%-2rem)] max-w-[1100px] -translate-x-1/2 rounded-[10px] border border-[#E7BFC9] bg-white px-6 py-5 shadow-sm lg:left-[calc(50%+140px)] lg:w-[calc(100%-330px)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="flex items-center gap-4 text-[15px] text-[#6B6063]">
              <Undo2 size={24} strokeWidth={1.8} />
              Última modificación: hace 2 minutos por Admin
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                href="/admin/productos/nuevo"
                className="inline-flex h-12 min-w-[150px] items-center justify-center rounded-[8px] border border-[#E7BFC9] bg-white px-7 text-[15px] font-bold text-[#5C4B50] transition-colors hover:border-[#9E3659] hover:text-[#9E3659]"
              >
                Cancelar
              </Link>
              <button className="inline-flex h-12 min-w-[230px] items-center justify-center gap-3 rounded-[8px] bg-[#7D123B] px-7 text-[15px] font-bold text-white shadow-md transition-colors hover:bg-[#681032]">
                <Save size={17} strokeWidth={2} />
                Guardar Variante
              </button>
            </div>
          </div>
        </div>
      </main>
    </AdminShell>
  );
}

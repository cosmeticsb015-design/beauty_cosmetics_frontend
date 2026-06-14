import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import AdminShell from "../../../../components/AdminShell";

const variants = [
  { name: "Rosa Intenso 50ml", lot: "#8829", stock: 12, unitTone: "text-red-700", status: "CRÍTICO", statusClass: "bg-red-100 text-red-700", color: "#9E3659" },
  { name: "Nude Radiance 50ml", lot: "#8830", stock: 84, unitTone: "text-[#1F1F22]", status: "Disponible", statusClass: "bg-emerald-100 text-emerald-700", color: "#C19A6B" },
  { name: "Rose Gold Shimmer 50ml", lot: "#8831", stock: 25, unitTone: "text-orange-600", status: "BAJO", statusClass: "bg-orange-100 text-orange-700", color: "#C47582" },
];

export default function BranchInventoryPage() {
  return (
    <AdminShell active="products" searchPlaceholder="Buscar productos...">
      <main className="mx-auto w-full max-w-[1130px] px-4 py-10 md:px-8">
        <h2 className="text-[34px] font-bold leading-tight text-[#1F1F22]">Detalle de Inventario: Sede Central Norte</h2>
        <p className="mt-1 text-[19px] text-[#5F6370]">Monitoreo de stock por variante para Velvet Rose Elixir</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[390px_1fr]">
          <aside className="space-y-6">
            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-8">
              <h3 className="text-[28px] font-bold text-[#1F1F22]">Sede Central Norte</h3>
              <p className="mt-2 flex items-center gap-2 text-[18px] text-[#4B4E5A]">
                <MapPin size={19} strokeWidth={1.8} />
                Av. Las Orquídeas 450
              </p>
              <Link
                href="/admin/productos/velvet-rose-elixir/abastecer"
                className="mt-7 flex h-12 w-full items-center justify-center rounded-[4px] border border-[#6B7280] text-[17px] font-bold text-[#4B4E5A] transition-colors hover:border-[#9E3659] hover:text-[#9E3659]"
              >
                Abastecer Sede
              </Link>
            </section>

            <section className="rounded-[8px] border border-[#C8CEDB] bg-white p-8">
              <h3 className="text-[28px] font-bold leading-tight text-[#1F1F22]">
                Velvet Rose
                <br />
                Elixir
              </h3>
              <p className="mt-4 text-[18px] font-bold text-[#4B4E5A]">SKU: BC-VRE-001</p>
              <p className="mt-4 flex items-center gap-3 text-[16px] text-[#4B4E5A]">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                Activo
              </p>
            </section>
          </aside>

          <section className="overflow-hidden rounded-[8px] border border-[#C8CEDB] bg-white">
            <div className="border-b border-[#C8CEDB] bg-[#F4F5F7] px-8 py-7">
              <h3 className="text-[28px] font-bold text-[#1F1F22]">Variantes de Producto</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead className="bg-[#F8F9FB] text-left text-[16px] font-bold tracking-[0.06em] text-[#4B4E5A]">
                  <tr className="border-b border-[#C8CEDB]">
                    <th className="px-8 py-6">Variante</th>
                    <th className="px-8 py-6">Stock<br />Actual</th>
                    <th className="px-8 py-6">Estado</th>
                    <th className="px-8 py-6">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant) => (
                    <tr key={variant.name} className="border-b border-[#C8CEDB] last:border-b-0">
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-5">
                          <span className="h-12 w-12 rounded-[14px]" style={{ backgroundColor: variant.color }} />
                          <div>
                            <p className="text-[18px] font-bold text-[#1F1F22]">{variant.name}</p>
                            <p className="text-[15px] text-[#5F6370]">Lote: {variant.lot}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <span className={`text-[28px] font-bold ${variant.unitTone}`}>{variant.stock}</span>
                        <span className="ml-3 text-[15px] font-semibold text-[#4B4E5A]">unidades</span>
                      </td>
                      <td className="px-8 py-7">
                        <span className={`rounded-full px-4 py-2 text-[14px] font-bold ${variant.statusClass}`}>{variant.status}</span>
                      </td>
                      <td className="px-8 py-7">
                        <Link
                          href="/admin/productos/velvet-rose-elixir/variantes/rosa-intenso/editar"
                          className="text-[16px] font-bold text-blue-800 hover:text-[#9E3659]"
                        >
                          Gestionar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between bg-[#F8F9FB] px-8 py-7 text-[15px] font-semibold text-[#4B4E5A]">
              <p>Mostrando 3 de 12 variantes registradas</p>
              <div className="flex gap-3">
                <button className="flex h-8 w-8 items-center justify-center rounded-[3px] border border-[#C8CEDB] text-[#9AA3B2]" aria-label="Anterior">
                  <ChevronLeft size={21} />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-[3px] border border-[#C8CEDB] text-[#1F1F22]" aria-label="Siguiente">
                  <ChevronRight size={21} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </AdminShell>
  );
}

import {
  CheckCircle2,
  FileText,
  Layers3,
  MapPin,
  TrendingUp,
  Truck,
} from "lucide-react";
import AdminShell from "@/src/features/admin/components/AdminShell";

const variants = [
  {
    name: "Rosa Intenso",
    color: "#9E0030",
    stock: 12,
    critical: true,
    add: 50,
    projected: 62,
  },
  {
    name: "Nude Radiance",
    color: "#E2BB93",
    stock: 84,
    critical: false,
    add: 0,
    projected: 84,
  },
];

export default function RestockInventoryPage() {
  return (
    <AdminShell active="products" searchPlaceholder="Buscar productos...">
      <main className="mx-auto w-full max-w-[1080px] px-4 py-10 md:px-8">
        <h2 className="text-[40px] font-bold leading-tight text-[#1F1F22]">Abastecer Inventario</h2>
        <p className="mt-2 max-w-[820px] text-[18px] text-[#4B4E5A]">
          Gestiona el reabastecimiento de productos por sede para optimizar tu stock comercial.
        </p>

        <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_320px]">
          <div className="space-y-7">
            <section className="grid gap-7 rounded-[8px] border border-[#5F5F61] bg-white p-7 md:grid-cols-2">
              <div>
                <h3 className="text-[19px] font-medium text-[#4B4E5A]">Producto a Abastecer</h3>
                <div className="mt-3 flex items-center gap-5 rounded-[4px] border border-dashed border-[#5F5F61] bg-[#FAFAFA] p-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-[4px] border border-[#C8CEDB] bg-[linear-gradient(135deg,#f5eee9,#ffffff_55%,#b98672)]">
                    <div className="absolute bottom-3 left-1/2 h-12 w-5 -translate-x-1/2 rounded-t-[3px] bg-white/90 shadow" />
                    <div className="absolute bottom-[62px] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#7A2608]/70" />
                  </div>
                  <div>
                    <p className="text-[19px] font-medium text-[#1F1F22]">Velvet Rose Elixir</p>
                    <p className="text-[15px] font-bold text-blue-800">Línea Premium Skin</p>
                    <p className="text-[15px] text-[#4B4E5A]">SKU: BC-VRE-001</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[19px] font-medium text-[#4B4E5A]">Sucursal de Destino</h3>
                <div className="mt-3 rounded-[4px] border border-[#5F5F61] bg-[#F8F9FB] px-4 py-3 text-[18px] text-[#1F1F22]">
                  Sede Central Norte
                </div>
                <div className="mt-3 rounded-[4px] border border-[#5F5F61] bg-[#F1F2F4] p-5">
                  <div className="flex gap-3">
                    <MapPin size={24} strokeWidth={2} className="mt-1 text-blue-800" />
                    <div>
                      <p className="text-[18px] font-medium text-[#1F1F22]">Sede Central Norte</p>
                      <p className="mt-1 text-[14px] text-[#4B4E5A]">Av. Las Orquídeas 450, Distrito Empresarial</p>
                      <span className="mt-3 inline-flex bg-emerald-100 px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-emerald-700">
                        Almacén Principal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[8px] border border-[#5F5F61] bg-white">
              <div className="flex items-center gap-3 bg-[#F1F2F4] px-7 py-7">
                <Layers3 size={24} strokeWidth={2} className="text-blue-800" />
                <h3 className="text-[20px] font-medium text-[#1F1F22]">Variantes a Abastecer</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] border-collapse">
                  <thead className="bg-[#E5E7EB] text-left text-[18px] font-bold text-[#3F4450]">
                    <tr className="border-y border-[#5F5F61]">
                      <th className="px-5 py-5">Variante</th>
                      <th className="px-5 py-5">Stock Actual</th>
                      <th className="px-5 py-5">Cantidad a<br />Añadir</th>
                      <th className="px-5 py-5">Stock<br />Proyectado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((variant) => (
                      <tr key={variant.name} className="border-b border-[#5F5F61] last:border-b-0">
                        <td className="px-5 py-9">
                          <div className="flex items-center gap-4">
                            <span className="h-10 w-7 rounded-[2px] border border-[#5F5F61]" style={{ backgroundColor: variant.color }} />
                            <span className="max-w-[120px] text-[18px] text-[#1F1F22]">{variant.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-9">
                          <span className={variant.critical ? "text-[19px] font-bold text-red-700" : "text-[19px] text-[#1F1F22]"}>
                            {variant.stock}
                          </span>
                          <span className="ml-2 text-[14px] text-[#4B4E5A]">unidades</span>
                          {variant.critical && (
                            <span className="ml-3 rounded-[3px] bg-red-100 px-2 py-1 text-[11px] font-bold text-red-700">
                              CRÍTICO
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-9">
                          <input
                            defaultValue={variant.add}
                            className="h-12 w-28 rounded-[4px] border border-[#8A8F9C] bg-[#F8F9FB] px-4 text-[18px] outline-none focus:border-[#9E3659]"
                          />
                        </td>
                        <td className="px-5 py-9">
                          <span className={variant.projected > variant.stock ? "inline-flex items-center gap-2 text-[25px] font-bold text-blue-800" : "text-[25px] font-bold text-[#4B4E5A]"}>
                            {variant.projected > variant.stock && <TrendingUp size={18} strokeWidth={2.2} />}
                            {variant.projected}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-[8px] bg-white p-7 shadow-xl shadow-black/10">
            <div className="mb-5 flex items-center gap-3">
              <FileText size={26} strokeWidth={2} className="text-[#5F5F61]" />
              <h3 className="text-[25px] font-bold text-[#1F1F22]">Resumen</h3>
            </div>
            <div className="border-t border-[#5F5F61] pt-5">
              <div className="mb-8 flex items-start justify-between gap-5">
                <div>
                  <p className="text-[14px] font-semibold uppercase tracking-wide text-[#5F5F61]">Destino</p>
                  <p className="mt-1 text-[18px] text-[#1F1F22]">Sede Central Norte</p>
                </div>
                <Truck size={24} strokeWidth={2} className="text-[#5F5F61]" />
              </div>

              <div className="space-y-5 rounded-[4px] bg-[#FAFAFA] p-4">
                <div className="flex justify-between gap-5 text-[15px]">
                  <span>Rosa Intenso 50ml</span>
                  <strong>+50 unds.</strong>
                </div>
                <div className="flex justify-between gap-5 text-[15px]">
                  <span>Rose Gold Shimmer 50ml</span>
                  <strong>+75 unds.</strong>
                </div>
              </div>

              <div className="mt-6 border-t border-[#5F5F61] pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-bold text-[#4B4E5A]">Total de Unidades</span>
                  <span className="text-[30px] font-bold text-[#1F1F22]">125</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[16px] font-bold text-[#4B4E5A]">Variantes a Actualizar</span>
                  <span className="text-[24px] font-bold text-[#5F5F61]">02</span>
                </div>
              </div>

              <button className="mt-7 inline-flex h-16 w-full items-center justify-center gap-3 rounded-[6px] bg-[#9E3659] text-[19px] font-medium text-white transition-colors hover:bg-[#84304C]">
                <CheckCircle2 size={24} strokeWidth={2} />
                Ejecutar Abastecimiento
              </button>
            </div>
          </aside>
        </div>
      </main>
    </AdminShell>
  );
}

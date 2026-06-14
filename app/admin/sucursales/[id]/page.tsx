import Link from "next/link";
import { ArrowLeft, Clock, Edit3, MapPin, Package, Phone, Store, Truck } from "lucide-react";
import AdminShell from "../../components/AdminShell";

const stockSummary = [
  { label: "Productos activos", value: "384", icon: Package },
  { label: "Pedidos en ruta", value: "18", icon: Truck },
  { label: "Horario", value: "08:00 - 19:00", icon: Clock },
];

export default function BranchDetailPage() {
  return (
    <AdminShell active="branches">
      <main className="mx-auto w-full max-w-[1040px] px-4 py-12 md:px-8">
        <Link href="/admin/sucursales" className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#5C4B50] hover:text-[#9E3659]">
          <ArrowLeft size={18} strokeWidth={2} />
          Volver a sucursales
        </Link>

        <div className="mt-7 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-[10px] bg-[#FFD7E2] text-[#7D123B]">
                <Store size={28} strokeWidth={2} />
              </span>
              <div>
                <h2 className="text-[38px] font-bold leading-tight text-[#1F1F22]">Sucursal Norte Central</h2>
                <p className="mt-1 flex items-center gap-2 text-[17px] text-[#5C4B50]">
                  <MapPin size={18} strokeWidth={1.8} />
                  Morazán, El Salvador
                </p>
              </div>
            </div>
          </div>
          <Link href="/admin/sucursales/sucursal-norte-central/editar" className="inline-flex h-11 items-center justify-center gap-3 rounded-[8px] bg-[#7D123B] px-7 text-[14px] font-bold text-white hover:bg-[#681032]">
            <Edit3 size={17} strokeWidth={2} />
            Editar Sucursal
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {stockSummary.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="rounded-[10px] border border-[#E7BFC9] bg-white p-6">
                <Icon size={24} strokeWidth={2} className="text-[#9E3659]" />
                <p className="mt-4 text-[14px] font-bold uppercase tracking-wide text-[#6B6063]">{item.label}</p>
                <p className="mt-2 text-[25px] font-bold text-[#1F1F22]">{item.value}</p>
              </article>
            );
          })}
        </div>

        <section className="mt-8 rounded-[10px] border border-[#E7BFC9] bg-white p-8">
          <h3 className="text-[25px] font-bold text-[#1F1F22]">Información Operativa</h3>
          <div className="mt-7 grid gap-7 md:grid-cols-2">
            <div>
              <p className="text-[14px] font-bold uppercase tracking-wide text-[#6B6063]">Dirección</p>
              <p className="mt-2 text-[17px] text-[#1F1F22]">Av. Las Orquídeas 450, Distrito Empresarial, Morazán</p>
            </div>
            <div>
              <p className="text-[14px] font-bold uppercase tracking-wide text-[#6B6063]">Contacto</p>
              <p className="mt-2 flex items-center gap-2 text-[17px] text-[#1F1F22]">
                <Phone size={18} strokeWidth={1.8} />
                +503 2234 1188
              </p>
            </div>
            <div>
              <p className="text-[14px] font-bold uppercase tracking-wide text-[#6B6063]">Estado</p>
              <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-4 py-1.5 text-[13px] font-bold text-emerald-700">ACTIVA</span>
            </div>
            <div>
              <p className="text-[14px] font-bold uppercase tracking-wide text-[#6B6063]">Notas</p>
              <p className="mt-2 text-[17px] text-[#1F1F22]">Sede principal para atención boutique y despacho regional.</p>
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-[10px] border border-[#E7BFC9] bg-white">
          <div className="border-b border-[#E7BFC9] px-8 py-6">
            <h3 className="text-[25px] font-bold text-[#1F1F22]">Actividad Reciente</h3>
          </div>
          {["Abastecimiento ejecutado: +125 unidades", "Horario actualizado por Admin", "Pedido #BC-82934 preparado para despacho"].map((item) => (
            <div key={item} className="border-b border-[#E7BFC9] px-8 py-5 last:border-b-0">
              <p className="text-[16px] text-[#1F1F22]">{item}</p>
              <p className="mt-1 text-[13px] text-[#8A7378]">Hace 2 horas</p>
            </div>
          ))}
        </section>
      </main>
    </AdminShell>
  );
}

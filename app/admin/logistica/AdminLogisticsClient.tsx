"use client";

import { useState } from "react";
import { DollarSign, Info, MapPin, Pencil, Plus, Save, Truck, X } from "lucide-react";
import AdminShell from "../components/AdminShell";
import { saveShippingRateForm } from "../actions";

export type ShippingZoneIcon = "map-pin" | "truck";
export type ShippingZoneRow = { id: string; title: string; description: string; price: number; icon: ShippingZoneIcon; highlighted: boolean };
const shippingZoneIcons = { "map-pin": MapPin, truck: Truck } satisfies Record<ShippingZoneIcon, React.ElementType>;

type AdminLogisticsClientProps = { shippingZones: ShippingZoneRow[]; saved?: boolean };

const emptyZone: ShippingZoneRow = { id: "", title: "", description: "", price: 0, icon: "truck", highlighted: true };

export default function AdminLogisticsClient({ shippingZones, saved }: AdminLogisticsClientProps) {
  const [editingZone, setEditingZone] = useState<ShippingZoneRow | null>(null);

  return (
    <AdminShell active="logistics">
      <main className={`mx-auto w-full max-w-[1140px] px-4 py-12 md:px-8 ${editingZone ? "blur-[2px]" : ""}`}>
        {saved ? <div className="mb-6 rounded-[8px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-[15px] font-bold text-emerald-700">Tarifa guardada correctamente.</div> : null}
        <section className="max-w-[780px]">
          <p className="text-[15px] font-bold uppercase tracking-[0.14em] text-[#7D123B]">Configuración Global</p>
          <h2 className="mt-3 text-[38px] font-bold leading-tight text-[#1F1F22] md:text-[46px]">Zonas y Tarifas de Envío</h2>
          <p className="mt-5 text-[19px] leading-relaxed text-[#5C4B50]">Administra las tarifas reales de Strapi para que el checkout use costos activos, claros y actualizados.</p>
        </section>

        <div className="mt-10 flex items-center gap-4 rounded-[8px] border border-[#E2BBC6] bg-[#F3E2E7] px-5 py-5 text-[#5C4B50]"><Info size={24} strokeWidth={2} className="shrink-0 text-[#7D123B]" /><p className="text-[16px]">Las tarifas activas se reflejan en el checkout del cliente final.</p></div>

        <div className="mt-8 flex justify-end"><button onClick={() => setEditingZone(emptyZone)} className="inline-flex h-11 items-center justify-center gap-3 rounded-[8px] bg-[#7D123B] px-6 text-[14px] font-bold text-white hover:bg-[#681032]"><Plus size={17} />Nueva Tarifa</button></div>

        <div className="mt-7 grid gap-7 lg:grid-cols-2">
          {shippingZones.map((zone) => {
            const Icon = shippingZoneIcons[zone.icon];
            return <article key={zone.id} className="rounded-[8px] border border-[#E7BFC9] bg-white px-8 py-10 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#F1E3E8] text-[#7D123B]"><Icon size={28} strokeWidth={2} /></span><h3 className="mt-8 text-[26px] font-semibold text-[#1F1F22]">{zone.title}</h3><p className="mx-auto mt-3 max-w-[430px] text-[17px] leading-relaxed text-[#5C4B50]">{zone.description}</p><div className={`mx-auto mt-10 max-w-[460px] rounded-[8px] border border-[#E7BFC9] px-6 py-8 ${zone.highlighted ? "bg-[#F1E2E7]" : "bg-[#FAF8F8]"}`}><p className="text-[13px] font-bold uppercase tracking-wide text-[#5C4B50]">Costo de Envío</p><p className="mt-3 text-[56px] font-semibold leading-none text-[#7D123B]">${zone.price.toFixed(2)}</p><p className={`mt-3 text-[13px] font-bold ${zone.highlighted ? "text-emerald-700" : "text-red-700"}`}>{zone.highlighted ? "ACTIVA" : "INACTIVA"}</p></div><button onClick={() => setEditingZone(zone)} className="mt-10 inline-flex items-center justify-center gap-3 text-[18px] font-bold text-[#7D123B] transition-colors hover:text-[#9E3659]"><Pencil size={18} strokeWidth={2.2} />Ajustar Tarifa</button></article>;
          })}
        </div>
      </main>

      {editingZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <form action={saveShippingRateForm} className="w-full max-w-[560px] overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white shadow-xl">
            <input type="hidden" name="id" value={editingZone.id} />
            <div className="flex items-start justify-between border-b border-[#E7BFC9] px-8 py-7"><div><p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#9E3659]">{editingZone.id ? "Editar tarifa" : "Nueva tarifa"}</p><h3 className="mt-2 text-[28px] font-bold text-[#1F1F22]">{editingZone.title || "Configurar tarifa"}</h3></div><button type="button" onClick={() => setEditingZone(null)} aria-label="Cerrar editor de tarifa" className="text-[#5F5F61] transition-colors hover:text-[#9E3659]"><X size={27} strokeWidth={1.8} /></button></div>
            <div className="space-y-5 px-8 py-8">
              <label className="block"><span className="text-[15px] font-bold text-[#4B4E5A]">Nombre</span><input name="name" required defaultValue={editingZone.title} className="mt-3 h-12 w-full rounded-[6px] border border-[#E7BFC9] bg-[#FFFCFC] px-4 text-[16px] outline-none focus:border-[#9E3659]" /></label>
              <label className="block"><span className="text-[15px] font-bold text-[#4B4E5A]">Descripción</span><textarea name="description" defaultValue={editingZone.description} className="mt-3 min-h-[95px] w-full resize-none rounded-[6px] border border-[#E7BFC9] bg-[#FFFCFC] px-4 py-3 text-[15px] outline-none focus:border-[#9E3659]" /></label>
              <label className="block"><span className="text-[15px] font-bold text-[#4B4E5A]">Costo de envío</span><span className="mt-3 flex h-14 items-center rounded-[6px] border border-[#E7BFC9] bg-[#FFFCFC] px-4 focus-within:border-[#9E3659]"><DollarSign size={20} strokeWidth={2} className="mr-3 text-[#7D123B]" /><input name="cost" type="number" min="0" step="0.01" required defaultValue={editingZone.price.toFixed(2)} className="min-w-0 flex-1 bg-transparent text-[22px] font-semibold text-[#1F1F22] outline-none" /></span></label>
              <label className="flex items-center justify-between rounded-[8px] bg-[#F1F2F4] px-5 py-4"><span><span className="block text-[15px] font-bold text-[#1F1F22]">Tarifa activa</span><span className="text-[13px] text-[#4B4E5A]">Disponible en checkout</span></span><input type="checkbox" name="active" defaultChecked={editingZone.highlighted} className="h-6 w-6 accent-[#9E3659]" /></label>
              <div className="rounded-[8px] bg-[#FCEDF0] p-5 text-[#5C4B50]"><div className="flex gap-3"><Info size={22} strokeWidth={2} className="shrink-0 text-[#7D123B]" /><p className="text-[14px] leading-relaxed">Esta tarifa se guardará en Strapi y se usará por el checkout cuando esté activa.</p></div></div>
            </div>
            <div className="flex flex-col gap-4 border-t border-[#E7BFC9] bg-[#F8F8F9] px-8 py-6 sm:flex-row sm:justify-end"><button type="button" onClick={() => setEditingZone(null)} className="h-12 px-7 text-[15px] font-bold text-[#5C4B50] transition-colors hover:text-[#9E3659]">Cancelar</button><button className="inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-[#7D123B] px-8 text-[15px] font-bold text-white transition-colors hover:bg-[#681032]"><Save size={17} strokeWidth={2} />Guardar Tarifa</button></div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

"use client";

import { useState } from "react";
import { DollarSign, Info, MapPin, Pencil, Save, Truck, X } from "lucide-react";
import AdminShell from "../components/AdminShell";

const shippingZones = [
  {
    id: "regional",
    title: "Envio Regional",
    description: "Costo estándar para entregas dentro del área metropolitana y alrededores.",
    price: 3,
    icon: MapPin,
    highlighted: false,
  },
  {
    id: "national",
    title: "Envio Nacional",
    description: "Tarifa unificada para envíos a todo el territorio nacional sin restricciones de zona.",
    price: 5,
    icon: Truck,
    highlighted: true,
  },
];

export default function AdminLogisticsPage() {
  const [rates, setRates] = useState(
    shippingZones.reduce<Record<string, number>>((acc, zone) => {
      acc[zone.id] = zone.price;
      return acc;
    }, {})
  );
  const [editingZone, setEditingZone] = useState<(typeof shippingZones)[number] | null>(null);
  const [draftRate, setDraftRate] = useState("");

  const openRateEditor = (zone: (typeof shippingZones)[number]) => {
    setEditingZone(zone);
    setDraftRate(rates[zone.id].toFixed(2));
  };

  const saveRate = () => {
    if (!editingZone) return;
    const parsedRate = Number(draftRate);
    if (!Number.isFinite(parsedRate) || parsedRate < 0) return;

    setRates((current) => ({
      ...current,
      [editingZone.id]: parsedRate,
    }));
    setEditingZone(null);
  };

  return (
    <AdminShell active="logistics">
      <main className={`mx-auto w-full max-w-[1140px] px-4 py-12 md:px-8 ${editingZone ? "blur-[2px]" : ""}`}>
        <section className="max-w-[780px]">
          <p className="text-[15px] font-bold uppercase tracking-[0.14em] text-[#7D123B]">
            Configuración Global
          </p>
          <h2 className="mt-3 text-[38px] font-bold leading-tight text-[#1F1F22] md:text-[46px]">
            Zonas y Tarifas de Envío
          </h2>
          <p className="mt-5 text-[19px] leading-relaxed text-[#5C4B50]">
            Hemos simplificado nuestra logística. Ahora ofrecemos tarifas planas competitivas para
            todas tus zonas de entrega, asegurando transparencia y eficiencia en cada despacho de
            productos cosméticos.
          </p>
        </section>

        <div className="mt-10 flex items-center gap-4 rounded-[8px] border border-[#E2BBC6] bg-[#F3E2E7] px-5 py-5 text-[#5C4B50]">
          <Info size={24} strokeWidth={2} className="shrink-0 text-[#7D123B]" />
          <p className="text-[16px]">
            Las tarifas actualizadas se reflejarán instantáneamente en el checkout del cliente final.
          </p>
        </div>

        <div className="mt-10 grid gap-7 lg:grid-cols-2">
          {shippingZones.map((zone) => {
            const Icon = zone.icon;

            return (
              <article
                key={zone.title}
                className="rounded-[8px] border border-[#E7BFC9] bg-white px-8 py-10 text-center"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#F1E3E8] text-[#7D123B]">
                  <Icon size={28} strokeWidth={2} />
                </span>

                <h3 className="mt-8 text-[26px] font-semibold text-[#1F1F22]">{zone.title}</h3>
                <p className="mx-auto mt-3 max-w-[430px] text-[17px] leading-relaxed text-[#5C4B50]">
                  {zone.description}
                </p>

                <div
                  className={`mx-auto mt-10 max-w-[460px] rounded-[8px] border border-[#E7BFC9] px-6 py-8 ${
                    zone.highlighted ? "bg-[#F1E2E7]" : "bg-[#FAF8F8]"
                  }`}
                >
                  <p className="text-[13px] font-bold uppercase tracking-wide text-[#5C4B50]">
                    Costo de Envío
                  </p>
                  <p className="mt-3 text-[56px] font-semibold leading-none text-[#7D123B]">
                    ${rates[zone.id].toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => openRateEditor(zone)}
                  className="mt-10 inline-flex items-center justify-center gap-3 text-[18px] font-bold text-[#7D123B] transition-colors hover:text-[#9E3659]"
                >
                  <Pencil size={18} strokeWidth={2.2} />
                  Ajustar Tarifa
                </button>
              </article>
            );
          })}
        </div>
      </main>

      {editingZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-[520px] overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-[#E7BFC9] px-8 py-7">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#9E3659]">Editar tarifa</p>
                <h3 className="mt-2 text-[28px] font-bold text-[#1F1F22]">{editingZone.title}</h3>
              </div>
              <button
                onClick={() => setEditingZone(null)}
                aria-label="Cerrar editor de tarifa"
                className="text-[#5F5F61] transition-colors hover:text-[#9E3659]"
              >
                <X size={27} strokeWidth={1.8} />
              </button>
            </div>

            <div className="px-8 py-8">
              <label className="block">
                <span className="text-[15px] font-bold text-[#4B4E5A]">Nuevo costo de envío</span>
                <div className="mt-3 flex h-14 items-center rounded-[6px] border border-[#E7BFC9] bg-[#FFFCFC] px-4 focus-within:border-[#9E3659]">
                  <DollarSign size={20} strokeWidth={2} className="mr-3 text-[#7D123B]" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={draftRate}
                    onChange={(event) => setDraftRate(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-[22px] font-semibold text-[#1F1F22] outline-none"
                  />
                </div>
              </label>

              <div className="mt-6 rounded-[8px] bg-[#FCEDF0] p-5 text-[#5C4B50]">
                <div className="flex gap-3">
                  <Info size={22} strokeWidth={2} className="shrink-0 text-[#7D123B]" />
                  <p className="text-[14px] leading-relaxed">
                    Esta tarifa se reflejará en el checkout del cliente para los envíos de tipo {editingZone.title.toLowerCase()}.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#E7BFC9] bg-[#F8F8F9] px-8 py-6 sm:flex-row sm:justify-end">
              <button
                onClick={() => setEditingZone(null)}
                className="h-12 px-7 text-[15px] font-bold text-[#5C4B50] transition-colors hover:text-[#9E3659]"
              >
                Cancelar
              </button>
              <button
                onClick={saveRate}
                className="inline-flex h-12 items-center justify-center gap-3 rounded-[6px] bg-[#7D123B] px-8 text-[15px] font-bold text-white transition-colors hover:bg-[#681032]"
              >
                <Save size={17} strokeWidth={2} />
                Guardar Tarifa
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

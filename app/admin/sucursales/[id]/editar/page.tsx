import Link from "next/link";
import { ArrowLeft, Clock, Save } from "lucide-react";
import AdminShell from "../../../components/AdminShell";

export default function EditBranchPage() {
  return (
    <AdminShell active="branches">
      <main className="mx-auto w-full max-w-[1040px] px-4 py-12 md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[34px] font-bold leading-tight text-[#7D123B]">Editar Sucursal</h2>
            <p className="mt-2 text-[15px] text-[#5C4B50]">
              Actualiza la información operativa de Sucursal Norte Central.
            </p>
          </div>
          <Link
            href="/admin/sucursales/sucursal-norte-central"
            className="inline-flex h-12 items-center justify-center gap-3 rounded-[6px] border border-[#8A7378] px-6 text-[15px] font-bold text-[#1F1F22] hover:border-[#9E3659] hover:text-[#9E3659]"
          >
            <ArrowLeft size={18} strokeWidth={2} />
            Volver al detalle
          </Link>
        </div>

        <section className="mt-12 overflow-hidden rounded-[10px] border border-[#E7BFC9] bg-white">
          <div className="grid gap-8 p-9 md:grid-cols-[1fr_0.5fr]">
            <label className="block">
              <span className="text-[15px] font-bold text-[#1F1F22]">Nombre de la sucursal</span>
              <input
                defaultValue="Sucursal Norte Central"
                className="mt-3 h-14 w-full rounded-[6px] border border-[#E7BFC9] px-5 text-[15px] outline-none focus:border-[#9E3659]"
              />
            </label>

            <div>
              <p className="text-[15px] font-bold text-[#1F1F22]">Estado de la sucursal</p>
              <div className="mt-6 flex items-center gap-4">
                <button className="relative h-8 w-14 rounded-full bg-[#7D123B]" aria-label="Estado activo">
                  <span className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-white" />
                </button>
                <span className="text-[16px] font-semibold text-[#1F1F22]">Activa</span>
              </div>
            </div>

            <label className="block md:col-span-2">
              <span className="text-[15px] font-bold text-[#1F1F22]">Dirección completa</span>
              <textarea
                defaultValue="Av. Las Orquídeas 450, Distrito Empresarial, Morazán, El Salvador"
                className="mt-3 min-h-[90px] w-full resize-none rounded-[6px] border border-[#E7BFC9] px-5 py-4 text-[15px] outline-none focus:border-[#9E3659]"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-[15px] font-bold text-[#1F1F22]">Horario de atención</span>
              <div className="mt-3 flex h-14 items-center rounded-[6px] border border-[#E7BFC9] px-4 focus-within:border-[#9E3659]">
                <Clock size={19} strokeWidth={1.8} className="mr-4 text-[#8A7378]" />
                <input
                  defaultValue="Lun-Dom 08:00 - 19:00"
                  className="min-w-0 flex-1 bg-transparent text-[15px] outline-none"
                />
              </div>
            </label>

            <label className="block md:col-span-2">
              <span className="text-[15px] font-bold text-[#1F1F22]">Notas adicionales</span>
              <textarea
                defaultValue="Sede principal para atención boutique y despacho regional."
                className="mt-3 min-h-[115px] w-full resize-none rounded-[6px] border border-[#E7BFC9] px-5 py-4 text-[15px] outline-none focus:border-[#9E3659]"
              />
            </label>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#E7BFC9] bg-[#F8F8F9] px-8 py-7 sm:flex-row sm:justify-end">
            <Link href="/admin/sucursales/sucursal-norte-central" className="inline-flex h-14 items-center justify-center px-8 text-[15px] font-bold text-[#5C4B50] hover:text-[#9E3659]">
              Cancelar
            </Link>
            <button className="inline-flex h-14 items-center justify-center gap-3 rounded-[8px] bg-[#7D123B] px-9 text-[15px] font-bold text-white shadow-lg hover:bg-[#681032]">
              <Save size={18} strokeWidth={2} />
              Guardar Cambios
            </button>
          </div>
        </section>
      </main>
    </AdminShell>
  );
}

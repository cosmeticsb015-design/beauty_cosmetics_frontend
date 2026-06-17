import Link from "next/link";
import { ArrowLeft, Clock, Save } from "lucide-react";
import AdminShell from "../../../components/AdminShell";
import AdminDataError from "../../../components/AdminDataError";
import AdminFlash, { noticeFromQuery } from "../../../components/AdminFlash";
import { saveBranchForm } from "../../../actions";
import { getAdminBranch } from "../../../../services/admin";

export default async function EditBranchPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ saved?: string; error?: string; message?: string }> }) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};

  try {
    const response = await getAdminBranch(id);
    const branch = response.data;

    return (
      <AdminShell active="branches">
        <form action={saveBranchForm} className="mx-auto w-full max-w-[1040px] px-4 py-12 md:px-8">
          <AdminFlash notice={noticeFromQuery(query, "Sucursal guardada correctamente.")} />
          <input type="hidden" name="id" value={branch.documentId} />
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-[34px] font-bold leading-tight text-[#7D123B]">Editar Sucursal</h2>
              <p className="mt-2 text-[15px] text-[#5C4B50]">
                Actualiza la información operativa de {branch.name} para que el stock se pueda asignar correctamente.
              </p>
            </div>
            <Link
              href={`/admin/sucursales/${branch.documentId}`}
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
                  name="name"
                  required
                  defaultValue={branch.name}
                  className="mt-3 h-14 w-full rounded-[6px] border border-[#E7BFC9] px-5 text-[15px] outline-none focus:border-[#9E3659]"
                />
              </label>

              <label className="block">
                <span className="text-[15px] font-bold text-[#1F1F22]">Estado de la sucursal</span>
                <span className="mt-6 flex items-center gap-4">
                  <input type="checkbox" name="active" defaultChecked={branch.active} className="h-6 w-6 accent-[#7D123B]" />
                  <span className="text-[16px] font-semibold text-[#1F1F22]">Activa</span>
                </span>
              </label>

              <label className="block md:col-span-2">
                <span className="text-[15px] font-bold text-[#1F1F22]">Dirección completa</span>
                <textarea
                  name="address"
                  required
                  defaultValue={branch.address}
                  className="mt-3 min-h-[90px] w-full resize-none rounded-[6px] border border-[#E7BFC9] px-5 py-4 text-[15px] outline-none focus:border-[#9E3659]"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="text-[15px] font-bold text-[#1F1F22]">Horario de atención</span>
                <span className="mt-3 flex h-14 items-center rounded-[6px] border border-[#E7BFC9] px-4 focus-within:border-[#9E3659]">
                  <Clock size={19} strokeWidth={1.8} className="mr-4 text-[#8A7378]" />
                  <input
                    name="schedule"
                    defaultValue={branch.schedule ?? ""}
                    className="min-w-0 flex-1 bg-transparent text-[15px] outline-none"
                  />
                </span>
              </label>

              <label className="block md:col-span-2">
                <span className="text-[15px] font-bold text-[#1F1F22]">Notas adicionales</span>
                <textarea
                  name="notes"
                  defaultValue={branch.notes ?? ""}
                  className="mt-3 min-h-[115px] w-full resize-none rounded-[6px] border border-[#E7BFC9] px-5 py-4 text-[15px] outline-none focus:border-[#9E3659]"
                />
              </label>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#E7BFC9] bg-[#F8F8F9] px-8 py-7 sm:flex-row sm:justify-end">
              <Link href={`/admin/sucursales/${branch.documentId}`} className="inline-flex h-14 items-center justify-center px-8 text-[15px] font-bold text-[#5C4B50] hover:text-[#9E3659]">
                Cancelar
              </Link>
              <button className="inline-flex h-14 items-center justify-center gap-3 rounded-[8px] bg-[#7D123B] px-9 text-[15px] font-bold text-white shadow-lg hover:bg-[#681032]">
                <Save size={18} strokeWidth={2} />
                Guardar Cambios
              </button>
            </div>
          </section>
        </form>
      </AdminShell>
    );
  } catch (error) {
    return <AdminShell active="branches"><AdminDataError title="No se pudo cargar la sucursal para editar" error={error} permissions={["Branch: findOne/update"]} /></AdminShell>;
  }
}

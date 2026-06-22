import Link from "next/link";
import { ArrowLeft, Clock, Edit3, MapPin, Package, Phone, Store, Truck } from "lucide-react";
import AdminShell from "@/src/features/admin/components/AdminShell";
import AdminDataError from "@/src/features/admin/components/AdminDataError";
import AdminFlash from "@/src/features/admin/components/AdminFlash";
import { noticeFromQuery } from "@/src/features/admin/components/AdminFlash.utils";
import { getAdminBranch } from "@/src/shared/services/admin";

export default async function BranchDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ saved?: string; error?: string; message?: string }> }) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  try {
    const response = await getAdminBranch(id);
    const branch = response.data;
    const totalStock = branch.stocks?.reduce((total, stock) => total + Number(stock.quantity || 0), 0) ?? 0;
    const stockSummary = [
      { label: "Unidades en stock", value: String(totalStock), icon: Package },
      { label: "Registros stock", value: String(branch.stocks?.length ?? 0), icon: Truck },
      { label: "Horario", value: branch.schedule || "No definido", icon: Clock },
    ];
    return (
      <AdminShell active="branches">
        <main className="mx-auto w-full max-w-[1040px] px-4 py-12 md:px-8">
          <AdminFlash notice={noticeFromQuery(query, "Sucursal guardada correctamente.")} />
          <Link href="/admin/sucursales" className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#5C4B50] hover:text-[#9E3659]"><ArrowLeft size={18} strokeWidth={2} />Volver a sucursales</Link>
          <div className="mt-7 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-[10px] bg-[#FFD7E2] text-[#7D123B]"><Store size={28} strokeWidth={2} /></span><div><h2 className="text-[38px] font-bold leading-tight text-[#1F1F22]">{branch.name}</h2><p className="mt-1 flex items-center gap-2 text-[17px] text-[#5C4B50]"><MapPin size={18} strokeWidth={1.8} />{branch.address}</p></div></div>
            <Link href={`/admin/sucursales/${branch.documentId}/editar`} className="inline-flex h-11 items-center justify-center gap-3 rounded-[8px] bg-[#7D123B] px-7 text-[14px] font-bold text-white hover:bg-[#681032]"><Edit3 size={17} strokeWidth={2} />Editar Sucursal</Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">{stockSummary.map((item) => { const Icon = item.icon; return <article key={item.label} className="rounded-[10px] border border-[#E7BFC9] bg-white p-6"><Icon size={24} strokeWidth={2} className="text-[#9E3659]" /><p className="mt-4 text-[14px] font-bold uppercase tracking-wide text-[#6B6063]">{item.label}</p><p className="mt-2 text-[25px] font-bold text-[#1F1F22]">{item.value}</p></article>; })}</div>
          <section className="mt-8 rounded-[10px] border border-[#E7BFC9] bg-white p-8"><h3 className="text-[25px] font-bold text-[#1F1F22]">Información Operativa</h3><div className="mt-7 grid gap-7 md:grid-cols-2"><div><p className="text-[14px] font-bold uppercase tracking-wide text-[#6B6063]">Dirección</p><p className="mt-2 text-[17px] text-[#1F1F22]">{branch.address}</p></div><div><p className="text-[14px] font-bold uppercase tracking-wide text-[#6B6063]">Contacto</p><p className="mt-2 flex items-center gap-2 text-[17px] text-[#1F1F22]"><Phone size={18} strokeWidth={1.8} />No definido</p></div><div><p className="text-[14px] font-bold uppercase tracking-wide text-[#6B6063]">Estado</p><span className={`mt-2 inline-flex rounded-full px-4 py-1.5 text-[13px] font-bold ${branch.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{branch.active ? "ACTIVA" : "INACTIVA"}</span></div><div><p className="text-[14px] font-bold uppercase tracking-wide text-[#6B6063]">Notas</p><p className="mt-2 text-[17px] text-[#1F1F22]">{branch.notes || "Sin notas"}</p></div></div></section>
          <section className="mt-8 overflow-hidden rounded-[10px] border border-[#E7BFC9] bg-white"><div className="border-b border-[#E7BFC9] px-8 py-6"><h3 className="text-[25px] font-bold text-[#1F1F22]">Inventario conectado</h3></div>{(branch.stocks ?? []).map((stock) => <div key={stock.documentId} className="border-b border-[#E7BFC9] px-8 py-5 last:border-b-0"><p className="text-[16px] text-[#1F1F22]">{stock.variant?.product?.name ?? "Producto"} — {stock.quantity} unidades</p><p className="mt-1 text-[13px] text-[#8A7378]">Reservado: {stock.reserved ?? 0}</p></div>)}</section>
        </main>
      </AdminShell>
    );
  } catch (error) {
    return <AdminShell active="branches"><AdminDataError title="No se pudo cargar la sucursal desde Strapi" error={error} permissions={["Branch: findOne", "Branch-stock: find/findOne", "Variant-option: find/findOne", "Product: find/findOne"]} /></AdminShell>;
  }
}

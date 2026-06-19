"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardClock,
  Eye,
  ListFilter,
  Pencil,
  Search,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import AdminShell from "../components/AdminShell";
import AdminFlash from "../components/AdminFlash";
import type { AdminNotice } from "../components/AdminFlash.utils";
import { updateOrderStatusForm } from "../actions";

export type OrderStatIcon = "shopping-cart" | "clipboard-clock" | "truck";
export type OrderStat = { label: string; value: string; icon: OrderStatIcon; note: string; noteTone: string };
const statIcons = { "shopping-cart": ShoppingCart, "clipboard-clock": ClipboardClock, truck: Truck } satisfies Record<OrderStatIcon, React.ElementType>;
export type OrderRow = {
  id: string;
  documentId: string;
  customer: string;
  email: string;
  date: string;
  total: string;
  status: string;
  orderStatus: string;
  statusClass: string;
  delivery: string;
  itemCount: string;
};

type AdminOrdersClientProps = {
  stats: OrderStat[];
  orders: OrderRow[];
  totalLabel: string;
  pagination: { page: number; pageCount: number; total: number };
  filters: { status: string; search: string; dateFrom: string; dateTo: string };
  saved?: boolean;
  notice?: AdminNotice;
};

const tabs = [
  { label: "Todos", value: "all" },
  { label: "Pendientes de envio", value: "pending_shipping" },
  { label: "Enviados", value: "shipped" },
  { label: "Entregados", value: "delivered" },
];

const fulfillmentStatusOptions = [
  { value: "pending_shipping", label: "Pendiente de envio" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
];

const exportStatusOptions = [
  { value: "all", label: "Todos los estados" },
  ...fulfillmentStatusOptions,
];

export default function AdminOrdersClient({ stats, orders, totalLabel, pagination, filters, saved = false, notice }: AdminOrdersClientProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const hrefFor = (next: { page?: number; status?: string; search?: string; dateFrom?: string; dateTo?: string }) => {
    const params = new URLSearchParams();
    const status = next.status ?? filters.status;
    const search = next.search ?? filters.search;
    const page = next.page ?? pagination.page;
    const dateFrom = next.dateFrom ?? filters.dateFrom;
    const dateTo = next.dateTo ?? filters.dateTo;
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    if (dateFrom) params.set("date_from", dateFrom);
    if (dateTo) params.set("date_to", dateTo);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  const pageNumbers = useMemo(() => {
    const start = Math.max(1, pagination.page - 1);
    const end = Math.min(pagination.pageCount, pagination.page + 1);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [pagination.page, pagination.pageCount]);

  return (
    <AdminShell active="orders" searchPlaceholder="Buscar pedidos, clientes, IDs...">
      <main className={`mx-auto w-full max-w-[1180px] px-4 py-8 md:px-8 ${selectedOrder ? "blur-[3px]" : ""}`}>
        <AdminFlash notice={notice ?? (saved ? { type: "success", message: "Pedido actualizado correctamente." } : null)} />
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#9E3659] lg:hidden">Beauty Cosmetics Admin</p>
            <h2 className="text-[30px] font-bold leading-tight text-[#1F1F22] md:text-[34px]">Gestion de Pedidos</h2>
            <p className="mt-1 text-[17px] text-[#6B6063]">Supervisa y procesa las ordenes de tus clientes en tiempo real.</p>
          </div>
          <button type="button" onClick={() => setExportOpen(true)} className="inline-flex h-12 items-center justify-center rounded-[4px] bg-[#9E3659] px-9 text-[15px] font-semibold tracking-wide text-white transition-colors hover:bg-[#84304C]">
            Exportar para Excel
          </button>
        </div>

        <div className="mt-12 grid max-w-[900px] gap-6 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = statIcons[stat.icon];
            return (
              <div key={stat.label} className="rounded-[8px] border border-[#E7BFC9] bg-white px-7 py-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#F5DDE5] text-[#9E3659]"><Icon size={23} strokeWidth={1.9} /></span>
                  <span className={`text-[16px] ${stat.noteTone}`}>{stat.note}</span>
                </div>
                <p className="mt-4 min-h-[56px] text-[18px] uppercase tracking-wide text-[#6B6063]">{stat.label}</p>
                <p className="mt-1 text-[34px] font-bold leading-none text-[#1F1F22]">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <section className="mt-12 overflow-hidden rounded-[8px] border border-[#E7BFC9] bg-white">
          <div className="flex flex-col gap-5 border-b border-[#E7BFC9] px-6 py-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {tabs.map((tab) => (
                <Link key={tab.value} href={hrefFor({ status: tab.value, page: 1 })} className={`inline-flex h-11 items-center rounded-[8px] px-5 text-[17px] transition-colors ${filters.status === tab.value ? "bg-[#9E3659] font-semibold text-white" : "text-[#6B6063] hover:bg-[#FCEDF0]"}`}>
                  {tab.label}
                </Link>
              ))}
            </div>

            <form action="/admin/pedidos" className="flex flex-wrap gap-4">
              <input type="hidden" name="status" value={filters.status} />
              <label className="inline-flex h-11 items-center gap-3 rounded-[4px] border border-[#E7BFC9] bg-white px-4 text-[16px] text-[#554246]">
                <Search size={17} strokeWidth={1.8} />
                <input name="search" defaultValue={filters.search} placeholder="Buscar pedido o cliente" className="w-48 bg-transparent outline-none" />
              </label>
              <label className="inline-flex h-11 items-center gap-2 rounded-[4px] border border-[#E7BFC9] bg-white px-4 text-[14px] text-[#554246]">
                Desde
                <input type="date" name="date_from" defaultValue={filters.dateFrom} className="bg-transparent text-[15px] outline-none" />
              </label>
              <label className="inline-flex h-11 items-center gap-2 rounded-[4px] border border-[#E7BFC9] bg-white px-4 text-[14px] text-[#554246]">
                Hasta
                <input type="date" name="date_to" defaultValue={filters.dateTo} className="bg-transparent text-[15px] outline-none" />
              </label>
              <button className="inline-flex h-11 items-center gap-3 rounded-[4px] border border-[#E7BFC9] bg-white px-4 text-[16px] text-[#554246]">
                <ListFilter size={17} strokeWidth={1.8} /> Aplicar filtros
              </button>
              <button type="button" onClick={() => router.push("/admin/pedidos")} className="inline-flex h-11 items-center gap-3 rounded-[4px] border border-[#E7BFC9] bg-white px-4 text-[16px] text-[#554246]">
                <CalendarDays size={17} strokeWidth={1.8} /> Limpiar
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse">
              <thead className="bg-[#FAFAFA] text-left text-[16px] font-bold text-[#5F5F61]">
                <tr className="border-b border-[#E7BFC9]"><th className="px-10 py-5">ID Pedido</th><th className="px-4 py-5">Cliente</th><th className="px-4 py-5">Fecha</th><th className="px-4 py-5">Entrega</th><th className="px-4 py-5">Total</th><th className="px-4 py-5">Estado</th><th className="px-4 py-5 text-center">Acciones</th></tr>
              </thead>
              <tbody>
                {orders.length ? orders.map((order) => (
                  <tr key={order.documentId} className="border-b border-[#E7BFC9] last:border-b-0">
                    <td className="px-10 py-6 text-[17px] font-bold text-[#9E3659]">{order.id}</td>
                    <td className="px-4 py-6"><p className="text-[17px] font-medium leading-tight text-[#2D1F23]">{order.customer}</p><p className="mt-1 text-[16px] leading-tight text-[#6B6063]">{order.email}</p><p className="mt-1 text-[14px] leading-tight text-[#9A8F92]">{order.itemCount}</p></td>
                    <td className="px-4 py-6 text-[17px] text-[#2D1F23]">{order.date}</td>
                    <td className="px-4 py-6 text-[16px] text-[#554246]">{order.delivery}</td>
                    <td className="px-4 py-6 text-[17px] text-[#2D1F23]">{order.total}</td>
                    <td className="px-4 py-6"><span className={`inline-flex rounded-full border px-4 py-1.5 text-[12px] font-bold ${order.statusClass}`}>{order.status}</span></td>
                    <td className="px-4 py-6"><div className="flex items-center justify-center gap-5 text-[#9E3659]"><button aria-label={`Editar pedido ${order.id}`} onClick={() => setSelectedOrder(order)} className="transition-colors hover:text-[#84304C]"><Pencil size={22} strokeWidth={1.9} /></button><Link href={`/admin/pedidos/${order.documentId}`} aria-label={`Ver pedido ${order.id}`} className="transition-colors hover:text-[#84304C]"><Eye size={22} strokeWidth={1.9} /></Link></div></td>
                  </tr>
                )) : <tr><td colSpan={7} className="px-10 py-12 text-center text-[17px] text-[#6B6063]">No hay pedidos con los filtros seleccionados.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-5 px-7 py-7 text-[16px] text-[#6B6063] md:flex-row md:items-center md:justify-between">
            <p>{totalLabel}</p>
            <div className="flex items-center gap-3 text-[#554246]">
              <Link href={hrefFor({ page: Math.max(1, pagination.page - 1) })} className={`flex h-9 w-9 items-center justify-center rounded-[3px] border border-[#E7BFC9] ${pagination.page <= 1 ? "pointer-events-none text-[#D0B8BF]" : "transition-colors hover:text-[#9E3659]"}`}><ChevronLeft size={18} strokeWidth={1.8} /></Link>
              {pageNumbers.map((number) => <Link key={number} href={hrefFor({ page: number })} className={`flex h-9 w-9 items-center justify-center rounded-[3px] ${number === pagination.page ? "bg-[#9E3659] text-white" : "border border-[#E7BFC9]"}`}>{number}</Link>)}
              <Link href={hrefFor({ page: Math.min(pagination.pageCount, pagination.page + 1) })} className={`flex h-9 w-9 items-center justify-center rounded-[3px] border border-[#E7BFC9] ${pagination.page >= pagination.pageCount ? "pointer-events-none text-[#D0B8BF]" : "transition-colors hover:text-[#9E3659]"}`}><ChevronRight size={18} strokeWidth={1.8} /></Link>
            </div>
          </div>
        </section>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <form action={updateOrderStatusForm} className="w-full max-w-[660px] overflow-hidden rounded-[4px] border border-[#E7BFC9] bg-white shadow-xl">
            <input type="hidden" name="id" value={selectedOrder.documentId} />
            <div className="flex items-start justify-between px-8 py-7"><div><h3 className="text-[30px] font-bold leading-tight text-[#1F1F22]">Actualizar Estado del Pedido</h3><span className="mt-2 inline-flex rounded-[3px] bg-[#F1EEF0] px-3 py-1 text-[17px] font-bold text-[#9E3659]">{selectedOrder.id}</span></div><button type="button" aria-label="Cerrar modal" onClick={() => setSelectedOrder(null)} className="text-[#5F5F61] transition-colors hover:text-[#9E3659]"><X size={28} strokeWidth={1.8} /></button></div>
            <div className="border-y border-[#E7BFC9] px-8 py-8"><label htmlFor="order-status" className="text-[15px] text-[#5F5F61]">Estado del pedido</label><div className="relative mt-5"><select id="order-status" name="order_status" defaultValue={selectedOrder.orderStatus} className="h-12 w-full appearance-none bg-white px-4 text-[19px] text-[#1F1F22] outline-none">{fulfillmentStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown size={22} strokeWidth={1.8} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" /></div></div>
            <div className="flex flex-col gap-4 bg-[#F5F5F5] px-8 py-7 sm:flex-row sm:justify-end"><button type="button" onClick={() => setSelectedOrder(null)} className="h-13 min-w-[190px] rounded-[2px] border border-[#5F5F61] px-8 text-[17px] font-semibold text-[#5F5F61] transition-colors hover:border-[#9E3659] hover:text-[#9E3659]">Cancelar</button><button className="h-13 min-w-[260px] rounded-[2px] bg-[#9E3659] px-8 text-[17px] font-semibold tracking-wide text-white transition-colors hover:bg-[#84304C]">Actualizar Estado</button></div>
          </form>
        </div>
      )}

      {exportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <form method="GET" action="/admin/pedidos/export" className="w-full max-w-[620px] overflow-hidden rounded-[4px] border border-[#E7BFC9] bg-white shadow-xl">
            {filters.search && <input type="hidden" name="search" value={filters.search} />}
            <div className="flex items-start justify-between px-8 py-7">
              <div>
                <h3 className="text-[30px] font-bold leading-tight text-[#1F1F22]">Exportar pedidos</h3>
                <p className="mt-2 text-[16px] text-[#6B6063]">Descarga un CSV compatible con Excel. Deja el rango vacio para exportar todos los pedidos filtrados o selecciona fechas para limitarlo.</p>
              </div>
              <button type="button" aria-label="Cerrar exportacion" onClick={() => setExportOpen(false)} className="text-[#5F5F61] transition-colors hover:text-[#9E3659]"><X size={28} strokeWidth={1.8} /></button>
            </div>
            <div className="grid gap-5 border-y border-[#E7BFC9] px-8 py-8 md:grid-cols-2">
              <label className="text-[15px] text-[#5F5F61] md:col-span-2">
                Estado
                <select name="status" defaultValue={filters.status} className="mt-2 h-12 w-full rounded-[4px] border border-[#E7BFC9] px-4 text-[16px] text-[#1F1F22] outline-none focus:border-[#9E3659]">
                  {exportStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label className="text-[15px] text-[#5F5F61]">
                Desde
                <input type="date" name="date_from" defaultValue={filters.dateFrom} className="mt-2 h-12 w-full rounded-[4px] border border-[#E7BFC9] px-4 text-[16px] text-[#1F1F22] outline-none focus:border-[#9E3659]" />
              </label>
              <label className="text-[15px] text-[#5F5F61]">
                Hasta
                <input type="date" name="date_to" defaultValue={filters.dateTo} className="mt-2 h-12 w-full rounded-[4px] border border-[#E7BFC9] px-4 text-[16px] text-[#1F1F22] outline-none focus:border-[#9E3659]" />
              </label>
              <div className="md:col-span-2 rounded-[6px] bg-[#FCEDF0] px-4 py-3 text-[14px] text-[#6B6063]">
                <p><strong className="text-[#9E3659]">Opcion Todos:</strong> deja Desde y Hasta vacios.</p>
                <p><strong className="text-[#9E3659]">Opcion por rango:</strong> llena una o ambas fechas para filtrar por fecha de creacion.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 bg-[#F5F5F5] px-8 py-7 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setExportOpen(false)} className="h-13 min-w-[170px] rounded-[2px] border border-[#5F5F61] px-8 text-[17px] font-semibold text-[#5F5F61] transition-colors hover:border-[#9E3659] hover:text-[#9E3659]">Cancelar</button>
              <button className="h-13 min-w-[230px] rounded-[2px] bg-[#9E3659] px-8 text-[17px] font-semibold tracking-wide text-white transition-colors hover:bg-[#84304C]">Descargar CSV</button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

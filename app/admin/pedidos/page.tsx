"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardClock,
  Eye,
  ListFilter,
  Pencil,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import AdminShell from "../components/AdminShell";

const stats = [
  {
    label: "TOTAL PEDIDOS",
    value: "842",
    icon: ShoppingCart,
    note: "+4.2%",
    noteTone: "text-emerald-700",
  },
  {
    label: "PENDIENTES DE ENVIO",
    value: "15",
    icon: ClipboardClock,
    note: "+2 hoy",
    noteTone: "text-red-600",
  },
  {
    label: "EN TRANSITO",
    value: "34",
    icon: Truck,
    note: "Estable",
    noteTone: "text-[#6B6063]",
  },
];

const orders = [
  {
    id: "#BC-82934",
    customer: "Lucia Valencia",
    email: "lucia.v@email.com",
    date: "24 Oct, 2023",
    total: "$124.50",
    status: "ENTREGADO",
    statusClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    id: "#BC-82935",
    customer: "Adrian Mendez",
    email: "a.mendez@cloud.com",
    date: "24 Oct, 2023",
    total: "$89.00",
    status: "EN PREPARACION",
    statusClass: "border-[#E8C1CD] bg-[#FCEDF0] text-[#9E3659]",
  },
  {
    id: "#BC-82936",
    customer: "Elena Rivas",
    email: "elena.rivas@me.com",
    date: "23 Oct, 2023",
    total: "$210.00",
    status: "ENVIADO",
    statusClass: "border-[#D8D8D8] bg-[#F5F5F5] text-[#666666]",
  },
  {
    id: "#BC-82937",
    customer: "Carlos Peralta",
    email: "carlos.p@domain.es",
    date: "23 Oct, 2023",
    total: "$45.20",
    status: "ENTREGADO",
    statusClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
];

export default function AdminOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[number] | null>(null);

  return (
    <AdminShell active="orders" searchPlaceholder="Buscar pedidos, clientes, IDs...">
      <main className={`mx-auto w-full max-w-[1180px] px-4 py-8 md:px-8 ${selectedOrder ? "blur-[3px]" : ""}`}>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#9E3659] lg:hidden">Beauty Cosmetics Admin</p>
            <h2 className="text-[30px] font-bold leading-tight text-[#1F1F22] md:text-[34px]">Gestion de Pedidos</h2>
            <p className="mt-1 text-[17px] text-[#6B6063]">
              Supervisa y procesa las ordenes de tus clientes en tiempo real.
            </p>
          </div>

          <button className="inline-flex h-12 items-center justify-center rounded-[4px] bg-[#9E3659] px-9 text-[15px] font-semibold tracking-wide text-white transition-colors hover:bg-[#84304C]">
            Exportar a excel
          </button>
        </div>

        <div className="mt-12 grid max-w-[900px] gap-6 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="rounded-[8px] border border-[#E7BFC9] bg-white px-7 py-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#F5DDE5] text-[#9E3659]">
                    <Icon size={23} strokeWidth={1.9} />
                  </span>
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
              {["Todos", "Pendientes", "Completados"].map((tab, index) => (
                <button
                  key={tab}
                  className={`h-11 rounded-[8px] px-5 text-[17px] transition-colors ${
                    index === 0 ? "bg-[#9E3659] font-semibold text-white" : "text-[#6B6063] hover:bg-[#FCEDF0]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="inline-flex h-11 items-center gap-3 rounded-[4px] border border-[#E7BFC9] bg-white px-4 text-[16px] text-[#554246]">
                <CalendarDays size={17} strokeWidth={1.8} />
                Ultimos 30 dias
                <ChevronDown size={18} strokeWidth={1.8} className="ml-5 text-[#7A7F8A]" />
              </button>
              <button className="inline-flex h-11 items-center gap-3 rounded-[4px] border border-[#E7BFC9] bg-white px-4 text-[16px] text-[#554246]">
                <ListFilter size={17} strokeWidth={1.8} />
                Mas Filtros
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="bg-[#FAFAFA] text-left text-[16px] font-bold text-[#5F5F61]">
                <tr className="border-b border-[#E7BFC9]">
                  <th className="px-12 py-5">ID Pedido</th>
                  <th className="px-4 py-5">Cliente</th>
                  <th className="px-4 py-5">Fecha</th>
                  <th className="px-4 py-5">Total</th>
                  <th className="px-4 py-5">Estado</th>
                  <th className="px-4 py-5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#E7BFC9] last:border-b-0">
                    <td className="px-12 py-6 text-[17px] font-bold text-[#9E3659]">{order.id}</td>
                    <td className="px-4 py-6">
                      <p className="text-[17px] font-medium leading-tight text-[#2D1F23]">{order.customer}</p>
                      <p className="mt-1 text-[16px] leading-tight text-[#6B6063]">{order.email}</p>
                    </td>
                    <td className="px-4 py-6 text-[17px] text-[#2D1F23]">{order.date}</td>
                    <td className="px-4 py-6 text-[17px] text-[#2D1F23]">{order.total}</td>
                    <td className="px-4 py-6">
                      <span className={`inline-flex rounded-full border px-4 py-1.5 text-[12px] font-bold ${order.statusClass}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex items-center justify-center gap-5 text-[#9E3659]">
                        <button
                          aria-label={`Editar pedido ${order.id}`}
                          onClick={() => setSelectedOrder(order)}
                          className="transition-colors hover:text-[#84304C]"
                        >
                          <Pencil size={22} strokeWidth={1.9} />
                        </button>
                        <Link
                          href={`/admin/pedidos/${order.id.replace("#", "").toLowerCase()}`}
                          aria-label={`Ver pedido ${order.id}`}
                          className="transition-colors hover:text-[#84304C]"
                        >
                          <Eye size={22} strokeWidth={1.9} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-5 px-7 py-7 text-[16px] text-[#6B6063] md:flex-row md:items-center md:justify-between">
            <p>Mostrando 1-10 de 842 pedidos</p>
            <div className="flex items-center gap-3 text-[#554246]">
              <button className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-[#E7BFC9] text-[#D0B8BF]">
                <ChevronLeft size={18} strokeWidth={1.8} />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-[#9E3659] text-white">1</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-[#E7BFC9]">2</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-[#E7BFC9]">3</button>
              <span>...</span>
              <button className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-[#E7BFC9]">85</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-[#E7BFC9] transition-colors hover:text-[#9E3659]">
                <ChevronRight size={18} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-[660px] overflow-hidden rounded-[4px] border border-[#E7BFC9] bg-white shadow-xl">
            <div className="flex items-start justify-between px-8 py-7">
              <div>
                <h3 className="text-[30px] font-bold leading-tight text-[#1F1F22]">Actualizar Estado del Pedido</h3>
                <span className="mt-2 inline-flex rounded-[3px] bg-[#F1EEF0] px-3 py-1 text-[17px] font-bold text-[#9E3659]">
                  {selectedOrder.id}
                </span>
              </div>
              <button
                aria-label="Cerrar modal"
                onClick={() => setSelectedOrder(null)}
                className="text-[#5F5F61] transition-colors hover:text-[#9E3659]"
              >
                <X size={28} strokeWidth={1.8} />
              </button>
            </div>

            <div className="border-y border-[#E7BFC9] px-8 py-8">
              <label htmlFor="order-status" className="text-[15px] text-[#5F5F61]">
                Nuevo Estado
              </label>
              <div className="relative mt-5">
                <select
                  id="order-status"
                  defaultValue="Enviado"
                  className="h-12 w-full appearance-none bg-white px-4 text-[19px] text-[#1F1F22] outline-none"
                >
                  <option>Recibido</option>
                  <option>En preparacion</option>
                  <option>Enviado</option>
                  <option>En transito</option>
                  <option>Entregado</option>
                  <option>Cancelado</option>
                </select>
                <ChevronDown
                  size={22}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 bg-[#F5F5F5] px-8 py-7 sm:flex-row sm:justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="h-13 min-w-[190px] rounded-[2px] border border-[#5F5F61] px-8 text-[17px] font-semibold text-[#5F5F61] transition-colors hover:border-[#9E3659] hover:text-[#9E3659]"
              >
                Cancelar
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="h-13 min-w-[260px] rounded-[2px] bg-[#9E3659] px-8 text-[17px] font-semibold tracking-wide text-white transition-colors hover:bg-[#84304C]"
              >
                Actualizar Estado
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

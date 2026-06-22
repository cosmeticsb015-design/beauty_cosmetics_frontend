import { getAdminOrders } from "../../services/admin";
import type { OrderRow, OrderStat } from "./AdminOrdersClient";

function money(value?: number) {
  return new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" }).format(Number(value || 0));
}

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("es-SV", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "Sin fecha";
}

function fulfillmentStatus(order: { order_status?: string | null; fulfillment_status?: string | null }) {
  return order.fulfillment_status ?? order.order_status ?? "pending_shipping";
}

function deliveryLabel(order: { delivery_type: string; branch?: { name?: string | null } | null; address?: string | null; shipping_rate?: { name?: string | null } | null }) {
  if (order.delivery_type === "pickup") return `Recoger: ${order.branch?.name ?? "Sucursal no definida"}`;
  const address = order.address ?? "Dirección no definida";
  const rate = order.shipping_rate?.name ?? "Zona/Tarifa no definida";
  return `Envío: ${address} · ${rate}`;
}

function statusMeta(status: string) {
  if (status === "shipped") return { label: "ENVIADO", className: "border-blue-200 bg-blue-50 text-blue-700" };
  if (status === "delivered") return { label: "ENTREGADO", className: "border-emerald-200 bg-emerald-50 text-emerald-700" };
  return { label: "PENDIENTE DE ENVIO", className: "border-[#E8C1CD] bg-[#FCEDF0] text-[#9E3659]" };
}

export type OrdersFilters = {
  page: number;
  status: string;
  search: string;
  dateFrom: string;
  dateTo: string;
};

export type OrdersViewModel = {
  stats: OrderStat[];
  orders: OrderRow[];
  totalLabel: string;
  pagination: { page: number; pageCount: number; total: number };
};

export async function buildOrdersViewModel(filters: OrdersFilters): Promise<OrdersViewModel> {
  const { page, status, search, dateFrom, dateTo } = filters;
  const dateFilters = { dateFrom, dateTo };

  const [response, allResponse, pendingResponse, shippedResponse, deliveredResponse] = await Promise.all([
    getAdminOrders({ page, pageSize: 10, status, search, ...dateFilters }),
    getAdminOrders({ page: 1, pageSize: 1, status: "all", search, ...dateFilters }),
    getAdminOrders({ page: 1, pageSize: 1, status: "pending_shipping", search, ...dateFilters }),
    getAdminOrders({ page: 1, pageSize: 1, status: "shipped", search, ...dateFilters }),
    getAdminOrders({ page: 1, pageSize: 1, status: "delivered", search, ...dateFilters }),
  ]);

  const orders: OrderRow[] = response.data.map((order) => {
    const orderStatus = fulfillmentStatus(order);
    const meta = statusMeta(orderStatus);
    const itemCount = order.items?.length ?? 0;
    return {
      id: order.tracking_number || `#${order.id}`,
      documentId: order.documentId,
      customer: order.customer_name,
      email: order.customer_email,
      date: formatDate(order.createdAt),
      total: money(order.total ?? Number(order.subtotal || 0) + Number(order.shipping_cost || 0)),
      status: meta.label,
      orderStatus,
      statusClass: meta.className,
      delivery: deliveryLabel(order),
      itemCount: `${itemCount} ${itemCount === 1 ? "producto" : "productos"}`,
    };
  });

  const pagination = response.meta.pagination ?? { page, pageSize: 10, pageCount: 1, total: orders.length };
  const all = allResponse.meta.pagination?.total ?? 0;
  const pending = pendingResponse.meta.pagination?.total ?? 0;
  const shipped = shippedResponse.meta.pagination?.total ?? 0;
  const delivered = deliveredResponse.meta.pagination?.total ?? 0;

  const stats: OrderStat[] = [
    { label: "TOTAL PEDIDOS", value: String(all), icon: "shopping-cart", note: dateFrom || dateTo ? "Rango aplicado" : "Desde Strapi", noteTone: "text-[#6B6063]" },
    { label: "PENDIENTES DE ENVIO", value: String(pending), icon: "clipboard-clock", note: `${pending} activos`, noteTone: pending ? "text-red-600" : "text-emerald-700" },
    { label: "ENVIADOS", value: String(shipped), icon: "truck", note: `${delivered} entregados`, noteTone: "text-emerald-700" },
  ];

  return {
    stats,
    orders,
    totalLabel: `Mostrando ${orders.length} de ${pagination.total} pedidos`,
    pagination: { page: pagination.page, pageCount: pagination.pageCount, total: pagination.total },
  };
}
import AdminShell from "../components/AdminShell";
import AdminDataError from "../components/AdminDataError";
import AdminOrdersClient, { type OrderRow, type OrderStat } from "./AdminOrdersClient";
import { getAdminOrders } from "../../services/admin";

function money(value?: number) {
  return new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" }).format(Number(value || 0));
}
function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("es-SV", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "Sin fecha";
}
function statusMeta(status: string) {
  if (status === "paid") return { label: "PAGADO", className: "border-emerald-200 bg-emerald-50 text-emerald-700" };
  if (status === "failed") return { label: "FALLIDO", className: "border-red-200 bg-red-50 text-red-700" };
  if (status === "refunded") return { label: "REEMBOLSADO", className: "border-[#D8D8D8] bg-[#F5F5F5] text-[#666666]" };
  return { label: "PENDIENTE", className: "border-[#E8C1CD] bg-[#FCEDF0] text-[#9E3659]" };
}

const validStatuses = ["all", "pending", "paid", "failed", "refunded"] as const;

type SearchParams = Promise<{ page?: string; status?: string; search?: string; saved?: string }>;

export default async function AdminOrdersPage({ searchParams }: { searchParams?: SearchParams }) {
  const query = searchParams ? await searchParams : {};
  const page = Math.max(1, Number(query.page ?? 1) || 1);
  const status = validStatuses.includes(query.status as any) ? query.status! : "all";
  const search = typeof query.search === "string" ? query.search.trim() : "";

  try {
    const [response, pendingResponse, paidResponse, failedResponse] = await Promise.all([
      getAdminOrders({ page, pageSize: 10, status, search }),
      getAdminOrders({ page: 1, pageSize: 1, status: "pending" }),
      getAdminOrders({ page: 1, pageSize: 1, status: "paid" }),
      getAdminOrders({ page: 1, pageSize: 1, status: "failed" }),
    ]);

    const orders: OrderRow[] = response.data.map((order) => {
      const meta = statusMeta(order.payment_status);
      const itemCount = order.items?.length ?? 0;
      return {
        id: order.tracking_number || `#${order.id}`,
        documentId: order.documentId,
        customer: order.customer_name,
        email: order.customer_email,
        date: formatDate(order.createdAt),
        total: money(order.total ?? Number(order.subtotal || 0) + Number(order.shipping_cost || 0)),
        status: meta.label,
        paymentStatus: order.payment_status,
        statusClass: meta.className,
        delivery: order.delivery_type === "pickup" ? `Retiro: ${order.branch?.name ?? "Sucursal"}` : order.shipping_rate?.name ?? "Delivery",
        itemCount: `${itemCount} ${itemCount === 1 ? "producto" : "productos"}`,
      };
    });

    const pagination = response.meta.pagination ?? { page, pageSize: 10, pageCount: 1, total: orders.length };
    const pending = pendingResponse.meta.pagination?.total ?? 0;
    const paid = paidResponse.meta.pagination?.total ?? 0;
    const failed = failedResponse.meta.pagination?.total ?? 0;
    const stats: OrderStat[] = [
      { label: "TOTAL PEDIDOS", value: String(pagination.total), icon: "shopping-cart", note: "Desde Strapi", noteTone: "text-[#6B6063]" },
      { label: "PENDIENTES DE PAGO", value: String(pending), icon: "clipboard-clock", note: `${pending} activos`, noteTone: pending ? "text-red-600" : "text-emerald-700" },
      { label: "PAGADOS", value: String(paid), icon: "truck", note: `${failed} fallidos`, noteTone: failed ? "text-red-600" : "text-emerald-700" },
    ];

    return (
      <AdminOrdersClient
        stats={stats}
        orders={orders}
        totalLabel={`Mostrando ${orders.length} de ${pagination.total} pedidos`}
        pagination={{ page: pagination.page, pageCount: pagination.pageCount, total: pagination.total }}
        filters={{ status, search }}
        saved={query.saved === "1"}
      />
    );
  } catch (error) {
    return (
      <AdminShell active="orders" searchPlaceholder="Buscar pedidos, clientes, IDs...">
        <AdminDataError title="No se pudieron cargar pedidos desde Strapi" error={error} permissions={["Order: find/findOne/update", "Order-item: find/findOne", "Branch: find/findOne", "Shipping-rate: find/findOne", "Product: find/findOne", "Variant-option: find/findOne"]} />
      </AdminShell>
    );
  }
}

import { NextRequest } from "next/server";
import { getAdminOrder, getAdminOrders, type StrapiOrder } from "../../../services/admin";

function money(value?: number) {
  return Number(value || 0).toFixed(2);
}

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("es-SV", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "";
}

function statusLabel(status: string) {
  if (status === "paid") return "Pagado";
  if (status === "failed") return "Pago fallido";
  if (status === "refunded") return "Reembolsado";
  return "Pendiente de pago";
}

function escapeCell(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function fetchAllOrders(params: { status?: string; search?: string; dateFrom?: string; dateTo?: string }) {
  const first = await getAdminOrders({ page: 1, pageSize: 100, ...params });
  const pageCount = first.meta.pagination?.pageCount ?? 1;
  const orders: StrapiOrder[] = [...first.data];
  for (let page = 2; page <= pageCount; page += 1) {
    const response = await getAdminOrders({ page, pageSize: 100, ...params });
    orders.push(...response.data);
  }
  return orders;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const status = params.get("status") || "all";
  const search = params.get("search")?.trim() || undefined;
  const dateFrom = params.get("date_from") || undefined;
  const dateTo = params.get("date_to") || undefined;
  const orderId = params.get("order") || undefined;
  const orders = orderId ? [(await getAdminOrder(orderId)).data] : await fetchAllOrders({ status, search, dateFrom, dateTo });

  const rows: unknown[][] = orders.flatMap((order) => {
    const total = Number(order.total ?? Number(order.subtotal || 0) + Number(order.shipping_cost || 0));
    const base = [
      order.tracking_number || `#${order.id}`,
      formatDate(order.createdAt),
      statusLabel(order.payment_status),
      order.customer_name,
      order.customer_email,
      order.customer_phone,
      order.delivery_type === "pickup" ? "Retiro en sucursal" : "Envio a domicilio",
      order.branch?.name ?? "",
      order.shipping_rate?.name ?? "",
      order.address ?? "",
      money(order.subtotal),
      money(order.shipping_cost),
      money(total),
      order.wompi_transaction_id ?? "",
    ];
    const items = order.items?.length ? order.items : [undefined];
    return items.map((item) => [
      ...base,
      item?.product_name ?? "",
      item?.variant_label ?? item?.variant?.label ?? "",
      item?.quantity ?? "",
      money(item?.unit_price),
      money(Number(item?.unit_price || 0) * Number(item?.quantity || 0)),
      item?.branch_stock?.branch?.name ?? "",
    ]);
  });

  const headers = [
    "Pedido", "Fecha", "Estado de pago", "Cliente", "Email", "Telefono", "Tipo de entrega", "Sucursal", "Tarifa", "Direccion", "Subtotal", "Costo envio", "Total", "Transaccion Wompi", "Producto", "Variante", "Cantidad", "Precio unitario", "Subtotal item", "Stock/Sucursal",
  ];

  const html = `<!doctype html><html><head><meta charset="utf-8" /></head><body><table border="1"><thead><tr>${headers.map((header) => `<th>${escapeCell(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell: unknown) => `<td>${escapeCell(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></body></html>`;
  const suffix = orderId ? `pedido-${orders[0]?.tracking_number ?? orderId}` : dateFrom || dateTo ? `${dateFrom ?? "inicio"}_${dateTo ?? "hoy"}` : "todos";

  return new Response(html, {
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": `attachment; filename="pedidos-${suffix}.xls"`,
      "Cache-Control": "no-store",
    },
  });
}

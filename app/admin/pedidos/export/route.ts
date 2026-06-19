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

function escapeXml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function excelCell(value: unknown, styleId = "Data") {
  return `<Cell ss:StyleID="${styleId}"><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`;
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
      order.instructions ?? order.delivery_instructions ?? order.notes ?? "",
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
    "Pedido", "Fecha", "Estado de pago", "Cliente", "Email", "Telefono", "Tipo de entrega", "Sucursal", "Tarifa", "Direccion", "Instrucciones adicionales", "Subtotal", "Costo envio", "Total", "Transaccion Wompi", "Producto", "Variante", "Cantidad", "Precio unitario", "Subtotal item", "Stock/Sucursal",
  ];

  const title = orderId ? `Pedido ${orders[0]?.tracking_number ?? orderId}` : "Exportacion de pedidos";
  const generatedAt = new Intl.DateTimeFormat("es-SV", { dateStyle: "medium", timeStyle: "short" }).format(new Date());
  const worksheetRows = [
    `<Row ss:Height="24"><Cell ss:MergeAcross="${headers.length - 1}" ss:StyleID="Title"><Data ss:Type="String">${escapeXml(title)}</Data></Cell></Row>`,
    `<Row><Cell ss:MergeAcross="${headers.length - 1}" ss:StyleID="Meta"><Data ss:Type="String">Generado: ${escapeXml(generatedAt)}${dateFrom || dateTo ? ` | Rango: ${escapeXml(dateFrom ?? "inicio")} - ${escapeXml(dateTo ?? "hoy")}` : ""}</Data></Cell></Row>`,
    `<Row>${headers.map((header) => excelCell(header, "Header")).join("")}</Row>`,
    ...rows.map((row) => `<Row>${row.map((cell) => excelCell(cell)).join("")}</Row>`),
  ];

  const workbook = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">
  <Styles>
    <Style ss:ID="Title"><Font ss:Bold="1" ss:Size="14"/><Interior ss:Color="#F5DDE5" ss:Pattern="Solid"/></Style>
    <Style ss:ID="Meta"><Font ss:Color="#6B6063"/><Interior ss:Color="#FAFAFA" ss:Pattern="Solid"/></Style>
    <Style ss:ID="Header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#9E3659" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
    <Style ss:ID="Data"><Alignment ss:Vertical="Top" ss:WrapText="1"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E7BFC9"/></Borders></Style>
  </Styles>
  <Worksheet ss:Name="Pedidos">
    <Table>
      ${headers.map(() => '<Column ss:Width="120"/>').join("\n      ")}
      ${worksheetRows.join("\n      ")}
    </Table>
  </Worksheet>
</Workbook>`;
  const suffix = orderId ? `pedido-${orders[0]?.tracking_number ?? orderId}` : dateFrom || dateTo ? `${dateFrom ?? "inicio"}_${dateTo ?? "hoy"}` : "todos";

  return new Response(workbook, {
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": `attachment; filename="pedidos-${suffix}.xls"`,
      "Cache-Control": "no-store",
    },
  });
}

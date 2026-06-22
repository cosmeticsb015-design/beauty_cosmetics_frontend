import { NextRequest, NextResponse } from "next/server";
import { buildOrdersViewModel } from "../orders-view-model";

const validStatuses = ["all", "pending_shipping", "shipped", "delivered"];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
  const rawStatus = params.get("status") ?? "all";
  const status = validStatuses.includes(rawStatus) ? rawStatus : "all";
  const search = (params.get("search") ?? "").trim();
  const dateFrom = params.get("date_from") ?? "";
  const dateTo = params.get("date_to") ?? "";

  try {
    const viewModel = await buildOrdersViewModel({ page, status, search, dateFrom, dateTo });
    return NextResponse.json(viewModel);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudieron cargar los pedidos." },
      { status: 500 }
    );
  }
}
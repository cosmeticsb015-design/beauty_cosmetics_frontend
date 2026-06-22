import { NextResponse } from "next/server";
import { getAdminOrdersWatermark } from "../../../services/admin";

export async function GET() {
  try {
    const response = await getAdminOrdersWatermark();
    const latestPaidOrder = response.data[0];
    return NextResponse.json({
      lastPaidAt: latestPaidOrder?.updatedAt ?? null,
      paidCount: response.meta.pagination?.total ?? 0,
    });
  } catch {
    // Si Strapi no responde, no rompemos el panel: simplemente no hay novedad que reportar.
    return NextResponse.json({ lastPaidAt: null, paidCount: 0 });
  }
}
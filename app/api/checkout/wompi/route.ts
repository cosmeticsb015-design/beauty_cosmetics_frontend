import { NextResponse } from "next/server";
import type { CheckoutOrder, CreateCheckoutOrderPayload, WompiPaymentLinkResponse } from "../../../services/checkout";
import type { StrapiResponse } from "../../../services/producst";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337").replace(/\/$/, "");
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? process.env.STRAPI_API_KEY ?? process.env.STRAPI_TOKEN;

type CheckoutPaymentRequest = {
  order: CreateCheckoutOrderPayload;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function strapiPost<T>(endpoint: string, data?: unknown): Promise<T> {
  const headers = new Headers({ "Content-Type": "application/json" });

  if (STRAPI_TOKEN) {
    headers.set("Authorization", `Bearer ${STRAPI_TOKEN}`);
  }

  const response = await fetch(`${API_URL}/api/${endpoint}`, {
    method: "POST",
    headers,
    body: data === undefined ? undefined : JSON.stringify(data),
    cache: "no-store",
  });

  if (!response.ok) {
    let message = response.statusText;

    try {
      const error = await response.json();
      message = error?.error?.message ?? error?.message ?? message;
    } catch { }

    if (response.status === 403 && !STRAPI_TOKEN) {
      throw new Error(`Strapi POST ${endpoint}: ${message}. Habilita los permisos públicos del endpoint de checkout/órdenes en Strapi o configura STRAPI_API_TOKEN en el frontend.`);
    }

    throw new Error(`Strapi POST ${endpoint}: ${message}`);
  }

  return response.json();
}

export async function POST(request: Request) {
  let payload: CheckoutPaymentRequest;

  try {
    payload = await request.json();
  } catch {
    return jsonError("El payload del checkout no es válido.");
  }

  const orderPayload = payload.order;

  if (!orderPayload?.customer_name || !orderPayload.customer_email || !orderPayload.customer_phone) {
    return jsonError("Completa los datos del cliente antes de pagar.");
  }

  if (!orderPayload.items?.length) {
    return jsonError("No hay productos válidos para crear la orden.");
  }

  try {
    const orderResponse = await strapiPost<StrapiResponse<CheckoutOrder>>("orders", { data: orderPayload });
    const paymentLink = await strapiPost<WompiPaymentLinkResponse>(`orders/${orderResponse.data.documentId}/wompi-payment-link`);

    return NextResponse.json({ order: orderResponse.data, payment: paymentLink.data });
  } catch (error) {
    console.error("Error creating Wompi checkout from API route:", error);
    return jsonError(error instanceof Error ? error.message : "No se pudo iniciar el pago con Wompi.", 502);
  }
}

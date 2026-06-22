import { NextResponse } from "next/server";
import type { CheckoutOrder, CreateCheckoutOrderPayload, WompiPaymentLinkResponse } from "@/src/shared/services/checkout";
import type { StrapiResponse } from "@/src/shared/services/producst";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337").replace(/\/$/, "");
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? process.env.STRAPI_API_KEY ?? process.env.STRAPI_TOKEN;

type CheckoutPaymentRequest = {
  order: CreateCheckoutOrderPayload;
};

class StrapiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "StrapiRequestError";
    this.status = status;
  }
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function strapiPost<T>(endpoint: string, data?: unknown, idempotencyKey?: string): Promise<T> {
  const headers = new Headers({ "Content-Type": "application/json" });

  if (idempotencyKey) {
    headers.set("Idempotency-Key", idempotencyKey);
  }

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
      throw new StrapiRequestError(`Strapi POST ${endpoint}: ${message}. Habilita los permisos públicos del endpoint de checkout/órdenes en Strapi o configura STRAPI_API_TOKEN en el frontend.`, response.status);
    }

    throw new StrapiRequestError(message, response.status);
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

  const requestIdempotencyKey = request.headers.get("Idempotency-Key") ?? request.headers.get("X-Idempotency-Key");
  const orderPayload = payload.order;
  const checkoutAttemptId = requestIdempotencyKey ?? orderPayload?.checkout_attempt_id;

  if (!orderPayload?.customer_name || !orderPayload.customer_email || !orderPayload.customer_phone) {
    return jsonError("Completa los datos del cliente antes de pagar.");
  }

  if (!orderPayload.items?.length) {
    return jsonError("No hay productos válidos para crear la orden.");
  }

  try {
    const orderResponse = await strapiPost<StrapiResponse<CheckoutOrder>>("orders", { data: { ...orderPayload, ...(checkoutAttemptId ? { checkout_attempt_id: checkoutAttemptId } : {}) } }, checkoutAttemptId);
    const paymentLink = await strapiPost<WompiPaymentLinkResponse>(`orders/${orderResponse.data.documentId}/wompi-payment-link`, undefined, checkoutAttemptId);

    return NextResponse.json({ order: orderResponse.data, payment: paymentLink.data });
  } catch (error) {
    console.error("Error creating Wompi checkout from API route:", error);
    const status = error instanceof StrapiRequestError ? error.status : 502;
    return jsonError(error instanceof Error ? error.message : "No se pudo iniciar el pago con Wompi.", status);
  }
}

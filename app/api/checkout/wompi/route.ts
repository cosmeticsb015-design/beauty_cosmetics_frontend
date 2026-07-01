import { NextResponse } from "next/server";
import qs from "qs";
import type { CheckoutOrder, CreateCheckoutOrderPayload, WompiPaymentLink } from "@/src/shared/services/checkout";
import type { StrapiResponse } from "@/src/shared/services/producst";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337").replace(/\/$/, "");
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? process.env.STRAPI_API_KEY ?? process.env.STRAPI_TOKEN;

type CheckoutPaymentRequest = {
  order: CreateCheckoutOrderPayload;
};

// La orden ahora puede venir como un payment-attempt (flujo nuevo) o, en casos
// de compatibilidad, como una orden ya promovida. Tipamos de forma flexible
// para no pelear con TypeScript mientras seguimos exponiendo lo que el
// frontend realmente consume (documentId, tracking_number, payment_status).
type CheckoutAttemptResponseData = CheckoutOrder & {
  documentId: string;
  payment_status?: string;
  is_payment_attempt?: boolean;
  wompi_payment?: {
    payment_link_id?: number;
    payment_url?: string;
    qr_url?: string;
  };
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
      message = error?.error?.message ?? error?.error ?? error?.message ?? message;
    } catch { }

    if (response.status === 403 && !STRAPI_TOKEN) {
      throw new StrapiRequestError(`Strapi POST ${endpoint}: ${message}. Habilita los permisos públicos del endpoint de checkout/órdenes en Strapi o configura STRAPI_API_TOKEN en el frontend.`, response.status);
    }

    throw new StrapiRequestError(message, response.status);
  }

  return response.json();
}

async function strapiGet<T>(endpoint: string): Promise<T> {
  const headers = new Headers();
  if (STRAPI_TOKEN) headers.set("Authorization", `Bearer ${STRAPI_TOKEN}`);

  const response = await fetch(`${API_URL}/api/${endpoint}`, { headers, cache: "no-store" });
  if (!response.ok) throw new StrapiRequestError(response.statusText, response.status);
  return response.json();
}

async function strapiPut<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
  const headers = new Headers({ "Content-Type": "application/json" });
  if (STRAPI_TOKEN) headers.set("Authorization", `Bearer ${STRAPI_TOKEN}`);

  const response = await fetch(`${API_URL}/api/${endpoint}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
    cache: "no-store",
  });
  if (!response.ok) throw new StrapiRequestError(response.statusText, response.status);
  return response.json();
}

async function deactivateSoldOutProducts(items: CreateCheckoutOrderPayload["items"]) {
  if (!STRAPI_TOKEN || !items.length) return;

  const stockPopulateQuery = qs.stringify({
    fields: ["quantity"],
    populate: { variant: { fields: ["documentId", "active"], populate: { product: { fields: ["documentId", "active"] } } } },
  }, { encodeValuesOnly: true });

  for (const item of items) {
    try {
      const stockResponse = await strapiGet<StrapiResponse<{
        quantity?: number | string | null;
        variant?: { documentId?: string; active?: boolean; product?: { documentId?: string; active?: boolean } | null } | null;
      }>>(`branch-stocks/${item.branch_stock}?${stockPopulateQuery}`);
      const stock = stockResponse.data;
      const variantDocumentId = stock.variant?.documentId;
      const productDocumentId = stock.variant?.product?.documentId;

      if (Number(stock.quantity || 0) > 0 || !variantDocumentId || !productDocumentId) continue;

      if (stock.variant?.active !== false) await strapiPut(`variant-options/${variantDocumentId}`, { active: false });

      const productQuery = qs.stringify({
        fields: ["documentId", "active"],
        populate: { variants: { fields: ["documentId"], populate: { stocks: { fields: ["quantity"] } } } },
      }, { encodeValuesOnly: true });
      const productResponse = await strapiGet<StrapiResponse<{
        active?: boolean;
        variants?: { stocks?: { quantity?: number | string | null }[] }[];
      }>>(`products/${productDocumentId}?${productQuery}`);
      const totalStock = (productResponse.data.variants ?? []).reduce(
        (sum, variant) => sum + (variant.stocks ?? []).reduce((stockSum, entry) => stockSum + Number(entry.quantity || 0), 0),
        0
      );

      if (productResponse.data.active !== false && totalStock <= 0) {
        await strapiPut(`products/${productDocumentId}`, { active: false });
      }
    } catch (error) {
      console.warn("No se pudo sincronizar estado de inventario agotado:", error);
    }
  }
}

// Construye el objeto de pago que consume el frontend (checkoutPayment.payment.payment_url)
// a partir del wompi_payment que ya viene incluido en la respuesta de creación.
function buildPaymentFromAttempt(attempt: CheckoutAttemptResponseData): WompiPaymentLink | null {
  if (!attempt.wompi_payment?.payment_url) return null;

  return {
    order: attempt.documentId,
    payment_link_id: attempt.wompi_payment.payment_link_id ?? 0,
    payment_url: attempt.wompi_payment.payment_url,
    qr_url: attempt.wompi_payment.qr_url,
  };
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
    // Llamada ÚNICA: el backend ya crea el intento de pago Y genera el enlace
    // de Wompi en esta misma respuesta (campo `wompi_payment`). Ya NO se hace
    // una segunda llamada a /orders/:id/wompi-payment-link en el flujo normal,
    // porque ese endpoint quedó solo como ruta de reintento manual.
    const attemptResponse = await strapiPost<StrapiResponse<CheckoutAttemptResponseData>>(
      "orders",
      { data: { ...orderPayload, ...(checkoutAttemptId ? { checkout_attempt_id: checkoutAttemptId } : {}) } },
      checkoutAttemptId
    );

    const attempt = attemptResponse.data;
    await deactivateSoldOutProducts(orderPayload.items);
    let payment = buildPaymentFromAttempt(attempt);

    // Defensivo: si por alguna razón el enlace no vino incluido (no debería
    // pasar en el flujo feliz), reintentamos UNA vez contra el endpoint
    // dedicado antes de fallar, usando el documentId que sí acabamos de crear.
    if (!payment) {
      const retryResponse = await strapiPost<StrapiResponse<CheckoutAttemptResponseData>>(
        `orders/${attempt.documentId}/wompi-payment-link`,
        undefined,
        checkoutAttemptId
      );
      const retryData = retryResponse.data as CheckoutAttemptResponseData & {
        payment_link_id?: number;
        payment_url?: string;
        qr_url?: string;
      };

      payment = buildPaymentFromAttempt(retryResponse.data) ?? buildPaymentFromAttempt({
        ...attempt,
        wompi_payment: {
          payment_link_id: retryData.payment_link_id,
          payment_url: retryData.payment_url,
          qr_url: retryData.qr_url,
        },
      });
    }

    if (!payment?.payment_url) {
      throw new Error("Wompi no devolvió una URL de pago válida.");
    }

    return NextResponse.json({ order: attempt, payment });
  } catch (error) {
    console.error("Error creating Wompi checkout from API route:", error);
    const status = error instanceof StrapiRequestError ? error.status : 502;
    return jsonError(error instanceof Error ? error.message : "No se pudo iniciar el pago con Wompi.", status);
  }
}

import "server-only";
import qs from "qs";
import { cookies } from "next/headers";
import type { ProductImageRelation, StrapiBrand, StrapiCategory, StrapiImage, StrapiProduct, StrapiResponse, StrapiVariantOption } from "./producst";

import { ADMIN_SESSION_COOKIE } from "@/src/shared/lib/admin-auth";
export { ADMIN_SESSION_COOKIE };
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
const baseUrl = API_URL.replace(/\/$/, "");

export type AdminListParams = { page?: number; pageSize?: number; search?: string; status?: string; category?: string; availability?: string; dateFrom?: string; dateTo?: string };
export type AdminMutationState = { ok: boolean; message: string; id?: string };
export type StrapiUploadFile = { id: number; documentId?: string; url: string; name: string; mime?: string; size?: number };

export type StrapiStock = { id: number; documentId: string; quantity: number; reserved?: number; branch?: StrapiBranch; variant?: StrapiVariantOption & { product?: StrapiProduct } };
export type StrapiBranch = { id: number; documentId: string; name: string; address: string; schedule?: string | null; notes?: string | null; active: boolean; stocks?: StrapiStock[] };
export type StrapiShippingRate = { id: number; documentId: string; name: string; description?: string | null; cost: number; active: boolean };
export type StrapiOrderItem = { id: number; documentId?: string; product_name: string; variant_label?: string | null; quantity: number; unit_price: number; product?: StrapiProduct | null; variant?: StrapiVariantOption | null; branch_stock?: StrapiStock | null };
export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderFulfillmentStatus = "pending_shipping" | "shipped" | "delivered";

export type StrapiOrder = {
  id: number; documentId: string; attributes?: Partial<Omit<StrapiOrder, "attributes">>; tracking_number: string; customer_name: string; customer_email: string; customer_phone: string;
  delivery_type: "delivery" | "pickup"; address?: string | null; instructions?: string | null; delivery_instructions?: string | null; notes?: string | null; subtotal: number; shipping_cost: number; total?: number;
  payment_status: OrderPaymentStatus; internal_payment_status?: OrderPaymentStatus | null; wompi_payment_status?: OrderPaymentStatus | string | null;
  order_status?: OrderFulfillmentStatus | string | null; fulfillment_status?: OrderFulfillmentStatus | string | null;
  wompi_transaction_id?: string | null; wompi_transaction_status?: string | null; wompi_payment_method?: string | null;
  wompi_authorization_code?: string | null; wompi_transaction_message?: string | null; expires_at?: string; createdAt?: string; updatedAt?: string;
  branch?: StrapiBranch | null; shipping_rate?: StrapiShippingRate | null; items?: StrapiOrderItem[];
};
export type HomeBannerDisplayScope = "desktop_and_mobile" | "desktop_only" | "mobile_only";
export type StrapiHomeBanner = { id?: number; name: string; home_position: number; destination_url?: string | null; display_scope: HomeBannerDisplayScope; active?: boolean; desktop_image?: StrapiImage | null; mobile_image?: StrapiImage | null };
export type StrapiStoreConfig = { id: number; documentId?: string; whatsapp_number?: string | null; notification_email?: string | null; home_banners?: StrapiHomeBanner[] };

export function getAdminTokenFromCookieStore(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
}

export async function getAdminToken() {
  return getAdminTokenFromCookieStore(await cookies());
}

export function getStrapiMediaUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${baseUrl.replace(/\/api\/?$/, "")}${url}`;
}

async function adminRequest<T>(endpoint: string, init: RequestInit = {}) {
  const token = await getAdminToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${baseUrl}/api/${endpoint.replace(/^\//, "")}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    let message = response.statusText;
    try {
      const payload = await response.json();
      message = payload?.error?.message ?? payload?.message ?? message;
    } catch {}
    throw new Error(`Strapi ${init.method ?? "GET"} ${endpoint}: ${message}`);
  }
  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

const withPagination = ({ page = 1, pageSize = 10 }: AdminListParams) => ({ pagination: { page, pageSize } });
const productPopulate = {
  brand: { fields: ["name", "slug", "active"] },
  category: { fields: ["name", "slug", "active"] },
  variants: {
    fields: ["label", "value", "active", "price_override"],
    populate: {
      stocks: { populate: { branch: { fields: ["name", "address", "active"] } } },
      images: { sort: ["sort_order:asc"], populate: { image: { fields: ["url", "formats", "alternativeText"] } } },
    },
  },
  images: { sort: ["sort_order:asc"], populate: { image: { fields: ["url", "formats", "alternativeText"] } } },
};

export async function getAdminProducts(params: AdminListParams = {}) {
  const filters: Record<string, unknown> = {};
  if (params.search) filters.name = { $containsi: params.search };
  if (params.category && params.category !== "all") filters.category = { documentId: { $eq: params.category } };
  if (params.status === "active") filters.active = { $eq: true };
  if (params.status === "inactive") filters.active = { $eq: false };
  if (params.availability === "in_stock") filters.variants = { stocks: { quantity: { $gt: 0 } } };
  if (params.availability === "out_of_stock") filters.variants = { stocks: { quantity: { $eq: 0 } } };
  if (params.availability === "low_stock") filters.variants = { stocks: { quantity: { $gt: 0, $lte: 10 } } };
  const query = qs.stringify({
    ...withPagination(params),
    sort: ["createdAt:desc"],
    filters: Object.keys(filters).length ? filters : undefined,
    fields: ["name", "slug", "description", "price", "active", "featured", "createdAt", "updatedAt"],
    populate: productPopulate,
  }, { encodeValuesOnly: true });
  return adminRequest<StrapiResponse<StrapiProduct[]>>(`products?${query}`);
}

export async function getAdminProduct(id: string) {
  const query = qs.stringify({ populate: productPopulate }, { encodeValuesOnly: true });
  return adminRequest<StrapiResponse<StrapiProduct & { variants?: (StrapiVariantOption & { stocks?: StrapiStock[]; images?: ProductImageRelation[] })[] }>>(`products/${id}?${query}`);
}

export async function getAdminVariant(id: string) {
  const query = qs.stringify({
    populate: {
      product: { fields: ["name", "slug", "price", "active"] },
      stocks: { populate: { branch: { fields: ["name", "address", "active"] } } },
      images: { sort: ["sort_order:asc"], populate: { image: { fields: ["url", "formats", "alternativeText"] } } },
    },
  }, { encodeValuesOnly: true });
  return adminRequest<StrapiResponse<StrapiVariantOption & { product?: StrapiProduct; stocks?: StrapiStock[]; images?: ProductImageRelation[] }>>(`variant-options/${id}?${query}`);
}

export async function getAdminBrands() {
  const query = qs.stringify({ pagination: { page: 1, pageSize: 100 }, sort: ["name:asc"], fields: ["name", "slug", "active"], populate: { products: { fields: ["documentId"] } } }, { encodeValuesOnly: true });
  return adminRequest<StrapiResponse<(StrapiBrand & { products?: StrapiProduct[] })[]>>(`brands?${query}`);
}

export async function getAdminCategories() {
  const query = qs.stringify({ pagination: { page: 1, pageSize: 100 }, sort: ["name:asc"], fields: ["name", "slug", "active"], populate: { parent: { fields: ["name", "slug"] }, children: { fields: ["name", "slug", "active"] }, products: { fields: ["documentId"] } } }, { encodeValuesOnly: true });
  return adminRequest<StrapiResponse<(StrapiCategory & { products?: StrapiProduct[] })[]>>(`categories?${query}`);
}

export async function getAdminOrders(params: AdminListParams = {}) {
  const filters: Record<string, unknown> = {};
  if (params.search) {
    filters.$or = [
      { tracking_number: { $containsi: params.search } },
      { customer_name: { $containsi: params.search } },
      { customer_email: { $containsi: params.search } },
      { customer_phone: { $containsi: params.search } },
    ];
  }
  if (params.status && params.status !== "all") {
    filters.fulfillment_status = { $eq: params.status };
  }
  if (params.dateFrom || params.dateTo) {
    filters.createdAt = {
      ...(params.dateFrom ? { $gte: `${params.dateFrom}T00:00:00.000Z` } : {}),
      ...(params.dateTo ? { $lte: `${params.dateTo}T23:59:59.999Z` } : {}),
    };
  }
  const query = qs.stringify({
    ...withPagination(params),
    sort: ["createdAt:desc"],
    filters: Object.keys(filters).length ? filters : undefined,
    populate: {
      branch: { fields: ["name", "address", "active"] },
      shipping_rate: { fields: ["name", "description", "cost", "active"] },
      items: { populate: { product: { fields: ["name", "slug", "price"], populate: { images: { sort: ["sort_order:asc"], populate: { image: { fields: ["url", "formats", "alternativeText"] } } } } }, variant: { fields: ["label", "value", "price_override"] }, branch_stock: { populate: { branch: true } } } },
    },
  }, { encodeValuesOnly: true });
  return adminRequest<StrapiResponse<StrapiOrder[]>>(`orders?${query}`);
}

export async function getAdminOrdersWatermark() {
  const query = qs.stringify({
    filters: { payment_status: { $eq: "paid" } },
    sort: ["updatedAt:desc"],
    pagination: { page: 1, pageSize: 1 },
    fields: ["updatedAt"],
  }, { encodeValuesOnly: true });
  return adminRequest<StrapiResponse<StrapiOrder[]>>(`orders?${query}`);
}

export async function getAdminOrder(id: string) {
  const query = qs.stringify({ populate: { branch: true, shipping_rate: true, items: { populate: { product: { populate: productPopulate }, variant: true, branch_stock: { populate: { branch: true } } } } } }, { encodeValuesOnly: true });
  return adminRequest<StrapiResponse<StrapiOrder>>(`orders/${id}?${query}`);
}

export async function getAdminBranches(params: AdminListParams = {}) {
  const filters: Record<string, unknown> = {};
  if (params.status === "active") filters.active = { $eq: true };
  if (params.status === "inactive") filters.active = { $eq: false };
  const query = qs.stringify({
    pagination: { page: params.page ?? 1, pageSize: params.pageSize ?? 10 },
    sort: ["name:asc"],
    filters: Object.keys(filters).length ? filters : undefined,
    fields: ["name", "address", "schedule", "notes", "active"],
    populate: { stocks: { fields: ["quantity", "reserved"] } },
  }, { encodeValuesOnly: true });
  return adminRequest<StrapiResponse<StrapiBranch[]>>(`branches?${query}`);
}

export async function getAdminBranch(id: string) {
  const query = qs.stringify({ populate: { stocks: { populate: { variant: { populate: { product: { fields: ["name", "slug"] } } } } } } }, { encodeValuesOnly: true });
  return adminRequest<StrapiResponse<StrapiBranch>>(`branches/${id}?${query}`);
}

export async function getAdminShippingRates() {
  const query = qs.stringify({ pagination: { page: 1, pageSize: 100 }, sort: ["name:asc"], fields: ["name", "description", "cost", "active"] }, { encodeValuesOnly: true });
  return adminRequest<StrapiResponse<StrapiShippingRate[]>>(`shipping-rates?${query}`);
}

export async function getAdminStoreConfig() {
  try {
    return await adminRequest<StrapiResponse<StrapiStoreConfig>>("store-config?populate[home_banners][populate][0]=desktop_image&populate[home_banners][populate][1]=mobile_image");
  } catch (error) {
    if (error instanceof Error && error.message.includes("Not Found")) {
      return { data: { id: 0, whatsapp_number: null, notification_email: null, home_banners: [] }, meta: {} } satisfies StrapiResponse<StrapiStoreConfig>;
    }
    throw error;
  }
}


export async function uploadAdminFile(file: File) {
  const body = new FormData();
  body.append("files", file);
  return adminRequest<StrapiUploadFile[]>("upload", { method: "POST", body });
}

export async function createEntity<T>(collection: string, data: Record<string, unknown>) {
  return adminRequest<StrapiResponse<T>>(`${collection}`, { method: "POST", body: JSON.stringify({ data }) });
}
export async function updateEntity<T>(collection: string, id: string, data: Record<string, unknown>) {
  return adminRequest<StrapiResponse<T>>(id ? `${collection}/${id}` : collection, { method: "PUT", body: JSON.stringify({ data }) });
}
export async function deleteEntity<T>(collection: string, id: string) {
  return adminRequest<StrapiResponse<T>>(`${collection}/${id}`, { method: "DELETE" });
}
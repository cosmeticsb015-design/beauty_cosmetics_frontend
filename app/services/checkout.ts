import qs from "qs";
import { strapi } from "../lib/api";
import type { StrapiResponse } from "./producst";

export interface CheckoutBranch {
  id: number;
  documentId: string;
  name: string;
  address: string;
  schedule?: string | null;
  notes?: string | null;
  active: boolean;
}


export interface CheckoutBranchStock {
  id: number;
  documentId: string;
  quantity: number;
  variant?: {
    id: number;
    documentId: string;
    label: string;
    value: string;
    price_override?: number | string | null;
    product?: { id: number; documentId: string; name: string; price: number | string };
  } | null;
  branch?: CheckoutBranch | null;
}

export interface CreateCheckoutOrderItem {
  productDocumentId: string;
  variantDocumentId?: string | null;
  quantity: number;
}

export interface CreateCheckoutOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_type: "delivery" | "pickup";
  address?: string;
  branch?: string | null;
  shipping_rate?: string | null;
  shipping_cost: number;
  items: { branch_stock: string; quantity: number }[];
}

export interface CheckoutOrder {
  id: number;
  documentId: string;
  tracking_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_type: "delivery" | "pickup";
  address?: string | null;
  subtotal: number;
  shipping_cost: number;
  payment_status: "pending" | "paid" | "failed" | "refunded";
}

export interface WompiPaymentLinkResponse {
  data: WompiPaymentLink;
}

export interface WompiPaymentLink {
  order: string;
  payment_link_id: number;
  payment_url?: string;
  qr_url?: string;
}

export interface CheckoutPaymentResponse {
  order: CheckoutOrder;
  payment: WompiPaymentLink;
}

export interface CheckoutShippingRate {
  id: number;
  documentId: string;
  name: string;
  description?: string | null;
  cost: number;
  active: boolean;
}

export const getCheckoutBranches = async (): Promise<StrapiResponse<CheckoutBranch[]>> => {
  const query = qs.stringify(
    {
      pagination: { page: 1, pageSize: 100 },
      sort: ["name:asc"],
      filters: { active: { $eq: true } },
      fields: ["name", "address", "schedule", "notes", "active"],
    },
    { encodeValuesOnly: true }
  );

  return strapi.get<StrapiResponse<CheckoutBranch[]>>(`branches?${query}`);
};

export const getCheckoutShippingRates = async (): Promise<StrapiResponse<CheckoutShippingRate[]>> => {
  const query = qs.stringify(
    {
      pagination: { page: 1, pageSize: 100 },
      sort: ["cost:asc"],
      filters: { active: { $eq: true } },
      fields: ["name", "description", "cost", "active"],
    },
    { encodeValuesOnly: true }
  );

  return strapi.get<StrapiResponse<CheckoutShippingRate[]>>(`shipping-rates?${query}`);
};


export const getCheckoutBranchStocks = async (items: CreateCheckoutOrderItem[], branchDocumentId?: string): Promise<CheckoutBranchStock[]> => {
  const productIds = Array.from(new Set(items.map((item) => item.productDocumentId).filter(Boolean)));
  const filters: Record<string, unknown> = {
    quantity: { $gt: 0 },
    variant: { product: { documentId: { $in: productIds } } },
  };

  if (branchDocumentId) {
    filters.branch = { documentId: { $eq: branchDocumentId } };
  }

  const query = qs.stringify(
    {
      pagination: { page: 1, pageSize: 200 },
      filters,
      populate: {
        branch: { fields: ["name", "address", "schedule", "notes", "active"] },
        variant: {
          fields: ["label", "value", "price_override", "active"],
          populate: { product: { fields: ["name", "price", "active"] } },
        },
      },
      fields: ["quantity"],
    },
    { encodeValuesOnly: true }
  );

  const response = await strapi.get<StrapiResponse<CheckoutBranchStock[]>>(`branch-stocks?${query}`);
  return response.data || [];
};

export const createCheckoutPayment = async (order: CreateCheckoutOrderPayload): Promise<CheckoutPaymentResponse> => {
  const response = await fetch("/api/checkout/wompi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order }),
  });

  if (!response.ok) {
    let message = response.statusText;

    try {
      const error = await response.json();
      message = error?.error ?? error?.message ?? message;
    } catch { }

    throw new Error(message);
  }

  return response.json();
};

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

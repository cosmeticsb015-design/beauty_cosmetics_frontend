import { strapi } from "../lib/api";
import type { StrapiResponse } from "./producst";

export type PublicStoreConfig = {
  id: number;
  documentId?: string;
  whatsapp_number?: string | null;
  notification_email?: string | null;
};

export async function getPublicStoreConfig() {
  try {
    return await strapi.get<StrapiResponse<PublicStoreConfig>>("store-config", {
      next: { revalidate: 60 },
    });
  } catch (error) {
    console.warn("Could not load public store config:", error);
    return { data: null, meta: {} } satisfies StrapiResponse<PublicStoreConfig | null>;
  }
}

import { strapi } from "@/src/shared/lib/api";
import type { StrapiImage, StrapiResponse } from "./producst";

export type HomeBanner = {
  id?: number;
  name: string;
  home_position: number;
  destination_url?: string | null;
  display_scope: "desktop_and_mobile" | "desktop_only" | "mobile_only";
  active?: boolean;
  desktop_image?: StrapiImage | null;
  mobile_image?: StrapiImage | null;
};

export type PublicStoreConfig = {
  id: number;
  documentId?: string;
  whatsapp_number?: string | null;
  notification_email?: string | null;
  home_banners?: HomeBanner[];
};

export async function getPublicStoreConfig() {
  try {
    return await strapi.get<StrapiResponse<PublicStoreConfig>>("store-config/public", {
      next: { revalidate: 60 },
    });
  } catch {
    return { data: null, meta: {} } satisfies StrapiResponse<PublicStoreConfig | null>;
  }
}

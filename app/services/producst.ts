import { strapi } from "../lib/api";
import qs from "qs";

// Define TypeScript interfaces for our Strapi entities to ensure type safety
export interface StrapiImage {
    id: number;
    documentId: string;
    name: string;
    url: string;
    alternativeText?: string | null;
    formats?: any;
}

export interface ProductImageRelation {
    id: number;
    documentId: string;
    sort_order: number;
    image?: StrapiImage;
}

export interface StrapiBrand {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    active: boolean;
}

export interface StrapiCategory {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    active: boolean;
    parent?: StrapiCategory | null;
    children?: StrapiCategory[];
}

export interface StrapiProduct {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    active: boolean;
    featured: boolean;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    brand?: StrapiBrand;
    category?: StrapiCategory;
    images?: ProductImageRelation[];
}

export interface StrapiResponse<T> {
    data: T;
    meta: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}
export interface GetProductsParams {
    page?: number;
    pageSize?: number;
    categorySlug?: string;
    brandNames?: string[];
    featured?: boolean;
    sort?: "price:asc" | "price:desc" | "createdAt:desc" | "createdAt:asc";
    search?: string;
}
export interface StrapiVariantOption {
    id: number;
    documentId: string;
    label: string;
    value: string;
    price_override?: number;
    active?: boolean;
    images?: ProductImageRelation[];
}

export const getProducts = async (
    params: GetProductsParams = {}
): Promise<StrapiResponse<StrapiProduct[]>> => {
    const { page = 1, pageSize = 12, categorySlug, brandNames, sort, search } = params;

    const filters: Record<string, any> = {};

    if (categorySlug && categorySlug !== "all") {
        filters.category = { slug: { $eq: categorySlug } };
    }

    if (brandNames && brandNames.length > 0) {
        filters.brand = { name: { $in: brandNames } };
    }

    if (typeof params.featured === "boolean") {
        filters.featured = { $eq: params.featured };
    }

    filters.active = { $eq: true };

    if (search) {
        filters.name = { $containsi: search };
    }

    const query = qs.stringify(
        {
            pagination: { page, pageSize },
            filters,
            ...(sort ? { sort } : {}),
            populate: {
                brand: {
                    fields: ["id", "documentId", "name", "slug"],
                },
                category: {
                    fields: ["id", "documentId", "name", "slug"],
                },
                images: {
                    sort: ["sort_order:asc"],
                    populate: {
                        image: {
                            fields: ["url", "formats", "width", "height", "alternativeText"],
                        },
                    },
                },
            },
            fields: ["name", "slug", "description", "price", "active", "featured", "createdAt"],
        },
        { encodeValuesOnly: true }
    );

    return strapi.get<StrapiResponse<StrapiProduct[]>>(`products?${query}`);
};

export const getProductById = async (documentId: string): Promise<StrapiResponse<StrapiProduct>> => {
    const query = qs.stringify(
        {
            populate: {
                brand: { fields: ["id", "documentId", "name", "slug"] },
                category: { fields: ["id", "documentId", "name", "slug"] },
                images: {
                    sort: ["sort_order:asc"],
                    populate: {
                        image: { fields: ["url", "formats", "width", "height", "alternativeText"] },
                    },
                },
            },
        },
        { encodeValuesOnly: true }
    );
    return strapi.get<StrapiResponse<StrapiProduct>>(`products/${documentId}?${query}`);
};

export const getCategories = async (): Promise<StrapiResponse<StrapiCategory[]>> => {
    const query = qs.stringify(
        {
            populate: {
                parent: { fields: ["id", "documentId", "name", "slug"] },
                children: { fields: ["id", "documentId", "name", "slug"] },
            },
            fields: ["id", "documentId", "name", "slug", "active"],
        },
        { encodeValuesOnly: true }
    );
    return strapi.get<StrapiResponse<StrapiCategory[]>>(`categories?${query}`);
};

export const getBrands = async (): Promise<StrapiResponse<StrapiBrand[]>> => {
    const query = qs.stringify(
        { fields: ["id", "documentId", "name", "slug", "active"] },
        { encodeValuesOnly: true }
    );
    return strapi.get<StrapiResponse<StrapiBrand[]>>(`brands?${query}`);
};
export const getVariantOptions = async (productDocumentId: string): Promise<StrapiResponse<StrapiVariantOption[]>> => {
    const query = qs.stringify(
        {
            filters: {
                product: {
                    documentId: {
                        $eq: productDocumentId,
                    },
                },
                active: { $eq: true },
                label: { $notContainsi: "default" },
                value: { $notContainsi: "general" },
            },
            populate: {
                images: {
                    populate: {
                        image: true,
                    },
                },
            },
            fields: ["id", "documentId", "label", "value", "price_override", "active"],
        },
        {
            encodeValuesOnly: true,
        }
    );
    return strapi.get<StrapiResponse<StrapiVariantOption[]>>(`variant-options?${query}`);
};
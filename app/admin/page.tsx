import AdminShell from "@/src/features/admin/components/AdminShell";
import AdminDataError from "@/src/features/admin/components/AdminDataError";
import { noticeFromQuery } from "@/src/features/admin/components/AdminFlash.utils";
import AdminProductsClient, {
  type ProductFilterOption,
  type ProductPagination,
  type ProductRow,
  type ProductStat,
} from "@/src/features/admin/AdminProductsClient";
import {
  getAdminCategories,
  getAdminProducts,
  getStrapiMediaUrl,
  type StrapiStock,
} from "@/src/shared/services/admin";

const fallbackThumbs = [
  "bg-[linear-gradient(135deg,#f8d7dc,#fff7f5_55%,#c68b8d)]",
  "bg-[linear-gradient(135deg,#f6eeee,#e9dfd9_55%,#b58b71)]",
  "bg-[linear-gradient(135deg,#0f2f2d,#e4efe8_52%,#547a73)]",
  "bg-[linear-gradient(135deg,#dccbb0,#fffaf0_55%,#a89068)]",
  "bg-[linear-gradient(135deg,#231d1a,#f1cda9_55%,#c8834f)]",
];

function money(value: number) {
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};

  const page = Math.max(1, Number(firstParam(params.page) ?? 1) || 1);
  const category = firstParam(params.category) ?? "all";
  const availability = firstParam(params.availability) ?? "all";
  const status = firstParam(params.status) ?? "all";
  const search = firstParam(params.q);
  const saved = firstParam(params.saved) === "1";

  const notice = noticeFromQuery({
    saved: firstParam(params.saved),
    error: firstParam(params.error),
    message: firstParam(params.message),
  });

  try {
    const [response, categoriesResponse] = await Promise.all([
      getAdminProducts({
        page,
        pageSize: 10,
        search,
        category,
        availability,
        status,
      }),
      getAdminCategories(),
    ]);

    const products: ProductRow[] = response.data.map((product, index) => {
      const variants =
        (
          product as typeof product & {
            variants?: {
              label?: string;
              value?: string;
              stocks?: StrapiStock[];
            }[];
          }
        ).variants ?? [];

      const hasDefaultVariant = variants.some(
        (variant) =>
          (variant as { label?: string; value?: string }).label === "Default" ||
          (variant as { value?: string }).value === "General"
      );

      const imageUrl = getStrapiMediaUrl(product.images?.[0]?.image?.url);

      const variantNames = variants
        .map((variant) =>
          [variant.label, variant.value].filter(Boolean).join(" / ")
        )
        .filter(Boolean);

      const stock = variants.reduce(
        (total, variant) =>
          total +
          (variant.stocks?.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
          ) ?? 0),
        0
      );

      return {
        id: product.documentId,
        name: product.name,
        sku: product.slug,
        category: product.category?.name ?? "Sin categoria",
        price: money(product.price),
        stock,
        status: product.active ? "Activo" : "Desactivado",
        active: product.active,
        image: fallbackThumbs[index % fallbackThumbs.length],
        imageUrl,
        editHref: `/admin/productos/${product.documentId}/editar`,
        variantLabel:
          variants.length === 0
            ? "Sin variante"
            : hasDefaultVariant && variants.length === 1
              ? "Default / General"
              : `${variants.length} variantes`,
        variantNames,
      };
    });

    const paginationMeta = response.meta.pagination;
    const total = paginationMeta?.total ?? products.length;
    const pageCount = paginationMeta?.pageCount ?? 1;

    const stats: ProductStat[] = [
      {
        label: "Total Productos",
        value: String(total),
        tone: "text-[#554246]",
      },
      {
        label: "En Stock",
        value: String(
          products.filter((product) => product.stock > 0 && product.active)
            .length
        ),
        tone: "text-emerald-700",
      },
      {
        label: "Stock Bajo",
        value: String(
          products.filter((product) => product.stock > 0 && product.stock <= 10)
            .length
        ),
        tone: "text-[#9E3659]",
      },
      {
        label: "Desactivados",
        value: String(products.filter((product) => !product.active).length),
        tone: "text-[#554246]",
      },
    ];

    const categories: ProductFilterOption[] = [
      {
        label: "Todas las Categorias",
        value: "all",
      },
      ...categoriesResponse.data.map((item) => ({
        label: item.name,
        value: item.documentId,
      })),
    ];

    const pagination: ProductPagination = {
      page,
      pageCount,
      total,
      pageSize: paginationMeta?.pageSize ?? 10,
    };

    return (
      <AdminProductsClient
        stats={stats}
        products={products}
        totalLabel={`Mostrando ${products.length} de ${total} productos`}
        categories={categories}
        currentFilters={{
          category,
          availability,
          status,
          search: search ?? "",
        }}
        pagination={pagination}
        saved={saved}
        notice={notice}
      />
    );
  } catch (error) {
    return (
      <AdminShell active="products" searchPlaceholder="Buscar productos..." searchValue={search ?? ""}>
        <AdminDataError
          title="No se pudieron cargar productos desde Strapi"
          error={error}
          permissions={[
            "Product: find/findOne/update",
            "Brand: find/findOne",
            "Category: find/findOne",
            "Variant-option: find/findOne/create",
            "Branch-stock: find/findOne",
            "Product-image: find/findOne",
            "Media Library: find/findOne",
          ]}
        />
      </AdminShell>
    );
  }
}
import AdminShell from "../components/AdminShell";
import AdminDataError from "../components/AdminDataError";
import AdminCatalogClient, { type BrandRow, type CategoryRow } from "./AdminCatalogClient";
import { getAdminBrands, getAdminCategories } from "../../services/admin";

export default async function AdminBrandsCategoriesPage() {
  try {
    const [brandsResponse, categoriesResponse] = await Promise.all([getAdminBrands(), getAdminCategories()]);
    const brands: BrandRow[] = brandsResponse.data.map((brand) => ({
      id: brand.documentId,
      name: brand.name,
      slug: brand.slug,
      active: brand.active,
      products: brand.products?.length ?? 0,
    }));
    const allCategories: CategoryRow[] = categoriesResponse.data.map((category) => ({
      id: category.documentId,
      name: category.name,
      slug: category.slug,
      products: category.products?.length ?? 0,
      visible: category.active,
      open: Boolean(category.children?.length),
      parentId: category.parent?.documentId,
      children: (category.children ?? []).map((child) => ({ id: child.documentId, name: child.name, slug: child.slug, items: 0, active: child.active })),
    }));
    const categories = allCategories.filter((category) => !category.parentId);
    return <AdminCatalogClient brands={brands} categories={categories} allCategories={allCategories} />;
  } catch (error) {
    return (
      <AdminShell active="catalog">
        <AdminDataError title="No se pudo cargar el catalogo desde Strapi" error={error} permissions={["Brand: find/findOne/create/update/delete", "Category: find/findOne/create/update/delete", "Product: find/findOne"]} />
      </AdminShell>
    );
  }
}

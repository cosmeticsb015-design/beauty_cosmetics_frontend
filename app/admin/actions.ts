"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE, createEntity, deleteEntity, getAdminProduct, updateEntity, uploadAdminFile, type AdminMutationState } from "../services/admin";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337").replace(/\/$/, "");
const isProduction = process.env.NODE_ENV === "production";
const adminRoleNames = (process.env.ADMIN_ROLE_NAMES ?? "")
  .split(",")
  .map((role) => role.trim().toLowerCase())
  .filter(Boolean);

function sanitizeText(value: FormDataEntryValue | null, fallback = "") {
  return String(value ?? fallback).trim().slice(0, 5000);
}
function sanitizeNumber(value: FormDataEntryValue | null, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}
function sanitizeBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}
function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 90);
}

function toBlocks(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({ type: "paragraph", children: [{ type: "text", text: paragraph }] }));
}

async function validateSameOrigin() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const host = requestHeaders.get("host");
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function hasAllowedAdminRole(user: { role?: { name?: string; type?: string } }) {
  if (adminRoleNames.length === 0) return true;
  const roleName = user.role?.name?.toLowerCase();
  const roleType = user.role?.type?.toLowerCase();
  return Boolean((roleName && adminRoleNames.includes(roleName)) || (roleType && adminRoleNames.includes(roleType)));
}
async function setSession(jwt: string) {
  (await cookies()).set(ADMIN_SESSION_COOKIE, jwt, { httpOnly: true, secure: isProduction, sameSite: "strict", path: "/admin", maxAge: 60 * 60 * 8 });
}


const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PRODUCT_IMAGES_PER_SAVE = 8;

function getImageFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0)
    .slice(0, MAX_PRODUCT_IMAGES_PER_SAVE);
}

function validateImageFile(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Solo se permiten archivos de imagen.");
  if (file.size > MAX_PRODUCT_IMAGE_SIZE) throw new Error("Cada imagen debe pesar máximo 5MB.");
}

async function uploadProductImages(productDocumentId: string, formData: FormData) {
  const files = getImageFiles(formData);
  for (const [index, file] of files.entries()) {
    validateImageFile(file);
    const uploaded = await uploadAdminFile(file);
    const image = uploaded[0];
    if (!image?.id) continue;
    await createEntity("product-images", {
      sort_order: index,
      product: productDocumentId,
      image: image.id,
    });
  }
}


async function uploadVariantImages(variantDocumentId: string, formData: FormData) {
  const files = getImageFiles(formData);
  for (const [index, file] of files.entries()) {
    validateImageFile(file);
    const uploaded = await uploadAdminFile(file);
    const image = uploaded[0];
    if (!image?.id) continue;
    await createEntity("product-images", {
      sort_order: index,
      variant: variantDocumentId,
      image: image.id,
    });
  }
}

async function ensureDefaultVariant(productDocumentId: string) {
  if (!productDocumentId) return "";
  const product = await getAdminProduct(productDocumentId);
  const variants = (product.data as typeof product.data & { variants?: { documentId?: string }[] }).variants ?? [];
  if (variants[0]?.documentId) return variants[0].documentId;
  const response = await createEntity<{ documentId: string }>("variant-options", {
    label: "Default",
    value: "General",
    active: true,
    product: productDocumentId,
  });
  return response.data.documentId;
}

async function syncVariantStocks(variantDocumentId: string, formData: FormData) {
  if (!variantDocumentId) return;
  const entries = Array.from(formData.entries()).filter(([key]) => key.startsWith("branch_stock_"));
  for (const [key, value] of entries) {
    const branchDocumentId = key.replace("branch_stock_", "");
    if (!branchDocumentId) continue;
    const quantity = sanitizeNumber(value);
    const stockDocumentId = sanitizeText(formData.get(`stock_document_${branchDocumentId}`));
    const payload = { quantity, reserved: 0, variant: variantDocumentId, branch: branchDocumentId };
    if (stockDocumentId) await updateEntity("branch-stocks", stockDocumentId, payload);
    else await createEntity("branch-stocks", payload);
  }
}

export async function loginAdmin(_prev: AdminMutationState, formData: FormData): Promise<AdminMutationState> {
  if (!(await validateSameOrigin())) return { ok: false, message: "Solicitud inválida." };
  const identifier = sanitizeText(formData.get("identifier")).toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!identifier || !password || password.length > 256) return { ok: false, message: "Credenciales inválidas." };

  const response = await fetch(`${API_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
    cache: "no-store",
  });
  if (!response.ok) return { ok: false, message: "Usuario o contraseña incorrectos." };

  const payload = await response.json();
  if (!payload?.jwt || payload?.user?.blocked || !hasAllowedAdminRole(payload.user)) return { ok: false, message: "La cuenta no puede acceder al panel." };
  await setSession(payload.jwt);
  redirect("/admin");
}

export async function logoutAdmin() {
  (await cookies()).delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

export async function saveProduct(_prev: AdminMutationState, formData: FormData): Promise<AdminMutationState> {
  const id = sanitizeText(formData.get("id"));
  const name = sanitizeText(formData.get("name"));
  if (name.length < 2) return { ok: false, message: "El nombre del producto es obligatorio." };
  const data: Record<string, unknown> = {
    name,
    slug: slugify(sanitizeText(formData.get("slug"), name) || name),
    description: toBlocks(sanitizeText(formData.get("description"))),
    price: sanitizeNumber(formData.get("price")),
    active: sanitizeBoolean(formData.get("active")),
    featured: sanitizeBoolean(formData.get("featured")),
  };
  const brand = sanitizeText(formData.get("brand"));
  const category = sanitizeText(formData.get("category"));
  if (brand) data.brand = brand;
  if (category) data.category = category;
  try {
    const response = id ? await updateEntity<{ documentId: string }>("products", id, data) : await createEntity<{ documentId: string }>("products", data);
    const productDocumentId = id || response.data.documentId;
    const defaultVariantDocumentId = await ensureDefaultVariant(productDocumentId);
    await syncVariantStocks(defaultVariantDocumentId, formData);
    await uploadProductImages(productDocumentId, formData);
    revalidatePath("/admin");
    revalidatePath(`/admin/productos/${productDocumentId}/editar`);
    return { ok: true, message: "Producto guardado correctamente.", id: productDocumentId };
  } catch (error) { return { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar el producto." }; }
}

export async function saveBrand(_prev: AdminMutationState, formData: FormData): Promise<AdminMutationState> {
  const id = sanitizeText(formData.get("id"));
  const name = sanitizeText(formData.get("name"));
  if (!name) return { ok: false, message: "Nombre requerido." };
  const data = { name, slug: slugify(sanitizeText(formData.get("slug"), name) || name), active: sanitizeBoolean(formData.get("active")) };
  try { if (id) await updateEntity("brands", id, data); else await createEntity("brands", data); revalidatePath("/admin/marcas-categorias"); return { ok: true, message: id ? "Marca actualizada." : "Marca creada." }; }
  catch (error) { return { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar la marca." }; }
}

export async function saveCategory(_prev: AdminMutationState, formData: FormData): Promise<AdminMutationState> {
  const id = sanitizeText(formData.get("id"));
  const name = sanitizeText(formData.get("name"));
  if (!name) return { ok: false, message: "Nombre requerido." };
  const parent = sanitizeText(formData.get("parent"));
  const data: Record<string, unknown> = { name, slug: slugify(sanitizeText(formData.get("slug"), name) || name), active: sanitizeBoolean(formData.get("active")) };
  if (parent && parent !== id) data.parent = parent;
  try { if (id) await updateEntity("categories", id, data); else await createEntity("categories", data); revalidatePath("/admin/marcas-categorias"); return { ok: true, message: id ? "Categoría actualizada." : "Categoría creada." }; }
  catch (error) { return { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar la categoría." }; }
}


export async function saveVariant(_prev: AdminMutationState, formData: FormData): Promise<AdminMutationState> {
  const id = sanitizeText(formData.get("id"));
  const product = sanitizeText(formData.get("product"));
  const label = sanitizeText(formData.get("label"));
  const value = sanitizeText(formData.get("value"));
  if (!product || !label || !value) return { ok: false, message: "Producto, etiqueta y valor de variante son requeridos." };
  const priceOverride = sanitizeText(formData.get("price_override"));
  const data: Record<string, unknown> = {
    label,
    value,
    active: sanitizeBoolean(formData.get("active")),
    product,
  };
  if (priceOverride) data.price_override = priceOverride;
  try {
    const response = id ? await updateEntity<{ documentId: string }>("variant-options", id, data) : await createEntity<{ documentId: string }>("variant-options", data);
    const variantDocumentId = id || response.data.documentId;
    await syncVariantStocks(variantDocumentId, formData);
    await uploadVariantImages(variantDocumentId, formData);
    revalidatePath(`/admin/productos/${product}/editar`);
    return { ok: true, message: id ? "Variante actualizada." : "Variante creada.", id: variantDocumentId };
  } catch (error) { return { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar la variante." }; }
}

export async function saveBranch(_prev: AdminMutationState, formData: FormData): Promise<AdminMutationState> {
  const id = sanitizeText(formData.get("id"));
  const name = sanitizeText(formData.get("name"));
  const address = sanitizeText(formData.get("address"));
  if (!name || !address) return { ok: false, message: "Nombre y dirección son requeridos." };
  const data = { name, address, schedule: sanitizeText(formData.get("schedule")), notes: sanitizeText(formData.get("notes")), active: sanitizeBoolean(formData.get("active")) };
  try {
    const response = id ? await updateEntity<{ documentId: string }>("branches", id, data) : await createEntity<{ documentId: string }>("branches", data);
    const branchDocumentId = id || response.data.documentId;
    revalidatePath("/admin/sucursales");
    revalidatePath(`/admin/sucursales/${branchDocumentId}`);
    return { ok: true, message: "Sucursal guardada." };
  }
  catch (error) { return { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar la sucursal." }; }
}

export async function saveShippingRate(_prev: AdminMutationState, formData: FormData): Promise<AdminMutationState> {
  const id = sanitizeText(formData.get("id"));
  const name = sanitizeText(formData.get("name"));
  if (!name) return { ok: false, message: "Nombre de tarifa requerido." };
  const data = { name, description: sanitizeText(formData.get("description")), cost: sanitizeNumber(formData.get("cost")), active: sanitizeBoolean(formData.get("active")) };
  try {
    if (id) await updateEntity("shipping-rates", id, data);
    else await createEntity("shipping-rates", data);
    revalidatePath("/admin/logistica");
    return { ok: true, message: "Tarifa guardada." };
  }
  catch (error) { return { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar la tarifa." }; }
}

export async function updateOrderStatus(_prev: AdminMutationState, formData: FormData): Promise<AdminMutationState> {
  const id = sanitizeText(formData.get("id"));
  const rawStatus = sanitizeText(formData.get("payment_status"));
  const payment_status = rawStatus === "pending_shipping" ? "pending" : rawStatus === "sent" ? "paid" : rawStatus === "finalized" ? "refunded" : rawStatus;
  if (!id || !["pending", "paid", "failed", "refunded"].includes(payment_status)) return { ok: false, message: "Pedido inválido." };
  try { await updateEntity("orders", id, { payment_status }); revalidatePath("/admin/pedidos"); return { ok: true, message: "Pedido actualizado." }; }
  catch (error) { return { ok: false, message: error instanceof Error ? error.message : "No se pudo actualizar el pedido." }; }
}

export async function saveStoreConfig(_prev: AdminMutationState, formData: FormData): Promise<AdminMutationState> {
  try { await updateEntity("store-config", "", { whatsapp_number: sanitizeText(formData.get("whatsapp_number")), notification_email: sanitizeText(formData.get("notification_email")) }); revalidatePath("/admin/contenido"); return { ok: true, message: "Configuración guardada." }; }
  catch (error) { return { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar la configuración." }; }
}

export async function removeEntityAction(_prev: AdminMutationState, formData: FormData): Promise<AdminMutationState> {
  const collection = sanitizeText(formData.get("collection"));
  const id = sanitizeText(formData.get("id"));
  if (!collection || !id || !["products", "brands", "categories", "branches", "shipping-rates"].includes(collection)) return { ok: false, message: "Solicitud inválida." };
  try { await deleteEntity(collection, id); revalidatePath("/admin"); return { ok: true, message: "Registro eliminado." }; }
  catch (error) { return { ok: false, message: error instanceof Error ? error.message : "No se pudo eliminar." }; }
}

export async function deactivateProductForm(formData: FormData) {
  const id = sanitizeText(formData.get("id"));
  if (!id) return;
  await updateEntity("products", id, { active: false });
  revalidatePath("/admin");
}

export async function removeEntityForm(formData: FormData) {
  const result = await removeEntityAction({ ok: false, message: "" }, formData);
  if (result.ok) redirect("/admin?saved=1");
}
export async function saveProductForm(formData: FormData) {
  const result = await saveProduct({ ok: false, message: "" }, formData);
  revalidatePath("/admin");
  if (result.ok) redirect("/admin?saved=1");
}
export async function saveBrandForm(formData: FormData) {
  const result = await saveBrand({ ok: false, message: "" }, formData);
  if (result.ok) redirect("/admin/marcas-categorias?saved=1");
}
export async function saveCategoryForm(formData: FormData) {
  const result = await saveCategory({ ok: false, message: "" }, formData);
  if (result.ok) redirect("/admin/marcas-categorias?saved=1");
}
export async function saveBranchForm(formData: FormData) {
  const result = await saveBranch({ ok: false, message: "" }, formData);
  if (result.ok) redirect("/admin/sucursales?saved=1");
}
export async function saveVariantForm(formData: FormData) {
  const result = await saveVariant({ ok: false, message: "" }, formData);
  if (result.ok) redirect("/admin?saved=1");
}

export async function saveBranchInventoryForm(formData: FormData) {
  const product = sanitizeText(formData.get("product"));
  const branch = sanitizeText(formData.get("branch"));
  if (!product || !branch) return;
  const entries = Array.from(formData.entries()).filter(([key]) => key.startsWith("variant_stock_"));
  for (const [key, value] of entries) {
    const variantDocumentId = key.replace("variant_stock_", "");
    if (!variantDocumentId) continue;
    const quantity = sanitizeNumber(value);
    const stockDocumentId = sanitizeText(formData.get(`stock_document_${variantDocumentId}`));
    const payload = { quantity, reserved: 0, variant: variantDocumentId, branch };
    if (stockDocumentId) await updateEntity("branch-stocks", stockDocumentId, payload);
    else await createEntity("branch-stocks", payload);
  }
  revalidatePath(`/admin/productos/${product}/editar`);
  revalidatePath(`/admin/productos/${product}/inventario/${branch}`);
  redirect("/admin?saved=1");
}

export async function saveShippingRateForm(formData: FormData) {
  const result = await saveShippingRate({ ok: false, message: "" }, formData);
  if (result.ok) redirect("/admin/logistica?saved=1");
}
export async function updateOrderStatusForm(formData: FormData) {
  const result = await updateOrderStatus({ ok: false, message: "" }, formData);
  if (result.ok) redirect("/admin/pedidos?saved=1");
}
export async function saveStoreConfigForm(formData: FormData) {
  const result = await saveStoreConfig({ ok: false, message: "" }, formData);
  if (result.ok) redirect("/admin/contenido?saved=1");
}

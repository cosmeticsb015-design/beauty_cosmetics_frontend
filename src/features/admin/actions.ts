"use server";

import { randomUUID } from "crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE, createEntity, deleteEntity, getAdminProduct, updateEntity, uploadAdminFile, type AdminMutationState } from "@/src/shared/services/admin";
import { getAdminLoginPath } from "@/src/shared/lib/admin-auth";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337").replace(/\/$/, "");
const AUTH_2FA_BASE = `${API_URL}/api/auth/local/2fa`;
const isProduction = process.env.NODE_ENV === "production";
const ADMIN_SESSION_COOKIE_PATH = "/";
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
  (await cookies()).set(ADMIN_SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: ADMIN_SESSION_COOKIE_PATH,
    maxAge: 60 * 60 * 8,
  });
}

function redirectWithNotice(path: string, result: AdminMutationState, fallbackSuccess = "Cambios guardados correctamente.") {
  const [pathname, currentQuery = ""] = path.split("?");
  const params = new URLSearchParams(currentQuery);
  params.delete("saved");
  params.delete("error");
  params.delete("message");
  params.set(result.ok ? "saved" : "error", "1");
  params.set("message", result.message || (result.ok ? fallbackSuccess : "No se pudo completar la accion."));
  redirect(`${pathname}?${params.toString()}`);
}

async function adminRefererPath(fallback: string) {
  const referer = (await headers()).get("referer");
  if (!referer) return fallback;
  try {
    const url = new URL(referer);
    if (!url.pathname.startsWith("/admin")) return fallback;
    url.searchParams.delete("saved");
    url.searchParams.delete("error");
    url.searchParams.delete("message");
    const query = url.searchParams.toString();
    return `${url.pathname}${query ? `?${query}` : ""}`;
  } catch {
    return fallback;
  }
}

const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PRODUCT_IMAGES_PER_SAVE = 8;
const MAX_BANNER_IMAGE_SIZE = 8 * 1024 * 1024;

function getOptionalImageFile(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

async function uploadBannerImage(formData: FormData, key: string) {
  const file = getOptionalImageFile(formData, key);
  if (!file) return null;
  if (!file.type.startsWith("image/")) throw new Error("Solo se permiten imagenes en banners.");
  if (file.size > MAX_BANNER_IMAGE_SIZE) throw new Error("Cada banner debe pesar maximo 8MB.");
  const uploaded = await uploadAdminFile(file);
  return uploaded[0]?.id ?? null;
}

function sanitizeDisplayScope(value: FormDataEntryValue | null) {
  const scope = sanitizeText(value, "desktop_and_mobile");
  return ["desktop_and_mobile", "desktop_only", "mobile_only"].includes(scope) ? scope : "desktop_and_mobile";
}

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

async function deleteSelectedProductImages(formData: FormData) {
  const imageIds = Array.from(new Set(formData.getAll("delete_image_ids").map((value) => sanitizeText(value)).filter(Boolean)));
  for (const imageId of imageIds) await deleteEntity("product-images", imageId);
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

export type AdminLoginState = {
  ok: boolean;
  message: string;
  step?: "credentials" | "otp";
  challengeId?: string;
  maskedEmail?: string;
  expiresInSeconds?: number;
};

export type AdminOtpState = {
  ok: boolean;
  message: string;
  step?: "otp";
};

function statusFallbackMessage(status: number) {
  if (status === 400) return "Usuario o contraseña incorrectos.";
  if (status === 403) return "Esta cuenta no tiene permitido el acceso.";
  if (status === 429) return "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.";
  return "No se pudo completar la solicitud.";
}

async function auth2fa<T>(path: "start" | "verify", body: Record<string, unknown>) {
  let response: Response;
  try {
    response = await fetch(`${AUTH_2FA_BASE}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return { ok: false as const, message: "No se pudo conectar con el servidor." };
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (typeof payload?.error?.message === "string" && payload.error.message) ||
      (typeof payload?.message === "string" && payload.message) ||
      statusFallbackMessage(response.status);
    return { ok: false as const, message };
  }

  return { ok: true as const, data: payload as T };
}

export async function startAdminLogin(_prev: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  if (!(await validateSameOrigin())) return { ok: false, message: "Solicitud inválida.", step: "credentials" };
  const identifier = sanitizeText(formData.get("identifier"));
  const password = String(formData.get("password") ?? "");
  if (!identifier || !password || password.length > 256) {
    return { ok: false, message: "Credenciales inválidas.", step: "credentials" };
  }

  const result = await auth2fa<{ challengeId: string; email?: string; expiresInSeconds?: number }>("start", {
    identifier,
    password,
  });

  if (!result.ok) {
    return { ok: false, message: result.message, step: "credentials" };
  }

  return {
    ok: true,
    message: "Hemos enviado un código de verificación a tu correo.",
    step: "otp",
    challengeId: result.data.challengeId,
    maskedEmail: result.data.email,
    expiresInSeconds: result.data.expiresInSeconds,
  };
}

export async function verifyAdminLogin(_prev: AdminOtpState, formData: FormData): Promise<AdminOtpState> {
  if (!(await validateSameOrigin())) return { ok: false, message: "Solicitud inválida.", step: "otp" };
  const challengeId = sanitizeText(formData.get("challengeId"));
  const code = sanitizeText(formData.get("code")).replace(/\D/g, "");

  if (!challengeId || !code) return { ok: false, message: "Código inválido.", step: "otp" };

  const result = await auth2fa<{ jwt?: string; user?: { blocked?: boolean; role?: { name?: string; type?: string } } }>("verify", {
    challengeId,
    code,
    deviceId: randomUUID(),
  });

  if (!result.ok) {
    return { ok: false, message: result.message, step: "otp" };
  }

  const { jwt, user } = result.data;
  if (!jwt || !user || user.blocked || !hasAllowedAdminRole(user)) {
    return { ok: false, message: "La cuenta no puede acceder al panel.", step: "otp" };
  }

  await setSession(jwt);
  redirect("/admin");
}

export async function logoutAdmin() {
  (await cookies()).set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: ADMIN_SESSION_COOKIE_PATH,
    maxAge: 0,
  });
  redirect(getAdminLoginPath());
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
    await deleteSelectedProductImages(formData);
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
  const order_status = sanitizeText(formData.get("order_status"));
  if (!id || !["pending_shipping", "shipped", "delivered"].includes(order_status)) return { ok: false, message: "Pedido inválido." };
  try { await updateEntity("orders", id, { order_status, fulfillment_status: order_status }); revalidatePath("/admin/pedidos"); return { ok: true, message: "Pedido actualizado." }; }
  catch (error) { return { ok: false, message: error instanceof Error ? error.message : "No se pudo actualizar el pedido." }; }
}

export async function saveStoreConfig(_prev: AdminMutationState, formData: FormData): Promise<AdminMutationState> {
  const whatsapp_number = sanitizeText(formData.get("whatsapp_number"));
  const notification_email = sanitizeText(formData.get("notification_email"));
  const bannerIndexes = Array.from(new Set(Array.from(formData.keys()).map((key) => key.match(/^banner_(?:id|name|position|url|scope|active|desktop_existing|mobile_existing|desktop_image|mobile_image)_(\d+)$/)?.[1]).filter(Boolean) as string[]));

  try {
    const home_banners = [];
    for (const index of bannerIndexes) {
      const name = sanitizeText(formData.get(`banner_name_${index}`));
      const existingDesktop = sanitizeText(formData.get(`banner_desktop_existing_${index}`));
      const uploadedDesktop = await uploadBannerImage(formData, `banner_desktop_image_${index}`);
      const desktopImage = uploadedDesktop ?? (existingDesktop ? Number(existingDesktop) : null);
      if (!name && !desktopImage) continue;
      if (!name || !desktopImage) return { ok: false, message: "Cada banner necesita nombre e imagen de escritorio." };

      const id = sanitizeText(formData.get(`banner_id_${index}`));
      const existingMobile = sanitizeText(formData.get(`banner_mobile_existing_${index}`));
      const uploadedMobile = await uploadBannerImage(formData, `banner_mobile_image_${index}`);
      const mobileImage = uploadedMobile ?? (existingMobile ? Number(existingMobile) : null);
      const banner: Record<string, unknown> = {
        ...(id ? { id: Number(id) } : {}),
        name,
        home_position: Math.max(1, sanitizeNumber(formData.get(`banner_position_${index}`), home_banners.length + 1)),
        destination_url: sanitizeText(formData.get(`banner_url_${index}`)) || null,
        display_scope: sanitizeDisplayScope(formData.get(`banner_scope_${index}`)),
        active: sanitizeBoolean(formData.get(`banner_active_${index}`)),
        desktop_image: desktopImage,
      };
      if (mobileImage) banner.mobile_image = mobileImage;
      home_banners.push(banner);
    }

    await updateEntity("store-config", "", { whatsapp_number, notification_email, home_banners });
    revalidatePath("/admin/contenido");
    revalidatePath("/");
    return { ok: true, message: "Configuración guardada." };
  }
  catch (error) { return { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar la configuración." }; }
}

export async function removeEntityAction(_prev: AdminMutationState, formData: FormData): Promise<AdminMutationState> {
  const collection = sanitizeText(formData.get("collection"));
  const id = sanitizeText(formData.get("id"));
  if (!collection || !id || !["products", "brands", "categories", "branches", "shipping-rates", "variant-options"].includes(collection)) return { ok: false, message: "Solicitud inválida." };
  try { await deleteEntity(collection, id); revalidatePath("/admin"); return { ok: true, message: deleteSuccessMessage(collection) }; }
  catch (error) { return { ok: false, message: error instanceof Error ? error.message : "No se pudo eliminar." }; }
}

function deleteSuccessMessage(collection: string) {
  if (collection === "products") return "Producto eliminado correctamente.";
  if (collection === "brands") return "Marca eliminada correctamente.";
  if (collection === "categories") return "Categoría eliminada correctamente.";
  if (collection === "branches") return "Sucursal eliminada correctamente.";
  if (collection === "shipping-rates") return "Tarifa eliminada correctamente.";
  if (collection === "variant-options") return "Variante eliminada correctamente.";
  return "Registro eliminado correctamente.";
}

export async function setProductActiveForm(formData: FormData) {
  const id = sanitizeText(formData.get("id"));
  const active = sanitizeBoolean(formData.get("active"));
  if (!id) redirectWithNotice("/admin", { ok: false, message: "Producto inválido." });
  try {
    await updateEntity("products", id, { active });
    revalidatePath("/admin");
    redirectWithNotice("/admin", { ok: true, message: active ? "Producto activado correctamente." : "Producto desactivado correctamente." });
  } catch (error) {
    redirectWithNotice("/admin", { ok: false, message: error instanceof Error ? error.message : "No se pudo actualizar el producto." });
  }
}

export async function deactivateProductForm(formData: FormData) {
  formData.set("active", "false");
  await setProductActiveForm(formData);
}

export async function removeEntityForm(formData: FormData) {
  const result = await removeEntityAction({ ok: false, message: "" }, formData);
  const redirectUrl = sanitizeText(formData.get("redirect_url")) || "/admin";
  redirectWithNotice(redirectUrl, result);
}
export async function saveProductForm(formData: FormData) {
  const result = await saveProduct({ ok: false, message: "" }, formData);
  revalidatePath("/admin");
  redirectWithNotice(result.ok ? "/admin" : await adminRefererPath("/admin/productos/nuevo"), result);
}
export async function saveBrandForm(formData: FormData) {
  const result = await saveBrand({ ok: false, message: "" }, formData);
  redirectWithNotice("/admin/marcas-categorias", result);
}
export async function saveCategoryForm(formData: FormData) {
  const result = await saveCategory({ ok: false, message: "" }, formData);
  redirectWithNotice("/admin/marcas-categorias", result);
}
export async function saveBranchForm(formData: FormData) {
  const result = await saveBranch({ ok: false, message: "" }, formData);
  redirectWithNotice(result.ok ? "/admin/sucursales" : await adminRefererPath("/admin/sucursales"), result);
}
export async function saveVariantForm(formData: FormData) {
  const result = await saveVariant({ ok: false, message: "" }, formData);
  redirectWithNotice(result.ok ? "/admin" : await adminRefererPath("/admin"), result);
}

export async function saveBranchInventoryForm(formData: FormData) {
  const product = sanitizeText(formData.get("product"));
  const branch = sanitizeText(formData.get("branch"));
  if (!product || !branch) redirectWithNotice(await adminRefererPath("/admin"), { ok: false, message: "Inventario inválido." });
  try {
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
    redirectWithNotice("/admin", { ok: true, message: "Inventario guardado correctamente." });
  } catch (error) {
    redirectWithNotice(await adminRefererPath("/admin"), { ok: false, message: error instanceof Error ? error.message : "No se pudo guardar el inventario." });
  }
}

export async function saveShippingRateForm(formData: FormData) {
  const result = await saveShippingRate({ ok: false, message: "" }, formData);
  redirectWithNotice("/admin/logistica", result);
}
export async function updateOrderStatusForm(formData: FormData) {
  const result = await updateOrderStatus({ ok: false, message: "" }, formData);
  redirectWithNotice("/admin/pedidos", result);
}
export async function saveStoreConfigForm(formData: FormData) {
  const result = await saveStoreConfig({ ok: false, message: "" }, formData);
  redirectWithNotice("/admin/contenido", result);
}
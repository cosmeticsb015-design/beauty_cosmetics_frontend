"use client";
// RUTA: src/features/admin/productos/components/ProductImagePicker.tsx

import Image from "next/image";
import { Camera, ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ProductImagePickerProps = {
  existingImages?: Array<{ id: string; url: string } | string>;
  compact?: boolean;
  inputForm?: string;
};

// Mismo límite que valida el backend en uploadProductImages/uploadVariantImages
// (MAX_PRODUCT_IMAGES_PER_SAVE), para avisar antes de guardar en vez de que el
// backend recorte la lista en silencio.
const MAX_NEW_IMAGES = 8;
// Las imágenes que pesan más de esto no se dejan ni seleccionar: se avisa de
// inmediato en vez de esperar a que el backend las rechace al guardar.
const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024;

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

export default function ProductImagePicker({ existingImages = [], compact = false, inputForm }: ProductImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews]);

  // El input real (name="images") es lo que efectivamente se envía con el
  // formulario, así que cada vez que cambia nuestra lista acumulada en React
  // la volvemos a escribir ahí mediante DataTransfer. Así, abrir el selector
  // de archivos varias veces (agregar, salir, agregar más) suma imágenes en
  // vez de reemplazar la selección anterior.
  const syncInputFiles = (nextFiles: File[]) => {
    const input = inputRef.current;
    if (!input) return;
    const dataTransfer = new DataTransfer();
    nextFiles.forEach((file) => dataTransfer.items.add(file));
    input.files = dataTransfer.files;
  };

  const addFiles = (incoming: File[]) => {
    const tooHeavy = incoming.filter((file) => file.size > MAX_IMAGE_SIZE_BYTES);
    const allowed = incoming.filter((file) => file.size <= MAX_IMAGE_SIZE_BYTES);

    if (tooHeavy.length) {
      const names = tooHeavy.map((file) => `${file.name} (${formatSize(file.size)})`).join(", ");
      setSizeError(`No se ${tooHeavy.length > 1 ? "subieron" : "subió"} porque ${tooHeavy.length > 1 ? "pesan" : "pesa"} mucho (máximo 1MB por imagen): ${names}.`);
    } else {
      setSizeError(null);
    }

    if (!allowed.length) {
      // Igual sincronizamos el input con lo que ya teníamos: si todo lo
      // elegido pesaba de más, no se agrega nada nuevo.
      syncInputFiles(files);
      return;
    }

    setFiles((current) => {
      const existingKeys = new Set(current.map(fileKey));
      const merged = [...current, ...allowed.filter((file) => !existingKeys.has(fileKey(file)))].slice(0, MAX_NEW_IMAGES);
      syncInputFiles(merged);
      return merged;
    });
  };

  const removeFile = (file: File) => {
    setFiles((current) => {
      const next = current.filter((item) => fileKey(item) !== fileKey(file));
      syncInputFiles(next);
      return next;
    });
  };

  const normalizedExistingImages = existingImages.map((image, index) => ({
    id: typeof image === "string" ? "" : image.id,
    url: typeof image === "string" ? image : image.url,
    label: index === 0 ? "Actual principal" : "Actual",
    existing: true,
  }));

  const images = [
    ...normalizedExistingImages.map((image, index) => ({ key: `existing-${image.url}-${index}`, ...image, file: null as File | null })),
    ...previews.map((preview, index) => ({ key: fileKey(preview.file), id: "", url: preview.url, label: index === 0 && existingImages.length === 0 ? "Nueva principal" : "Nueva", existing: false, file: preview.file })),
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {images.map((image) => (
          <div key={image.key} className="relative h-[150px] overflow-hidden rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA]">
            <Image src={image.url} alt="Vista previa del producto" fill sizes="180px" className="object-cover" />
            <span className="absolute left-3 top-3 rounded-[3px] bg-[#9E3659] px-3 py-1 text-[11px] font-bold text-white shadow-sm">{image.label}</span>
            {image.existing && image.id ? (
              <label className="absolute bottom-3 left-3 right-3 flex cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-white/95 px-3 py-2 text-[12px] font-bold text-red-700 shadow-sm ring-1 ring-red-100 transition-colors hover:bg-red-50">
                <input name="delete_image_ids" form={inputForm} type="checkbox" value={image.id} className="h-4 w-4 accent-red-700" />
                Eliminar imagen
              </label>
            ) : null}
            {!image.existing && image.file ? (
              <button
                type="button"
                onClick={() => removeFile(image.file as File)}
                aria-label="Quitar esta imagen antes de guardar"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[#7D123B] shadow-sm ring-1 ring-[#E7BFC9] transition-colors hover:bg-red-50"
              >
                <X size={15} strokeWidth={2.4} />
              </button>
            ) : null}
          </div>
        ))}
        <label className="flex h-[150px] cursor-pointer flex-col items-center justify-center rounded-[4px] border-2 border-dashed border-[#DFE3EA] text-[#9AA3B2] transition-colors hover:border-[#9E3659] hover:text-[#9E3659]">
          {compact ? <Camera size={30} strokeWidth={1.8} /> : <Upload size={34} strokeWidth={1.8} />}
          <span className="mt-3 text-[15px]">{files.length ? "Agregar más" : "Sube imágenes"}</span>
          <input
            ref={inputRef}
            name="images"
            form={inputForm}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              addFiles(Array.from(event.currentTarget.files ?? []));
              // No reseteamos event.currentTarget.value aquí: el propio
              // addFiles/syncInputFiles ya deja input.files apuntando al
              // DataTransfer acumulado, que es la fuente de verdad real.
              // Limpiar value manualmente compite con esa sincronización.
            }}
          />
        </label>
        {images.length === 0 ? (
          <div className="flex h-[150px] items-center justify-center rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] text-[#A0A5B2]">
            <ImageIcon size={28} strokeWidth={1.8} />
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-[12px] font-semibold text-[#6B7280]">
        Vista previa local antes de guardar. Formatos permitidos: imágenes JPG/PNG/WebP. Peso máximo: 1MB por imagen.
      </p>
      {sizeError ? (
        <p className="mt-1 text-[12px] font-semibold text-red-600">{sizeError}</p>
      ) : null}
      {files.length > 0 ? (
        <p className="mt-1 text-[12px] font-semibold text-[#9E3659]">
          {files.length} de {MAX_NEW_IMAGES} imágenes nuevas seleccionadas
          {files.length >= MAX_NEW_IMAGES ? " (límite alcanzado para esta carga)" : ""}.
        </p>
      ) : null}
    </div>
  );
}
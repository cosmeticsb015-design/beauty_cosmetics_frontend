"use client";

import Image from "next/image";
import { Camera, ImageIcon, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ProductImagePickerProps = {
  existingImages?: string[];
  compact?: boolean;
  inputForm?: string;
};

export default function ProductImagePicker({ existingImages = [], compact = false, inputForm }: ProductImagePickerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);

  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews]);

  const images = [
    ...existingImages.map((url, index) => ({ key: `existing-${url}-${index}`, url, label: index === 0 ? "Actual principal" : "Actual" })),
    ...previews.map((preview, index) => ({ key: `${preview.file.name}-${preview.file.lastModified}-${index}`, url: preview.url, label: index === 0 && existingImages.length === 0 ? "Nueva principal" : "Nueva" })),
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {images.slice(0, compact ? 3 : 6).map((image) => (
          <div key={image.key} className="relative h-[150px] overflow-hidden rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA]">
            <Image src={image.url} alt="Vista previa del producto" fill sizes="180px" className="object-cover" />
            <span className="absolute left-3 top-3 rounded-[3px] bg-[#9E3659] px-3 py-1 text-[11px] font-bold text-white shadow-sm">{image.label}</span>
          </div>
        ))}
        <label className="flex h-[150px] cursor-pointer flex-col items-center justify-center rounded-[4px] border-2 border-dashed border-[#DFE3EA] text-[#9AA3B2] transition-colors hover:border-[#9E3659] hover:text-[#9E3659]">
          {compact ? <Camera size={30} strokeWidth={1.8} /> : <Upload size={34} strokeWidth={1.8} />}
          <span className="mt-3 text-[15px]">{files.length ? "Agregar más" : "Sube imágenes"}</span>
          <input
            name="images"
            form={inputForm}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => setFiles(Array.from(event.currentTarget.files ?? []))}
          />
        </label>
        {images.length === 0 ? (
          <div className="flex h-[150px] items-center justify-center rounded-[4px] border border-[#E5E7EB] bg-[#FAFAFA] text-[#A0A5B2]">
            <ImageIcon size={28} strokeWidth={1.8} />
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-[12px] font-semibold text-[#6B7280]">Vista previa local antes de guardar. Formatos permitidos: imágenes JPG/PNG/WebP.</p>
    </div>
  );
}

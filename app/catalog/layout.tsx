import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo | Maquillaje Original, Skincare y Cosméticos en El Salvador",
  description:
    "Explora el catálogo online de Beauty Cosmetics SV: maquillaje original, skincare, cosmética, accesorios y cuidado personal con envíos a todo El Salvador.",
  alternates: { canonical: "/catalog" },
  openGraph: {
    title: "Catálogo Beauty Cosmetics SV | Maquillaje Original y Skincare",
    description:
      "Compra maquillaje original, skincare y productos de belleza en El Salvador con entregas en San Salvador, San Miguel y envíos nacionales.",
    url: "https://beautycosmeticssv.com/catalog",
  },
};

export default function CatalogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

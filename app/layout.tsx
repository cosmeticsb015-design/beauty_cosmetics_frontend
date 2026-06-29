import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/src/shared/components/Navbar";
import Footer from "@/src/shared/components/Footer";
import WhatsappFloatingButton from "@/src/shared/components/WhatsappFloatingButton";
import { getPublicStoreConfig } from "@/src/shared/services/storeConfig";
import { CartProvider } from "@/src/shared/context/CartContext";
import { Suspense } from "react";

const siteUrl = "https://beautycosmeticssv.com";
const brandName = "Beauty Cosmetics";
const seoDescription =
  "Beauty Cosmetics El Salvador: ecommerce de maquillaje original, skincare, cosmética y cuidado personal con entregas en San Salvador y San Miguel, envíos a todo el país y sucursales en San Miguel y Usulután Plaza Mundo.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: brandName,
  title: {
    default: "Beauty Cosmetics El Salvador | Maquillaje Original, Skincare y Cosmética",
    template: "%s | Beauty Cosmetics El Salvador",
  },
  description: seoDescription,
  keywords: [
    "Beauty Cosmetics",
    "Beauty Cosmetics El Salvador",
    "beautycosmeticssv",
    "maquillaje original El Salvador",
    "maquillaje en San Salvador",
    "maquillaje en San Miguel",
    "cosméticos en Usulután",
    "skincare El Salvador",
    "cuidado de la piel El Salvador",
    "tienda de maquillaje online",
    "ecommerce de belleza El Salvador",
    "productos de belleza originales",
    "makeup El Salvador",
    "original makeup El Salvador",
    "beauty store El Salvador",
    "skin care El Salvador",
    "cosmetics online store",
    "envíos a todo El Salvador",
    "San Miguel",
    "Usulután Plaza Mundo",
  ],
  authors: [{ name: brandName, url: siteUrl }],
  creator: brandName,
  publisher: brandName,
  alternates: {
    canonical: "/",
    languages: {
      "es-SV": "/",
      en: "/?lang=en",
      "x-default": "/",
    },
  },
  category: "Belleza, cosmética y cuidado personal",
  classification: "Ecommerce de belleza y cosmética en El Salvador",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_SV",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: brandName,
    title: "Beauty Cosmetics El Salvador | Maquillaje Original y Skincare",
    description: seoDescription,
    images: [
      {
        url: "/bc-logo.png",
        width: 1200,
        height: 630,
        alt: "Beauty Cosmetics El Salvador - maquillaje original, skincare y cosmética",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Beauty Cosmetics El Salvador | Original Makeup, Skincare & Cosmetics",
    description:
      "Shop original makeup, skincare, cosmetics and personal care in El Salvador. Delivery in San Salvador and San Miguel, nationwide shipping, and branches in San Miguel and Usulután Plaza Mundo.",
    images: ["/bc-logo.png"],
  },
  icons: {
    icon: "/bc-logo.png",
    shortcut: "/bc-logo.png",
    apple: "/bc-logo.png",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "OnlineStore", "BeautySalon"],
  "@id": `${siteUrl}/#organization`,
  name: brandName,
  alternateName: ["BEAUTY COSMETICS💎", "Beauty Cosmetics SV", "beautycosmeticssv"],
  url: siteUrl,
  logo: `${siteUrl}/bc-logo.png`,
  image: `${siteUrl}/bc-logo.png`,
  description: seoDescription,
  slogan: "Maquillaje original, belleza auténtica y cuidado personal en El Salvador.",
  inLanguage: ["es-SV", "en"],
  areaServed: [
    { "@type": "Country", name: "El Salvador" },
    { "@type": "City", name: "San Salvador" },
    { "@type": "City", name: "San Miguel" },
    { "@type": "City", name: "Usulután" },
  ],
  knowsAbout: [
    "Maquillaje original",
    "Bases, correctores, rubores e iluminadores",
    "Labiales, glosses y tintas",
    "Sombras, delineadores, máscaras y productos para cejas",
    "Brochas, esponjas y accesorios de maquillaje",
    "Skincare",
    "Cuidado de la piel",
    "Cosmética",
    "Cuidado personal",
    "Fragancias y regalos de belleza",
    "Productos de belleza originales",
    "Original makeup",
    "Skin care",
    "Beauty products",
    "Cosmetics online store",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Catálogo online de Beauty Cosmetics SV",
    itemListElement: [
      { "@type": "OfferCatalog", name: "Maquillaje para rostro: bases, correctores, rubores, contornos, polvos e iluminadores" },
      { "@type": "OfferCatalog", name: "Maquillaje para ojos: sombras, delineadores, máscaras de pestañas y cejas" },
      { "@type": "OfferCatalog", name: "Labios: labiales, glosses, tintas y delineadores" },
      { "@type": "OfferCatalog", name: "Skincare: limpiadores, tónicos, sérums, hidratantes y protectores solares" },
      { "@type": "OfferCatalog", name: "Accesorios: brochas, esponjas, aplicadores, sets y regalos" },
      { "@type": "OfferCatalog", name: "Cuidado personal, fragancias, novedades y tendencias de belleza" },
    ],
  },
  sameAs: [
    "https://www.instagram.com/beautycosmetics_sv/",
    "https://www.tiktok.com/@beautycosmetics_sv",
  ],
  department: [
    {
      "@type": "Store",
      name: "Beauty Cosmetics San Miguel",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Urbanización España, Calle Suiza principal, polígono 12, N-1",
        addressLocality: "San Miguel",
        addressCountry: "SV",
      },
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "18:30" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:30", closes: "17:30" },
      ],
      hasMap: "https://maps.app.goo.gl/K5RwqeqXaL2MHGeN6",
    },
    {
      "@type": "Store",
      name: "Beauty Cosmetics Usulutan Plaza Mundo",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Plaza Mundo Usulutan, entrada principal, Nivel 2, en el pasillo del súper",
        addressLocality: "Usulutan",
        addressCountry: "SV",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:30",
        closes: "19:00"
      },
      hasMap: "https://maps.app.goo.gl/k7EzCyrpCmnPJbcQA",
    },
  ],
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/catalog?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: brandName,
  alternateName: "Beauty Cosmetics SV",
  description: seoDescription,
  inLanguage: ["es-SV", "en"],
  publisher: { "@id": `${siteUrl}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/catalog?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeConfig = await getPublicStoreConfig();

  return (
    <html lang="es-SV" className="h-full antialiased" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd, websiteJsonLd]) }}
        />
        <CartProvider>
          <Suspense fallback={<div className="h-[68px] bg-white border-b border-[#F0E4E8]" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer whatsappNumber={storeConfig.data?.whatsapp_number} notificationEmail={storeConfig.data?.notification_email} />
          <WhatsappFloatingButton whatsappNumber={storeConfig.data?.whatsapp_number} />
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsappFloatingButton from "./components/WhatsappFloatingButton";
import { getPublicStoreConfig } from "./services/storeConfig";
import { CartProvider } from "./context/CartContext";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "Beauty Cosmetics | Belleza Natural y Consciente",
  description:
    "Descubre nuestra selección exclusiva de productos de belleza y cuidado de la piel. Formulaciones naturales que realzan tu brillo interior.",
  keywords: ["belleza", "cosmetics", "skin care", "maquillaje", "cuidado de la piel", "productos naturales"],
  icons: {
    icon: "/bc-logo.png",
    shortcut: "/bc-logo.png",
    apple: "/bc-logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeConfig = await getPublicStoreConfig();

  return (
    <html lang="es" className="h-full antialiased" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
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

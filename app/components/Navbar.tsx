"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { HandFist, Search, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "../context/CartContext";

const navLinks = [
  { label: "INICIO", href: "/" },
  { label: "CATÁLOGO", href: "/catalog" },
  { label: "ABOUT", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

const subBarItems = [
  { id: "sub-envios", icon: <Truck size={16} strokeWidth={1.8} />, label: "ENVÍOS A TODO EL PAIS" },
  { id: "sub-originales", icon: <ShieldCheck size={16} strokeWidth={1.8} />, label: "PRODUCTOS 100% ORIGINALES" },
  { id: "sub-atencion", icon: <HandFist size={16} strokeWidth={1.8} />, label: "ATENCIÓN PERSONALIZADA" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartHydrated, setCartHydrated] = useState(false);
  const { cartCount } = useCart();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get("category");

  useEffect(() => {
    const timer = window.setTimeout(() => setCartHydrated(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const checkIsActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("category=")) {
      const hrefCategory = href.split("category=")[1];
      return pathname === "/catalog" && currentCategory === hrefCategory;
    }
    if (href === "/catalog") return pathname === "/catalog" && !currentCategory;
    return pathname === href;
  };

  return (
    <>
      <header className="bg-white sticky top-0 z-50 border-b border-[#F0E4E8]">

        {/* Main Nav Row */}
        <div className="flex items-center justify-between h-[68px] px-6 md:px-10">

          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8 lg:gap-10">
            <Link href="/" aria-label="Beauty Cosmetics Home">
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                <img src="/bc-logo.png" alt="BC Logo" className="w-full h-full object-cover" />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = checkIsActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[13px] font-semibold tracking-wider transition-colors hover:text-[#C15074] ${
                      isActive ? "text-[#C15074]" : "text-[#2D1F23]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <button
              id="search-toggle"
              onClick={() => setSearchOpen(true)}
              className="p-2 text-[#2D1F23] hover:text-[#C15074] transition-colors"
              aria-label="Buscar"
            >
              <Search size={20} strokeWidth={1.8} />
            </button>

            <Link
              href="/cart"
              id="cart-link"
              className="p-2 relative text-[#2D1F23] hover:text-[#C15074] transition-colors"
              aria-label="Carrito"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {cartHydrated && cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C15074] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-[#2D1F23] hover:text-[#C15074] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                {mobileMenuOpen ? (
                  <path d="M2 2L20 20M2 20L20 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M2 5H20M2 11H20M2 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-[#F0E4E8] bg-white px-5 py-4 flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-semibold tracking-wider transition-colors hover:text-[#C15074] ${
                    isActive ? "text-[#C15074]" : "text-[#2D1F23]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Sub-bar */}
        <div className="hidden md:flex items-center justify-center bg-[#FBD5E0] py-2.5 px-4">
          {subBarItems.map((item, i) => (
            <div key={item.id} className="flex items-center">
              <div className="flex items-center gap-2 px-6 text-[#9E3659]">
                {item.icon}
                <span className="text-[11px] font-semibold tracking-widest text-[#554246] uppercase whitespace-nowrap">
                  {item.label}
                </span>
              </div>
              {i < subBarItems.length - 1 && (
                <span className="text-[#D4738F] text-lg font-light select-none">|</span>
              )}
            </div>
          ))}
        </div>

      </header>

      {/* Search Overlay — separate component */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

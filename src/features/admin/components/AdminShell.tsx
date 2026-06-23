"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logoutAdmin } from "@/src/features/admin/actions";
import {
  FolderKanban,
  LogOut,
  MapPinHouse,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Store,
  Truck,
  X,
} from "lucide-react";

const navItems = [
  { label: "Productos", href: "/admin", icon: Package },
  { label: "Marcas & Categorias", href: "/admin/marcas-categorias", icon: FolderKanban },
  { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
  { label: "Sucursales", href: "/admin/sucursales", icon: Store },
  { label: "Logistica", href: "/admin/logistica", icon: Truck },
  { label: "Contenido", href: "/admin/contenido", icon: MapPinHouse },
];

type AdminShellProps = {
  active: "products" | "catalog" | "orders" | "branches" | "logistics" | "content";
  searchPlaceholder?: string;
  searchAction?: string;
  searchValue?: string;
  children: React.ReactNode;
};

const activeByKey = {
  products: "Productos",
  catalog: "Marcas & Categorias",
  orders: "Pedidos",
  branches: "Sucursales",
  logistics: "Logistica",
  content: "Contenido",
};

function NavLinks({ active, onNavigate }: { active: AdminShellProps["active"]; onNavigate?: () => void }) {
  return (
    <nav className="flex-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.label === activeByKey[active];

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={`flex w-full items-center gap-3 border-r-2 px-7 py-4 text-left text-[15px] font-semibold tracking-wide transition-colors ${
              isActive
                ? "border-[#9E3659] bg-[#FCEDF0] text-[#9E3659]"
                : "border-transparent text-[#554246] hover:bg-[#FCEDF0]/55 hover:text-[#9E3659]"
            }`}
          >
            <Icon size={20} strokeWidth={1.9} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminShell({ active, searchPlaceholder, searchAction = "/admin", searchValue = "", children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  // Cierra el drawer móvil si la ruta cambia mientras estaba abierto.
  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;
    previousPathnameRef.current = pathname;
    const timeout = window.setTimeout(() => setMobileMenuOpen(false), 0);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  // Evita que el fondo haga scroll mientras el menú móvil está abierto.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2D1F23]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        {/* Sidebar fija de escritorio (lg en adelante) */}
        <aside className="hidden border-r border-[#EBC8D2] bg-white lg:flex lg:flex-col">
          <div className="px-7 pb-12 pt-16">
            <h1 className="text-[26px] font-bold leading-tight text-[#9E3659]">
              Beauty
              <br />
              Cosmetics
            </h1>
            <p className="mt-2 text-[15px] text-[#554246]">Admin Panel</p>
          </div>

          <NavLinks active={active} />

          <form action={logoutAdmin} className="mx-7 mb-9">
            <button type="submit" className="flex items-center gap-3 text-[15px] font-semibold text-[#554246] transition-colors hover:text-[#9E3659]">
              <LogOut size={20} strokeWidth={1.9} />
              Cerrar Sesion
            </button>
          </form>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-[#EBC8D2] bg-white/95 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menú"
                aria-expanded={mobileMenuOpen}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-[#EBC8D2] text-[#9E3659] transition-colors hover:bg-[#FCEDF0] lg:hidden"
              >
                <Menu size={22} strokeWidth={1.9} />
              </button>

              {searchPlaceholder ? (
                <form action={searchAction} className="flex min-h-11 w-full max-w-[1050px] flex-col gap-2 rounded-[8px] bg-[#F6F6F6] px-4 py-2 text-[#6B6063] sm:h-11 sm:flex-row sm:items-center sm:py-0">
                  <Search size={20} strokeWidth={1.8} />
                  <input
                    name="q"
                    defaultValue={searchValue}
                    aria-label={searchPlaceholder}
                    placeholder={searchPlaceholder}
                    className="h-10 w-full bg-transparent text-[15px] outline-none placeholder:text-[#7A7F8A] sm:h-full"
                  />
                  <button className="rounded-[4px] bg-[#9E3659] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#84304C]">Buscar</button>
                </form>
              ) : (
                <div className="flex h-11 flex-1 items-center text-[16px] font-bold text-[#9E3659] lg:hidden">
                  Beauty Cosmetics Admin
                </div>
              )}
            </div>
          </header>

          {children}
        </section>
      </div>

      {/* Drawer del menú móvil (debajo de lg) */}
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex h-full w-full max-w-[300px] flex-col bg-white shadow-2xl">
            <div className="flex items-start justify-between px-7 pb-8 pt-8">
              <div>
                <h1 className="text-[24px] font-bold leading-tight text-[#9E3659]">
                  Beauty
                  <br />
                  Cosmetics
                </h1>
                <p className="mt-2 text-[14px] text-[#554246]">Admin Panel</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
                className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#5F5F61] transition-colors hover:bg-[#FCEDF0] hover:text-[#9E3659]"
              >
                <X size={22} strokeWidth={1.9} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <NavLinks active={active} onNavigate={() => setMobileMenuOpen(false)} />
            </div>

            <form action={logoutAdmin} className="mx-7 mb-9 mt-4">
              <button type="submit" className="flex items-center gap-3 text-[15px] font-semibold text-[#554246] transition-colors hover:text-[#9E3659]">
                <LogOut size={20} strokeWidth={1.9} />
                Cerrar Sesion
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
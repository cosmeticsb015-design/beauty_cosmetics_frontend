import Link from "next/link";
import {
  FolderKanban,
  LogOut,
  MapPinHouse,
  Package,
  Search,
  ShoppingBag,
  Store,
  Truck,
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

export default function AdminShell({ active, searchPlaceholder, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2D1F23]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-[#EBC8D2] bg-white lg:flex lg:flex-col">
          <div className="px-7 pb-12 pt-16">
            <h1 className="text-[26px] font-bold leading-tight text-[#9E3659]">
              Beauty
              <br />
              Cosmetics
            </h1>
            <p className="mt-2 text-[15px] text-[#554246]">Admin Panel</p>
          </div>

          <nav className="flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === activeByKey[active];

              return (
                <Link
                  key={item.label}
                  href={item.href}
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

          <button className="mx-7 mb-9 flex items-center gap-3 text-[15px] font-semibold text-[#554246] transition-colors hover:text-[#9E3659]">
            <LogOut size={20} strokeWidth={1.9} />
            Cerrar Sesion
          </button>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-[#EBC8D2] bg-white/95 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center gap-3">
              {searchPlaceholder ? (
                <div className="flex h-11 w-full max-w-[1050px] items-center gap-3 rounded-[8px] bg-[#F6F6F6] px-4 text-[#6B6063]">
                  <Search size={20} strokeWidth={1.8} />
                  <input
                    aria-label={searchPlaceholder}
                    placeholder={searchPlaceholder}
                    className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-[#7A7F8A]"
                  />
                </div>
              ) : (
                <div className="h-11" />
              )}
            </div>
          </header>

          {children}
        </section>
      </div>
    </div>
  );
}

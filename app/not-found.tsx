import Link from "next/link";
import { Home, Search, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] bg-[#FFF7F9] px-4 py-20 text-[#2D1F23]">
      <div className="mx-auto flex max-w-4xl flex-col items-center rounded-[18px] border border-[#F1CCD5] bg-white px-6 py-14 text-center shadow-sm md:px-12">
        <span className="rounded-full bg-[#FCEDF0] px-5 py-2 text-sm font-bold uppercase tracking-[0.18em] text-[#9E3659]">Error 404</span>
        <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">Esta página no está disponible</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#6B6063]">El enlace puede haber cambiado o el contenido ya no existe. Te ayudamos a volver a Beauty Cosmetics para seguir explorando productos.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-[#9E3659] px-6 text-sm font-bold text-white transition hover:bg-[#84304C]"><Home size={18} /> Volver al inicio</Link>
          <Link href="/catalog" className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] border border-[#E7BFC9] bg-white px-6 text-sm font-bold text-[#9E3659] transition hover:bg-[#FCEDF0]"><ShoppingBag size={18} /> Ver catálogo</Link>
        </div>
        <div className="mt-10 flex items-center gap-3 rounded-full bg-[#FAFAFA] px-5 py-3 text-sm text-[#6B6063]"><Search size={17} /> También puedes usar el buscador del sitio para encontrar tu producto.</div>
      </div>
    </section>
  );
}

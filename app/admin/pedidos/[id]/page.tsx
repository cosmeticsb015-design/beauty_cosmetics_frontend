import Link from "next/link";
import {
  CreditCard,
  MessageSquareText,
  ReceiptText,
  Truck,
  UserRound,
  Zap,
} from "lucide-react";
import AdminShell from "../../components/AdminShell";

const items = [
  {
    name: "Serum Regenerador Nocturno",
    volume: "30ml",
    sku: "BC-SER-001",
    price: "$890.00",
    quantity: 1,
    subtotal: "$890.00",
    image: "bg-[linear-gradient(135deg,#3b2618,#f7f1ed_58%,#6e4b34)]",
  },
  {
    name: "Crema Hidratante Intensa",
    volume: "50ml",
    sku: "BC-CRM-042",
    price: "$650.00",
    quantity: 2,
    subtotal: "$1,300.00",
    image: "bg-[linear-gradient(135deg,#6b4a34,#f5eee8_58%,#b39076)]",
  },
  {
    name: "Limpiador Purificante",
    volume: "200ml",
    sku: "BC-CLNS-12",
    price: "$420.00",
    quantity: 1,
    subtotal: "$420.00",
    image: "bg-[linear-gradient(135deg,#cfe9e6,#f7fbfa_58%,#84aaa5)]",
  },
];

function ItemThumb({ className }: { className: string }) {
  return (
    <div className={`relative h-16 w-12 overflow-hidden rounded-[3px] ${className}`}>
      <div className="absolute bottom-2 left-1/2 h-8 w-4 -translate-x-1/2 rounded-t-[3px] bg-white/85 shadow-sm" />
      <div className="absolute bottom-10 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#2D1F23]/50" />
    </div>
  );
}

export default function AdminOrderDetailPage() {
  return (
    <AdminShell active="orders">
      <main className="mx-auto w-full max-w-[1080px] px-4 py-9 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2 text-[13px] text-[#554246]">
              <Link href="/admin/pedidos" className="transition-colors hover:text-[#9E3659]">
                Pedidos
              </Link>
              <span>›</span>
              <span className="font-semibold text-[#2D1F23]">Pedido #BC-82934</span>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <h2 className="text-[38px] font-bold leading-none text-[#1F1F22]">Pedido #BC-82934</h2>
              <span className="rounded-full bg-emerald-300/80 px-5 py-2 text-[14px] font-medium text-emerald-800">
                En Transito
              </span>
            </div>
          </div>

          <button className="inline-flex h-11 items-center justify-center gap-3 rounded-[4px] bg-[#9E3659] px-6 text-[15px] font-semibold tracking-wide text-white transition-colors hover:bg-[#84304C]">
            <MessageSquareText size={20} strokeWidth={1.8} />
            Contactar Cliente
          </button>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-3">
          <article className="rounded-[8px] border border-[#E7E4E5] bg-white p-7">
            <div className="mb-5 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#F0EEEE] text-[#9E3659]">
                <UserRound size={22} strokeWidth={1.8} />
              </span>
              <p className="text-[15px] font-semibold uppercase tracking-wide text-[#6B6063]">Cliente</p>
            </div>
            <h3 className="text-[24px] font-bold text-[#1F1F22]">Valeria Montes</h3>
            <p className="mt-2 text-[16px] text-[#6B6063]">v.montes@luxury.com</p>
            <p className="mt-1 text-[16px] text-[#6B6063]">+52 55 1234 5678</p>
          </article>

          <article className="rounded-[8px] border border-[#E7E4E5] bg-white p-7">
            <div className="mb-5 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#F0EEEE] text-[#9E3659]">
                <Truck size={22} strokeWidth={1.8} />
              </span>
              <p className="text-[15px] font-semibold uppercase tracking-wide text-[#6B6063]">Envio</p>
            </div>
            <h3 className="text-[18px] font-bold text-[#1F1F22]">Calle etc..</h3>
            <p className="mt-8 flex items-center gap-2 text-[18px] text-[#6B6063]">
              <Zap size={18} strokeWidth={1.8} />
              Envio Express 24-48h
            </p>
          </article>

          <article className="rounded-[8px] border border-[#E7E4E5] bg-white p-7">
            <div className="mb-5 flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#F0EEEE] text-[#9E3659]">
                <ReceiptText size={22} strokeWidth={1.8} />
              </span>
              <p className="text-[15px] font-semibold uppercase tracking-wide text-[#6B6063]">Pago</p>
            </div>
            <h3 className="flex items-center gap-2 text-[18px] font-bold text-[#1F1F22]">
              <CreditCard size={20} strokeWidth={1.9} />
              Visa terminada en 4242
            </h3>
            <p className="mt-3 flex items-center gap-2 text-[16px] font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-700" />
              Pagado
            </p>
          </article>
        </div>

        <section className="mt-8 overflow-hidden rounded-[8px] border border-[#E7E4E5] bg-white">
          <div className="flex items-center justify-between px-7 py-7">
            <h3 className="text-[28px] font-bold text-[#1F1F22]">Articulos del Pedido</h3>
            <p className="text-[16px] font-semibold text-[#6B6063]">4 Articulos</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead className="bg-[#F4F4F4] text-left text-[14px] font-bold uppercase tracking-[0.16em] text-[#6B6063]">
                <tr>
                  <th className="px-48 py-5">Producto</th>
                  <th className="px-4 py-5">SKU</th>
                  <th className="px-4 py-5">Precio</th>
                  <th className="px-4 py-5">Cant.</th>
                  <th className="px-4 py-5">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.sku} className="border-b border-[#E7E4E5] last:border-b-0">
                    <td className="px-48 py-6">
                      <div className="flex items-center gap-6">
                        <ItemThumb className={item.image} />
                        <div>
                          <p className="max-w-[170px] text-[18px] font-bold leading-tight text-[#1F1F22]">{item.name}</p>
                          <p className="mt-1 text-[13px] text-[#6B6063]">{item.volume}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-[15px] font-semibold text-[#6B6063]">{item.sku}</td>
                    <td className="px-4 py-6 text-[17px] text-[#1F1F22]">{item.price}</td>
                    <td className="px-4 py-6 text-center text-[17px] text-[#1F1F22]">{item.quantity}</td>
                    <td className="px-4 py-6 text-[17px] font-bold text-[#1F1F22]">{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-8 flex justify-end">
          <section className="w-full rounded-[8px] border border-[#E7E4E5] bg-white p-7 sm:w-[340px]">
            <div className="space-y-4 text-[17px] text-[#554246]">
              <div className="flex justify-between gap-6">
                <span>Subtotal</span>
                <span>$2,610.00</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Envio</span>
                <span>$150.00</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Impuestos (16%)</span>
                <span>$417.60</span>
              </div>
            </div>
            <div className="mt-5 flex justify-between gap-6 border-t border-[#E7E4E5] pt-5 text-[26px] font-bold text-[#9E3659]">
              <span>Total</span>
              <span>$3,177.60</span>
            </div>
          </section>
        </div>
      </main>
    </AdminShell>
  );
}

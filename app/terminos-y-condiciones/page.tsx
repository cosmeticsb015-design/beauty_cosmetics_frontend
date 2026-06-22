import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  CreditCard,
  FileText,
  MessageCircle,
  PackageCheck,
  RefreshCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";

const buildSectionId = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const termsSections = [
  {
    title: "Información general",
    icon: FileText,
    paragraphs: [
      "Beauty Cosmetics es una tienda especializada en maquillaje y skincare original, ofreciendo productos de marcas reconocidas internacionalmente a clientes dentro de El Salvador.",
      "Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor una vez publicadas en el sitio web.",
    ],
  },
  {
    title: "Productos",
    icon: Sparkles,
    paragraphs: [
      "Todos los productos comercializados por Beauty Cosmetics son originales y cuidadosamente seleccionados.",
      "Aunque nos esforzamos por mostrar imágenes y descripciones precisas, los tonos, colores y apariencias pueden variar ligeramente debido a la iluminación utilizada en las fotografías y a la configuración de pantalla de cada dispositivo.",
      "Recomendamos consultar fotografías y videos adicionales del producto antes de realizar una compra.",
    ],
  },
  {
    title: "Disponibilidad",
    icon: PackageCheck,
    paragraphs: [
      "La disponibilidad de los productos está sujeta a existencias al momento de procesar el pedido.",
      "En caso de que un producto adquirido no se encuentre disponible, nuestro equipo se pondrá en contacto con el cliente para ofrecer una solución.",
    ],
  },
  {
    title: "Precios",
    icon: CreditCard,
    paragraphs: [
      "Todos los precios mostrados en el sitio web están expresados en dólares estadounidenses (USD) y pueden ser modificados sin previo aviso.",
      "Las promociones, descuentos y ofertas especiales estarán sujetas a las condiciones establecidas para cada campaña.",
    ],
  },
  {
    title: "Pedidos y pagos",
    icon: ShieldCheck,
    paragraphs: [
      "Una vez confirmado y procesado el pedido, no será posible cancelarlo.",
      "Si el cliente necesita modificar un tono o producto, deberá notificarlo lo antes posible y únicamente podrá realizarse el cambio si el pedido aún no ha sido preparado o enviado.",
      "Beauty Cosmetics se reserva el derecho de cancelar o rechazar pedidos que presenten información incorrecta, sospecha de fraude o errores involuntarios en precios o inventario.",
    ],
  },
  {
    title: "Envíos",
    icon: Truck,
    paragraphs: [
      "Realizamos envíos a todo El Salvador.",
      "Los pedidos son procesados en un plazo estimado de 24 a 48 horas hábiles. Este tiempo puede variar durante fines de semana, días festivos, temporadas de alta demanda o situaciones fuera de nuestro control.",
      "Los tiempos de entrega son estimados y no constituyen una garantía de horario específico.",
      "Las entregas son realizadas de acuerdo con las rutas y programación del servicio de transporte utilizado.",
    ],
  },
  {
    title: "Retiro en sucursal",
    icon: Store,
    paragraphs: [
      "Los clientes que seleccionen la opción de retiro en sucursal podrán recoger su pedido en la ubicación elegida al momento de la compra.",
      "Es indispensable esperar la confirmación de Beauty Cosmetics antes de presentarse a retirar el pedido.",
    ],
  },
  {
    title: "Cambios, devoluciones y reembolsos",
    icon: RefreshCcw,
    paragraphs: [
      "Las políticas de cambios, devoluciones y reembolsos se encuentran reguladas en nuestra Política de Cambios y Devoluciones publicada en este sitio web.",
    ],
  },
  {
    title: "Pedidos especiales",
    icon: Clock3,
    paragraphs: [
      "Los productos solicitados bajo pedido especial estarán sujetos a disponibilidad, tiempos de gestión y condiciones particulares que serán comunicadas al cliente antes de confirmar la compra.",
    ],
  },
  {
    title: "Propiedad intelectual",
    icon: BadgeCheck,
    paragraphs: [
      "Todo el contenido del sitio web, incluyendo imágenes, textos, logotipos, diseños y elementos gráficos, es propiedad de Beauty Cosmetics o cuenta con autorización para su uso y no podrá ser reproducido sin autorización previa.",
    ],
  },
  {
    title: "Limitación de responsabilidad",
    icon: Scale,
    paragraphs: [
      "Beauty Cosmetics no será responsable por retrasos ocasionados por terceros, servicios de transporte, eventos de fuerza mayor o circunstancias fuera de nuestro control razonable.",
    ],
  },
  {
    title: "Contacto",
    icon: MessageCircle,
    paragraphs: [
      "Si tienes consultas relacionadas con estos Términos y Condiciones, puedes comunicarte con nosotros a través de los canales de contacto publicados en nuestro sitio web.",
    ],
  },
];

const highlights = [
  { title: "Productos originales", desc: "Maquillaje y skincare seleccionado con cuidado.", icon: BadgeCheck },
  { title: "El Salvador", desc: "Envíos y retiros disponibles dentro del país.", icon: Truck },
  { title: "Compra informada", desc: "Revisa tonos, disponibilidad y condiciones antes de confirmar.", icon: FileText },
];

export const metadata = {
  title: "Términos y Condiciones | Beauty Cosmetics El Salvador",
  description:
    "Consulta términos de compra, envíos a todo El Salvador, disponibilidad, pagos, retiros en sucursales de San Miguel y Usulután, y condiciones de uso de Beauty Cosmetics SV.",
  alternates: { canonical: "/terminos-y-condiciones" },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#FCEDF0] px-4 py-16 md:px-8 md:py-24">
        <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#F5C6D0]/60 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#FBD5E0]/80 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8A0B5]/50 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C15074] shadow-sm">
              <Scale size={15} strokeWidth={1.8} />
              Legal / Términos de compra
            </div>
            <h1 className="max-w-3xl font-serif text-4xl font-normal uppercase leading-tight tracking-wide text-[#2D1F23] md:text-6xl">
              Términos y Condiciones
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#554246] md:text-base">
              Bienvenido a Beauty Cosmetics. Al acceder, navegar o realizar una compra a través de nuestro sitio web,
              aceptas los presentes Términos y Condiciones.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#terminos"
                className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#C15074] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#9E3659]"
              >
                Leer términos
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center rounded-[4px] border border-[#C15074]/30 bg-white/70 px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#C15074] transition-colors hover:bg-white"
              >
                Ver preguntas frecuentes
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-[0_14px_40px_rgba(193,80,116,0.10)] backdrop-blur">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FBD5E0] text-[#9E3659]">
                    <Icon size={21} strokeWidth={1.8} />
                  </div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#2D1F23]">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#8A7A7E]">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="terminos" className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[280px_1fr] md:px-8 md:py-20">
        <aside className="md:sticky md:top-[136px] md:self-start">
          <div className="rounded-2xl border border-[#F0E4E8] bg-[#FDF5F7] p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C15074]">Contenido</p>
            <div className="mt-5 flex flex-col gap-2">
              {termsSections.map((section, index) => (
                <a
                  key={section.title}
                  href={`#${buildSectionId(section.title)}`}
                  className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#554246] transition-colors hover:text-[#C15074]"
                >
                  {String(index + 1).padStart(2, "0")}. {section.title}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-5">
          {termsSections.map((section, index) => {
            const Icon = section.icon;
            const id = buildSectionId(section.title);

            return (
              <article key={section.title} id={id} className="rounded-2xl border border-[#F0E4E8] bg-white p-6 shadow-sm md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FCEDF0] text-[#C15074]">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C15074]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-[#2D1F23]">{section.title}</h2>
                    <div className="mt-4 space-y-3 text-sm leading-7 text-[#554246] md:text-base">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <article className="rounded-[28px] bg-[#2D1F23] p-6 text-white md:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F5C6D0]">Adicional</p>
            <h2 className="mt-3 font-serif text-3xl font-normal uppercase tracking-wide md:text-4xl">
              Resultados y uso de productos
            </h2>
            <p className="mt-5 max-w-4xl text-sm leading-7 text-white/78 md:text-base">
              Beauty Cosmetics no garantiza resultados específicos, ya que estos pueden variar según las características
              individuales de cada persona, incluyendo tipo de piel, rutina de cuidado y condiciones particulares de uso.
            </p>
          </article>

          <div className="rounded-2xl border border-[#F0E4E8] bg-[#FDF5F7] p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C15074]">¿Tienes dudas?</p>
                <h2 className="mt-2 text-2xl font-bold text-[#2D1F23]">Estamos para ayudarte antes de tu compra.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8A7A7E]">
                  Revisa nuestras preguntas frecuentes o explora el catálogo para confirmar detalles de productos,
                  tonos, disponibilidad y opciones de entrega.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center rounded-[4px] bg-[#C15074] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#9E3659]"
                >
                  Ir a FAQ
                </Link>
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center rounded-[4px] border border-[#C15074]/30 bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#C15074] transition-colors hover:bg-[#FCEDF0]"
                >
                  Ver catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

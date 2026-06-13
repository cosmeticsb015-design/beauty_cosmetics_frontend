import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Gift,
  HelpCircle,
  MapPin,
  MessageCircle,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

const faqItems = [
  {
    question: "¿Los productos son originales?",
    answer: [
      "Sí. Todos nuestros productos son 100% originales y provienen de las tiendas internacionales donde distribuyen las marcas. La autenticidad y calidad de cada producto son una de nuestras principales prioridades.",
    ],
  },
  {
    question: "¿Cuándo recibiré mi pedido?",
    answer: [
      "Los pedidos realizados de lunes a viernes son procesados y preparados en un plazo estimado de 24 a 48 horas hábiles.",
      "Este tiempo puede variar durante fines de semana, días festivos, temporadas de alta demanda o situaciones fuera de nuestro control. Una vez tu pedido haya sido despachado, recibirás la información correspondiente para su seguimiento.",
    ],
  },
  {
    question: "¿Puedo cambiar el tono o producto de mi pedido?",
    answer: [
      "Si necesitas realizar un cambio de tono, deberás notificarnos lo antes posible y únicamente podremos realizar modificaciones si tu pedido aún no ha sido enviado.",
      "Una vez el pedido haya sido preparado o despachado, no será posible realizar cambios.",
    ],
  },
  {
    question: "¿Realizan cambios, devoluciones o reembolsos?",
    answer: [
      "Por razones de higiene, seguridad y control de calidad, no realizamos cambios, devoluciones ni reembolsos en productos de maquillaje, skincare o cuidado personal una vez entregados.",
      "Cada producto es cuidadosamente inspeccionado antes de salir de nuestra tienda o ser preparado para envío.",
    ],
  },
  {
    question: "¿Existen excepciones para cambios o reembolsos?",
    answer: ["Sí. Únicamente podrán evaluarse solicitudes en los siguientes casos:"],
    bullets: ["Producto dañado durante el envío.", "Producto incorrecto.", "Producto faltante dentro del pedido."],
    footer:
      "La situación deberá ser reportada dentro de las primeras 24 horas posteriores a la entrega y acompañada de evidencia fotográfica.",
  },
  {
    question: "¿Qué debo hacer si mi pedido llegó dañado, incorrecto o incompleto?",
    answer: [
      "Contáctanos dentro de las primeras 24 horas posteriores a la entrega y envíanos fotografías claras de:",
    ],
    bullets: [
      "El empaque exterior.",
      "El producto dañado o incorrecto.",
      "La guía o etiqueta de envío.",
      "El contenido completo recibido.",
    ],
    footer: "Nuestro equipo evaluará el caso y te brindará una solución a la mayor brevedad posible.",
  },
  {
    question: "Elegí retiro en sucursal. ¿Dónde y cuándo puedo recoger mi pedido?",
    answer: [
      "Si seleccionaste la opción de retiro en sucursal al momento de realizar tu compra, podrás elegir entre nuestras sucursales de San Miguel o Usulután.",
      "Por favor espera nuestra confirmación antes de presentarte a retirar tu pedido. Te notificaremos cuando se encuentre listo para entrega, evitando así cualquier inconveniente.",
      "Las direcciones y horarios de nuestras sucursales se encuentran disponibles en nuestro sitio web.",
    ],
  },
  {
    question: "¿Necesito ayuda para elegir productos?",
    answer: [
      "¡Por supuesto! Estaremos encantados de ayudarte. Ofrecemos asesoría personalizada para ayudarte a encontrar los productos más adecuados según tus necesidades, preferencias, tipo de piel y objetivos.",
    ],
  },
  {
    question: "Quiero hacer un regalo, pero no sé qué elegir. ¿Pueden ayudarme?",
    answer: [
      "Contamos con asesoría personalizada para ayudarte a encontrar el regalo ideal.",
      "También ofrecemos Gift Cards en el monto que desees, permitiendo que esa persona especial elija exactamente los productos que más le gustan o necesita.",
      "Porque a veces el mejor regalo es la libertad de elegir.",
    ],
  },
  {
    question: "¿Los tonos pueden variar respecto a las fotografías?",
    answer: [
      "Sí. Aunque procuramos mostrar los productos de la manera más fiel posible, los tonos pueden variar ligeramente dependiendo de la iluminación utilizada en las fotografías y de la configuración de pantalla de cada dispositivo.",
      "Si tienes dudas sobre un tono específico, te recomendamos consultar fotografías y videos adicionales del producto antes de realizar tu compra, ya que estos pueden ayudarte a apreciar mejor su apariencia en diferentes condiciones de luz y distintos tonos de piel.",
    ],
  },
  {
    question: "¿Qué sucede si no estoy disponible al momento de la entrega?",
    answer: [
      "En caso de que no sea posible realizar la entrega, la reprogramación y cualquier cargo adicional dependerán de las políticas del servicio de transporte utilizado.",
    ],
  },
  {
    question: "¿Puedo solicitar una hora específica para la entrega de mi pedido?",
    answer: [
      "No podemos garantizar horarios específicos de entrega.",
      "Nuestros pedidos son distribuidos a través de servicios de transporte y delivery que operan mediante rutas previamente establecidas, por lo que las entregas se realizan dentro de la programación de cada ruta.",
      "Si la entrega no puede completarse por ausencia del destinatario, la reprogramación y cualquier costo adicional estarán sujetos a las políticas del servicio de transporte utilizado.",
    ],
  },
];

const highlights = [
  { title: "Originales", desc: "Productos auténticos y verificados.", icon: BadgeCheck },
  { title: "24-48 horas", desc: "Preparación en días hábiles.", icon: Clock3 },
  { title: "Soporte", desc: "Asesoría antes y después de comprar.", icon: MessageCircle },
];

const quickLinks = [
  { label: "Ver catálogo", href: "/catalog", icon: Sparkles },
  { label: "Gift Cards", href: "/#gift-card", icon: Gift },
  { label: "Retiro en sucursal", href: "#retiro-en-sucursal", icon: MapPin },
];

const policyCards = [
  {
    title: "Envíos y entregas",
    description: "Revisa los tiempos de preparación, seguimiento y disponibilidad al recibir tu pedido.",
    icon: Truck,
  },
  {
    title: "Cambios y casos especiales",
    description: "Te explicamos cuándo podemos evaluar productos dañados, incorrectos o faltantes.",
    icon: RotateCcw,
  },
  {
    title: "Calidad garantizada",
    description: "Inspeccionamos cuidadosamente cada producto antes de entregarlo o enviarlo.",
    icon: ShieldCheck,
  },
];

export const metadata = {
  title: "Preguntas Frecuentes | Beauty Cosmetics",
  description: "Resuelve tus dudas sobre productos originales, envíos, retiros en sucursal, cambios, regalos y asesoría personalizada.",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#FCEDF0] px-4 py-16 md:px-8 md:py-24">
        <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#F5C6D0]/60 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#FBD5E0]/80 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8A0B5]/50 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C15074] shadow-sm">
              <HelpCircle size={15} strokeWidth={1.8} />
              Centro de ayuda
            </div>
            <h1 className="max-w-3xl font-serif text-4xl font-normal uppercase leading-tight tracking-wide text-[#2D1F23] md:text-6xl">
              Preguntas frecuentes
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#554246] md:text-base">
              Encuentra respuestas claras sobre productos originales, tiempos de entrega, retiros en sucursal,
              cambios excepcionales y asesoría para elegir tus productos favoritos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#faq-list"
                className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#C15074] px-7 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#9E3659]"
              >
                Ver preguntas
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center rounded-[4px] border border-[#C15074]/30 bg-white/70 px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#C15074] transition-colors hover:bg-white"
              >
                Explorar productos
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

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {policyCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="rounded-2xl border border-[#F0E4E8] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#FCEDF0] text-[#C15074]">
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <h2 className="text-base font-bold text-[#2D1F23]">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#8A7A7E]">{card.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="faq-list" className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 md:grid-cols-[260px_1fr] md:px-8 md:pb-24">
        <aside className="md:sticky md:top-[136px] md:self-start">
          <div className="rounded-2xl border border-[#F0E4E8] bg-[#FDF5F7] p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C15074]">Accesos rápidos</p>
            <div className="mt-5 flex flex-col gap-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.label} href={link.href} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#554246] transition-colors hover:text-[#C15074]">
                    <Icon size={17} strokeWidth={1.8} className="text-[#C15074]" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-4">
          {faqItems.map((item, index) => (
            <details
              key={item.question}
              id={item.question.includes("sucursal") ? "retiro-en-sucursal" : undefined}
              className="group rounded-2xl border border-[#F0E4E8] bg-white p-5 shadow-sm open:border-[#E8A0B5] open:bg-[#FFF8FA]"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-5 text-left">
                <span className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FCEDF0] text-xs font-bold text-[#C15074]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="pt-1 text-base font-bold leading-6 text-[#2D1F23]">{item.question}</span>
                </span>
                <span className="mt-1 text-2xl font-light leading-none text-[#C15074] transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="ml-12 mt-4 space-y-3 border-l border-[#F5C6D0] pl-5 text-sm leading-7 text-[#554246]">
                {item.answer.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {item.bullets && (
                  <ul className="space-y-2">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <PackageCheck size={16} strokeWidth={1.8} className="mt-1 shrink-0 text-[#C15074]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {item.footer && <p>{item.footer}</p>}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

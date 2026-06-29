import { Clock3, ExternalLink, MapPin, Store } from "lucide-react";

const sucursales = [
  {
    id: "san-miguel",
    nombre: "San Miguel Casa Matriz",
    direccion: ["Urbanización España", "Calle Suiza (principal), pol. 12", "N-1, San Miguel"],
    horarios: ["Lunes a viernes: 10:00 AM - 6:30 PM", "Sábados: 10:30 AM - 5:30 PM"],
    mapsUrl: "https://maps.app.goo.gl/K5RwqeqXaL2MHGeN6",
  },
  {
    id: "usulutan",
    nombre: "Sucursal Plaza Mundo Usulután",
    direccion: ["Entrada principal, Nivel 2", "En el pasillo del súper"],
    horarios: ["Lunes a domingo: 10:30 AM - 7:00 PM"],
    mapsUrl: "https://maps.app.goo.gl/k7EzCyrpCmnPJbcQA",
  },
];

export default function HorarioSection() {
  return (
    <section id="horario-section" className="bg-white px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#FCEDF0]">
            <MapPin size={26} strokeWidth={1.8} className="text-[#9E3659]" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C15074]">Visítanos</p>
          <h2 className="mt-3 text-3xl font-normal tracking-wide text-[#2D1F23] md:text-4xl">
            Horario de Atención
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#8A7A7E]">
            Elige tu sucursal más cercana y abre el pin en Google Maps para llegar fácilmente.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {sucursales.map((sucursal) => (
            <article
              key={sucursal.id}
              style={{ background: "linear-gradient(135deg, #C15074 0%, #9E3659 100%)" }}
              className="relative overflow-hidden rounded-[22px] border border-[#C15074] p-6 text-white shadow-sm shadow-[#C15074]/25 transition-shadow hover:shadow-md hover:shadow-[#C15074]/30 md:p-8"
            >
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[42px] bg-white/12" />
              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/25">
                  <Store size={22} strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-bold uppercase tracking-widest text-white">{sucursal.nombre}</h3>

                <div className="mt-5 space-y-2 text-sm leading-6 text-white/90">
                  {sucursal.direccion.map((line) => (
                    <p key={line} className="flex gap-2">
                      <MapPin size={15} strokeWidth={1.8} className="mt-1 shrink-0 text-[#FBD5E0]" />
                      <span>{line}</span>
                    </p>
                  ))}
                </div>

                <div className="mt-5 border-t border-white/20 pt-4 text-sm leading-6 text-white/90">
                  {sucursal.horarios.map((line) => (
                    <p key={line} className="flex gap-2">
                      <Clock3 size={15} strokeWidth={1.8} className="mt-1 shrink-0 text-[#FBD5E0]" />
                      <span>{line}</span>
                    </p>
                  ))}
                </div>

                <a
                  href={sucursal.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9E3659] transition-colors hover:bg-[#FCEDF0] sm:w-auto"
                >
                  Abrir pin en Google Maps
                  <ExternalLink size={14} strokeWidth={2} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

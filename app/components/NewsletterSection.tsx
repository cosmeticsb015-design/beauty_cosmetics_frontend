import { MapPin } from "lucide-react";

const horario = [
  {
    id: "horario-semana",
    dias: "Lunes - Viernes",
    horas: "9:30 AM – 7:00 PM",
  },
  {
    id: "horario-sabado",
    dias: "Sábado",
    horas: "10:00 AM – 6:00 PM",
  },
];

export default function HorarioSection() {
  return (
    <section id="horario-section" className="py-20 bg-white flex justify-center items-center">
      <div className="max-w-xl w-full px-4 relative">

        {/* Card */}
        <div className="relative bg-white rounded-[16px] border border-[#F0E4E8] shadow-sm p-12 overflow-hidden">

          {/* Decorative pink square — top right corner */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#FCEDF0] rounded-bl-[40px]" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center">

            {/* Location pin icon */}
            <div className="w-16 h-16 rounded-[18px] bg-[#FCEDF0] flex items-center justify-center mb-8">
              <MapPin size={26} strokeWidth={1.8} className="text-[#9E3659]" />
            </div>

            <h2 className="text-2xl font-normal text-[#2D1F23] mb-10 tracking-wide">
              Horario de Atención
            </h2>

            {/* Schedule rows */}
            <div className="w-full flex flex-col">
              {horario.map((item, i) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between py-5 px-4">
                    <span className="text-base text-[#9E8A8E] font-normal">
                      {item.dias}
                    </span>
                    <span className="text-base font-bold text-[#2D1F23]">
                      {item.horas}
                    </span>
                  </div>
                  {i < horario.length - 1 && (
                    <div className="h-px bg-[#F0E4E8] mx-4" />
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

import { CalendarCheck, MessageCircle } from "lucide-react";
import { Reveal, Overline } from "./Reveal";
import { BookingForm } from "./BookingForm";
import { waLink, PHONE_LABEL } from "@/lib/site";

export const Booking = ({ preset }) => (
  <section id="agendar" data-testid="booking-section" className="relative overflow-hidden">
    <div className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-[#0088FF]/15 blur-[120px]" />
    <div className="relative mx-auto grid max-w-[1400px] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <Overline>// 03 — Agendamento</Overline>
            <h2 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.9] text-white sm:text-7xl">
              Marque sua<br /><span className="text-[#0088FF]">visita.</span>
            </h2>
            <p className="mt-6 max-w-sm text-base text-slate-300">
              Escolha o serviço, a data e o horário. Você recebe a confirmação da nossa equipe pelo WhatsApp.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-3"><CalendarCheck className="h-4 w-4 text-cyan-300" /> Seg–Sex 08h–18h · Sáb 08h–12h</li>
              <li className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-cyan-300" />
                Prefere conversar? <a data-testid="booking-whatsapp-link" href={waLink("Olá, Tecnoguard! Quero agendar um serviço.")} target="_blank" rel="noreferrer" className="text-white underline decoration-cyan-300/60 underline-offset-4 hover:text-cyan-200">{PHONE_LABEL}</a>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>
      <Reveal delay={0.1} className="lg:col-span-8">
        <div className="rounded-sm border border-cyan-400/15 bg-[#0E1626]/80 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <BookingForm preset={preset} />
        </div>
      </Reveal>
    </div>
  </section>
);

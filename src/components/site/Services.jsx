import { motion } from "framer-motion";
import { ArrowUpRight, BellRing, Cctv, Network, Wrench, Clock } from "lucide-react";
import { Reveal, Overline } from "./Reveal";

const MODS = ["Instalação", "Manutenção", "Preventiva"];

const Card = ({ id, idx, title, icon: Icon, img, text, onBook, className, tall }) => (
  <motion.article
    data-testid={`service-card-${id}`}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 0.9, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
    className={`group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-sm border border-cyan-400/10 bg-[#0E1626] ${className}`}
  >
    <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-60 saturate-50 transition-[transform,opacity] duration-[1200ms] ease-out group-hover:scale-105 group-hover:opacity-80" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/75 to-[#070B14]/10" />
    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_30%_100%,rgba(0,136,255,0.35),transparent_60%)]" />
    <div className="absolute left-6 top-6 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-cyan-200">
      <span>0{idx + 1}</span><span className="h-px w-8 bg-cyan-300/60" />
    </div>
    <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-300/30 bg-[#070B14]/60 text-cyan-300 backdrop-blur">
      <Icon className="h-5 w-5" />
    </div>
    <div className="relative p-6 sm:p-8">
      <h3 className={`font-display font-extrabold uppercase leading-none text-white ${tall ? "text-6xl sm:text-8xl" : "text-5xl sm:text-6xl"}`}>{title}</h3>
      <p className="mt-3 max-w-md text-sm text-slate-300 sm:text-base">{text}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {MODS.map((m) => (
          <span key={m} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-slate-200">{m}</span>
        ))}
        <button data-testid={`service-book-${id}`} onClick={() => onBook(id)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#070B14] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-cyan-200">
          Agendar <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  </motion.article>
);

export const Services = ({ onBook }) => (
  <section id="servicos" data-testid="services-section" className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
    <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
      <Reveal className="lg:col-span-7">
        <Overline>// 01 — Serviços</Overline>
        <h2 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.9] text-white sm:text-7xl">
          Três frentes.<br /><span className="text-[#0088FF]">Uma só proteção.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1} className="lg:col-span-5">
        <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
          Cuidamos do projeto à manutenção: instalamos, corrigimos falhas e mantemos seus sistemas funcionando com
          manutenção preventiva programada.
        </p>
      </Reveal>
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-[340px_340px_auto]">
      <Card id="cameras" idx={0} title="Câmeras" icon={Cctv} img="/img/cam2.jpg" tall onBook={onBook}
        text="Sistemas de CFTV para residências, comércios e empresas, com acesso pelo celular."
        className="lg:col-span-7 lg:row-span-2" />
      <Card id="alarmes" idx={1} title="Alarmes" icon={BellRing} img="/img/tech1.jpg" onBook={onBook}
        text="Centrais, sensores e sirenes configurados para responder na hora certa."
        className="lg:col-span-5" />
      <Card id="redes" idx={2} title="Redes" icon={Network} img="/img/net1.jpg" onBook={onBook}
        text="Cabeamento estruturado, racks e Wi-Fi estável para quem não pode parar."
        className="lg:col-span-5" />

      <Reveal className="lg:col-span-8">
        <div data-testid="service-preventiva" className="flex h-full flex-col justify-between gap-8 rounded-sm border border-cyan-400/10 bg-[#0E1626] p-6 sm:flex-row sm:items-end sm:p-8">
          <div>
            <Wrench className="h-6 w-6 text-cyan-300" />
            <h3 className="mt-5 font-display text-4xl font-extrabold uppercase text-white sm:text-5xl">Manutenção preventiva</h3>
            <p className="mt-3 max-w-lg text-sm text-slate-300 sm:text-base">
              Revisões periódicas em alarmes, câmeras e redes para evitar falhas antes que elas aconteçam.
            </p>
          </div>
          <button data-testid="service-book-preventiva" onClick={() => onBook(null, "preventiva")}
            className="shrink-0 rounded-full border border-cyan-300/40 px-6 py-3 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-300 hover:text-[#070B14]">
            Programar revisão
          </button>
        </div>
      </Reveal>
      <Reveal delay={0.1} className="lg:col-span-4">
        <div data-testid="service-hours" className="h-full rounded-sm bg-[#0088FF] p-6 text-white sm:p-8">
          <Clock className="h-6 w-6" />
          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-white/80">Horário de atendimento</p>
          <div className="mt-3 space-y-1 font-display text-3xl font-bold uppercase">
            <p>Seg–Sex · 08h–18h</p>
            <p>Sábado · 08h–12h</p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const WORDS = ["Alarmes", "Câmeras", "Redes", "Instalação", "Manutenção", "Preventiva", "Chapecó — SC"];

const Row = () => (
  <div className="flex shrink-0 items-center">
    {WORDS.map((w, i) => (
      <span key={w} className="flex items-center">
        <span className={`font-display text-5xl font-extrabold uppercase tracking-tight sm:text-7xl lg:text-8xl ${i % 2 ? "text-stroke" : "text-slate-100"}`}>
          {w}
        </span>
        <svg viewBox="0 0 24 24" className="mx-6 h-6 w-6 text-[#0088FF] sm:mx-10 sm:h-8 sm:w-8" fill="currentColor"><path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" /></svg>
      </span>
    ))}
  </div>
);

export const Marquee = () => (
  <section data-testid="marquee" aria-label="Serviços" className="relative overflow-hidden border-y border-cyan-400/10 bg-[#0A1120] py-8 sm:py-10">
    <div className="marquee-track flex w-max">
      <Row />
      <Row />
    </div>
  </section>
);

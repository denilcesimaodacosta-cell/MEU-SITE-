import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, Overline } from "./Reveal";

const STEPS = [
  { t: "Agendamento", d: "Escolha o serviço, a data e o horário direto pelo site." },
  { t: "Diagnóstico", d: "Avaliamos o local e indicamos a melhor solução para você." },
  { t: "Execução", d: "Instalação ou manutenção feita com cuidado e organização." },
  { t: "Testes", d: "Testamos tudo e mostramos o funcionamento antes de sair." },
];

export const Process = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section id="processo" data-testid="process-section" className="relative border-t border-cyan-400/10 bg-[#0A1120]">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12">
        <div ref={ref} className="lg:col-span-5">
          <Reveal>
            <Overline>// 02 — Como funciona</Overline>
            <h2 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.9] text-white sm:text-7xl">
              Do clique<br />à <span className="text-stroke">entrega.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="chamfer relative mt-10 aspect-square overflow-hidden bg-[#070B14]">
              <motion.img style={{ y, scale: 1.25 }} src="/img/logo.jpg" alt="Logo Tecnoguard Manutenções e Instalações"
                className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
        <ol className="lg:col-span-7 lg:pt-6">
          {STEPS.map((s, i) => (
            <motion.li key={s.t} data-testid={`process-step-${i + 1}`}
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group grid grid-cols-[auto_1fr] gap-6 border-b border-white/10 py-8 sm:gap-10 sm:py-10">
              <span className="font-mono text-sm text-cyan-300">0{i + 1}</span>
              <div>
                <h3 className="font-display text-4xl font-bold uppercase text-white transition-colors group-hover:text-[#38a8ff] sm:text-5xl">{s.t}</h3>
                <p className="mt-2 max-w-md text-sm text-slate-300 sm:text-base">{s.d}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

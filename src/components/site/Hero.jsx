import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, MessageCircle } from "lucide-react";
import { scrollToId, waLink } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1];
const LINES = [
  { text: "Segurança", cls: "text-white" },
  { text: "que não", cls: "text-white" },
  { text: "pisca.", cls: "text-stroke italic" },
];

const Clock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span>{now.toLocaleDateString("pt-BR")} {now.toLocaleTimeString("pt-BR")}</span>;
};

const Feed = () => {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <div ref={ref} className="[perspective:1400px]" onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div
        data-testid="hero-feed"
        style={{ rotateX: rx, rotateY: ry }}
        initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
        className="relative [transform-style:preserve-3d]"
      >
        <div className="absolute -inset-10 rounded-full bg-[#0088FF]/25 blur-[90px]" />
        <div className="chamfer relative aspect-[4/5] w-full overflow-hidden bg-[#0E1626] sm:aspect-[5/6]">
          <motion.img style={{ y: imgY, scale: 1.2 }} src="/img/cam1.jpg" alt="Câmera de segurança instalada"
            className="absolute inset-0 h-full w-full object-cover saturate-[0.6] contrast-125" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,transparent_10%,rgba(7,11,20,0.85)_75%)]" />
          <div className="absolute inset-0 bg-[#0088FF]/15 mix-blend-color" />
          <div className="scanline absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent" />
          <div className="absolute inset-0 p-4 font-mono text-[11px] uppercase tracking-widest text-cyan-100 sm:p-5 sm:text-xs">
            <div className="flex justify-between">
              <span className="flex items-center gap-2"><span className="blink h-2 w-2 rounded-full bg-red-500" /> REC · CAM 01</span>
              <span className="hidden sm:inline">HD 1080P</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between sm:bottom-5 sm:left-5 sm:right-5">
              <span>Chapecó · SC</span>
              <Clock />
            </div>
          </div>
          {["left-3 top-10 border-l border-t", "right-3 top-10 border-r border-t", "left-3 bottom-10 border-l border-b", "right-3 bottom-10 border-r border-b"].map((c) => (
            <span key={c} className={`absolute h-6 w-6 border-cyan-300/80 ${c}`} />
          ))}
        </div>
        <div className="absolute -bottom-5 -left-3 bg-[#0088FF] px-4 py-2 font-mono text-xs uppercase tracking-widest text-white [transform:translateZ(60px)] sm:-left-6">
          Ao vivo · CFTV
        </div>
      </motion.div>
    </div>
  );
};

export const Hero = () => (
  <section id="top" data-testid="hero-section" className="relative overflow-hidden pt-28 sm:pt-32">
    <div className="dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
    <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-5 pb-20 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:pb-28">
      <div className="lg:col-span-7">
        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: EASE }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-cyan-300">
          // Manutenções e instalações · Chapecó — SC
        </motion.p>
        <h1 data-testid="hero-title" className="font-display text-[4.2rem] font-extrabold uppercase leading-[0.86] tracking-tight sm:text-8xl lg:text-[8.6rem] xl:text-[9.6rem]">
          {LINES.map((l, i) => (
            <span key={l.text} className="block overflow-hidden pb-1">
              <motion.span className={`block ${l.cls}`} initial={{ y: "110%" }} animate={{ y: "0%" }}
                transition={{ duration: 1.1, delay: 0.15 + i * 0.14, ease: EASE }}>
                {l.text}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75, ease: EASE }}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Instalação, manutenção e manutenção preventiva de <span className="text-white">alarmes</span>,{" "}
            <span className="text-white">câmeras</span> e <span className="text-white">redes</span>. Agende a visita
            técnica online em menos de um minuto.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button data-testid="hero-cta-agendar" onClick={() => scrollToId("agendar")}
              className="group inline-flex items-center gap-3 rounded-full bg-[#0088FF] py-3 pl-7 pr-3 text-base font-semibold text-white transition-[box-shadow,background-color] hover:bg-[#1a96ff] hover:shadow-[0_0_40px_rgba(0,136,255,0.6)]">
              Agendar visita técnica
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#070B14] transition-transform duration-300 group-hover:rotate-[-45deg]">
                <ArrowDownRight className="h-4 w-4" />
              </span>
            </button>
            <a data-testid="hero-cta-whatsapp" href={waLink("Olá, Tecnoguard! Gostaria de um orçamento.")} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-base text-white transition-colors hover:border-cyan-300 hover:text-cyan-200">
              <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
      <div className="lg:col-span-5">
        <Feed />
      </div>
    </div>
  </section>
);

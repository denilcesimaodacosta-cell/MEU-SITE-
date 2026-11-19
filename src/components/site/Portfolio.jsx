import { useState } from "react";
import { Shield, Camera, Wrench, X, ZoomIn } from "lucide-react";
import { Reveal, Overline } from "./Reveal";

const CATEGORIES = [
  { id: "todos", label: "Todos os Trabalhos" },
  { id: "alarmes", label: "Sistemas de Alarme", icon: Shield },
  { id: "cameras", label: "Sistemas de Câmeras", icon: Camera },
  { id: "manutencao", label: "Manutenções Preventivas", icon: Wrench },
];

const WORKS = [
  {
    id: 1,
    category: "cameras",
    categoryLabel: "Sistemas de Câmeras",
    title: "Monitoramento Perimetral Externo",
    desc: "Instalação dupla de câmeras bullet em poste com caixas de passagem vedadas.",
    src: "/camera-1.jpg",
  },
  {
    id: 2,
    category: "alarmes",
    categoryLabel: "Sistemas de Alarme",
    title: "Central Monitorada Intelbras AMT 4010",
    desc: "Montagem técnica com identificação de zonas, resistores e acabamento limpo.",
    src: "/alarme-1.jpg",
  },
  {
    id: 3,
    category: "manutencao",
    categoryLabel: "Manutenções Preventivas",
    title: "Reestruturação de Painel e Backup de Energia",
    desc: "Organização de cabeamento, bateria estacionária e nobreak dedicado.",
    src: "/manutencao-1.jpg",
  },
  {
    id: 4,
    category: "cameras",
    categoryLabel: "Sistemas de Câmeras",
    title: "Câmera Dome Externa com Eletroduto",
    desc: "Proteção de fachada com tubulação aparente e acabamento de alta durabilidade.",
    src: "/camera-2.jpg",
  },
  {
    id: 5,
    category: "alarmes",
    categoryLabel: "Sistemas de Alarme",
    title: "Teclado LCD e Configuração de Zonas",
    desc: "Automação de ativação, setorização e testes completos de disparo.",
    src: "/alarme-2.jpg",
  },
  {
    id: 6,
    category: "cameras",
    categoryLabel: "Sistemas de Câmeras",
    title: "Sistema CFTV IP e Acesso Remoto PTZ",
    desc: "Configuração de visualização em alta definição para áreas comerciais e pátios.",
    src: "/camera-3.jpg",
  },
  {
    id: 7,
    category: "manutencao",
    categoryLabel: "Manutenções Preventivas",
    title: "Revisão Preventiva de Placa e Bateria",
    desc: "Testes de carga, conexões de rede e atualização de central de segurança.",
    src: "/manutencao-2.jpg",
  },
  {
    id: 8,
    category: "cameras",
    categoryLabel: "Sistemas de Câmeras",
    title: "Integração de Câmera Dome e Sensor IVP",
    desc: "Instalação interna limpa com canaletas e proteção dupla de ambiente.",
    src: "/camera-4.jpg",
  },
  {
    id: 9,
    category: "alarmes",
    categoryLabel: "Sistemas de Alarme",
    title: "Sensores Internos e Proteção Perimetral",
    desc: "Instalação precisa de sensores infravermelhos e comunicação com central.",
    src: "/alarme-3.jpg",
  },
];

export const Portfolio = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [selected, setSelected] = useState(null);

  const filtered =
    activeTab === "todos"
      ? WORKS
      : WORKS.filter((item) => item.category === activeTab);

  return (
    <section
      id="trabalhos"
      data-testid="portfolio-section"
      className="relative border-t border-white/10 bg-[#070B14] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <Overline>// Trabalhos Realizados</Overline>
          <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="font-display text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
              Serviços executados <span className="text-[#0088FF]">na prática.</span>
            </h2>
            <p className="max-w-md text-sm text-slate-400 sm:text-base">
              Confira instalações reais realizadas pela equipe TecnoGuard em Chapecó e região. Clique em qualquer foto para ampliar.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`inline-flex items-center gap-2 rounded-sm border px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-all ${
                  isActive
                    ? "border-[#0088FF] bg-[#0088FF] text-white shadow-[0_0_20px_rgba(0,136,255,0.35)]"
                    : "border-white/10 bg-[#050810] text-slate-300 hover:border-cyan-300/50 hover:text-white"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((work, i) => (
            <Reveal key={work.id} delay={i * 0.05}>
              <div
                onClick={() => setSelected(work)}
                className="group cursor-pointer overflow-hidden rounded-sm border border-white/10 bg-[#050810] transition-colors hover:border-cyan-400/50"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A101F]">
                  <img
                    src={work.src}
                    alt={work.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-70" />
                  <span className="absolute left-3 top-3 rounded-sm border border-cyan-400/30 bg-[#050810]/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300 backdrop-blur-sm">
                    {work.categoryLabel}
                  </span>
                  <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#050810]/80 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4 text-cyan-300" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300">
                    {work.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {work.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-sm border border-white/15 bg-[#050810]"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white hover:border-cyan-300 hover:text-cyan-300"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selected.src}
              alt={selected.title}
              className="mx-auto max-h-[72vh] w-auto object-contain"
            />
            <div className="border-t border-white/10 p-5">
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-300">
                {selected.categoryLabel}
              </span>
              <h4 className="mt-1 text-xl font-bold text-white">{selected.title}</h4>
              <p className="mt-1 text-sm text-slate-300">{selected.desc}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

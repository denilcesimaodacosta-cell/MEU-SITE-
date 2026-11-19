import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { Reveal, Overline } from "./Reveal";

const PHOTOS = [
  "WhatsApp Image 2026-11-19 at 08.18.46.jpeg",
  "WhatsApp Image 2026-11-19 at 08.20.06.jpeg",
  "WhatsApp Image 2026-11-19 at 08.22.44.jpeg",
  "WhatsApp Image 2026-11-19 at 08.22.45 (1).jpeg",
  "WhatsApp Image 2026-11-19 at 08.22.45 (2).jpeg",
  "WhatsApp Image 2026-11-19 at 08.22.45.jpeg",
  "WhatsApp Image 2026-11-19 at 08.23.28 (1).jpeg",
  "WhatsApp Image 2026-11-19 at 08.23.28 (2).jpeg",
  "WhatsApp Image 2026-11-19 at 08.23.28.jpeg",
  "WhatsApp Image 2026-11-19 at 08.24.34 (1).jpeg",
  "WhatsApp Image 2026-11-19 at 08.24.34 (2).jpeg",
  "WhatsApp Image 2026-11-19 at 08.24.34 (3).jpeg",
  "WhatsApp Image 2026-11-19 at 08.24.34.jpeg",
  "WhatsApp Image 2026-11-19 at 08.24.35 (1).jpeg",
  "WhatsApp Image 2026-11-19 at 08.24.35 (2).jpeg",
  "WhatsApp Image 2026-11-19 at 08.24.35 (3).jpeg",
  "WhatsApp Image 2026-11-19 at 08.24.35 (4).jpeg",
  "WhatsApp Image 2026-11-19 at 08.24.35.jpeg",
  "WhatsApp Image 2026-11-19 at 08.33.29 (1).jpeg",
  "WhatsApp Image 2026-11-19 at 08.33.29 (2).jpeg",
];

export const Portfolio = () => {
  const [selected, setSelected] = useState(null);

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
              Confira instalações e manutenções reais realizadas pela equipe TecnoGuard em Chapecó e região. Clique em qualquer foto para ampliar.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {PHOTOS.map((fileName, i) => {
            const src = `/${encodeURIComponent(fileName)}`;
            return (
              <Reveal key={fileName} delay={(i % 4) * 0.05}>
                <div
                  onClick={() => setSelected(src)}
                  className="group cursor-pointer overflow-hidden rounded-sm border border-white/10 bg-[#050810] transition-colors hover:border-cyan-400/50"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A101F]">
                    <img
                      src={src}
                      alt={`Serviço realizado TecnoGuard ${i + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#050810]/85 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <ZoomIn className="h-4 w-4 text-cyan-300" />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-sm border border-white/15 bg-[#050810] p-2"
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white hover:border-cyan-300 hover:text-cyan-300"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={selected}
              alt="Serviço ampliado TecnoGuard"
              className="mx-auto max-h-[84vh] w-auto rounded-sm object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};

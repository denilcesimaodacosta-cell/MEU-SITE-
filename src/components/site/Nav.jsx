import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Lock } from "lucide-react";
import { Mark, Wordmark } from "./Mark";
import { scrollToId } from "@/lib/site";

const LINKS = [
  { id: "servicos", label: "Serviços" },
  { id: "processo", label: "Como funciona" },
  { id: "agendar", label: "Agendamento" },
  { id: "contato", label: "Contato" },
];

export const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => { setOpen(false); scrollToId(id); };

  return (
    <header
      data-testid="site-header"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 border-b ${
        scrolled || open ? "bg-[#070B14]/80 backdrop-blur-xl border-cyan-400/10" : "bg-transparent border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <button data-testid="nav-logo" onClick={() => go("top")} className="flex items-center gap-2.5">
          <Mark className="h-8 w-8" />
          <Wordmark className="text-2xl" />
        </button>
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <button key={l.id} data-testid={`nav-link-${l.id}`} onClick={() => go(l.id)}
              className="group relative font-mono text-xs uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-white">
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-cyan-300 transition-transform duration-300 group-hover:scale-x-100" />
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/admin" data-testid="nav-admin-link" aria-label="Painel admin"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-cyan-400/20 text-slate-300 transition-colors hover:border-cyan-300 hover:text-cyan-300 sm:flex">
            <Lock className="h-4 w-4" />
          </Link>
          <button data-testid="nav-cta-agendar" onClick={() => go("agendar")}
            className="hidden rounded-full bg-[#0088FF] px-5 py-2.5 text-sm font-semibold text-white transition-[background-color,box-shadow] hover:bg-[#1a96ff] hover:shadow-[0_0_30px_rgba(0,136,255,0.55)] sm:block">
            Agendar visita
          </button>
          <button data-testid="nav-mobile-toggle" onClick={() => setOpen((o) => !o)} className="p-2 text-white md:hidden" aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div data-testid="nav-mobile-menu" className="border-t border-cyan-400/10 px-5 pb-6 pt-2 md:hidden">
          {LINKS.map((l) => (
            <button key={l.id} data-testid={`nav-mobile-link-${l.id}`} onClick={() => go(l.id)}
              className="block w-full border-b border-white/5 py-4 text-left font-display text-3xl font-bold uppercase text-white">
              {l.label}
            </button>
          ))}
          <Link to="/admin" data-testid="nav-mobile-admin" className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-300">
            <Lock className="h-3.5 w-3.5" /> Painel admin
          </Link>
        </div>
      )}
    </header>
  );
};

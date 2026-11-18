import { Instagram, Mail, MapPin, MessageCircle, Wrench, Receipt, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal, Overline } from "./Reveal";
import { Mark } from "./Mark";
import { PHONE_LABEL, EMAIL, INSTAGRAM } from "@/lib/site";

const MSG_BOAS_VINDAS = encodeURIComponent(
  "👋 Olá! Seja muito bem-vindo(a) à TecnoGuard Manutenções e Instalações! 🔵🛡️\n\n" +
  "Agradecemos por entrar em contato! Será um prazer atender você.\n\n" +
  "🔧 Conheça nossos serviços:\n\n" +
  "📹 Instalação e manutenção de câmeras de segurança;\n" +
  "🚨 Instalação e manutenção de sistemas de alarme;\n" +
  "🌐 Instalação e manutenção de redes;\n" +
  "⚙️ Manutenções preventivas e corretivas.\n\n" +
  "Nosso compromisso é oferecer soluções eficientes, qualidade e segurança, sempre buscando proteger o que é mais importante para você e seu negócio!\n\n" +
  "💬 Conte-nos: como podemos ajudar?\n\n" +
  "Em breve, nossa equipe dará continuidade ao seu atendimento.\n\n" +
  "🤝 TecnoGuard – Tecnologia, segurança e confiança em cada serviço! 🔵🛡️"
);

const ITEMS = [
  { id: "whatsapp", icon: MessageCircle, label: "Orçamentos", value: PHONE_LABEL, href: "https://wa.me" + "/5549989027059?text=" + MSG_BOAS_VINDAS },
  { id: "tecnica", icon: Wrench, label: "Área Técnica", value: "(49) 99926-0800", href: "https://wa.me" + "/5549999260800?text=" + MSG_BOAS_VINDAS },
  { id: "financeiro", icon: Receipt, label: "Financeiro", value: "(49) 99114-5806", href: "https://wa.me" + "/5549991145806?text=" + MSG_BOAS_VINDAS },
  { id: "instagram", icon: Instagram, label: "Instagram", value: `@${INSTAGRAM}`, href: `https://instagram.com{INSTAGRAM}` },
  { id: "email", icon: Mail, label: "E-mail", value: EMAIL, href: `mailto:${EMAIL}` },
  { id: "local", icon: MapPin, label: "Atendimento", value: "Chapecó — SC e região", href: null },
];

export const Contact = () => (
  <footer id="contato" data-testid="contact-section" className="relative border-t border-cyan-400/10 bg-[#050810]">
    <div className="mx-auto max-w-[1400px] px-5 pt-24 sm:px-8 sm:pt-32">
      <Reveal>
        <Overline>// 04 — Contato</Overline>
      </Reveal>
      <div className="mt-8 grid border-t border-white/10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {ITEMS.map((it, i) => {
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <it.icon className="h-5 w-5 text-cyan-300" />
                {it.href && <ArrowUpRight className="h-5 w-5 text-slate-500 transition-[transform,color] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300" />}
              </div>
              <p className="mt-10 font-mono text-xs uppercase tracking-widest text-slate-400">{it.label}</p>
              <p className="mt-2 break-words text-base text-white xl:text-lg">{it.value}</p>
            </>
          );
          return (
            <Reveal key={it.id} delay={i * 0.06}>
              {it.href ? (
                <a data-testid={`contact-${it.id}`} href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                  className="group block h-full border-b border-white/10 py-8 transition-colors hover:bg-white/[0.02] sm:px-5 lg:border-r">
                  {inner}
                </a>
              ) : (
                <div data-testid={`contact-${it.id}`} className="h-full border-b border-white/10 py-8 sm:px-5">{inner}</div>
              )}
            </Reveal>
          );
        })}
      </div>
      <div className="relative mt-20 select-none overflow-hidden">
        <p className="font-display text-[22vw] font-extrabold uppercase leading-[0.8] tracking-tighter text-white/[0.06] lg:text-[18vw]">
          Tecno<span className="text-[#0088FF]/30">guard</span>
        </p>
      </div>
      <div className="flex flex-col gap-4 border-t border-white/10 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2"><Mark className="h-6 w-6" /> Tecnoguard Manutenções e Instalações</div>
        <div className="flex items-center gap-6">
          <span>© {new Date().getFullYear()}</span>
          <Link to="/admin" data-testid="footer-admin-link" className="hover:text-cyan-300">Área administrativa</Link>
        </div>
      </div>
    </div>
  </footer>
);

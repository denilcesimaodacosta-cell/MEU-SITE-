import { useEffect, useState } from "react";
import Lenis from "lenis";
import { MessageCircle } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Services } from "@/components/site/Services";
import { Process } from "@/components/site/Process";
import { Booking } from "@/components/site/Booking";
import { Contact } from "@/components/site/Contact";
import { ChatWidget } from "@/components/site/ChatWidget";
import { setLenis, scrollToId, waLink } from "@/lib/site";

export default function Home() {
  const [preset, setPreset] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    setLenis(lenis);
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); setLenis(null); };
  }, []);

  const onBook = (service, modality) => {
    setPreset({ service, modality, at: Date.now() });
    scrollToId("agendar");
  };

  return (
    <div className="grain min-h-screen overflow-x-hidden bg-[#070B14]">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services onBook={onBook} />
        <Process />
        <Booking preset={preset} />
      </main>
      <Contact />
      <ChatWidget />
      <a data-testid="whatsapp-fab" href={waLink("Olá, Tecnoguard!")} target="_blank" rel="noreferrer" aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#06260f] shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform hover:scale-110">
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}

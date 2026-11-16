import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, Loader2 } from "lucide-react";
import { api, scrollToId } from "@/lib/site";
import { streamSSE } from "@/lib/stream";
import { ChatBookingCard, splitBooking } from "./ChatBookingCard";

const SUGGESTIONS = ["Quero agendar uma visita", "Quais serviços vocês fazem?", "Tem horário livre amanhã?"];

const Bubble = ({ m, busy }) => {
  if (m.role === "user") {
    return <div data-testid="chat-msg-user" className="ml-auto max-w-[85%] whitespace-pre-wrap rounded-sm bg-[#0088FF] px-3 py-2 text-sm text-white">{m.content}</div>;
  }
  const { text, data } = splitBooking(m.content || "");
  return (
    <div data-testid="chat-msg-assistant" className="max-w-[90%]">
      <div className="whitespace-pre-wrap rounded-sm bg-white/5 px-3 py-2 text-sm text-slate-100">
        {text ? text.replace(/\*\*/g, "") : <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />}
      </div>
      {data && !busy && <ChatBookingCard data={data} />}
    </div>
  );
};

const getSid = () => {
  let s = localStorage.getItem("tg_chat_sid");
  if (!s) { s = `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`; localStorage.setItem("tg_chat_sid", s); }
  return s;
};

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!open || msgs.length) return;
    api.get(`/chat/${getSid()}`).then((r) => setMsgs(Array.isArray(r.data?.messages) ? r.data.messages : [])).catch(() => {});
  }, [open, msgs.length]);

  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [msgs]);

  const send = async (q) => {
    const message = (q ?? text).trim();
    if (!message || busy) return;
    setText("");
    setBusy(true);
    setMsgs((m) => [...m, { role: "user", content: message }, { role: "assistant", content: "" }]);
    const append = (t) => setMsgs((m) => { const c = [...m]; c[c.length - 1] = { ...c[c.length - 1], content: c[c.length - 1].content + t }; return c; });
    try {
      await streamSSE("/chat", { session_id: getSid(), message }, append);
    } catch (e) {
      append(e.message || "Assistente indisponível no momento.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button data-testid="chat-fab" onClick={() => setOpen((o) => !o)} aria-label="Assistente virtual"
        className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#0088FF] text-white shadow-[0_10px_30px_rgba(0,136,255,0.45)] transition-transform hover:scale-110">
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div data-testid="chat-panel" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} data-lenis-prevent
            className="fixed bottom-40 right-4 z-50 flex h-[min(560px,calc(100vh-12rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-sm border border-cyan-400/20 bg-[#0B1322]/95 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0088FF]/20 text-cyan-300"><Bot className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-semibold text-white">Assistente Tecnoguard</p>
                <p className="font-mono text-[11px] uppercase tracking-widest text-cyan-300">IA · online</p>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.length === 0 && (
                <div data-testid="chat-empty">
                  <p className="text-sm text-slate-300">Olá! Posso tirar dúvidas e fazer seu agendamento aqui mesmo no chat.</p>
                  <div className="mt-3 flex flex-col gap-2">
                    {SUGGESTIONS.map((s, i) => (
                      <button key={s} data-testid={`chat-suggestion-${i}`} onClick={() => send(s)}
                        className="rounded-sm border border-white/10 px-3 py-2 text-left text-sm text-slate-200 hover:border-cyan-300/50">{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {msgs.map((m, i) => <Bubble key={i} m={m} busy={busy && i === msgs.length - 1} />)}
              <div ref={endRef} />
            </div>
            <button data-testid="chat-go-booking" onClick={() => { setOpen(false); scrollToId("agendar"); }}
              className="mx-4 mb-2 rounded-full border border-cyan-300/30 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-300/10">Ir para o agendamento</button>
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2 border-t border-white/10 p-3">
              <input data-testid="chat-input" value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} placeholder="Digite sua pergunta..."
                className="flex-1 rounded-sm border border-white/10 bg-[#070B14] px-3 py-2.5 text-base text-white outline-none placeholder:text-slate-500 focus:border-[#0088FF]" />
              <button data-testid="chat-send" disabled={busy || !text.trim()} className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0088FF] text-white disabled:opacity-50" aria-label="Enviar">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

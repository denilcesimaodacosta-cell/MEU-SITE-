import { useState } from "react";
import { CalendarCheck, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { api, errMsg, SERVICES, MODALITIES, labelOf, fmtDate, waLink } from "@/lib/site";

const MARK = "[[AGENDAR]]";
const DONE_KEY = "tg_chat_booked";

export const splitBooking = (content) => {
  const i = content.indexOf("[[");
  if (i === -1) return { text: content, data: null };
  const text = content.slice(0, i).trim();
  if (!content.slice(i).startsWith(MARK)) return { text, data: null };
  try {
    const data = JSON.parse(content.slice(i + MARK.length).trim());
    return { text, data: data?.service && data?.date && data?.time ? data : null };
  } catch {
    return { text, data: null };
  }
};

const sig = (d) => `${d.date}|${d.time}|${d.phone}`;
const readDone = () => { try { return JSON.parse(localStorage.getItem(DONE_KEY) || "[]"); } catch { return []; } };

export const ChatBookingCard = ({ data }) => {
  const [done, setDone] = useState(() => readDone().includes(sig(data)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setBusy(true); setError("");
    try {
      await api.post("/bookings", {
        service: data.service, modality: data.modality, date: data.date, time: data.time,
        name: data.name, phone: data.phone, address: data.address, notes: data.notes || "",
      });
      localStorage.setItem(DONE_KEY, JSON.stringify([...readDone(), sig(data)]));
      setDone(true);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const rows = [
    ["Serviço", `${labelOf(SERVICES, data.service)} · ${labelOf(MODALITIES, data.modality)}`],
    ["Quando", `${fmtDate(data.date)} às ${data.time}`],
    ["Nome", data.name], ["Telefone", data.phone], ["Endereço", data.address],
  ];

  return (
    <div data-testid="chat-booking-card" className="mt-2 rounded-sm border border-cyan-300/30 bg-[#070B14] p-3 text-sm">
      <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-cyan-300"><CalendarCheck className="h-3.5 w-3.5" /> Resumo do agendamento</p>
      <dl className="space-y-1">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[72px_1fr] gap-2"><dt className="text-slate-400">{k}</dt><dd className="text-white">{v || "—"}</dd></div>
        ))}
      </dl>
      {error && <p data-testid="chat-booking-error" className="mt-2 text-red-300">{error}</p>}
      {done ? (
        <div data-testid="chat-booking-confirmed" className="mt-3">
          <p className="flex items-center gap-2 font-semibold text-emerald-300"><CheckCircle2 className="h-4 w-4" /> Agendamento enviado!</p>
          <a data-testid="chat-booking-whatsapp" target="_blank" rel="noreferrer"
            href={waLink(`Olá, Tecnoguard! Agendei pelo chat do site: ${labelOf(SERVICES, data.service)} — ${labelOf(MODALITIES, data.modality)}, ${fmtDate(data.date)} às ${data.time}. Nome: ${data.name}.`)}
            className="mt-2 inline-flex items-center gap-1.5 text-emerald-200 underline underline-offset-4"><MessageCircle className="h-3.5 w-3.5" /> Avisar no WhatsApp</a>
        </div>
      ) : (
        <button data-testid="chat-booking-confirm" onClick={confirm} disabled={busy}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#0088FF] py-2 font-semibold text-white hover:bg-[#1a96ff] disabled:opacity-60">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Confirmar agendamento
        </button>
      )}
    </div>
  );
};

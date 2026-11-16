import { useState } from "react";
import { Loader2, MessageCircle, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { streamSSE } from "@/lib/stream";
import { fmtDate } from "@/lib/site";

export const ReplyDraftDialog = ({ booking, onClose }) => {
  const [draft, setDraft] = useState("");
  const [instruction, setInstruction] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const phone = (booking?.phone || "").replace(/\D/g, "");

  const run = async () => {
    setBusy(true); setDraft(""); setError("");
    try { await streamSSE(`/admin/ai/reply/${booking.id}`, { instruction }, (t) => setDraft((x) => x + t)); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  return (
    <Dialog open={!!booking} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent data-testid="reply-draft-dialog" className="border-cyan-400/20 bg-[#0B1322] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl uppercase">Rascunho de WhatsApp</DialogTitle>
        </DialogHeader>
        {booking && <p className="text-sm text-slate-400">{booking.name} · {fmtDate(booking.date)} às {booking.time}</p>}
        <input data-testid="reply-draft-instruction" value={instruction} onChange={(e) => setInstruction(e.target.value)} maxLength={500}
          placeholder="Instrução opcional (ex.: pedir para remarcar)"
          className="w-full rounded-sm border border-white/10 bg-[#070B14] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#0088FF]" />
        <textarea data-testid="reply-draft-text" rows={6} value={error || draft} onChange={(e) => setDraft(e.target.value)}
          placeholder="Clique em Gerar para criar uma mensagem com IA"
          className={`w-full resize-none rounded-sm border border-white/10 bg-[#070B14] px-3 py-2.5 text-sm outline-none focus:border-[#0088FF] ${error ? "text-red-300" : "text-white"}`} />
        <div className="flex flex-wrap justify-end gap-2">
          <button data-testid="reply-draft-generate" onClick={run} disabled={busy}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-300/10 disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Gerar
          </button>
          <a data-testid="reply-draft-send" href={draft && phone ? `https://wa.me/55${phone}?text=${encodeURIComponent(draft)}` : undefined}
            target="_blank" rel="noreferrer" aria-disabled={!draft || busy}
            className={`inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-[#06260f] ${!draft || busy ? "pointer-events-none opacity-50" : ""}`}>
            <MessageCircle className="h-4 w-4" /> Abrir no WhatsApp
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { streamSSE } from "@/lib/stream";

export const AiSummary = () => {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setBusy(true); setText(""); setError("");
    try { await streamSSE("/admin/ai/summary", {}, (t) => setText((x) => x + t)); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div data-testid="ai-summary" className="mt-6 rounded-sm border border-cyan-400/15 bg-[#0E1626] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          <p className="font-mono text-xs uppercase tracking-widest text-slate-300">Assistente IA · resumo da agenda</p>
        </div>
        <button data-testid="ai-summary-run" onClick={run} disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-[#0088FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a96ff] disabled:opacity-60">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Resumir agenda
        </button>
      </div>
      {(text || error) && (
        <p data-testid="ai-summary-text" className={`mt-4 whitespace-pre-wrap text-sm leading-relaxed ${error ? "text-red-300" : "text-slate-200"}`}>{error || text}</p>
      )}
    </div>
  );
};

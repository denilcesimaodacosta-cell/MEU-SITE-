import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Loader2, LogOut, Search, Trash2, MessageCircle, ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import { AiSummary } from "@/components/admin/AiSummary";
import { ReplyDraftDialog } from "@/components/admin/ReplyDraftDialog";
import { toast } from "sonner";
import { Mark, Wordmark } from "@/components/site/Mark";
import { api, errMsg, SERVICES, MODALITIES, labelOf, fmtDate } from "@/lib/site";

const STATUS = {
  pendente: { label: "Pendente", cls: "bg-amber-400/15 text-amber-300 border-amber-400/30" },
  confirmado: { label: "Confirmado", cls: "bg-[#0088FF]/15 text-sky-300 border-[#0088FF]/40" },
  concluido: { label: "Concluído", cls: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30" },
  cancelado: { label: "Cancelado", cls: "bg-red-400/15 text-red-300 border-red-400/30" },
};

const googleLogin = () => {
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  const redirectUrl = window.location.origin + "/admin";
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
};

const GoogleCallback = ({ hash, onLogin }) => {
  const done = useRef(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const sid = new URLSearchParams(hash.replace(/^#/, "")).get("session_id");
    window.history.replaceState(null, "", window.location.pathname);
    api.post("/auth/google", { session_id: sid })
      .then(({ data }) => { localStorage.setItem("tg_token", data.token); onLogin(data.user); })
      .catch((e) => setError(errMsg(e)));
  }, [hash, onLogin]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
      {error ? (
        <>
          <p data-testid="google-login-error" className="text-red-300">{error}</p>
          <button data-testid="google-login-retry" onClick={() => window.location.replace("/admin")} className="rounded-full border border-white/15 px-5 py-2 text-white">Voltar ao login</button>
        </>
      ) : <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />}
    </div>
  );
};

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>
);

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("tg_token", data.token);
      onLogin(data.user);
    } catch (err) { setError(errMsg(err)); } finally { setLoading(false); }
  };

  return (
    <div className="dot-grid flex min-h-screen items-center justify-center px-5">
      <form onSubmit={submit} data-testid="admin-login-form" className="w-full max-w-sm rounded-sm border border-cyan-400/15 bg-[#0E1626]/90 p-8 backdrop-blur-xl">
        <Mark className="h-10 w-10" />
        <h1 className="mt-5 font-display text-4xl font-extrabold uppercase text-white">Painel admin</h1>
        <p className="mt-1 text-sm text-slate-400">Acesso restrito à equipe Tecnoguard.</p>
        <button type="button" data-testid="admin-google-login" onClick={googleLogin}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-white py-3 font-semibold text-[#070B14] transition-colors hover:bg-slate-200">
          <GoogleIcon /> Entrar com Google
        </button>
        <div className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-slate-500"><span className="h-px flex-1 bg-white/10" />ou com senha<span className="h-px flex-1 bg-white/10" /></div>
        <input data-testid="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail"
          className="mt-6 w-full rounded-sm border border-white/10 bg-[#070B14] px-4 py-3 text-white outline-none focus:border-[#0088FF]" />
        <input data-testid="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha"
          className="mt-3 w-full rounded-sm border border-white/10 bg-[#070B14] px-4 py-3 text-white outline-none focus:border-[#0088FF]" />
        {error && <p data-testid="admin-login-error" className="mt-3 text-sm text-red-300">{error}</p>}
        <button data-testid="admin-login-submit" disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0088FF] py-3 font-semibold text-white hover:bg-[#1a96ff] disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Entrar
        </button>
        <Link to="/" data-testid="admin-back-home" className="mt-5 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> Voltar ao site</Link>
      </form>
    </div>
  );
};

const Row = ({ b, onStatus, onDelete, onDraft }) => {
  const phone = (b.phone || "").replace(/\D/g, "");
  return (
    <div data-testid={`booking-row-${b.id}`} className="grid gap-4 border-b border-white/10 py-5 md:grid-cols-[140px_1fr_1fr_auto] md:items-center">
      <div>
        <p className="font-display text-2xl font-bold text-white">{fmtDate(b.date)}</p>
        <p className="font-mono text-sm text-cyan-300">{b.time}</p>
      </div>
      <div>
        <p className="font-medium text-white">{b.name}</p>
        <p className="text-sm text-slate-400">{b.phone}</p>
        <p className="text-sm text-slate-400">{b.address}</p>
      </div>
      <div>
        <p className="text-white">{labelOf(SERVICES, b.service)} · <span className="text-slate-300">{labelOf(MODALITIES, b.modality)}</span></p>
        {b.notes && <p className="mt-1 text-sm text-slate-400">“{b.notes}”</p>}
      </div>
      <div className="flex items-center gap-2">
        <select data-testid={`booking-status-${b.id}`} value={b.status} onChange={(e) => onStatus(b.id, e.target.value)}
          className={`rounded-full border px-3 py-1.5 text-sm outline-none ${STATUS[b.status]?.cls || ""}`}>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k} className="bg-[#0E1626] text-white">{v.label}</option>)}
        </select>
        <button data-testid={`booking-ai-draft-${b.id}`} onClick={() => onDraft(b)} className="rounded-full border border-white/10 p-2 text-cyan-300 hover:border-cyan-300" aria-label="Rascunho com IA">
          <Sparkles className="h-4 w-4" />
        </button>
        {phone && (
          <a data-testid={`booking-wa-${b.id}`} href={`https://wa.me/55${phone}?text=${encodeURIComponent(`Olá, ${b.name}! Aqui é da Tecnoguard sobre seu agendamento de ${fmtDate(b.date)} às ${b.time}.`)}`}
            target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-2 text-emerald-300 hover:border-emerald-300" aria-label="WhatsApp do cliente">
            <MessageCircle className="h-4 w-4" />
          </a>
        )}
        <button data-testid={`booking-delete-${b.id}`} onClick={() => onDelete(b.id)} className="rounded-full border border-white/10 p-2 text-slate-400 hover:border-red-300 hover:text-red-300" aria-label="Excluir">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ user, onLogout }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [q, setQ] = useState("");
  const [draftFor, setDraftFor] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/bookings");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      if (e?.response?.status === 401) onLogout();
      else toast.error(errMsg(e));
    } finally { setLoading(false); }
  }, [onLogout]);

  useEffect(() => { load(); }, [load]);

  const onStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/admin/bookings/${id}`, { status });
      setItems((xs) => xs.map((x) => (x.id === id ? data : x)));
      toast.success(`Status: ${STATUS[status].label}`);
    } catch (e) { toast.error(errMsg(e)); }
  };
  const onDelete = async (id) => {
    if (!window.confirm("Excluir este agendamento?")) return;
    try { await api.delete(`/admin/bookings/${id}`); setItems((xs) => xs.filter((x) => x.id !== id)); toast.success("Excluído"); }
    catch (e) { toast.error(errMsg(e)); }
  };

  const counts = useMemo(() => Object.fromEntries(Object.keys(STATUS).map((k) => [k, items.filter((x) => x.status === k).length])), [items]);
  const shown = items.filter((b) => (filter === "todos" || b.status === filter) &&
    `${b.name} ${b.phone} ${b.address} ${b.service}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen" data-testid="admin-dashboard">
      <header className="border-b border-cyan-400/10 bg-[#070B14]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2" data-testid="admin-home-link"><Mark className="h-7 w-7" /><Wordmark className="text-xl" /></Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-400 sm:inline">{user?.email}</span>
            <button data-testid="admin-logout" onClick={onLogout} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:border-cyan-300"><LogOut className="h-4 w-4" /> Sair</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex items-end justify-between">
          <h1 className="font-display text-5xl font-extrabold uppercase text-white">Agendamentos</h1>
          <button data-testid="admin-refresh" onClick={load} className="rounded-full border border-white/10 p-2.5 text-slate-300 hover:border-cyan-300" aria-label="Atualizar"><RefreshCw className="h-4 w-4" /></button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[["todos", "Todos", items.length], ...Object.entries(STATUS).map(([k, v]) => [k, v.label, counts[k]])].map(([k, label, n]) => (
            <button key={k} data-testid={`admin-filter-${k}`} onClick={() => setFilter(k)}
              className={`rounded-sm border p-4 text-left transition-colors ${filter === k ? "border-[#0088FF] bg-[#0088FF]/10" : "border-white/10 hover:border-cyan-300/40"}`}>
              <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">{label}</p>
              <p className="mt-1 font-display text-4xl font-bold text-white" data-testid={`admin-count-${k}`}>{n}</p>
            </button>
          ))}
        </div>
        <AiSummary />
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input data-testid="admin-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, telefone ou endereço"
            className="w-full rounded-sm border border-white/10 bg-[#0E1626] py-3 pl-11 pr-4 text-white outline-none focus:border-[#0088FF]" />
        </div>
        <div className="mt-4">
          {loading ? <Loader2 className="mx-auto mt-10 h-6 w-6 animate-spin text-cyan-300" /> :
            shown.length === 0 ? <p data-testid="admin-empty" className="py-16 text-center text-slate-400">Nenhum agendamento encontrado.</p> :
              shown.map((b) => <Row key={b.id} b={b} onStatus={onStatus} onDelete={onDelete} onDraft={setDraftFor} />)}
        </div>
        <ReplyDraftDialog key={draftFor?.id || "none"} booking={draftFor} onClose={() => setDraftFor(null)} />
      </main>
    </div>
  );
};

export default function Admin() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const isCallback = location.hash?.includes("session_id=");

  useEffect(() => {
    if (window.location.hash?.includes("session_id=")) { setChecking(false); return; }
    if (!localStorage.getItem("tg_token")) { setChecking(false); return; }
    api.get("/auth/me").then((r) => setUser(r.data)).catch(() => localStorage.removeItem("tg_token")).finally(() => setChecking(false));
  }, []);

  const logout = useCallback(() => { localStorage.removeItem("tg_token"); setUser(null); }, []);

  if (isCallback && !user) return <GoogleCallback hash={location.hash} onLogin={setUser} />;
  if (checking) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-cyan-300" /></div>;
  return user ? <Dashboard user={user} onLogout={logout} /> : <Login onLogin={setUser} />;
}

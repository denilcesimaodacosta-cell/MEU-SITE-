import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { SERVICES, MODALITIES, labelOf, waLink, fmtDate } from "@/lib/site";

const DEST_EMAIL = "ttecnoguard@gmail.com";

const Chip = ({ active, onClick, children, testId }) => (
  <button
    type="button"
    data-testid={testId}
    onClick={onClick}
    className={`rounded-sm border px-4 py-3 text-left text-sm font-medium transition-[background-color,border-color,color] ${
      active
        ? "border-[#0088FF] bg-[#0088FF] text-white shadow-[0_0_24px_rgba(0,136,255,0.35)]"
        : "border-white/10 text-slate-200 hover:border-cyan-300/50"
    }`}
  >
    {children}
  </button>
);

const Step = ({ n, title, children }) => (
  <div className="border-t border-white/10 pt-6">
    <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">
      {n} — {title}
    </p>
    {children}
  </div>
);

const Field = ({ label, ...p }) => (
  <label className="block">
    <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-slate-400">
      {label}
    </span>
    <input
      {...p}
      className="w-full rounded-sm border border-white/10 bg-[#070B14] px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-slate-500 focus:border-[#0088FF]"
    />
  </label>
);

const maskPhone = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const getLocalSlots = (selectedDate) => {
  if (!selectedDate) return [];
  const dayOfWeek = selectedDate.getDay();
  if (dayOfWeek === 0) return [];
  const times =
    dayOfWeek === 6
      ? ["08:00", "09:00", "10:00", "11:00"]
      : ["08:00", "09:00", "10:00", "11:00", "13:30", "14:30", "15:30", "16:30", "17:30"];
  return times.map((time) => ({ time, available: true }));
};

export const BookingForm = ({ preset }) => {
  const [service, setService] = useState(SERVICES?.[0]?.id || "alarmes");
  const [modality, setModality] = useState(MODALITIES?.[0]?.id || "instalacao");
  const [day, setDay] = useState();
  const [slots, setSlots] = useState([]);
  const [time, setTime] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (preset?.service) setService(preset.service);
    if (preset?.modality) setModality(preset.modality);
  }, [preset]);

  const iso = day ? format(day, "yyyy-MM-dd") : null;

  useEffect(() => {
    if (!day) {
      setSlots([]);
      return;
    }
    setTime(null);
    setSlots(getLocalSlots(day));
  }, [day]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDay = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 60);
    return d;
  }, [today]);

  const ready =
    service &&
    modality &&
    iso &&
    time &&
    form.name.trim().length > 1 &&
    form.phone.replace(/\D/g, "").length >= 10;

  const submit = async (e) => {
    e.preventDefault();
    if (!ready) {
      toast.error("Escolha data, horário, nome e WhatsApp.");
      return;
    }
    setLoading(true);

    const bookingData = { service, modality, date: iso, time, ...form };
    const serviceLabel = labelOf(SERVICES, service);
    const modalityLabel = labelOf(MODALITIES, modality);

    try {
      await fetch(`https://formsubmit.co{DEST_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `Novo Agendamento: ${form.name} (${fmtDate(iso)} às ${time})`,
          _template: "table",
          _captcha: "false",
          Serviço: `${serviceLabel} — ${modalityLabel}`,
          Data: fmtDate(iso),
          Horário: time,
          Cliente: form.name,
          WhatsApp: form.phone,
          Endereço: form.address || "Não informado",
          Observações: form.notes || "Nenhuma",
        }),
      });
    } catch {
      // Continua mesmo se houver bloqueio de rede
    } finally {
      const saved = JSON.parse(localStorage.getItem("tecnoguard_bookings") || "[]");
      saved.push({ ...bookingData, createdAt: new Date().toISOString() });
      localStorage.setItem("tecnoguard_bookings", JSON.stringify(saved));

      setLoading(false);
      setDone(bookingData);
      toast.success("Agendamento confirmado!");
    }
  };

  const reset = () => {
    setDone(null);
    setService(SERVICES?.[0]?.id || "alarmes");
    setModality(MODALITIES?.[0]?.id || "instalacao");
    setDay(undefined);
    setTime(null);
    setForm({ name: "", phone: "", address: "", notes: "" });
  };

  if (done) {
    const msg = `Olá, Tecnoguard! Acabei de agendar pelo site:\n• Serviço: ${labelOf(SERVICES, done.service)} — ${labelOf(MODALITIES, done.modality)}\n• Data: ${fmtDate(done.date)} às ${done.time}\n• Nome: ${done.name}${done.address ? `\n• Endereço: ${done.address}` : ""}${done.notes ? `\n• Obs: ${done.notes}` : ""}`;
    return (
      <div data-testid="booking-success" className="flex min-h-[520px] flex-col justify-center p-6 sm:p-10">
        <CheckCircle2 className="h-12 w-12 text-cyan-300" />
        <h3 className="mt-6 font-display text-5xl font-extrabold uppercase text-white">Agendado.</h3>
        <p className="mt-3 text-slate-300">
          {labelOf(SERVICES, done.service)} · {labelOf(MODALITIES, done.modality)} —{" "}
          <span className="text-white" data-testid="booking-success-datetime">
            {fmtDate(done.date)} às {done.time}
          </span>
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Seu horário foi registrado! Para confirmar ainda mais rápido, envie o resumo no WhatsApp abaixo.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            data-testid="booking-success-whatsapp"
            href={waLink(msg)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-[#06260f] transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5" /> Enviar no WhatsApp
          </a>
          <button
            data-testid="booking-new"
            onClick={reset}
            className="rounded-full border border-white/15 px-6 py-3 text-white hover:border-cyan-300"
          >
            Novo agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} data-testid="booking-form" className="space-y-8 p-6 sm:p-10">
      <Step n="01" title="Serviço">
        <div className="grid grid-cols-3 gap-2">
          {SERVICES.map((s) => (
            <Chip
              key={s.id}
              testId={`booking-service-${s.id}`}
              active={service === s.id}
              onClick={() => setService(s.id)}
            >
              {s.label}
            </Chip>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {MODALITIES.map((m) => (
            <Chip
              key={m.id}
              testId={`booking-modality-${m.id}`}
              active={modality === m.id}
              onClick={() => setModality(m.id)}
            >
              {m.label}
            </Chip>
          ))}
        </div>
      </Step>

      <Step n="02" title="Data e horário">
        <div className="grid gap-6 md:grid-cols-[auto_1fr]">
          <div className="w-fit rounded-sm border border-white/10 bg-[#070B14]">
            <Calendar
              data-testid="booking-calendar"
              mode="single"
              selected={day}
              onSelect={setDay}
              locale={ptBR}
              disabled={[{ before: today }, { after: maxDay }, { dayOfWeek: [0] }]}
              classNames={{
                day_selected: "bg-[#0088FF] text-white hover:bg-[#0088FF] focus:bg-[#0088FF]",
                day_today: "border border-cyan-300/50 text-cyan-200",
              }}
            />
          </div>
          <div data-testid="booking-slots">
            {!iso && <p className="text-sm text-slate-400">Selecione uma data para ver os horários disponíveis.</p>}
            {iso && (
              <>
                <p className="mb-3 text-sm text-slate-300 first-letter:uppercase">
                  {format(day, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      disabled={!s.available}
                      data-testid={`booking-slot-${s.time.replace(":", "")}`}
                      onClick={() => setTime(s.time)}
                      className={`rounded-sm border py-2.5 font-mono text-sm transition-colors ${
                        time === s.time
                          ? "border-[#0088FF] bg-[#0088FF] text-white"
                          : s.available
                          ? "border-white/10 text-slate-200 hover:border-cyan-300/60"
                          : "cursor-not-allowed border-white/5 text-slate-600 line-through"
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Step>

      <Step n="03" title="Seus dados">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nome *"
            placeholder="Seu nome"
            data-testid="booking-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Field
            label="WhatsApp *"
            placeholder="(49) 99999-9999"
            data-testid="booking-phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
          />
        </div>
        <div className="mt-4">
          <Field
            label="Endereço (opcional)"
            placeholder="Rua, número, bairro — cidade"
            data-testid="booking-address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="mt-4">
          <label className="block">
            <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-slate-400">
              Observações
            </span>
            <textarea
              rows={2}
              placeholder="Detalhes adicionais sobre o serviço (opcional)"
              data-testid="booking-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-sm border border-white/10 bg-[#070B14] px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-slate-500 focus:border-[#0088FF]"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          data-testid="booking-submit"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-[#0088FF] px-6 py-4 font-semibold uppercase tracking-wider text-white shadow-[0_0_24px_rgba(0,136,255,0.35)] transition-all hover:bg-[#0077E6] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Enviando...
            </>
          ) : (
            "Confirmar agendamento"
          )}
        </button>
      </Step>
    </form>
  );
};

import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL;
export const api = axios.create({ baseURL: BASE ? `${BASE}/api` : undefined });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("tg_token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export function errMsg(e) {
  const d = e?.response?.data?.detail;
  if (!d) return "Algo deu errado. Tente novamente.";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x?.msg || "").filter(Boolean).join(" ");
  return String(d);
}

export const WHATSAPP = "5549989027059";
export const PHONE_LABEL = "(49) 98902-7059";
export const EMAIL = "ttecnoguard@gmail.com";
export const INSTAGRAM = "tecnoguardchapeco";

export const SERVICES = [
  { id: "alarmes", label: "Alarmes" },
  { id: "cameras", label: "Câmeras" },
  { id: "redes", label: "Redes" },
];
export const MODALITIES = [
  { id: "instalacao", label: "Instalação" },
  { id: "manutencao", label: "Manutenção" },
  { id: "preventiva", label: "Manutenção preventiva" },
];
export const labelOf = (list, id) => list.find((x) => x.id === id)?.label ?? id;

export const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
export const fmtDate = (iso) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : "");

let lenisRef = null;
export const setLenis = (l) => { lenisRef = l; };
export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef) lenisRef.scrollTo(el, { offset: -70, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};

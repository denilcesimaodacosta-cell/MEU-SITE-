const BASE = process.env.REACT_APP_BACKEND_URL;

export async function streamSSE(path, body, onToken) {
  const token = localStorage.getItem("tg_token");
  const res = await fetch(`${BASE}/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok || !res.body) {
    const j = await res.json().catch(() => null);
    throw new Error(typeof j?.detail === "string" ? j.detail : "Falha ao conectar ao assistente.");
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split("\n\n");
    buf = parts.pop();
    for (const p of parts) {
      const line = p.replace(/^data: /, "").trim();
      if (!line || line === "[DONE]") continue;
      const ev = JSON.parse(line);
      if (ev.error) throw new Error(ev.error);
      if (ev.t) onToken(ev.t);
    }
  }
}

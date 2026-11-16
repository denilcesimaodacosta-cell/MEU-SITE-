export const Mark = ({ className = "h-9 w-9" }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <path d="M32 6 L54 14 V30 C54 44 44 54 32 58 C20 54 10 44 10 30 V14 Z" fill="none" stroke="#0088FF" strokeWidth="5" strokeLinejoin="round" />
    <path d="M20 20 H44 V27 H35.5 V47 H28.5 V27 H20 Z" fill="#E2E8F0" />
  </svg>
);

export const Wordmark = ({ className = "" }) => (
  <span className={`font-display font-extrabold tracking-tight uppercase ${className}`}>
    <span className="text-slate-200">Tecno</span>
    <span className="text-[#0088FF]">guard</span>
  </span>
);

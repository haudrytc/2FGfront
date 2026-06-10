import { Link } from "react-router-dom";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-clay-600 shadow-soft transition-transform group-hover:rotate-3">
        <svg viewBox="0 0 64 64" className="h-6 w-6">
          <g fill="white">
            <rect x="8" y="14" width="22" height="9" rx="1.5" />
            <rect x="34" y="14" width="22" height="9" rx="1.5" />
            <rect x="8" y="27" width="14" height="9" rx="1.5" />
            <rect x="26" y="27" width="30" height="9" rx="1.5" />
            <rect x="8" y="40" width="22" height="9" rx="1.5" />
            <rect x="34" y="40" width="22" height="9" rx="1.5" />
          </g>
        </svg>
      </span>
      <span className="leading-tight">
        <span
          className={`block font-display text-lg font-extrabold tracking-tight ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          2F Général
        </span>
        <span
          className={`block text-[10px] font-semibold uppercase tracking-[0.25em] ${
            dark ? "text-clay-300" : "text-clay-600"
          }`}
        >
          Maçonnerie
        </span>
      </span>
    </Link>
  );
}

import { Link } from "react-router-dom";

/**
 * Logo 2F Général — recréation vectorielle du logo officiel.
 * Emblème : pignon ouvert (toit), monogramme « 2F » bicolore, base en briques,
 * filet bicolore. Couleurs adaptées au fond (clair / sombre).
 */
function Emblem({ dark }: { dark: boolean }) {
  const c = dark
    ? { two: "#ffffff", f: "#d99a5c", brick: "#dcd6cc", mortar: "#1a1714", roofL: "#ffffff", roofR: "#d99a5c", base: "#ffffff" }
    : { two: "#2b2f33", f: "#b8662f", brick: "#b6b0a6", mortar: "#ffffff", roofL: "#2b2f33", roofR: "#b8662f", base: "#2b2f33" };

  return (
    <svg viewBox="0 0 120 112" className="h-11 w-auto shrink-0" role="img" aria-label="2F Général">
      {/* pignon / toiture ouverte */}
      <path d="M20 46 L60 15" fill="none" stroke={c.roofL} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 15 L100 46" fill="none" stroke={c.roofR} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      {/* monogramme 2F */}
      <text x="58" y="88" textAnchor="end" fontFamily="'Sora', system-ui, sans-serif" fontSize="62" fontWeight="800" fill={c.two}>
        2
      </text>
      <text x="60" y="88" textAnchor="start" fontFamily="'Sora', system-ui, sans-serif" fontSize="62" fontWeight="800" fill={c.f}>
        F
      </text>
      {/* base en briques */}
      <g fill={c.brick} stroke={c.mortar} strokeWidth="1.6">
        {[14, 33, 52, 71, 90].map((x) => (
          <rect key={x} x={x} y={90} width={17} height={9} rx={1} />
        ))}
      </g>
      {/* filet bicolore */}
      <line x1="11" y1="105" x2="60" y2="105" stroke={c.base} strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="105" x2="109" y2="105" stroke={c.f} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
        <Emblem dark={dark} />
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
          className={`block text-[10px] font-semibold uppercase tracking-[0.22em] ${
            dark ? "text-clay-300" : "text-clay-600"
          }`}
        >
          Maçonnerie générale
        </span>
      </span>
    </Link>
  );
}

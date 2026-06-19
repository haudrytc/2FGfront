import { ReactNode, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { useSettings } from "../lib/useSettings";

/**
 * « Chantier qui se construit au scroll ».
 * En descendant la page, une scène s'assemble étape par étape.
 *
 * Pilotable depuis l'admin (réglages) :
 *  - build_widget_enabled  : "on" | "off"
 *  - build_widget_position : "bubble-left" | "bubble-right" | "top-bar" | "inline"
 *  - build_widget_scene    : "random" | clé d'une scène (maison, piscine, …)
 */

type Part = { label: string; dir: "up" | "down" | "fade"; node: ReactNode };
type Scene = { key: string; label: string; article: string; parts: Part[] };

// Palette (alignée sur tailwind.config.js)
const CLAY = "#b8662f";
const CLAY_LIGHT = "#d09356";
const INK = "#332e2a";
const MORTAR = "#e8d9c4";

function Bricks({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const rows = Math.max(2, Math.floor(h / 12));
  const lines = [];
  for (let r = 1; r < rows; r++) {
    const ly = y + (h / rows) * r;
    lines.push(<line key={`h${r}`} x1={x} y1={ly} x2={x + w} y2={ly} />);
  }
  for (let r = 0; r < rows; r++) {
    const ry = y + (h / rows) * r;
    const off = r % 2 ? 0 : w / 6;
    for (let c = 1; c < 7; c++) {
      const lx = x + off + (w / 6) * (c - 1) + w / 12;
      if (lx > x && lx < x + w)
        lines.push(<line key={`v${r}-${c}`} x1={lx} y1={ry} x2={lx} y2={ry + h / rows} />);
    }
  }
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={1.5} fill={CLAY} />
      <g stroke={MORTAR} strokeWidth={1.4} opacity={0.85}>
        {lines}
      </g>
    </>
  );
}

const Ground = (
  <>
    <rect x={0} y={262} width={400} height={48} fill="#cdb79c" />
    <rect x={0} y={258} width={400} height={6} fill="#9fae72" />
  </>
);

const Sun = (
  <g>
    <circle cx={332} cy={66} r={20} fill="#f0c473" />
    <circle cx={332} cy={66} r={20} fill="url(#sunGlow)" />
  </g>
);

const Plant = ({ x }: { x: number }) => (
  <g>
    <rect x={x} y={238} width={20} height={22} rx={2} fill="#7c4127" />
    <path d={`M${x + 10} 238 q-12 -18 -4 -30 q10 10 4 30`} fill="#5f8a4a" />
    <path d={`M${x + 10} 238 q12 -16 6 -28 q-10 8 -6 28`} fill="#6fa256" />
  </g>
);

function Window({ x, y, w = 28, h = 26 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={1} fill="#bfe0e6" stroke={INK} strokeWidth={2} />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={INK} strokeWidth={2} />
      <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={INK} strokeWidth={2} />
    </g>
  );
}

// ---------- 1. MAISON ----------
const maison: Scene = {
  key: "maison",
  label: "Maison",
  article: "une maison",
  parts: [
    { label: "Le terrain", dir: "up", node: Ground },
    { label: "Les fondations", dir: "up", node: <rect x={122} y={246} width={156} height={16} rx={2} fill="#4a3d33" /> },
    { label: "Élévation des murs", dir: "up", node: <Bricks x={135} y={150} w={130} h={96} /> },
    {
      label: "Charpente & toiture",
      dir: "down",
      node: (
        <g>
          <polygon points="116,152 200,96 284,152" fill={INK} />
          <polygon points="200,96 284,152 272,152 200,108" fill="#241f1c" />
        </g>
      ),
    },
    {
      label: "Portes & fenêtres",
      dir: "fade",
      node: (
        <g>
          <rect x={185} y={198} width={30} height={48} rx={1} fill={INK} />
          <circle cx={208} cy={222} r={1.6} fill={CLAY_LIGHT} />
          <Window x={150} y={168} />
          <Window x={224} y={168} />
        </g>
      ),
    },
    {
      label: "Les finitions",
      dir: "down",
      node: (
        <g>
          <rect x={230} y={110} width={15} height={28} rx={1} fill="#7c4127" />
          {Sun}
        </g>
      ),
    },
  ],
};

// ---------- 2. PISCINE ----------
const piscine: Scene = {
  key: "piscine",
  label: "Piscine",
  article: "une piscine",
  parts: [
    {
      label: "Le terrassement",
      dir: "up",
      node: (
        <g>
          {Ground}
          <rect x={118} y={208} width={172} height={54} fill="#3a2f27" />
        </g>
      ),
    },
    {
      label: "La structure béton",
      dir: "up",
      node: (
        <g>
          <rect x={118} y={208} width={172} height={54} fill="#8a7f72" />
          <rect x={128} y={214} width={152} height={44} fill="#5f574c" />
        </g>
      ),
    },
    { label: "Les margelles", dir: "down", node: <rect x={110} y={202} width={188} height={10} rx={2} fill="#e4ded3" /> },
    {
      label: "Mise en eau",
      dir: "fade",
      node: (
        <g>
          <rect x={128} y={214} width={152} height={44} rx={1} fill="#3b9fb3" />
          <g stroke="#bfe6ee" strokeWidth={2} opacity={0.7} strokeLinecap="round">
            <line x1={140} y1={226} x2={170} y2={226} />
            <line x1={190} y1={236} x2={228} y2={236} />
            <line x1={150} y1={246} x2={184} y2={246} />
          </g>
        </g>
      ),
    },
    {
      label: "Les abords",
      dir: "fade",
      node: (
        <g>
          <g fill="#9a8c7b">
            <rect x={56} y={232} width={44} height={8} rx={2} />
            <rect x={56} y={214} width={10} height={22} rx={2} transform="rotate(-18 61 225)" />
          </g>
          <line x1={92} y1={196} x2={92} y2={238} stroke="#6b5d50" strokeWidth={3} />
          <path d="M70 196 Q92 178 114 196 Z" fill={CLAY} />
          <Plant x={312} />
          {Sun}
        </g>
      ),
    },
  ],
};

// ---------- 3. EXTENSION / TERRASSE ----------
const extension: Scene = {
  key: "extension",
  label: "Extension",
  article: "une extension",
  parts: [
    { label: "Le terrain", dir: "up", node: Ground },
    { label: "La dalle béton", dir: "up", node: <rect x={108} y={232} width={184} height={14} rx={1} fill="#6b5d50" /> },
    { label: "Les murs", dir: "up", node: <Bricks x={120} y={150} w={160} h={82} /> },
    {
      label: "La toiture",
      dir: "down",
      node: (
        <g>
          <rect x={110} y={136} width={180} height={16} rx={2} fill={INK} />
          <rect x={110} y={150} width={180} height={4} fill="#241f1c" />
        </g>
      ),
    },
    {
      label: "La baie vitrée",
      dir: "fade",
      node: (
        <g>
          <rect x={150} y={166} width={100} height={66} fill="#bfe0e6" stroke={INK} strokeWidth={3} />
          <line x1={200} y1={166} x2={200} y2={232} stroke={INK} strokeWidth={3} />
          <line x1={150} y1={199} x2={250} y2={199} stroke="#9fc6ce" strokeWidth={2} />
        </g>
      ),
    },
    {
      label: "La terrasse",
      dir: "up",
      node: (
        <g>
          <g fill="#a9805a" stroke="#8a6745" strokeWidth={1}>
            {[300, 322, 344, 366].map((tx) => (
              <rect key={tx} x={tx} y={244} width={20} height={16} />
            ))}
          </g>
          <Plant x={64} />
          {Sun}
        </g>
      ),
    },
  ],
};

// ---------- 4. GARAGE ----------
const garage: Scene = {
  key: "garage",
  label: "Garage",
  article: "un garage",
  parts: [
    { label: "Le terrain", dir: "up", node: Ground },
    { label: "La dalle", dir: "up", node: <rect x={88} y={234} width={224} height={14} rx={1} fill="#6b5d50" /> },
    { label: "Les murs", dir: "up", node: <Bricks x={98} y={150} w={204} h={84} /> },
    {
      label: "La toiture",
      dir: "down",
      node: (
        <g>
          <rect x={90} y={138} width={220} height={14} rx={2} fill={INK} />
          <rect x={90} y={150} width={220} height={3} fill="#241f1c" />
        </g>
      ),
    },
    {
      label: "La porte de garage",
      dir: "fade",
      node: (
        <g>
          <rect x={150} y={168} width={100} height={66} rx={2} fill="#8a7f72" stroke={INK} strokeWidth={2} />
          <g stroke="#6b6258" strokeWidth={2}>
            <line x1={150} y1={184} x2={250} y2={184} />
            <line x1={150} y1={201} x2={250} y2={201} />
            <line x1={150} y1={218} x2={250} y2={218} />
          </g>
        </g>
      ),
    },
    {
      label: "Les finitions",
      dir: "fade",
      node: (
        <g>
          <rect x={112} y={188} width={22} height={46} rx={1} fill={INK} />
          <Window x={266} y={176} w={24} h={22} />
          {Sun}
        </g>
      ),
    },
  ],
};

// ---------- 5. CLÔTURE / MUR ----------
const cloture: Scene = {
  key: "cloture",
  label: "Clôture",
  article: "une clôture",
  parts: [
    { label: "Le terrain", dir: "up", node: Ground },
    { label: "La longrine", dir: "up", node: <rect x={36} y={246} width={328} height={12} rx={1} fill="#4a3d33" /> },
    { label: "Le muret", dir: "up", node: <Bricks x={40} y={210} w={320} h={38} /> },
    {
      label: "Les piliers",
      dir: "up",
      node: (
        <g>
          <Bricks x={44} y={172} w={30} h={76} />
          <Bricks x={326} y={172} w={30} h={76} />
          <rect x={40} y={168} width={38} height={8} rx={2} fill="#7c4127" />
          <rect x={322} y={168} width={38} height={8} rx={2} fill="#7c4127" />
        </g>
      ),
    },
    {
      label: "Le portail",
      dir: "fade",
      node: (
        <g>
          <rect x={150} y={196} width={100} height={52} rx={2} fill="#6b7177" />
          <g stroke="#4d5359" strokeWidth={2}>
            {[166, 182, 198, 214, 230].map((bx) => (
              <line key={bx} x1={bx} y1={200} x2={bx} y2={244} />
            ))}
            <line x1={200} y1={196} x2={200} y2={248} strokeWidth={3} />
          </g>
        </g>
      ),
    },
    {
      label: "Les finitions",
      dir: "fade",
      node: (
        <g>
          <Plant x={92} />
          <Plant x={290} />
          {Sun}
        </g>
      ),
    },
  ],
};

// ---------- 6. PETIT IMMEUBLE ----------
const immeuble: Scene = {
  key: "immeuble",
  label: "Petit collectif",
  article: "un petit immeuble",
  parts: [
    { label: "Le terrain", dir: "up", node: Ground },
    { label: "Les fondations", dir: "up", node: <rect x={120} y={248} width={160} height={14} rx={2} fill="#4a3d33" /> },
    { label: "Le rez-de-chaussée", dir: "up", node: <Bricks x={130} y={200} w={140} h={48} /> },
    { label: "L'étage", dir: "up", node: <Bricks x={130} y={152} w={140} h={48} /> },
    {
      label: "La toiture-terrasse",
      dir: "down",
      node: (
        <g>
          <rect x={122} y={140} width={156} height={14} rx={2} fill={INK} />
          <rect x={262} y={128} width={10} height={14} fill="#7c4127" />
        </g>
      ),
    },
    {
      label: "Les fenêtres",
      dir: "fade",
      node: (
        <g>
          <Window x={142} y={160} w={26} h={24} />
          <Window x={186} y={160} w={26} h={24} />
          <Window x={232} y={160} w={26} h={24} />
          <Window x={142} y={208} w={26} h={24} />
          <Window x={232} y={208} w={26} h={24} />
          <rect x={186} y={210} width={28} height={38} rx={1} fill={INK} />
          {Sun}
        </g>
      ),
    },
  ],
};

// ---------- FINALE : les 2 frères de 2F Général félicitent (image) ----------
const Brothers = (
  <image
    href="/freres-2f.webp"
    x={0}
    y={0}
    width={400}
    height={320}
    preserveAspectRatio="xMidYMid slice"
    clipPath="url(#cardClip)"
  />
);

const FINALE: Part = { label: "Chantier livré — bravo ! 👍", dir: "fade", node: Brothers };

const SCENES: Scene[] = [maison, piscine, extension, garage, cloture, immeuble];

function BuildPart({
  progress,
  index,
  total,
  dir,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  dir: Part["dir"];
  children: ReactNode;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const end = start + seg * 0.7;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const offset = dir === "down" ? -44 : dir === "up" ? 44 : 12;
  const y = useTransform(progress, [start, end], [offset, 0]);
  return (
    <motion.g style={{ opacity, y }} className="will-change-transform">
      {children}
    </motion.g>
  );
}

export default function BuildScene() {
  const { settings } = useSettings();
  const [randomScene] = useState(() => SCENES[Math.floor(Math.random() * SCENES.length)]);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll de toute la page (modes flottants) + scroll de la section (mode intégré)
  const { scrollYProgress: pageProgress } = useScroll();
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const position = settings.build_widget_position || "bubble-left";
  const sceneKey = settings.build_widget_scene || "random";
  const scene =
    sceneKey !== "random" ? SCENES.find((s) => s.key === sceneKey) ?? randomScene : randomScene;
  // La scène se termine toujours sur les 2 frères qui félicitent (pouce en l'air).
  const parts = [...scene.parts, FINALE];
  const total = parts.length;

  const progress = position === "inline" ? sectionProgress : pageProgress;
  const [step, setStep] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    setStep(Math.min(total - 1, Math.max(0, Math.floor(v * total))));
  });
  const barWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  // Désactivé depuis l'admin → on ne rend rien.
  if (settings.build_widget_enabled === "off") return null;

  const sceneSvg = (
    <svg viewBox="0 0 400 320" className="w-full">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3ece1" />
          <stop offset="100%" stopColor="#fbf7f0" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="60%" stopColor="#f0c473" stopOpacity="0" />
          <stop offset="100%" stopColor="#f5d99a" stopOpacity="0.55" />
        </radialGradient>
        <clipPath id="cardClip">
          <rect x={0} y={0} width={400} height={320} rx={20} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={400} height={320} rx={20} fill="url(#skyGrad)" />
      {parts.map((part, i) => (
        <BuildPart key={i} progress={progress} index={i} total={total} dir={part.dir}>
          {part.node}
        </BuildPart>
      ))}
    </svg>
  );

  // ---------- BARRE EN HAUT ----------
  if (position === "top-bar") {
    return (
      <>
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1.5 bg-ink/10">
          <motion.div className="h-full bg-gradient-to-r from-clay-400 to-clay-700" style={{ width: barWidth }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pointer-events-none fixed left-1/2 top-[5.25rem] z-[55] hidden -translate-x-1/2 lg:block"
          aria-hidden="true"
        >
          <div className="flex items-center gap-2 rounded-full bg-ink/90 px-4 py-1.5 text-xs font-semibold text-white shadow-card backdrop-blur-sm ring-1 ring-white/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-clay-500" />
            </span>
            <span className="text-clay-300">Chantier</span>
            <span className="text-white/40">›</span>
            <span>{parts[step].label}</span>
            <span className="text-white/40">
              {step + 1}/{total}
            </span>
          </div>
        </motion.div>
      </>
    );
  }

  // ---------- INTÉGRÉ DANS LE SITE ----------
  if (position === "inline") {
    return (
      <section ref={sectionRef} className="relative overflow-hidden bg-ink py-20 sm:py-28">
        <div className="bg-grit absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,rgba(184,102,47,0.18),transparent_70%)]" />
        <div className="container-page relative z-10 mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center !text-clay-300">Notre métier en mouvement</span>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            On bâtit {scene.article} sous vos yeux
          </h2>
          <p className="mt-3 text-sm text-white/60">Au fil de votre lecture, le chantier prend forme.</p>
          <div className="mx-auto mt-6 max-w-xl">{sceneSvg}</div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-clay-600 text-xs font-bold text-white">
              {step + 1}
            </span>
            <span className="font-display text-lg font-bold text-white">{parts[step].label}</span>
            <span className="text-sm text-white/40">/ {total}</span>
          </div>
          <div className="mx-auto mt-4 h-1.5 w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full bg-clay-500" style={{ width: barWidth }} />
          </div>
        </div>
      </section>
    );
  }

  // ---------- BULLE FLOTTANTE (gauche / droite) ----------
  const side = position === "bubble-right" ? "right-5" : "left-5";
  return (
    <motion.aside
      initial={{ opacity: 0, x: position === "bubble-right" ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`pointer-events-none fixed bottom-5 z-40 hidden w-52 lg:block ${side}`}
      aria-hidden="true"
    >
      <div className="overflow-hidden rounded-2xl bg-ink/90 p-3 shadow-card ring-1 ring-white/10 backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-clay-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-clay-500" />
            </span>
            Chantier en cours
          </span>
        </div>
        {sceneSvg}
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="truncate text-xs font-semibold text-white">{parts[step].label}</span>
          <span className="shrink-0 text-[10px] text-white/40">
            {step + 1}/{total}
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-clay-500" style={{ width: barWidth }} />
        </div>
      </div>
    </motion.aside>
  );
}

// Liste exportée pour l'administration (clé → libellé).
export const BUILD_SCENES = SCENES.map((s) => ({ value: s.key, label: s.label }));

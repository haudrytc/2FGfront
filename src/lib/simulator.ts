import type { Settings } from "./types";

/**
 * Configuration du mini-simulateur de devis (estimation « à la louche »,
 * sans engagement). Stockée en JSON dans le réglage `simulator_config`,
 * éditable depuis l'admin.
 */

export type SimUnit = "m²" | "ml" | "u" | "projet";

/** Où afficher le simulateur sur le site. */
export type SimPlacement = "home" | "contact" | "page" | "none";

export const PLACEMENT_LABELS: Record<SimPlacement, string> = {
  home: "Page d'accueil",
  contact: "Page Contact / Devis",
  page: "Page dédiée (avec menu)",
  none: "Nulle part (masqué)",
};

export interface SimItem {
  id: string;
  label: string;
  unit: SimUnit;
  min: number; // prix mini par unité (€)
  max: number; // prix maxi par unité (€)
  icon: string; // nom d'icône lucide-react
  hint?: string;
}

export interface SimFinish {
  id: string;
  label: string;
  factor: number;
}

export interface SimConfig {
  placement: SimPlacement;
  finishes: SimFinish[];
  items: SimItem[];
}

export const DEFAULT_SIM: SimConfig = {
  placement: "home",
  finishes: [
    { id: "essentiel", label: "Essentiel", factor: 0.9 },
    { id: "standard", label: "Standard", factor: 1 },
    { id: "premium", label: "Haut de gamme", factor: 1.3 },
  ],
  items: [
    { id: "construction", label: "Construction maison (gros œuvre)", unit: "m²", min: 450, max: 750, icon: "Home", hint: "Surface habitable" },
    { id: "extension", label: "Extension / surélévation", unit: "m²", min: 1400, max: 2400, icon: "Building2", hint: "Surface à ajouter" },
    { id: "renovation", label: "Rénovation", unit: "m²", min: 300, max: 800, icon: "Hammer", hint: "Surface à rénover" },
    { id: "dalle", label: "Dalle béton / terrasse", unit: "m²", min: 60, max: 130, icon: "Grid3x3", hint: "Surface au sol" },
    { id: "carrelage", label: "Carrelage & faïence", unit: "m²", min: 40, max: 95, icon: "Grid2x2", hint: "Surface à poser" },
    { id: "facade", label: "Façade / ravalement / enduit", unit: "m²", min: 30, max: 70, icon: "PaintRoller", hint: "Surface de façade" },
    { id: "platrerie", label: "Plâtrerie & peinture", unit: "m²", min: 35, max: 80, icon: "Brush", hint: "Surface concernée" },
    { id: "cloture", label: "Muret / clôture", unit: "ml", min: 90, max: 190, icon: "Fence", hint: "Longueur en mètres" },
    { id: "piscine", label: "Piscine maçonnée (béton)", unit: "projet", min: 18000, max: 38000, icon: "Waves", hint: "Bassin standard" },
  ],
};

/** Lit la config du simulateur depuis les réglages (avec repli sur les valeurs par défaut). */
export function parseSimConfig(settings: Settings): SimConfig {
  const raw = settings.simulator_config;
  if (!raw) return DEFAULT_SIM;
  try {
    const parsed = JSON.parse(raw) as Partial<SimConfig> & { enabled?: boolean };
    // Migration depuis l'ancien champ `enabled`.
    const placement: SimPlacement =
      parsed.placement ?? (parsed.enabled === false ? "none" : "home");
    return {
      placement,
      finishes: parsed.finishes?.length ? parsed.finishes : DEFAULT_SIM.finishes,
      items: parsed.items?.length ? parsed.items : DEFAULT_SIM.items,
    };
  } catch {
    return DEFAULT_SIM;
  }
}

/** Arrondit un montant à la centaine la plus proche pour un affichage « à la louche ». */
export function roundPrice(value: number): number {
  if (value >= 10000) return Math.round(value / 500) * 500;
  if (value >= 1000) return Math.round(value / 100) * 100;
  return Math.round(value / 10) * 10;
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value) + " €";
}

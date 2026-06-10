import {
  Hammer,
  BrickWall,
  Building2,
  PaintRoller,
  Grid3x3,
  TreePine,
  Wrench,
  Ruler,
  HardHat,
  Truck,
  LucideProps,
  LucideIcon,
} from "lucide-react";

// Map explicite (évite d'embarquer toute la librairie d'icônes dans le bundle).
const MAP: Record<string, LucideIcon> = {
  Hammer,
  BrickWall,
  Building2,
  PaintRoller,
  Grid3x3,
  TreePine,
  Wrench,
  Ruler,
  HardHat,
  Truck,
};

export const ICON_NAMES = Object.keys(MAP);

/** Affiche une icône lucide à partir de son nom (repli sur Hammer). */
export default function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = MAP[name] ?? Hammer;
  return <Cmp {...props} />;
}

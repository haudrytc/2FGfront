import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calculator, ArrowRight, Info } from "lucide-react";
import { useSettings } from "../lib/useSettings";
import { parseSimConfig, roundPrice, formatEuro, type SimPlacement } from "../lib/simulator";
import Icon from "./Icon";
import Reveal from "./Reveal";

/**
 * Mini-simulateur de devis « à la louche » (sans engagement).
 * Activable / configurable depuis l'admin (réglage `simulator_config`).
 *
 * - `where` : emplacement courant ; le simulateur s'affiche si la config le cible.
 * - `force` : affichage inconditionnel (utilisé par la page dédiée /devis).
 */
export default function PriceSimulator({
  where,
  force = false,
}: {
  where?: SimPlacement;
  force?: boolean;
}) {
  const { settings } = useSettings();
  const config = useMemo(() => parseSimConfig(settings), [settings]);

  const [itemId, setItemId] = useState(config.items[0]?.id ?? "");
  const [qty, setQty] = useState(100);
  const [finishId, setFinishId] = useState(config.finishes[1]?.id ?? config.finishes[0]?.id ?? "");

  if (config.items.length === 0) return null;
  if (!force && config.placement !== where) return null;

  const item = config.items.find((i) => i.id === itemId) ?? config.items[0];
  const finish = config.finishes.find((f) => f.id === finishId) ?? config.finishes[0];
  const isProject = item.unit === "projet";
  const quantity = isProject ? 1 : Math.max(1, qty || 0);
  const factor = finish?.factor ?? 1;

  const low = roundPrice(item.min * quantity * factor);
  const high = roundPrice(item.max * quantity * factor);

  return (
    <section id="simulateur" className="bg-white py-24">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            <Calculator size={14} /> Estimez votre budget
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
            Simulateur de devis en ligne
          </h2>
          <p className="mt-4 text-ink/60">
            Une estimation immédiate et <strong>sans engagement</strong> pour vous donner un ordre
            d'idée. Le prix exact dépend de votre projet : demandez un devis gratuit et précis.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-ink/10 bg-sand-50 shadow-card">
          <div className="grid lg:grid-cols-5">
            {/* Configurateur */}
            <div className="p-6 sm:p-8 lg:col-span-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-clay-600">
                1. Votre prestation
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {config.items.map((it) => {
                  const on = it.id === item.id;
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => setItemId(it.id)}
                      className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition ${
                        on
                          ? "border-clay-500 bg-clay-50 text-clay-800 shadow-soft"
                          : "border-ink/10 bg-white text-ink/70 hover:border-clay-300"
                      }`}
                    >
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-lg ${
                          on ? "bg-clay-600 text-white" : "bg-sand-100 text-clay-600"
                        }`}
                      >
                        <Icon name={it.icon} size={18} />
                      </span>
                      <span className="text-xs font-semibold leading-tight">{it.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quantité */}
              {!isProject && (
                <div className="mt-7">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-clay-600">
                    2. {item.hint || "Quantité"}{" "}
                    <span className="text-ink/40">({item.unit})</span>
                  </h3>
                  <div className="mt-3 flex items-center gap-4">
                    <input
                      type="range"
                      min={item.unit === "ml" ? 5 : 10}
                      max={item.unit === "ml" ? 200 : 400}
                      step={item.unit === "ml" ? 1 : 5}
                      value={Math.min(qty, item.unit === "ml" ? 200 : 400)}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-ink/10 accent-clay-600"
                    />
                    <div className="flex items-center gap-1.5 rounded-xl border border-ink/15 bg-white px-3 py-2">
                      <input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="w-16 bg-transparent text-right font-bold text-ink outline-none"
                      />
                      <span className="text-sm font-semibold text-ink/50">{item.unit}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Finition */}
              <div className="mt-7">
                <h3 className="text-sm font-bold uppercase tracking-widest text-clay-600">
                  {isProject ? "2." : "3."} Niveau de finition
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {config.finishes.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFinishId(f.id)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        f.id === finish?.id
                          ? "bg-clay-600 text-white shadow-soft"
                          : "bg-white text-ink/60 ring-1 ring-ink/10 hover:ring-clay-300"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Résultat */}
            <div className="flex flex-col justify-between bg-ink bg-grit p-6 text-white sm:p-8 lg:col-span-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-clay-300">
                  Estimation indicative
                </p>
                <motion.div
                  key={`${low}-${high}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-4"
                >
                  <div className="text-3xl font-extrabold leading-tight sm:text-4xl">
                    {formatEuro(low)}
                  </div>
                  <div className="text-clay-300">à {formatEuro(high)}</div>
                </motion.div>
                <p className="mt-3 text-xs text-white/50">
                  {item.label}
                  {!isProject ? ` · ${quantity} ${item.unit}` : " · projet sur mesure"} ·{" "}
                  {finish?.label}
                </p>

                <p className="mt-6 flex items-start gap-2 text-xs text-white/60">
                  <Info size={14} className="mt-0.5 shrink-0 text-clay-300" />
                  Fourchette indicative, hors options, accès et conditions de chantier. Sans valeur
                  contractuelle.
                </p>
              </div>

              <Link to="/contact" className="btn-primary mt-8 w-full">
                Demander un devis gratuit <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
